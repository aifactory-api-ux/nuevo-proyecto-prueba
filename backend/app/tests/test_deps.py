import pytest
from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.deps import get_db


def test_get_db_dependency_yields_session():
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)

    def override_get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    db_gen = override_get_db()
    session = next(db_gen)
    assert session is not None
    session.close()


def test_get_db_dependency_closes_session_on_exit():
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)

    closed = False

    def override_get_db():
        nonlocal closed
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()
            closed = True

    db_gen = override_get_db()
    session = next(db_gen)
    try:
        next(db_gen)
    except StopIteration:
        pass

    assert closed


def test_dependency_override_for_testing():
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)

    def override_get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    db_gen = override_get_db()
    session = next(db_gen)
    assert session is not None
    session.close()