from datetime import UTC, datetime, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import Check, Incident, Monitor, Project


def user_monitor_ids(db: Session, user_id) -> list:
    return [row[0] for row in db.query(Monitor.id).join(Project).filter(Project.user_id == user_id).all()]


def overview(db: Session, user_id) -> dict:
    monitor_ids = user_monitor_ids(db, user_id)
    active_monitors = db.query(Monitor).join(Project).filter(Project.user_id == user_id, Monitor.is_active.is_(True)).count()
    if not monitor_ids:
        return {"overall_uptime": 100.0, "active_monitors": 0, "failed_checks": 0, "avg_latency_ms": 0, "open_incidents": 0}
    checks = db.query(Check).filter(Check.monitor_id.in_(monitor_ids))
    total_checks = checks.count()
    failed_checks = checks.filter(Check.success.is_(False)).count()
    avg_latency = checks.with_entities(func.avg(Check.latency_ms)).scalar() or 0
    open_incidents = db.query(Incident).filter(Incident.monitor_id.in_(monitor_ids), Incident.status != "resolved").count()
    return {
        "overall_uptime": round(((total_checks - failed_checks) / total_checks) * 100, 2) if total_checks else 100.0,
        "active_monitors": active_monitors,
        "failed_checks": failed_checks,
        "avg_latency_ms": round(float(avg_latency), 2),
        "open_incidents": open_incidents,
    }


def trend(db: Session, user_id) -> list[dict]:
    monitor_ids = user_monitor_ids(db, user_id)
    now = datetime.now(UTC)
    points = []
    for index in range(13, -1, -1):
        day = (now - timedelta(days=index)).date()
        day_checks = db.query(Check).filter(Check.monitor_id.in_(monitor_ids), func.date(Check.checked_at) == day)
        total = day_checks.count()
        failures = day_checks.filter(Check.success.is_(False)).count()
        avg_latency = day_checks.with_entities(func.avg(Check.latency_ms)).scalar() or 0
        points.append(
            {
                "date": day.isoformat(),
                "uptime_percentage": round(((total - failures) / total) * 100, 2) if total else 100.0,
                "avg_latency_ms": round(float(avg_latency), 2),
                "failed_checks": failures,
                "total_checks": total,
            }
        )
    return points


def incident_frequency(db: Session, user_id) -> dict:
    monitor_ids = user_monitor_ids(db, user_id)
    rows = (
        db.query(func.date(Incident.started_at), func.count(Incident.id))
        .filter(Incident.monitor_id.in_(monitor_ids))
        .group_by(func.date(Incident.started_at))
        .order_by(func.date(Incident.started_at))
        .all()
    )
    return {"incident_frequency": [{"date": str(day), "count": count} for day, count in rows]}


def error_report(db: Session, user_id) -> dict:
    monitor_ids = user_monitor_ids(db, user_id)
    checks = db.query(Check).filter(Check.monitor_id.in_(monitor_ids))
    total = checks.count()
    failures = checks.filter(Check.success.is_(False)).count()
    failures_by_region = (
        checks.filter(Check.success.is_(False))
        .with_entities(Check.region, func.count(Check.id))
        .group_by(Check.region)
        .all()
    )
    slowest = (
        db.query(Monitor.id, Monitor.name, func.avg(Check.latency_ms).label("avg_latency_ms"))
        .join(Check)
        .filter(Monitor.id.in_(monitor_ids))
        .group_by(Monitor.id, Monitor.name)
        .order_by(func.avg(Check.latency_ms).desc())
        .limit(10)
        .all()
    )
    return {
        "error_rate": round((failures / total) * 100, 2) if total else 0,
        "failures_by_region": [{"region": region, "failures": count} for region, count in failures_by_region],
        "slowest_endpoints": [
            {"monitor_id": str(monitor_id), "name": name, "avg_latency_ms": round(float(latency or 0), 2)}
            for monitor_id, name, latency in slowest
        ],
        "sla_summary": {"target": 99.9, "actual": overview(db, user_id)["overall_uptime"]},
    }
