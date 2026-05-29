import pytest
from pydantic import ValidationError

from app.schemas.alert import AlertChannelCreate
from app.schemas.incident import IncidentUpdate
from app.schemas.monitor import MonitorCreate
from app.schemas.project import ProjectCreate
from app.schemas.status_page import StatusPageUpdate
from app.schemas.user import UserCreate


PROJECT_ID = "00000000-0000-0000-0000-000000000000"


def test_user_requires_valid_email_and_strong_password():
    with pytest.raises(ValidationError):
        UserCreate(name="A", email="bad", password="password")


def test_project_rejects_bad_slug_and_environment():
    with pytest.raises(ValidationError):
        ProjectCreate(name="API", slug="Bad Slug", environment="prod")


def test_monitor_rejects_bad_method_and_url():
    with pytest.raises(ValidationError):
        MonitorCreate(project_id=PROJECT_ID, name="API", url="ftp://example.com", method="TRACE")


def test_alert_channel_validates_email_destination():
    with pytest.raises(ValidationError):
        AlertChannelCreate(type="email", destination="not-an-email")


def test_incident_update_rejects_unknown_status():
    with pytest.raises(ValidationError):
        IncidentUpdate(status="open")


def test_status_page_rejects_bad_rollup_state():
    with pytest.raises(ValidationError):
        StatusPageUpdate(overall_status="bad")
