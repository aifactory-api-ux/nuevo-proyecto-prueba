#!/bin/bash
set -e

echo ">>> Waiting for database to be ready..."
sleep 2

echo ">>> Running database initialization..."
cd /app
python -c "from app.database import init_db; init_db()"

echo ">>> Starting FastAPI application..."
exec uvicorn app.main:app --host 0.0.0.0 --port 23001