from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.common import ORMModel


class APIKeyCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)


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
