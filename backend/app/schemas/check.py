from datetime import datetime
from uuid import UUID

from app.schemas.common import ORMModel


class CheckRead(ORMModel):
    id: UUID
    monitor_id: UUID
    status_code: int | None
    success: bool
    latency_ms: float | None
    error_message: str | None
    region: str
    checked_at: datetime
