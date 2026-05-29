from sqlalchemy import text

from app.db.database import engine


TABLES = [
    "alerts",
    "alert_channels",
    "api_keys",
    "user_sessions",
    "status_pages",
    "incidents",
    "checks",
    "monitor_headers",
    "monitors",
    "projects",
    "users",
    "alembic_version",
]


if __name__ == "__main__":
    with engine.begin() as connection:
        db_name = connection.execute(text("SELECT current_database()")).scalar_one()
        print(f"Resetting database: {db_name}")
        connection.execute(text(f"DROP TABLE IF EXISTS {', '.join(TABLES)} CASCADE"))
    print("Done. Now run: alembic -c alembic.ini upgrade head")
