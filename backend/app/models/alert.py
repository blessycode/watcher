import uuid

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class AlertChannel(Base):
    __tablename__ = "alert_channels"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)
    destination = Column(String(500), nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    last_triggered_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="alert_channels")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    channel = Column(String(50), nullable=False)
    recipient = Column(String(500), nullable=False)
    status = Column(String(30), default="queued", nullable=False)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    provider = Column(String(50), nullable=True)
    provider_message_id = Column(String(255), nullable=True)
    error_message = Column(Text, nullable=True)

    incident = relationship("Incident", back_populates="alerts")
