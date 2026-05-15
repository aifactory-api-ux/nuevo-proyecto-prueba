import pytest
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.crud import create_dispatch, get_dispatch_by_id, get_dispatches, delete_dispatch, get_dispatch_stats_by_plant


@pytest.fixture
def session():
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    yield session
    session.close()


def test_create_dispatch_persists_to_db(session):
    dispatch_data = {
        'plant': 'Planta Norte',
        'distribution_center': 'CD Monterrey',
        'product': 'Producto A',
        'quantity': 120,
        'dispatched_at': datetime(2024, 6, 10, 14, 30, 0)
    }
    dispatch = create_dispatch(session, dispatch_data)
    assert dispatch.id == 1
    assert dispatch.plant == 'Planta Norte'


def test_get_dispatch_by_id_returns_dispatch(session):
    dispatch_data = {
        'plant': 'Planta Norte',
        'distribution_center': 'CD Monterrey',
        'product': 'Producto A',
        'quantity': 120,
        'dispatched_at': datetime(2024, 6, 10, 14, 30, 0)
    }
    created = create_dispatch(session, dispatch_data)
    result = get_dispatch_by_id(session, created.id)
    assert result is not None
    assert result.id == created.id


def test_get_dispatch_by_id_not_found_returns_none(session):
    result = get_dispatch_by_id(session, 999)
    assert result is None


def test_list_dispatches_returns_all(session):
    dispatch_data = {
        'plant': 'Planta Norte',
        'distribution_center': 'CD Monterrey',
        'product': 'Producto A',
        'quantity': 120,
        'dispatched_at': datetime(2024, 6, 10, 14, 30, 0)
    }
    create_dispatch(session, dispatch_data)
    dispatches = get_dispatches(session)
    assert len(dispatches) == 1


def test_delete_dispatch_removes_from_db(session):
    dispatch_data = {
        'plant': 'Planta Norte',
        'distribution_center': 'CD Monterrey',
        'product': 'Producto A',
        'quantity': 120,
        'dispatched_at': datetime(2024, 6, 10, 14, 30, 0)
    }
    created = create_dispatch(session, dispatch_data)
    result = delete_dispatch(session, created.id)
    assert result is True
    assert get_dispatch_by_id(session, created.id) is None


def test_delete_dispatch_not_found_returns_false(session):
    result = delete_dispatch(session, 999)
    assert result is False


def test_get_dispatch_stats_by_plant_aggregation(session):
    dispatch_data = {
        'plant': 'Planta Norte',
        'distribution_center': 'CD Monterrey',
        'product': 'Producto A',
        'quantity': 120,
        'dispatched_at': datetime(2024, 6, 10, 14, 30, 0)
    }
    create_dispatch(session, dispatch_data)
    stats = get_dispatch_stats_by_plant(session)
    assert len(stats) == 1
    assert stats[0]['plant'] == 'Planta Norte'
    assert stats[0]['total_quantity'] == 120


def test_get_dispatch_stats_by_plant_empty_returns_empty_list(session):
    stats = get_dispatch_stats_by_plant(session)
    assert stats == []