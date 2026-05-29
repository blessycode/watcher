from uuid import UUID

from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models import AlertChannel, User
from app.schemas.alert import AlertChannelCreate, AlertChannelRead, AlertChannelUpdate
from app.schemas.common import DeleteResponse
from app.utils.security import get_current_user


router = APIRouter(prefix="/alert-channels", tags=["alert channels"])


def get_owned_channel(db: Session, channel_id: UUID, user: User) -> AlertChannel:
    channel = db.query(AlertChannel).filter(AlertChannel.id == channel_id, AlertChannel.user_id == user.id).first()
    if channel is None:
        raise HTTPException(status_code=404, detail="Alert channel not found")
    return channel


@router.get("", response_model=list[AlertChannelRead])
def get_alert_channels(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(AlertChannel).filter(AlertChannel.user_id == current_user.id).order_by(AlertChannel.created_at.desc()).all()


@router.post("", response_model=AlertChannelRead, status_code=status.HTTP_201_CREATED)
def create_alert_channel(payload: AlertChannelCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    channel = AlertChannel(**payload.model_dump(), user_id=current_user.id)
    db.add(channel)
    db.commit()
    db.refresh(channel)
    return channel


@router.put("/{channel_id}", response_model=AlertChannelRead)
def update_alert_channel(channel_id: UUID, payload: AlertChannelUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    channel = get_owned_channel(db, channel_id, current_user)
    data = payload.model_dump(exclude_unset=True)
    next_type = data.get("type", channel.type)
    next_destination = data.get("destination", channel.destination)
    if next_type == "email" and "@" not in next_destination:
        raise HTTPException(status_code=422, detail="Email alert destinations must be valid email addresses")
    for key, value in data.items():
        setattr(channel, key, value)
    db.commit()
    db.refresh(channel)
    return channel


@router.delete("/{channel_id}", response_model=DeleteResponse)
def delete_alert_channel(channel_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    channel = get_owned_channel(db, channel_id, current_user)
    db.delete(channel)
    db.commit()
    return DeleteResponse(id=channel_id)


@router.post("/{channel_id}/test")
def test_alert_channel(channel_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    channel = get_owned_channel(db, channel_id, current_user)
    channel.last_triggered_at = datetime.now(UTC)
    db.commit()
    return {"id": channel.id, "status": "sent", "sent_at": channel.last_triggered_at}
