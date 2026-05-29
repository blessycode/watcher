# Watcher Production Deployment

## Services

- Vercel: Next.js frontend
- Render Web Service: FastAPI backend
- Render PostgreSQL: primary database
- Render Redis or Upstash Redis: Celery broker/backend
- Render Background Worker: Celery worker
- Render Background Worker: Celery beat scheduler
- Resend: transactional email delivery

## Backend Environment

```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
SECRET_KEY=use-a-long-random-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ENVIRONMENT=production
ALLOW_PRIVATE_MONITORING=false
BACKEND_URL=https://your-watcher-api.onrender.com
FRONTEND_URL=https://your-watcher.vercel.app
CORS_ORIGINS=https://your-watcher.vercel.app
RESEND_API_KEY=re_...
ALERT_EMAIL_FROM=Watcher <alerts@yourdomain.com>
ALERT_EMAIL_REPLY_TO=support@yourdomain.com
```

## Frontend Environment

```env
NEXT_PUBLIC_API_URL=https://your-watcher-api.onrender.com
```

## Render Commands

Backend build command:

```bash
pip install -r requirements.txt && alembic -c alembic.ini upgrade head
```

Backend start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Celery worker start command:

```bash
celery -A app.workers.celery_app.celery_app worker -Q monitoring --loglevel=info
```

Celery beat start command:

```bash
celery -A app.workers.celery_app.celery_app beat --loglevel=info
```

## Database Structure

Core tables:

- `users`: account owners and team users
- `user_sessions`: active JWT-backed login sessions
- `projects`: owner-scoped API monitoring workspaces
- `monitors`: endpoint definitions and current health state
- `monitor_headers`: encrypted custom request headers
- `checks`: immutable HTTP check history
- `incidents`: open/resolved outage records
- `alert_channels`: user-owned destinations such as email
- `alerts`: delivery attempts, provider ids, and delivery errors
- `status_pages`: public project health pages
- `api_keys`: hashed API keys for integrations

The high-write table is `checks`; keep indexes on `monitor_id` and `checked_at`.

## Resend Setup

1. Create a Resend account.
2. Verify your sending domain.
3. Create an API key.
4. Set `RESEND_API_KEY` on Render.
5. Set `ALERT_EMAIL_FROM` to an address on the verified domain.
6. Create an email alert channel in Watcher.
7. Use the alert channel test button.

Resend requires an API key and verified domain for production sending.
