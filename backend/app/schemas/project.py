from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field, field_validator, model_validator

from app.schemas.common import ORMModel
from app.schemas.validators import ProjectEnvironment, SLUG_PATTERN, normalize_slug, validate_non_empty_update


class ProjectBase(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    slug: str = Field(min_length=1, max_length=150, pattern=SLUG_PATTERN)
    description: str | None = Field(default=None, max_length=2000)
    environment: ProjectEnvironment = "production"

    @field_validator("name", "slug", "description", mode="before")
    @classmethod
    def strip_project_strings(cls, value):
        return value.strip() if isinstance(value, str) else value

    @field_validator("slug")
    @classmethod
    def normalize_project_slug(cls, value: str) -> str:
        return normalize_slug(value)


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    slug: str | None = Field(default=None, min_length=1, max_length=150, pattern=SLUG_PATTERN)
    description: str | None = Field(default=None, max_length=2000)
    environment: ProjectEnvironment | None = None

    @field_validator("name", "slug", "description", mode="before")
    @classmethod
    def strip_update_strings(cls, value):
        return value.strip() if isinstance(value, str) else value

    @field_validator("slug")
    @classmethod
    def normalize_update_slug(cls, value: str | None) -> str | None:
        return normalize_slug(value) if value else value

    @model_validator(mode="after")
    def ensure_has_project_update(self):
        validate_non_empty_update(self.model_dump(exclude_unset=True))
        return self


class ProjectRead(ORMModel, ProjectBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
