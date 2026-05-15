import pytest
from contextlib import asynccontextmanager
from datetime import datetime
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


def test_create_dispatch_success(client):
    response = client.post(
        '/api/dispatches/',
        json={
            'plant': 'Planta Norte',
            'distribution_center': 'CD Monterrey',
            'product': 'Producto A',
            'quantity': 120,
            'dispatched_at': '2024-06-10T14:30:00Z'
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert 'id' in data
    assert data['plant'] == 'Planta Norte'
    assert data['quantity'] == 120


def test_create_dispatch_missing_required_field_returns_422(client):
    response = client.post(
        '/api/dispatches/',
        json={
            'distribution_center': 'CD Monterrey',
            'product': 'Producto A',
            'quantity': 120,
            'dispatched_at': '2024-06-10T14:30:00Z'
        }
    )
    assert response.status_code == 422


def test_create_dispatch_invalid_quantity_type_returns_422(client):
    response = client.post(
        '/api/dispatches/',
        json={
            'plant': 'Planta Norte',
            'distribution_center': 'CD Monterrey',
            'product': 'Producto A',
            'quantity': 'not-an-integer',
            'dispatched_at': '2024-06-10T14:30:00Z'
        }
    )
    assert response.status_code == 422


def test_list_dispatches_returns_all_created_dispatches(client):
    client.post(
        '/api/dispatches/',
        json={
            'plant': 'Planta Norte',
            'distribution_center': 'CD Monterrey',
            'product': 'Producto A',
            'quantity': 120,
            'dispatched_at': '2024-06-10T14:30:00Z'
        }
    )
    response = client.get('/api/dispatches/')
    assert response.status_code == 200
    data = response.json()
    assert 'dispatches' in data
    assert len(data['dispatches']) >= 1


def test_list_dispatches_empty_returns_empty_list(client):
    response = client.get('/api/dispatches/')
    assert response.status_code == 200
    data = response.json()
    assert 'dispatches' in data


def test_get_dispatch_by_id_success(client):
    create_resp = client.post(
        '/api/dispatches/',
        json={
            'plant': 'Planta Norte',
            'distribution_center': 'CD Monterrey',
            'product': 'Producto A',
            'quantity': 120,
            'dispatched_at': '2024-06-10T14:30:00Z'
        }
    )
    dispatch_id = create_resp.json()['id']
    response = client.get(f'/api/dispatches/{dispatch_id}')
    assert response.status_code == 200
    data = response.json()
    assert data['id'] == dispatch_id
    assert data['plant'] == 'Planta Norte'


def test_get_dispatch_by_id_not_found_returns_404(client):
    response = client.get('/api/dispatches/999')
    assert response.status_code == 404


def test_delete_dispatch_success(client):
    create_resp = client.post(
        '/api/dispatches/',
        json={
            'plant': 'Planta Norte',
            'distribution_center': 'CD Monterrey',
            'product': 'Producto A',
            'quantity': 120,
            'dispatched_at': '2024-06-10T14:30:00Z'
        }
    )
    dispatch_id = create_resp.json()['id']
    response = client.delete(f'/api/dispatches/{dispatch_id}')
    assert response.status_code == 200
    assert response.json() == {'ok': True}


def test_delete_dispatch_not_found_returns_404(client):
    response = client.delete('/api/dispatches/999')
    assert response.status_code == 404


def test_get_dispatch_stats_by_plant_success(client):
    client.post(
        '/api/dispatches/',
        json={
            'plant': 'Planta Norte',
            'distribution_center': 'CD Monterrey',
            'product': 'Producto A',
            'quantity': 120,
            'dispatched_at': '2024-06-10T14:30:00Z'
        }
    )
    response = client.get('/api/dispatches/stats/plant')
    assert response.status_code == 200
    data = response.json()
    assert 'stats' in data
    assert len(data['stats']) >= 1