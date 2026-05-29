# Watcher

Watcher is an open-source API monitoring and uptime intelligence platform. It includes a FastAPI backend, PostgreSQL persistence, real HTTP checks, incident automation, alert channels, analytics, API keys, Celery scheduling, and a Next.js frontend.

## What Works

- Register, login, logout, and authenticated `/auth/me`
- Create projects and API monitors
- Run instant HTTP checks with `httpx`
- Store check history and latency
- Mark monitors operational, degraded, down, paused, or unknown
- Create incidents after repeated failures
- Resolve incidents after recovery
- Manage alert channels and API keys
- Serve analytics and public status pages
- Run scheduled monitor checks with Celery and Redis
- Use Alembic migrations instead of `create_all`

## Local Setup

Create `backend/.env` from `backend/.env.example` and update your PostgreSQL credentials.

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
alembic -c alembic.ini upgrade head
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

In another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000/register
```

After registering, go to the dashboard and click `Create starter workspace`. It creates a project, monitors, alert channel, public status page, and initial checks.

## Optional Workers

Redis is required for scheduled checks.

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
celery -A app.workers.celery_app.celery_app worker --loglevel=info
```

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
celery -A app.workers.celery_app.celery_app beat --loglevel=info
```

## Docker

Docker is optional. If installed:

```powershell
docker compose up --build
```

## API

- Swagger: `http://127.0.0.1:8000/docs`
- Health: `http://127.0.0.1:8000/health`
- Readiness: `http://127.0.0.1:8000/ready`

## Validation And Security

The backend validates emails, passwords, slugs, URLs, methods, statuses, severity values, alert destinations, regions, status codes, intervals, timeouts, headers, and update payloads. In production, private and localhost monitoring targets are blocked unless explicitly allowed.

## Verification

```powershell
cd backend
python -m compileall app
pytest
```

```powershell
cd frontend
npm run build
```
