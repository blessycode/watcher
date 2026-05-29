import ipaddress
import socket
from urllib.parse import urlparse

from fastapi import HTTPException, status

from app.config import settings


def validate_monitor_url(url: str) -> None:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Monitor URL must be http or https")
    if settings.ENVIRONMENT != "production" and settings.ALLOW_PRIVATE_MONITORING:
        return
    try:
        addresses = socket.getaddrinfo(parsed.hostname, None)
    except socket.gaierror as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Monitor URL host cannot be resolved") from exc
    for address in addresses:
        ip = ipaddress.ip_address(address[4][0])
        if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Private and localhost targets are blocked in production")
