from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models import Check, Monitor, Project, User
from app.utils.security import get_current_user


router = APIRouter(prefix="/checks", tags=["checks"])


@router.get("")
def list_check_logs(
    monitor_id: UUID | None = None,
    region: str | None = None,
    success: bool | None = None,
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(Check, Monitor, Project)
        .join(Monitor, Check.monitor_id == Monitor.id)
        .join(Project, Monitor.project_id == Project.id)
        .filter(Project.user_id == current_user.id)
    )
    if monitor_id:
        query = query.filter(Check.monitor_id == monitor_id)
    if region:
        query = query.filter(Check.region == region)
    if success is not None:
        query = query.filter(Check.success == success)

    rows = query.order_by(Check.checked_at.desc()).limit(limit).all()
    return [
        {
            "id": check.id,
            "monitor_id": check.monitor_id,
            "monitor_name": monitor.name,
            "project_id": project.id,
            "project_name": project.name,
            "status_code": check.status_code,
            "success": check.success,
            "latency_ms": check.latency_ms,
            "error_message": check.error_message,
            "region": check.region,
            "checked_at": check.checked_at,
        }
        for check, monitor, project in rows
    ]
