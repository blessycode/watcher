from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field
from pydantic import field_validator

from app.schemas.common import ORMModel


class APIKeyCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)

    @field_validator("name", mode="before")
    @classmethod
    def strip_name(cls, value):
        return value.strip() if isinstance(value, str) else value


class APIKeyRead(ORMModel):
    id: UUID
    user_id: UUID
    name: str
    key_prefix: str
    masked_key: str
    created_at: datetime
    last_used_at: datetime | None
    revoked_at: datetime | None


class APIKeyCreated(APIKeyRead):
    key: str
