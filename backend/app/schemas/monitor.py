from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field, field_serializer, field_validator

from app.schemas.common import ORMModel


class MonitorHeaderCreate(BaseModel):
    header_key: str = Field(min_length=1, max_length=120)
    encrypted_value: str = Field(min_length=1)
    is_secret: bool = True


class MonitorHeaderRead(ORMModel):
    id: UUID
    monitor_id: UUID
    header_key: str
    encrypted_value: str | None = None
    is_secret: bool

    @field_serializer("encrypted_value")
    def hide_secret_value(self, value: str | None):
        return None if self.is_secret else value


class MonitorBase(BaseModel):
    project_id: UUID
    name: str = Field(min_length=1, max_length=150)
    url: str
    method: str = "GET"
    expected_status: int = Field(default=200, ge=100, le=599)
    interval_seconds: int = Field(default=300, ge=30)
    timeout_seconds: int = Field(default=10, ge=1, le=60)
    region: str = "local"
    is_active: bool = True

    @field_validator("method")
    @classmethod
    def normalize_method(cls, value: str) -> str:
        method = value.upper()
        if method not in {"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"}:
            raise ValueError("Unsupported HTTP method")
        return method


class MonitorCreate(MonitorBase):
    headers: list[MonitorHeaderCreate] = Field(default_factory=list)


class MonitorUpdate(BaseModel):
    project_id: UUID | None = None
    name: str | None = Field(default=None, min_length=1, max_length=150)
    url: str | None = None
    method: str | None = None
    expected_status: int | None = Field(default=None, ge=100, le=599)
    interval_seconds: int | None = Field(default=None, ge=30)
    timeout_seconds: int | None = Field(default=None, ge=1, le=60)
    region: str | None = None
    is_active: bool | None = None
    status: str | None = None
    headers: list[MonitorHeaderCreate] | None = None

    @field_validator("method")
    @classmethod
    def normalize_update_method(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return MonitorBase.normalize_method(value)


class MonitorRead(ORMModel, MonitorBase):
    id: UUID
    status: str
    uptime_percentage: float
    avg_latency_ms: float
    last_checked_at: datetime | None = None
    created_at: datetime
    headers: list[MonitorHeaderRead] = Field(default_factory=list)
