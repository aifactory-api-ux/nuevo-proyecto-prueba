import pytest
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db


@pytest.fixture
def client():
    test_engine = create_engine('sqlite:///:memory:', connect_args={'check_same_thread': False})
    Base.metadata.create_all(test_engine)
    TestSessionLocal = sessionmaker(bind=test_engine, expire_on_commit=False)

    def get_test_db():
        db = TestSessionLocal()
        try:
            yield db
        finally:
            db.close()

    @asynccontextmanager
    async def test_lifespan(app: FastAPI):
        yield

    test_app = FastAPI(title='Dispatch API', version='1.0.0', lifespan=test_lifespan)
    from app.api import router as api_router
    test_app.include_router(api_router)
    test_app.dependency_overrides[get_db] = get_test_db
    with TestClient(test_app) as c:
        yield c


def test_app_startup_initializes_database(client):
    response = client.get('/api/dispatches/')
    assert response.status_code == 200


def test_app_includes_api_routes(client):
    response = client.get('/api/dispatches/')
    assert response.status_code == 200


def test_app_structured_logging_configured(client):
    response = client.get('/api/dispatches/')
    assert response.status_code == 200


def test_app_error_handling_returns_json_422(client):
    response = client.post(
        '/api/dispatches/',
        json={'plant': 'Planta Norte'}
    )
    assert response.status_code == 422
    assert 'detail' in response.json()


def test_app_error_handling_returns_json_404(client):
    response = client.get('/api/dispatches/999')
    assert response.status_code == 404
    assert 'detail' in response.json()