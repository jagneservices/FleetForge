from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional

from db import db
from auth import get_current_user
from models import Expense, ExpenseCreate

router = APIRouter(prefix='/expenses', tags=['expenses'])


@router.get('', response_model=List[Expense])
async def list_expenses(
    load_id: Optional[str] = None,
    user: dict = Depends(get_current_user),
):
    q: dict = {'user_id': user['id']}
    if load_id:
        q['load_id'] = load_id
    items = await db.expenses.find(q).sort('created_at', -1).to_list(2000)
    return [Expense(**i) for i in items]


@router.post('', response_model=Expense)
async def create_expense(payload: ExpenseCreate, user: dict = Depends(get_current_user)):
    if payload.load_id:
        ok = await db.loads.find_one({'id': payload.load_id, 'user_id': user['id']})
        if not ok:
            raise HTTPException(404, 'Load not found')
    e = Expense(user_id=user['id'], **payload.dict())
    await db.expenses.insert_one(e.dict())
    return e


@router.delete('/{expense_id}')
async def delete_expense(expense_id: str, user: dict = Depends(get_current_user)):
    res = await db.expenses.delete_one({'id': expense_id, 'user_id': user['id']})
    if res.deleted_count == 0:
        raise HTTPException(404, 'Expense not found')
    return {'ok': True}
