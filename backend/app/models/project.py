import uuid

from sqlalchemy import Column, DateTime, ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(150), nullable=False)
    slug = Column(String(180), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    environment = Column(String(50), default="production", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="projects")
    monitors = relationship("Monitor", back_populates="project", cascade="all, delete-orphan")
    status_pages = relationship("StatusPage", back_populates="project", cascade="all, delete-orphan")


Index("ix_projects_slug", Project.slug)
Index("ix_projects_user_id", Project.user_id)
