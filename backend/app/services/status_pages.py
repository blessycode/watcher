from sqlalchemy.orm import Session

from app.models import Monitor, StatusPage


def rollup_project_status(db: Session, project_id) -> str:
    statuses = [row[0] for row in db.query(Monitor.status).filter(Monitor.project_id == project_id).all()]
    if not statuses:
        return "operational"
    if any(status == "down" for status in statuses):
        return "major_outage"
    if any(status == "degraded" for status in statuses):
        return "partial_outage"
    if any(status == "unknown" for status in statuses):
        return "degraded"
    return "operational"


def update_status_pages_for_project(db: Session, project_id) -> None:
    overall_status = rollup_project_status(db, project_id)
    pages = db.query(StatusPage).filter(StatusPage.project_id == project_id).all()
    for page in pages:
        page.overall_status = overall_status
