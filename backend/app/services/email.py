import html

import httpx

from app.config import settings


class EmailDeliveryError(Exception):
    pass


def _render_text_as_html(text: str) -> str:
    escaped = html.escape(text).replace("\n", "<br />")
    return f"""
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.55;color:#111827">
      {escaped}
    </div>
    """


def send_resend_email(to_email: str, subject: str, text: str, html_body: str | None = None) -> str:
    if not settings.RESEND_API_KEY:
        raise EmailDeliveryError("Resend is not configured. Set RESEND_API_KEY.")

    payload: dict[str, object] = {
        "from": settings.ALERT_EMAIL_FROM,
        "to": [to_email],
        "subject": subject,
        "html": html_body or _render_text_as_html(text),
        "text": text,
    }
    if settings.ALERT_EMAIL_REPLY_TO:
        payload["reply_to"] = settings.ALERT_EMAIL_REPLY_TO

    try:
        response = httpx.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=httpx.Timeout(15, connect=5),
            follow_redirects=True,
        )
    except httpx.HTTPError as exc:
        raise EmailDeliveryError(f"Resend request failed: {exc}") from exc

    if response.status_code >= 400:
        raise EmailDeliveryError(f"Resend returned {response.status_code}: {response.text[:500]}")

    data = response.json()
    message_id = data.get("id")
    if not message_id:
        raise EmailDeliveryError("Resend accepted the request but did not return an email id")
    return str(message_id)
