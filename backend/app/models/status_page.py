import uuid

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class StatusPage(Base):
    __tablename__ = "status_pages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(180), nullable=False)
    slug = Column(String(180), unique=True, nullable=False)
    is_public = Column(Boolean, default=True, nullable=False)
    subscribers = Column(Integer, default=0, nullable=False)
    overall_status = Column(String(50), default="operational", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    project = relationship("Project", back_populates="status_pages")


class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(150), nullable=False)
    key_hash = Column(String(255), nullable=False)
    key_prefix = Column(String(40), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_used_at = Column(DateTime(timezone=True), nullable=True)
    revoked_at = Column(DateTime(timezone=True), nullable=True)

    @property
    def masked_key(self) -> str:
        return f"{self.key_prefix}_************"

    user = relationship("User", back_populates="api_keys")


Index("ix_status_pages_slug", StatusPage.slug)
Index("ix_api_keys_user_id", APIKey.user_id)
