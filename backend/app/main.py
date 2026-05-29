from fastapi import FastAPI
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db.database import engine
from app.middleware.request_id import RequestIDMiddleware
from app.routes import alert_channels, analytics, api_keys, auth, incidents, monitors, onboarding, projects, status_pages


app = FastAPI(
    title="Watcher API",
    description="Open-source API monitoring, uptime intelligence, incident management and status pages.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestIDMiddleware)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(monitors.router)
app.include_router(incidents.router)
app.include_router(alert_channels.router)
app.include_router(status_pages.router)
app.include_router(analytics.router)
app.include_router(api_keys.router)
app.include_router(onboarding.router)


@app.get("/")
def root():
    return {"message": "Watcher API is running", "status": "operational"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/ready")
def readiness_check():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return {"status": "ready", "database": "ok"}
