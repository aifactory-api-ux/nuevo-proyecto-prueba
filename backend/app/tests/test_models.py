import pytest
from pydantic import ValidationError
from datetime import datetime
from app.models import Dispatch, DispatchCreate, DispatchList, DispatchStats, DispatchStatsList


def test_dispatch_pydantic_model_accepts_valid_data():
    data = {
        'plant': 'Planta Norte',
        'distribution_center': 'CD Monterrey',
        'product': 'Producto A',
        'quantity': 120,
        'dispatched_at': '2024-06-10T14:30:00Z',
        'id': 1
    }
    dispatch = Dispatch(**data)
    assert dispatch.plant == 'Planta Norte'
    assert dispatch.distribution_center == 'CD Monterrey'
    assert dispatch.product == 'Producto A'
    assert dispatch.quantity == 120
    assert dispatch.id == 1
    assert hasattr(dispatch, 'dispatched_at')


def test_dispatch_create_missing_required_field_raises_validation_error():
    data = {
        'plant': 'Planta Norte',
        'distribution_center': 'CD Monterrey',
        'product': 'Producto A',
        'quantity': 120
    }
    with pytest.raises(ValidationError) as exc_info:
        DispatchCreate(**data)
    assert 'dispatched_at' in str(exc_info.value)


def test_dispatch_quantity_negative_raises_validation_error():
    data = {
        'plant': 'Planta Norte',
        'distribution_center': 'CD Monterrey',
        'product': 'Producto A',
        'quantity': -5,
        'dispatched_at': '2024-06-10T14:30:00Z'
    }
    with pytest.raises(ValidationError) as exc_info:
        DispatchCreate(**data)
    assert 'quantity' in str(exc_info.value)


def test_dispatch_list_model_serializes_multiple_dispatches():
    data = {
        'dispatches': [
            {
                'id': 1,
                'plant': 'Planta Norte',
                'distribution_center': 'CD Monterrey',
                'product': 'Producto A',
                'quantity': 120,
                'dispatched_at': '2024-06-10T14:30:00Z'
            },
            {
                'id': 2,
                'plant': 'Planta Sur',
                'distribution_center': 'CD Guadalajara',
                'product': 'Producto B',
                'quantity': 80,
                'dispatched_at': '2024-06-11T09:00:00Z'
            }
        ]
    }
    dispatch_list = DispatchList(**data)
    assert len(dispatch_list.dispatches) == 2
    assert dispatch_list.dispatches[0].plant == 'Planta Norte'
    assert dispatch_list.dispatches[1].plant == 'Planta Sur'


def test_dispatch_stats_list_model_accepts_valid_stats():
    data = {
        'stats': [
            {'plant': 'Planta Norte', 'total_quantity': 120, 'dispatch_count': 1},
            {'plant': 'Planta Sur', 'total_quantity': 80, 'dispatch_count': 1}
        ]
    }
    stats_list = DispatchStatsList(**data)
    assert len(stats_list.stats) == 2
    assert stats_list.stats[0].plant == 'Planta Norte'
    assert stats_list.stats[0].total_quantity == 120
    assert stats_list.stats[1].plant == 'Planta Sur'


def test_dispatch_sqlalchemy_model_creates_and_reads_row():
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from app.models import Base, DispatchDB

    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()

    dispatch = DispatchDB(
        plant='Planta Norte',
        distribution_center='CD Monterrey',
        product='Producto A',
        quantity=120,
        dispatched_at=datetime(2024, 6, 10, 14, 30, 0)
    )
    session.add(dispatch)
    session.commit()

    result = session.query(DispatchDB).first()
    assert result.plant == 'Planta Norte'
    assert result.distribution_center == 'CD Monterrey'
    assert result.product == 'Producto A'
    assert result.quantity == 120

    session.close()