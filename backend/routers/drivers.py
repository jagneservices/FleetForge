from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime

from db import db
from auth import get_current_user
from models import Driver, DriverCreate, DriverUpdate

router = APIRouter(prefix='/drivers', tags=['drivers'])


@router.get('', response_model=List[Driver])
async def list_drivers(user: dict = Depends(get_current_user)):
    items = await db.drivers.find({'user_id': user['id']}).sort('created_at', -1).to_list(500)
    return [Driver(**i) for i in items]


@router.post('', response_model=Driver)
async def create_driver(payload: DriverCreate, user: dict = Depends(get_current_user)):
    d = Driver(user_id=user['id'], **payload.dict())
    await db.drivers.insert_one(d.dict())
    return d


@router.get('/{driver_id}', response_model=Driver)
async def get_driver(driver_id: str, user: dict = Depends(get_current_user)):
    d = await db.drivers.find_one({'id': driver_id, 'user_id': user['id']})
    if not d:
        raise HTTPException(404, 'Driver not found')
    return Driver(**d)


@router.patch('/{driver_id}', response_model=Driver)
async def update_driver(driver_id: str, payload: DriverUpdate, user: dict = Depends(get_current_user)):
    upd = {k: v for k, v in payload.dict().items() if v is not None}
    if upd:
        result = await db.drivers.update_one({'id': driver_id, 'user_id': user['id']}, {'$set': upd})
        if result.matched_count == 0:
            raise HTTPException(404, 'Driver not found')
    d = await db.drivers.find_one({'id': driver_id, 'user_id': user['id']})
    return Driver(**d)


@router.delete('/{driver_id}')
async def delete_driver(driver_id: str, user: dict = Depends(get_current_user)):
    result = await db.drivers.delete_one({'id': driver_id, 'user_id': user['id']})
    if result.deleted_count == 0:
        raise HTTPException(404, 'Driver not found')
    # unassign from any loads
    await db.loads.update_many({'driver_id': driver_id, 'user_id': user['id']}, {'$set': {'driver_id': None}})
    return {'ok': True}
