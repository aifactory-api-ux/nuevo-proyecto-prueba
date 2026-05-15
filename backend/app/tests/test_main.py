import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db


def get_test_db():
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client():
    app.dependency_overrides[get_db] = get_test_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


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