from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.db.database import get_db
from app.models import Incident, Monitor, Project, StatusPage, User
from app.schemas.common import DeleteResponse
from app.schemas.status_page import PublicStatusPage, StatusPageCreate, StatusPageRead, StatusPageUpdate
from app.utils.security import get_current_user


router = APIRouter(tags=["status pages"])


def owned_page_query(db: Session, user: User):
    return db.query(StatusPage).join(Project).filter(Project.user_id == user.id)


def get_owned_page(db: Session, page_id: UUID, user: User) -> StatusPage:
    page = owned_page_query(db, user).filter(StatusPage.id == page_id).first()
    if page is None:
        raise HTTPException(status_code=404, detail="Status page not found")
    return page


def ensure_project(db: Session, project_id: UUID, user: User) -> Project:
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user.id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.get("/status-pages", response_model=list[StatusPageRead])
def get_status_pages(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return owned_page_query(db, current_user).order_by(StatusPage.created_at.desc()).all()


@router.post("/status-pages", response_model=StatusPageRead, status_code=status.HTTP_201_CREATED)
def create_status_page(payload: StatusPageCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ensure_project(db, payload.project_id, current_user)
    if db.query(StatusPage).filter(StatusPage.slug == payload.slug).first():
        raise HTTPException(status_code=409, detail="Status page slug already exists")
    page = StatusPage(**payload.model_dump())
    db.add(page)
    db.commit()
    db.refresh(page)
    return page


@router.get("/status-pages/{page_id}", response_model=StatusPageRead)
def get_status_page(page_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_owned_page(db, page_id, current_user)


@router.put("/status-pages/{page_id}", response_model=StatusPageRead)
def update_status_page(page_id: UUID, payload: StatusPageUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    page = get_owned_page(db, page_id, current_user)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(page, key, value)
    db.commit()
    db.refresh(page)
    return page


@router.delete("/status-pages/{page_id}", response_model=DeleteResponse)
def delete_status_page(page_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    page = get_owned_page(db, page_id, current_user)
    db.delete(page)
    db.commit()
    return DeleteResponse(id=page_id)


@router.get("/status/{slug}", response_model=PublicStatusPage)
def public_status(slug: str, db: Session = Depends(get_db)):
    page = (
        db.query(StatusPage)
        .options(selectinload(StatusPage.project).selectinload(Project.monitors).selectinload(Monitor.headers))
        .filter(StatusPage.slug == slug, StatusPage.is_public.is_(True))
        .first()
    )
    if page is None:
        raise HTTPException(status_code=404, detail="Status page not found")
    monitors = db.query(Monitor).options(selectinload(Monitor.headers)).filter(Monitor.project_id == page.project_id).all()
    incidents = (
        db.query(Incident)
        .join(Monitor)
        .filter(Monitor.project_id == page.project_id)
        .order_by(Incident.started_at.desc())
        .limit(20)
        .all()
    )
    return {"page": page, "monitors": monitors, "incidents": incidents}
