import uuid

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Index, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class Monitor(Base):
    __tablename__ = "monitors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(150), nullable=False)
    url = Column(Text, nullable=False)
    method = Column(String(10), default="GET", nullable=False)
    expected_status = Column(Integer, default=200, nullable=False)
    interval_seconds = Column(Integer, default=300, nullable=False)
    timeout_seconds = Column(Integer, default=10, nullable=False)
    region = Column(String(50), default="local", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    status = Column(String(30), default="unknown", nullable=False)
    uptime_percentage = Column(Float, default=100.0, nullable=False)
    avg_latency_ms = Column(Float, default=0.0, nullable=False)
    last_checked_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="monitors")
    headers = relationship("MonitorHeader", back_populates="monitor", cascade="all, delete-orphan")
    checks = relationship("Check", back_populates="monitor", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="monitor", cascade="all, delete-orphan")


class MonitorHeader(Base):
    __tablename__ = "monitor_headers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    monitor_id = Column(UUID(as_uuid=True), ForeignKey("monitors.id", ondelete="CASCADE"), nullable=False)
    header_key = Column(String(120), nullable=False)
    encrypted_value = Column(Text, nullable=False)
    is_secret = Column(Boolean, default=True, nullable=False)

    monitor = relationship("Monitor", back_populates="headers")


Index("ix_monitors_project_id", Monitor.project_id)
Index("ix_monitor_headers_monitor_id", MonitorHeader.monitor_id)
