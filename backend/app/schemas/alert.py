from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.common import ORMModel


class AlertChannelCreate(BaseModel):
    type: str = Field(pattern=r"^(email|slack|discord|webhook|telegram)$")
    destination: str = Field(min_length=1, max_length=500)


class AlertChannelUpdate(BaseModel):
    type: str | None = Field(default=None, pattern=r"^(email|slack|discord|webhook|telegram)$")
    destination: str | None = Field(default=None, min_length=1, max_length=500)
    is_verified: bool | None = None
    is_active: bool | None = None


class AlertChannelRead(ORMModel):
    id: UUID
    user_id: UUID
    type: str
    destination: str
    is_verified: bool
    is_active: bool
    last_triggered_at: datetime | None
    created_at: datetime


class AlertRead(ORMModel):
    id: UUID
    incident_id: UUID
    channel: str
    recipient: str
    status: str
    sent_at: datetime | None
