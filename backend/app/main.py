import logging
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.api import router as api_router
from app.database import init_db

logging.basicConfig(
    level=logging.INFO,
    format='{"method": "%(method)s", "path": "%(path)s", "status_code": %(status_code)d, "request_id": "%(request_id)s"}',
    handlers=[logging.StreamHandler(sys.stdout)]
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title='Dispatch API', version='1.0.0', lifespan=lifespan)
app.include_router(api_router)


@app.get('/health')
def health_check():
    return {'status': 'healthy'}


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=23001)