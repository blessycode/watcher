from uuid import UUID

from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models import APIKey, User
from app.schemas.api_key import APIKeyCreate, APIKeyCreated, APIKeyRead
from app.schemas.common import DeleteResponse
from app.utils.security import generate_api_key, get_current_user, hash_password


router = APIRouter(prefix="/api-keys", tags=["api keys"])


@router.get("", response_model=list[APIKeyRead])
def get_api_keys(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(APIKey).filter(APIKey.user_id == current_user.id).order_by(APIKey.created_at.desc()).all()


@router.post("", response_model=APIKeyCreated, status_code=status.HTTP_201_CREATED)
def create_api_key(payload: APIKeyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    raw_key, prefix = generate_api_key()
    api_key = APIKey(name=payload.name, user_id=current_user.id, key_hash=hash_password(raw_key), key_prefix=prefix)
    db.add(api_key)
    db.commit()
    db.refresh(api_key)
    data = APIKeyRead.model_validate(api_key).model_dump()
    return APIKeyCreated(**data, key=raw_key)


@router.delete("/{api_key_id}", response_model=DeleteResponse)
def revoke_api_key(api_key_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    api_key = db.query(APIKey).filter(APIKey.id == api_key_id, APIKey.user_id == current_user.id).first()
    if api_key is None:
        raise HTTPException(status_code=404, detail="API key not found")
    api_key.revoked_at = datetime.now(UTC)
    db.commit()
    return DeleteResponse(id=api_key_id)
