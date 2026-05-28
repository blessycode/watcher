from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.common import ORMModel


class ProjectBase(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    slug: str = Field(min_length=1, max_length=150, pattern=r"^[a-z0-9][a-z0-9-]*$")
    description: str | None = None
    environment: str = "production"


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    slug: str | None = Field(default=None, min_length=1, max_length=150, pattern=r"^[a-z0-9][a-z0-9-]*$")
    description: str | None = None
    environment: str | None = None


class ProjectRead(ORMModel, ProjectBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
