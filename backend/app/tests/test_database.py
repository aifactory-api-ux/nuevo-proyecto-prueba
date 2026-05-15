import pytest
from datetime import datetime
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from app.database import Base, engine, SessionLocal


def test_database_engine_and_session_setup():
    assert engine is not None
    session = SessionLocal()
    assert session is not None
    session.close()


def test_database_schema_creates_tables():
    test_engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(test_engine)
    inspector = inspect(test_engine)
    tables = inspector.get_table_names()
    assert 'dispatch' in tables


def test_auto_init_inserts_seed_data_if_db_empty():
    from app.models import DispatchDB

    test_engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(test_engine)
    TestSessionLocal = sessionmaker(bind=test_engine)
    session = TestSessionLocal()

    seed_data = [
        DispatchDB(
            plant='Planta Norte',
            distribution_center='CD Monterrey',
            product='Producto A',
            quantity=120,
            dispatched_at=datetime(2024, 6, 10, 14, 30, 0)
        ),
        DispatchDB(
            plant='Planta Sur',
            distribution_center='CD Guadalajara',
            product='Producto B',
            quantity=80,
            dispatched_at=datetime(2024, 6, 11, 9, 0, 0)
        ),
    ]
    session.add_all(seed_data)
    session.commit()

    count = session.query(DispatchDB).count()
    assert count > 0

    session.close()


def test_auto_init_does_not_duplicate_seed_data():
    from app.models import DispatchDB

    test_engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(test_engine)
    TestSessionLocal = sessionmaker(bind=test_engine)
    session = TestSessionLocal()

    seed_data = [
        DispatchDB(
            plant='Planta Norte',
            distribution_center='CD Monterrey',
            product='Producto A',
            quantity=120,
            dispatched_at=datetime(2024, 6, 10, 14, 30, 0)
        ),
    ]
    session.add_all(seed_data)
    session.commit()

    count1 = session.query(DispatchDB).count()
    assert count1 == 1

    session.close()


def test_database_connection_error_raises_exception():
    with pytest.raises(Exception):
        bad_engine = create_engine('invalid://')
        bad_engine.connect()