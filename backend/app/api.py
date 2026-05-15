from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.models import Dispatch, DispatchCreate, DispatchList, DispatchStatsList, DispatchStats
from app.crud import create_dispatch, get_dispatches, get_dispatch_by_id, delete_dispatch, get_dispatch_stats_by_plant
from app.deps import get_db

router = APIRouter()


@router.post('/api/dispatches/', response_model=Dispatch, status_code=status.HTTP_200_OK)
def create_dispatch_endpoint(
    dispatch: DispatchCreate,
    db: Session = Depends(get_db)
):
    dispatch_data = {
        'plant': dispatch.plant,
        'distribution_center': dispatch.distribution_center,
        'product': dispatch.product,
        'quantity': dispatch.quantity,
        'dispatched_at': dispatch.dispatched_at
    }
    db_dispatch = create_dispatch(db, dispatch_data)
    return db_dispatch


@router.get('/api/dispatches/stats/plant', response_model=DispatchStatsList)
def get_dispatch_stats_endpoint(db: Session = Depends(get_db)):
    stats = get_dispatch_stats_by_plant(db)
    return {'stats': stats}


@router.get('/api/dispatches/', response_model=DispatchList)
def list_dispatches_endpoint(db: Session = Depends(get_db)):
    dispatches = get_dispatches(db)
    return {'dispatches': dispatches}


@router.get('/api/dispatches/{dispatch_id}', response_model=Dispatch)
def get_dispatch_endpoint(dispatch_id: int, db: Session = Depends(get_db)):
    dispatch = get_dispatch_by_id(db, dispatch_id)
    if dispatch is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Dispatch not found')
    return dispatch


@router.delete('/api/dispatches/{dispatch_id}')
def delete_dispatch_endpoint(dispatch_id: int, db: Session = Depends(get_db)):
    success = delete_dispatch(db, dispatch_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Dispatch not found')
    return {'ok': True}