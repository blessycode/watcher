from datetime import UTC, datetime

from sqlalchemy.orm import Session

from app.models import Alert, AlertChannel, Incident, Monitor, Project
from app.services.email import EmailDeliveryError, send_resend_email


def _incident_email_subject(incident: Incident, monitor: Monitor, event: str) -> str:
    if event == "resolved":
        return f"[Watcher] Resolved: {monitor.name}"
    return f"[Watcher] {incident.severity.upper()} incident: {monitor.name}"


def _incident_email_body(incident: Incident, monitor: Monitor, project: Project, event: str) -> str:
    state = "resolved" if event == "resolved" else "opened"
    resolved_at = f"\nResolved at: {incident.resolved_at.isoformat()}" if incident.resolved_at else ""
    return (
        f"Watcher incident {state}\n\n"
        f"Project: {project.name}\n"
        f"Monitor: {monitor.name}\n"
        f"Severity: {incident.severity}\n"
        f"Status: {incident.status}\n"
        f"Reason: {incident.reason or 'No reason recorded'}\n"
        f"Started at: {incident.started_at.isoformat() if incident.started_at else 'unknown'}"
        f"{resolved_at}\n\n"
        f"Open Watcher: {project.slug}"
    )


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
        status = "queued"
        sent_at = None
        provider = None
        provider_message_id = None
        error_message = None
        if channel.type == "email":
            provider = "resend"
            try:
                provider_message_id = send_resend_email(
                    channel.destination,
                    _incident_email_subject(incident, monitor, event),
                    _incident_email_body(incident, monitor, project, event),
                )
                status = "sent"
                sent_at = now
                channel.last_triggered_at = now
            except EmailDeliveryError as exc:
                status = "failed"
                error_message = str(exc)[:1000]
        else:
            status = "queued"
            error_message = f"{channel.type} delivery is not implemented yet"
        alert = Alert(
            incident_id=incident.id,
            channel=channel.type,
            recipient=channel.destination,
            status=status,
            sent_at=sent_at,
            provider=provider,
            provider_message_id=provider_message_id,
            error_message=error_message,
        )
        db.add(alert)
        alerts.append(alert)
    return alerts
