# Watcher

Watcher is an open-source API Reliability Platform for engineering teams.

It monitors APIs, records latency and uptime, detects repeated failures, creates incidents, sends alerts, exposes analytics, stores developer check logs, tracks SLA health, compares regions, and powers public status pages.

Watcher is designed to run with:

- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL
- Redis: Upstash Redis
- Email alerts: Resend

## Product Scope

Watcher is more than a simple uptime checker.

It supports:

- API monitors for REST APIs, GraphQL APIs, internal services, webhook endpoints, websites, auth services, and payment services
- Real HTTP checks with status code, latency, region, timestamp, and error reason
- Incident creation after repeated failures
- Recovery detection and incident resolution
- Public status pages
- Analytics for uptime, latency, errors, slow endpoints, incident frequency, and region failures
- Developer logs for monitor executions
- SLA summaries and downtime budget visibility
- Alert channels and Resend email delivery
- JWT authentication and protected workspaces

## Repository Structure

```text
backend/
  app/
  alembic/
  requirements.txt
  Dockerfile

frontend/
  app/
  components/
  lib/
  package.json

docs/
docker-compose.yml
```

## Local Development

### 1. Backend

Create `backend/.env` from `backend/.env.example`.

For local Postgres:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/watcher_db
REDIS_URL=redis://localhost:6379/0
BACKEND_URL=http://127.0.0.1:8000
FRONTEND_URL=http://localhost:3000
SECRET_KEY=replace-with-a-long-random-secret
ENVIRONMENT=development
ALLOW_PRIVATE_MONITORING=true
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
RESEND_API_KEY=
ALERT_EMAIL_FROM=Watcher <alerts@yourdomain.com>
```

Install and run:

```powershell
cd backend
pip install -r requirements.txt
alembic -c alembic.ini upgrade head
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend URLs:

- API: `http://127.0.0.1:8000`
- Swagger: `http://127.0.0.1:8000/docs`
- Health: `http://127.0.0.1:8000/health`
- Ready: `http://127.0.0.1:8000/ready`

### 2. Frontend

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Run:

```powershell
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000/register
```

### 3. Optional Local Workers

Scheduled checks need Redis plus Celery worker and beat.

```powershell
cd backend
celery -A app.workers.celery_app.celery_app worker -Q monitoring --loglevel=info
```

In another terminal:

```powershell
cd backend
celery -A app.workers.celery_app.celery_app beat --loglevel=info
```

Manual `Check now` works through the FastAPI backend without Celery.

## Production Deployment

Production target:

- Vercel hosts `frontend`
- Render hosts FastAPI backend
- Neon provides PostgreSQL
- Upstash provides Redis
- Resend sends alert emails

Deployment helper files:

- `render.yaml`: Render Blueprint for FastAPI web, Celery worker, and Celery beat.
- `neon.env.example`: Neon PostgreSQL `DATABASE_URL` template.
- `upstash.env.example`: Upstash Redis `REDIS_URL` template.
- `backend/.env.production.example`: Render backend environment checklist.
- `frontend/.env.production.example`: Vercel frontend environment checklist.

## 1. Neon PostgreSQL

1. Create a Neon project.
2. Create a database, for example `watcher`.
3. Copy the pooled connection string.
4. Use the `psycopg2`/SQLAlchemy format:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/watcher?sslmode=require
```

Keep this value secret. Add it only to Render environment variables.

## 2. Upstash Redis

1. Create an Upstash Redis database.
2. Copy the Redis connection URL.
3. Use the Redis URL as:

```env
REDIS_URL=rediss://default:PASSWORD@HOST.upstash.io:PORT
```

Use the same `REDIS_URL` for the Render web service, Celery worker, and Celery beat.

## 3. Render Backend

You can deploy manually in Render or use the included `render.yaml` Blueprint.

### Render Blueprint

1. Push this repository to GitHub.
2. In Render, choose `New` > `Blueprint`.
3. Connect the repository.
4. Render will read `render.yaml` and create:
   - `watcher-api`
   - `watcher-celery-worker`
   - `watcher-celery-beat`
5. Fill all `sync: false` environment variables in Render.

`render.yaml` does not contain real secrets. Add Neon, Upstash, Resend, frontend URL, backend URL, and CORS values in the Render dashboard.

### Manual Render Setup

Create a Render Web Service:

- Root Directory: `backend`
- Runtime: Python
- Build Command:

```bash
pip install -r requirements.txt && alembic -c alembic.ini upgrade head
```

- Start Command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Render environment variables:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/watcher?sslmode=require
REDIS_URL=rediss://default:PASSWORD@HOST.upstash.io:PORT
BACKEND_URL=https://your-watcher-api.onrender.com
FRONTEND_URL=https://your-watcher.vercel.app
SECRET_KEY=generate-a-long-random-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ENVIRONMENT=production
ALLOW_PRIVATE_MONITORING=false
CORS_ORIGINS=https://your-watcher.vercel.app,http://localhost:3000,http://127.0.0.1:3000
RESEND_API_KEY=re_your_key
ALERT_EMAIL_FROM=Watcher <alerts@yourdomain.com>
ALERT_EMAIL_REPLY_TO=support@yourdomain.com
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Important:

- `SECRET_KEY` must be long and random.
- `ALLOW_PRIVATE_MONITORING=false` protects production from localhost/private-IP SSRF targets.
- `CORS_ORIGINS` must include the final Vercel domain.
- If your Render URL changes, update `BACKEND_URL` and Vercel `NEXT_PUBLIC_API_URL`.

### Render Celery Worker

Create a Render Background Worker:

- Root Directory: `backend`
- Build Command:

```bash
pip install -r requirements.txt
```

- Start Command:

```bash
celery -A app.workers.celery_app.celery_app worker -Q monitoring --loglevel=info
```

Use the same environment variables as the backend web service.

### Render Celery Beat

Create another Render Background Worker:

- Root Directory: `backend`
- Build Command:

```bash
pip install -r requirements.txt
```

- Start Command:

```bash
celery -A app.workers.celery_app.celery_app beat --loglevel=info
```

Use the same environment variables as the backend web service.

Celery beat schedules active monitors. Celery worker performs the checks.

## 4. Vercel Frontend

Create a Vercel project from this repository:

- Root Directory: `frontend`
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

Vercel environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-watcher-api.onrender.com
```

Deploy the frontend, then copy the Vercel production URL and add it to Render:

```env
FRONTEND_URL=https://your-watcher.vercel.app
CORS_ORIGINS=https://your-watcher.vercel.app
```

You can keep localhost in `CORS_ORIGINS` if you still test local frontend against production backend:

```env
CORS_ORIGINS=https://your-watcher.vercel.app,http://localhost:3000,http://127.0.0.1:3000
```

## 5. Resend Email Alerts

1. Create a Resend API key.
2. Verify your sending domain in Resend.
3. Set Render variables:

```env
RESEND_API_KEY=re_your_key
ALERT_EMAIL_FROM=Watcher <alerts@yourdomain.com>
ALERT_EMAIL_REPLY_TO=support@yourdomain.com
```

Then in Watcher:

1. Register or log in.
2. Go to Alerts.
3. Add an email alert channel.
4. Click Test.

Incident-open and incident-resolved events will create alert delivery records and send email for active email channels.

## Database Migrations

Run migrations whenever backend schema changes:

```powershell
cd backend
alembic -c alembic.ini upgrade head
```

On Render, migrations run in the backend web service build command.

If a database already has manually-created tables, do not repeatedly run the initial migration against an unmanaged schema. Use a clean Neon database for production.

## Testing API Monitoring

1. Register in the frontend.
2. Create a project.
3. Create a monitor:

```text
Name: Watcher API Health
URL: https://your-watcher-api.onrender.com/health
Method: GET
Expected Status: 200
Interval: 60
Timeout: 5
Region: global
```

4. Click `Check now`.
5. Confirm:

- The monitor shows a status.
- Checks appear in monitor history.
- Logs appear in `/logs`.
- Analytics update.

To test failure behavior:

```text
URL: https://example.com/not-found
Expected Status: 200
```

Run `Check now` three times. Watcher should move from degraded to down and create an incident.

## Core Commands

Backend:

```powershell
cd backend
alembic -c alembic.ini upgrade head
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Frontend:

```powershell
cd frontend
npm run dev
```

Verification:

```powershell
cd backend
python -m compileall app
```

```powershell
cd frontend
npm run build
```

## Security Notes

- Never commit `.env`, `.env.local`, API keys, database URLs, Redis URLs, OAuth secrets, or Resend secrets.
- Use `ALLOW_PRIVATE_MONITORING=false` in production.
- Only add trusted frontend origins to `CORS_ORIGINS`.
- Use HTTPS URLs for production services.
- Use Neon with `sslmode=require`.
- Rotate `SECRET_KEY` only when you are ready to invalidate existing sessions.

## Deployment Checklist

- Neon database created
- Neon `DATABASE_URL` added to Render
- Upstash Redis created
- Upstash `REDIS_URL` added to Render web, worker, and beat
- Render web service deployed
- Render worker deployed
- Render beat deployed
- Vercel frontend deployed
- Vercel `NEXT_PUBLIC_API_URL` points to Render backend
- Render `CORS_ORIGINS` includes Vercel URL
- Render `FRONTEND_URL` points to Vercel
- Resend key and sender configured
- Alembic migrations completed
- `/health`, `/ready`, `/docs`, `/register`, `/dashboard`, and `/monitors/new` verified
