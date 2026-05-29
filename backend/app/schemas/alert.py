from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field, field_validator, model_validator

from app.schemas.common import ORMModel
from app.schemas.validators import AlertChannelType, validate_http_url, validate_non_empty_update


class AlertChannelCreate(BaseModel):
    type: AlertChannelType
    destination: str = Field(min_length=1, max_length=500)

    @field_validator("destination", mode="before")
    @classmethod
    def strip_destination(cls, value):
        return value.strip() if isinstance(value, str) else value

    @field_validator("destination")
    @classmethod
    def validate_destination(cls, value: str, info) -> str:
        channel_type = info.data.get("type")
        if channel_type == "email" and not __import__("re").match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", value):
            raise ValueError("Email alert destinations must be valid email addresses")
        if channel_type == "webhook":
            return validate_http_url(value)
        return value


class AlertChannelUpdate(BaseModel):
    type: AlertChannelType | None = None
    destination: str | None = Field(default=None, min_length=1, max_length=500)
    is_verified: bool | None = None
    is_active: bool | None = None

    @field_validator("destination", mode="before")
    @classmethod
    def strip_update_destination(cls, value):
        return value.strip() if isinstance(value, str) else value

    @model_validator(mode="after")
    def ensure_has_alert_update(self):
        validate_non_empty_update(self.model_dump(exclude_unset=True))
        if self.type == "email" and self.destination and not __import__("re").match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", self.destination):
            raise ValueError("Email alert destinations must be valid email addresses")
        if self.type == "webhook" and self.destination:
            validate_http_url(self.destination)
        return self


class AlertChannelRead(ORMModel):
    id: UUID
    user_id: UUID
    type: AlertChannelType
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
