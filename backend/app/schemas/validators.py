import re
from typing import Literal
from urllib.parse import urlparse

from pydantic import AnyUrl, field_validator


ProjectEnvironment = Literal["production", "staging", "development"]
HttpMethod = Literal["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"]
MonitorStatus = Literal["operational", "degraded", "down", "unknown", "paused"]
IncidentStatus = Literal["investigating", "identified", "monitoring", "resolved"]
IncidentSeverity = Literal["low", "medium", "high", "critical"]
AlertChannelType = Literal["email", "slack", "discord", "webhook", "telegram"]
StatusPageState = Literal["operational", "degraded", "partial_outage", "major_outage"]

SLUG_PATTERN = r"^[a-z0-9][a-z0-9-]{0,148}[a-z0-9]$|^[a-z0-9]$"
HEADER_KEY_PATTERN = r"^[A-Za-z0-9!#$%&'*+.^_`|~-]+$"
REGION_PATTERN = r"^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$|^local$|^global$"


def normalize_email(value: str) -> str:
    return value.strip().lower()


def normalize_slug(value: str) -> str:
    return value.strip().lower()


def normalize_region(value: str) -> str:
    return value.strip().lower()


def validate_password_strength(value: str) -> str:
    if not re.search(r"[A-Za-z]", value) or not re.search(r"\d", value):
        raise ValueError("Password must contain at least one letter and one number")
    return value


def validate_http_url(value: str) -> str:
    parsed = urlparse(str(value))
    if parsed.scheme not in {"http", "https"} or not parsed.netloc or not parsed.hostname:
        raise ValueError("URL must be an absolute http or https URL")
    if parsed.username or parsed.password:
        raise ValueError("URL credentials are not allowed")
    return str(value)


def validate_non_empty_update(values: dict) -> dict:
    if not values:
        raise ValueError("At least one field must be provided")
    return values
