from fastapi import APIRouter, Depends
from datetime import datetime, date, timedelta
import uuid

from db import db
from auth import get_current_user

router = APIRouter(prefix='/dashboard', tags=['dashboard'])


@router.get('/stats')
async def stats(user: dict = Depends(get_current_user)):
    uid = user['id']
    loads = await db.loads.find({'user_id': uid}).to_list(2000)
    expenses = await db.expenses.find({'user_id': uid}).to_list(5000)

    total_revenue = sum((l.get('rate') or 0) for l in loads)
    total_expenses = sum((e.get('amount') or 0) for e in expenses)
    profit = total_revenue - total_expenses

    by_status = {'Pending': 0, 'Dispatched': 0, 'In Transit': 0, 'Delivered': 0, 'Completed': 0}
    for l in loads:
        s = l.get('status', 'Pending')
        by_status[s] = by_status.get(s, 0) + 1

    active_loads = by_status['Pending'] + by_status['Dispatched'] + by_status['In Transit']

    # compliance alerts
    today = date.today()
    items = await db.compliance.find({'user_id': uid}).to_list(500)
    alerts = 0
    for i in items:
        if i.get('status') == 'Missing':
            alerts += 1
            continue
        if i.get('expires_on'):
            try:
                d = datetime.fromisoformat(i['expires_on']).date()
                if (d - today).days <= 30:
                    alerts += 1
            except Exception:
                pass

    drivers_count = await db.drivers.count_documents({'user_id': uid})
    docs_count = await db.documents.count_documents({'user_id': uid})

    return {
        'total_revenue': round(total_revenue, 2),
        'total_expenses': round(total_expenses, 2),
        'profit': round(profit, 2),
        'loads_total': len(loads),
        'loads_active': active_loads,
        'by_status': by_status,
        'compliance_alerts': alerts,
        'drivers_count': drivers_count,
        'documents_count': docs_count,
    }


@router.post('/seed')
async def seed(user: dict = Depends(get_current_user)):
    """Populate the current account with realistic demo data. Idempotent: clears existing data."""
    uid = user['id']
    # Clear existing
    await db.drivers.delete_many({'user_id': uid})
    await db.loads.delete_many({'user_id': uid})
    await db.documents.delete_many({'user_id': uid})
    await db.expenses.delete_many({'user_id': uid})
    await db.compliance.delete_many({'user_id': uid})

    now = datetime.utcnow()
    today = date.today()

    drivers = [
        {'name': 'James Miller', 'phone': '(214) 555-0142', 'email': 'james@example.com'},
        {'name': 'Anna Reyes', 'phone': '(312) 555-0188', 'email': 'anna@example.com'},
        {'name': 'Derek Smith', 'phone': '(602) 555-0123', 'email': 'derek@example.com'},
    ]
    driver_ids = []
    for d in drivers:
        did = str(uuid.uuid4())
        driver_ids.append(did)
        await db.drivers.insert_one({
            'id': did, 'user_id': uid, 'name': d['name'], 'phone': d['phone'],
            'email': d['email'], 'notes': None, 'created_at': now,
        })

    loads = [
        {'pickup': 'Dallas, TX', 'dropoff': 'Atlanta, GA', 'rate': 3200, 'customer': 'Acme Logistics', 'miles': 781, 'driver_id': driver_ids[0], 'status': 'Delivered'},
        {'pickup': 'Chicago, IL', 'dropoff': 'St. Louis, MO', 'rate': 1450, 'customer': 'BlueLine Freight', 'miles': 297, 'driver_id': driver_ids[1], 'status': 'In Transit'},
        {'pickup': 'Phoenix, AZ', 'dropoff': 'Los Angeles, CA', 'rate': 1850, 'customer': 'Northstar Transport', 'miles': 372, 'driver_id': driver_ids[2], 'status': 'Completed'},
        {'pickup': 'New York, NY', 'dropoff': 'Boston, MA', 'rate': 1200, 'customer': 'Pinnacle Shippers', 'miles': 215, 'driver_id': None, 'status': 'Pending'},
        {'pickup': 'Houston, TX', 'dropoff': 'New Orleans, LA', 'rate': 1650, 'customer': 'Vanguard Carriers', 'miles': 348, 'driver_id': driver_ids[0], 'status': 'Dispatched'},
    ]
    load_ids = []
    for idx, l in enumerate(loads):
        lid = str(uuid.uuid4())
        load_ids.append(lid)
        await db.loads.insert_one({
            'id': lid, 'user_id': uid, 'load_number': f'L-{1001 + idx}',
            'pickup': l['pickup'], 'dropoff': l['dropoff'], 'rate': l['rate'],
            'customer': l['customer'], 'miles': l['miles'], 'driver_id': l['driver_id'],
            'pickup_date': None, 'delivery_date': None, 'notes': None,
            'status': l['status'], 'created_at': now, 'updated_at': now,
        })

    # A few expenses
    expenses = [
        {'load_id': load_ids[0], 'category': 'Fuel', 'amount': 420.50, 'description': 'Pilot #432'},
        {'load_id': load_ids[0], 'category': 'Tolls', 'amount': 38.75},
        {'load_id': load_ids[1], 'category': 'Fuel', 'amount': 180.20},
        {'load_id': load_ids[2], 'category': 'Maintenance', 'amount': 220.0, 'description': 'Tire repair'},
        {'load_id': load_ids[4], 'category': 'Fuel', 'amount': 295.0},
    ]
    for e in expenses:
        await db.expenses.insert_one({
            'id': str(uuid.uuid4()), 'user_id': uid, **e,
            'description': e.get('description'),
            'occurred_on': None, 'created_at': now,
        })

    # Compliance items
    compliance = [
        {'item_type': 'DQ File', 'entity_name': 'James Miller', 'entity_id': driver_ids[0], 'expires_on': (today + timedelta(days=120)).isoformat(), 'status': 'Complete'},
        {'item_type': 'DQ File', 'entity_name': 'Anna Reyes', 'entity_id': driver_ids[1], 'expires_on': (today + timedelta(days=20)).isoformat(), 'status': 'Expiring'},
        {'item_type': 'DQ File', 'entity_name': 'Derek Smith', 'entity_id': driver_ids[2], 'expires_on': None, 'status': 'Missing'},
        {'item_type': 'Insurance', 'entity_name': 'General Liability', 'entity_id': None, 'expires_on': (today + timedelta(days=180)).isoformat(), 'status': 'Complete'},
        {'item_type': 'Insurance', 'entity_name': 'Cargo', 'entity_id': None, 'expires_on': (today + timedelta(days=15)).isoformat(), 'status': 'Expiring'},
        {'item_type': 'Vehicle Inspection', 'entity_name': 'Truck #101', 'entity_id': None, 'expires_on': (today + timedelta(days=90)).isoformat(), 'status': 'Complete'},
        {'item_type': 'Vehicle Inspection', 'entity_name': 'Truck #102', 'entity_id': None, 'expires_on': (today - timedelta(days=5)).isoformat(), 'status': 'Missing'},
    ]
    for c in compliance:
        await db.compliance.insert_one({
            'id': str(uuid.uuid4()), 'user_id': uid, 'notes': None,
            'created_at': now, **c,
        })

    return {'ok': True, 'message': 'Demo data loaded'}
