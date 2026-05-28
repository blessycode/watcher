from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.common import ORMModel
from app.schemas.incident import IncidentRead
from app.schemas.monitor import MonitorRead


class StatusPageCreate(BaseModel):
    project_id: UUID
    name: str = Field(min_length=1, max_length=150)
    slug: str = Field(min_length=1, max_length=150, pattern=r"^[a-z0-9][a-z0-9-]*$")
    is_public: bool = True


class StatusPageUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    slug: str | None = Field(default=None, min_length=1, max_length=150, pattern=r"^[a-z0-9][a-z0-9-]*$")
    is_public: bool | None = None
    subscribers: int | None = Field(default=None, ge=0)
    overall_status: str | None = None


class StatusPageRead(ORMModel):
    id: UUID
    project_id: UUID
    name: str
    slug: str
    is_public: bool
    subscribers: int
    overall_status: str
    created_at: datetime
    updated_at: datetime


class PublicStatusPage(BaseModel):
    page: StatusPageRead
    monitors: list[MonitorRead]
    incidents: list[IncidentRead]
