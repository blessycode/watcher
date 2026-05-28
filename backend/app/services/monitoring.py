from datetime import UTC, datetime
from time import perf_counter

import httpx
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload

from app.models import Check, Incident, Monitor
from app.services.alerts import trigger_incident_alerts
from app.utils.crypto import decrypt_value
from app.utils.network import validate_monitor_url


def headers_for_monitor(monitor: Monitor) -> dict[str, str]:
    return {header.header_key: decrypt_value(header.encrypted_value) for header in monitor.headers}


def consecutive_failures(db: Session, monitor_id) -> int:
    checks = (
        db.query(Check)
        .filter(Check.monitor_id == monitor_id)
        .order_by(Check.checked_at.desc())
        .limit(3)
        .all()
    )
    count = 0
    for check in checks:
        if check.success:
            break
        count += 1
    return count


def open_incident(db: Session, monitor_id):
    return (
        db.query(Incident)
        .filter(Incident.monitor_id == monitor_id, Incident.status != "resolved")
        .order_by(Incident.started_at.desc())
        .first()
    )


def refresh_monitor_stats(db: Session, monitor: Monitor, failed_count: int) -> None:
    total = db.query(Check).filter(Check.monitor_id == monitor.id).count()
    successes = db.query(Check).filter(Check.monitor_id == monitor.id, Check.success.is_(True)).count()
    avg_latency = db.query(func.avg(Check.latency_ms)).filter(Check.monitor_id == monitor.id).scalar() or 0
    monitor.uptime_percentage = round((successes / total) * 100, 2) if total else 100.0
    monitor.avg_latency_ms = round(float(avg_latency), 2)
    if failed_count >= 3:
        monitor.status = "down"
    elif failed_count == 1:
        monitor.status = "degraded"
    else:
        monitor.status = "operational"


def run_monitor_check(db: Session, monitor_id) -> Check:
    monitor = (
        db.query(Monitor)
        .options(selectinload(Monitor.headers))
        .filter(Monitor.id == monitor_id)
        .first()
    )
    if monitor is None:
        raise ValueError("Monitor not found")

    status_code = None
    latency_ms = None
    error_message = None
    success = False
    started = perf_counter()
    try:
        validate_monitor_url(monitor.url)
        response = httpx.request(
            monitor.method,
            monitor.url,
            headers=headers_for_monitor(monitor),
            timeout=monitor.timeout_seconds,
            follow_redirects=True,
        )
        latency_ms = round((perf_counter() - started) * 1000, 2)
        status_code = response.status_code
        success = status_code == monitor.expected_status
        if not success:
            error_message = f"Expected {monitor.expected_status}, got {status_code}"
    except Exception as exc:
        latency_ms = round((perf_counter() - started) * 1000, 2)
        error_message = str(exc)[:1000]

    checked_at = datetime.now(UTC)
    check = Check(
        monitor_id=monitor.id,
        status_code=status_code,
        success=success,
        latency_ms=latency_ms,
        error_message=error_message,
        region=monitor.region,
        checked_at=checked_at,
    )
    db.add(check)
    db.flush()

    failed_count = consecutive_failures(db, monitor.id)
    monitor.last_checked_at = checked_at
    refresh_monitor_stats(db, monitor, failed_count)

    incident = open_incident(db, monitor.id)
    if failed_count >= 3 and incident is None:
        incident = Incident(
            monitor_id=monitor.id,
            title=f"{monitor.name} is down",
            status="investigating",
            severity="high",
            reason=error_message or "Three consecutive checks failed",
            started_at=checked_at,
        )
        db.add(incident)
        db.flush()
        trigger_incident_alerts(db, incident, "opened")
    elif success and incident is not None:
        incident.status = "resolved"
        incident.resolved_at = checked_at
        incident.root_cause = incident.root_cause or "Monitor recovered after a successful check"
        trigger_incident_alerts(db, incident, "resolved")

    db.commit()
    db.refresh(check)
    return check
