import os
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.models import Base, DispatchDB

DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///./app.db')
engine = create_engine(DATABASE_URL, connect_args={'check_same_thread': False})
SessionLocal = sessionmaker(bind=engine)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(DispatchDB).count() == 0:
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
            db.add_all(seed_data)
            db.commit()
    finally:
        db.close()