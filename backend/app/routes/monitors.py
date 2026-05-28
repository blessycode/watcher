from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.db.database import get_db
from app.models import Check, Monitor, MonitorHeader, Project, User
from app.schemas.check import CheckRead
from app.schemas.common import DeleteResponse
from app.schemas.monitor import MonitorCreate, MonitorRead, MonitorUpdate
from app.services.monitoring import run_monitor_check
from app.utils.crypto import encrypt_value
from app.utils.network import validate_monitor_url
from app.utils.security import get_current_user


router = APIRouter(prefix="/monitors", tags=["monitors"])


def owned_monitor_query(db: Session, user: User):
    return db.query(Monitor).join(Project).filter(Project.user_id == user.id)


def get_owned_monitor(db: Session, monitor_id: UUID, user: User) -> Monitor:
    monitor = (
        owned_monitor_query(db, user)
        .options(selectinload(Monitor.headers))
        .filter(Monitor.id == monitor_id)
        .first()
    )
    if monitor is None:
        raise HTTPException(status_code=404, detail="Monitor not found")
    return monitor


def ensure_owned_project(db: Session, project_id: UUID, user: User) -> Project:
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user.id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


def apply_headers(monitor: Monitor, payload_headers: list):
    monitor.headers = [
        MonitorHeader(
            header_key=header.header_key,
            encrypted_value=encrypt_value(header.encrypted_value),
            is_secret=header.is_secret,
        )
        for header in payload_headers
    ]


@router.get("", response_model=list[MonitorRead])
def get_monitors(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (
        owned_monitor_query(db, current_user)
        .options(selectinload(Monitor.headers))
        .order_by(Monitor.created_at.desc())
        .all()
    )


@router.post("", response_model=MonitorRead, status_code=status.HTTP_201_CREATED)
def create_monitor(payload: MonitorCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ensure_owned_project(db, payload.project_id, current_user)
    validate_monitor_url(payload.url)
    data = payload.model_dump(exclude={"headers"})
    monitor = Monitor(**data, status="unknown" if payload.is_active else "paused")
    apply_headers(monitor, payload.headers)
    db.add(monitor)
    db.commit()
    db.refresh(monitor)
    return monitor


@router.get("/{monitor_id}", response_model=MonitorRead)
def get_monitor(monitor_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_owned_monitor(db, monitor_id, current_user)


@router.put("/{monitor_id}", response_model=MonitorRead)
def update_monitor(monitor_id: UUID, payload: MonitorUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    monitor = get_owned_monitor(db, monitor_id, current_user)
    data = payload.model_dump(exclude_unset=True, exclude={"headers"})
    if "project_id" in data:
        ensure_owned_project(db, data["project_id"], current_user)
    if "url" in data:
        validate_monitor_url(data["url"])
    for key, value in data.items():
        setattr(monitor, key, value)
    if payload.headers is not None:
        apply_headers(monitor, payload.headers)
    if payload.is_active is not None:
        monitor.status = "unknown" if payload.is_active else "paused"
    db.commit()
    db.refresh(monitor)
    return monitor


@router.delete("/{monitor_id}", response_model=DeleteResponse)
def delete_monitor(monitor_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    monitor = get_owned_monitor(db, monitor_id, current_user)
    db.delete(monitor)
    db.commit()
    return DeleteResponse(id=monitor_id)


@router.post("/{monitor_id}/check-now", response_model=CheckRead, status_code=status.HTTP_201_CREATED)
def check_now(monitor_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_monitor(db, monitor_id, current_user)
    try:
        return run_monitor_check(db, monitor_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{monitor_id}/checks", response_model=list[CheckRead])
def get_monitor_checks(monitor_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_monitor(db, monitor_id, current_user)
    return db.query(Check).filter(Check.monitor_id == monitor_id).order_by(Check.checked_at.desc()).limit(500).all()


@router.get("/{monitor_id}/analytics")
def get_monitor_analytics(monitor_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    monitor = get_owned_monitor(db, monitor_id, current_user)
    checks = db.query(Check).filter(Check.monitor_id == monitor_id).all()
    total = len(checks)
    failures = len([check for check in checks if not check.success])
    latencies = [check.latency_ms for check in checks if check.latency_ms is not None]
    return {
        "monitor_id": str(monitor.id),
        "total_checks": total,
        "failed_checks": failures,
        "uptime_percentage": 100 if total == 0 else round(((total - failures) / total) * 100, 2),
        "avg_latency_ms": 0 if not latencies else round(sum(latencies) / len(latencies), 2),
        "checks": checks,
    }
