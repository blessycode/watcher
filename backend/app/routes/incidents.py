from datetime import UTC, datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models import Incident, Monitor, Project, User
from app.schemas.incident import IncidentRead, IncidentResolve, IncidentUpdate
from app.services.alerts import trigger_incident_alerts
from app.utils.security import get_current_user


router = APIRouter(prefix="/incidents", tags=["incidents"])


def owned_incident_query(db: Session, user: User):
    return db.query(Incident).join(Monitor).join(Project).filter(Project.user_id == user.id)


def get_owned_incident(db: Session, incident_id: UUID, user: User) -> Incident:
    incident = owned_incident_query(db, user).filter(Incident.id == incident_id).first()
    if incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident


@router.get("", response_model=list[IncidentRead])
def get_incidents(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return owned_incident_query(db, current_user).order_by(Incident.started_at.desc()).all()


@router.get("/{incident_id}", response_model=IncidentRead)
def get_incident(incident_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_owned_incident(db, incident_id, current_user)


@router.put("/{incident_id}", response_model=IncidentRead)
def update_incident(incident_id: UUID, payload: IncidentUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    incident = get_owned_incident(db, incident_id, current_user)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(incident, key, value)
    db.commit()
    db.refresh(incident)
    return incident


@router.put("/{incident_id}/resolve", response_model=IncidentRead)
def resolve_incident(incident_id: UUID, payload: IncidentResolve | None = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    incident = get_owned_incident(db, incident_id, current_user)
    incident.status = "resolved"
    incident.resolved_at = datetime.now(UTC)
    if payload and payload.root_cause:
        incident.root_cause = payload.root_cause
    trigger_incident_alerts(db, incident, "resolved")
    db.commit()
    db.refresh(incident)
    return incident
 