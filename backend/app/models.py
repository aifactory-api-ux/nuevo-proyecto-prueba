from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class DispatchBase(BaseModel):
    plant: str
    distribution_center: str
    product: str
    quantity: int = Field(..., gt=0)
    dispatched_at: datetime


class DispatchCreate(DispatchBase):
    pass


class Dispatch(DispatchBase):
    id: int

    class Config:
        orm_mode = True


class DispatchList(BaseModel):
    dispatches: List[Dispatch]


class DispatchStats(BaseModel):
    plant: str
    total_quantity: int
    dispatch_count: int


class DispatchStatsList(BaseModel):
    stats: List[DispatchStats]


class DispatchDB(Base):
    __tablename__ = 'dispatch'

    id = Column(Integer, primary_key=True, index=True)
    plant = Column(String, nullable=False)
    distribution_center = Column(String, nullable=False)
    product = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    dispatched_at = Column(DateTime, nullable=False)