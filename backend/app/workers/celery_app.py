from celery import Celery
from celery.schedules import crontab

from app.config import settings


celery_app = Celery("watcher", broker=settings.REDIS_URL, backend=settings.REDIS_URL)
celery_app.conf.timezone = "UTC"
celery_app.conf.imports = ("app.workers.tasks",)
celery_app.conf.task_routes = {"app.workers.tasks.*": {"queue": "monitoring"}}
celery_app.conf.beat_schedule = {
    "dispatch-due-monitor-checks": {
        "task": "app.workers.tasks.dispatch_due_monitor_checks",
        "schedule": crontab(minute="*"),
    }
}
