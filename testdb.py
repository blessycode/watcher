from sqlalchemy import create_engine

engine = create_engine("postgresql://postgres:Code%40123zhou@localhost:5432/watcher_db")

try:
    with engine.connect() as conn:
        print("DATABASE CONNECTED SUCCESSFULLY")
except Exception as e:
    print(e)
