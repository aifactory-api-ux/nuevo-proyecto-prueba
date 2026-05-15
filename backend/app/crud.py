from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from app.models import DispatchCreate, DispatchDB


def create_dispatch(db: Session, dispatch_data: dict) -> DispatchDB:
    dispatch = DispatchDB(
        plant=dispatch_data['plant'],
        distribution_center=dispatch_data['distribution_center'],
        product=dispatch_data['product'],
        quantity=dispatch_data['quantity'],
        dispatched_at=dispatch_data['dispatched_at']
    )
    db.add(dispatch)
    db.commit()
    db.refresh(dispatch)
    return dispatch


def get_dispatch_by_id(db: Session, dispatch_id: int) -> Optional[DispatchDB]:
    return db.query(DispatchDB).filter(DispatchDB.id == dispatch_id).first()


def get_dispatches(db: Session) -> list:
    return db.query(DispatchDB).all()


def delete_dispatch(db: Session, dispatch_id: int) -> bool:
    dispatch = db.query(DispatchDB).filter(DispatchDB.id == dispatch_id).first()
    if dispatch is None:
        return False
    db.delete(dispatch)
    db.commit()
    return True


def get_dispatch_stats_by_plant(db: Session) -> list:
    from sqlalchemy import func
    results = db.query(
        DispatchDB.plant,
        func.sum(DispatchDB.quantity).label('total_quantity'),
        func.count(DispatchDB.id).label('dispatch_count')
    ).group_by(DispatchDB.plant).all()

    return [
        {
            'plant': row.plant,
            'total_quantity': row.total_quantity,
            'dispatch_count': row.dispatch_count
        }
        for row in results
    ]