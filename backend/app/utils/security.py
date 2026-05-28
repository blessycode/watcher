from datetime import UTC, datetime, timedelta
import base64
import hashlib
import hmac
import json
import os
from secrets import token_urlsafe
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.config import settings
from app.db.database import get_db
from app.models import User


bearer_scheme = HTTPBearer(auto_error=False)

try:
    from passlib.context import CryptContext
except ModuleNotFoundError:  # pragma: no cover
    password_context = None
else:
    password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class JWTError(Exception):
    pass


try:
    from jose import JWTError as JoseJWTError
    from jose import jwt as jose_jwt
except ModuleNotFoundError:  # pragma: no cover - keeps lean local envs importable
    JoseJWTError = JWTError
    jose_jwt = None


def _b64encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("utf-8")


def _b64decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode((data + padding).encode("utf-8"))


def _fallback_encode(payload: dict, secret: str) -> str:
    normalized = payload.copy()
    if isinstance(normalized.get("exp"), datetime):
        normalized["exp"] = int(normalized["exp"].timestamp())
    header = {"alg": "HS256", "typ": "JWT"}
    signing_input = ".".join(
        [
            _b64encode(json.dumps(header, separators=(",", ":")).encode("utf-8")),
            _b64encode(json.dumps(normalized, separators=(",", ":")).encode("utf-8")),
        ]
    )
    signature = hmac.new(secret.encode("utf-8"), signing_input.encode("utf-8"), hashlib.sha256).digest()
    return f"{signing_input}.{_b64encode(signature)}"


def _fallback_decode(token: str, secret: str) -> dict:
    try:
        header, payload, signature = token.split(".")
        signing_input = f"{header}.{payload}"
        expected = hmac.new(secret.encode("utf-8"), signing_input.encode("utf-8"), hashlib.sha256).digest()
        if not hmac.compare_digest(_b64decode(signature), expected):
            raise JWTError("Invalid signature")
        decoded = json.loads(_b64decode(payload))
        if decoded.get("exp") and datetime.now(UTC).timestamp() > decoded["exp"]:
            raise JWTError("Token expired")
        return decoded
    except Exception as exc:
        raise JWTError("Invalid token") from exc


def hash_password(password: str) -> str:
    if password_context is not None:
        return password_context.hash(password)
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 260000)
    return f"pbkdf2_sha256${_b64encode(salt)}${_b64encode(digest)}"


def verify_password(password: str, password_hash: str) -> bool:
    if password_context is not None:
        return password_context.verify(password, password_hash)
    try:
        scheme, salt, digest = password_hash.split("$")
        if scheme != "pbkdf2_sha256":
            return False
        expected = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), _b64decode(salt), 260000)
        return hmac.compare_digest(_b64encode(expected), digest)
    except ValueError:
        return False


def create_access_token(user_id: UUID) -> tuple[str, datetime]:
    expires_at = datetime.now(UTC) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "exp": expires_at}
    if jose_jwt is not None:
        token = jose_jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    else:
        token = _fallback_encode(payload, settings.SECRET_KEY)
    return token, expires_at


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        if jose_jwt is not None:
            payload = jose_jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        else:
            payload = _fallback_decode(credentials.credentials, settings.SECRET_KEY)
        user_id = payload.get("sub")
    except (JWTError, JoseJWTError) as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc
    try:
        user_uuid = UUID(user_id)
    except (TypeError, ValueError) as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc
    user = db.get(User, user_uuid)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return user


def generate_api_key() -> tuple[str, str]:
    prefix = "wtr_live"
    secret = token_urlsafe(32)
    return f"{prefix}_{secret}", prefix
