from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from datetime import datetime

from db import db
from auth import get_current_user
from models import Load, LoadCreate, LoadUpdate, StatusUpdate, AssignDriver

router = APIRouter(prefix='/loads', tags=['loads'])


async def _next_load_number(user_id: str) -> str:
    # simple incremental load number per user, padded
    count = await db.loads.count_documents({'user_id': user_id})
    return f"L-{1001 + count}"


@router.get('', response_model=List[Load])
async def list_loads(
    status: Optional[str] = None,
    driver_id: Optional[str] = None,
    user: dict = Depends(get_current_user),
):
    q: dict = {'user_id': user['id']}
    if status:
        q['status'] = status
    if driver_id:
        q['driver_id'] = driver_id
    items = await db.loads.find(q).sort('created_at', -1).to_list(1000)
    return [Load(**i) for i in items]


@router.post('', response_model=Load)
async def create_load(payload: LoadCreate, user: dict = Depends(get_current_user)):
    load_number = await _next_load_number(user['id'])
    load = Load(
        user_id=user['id'],
        load_number=load_number,
        **payload.dict(),
    )
    # If a driver is assigned at creation, set status to Dispatched
    if payload.driver_id:
        load.status = 'Dispatched'
    await db.loads.insert_one(load.dict())
    return load


@router.get('/{load_id}', response_model=Load)
async def get_load(load_id: str, user: dict = Depends(get_current_user)):
    load = await db.loads.find_one({'id': load_id, 'user_id': user['id']})
    if not load:
        raise HTTPException(404, 'Load not found')
    return Load(**load)


@router.patch('/{load_id}', response_model=Load)
async def update_load(load_id: str, payload: LoadUpdate, user: dict = Depends(get_current_user)):
    upd = {k: v for k, v in payload.dict().items() if v is not None}
    if upd:
        upd['updated_at'] = datetime.utcnow()
        result = await db.loads.update_one(
            {'id': load_id, 'user_id': user['id']}, {'$set': upd}
        )
        if result.matched_count == 0:
            raise HTTPException(404, 'Load not found')
    load = await db.loads.find_one({'id': load_id, 'user_id': user['id']})
    return Load(**load)


@router.patch('/{load_id}/status', response_model=Load)
async def update_status(load_id: str, payload: StatusUpdate, user: dict = Depends(get_current_user)):
    result = await db.loads.update_one(
        {'id': load_id, 'user_id': user['id']},
        {'$set': {'status': payload.status, 'updated_at': datetime.utcnow()}},
    )
    if result.matched_count == 0:
        raise HTTPException(404, 'Load not found')
    load = await db.loads.find_one({'id': load_id, 'user_id': user['id']})
    return Load(**load)


@router.post('/{load_id}/assign', response_model=Load)
async def assign_driver(load_id: str, payload: AssignDriver, user: dict = Depends(get_current_user)):
    upd = {'driver_id': payload.driver_id, 'updated_at': datetime.utcnow()}
    # Auto-progress: if assigning a driver to a Pending load, move to Dispatched
    current = await db.loads.find_one({'id': load_id, 'user_id': user['id']})
    if not current:
        raise HTTPException(404, 'Load not found')
    if payload.driver_id and current.get('status') == 'Pending':
        upd['status'] = 'Dispatched'
    if payload.driver_id is None and current.get('status') == 'Dispatched':
        upd['status'] = 'Pending'
    await db.loads.update_one({'id': load_id, 'user_id': user['id']}, {'$set': upd})
    load = await db.loads.find_one({'id': load_id, 'user_id': user['id']})
    return Load(**load)


@router.delete('/{load_id}')
async def delete_load(load_id: str, user: dict = Depends(get_current_user)):
    result = await db.loads.delete_one({'id': load_id, 'user_id': user['id']})
    if result.deleted_count == 0:
        raise HTTPException(404, 'Load not found')
    # delete attached docs/expenses
    await db.documents.delete_many({'load_id': load_id, 'user_id': user['id']})
    await db.expenses.delete_many({'load_id': load_id, 'user_id': user['id']})
    return {'ok': True}
