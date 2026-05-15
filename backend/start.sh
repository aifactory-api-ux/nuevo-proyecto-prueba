#!/bin/sh
set -e
cd /app
echo ">>> Starting FastAPI..."
exec uvicorn app.main:app --host 0.0.0.0 --port 23001