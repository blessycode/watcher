from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field, field_serializer, field_validator, model_validator

from app.schemas.common import ORMModel
from app.schemas.validators import HEADER_KEY_PATTERN, REGION_PATTERN, HttpMethod, MonitorStatus, normalize_region, validate_http_url, validate_non_empty_update


class MonitorHeaderCreate(BaseModel):
    header_key: str = Field(min_length=1, max_length=120, pattern=HEADER_KEY_PATTERN)
    encrypted_value: str = Field(min_length=1, max_length=4000)
    is_secret: bool = True

    @field_validator("header_key", "encrypted_value", mode="before")
    @classmethod
    def strip_header_strings(cls, value):
        return value.strip() if isinstance(value, str) else value


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
    method: HttpMethod = "GET"
    expected_status: int = Field(default=200, ge=100, le=599)
    interval_seconds: int = Field(default=300, ge=30, le=86400)
    timeout_seconds: int = Field(default=10, ge=1, le=60)
    region: str = Field(default="local", min_length=2, max_length=50, pattern=REGION_PATTERN)
    is_active: bool = True

    @field_validator("name", "url", "region", mode="before")
    @classmethod
    def strip_monitor_strings(cls, value):
        return value.strip() if isinstance(value, str) else value

    @field_validator("method", mode="before")
    @classmethod
    def normalize_method(cls, value: str) -> str:
        return value.upper()

    @field_validator("region")
    @classmethod
    def normalize_monitor_region(cls, value: str) -> str:
        return normalize_region(value)

    @field_validator("url")
    @classmethod
    def validate_monitor_url_shape(cls, value: str) -> str:
        return validate_http_url(value)


class MonitorCreate(MonitorBase):
    headers: list[MonitorHeaderCreate] = Field(default_factory=list, max_length=30)


class MonitorUpdate(BaseModel):
    project_id: UUID | None = None
    name: str | None = Field(default=None, min_length=1, max_length=150)
    url: str | None = None
    method: HttpMethod | None = None
    expected_status: int | None = Field(default=None, ge=100, le=599)
    interval_seconds: int | None = Field(default=None, ge=30, le=86400)
    timeout_seconds: int | None = Field(default=None, ge=1, le=60)
    region: str | None = Field(default=None, min_length=2, max_length=50, pattern=REGION_PATTERN)
    is_active: bool | None = None
    status: MonitorStatus | None = None
    headers: list[MonitorHeaderCreate] | None = Field(default=None, max_length=30)

    @field_validator("name", "url", "region", mode="before")
    @classmethod
    def strip_monitor_update_strings(cls, value):
        return value.strip() if isinstance(value, str) else value

    @field_validator("method", mode="before")
    @classmethod
    def normalize_update_method(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return value.upper()

    @field_validator("region")
    @classmethod
    def normalize_update_region(cls, value: str | None) -> str | None:
        return normalize_region(value) if value else value

    @field_validator("url")
    @classmethod
    def validate_update_url_shape(cls, value: str | None) -> str | None:
        return validate_http_url(value) if value else value

    @model_validator(mode="after")
    def ensure_has_monitor_update(self):
        validate_non_empty_update(self.model_dump(exclude_unset=True))
        return self


class MonitorRead(ORMModel, MonitorBase):
    id: UUID
    status: MonitorStatus
    uptime_percentage: float
    avg_latency_ms: float
    last_checked_at: datetime | None = None
    created_at: datetime
    headers: list[MonitorHeaderRead] = Field(default_factory=list)
