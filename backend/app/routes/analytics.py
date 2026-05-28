from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models import User
from app.services import analytics as analytics_service
from app.utils.security import get_current_user


router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/overview")
def analytics_overview(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return analytics_service.overview(db, current_user.id)


@router.get("/latency")
def analytics_latency(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {"latency_trend": analytics_service.trend(db, current_user.id)}


@router.get("/uptime")
def analytics_uptime(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {"uptime_trend": analytics_service.trend(db, current_user.id)}


@router.get("/incidents")
def analytics_incidents(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return analytics_service.incident_frequency(db, current_user.id)


@router.get("/errors")
def analytics_errors(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return analytics_service.error_report(db, current_user.id)
