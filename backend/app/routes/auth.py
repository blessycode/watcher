from datetime import UTC, datetime
from secrets import token_urlsafe
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.config import settings
from app.db.database import get_db
from app.models import User
from app.schemas.common import TokenResponse
from app.schemas.user import UserCreate, UserLogin, UserRead
from app.models import UserSession
from app.utils.security import create_user_session_token, get_current_session, get_current_user, hash_password, verify_password


router = APIRouter(prefix="/auth", tags=["authentication"])


OAUTH_STATE_COOKIE = "watcher_oauth_state"


def _frontend_auth_redirect(path: str, params: dict[str, str] | None = None, fragment: dict[str, str] | None = None) -> str:
    url = f"{settings.FRONTEND_URL.rstrip('/')}{path}"
    if params:
        url = f"{url}?{urlencode(params)}"
    if fragment:
        url = f"{url}#{urlencode(fragment)}"
    return url


def _oauth_redirect_uri(provider: str) -> str:
    return f"{settings.BACKEND_URL.rstrip('/')}/auth/oauth/{provider}/callback"


def _oauth_config(provider: str) -> tuple[str | None, str | None]:
    if provider == "github":
        return settings.GITHUB_CLIENT_ID, settings.GITHUB_CLIENT_SECRET
    if provider == "google":
        return settings.GOOGLE_CLIENT_ID, settings.GOOGLE_CLIENT_SECRET
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unsupported OAuth provider")


def _oauth_error(message: str) -> RedirectResponse:
    return RedirectResponse(_frontend_auth_redirect("/login", {"error": message}), status_code=status.HTTP_302_FOUND)


def _github_profile(code: str) -> dict[str, str]:
    with httpx.Client(timeout=12) as client:
        token_response = client.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": _oauth_redirect_uri("github"),
            },
        )
        token_response.raise_for_status()
        access_token = token_response.json().get("access_token")
        if not access_token:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="GitHub did not return an access token")
        headers = {"Authorization": f"Bearer {access_token}", "Accept": "application/vnd.github+json"}
        user_response = client.get("https://api.github.com/user", headers=headers)
        user_response.raise_for_status()
        user_data = user_response.json()
        email = user_data.get("email")
        if not email:
            emails_response = client.get("https://api.github.com/user/emails", headers=headers)
            emails_response.raise_for_status()
            emails = emails_response.json()
            primary = next((item for item in emails if item.get("primary") and item.get("verified")), None)
            email = primary.get("email") if primary else None
        if not email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="GitHub account has no verified email")
        return {"email": email.lower(), "name": user_data.get("name") or user_data.get("login") or email.split("@")[0]}


def _google_profile(code: str) -> dict[str, str]:
    with httpx.Client(timeout=12) as client:
        token_response = client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": _oauth_redirect_uri("google"),
            },
        )
        token_response.raise_for_status()
        access_token = token_response.json().get("access_token")
        if not access_token:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Google did not return an access token")
        user_response = client.get("https://openidconnect.googleapis.com/v1/userinfo", headers={"Authorization": f"Bearer {access_token}"})
        user_response.raise_for_status()
        user_data = user_response.json()
        if not user_data.get("email") or not user_data.get("email_verified", False):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Google account has no verified email")
        return {"email": user_data["email"].lower(), "name": user_data.get("name") or user_data["email"].split("@")[0]}


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, request: Request, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email.lower()).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered")
    user = User(
        name=payload.name,
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        role="owner",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token, expires_at = create_user_session_token(
        db,
        user,
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
    )
    return TokenResponse(access_token=token, expires_at=expires_at)


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    token, expires_at = create_user_session_token(
        db,
        user,
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
    )
    return TokenResponse(access_token=token, expires_at=expires_at)


@router.post("/logout")
def logout(current_session: UserSession = Depends(get_current_session), db: Session = Depends(get_db)):
    current_session.revoked_at = datetime.now(UTC)
    db.commit()
    return {"ok": True}


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/oauth/{provider}/start")
def oauth_start(provider: str, response: Response):
    client_id, client_secret = _oauth_config(provider)
    if not client_id or not client_secret:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"{provider.title()} login is not configured")
    state = token_urlsafe(32)
    response = RedirectResponse(status_code=status.HTTP_302_FOUND, url="")
    response.set_cookie(
        OAUTH_STATE_COOKIE,
        state,
        httponly=True,
        secure=settings.ENVIRONMENT == "production",
        samesite="lax",
        max_age=600,
    )
    if provider == "github":
        response.headers["location"] = "https://github.com/login/oauth/authorize?" + urlencode(
            {
                "client_id": client_id,
                "redirect_uri": _oauth_redirect_uri("github"),
                "scope": "user:email",
                "state": state,
            }
        )
        return response
    response.headers["location"] = "https://accounts.google.com/o/oauth2/v2/auth?" + urlencode(
        {
            "client_id": client_id,
            "redirect_uri": _oauth_redirect_uri("google"),
            "response_type": "code",
            "scope": "openid email profile",
            "state": state,
            "access_type": "online",
            "prompt": "select_account",
        }
    )
    return response


@router.get("/oauth/{provider}/callback")
def oauth_callback(
    provider: str,
    request: Request,
    code: str = Query(...),
    state: str = Query(...),
    db: Session = Depends(get_db),
):
    _oauth_config(provider)
    expected_state = request.cookies.get(OAUTH_STATE_COOKIE)
    if not expected_state or expected_state != state:
        return _oauth_error("Invalid or expired social login session")
    try:
        profile = _github_profile(code) if provider == "github" else _google_profile(code)
        user = db.query(User).filter(User.email == profile["email"]).first()
        if user is None:
            user = User(
                name=profile["name"],
                email=profile["email"],
                password_hash=hash_password(token_urlsafe(32)),
                role="owner",
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        token, expires_at = create_user_session_token(
            db,
            user,
            user_agent=request.headers.get("user-agent"),
            ip_address=request.client.host if request.client else None,
        )
    except Exception:
        return _oauth_error("Social login failed")
    redirect = RedirectResponse(
        _frontend_auth_redirect(
            "/auth/callback",
            fragment={"access_token": token, "expires_at": expires_at.isoformat()},
        ),
        status_code=status.HTTP_302_FOUND,
    )
    redirect.delete_cookie(OAUTH_STATE_COOKIE)
    return redirect
