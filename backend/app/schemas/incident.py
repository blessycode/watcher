from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field, field_validator, model_validator

from app.schemas.common import ORMModel
from app.schemas.validators import IncidentSeverity, IncidentStatus, validate_non_empty_update


class IncidentRead(ORMModel):
    id: UUID
    monitor_id: UUID
    title: str
    status: IncidentStatus
    severity: IncidentSeverity
    reason: str | None
    root_cause: str | None
    started_at: datetime
    resolved_at: datetime | None
    duration: str | None = None
    created_at: datetime


class IncidentUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    status: IncidentStatus | None = None
    severity: IncidentSeverity | None = None
    reason: str | None = Field(default=None, max_length=4000)
    root_cause: str | None = Field(default=None, max_length=4000)

    @field_validator("title", "reason", "root_cause", mode="before")
    @classmethod
    def strip_incident_strings(cls, value):
        return value.strip() if isinstance(value, str) else value

    @model_validator(mode="after")
    def ensure_has_incident_update(self):
        validate_non_empty_update(self.model_dump(exclude_unset=True))
        return self


class IncidentResolve(BaseModel):
    root_cause: str | None = Field(default=None, max_length=4000)

    @field_validator("root_cause", mode="before")
    @classmethod
    def strip_root_cause(cls, value):
        return value.strip() if isinstance(value, str) else value
