from datetime import UTC, datetime

from sqlalchemy.orm import Session

from app.models import Alert, AlertChannel, Incident, Monitor, Project


def trigger_incident_alerts(db: Session, incident: Incident, event: str) -> list[Alert]:
    monitor = db.get(Monitor, incident.monitor_id)
    if monitor is None:
        return []
    project = db.get(Project, monitor.project_id)
    if project is None:
        return []
    now = datetime.now(UTC)
    alerts: list[Alert] = []
    channels = (
        db.query(AlertChannel)
        .filter(AlertChannel.user_id == project.user_id, AlertChannel.is_active.is_(True))
        .all()
    )
    for channel in channels:
        alert = Alert(
            incident_id=incident.id,
            channel=channel.type,
            recipient=channel.destination,
            status="sent",
            sent_at=now,
        )
        channel.last_triggered_at = now
        db.add(alert)
        alerts.append(alert)
    return alerts
