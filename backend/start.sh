#!/bin/sh
set -e
echo ">>> Waiting for database..."
sleep 2
cd /app
python -c "from app.database import init_db; init_db()"
echo ">>> Starting FastAPI..."
exec uvicorn app.main:app --host 0.0.0.0 --port 23001