import re
import random
import base64
from typing import Optional, List
from datetime import datetime
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form

from db import db
from auth import get_current_user
from models import DocumentOut, ParseResult

router = APIRouter(prefix='/documents', tags=['documents'])

MAX_BYTES = 8 * 1024 * 1024  # 8 MB

# Sample data for mocked extraction
_CITY_PAIRS = [
    ('Dallas, TX', 'Atlanta, GA', 781),
    ('Chicago, IL', 'St. Louis, MO', 297),
    ('Phoenix, AZ', 'Los Angeles, CA', 372),
    ('New York, NY', 'Boston, MA', 215),
    ('Houston, TX', 'New Orleans, LA', 348),
    ('Denver, CO', 'Salt Lake City, UT', 525),
    ('Seattle, WA', 'Portland, OR', 174),
    ('Miami, FL', 'Charlotte, NC', 730),
]
_CUSTOMERS = ['Acme Logistics', 'BlueLine Freight', 'Northstar Transport', 'Pinnacle Shippers', 'Vanguard Carriers']


def _classify(filename: str, mime: str) -> str:
    name = (filename or '').lower()
    if any(k in name for k in ['ratecon', 'rate_con', 'rate-con', 'rateconfirmation', 'rc-', 'ratesheet']):
        return 'Rate Confirmation'
    if any(k in name for k in ['bol', 'bill_of_lading', 'pod']):
        return 'BOL'
    if any(k in name for k in ['receipt', 'fuel', 'toll', 'invoice']):
        return 'Receipt'
    return 'Other'


def _mock_extract_rate_con(filename: str) -> dict:
    """Mock parsing of a rate confirmation. Tries to read hints from the filename,
    otherwise returns realistic random values."""
    name = filename or ''
    pickup, dropoff, miles = random.choice(_CITY_PAIRS)
    rate = round(random.uniform(1800, 4200), 2)

    # Try to pull a rate from filename like ratecon_3500.pdf
    m = re.search(r'(\$|_)([0-9]{3,5})', name)
    if m:
        try:
            rate = float(m.group(2))
        except Exception:
            pass

    customer = random.choice(_CUSTOMERS)
    return {
        'pickup': pickup,
        'dropoff': dropoff,
        'rate': rate,
        'customer': customer,
        'miles': miles,
        'pickup_date': None,
        'delivery_date': None,
    }


def _doc_to_out(d: dict) -> DocumentOut:
    return DocumentOut(
        id=d['id'],
        user_id=d['user_id'],
        load_id=d.get('load_id'),
        doc_type=d['doc_type'],
        filename=d['filename'],
        mime_type=d['mime_type'],
        size=d['size'],
        extracted=d.get('extracted'),
        created_at=d['created_at'],
    )


@router.post('/parse', response_model=ParseResult)
async def parse_only(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    """Parse a document without saving it. Used for previewing fields in load creation."""
    contents = await file.read()
    if len(contents) > MAX_BYTES:
        raise HTTPException(413, 'File too large (max 8MB)')
    doc_type = _classify(file.filename or '', file.content_type or '')
    extracted = _mock_extract_rate_con(file.filename or '') if doc_type == 'Rate Confirmation' else {}
    return ParseResult(doc_type=doc_type, extracted=extracted)


@router.post('/upload', response_model=DocumentOut)
async def upload(
    file: UploadFile = File(...),
    load_id: Optional[str] = Form(None),
    doc_type: Optional[str] = Form(None),
    user: dict = Depends(get_current_user),
):
    contents = await file.read()
    if len(contents) > MAX_BYTES:
        raise HTTPException(413, 'File too large (max 8MB)')

    # Validate load_id belongs to user (if provided)
    if load_id:
        ok = await db.loads.find_one({'id': load_id, 'user_id': user['id']})
        if not ok:
            raise HTTPException(404, 'Load not found')

    chosen_type = doc_type or _classify(file.filename or '', file.content_type or '')
    extracted = _mock_extract_rate_con(file.filename or '') if chosen_type == 'Rate Confirmation' else None

    doc = {
        'id': str(uuid.uuid4()),
        'user_id': user['id'],
        'load_id': load_id,
        'doc_type': chosen_type,
        'filename': file.filename or 'document',
        'mime_type': file.content_type or 'application/octet-stream',
        'size': len(contents),
        # Store base64 of file (small files only for MVP)
        'data_b64': base64.b64encode(contents).decode('ascii'),
        'extracted': extracted,
        'created_at': datetime.utcnow(),
    }
    await db.documents.insert_one(doc)
    return _doc_to_out(doc)


@router.get('', response_model=List[DocumentOut])
async def list_documents(
    load_id: Optional[str] = None,
    user: dict = Depends(get_current_user),
):
    q: dict = {'user_id': user['id']}
    if load_id:
        q['load_id'] = load_id
    items = await db.documents.find(q, {'data_b64': 0}).sort('created_at', -1).to_list(500)
    return [_doc_to_out(d) for d in items]


@router.delete('/{doc_id}')
async def delete_doc(doc_id: str, user: dict = Depends(get_current_user)):
    res = await db.documents.delete_one({'id': doc_id, 'user_id': user['id']})
    if res.deleted_count == 0:
        raise HTTPException(404, 'Document not found')
    return {'ok': True}
