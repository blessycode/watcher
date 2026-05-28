from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models import AlertChannel, Monitor, Project, StatusPage, User
from app.services.monitoring import run_monitor_check
from app.utils.security import get_current_user


router = APIRouter(prefix="/onboarding", tags=["onboarding"])


@router.post("/bootstrap")
def bootstrap_workspace(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.user_id == current_user.id).first()
    created = {"projects": 0, "monitors": 0, "alert_channels": 0, "status_pages": 0, "checks": 0}

    if project is None:
        project = Project(
            user_id=current_user.id,
            name="Production APIs",
            slug=f"production-apis-{str(current_user.id)[:8]}",
            description="Primary customer-facing APIs monitored by Watcher.",
            environment="production",
        )
        db.add(project)
        db.flush()
        created["projects"] += 1

    if db.query(AlertChannel).filter(AlertChannel.user_id == current_user.id).count() == 0:
        db.add(AlertChannel(user_id=current_user.id, type="email", destination=current_user.email, is_verified=True))
        created["alert_channels"] += 1

    if db.query(StatusPage).filter(StatusPage.project_id == project.id).count() == 0:
        db.add(
            StatusPage(
                project_id=project.id,
                name="Production Status",
                slug=f"production-status-{str(current_user.id)[:8]}",
                is_public=True,
                overall_status="operational",
            )
        )
        created["status_pages"] += 1

    if db.query(Monitor).filter(Monitor.project_id == project.id).count() == 0:
        monitors = [
            Monitor(
                project_id=project.id,
                name="Example Website",
                url="https://example.com",
                method="GET",
                expected_status=200,
                interval_seconds=60,
                timeout_seconds=10,
                region="local",
                is_active=True,
                status="unknown",
            ),
            Monitor(
                project_id=project.id,
                name="HTTPBin Health",
                url="https://httpbin.org/status/200",
                method="GET",
                expected_status=200,
                interval_seconds=60,
                timeout_seconds=10,
                region="local",
                is_active=True,
                status="unknown",
            ),
        ]
        db.add_all(monitors)
        db.flush()
        created["monitors"] += len(monitors)
        monitor_ids = [monitor.id for monitor in monitors]
    else:
        monitor_ids = [row[0] for row in db.query(Monitor.id).filter(Monitor.project_id == project.id).limit(2).all()]

    db.commit()

    for monitor_id in monitor_ids:
        try:
            run_monitor_check(db, monitor_id)
            created["checks"] += 1
        except Exception:
            continue

    return {"ok": True, "created": created}
