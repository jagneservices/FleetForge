from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime, date

from db import db
from auth import get_current_user
from models import ComplianceItem, ComplianceCreate, ComplianceUpdate

router = APIRouter(prefix='/compliance', tags=['compliance'])


def _auto_status(item: dict) -> str:
    # If user explicitly set Missing, keep it. Otherwise compute from expires_on.
    if not item.get('expires_on'):
        return item.get('status') or 'Complete'
    try:
        d = datetime.fromisoformat(item['expires_on']).date()
    except Exception:
        return item.get('status') or 'Complete'
    today = date.today()
    days = (d - today).days
    if days < 0:
        return 'Missing'
    if days <= 30:
        return 'Expiring'
    return 'Complete'


@router.get('', response_model=List[ComplianceItem])
async def list_items(user: dict = Depends(get_current_user)):
    items = await db.compliance.find({'user_id': user['id']}).sort('created_at', -1).to_list(500)
    out = []
    for i in items:
        i['status'] = _auto_status(i)
        out.append(ComplianceItem(**i))
    return out


@router.post('', response_model=ComplianceItem)
async def create_item(payload: ComplianceCreate, user: dict = Depends(get_current_user)):
    item = ComplianceItem(user_id=user['id'], **payload.dict())
    item.status = _auto_status(item.dict())
    await db.compliance.insert_one(item.dict())
    return item


@router.patch('/{item_id}', response_model=ComplianceItem)
async def update_item(item_id: str, payload: ComplianceUpdate, user: dict = Depends(get_current_user)):
    upd = {k: v for k, v in payload.dict().items() if v is not None}
    if upd:
        await db.compliance.update_one({'id': item_id, 'user_id': user['id']}, {'$set': upd})
    i = await db.compliance.find_one({'id': item_id, 'user_id': user['id']})
    if not i:
        raise HTTPException(404, 'Compliance item not found')
    i['status'] = _auto_status(i)
    await db.compliance.update_one({'id': item_id, 'user_id': user['id']}, {'$set': {'status': i['status']}})
    return ComplianceItem(**i)


@router.delete('/{item_id}')
async def delete_item(item_id: str, user: dict = Depends(get_current_user)):
    res = await db.compliance.delete_one({'id': item_id, 'user_id': user['id']})
    if res.deleted_count == 0:
        raise HTTPException(404, 'Compliance item not found')
    return {'ok': True}
