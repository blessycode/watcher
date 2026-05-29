"""add alert delivery metadata

Revision ID: 0003_alert_delivery_metadata
Revises: 0002_user_sessions
Create Date: 2026-05-29
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0003_alert_delivery_metadata"
down_revision: Union[str, None] = "0002_user_sessions"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("alerts", sa.Column("provider", sa.String(50), nullable=True))
    op.add_column("alerts", sa.Column("provider_message_id", sa.String(255), nullable=True))
    op.add_column("alerts", sa.Column("error_message", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("alerts", "error_message")
    op.drop_column("alerts", "provider_message_id")
    op.drop_column("alerts", "provider")
