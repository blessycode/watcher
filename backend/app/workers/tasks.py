from datetime import UTC, datetime, timedelta
from uuid import UUID

from app.db.database import SessionLocal
from app.models import Monitor
from app.services.monitoring import run_monitor_check
from app.workers.celery_app import celery_app


@celery_app.task(name="app.workers.tasks.check_monitor")
def check_monitor(monitor_id: str) -> dict:
    db = SessionLocal()
    try:
        check = run_monitor_check(db, UUID(monitor_id))
        return {"monitor_id": str(check.monitor_id), "check_id": str(check.id), "success": check.success}
    finally:
        db.close()


@celery_app.task(name="app.workers.tasks.dispatch_due_monitor_checks")
def dispatch_due_monitor_checks() -> dict:
    db = SessionLocal()
    dispatched = 0
    try:
        now = datetime.now(UTC)
        monitors = db.query(Monitor).filter(Monitor.is_active.is_(True)).all()
        for monitor in monitors:
            due_at = (monitor.last_checked_at or datetime.min.replace(tzinfo=UTC)) + timedelta(seconds=monitor.interval_seconds)
            if due_at <= now:
                check_monitor.delay(str(monitor.id))
                dispatched += 1
        return {"dispatched": dispatched}
    finally:
        db.close()
