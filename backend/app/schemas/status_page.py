from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field, field_validator, model_validator

from app.schemas.common import ORMModel
from app.schemas.incident import IncidentRead
from app.schemas.monitor import MonitorRead
from app.schemas.validators import SLUG_PATTERN, StatusPageState, normalize_slug, validate_non_empty_update


class StatusPageCreate(BaseModel):
    project_id: UUID
    name: str = Field(min_length=1, max_length=150)
    slug: str = Field(min_length=1, max_length=150, pattern=SLUG_PATTERN)
    is_public: bool = True

    @field_validator("name", "slug", mode="before")
    @classmethod
    def strip_status_page_strings(cls, value):
        return value.strip() if isinstance(value, str) else value

    @field_validator("slug")
    @classmethod
    def normalize_status_page_slug(cls, value: str) -> str:
        return normalize_slug(value)


class StatusPageUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    slug: str | None = Field(default=None, min_length=1, max_length=150, pattern=SLUG_PATTERN)
    is_public: bool | None = None
    subscribers: int | None = Field(default=None, ge=0)
    overall_status: StatusPageState | None = None

    @field_validator("name", "slug", mode="before")
    @classmethod
    def strip_update_status_page_strings(cls, value):
        return value.strip() if isinstance(value, str) else value

    @field_validator("slug")
    @classmethod
    def normalize_update_status_page_slug(cls, value: str | None) -> str | None:
        return normalize_slug(value) if value else value

    @model_validator(mode="after")
    def ensure_has_status_page_update(self):
        validate_non_empty_update(self.model_dump(exclude_unset=True))
        return self


class StatusPageRead(ORMModel):
    id: UUID
    project_id: UUID
    name: str
    slug: str
    is_public: bool
    subscribers: int
    overall_status: StatusPageState
    created_at: datetime
    updated_at: datetime


class PublicStatusPage(BaseModel):
    page: StatusPageRead
    monitors: list[MonitorRead]
    incidents: list[IncidentRead]
