from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.schemas.common import ORMModel


class IncidentRead(ORMModel):
    id: UUID
    monitor_id: UUID
    title: str
    status: str
    severity: str
    reason: str | None
    root_cause: str | None
    started_at: datetime
    resolved_at: datetime | None
    duration: str | None = None
    created_at: datetime


class IncidentUpdate(BaseModel):
    title: str | None = None
    status: str | None = None
    severity: str | None = None
    reason: str | None = None
    root_cause: str | None = None


class IncidentResolve(BaseModel):
    root_cause: str | None = None
