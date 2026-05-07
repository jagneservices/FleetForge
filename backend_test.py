#!/usr/bin/env python3
"""
Comprehensive backend API tests for FleetForge
Tests all endpoints with proper auth, tenancy isolation, and business logic validation
"""
import requests
import uuid
import io
from datetime import datetime, timedelta, date
import sys

# Base URL from frontend .env
BASE_URL = "https://trucking-hub-18.preview.emergentagent.com/api"

# Test results tracking
passed = 0
failed = 0
errors = []

def log_pass(test_name):
    global passed
    passed += 1
    print(f"✅ {test_name}")

def log_fail(test_name, reason):
    global failed, errors
    failed += 1
    error_msg = f"❌ {test_name}: {reason}"
    print(error_msg)
    errors.append(error_msg)

def random_email():
    return f"test_{uuid.uuid4().hex[:8]}@example.com"

def test_auth():
    """Test authentication flows"""
    print("\n=== Testing Auth ===")
    
    # 1. Register new user
    email = random_email()
    password = "SecurePass123!"
    company = "Test Logistics Inc"
    
    resp = requests.post(f"{BASE_URL}/auth/register", json={
        "email": email,
        "password": password,
        "company_name": company
    })
    
    if resp.status_code != 200:
        log_fail("Auth: Register new user", f"Status {resp.status_code}: {resp.text}")
        return None, None
    
    data = resp.json()
    if "access_token" not in data or "user" not in data:
        log_fail("Auth: Register returns token and user", f"Missing fields: {data}")
        return None, None
    
    token = data["access_token"]
    user_id = data["user"]["id"]
    
    if data["user"]["email"] != email.lower():
        log_fail("Auth: Email normalized to lowercase", f"Expected {email.lower()}, got {data['user']['email']}")
    else:
        log_pass("Auth: Register new user with token")
    
    # 2. Verify /auth/me with token
    resp = requests.get(f"{BASE_URL}/auth/me", headers={"Authorization": f"Bearer {token}"})
    if resp.status_code != 200:
        log_fail("Auth: /me with valid token", f"Status {resp.status_code}")
    else:
        me_data = resp.json()
        if me_data["id"] == user_id and me_data["email"] == email.lower():
            log_pass("Auth: /me returns correct user")
        else:
            log_fail("Auth: /me user data mismatch", f"Expected {user_id}/{email}, got {me_data}")
    
    # 3. Re-register same email should fail
    resp = requests.post(f"{BASE_URL}/auth/register", json={
        "email": email,
        "password": "different",
    })
    if resp.status_code == 400:
        log_pass("Auth: Re-register same email returns 400")
    else:
        log_fail("Auth: Re-register same email", f"Expected 400, got {resp.status_code}")
    
    # 4. Login with wrong password
    resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email,
        "password": "WrongPassword"
    })
    if resp.status_code == 401:
        log_pass("Auth: Login with wrong password returns 401")
    else:
        log_fail("Auth: Login with wrong password", f"Expected 401, got {resp.status_code}")
    
    # 5. Login with correct password
    resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email,
        "password": password
    })
    if resp.status_code == 200 and "access_token" in resp.json():
        log_pass("Auth: Login with correct password")
    else:
        log_fail("Auth: Login with correct password", f"Status {resp.status_code}")
    
    # 6. /me without token
    resp = requests.get(f"{BASE_URL}/auth/me")
    if resp.status_code == 401:
        log_pass("Auth: /me without token returns 401")
    else:
        log_fail("Auth: /me without token", f"Expected 401, got {resp.status_code}")
    
    return token, user_id

def test_drivers(token):
    """Test drivers CRUD"""
    print("\n=== Testing Drivers CRUD ===")
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. Create driver
    resp = requests.post(f"{BASE_URL}/drivers", headers=headers, json={
        "name": "John Doe",
        "phone": "(555) 123-4567",
        "email": "john@example.com",
        "notes": "Experienced driver"
    })
    if resp.status_code != 200:
        log_fail("Drivers: Create driver", f"Status {resp.status_code}: {resp.text}")
        return None
    
    driver = resp.json()
    driver_id = driver["id"]
    log_pass("Drivers: Create driver")
    
    # 2. List drivers
    resp = requests.get(f"{BASE_URL}/drivers", headers=headers)
    if resp.status_code == 200 and len(resp.json()) >= 1:
        log_pass("Drivers: List drivers")
    else:
        log_fail("Drivers: List drivers", f"Status {resp.status_code} or empty list")
    
    # 3. Get single driver
    resp = requests.get(f"{BASE_URL}/drivers/{driver_id}", headers=headers)
    if resp.status_code == 200 and resp.json()["name"] == "John Doe":
        log_pass("Drivers: Get single driver")
    else:
        log_fail("Drivers: Get single driver", f"Status {resp.status_code}")
    
    # 4. Update driver
    resp = requests.patch(f"{BASE_URL}/drivers/{driver_id}", headers=headers, json={
        "phone": "(555) 999-8888"
    })
    if resp.status_code == 200 and resp.json()["phone"] == "(555) 999-8888":
        log_pass("Drivers: Update driver")
    else:
        log_fail("Drivers: Update driver", f"Status {resp.status_code}")
    
    return driver_id

def test_loads(token, driver_id):
    """Test loads CRUD, status transitions, and assignment logic"""
    print("\n=== Testing Loads CRUD + Status + Assign ===")
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. Create load without driver (should be Pending)
    resp = requests.post(f"{BASE_URL}/loads", headers=headers, json={
        "pickup": "Dallas, TX",
        "dropoff": "Houston, TX",
        "rate": 1500.0,
        "customer": "Test Corp"
    })
    if resp.status_code != 200:
        log_fail("Loads: Create load without driver", f"Status {resp.status_code}: {resp.text}")
        return None, None
    
    load1 = resp.json()
    load1_id = load1["id"]
    
    if load1["status"] == "Pending" and load1["load_number"].startswith("L-"):
        log_pass("Loads: Create without driver → status Pending, load_number starts with L-")
    else:
        log_fail("Loads: Create without driver", f"Status: {load1['status']}, load_number: {load1['load_number']}")
    
    # 2. Create load with driver (should be Dispatched)
    resp = requests.post(f"{BASE_URL}/loads", headers=headers, json={
        "pickup": "Austin, TX",
        "dropoff": "San Antonio, TX",
        "rate": 800.0,
        "driver_id": driver_id
    })
    if resp.status_code != 200:
        log_fail("Loads: Create load with driver", f"Status {resp.status_code}")
        return load1_id, None
    
    load2 = resp.json()
    load2_id = load2["id"]
    
    if load2["status"] == "Dispatched":
        log_pass("Loads: Create with driver → status Dispatched")
    else:
        log_fail("Loads: Create with driver", f"Expected Dispatched, got {load2['status']}")
    
    # 3. Assign driver to Pending load (should auto-bump to Dispatched)
    resp = requests.post(f"{BASE_URL}/loads/{load1_id}/assign", headers=headers, json={
        "driver_id": driver_id
    })
    if resp.status_code == 200:
        updated = resp.json()
        if updated["status"] == "Dispatched" and updated["driver_id"] == driver_id:
            log_pass("Loads: Assign driver to Pending → auto-bump to Dispatched")
        else:
            log_fail("Loads: Assign driver auto-bump", f"Status: {updated['status']}, driver: {updated.get('driver_id')}")
    else:
        log_fail("Loads: Assign driver to Pending", f"Status {resp.status_code}")
    
    # 4. Unassign driver from Dispatched load (should drop to Pending)
    resp = requests.post(f"{BASE_URL}/loads/{load1_id}/assign", headers=headers, json={
        "driver_id": None
    })
    if resp.status_code == 200:
        updated = resp.json()
        if updated["status"] == "Pending" and updated["driver_id"] is None:
            log_pass("Loads: Unassign driver from Dispatched → drop to Pending")
        else:
            log_fail("Loads: Unassign driver drop to Pending", f"Status: {updated['status']}")
    else:
        log_fail("Loads: Unassign driver", f"Status {resp.status_code}")
    
    # 5. Update status via PATCH /status
    for status in ["Dispatched", "In Transit", "Delivered", "Completed"]:
        resp = requests.patch(f"{BASE_URL}/loads/{load1_id}/status", headers=headers, json={
            "status": status
        })
        if resp.status_code == 200 and resp.json()["status"] == status:
            log_pass(f"Loads: Update status to {status}")
        else:
            log_fail(f"Loads: Update status to {status}", f"Status {resp.status_code}")
    
    # 6. Filter by status
    resp = requests.get(f"{BASE_URL}/loads?status=Completed", headers=headers)
    if resp.status_code == 200:
        loads = resp.json()
        if all(l["status"] == "Completed" for l in loads):
            log_pass("Loads: Filter by status")
        else:
            log_fail("Loads: Filter by status", "Non-Completed loads in result")
    else:
        log_fail("Loads: Filter by status", f"Status {resp.status_code}")
    
    # 7. Filter by driver_id
    resp = requests.get(f"{BASE_URL}/loads?driver_id={driver_id}", headers=headers)
    if resp.status_code == 200:
        loads = resp.json()
        if all(l.get("driver_id") == driver_id for l in loads):
            log_pass("Loads: Filter by driver_id")
        else:
            log_fail("Loads: Filter by driver_id", "Wrong driver in results")
    else:
        log_fail("Loads: Filter by driver_id", f"Status {resp.status_code}")
    
    return load1_id, load2_id

def test_documents(token, load_id):
    """Test document upload and parsing"""
    print("\n=== Testing Documents Upload + Parse ===")
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. Parse rate confirmation (should extract rate from filename)
    file_content = b"Mock PDF content for rate confirmation"
    files = {"file": ("ratecon_3500.pdf", io.BytesIO(file_content), "application/pdf")}
    
    resp = requests.post(f"{BASE_URL}/documents/parse", headers=headers, files=files)
    if resp.status_code != 200:
        log_fail("Documents: Parse rate confirmation", f"Status {resp.status_code}: {resp.text}")
    else:
        data = resp.json()
        if data["doc_type"] == "Rate Confirmation" and "extracted" in data:
            extracted = data["extracted"]
            if extracted.get("rate") == 3500.0:
                log_pass("Documents: Parse rate confirmation with extracted rate from filename")
            else:
                log_fail("Documents: Parse rate extraction", f"Expected rate 3500, got {extracted.get('rate')}")
        else:
            log_fail("Documents: Parse rate confirmation", f"Wrong doc_type or missing extracted: {data}")
    
    # 2. Parse BOL
    files = {"file": ("bol_signed.pdf", io.BytesIO(b"BOL content"), "application/pdf")}
    resp = requests.post(f"{BASE_URL}/documents/parse", headers=headers, files=files)
    if resp.status_code == 200 and resp.json()["doc_type"] == "BOL":
        log_pass("Documents: Parse BOL classification")
    else:
        log_fail("Documents: Parse BOL", f"Status {resp.status_code} or wrong type")
    
    # 3. Parse receipt
    files = {"file": ("fuel_receipt.jpg", io.BytesIO(b"Receipt image"), "image/jpeg")}
    resp = requests.post(f"{BASE_URL}/documents/parse", headers=headers, files=files)
    if resp.status_code == 200 and resp.json()["doc_type"] == "Receipt":
        log_pass("Documents: Parse Receipt classification")
    else:
        log_fail("Documents: Parse Receipt", f"Status {resp.status_code} or wrong type")
    
    # 4. Upload document with load_id
    files = {"file": ("test_doc.pdf", io.BytesIO(b"Test document"), "application/pdf")}
    data = {"load_id": load_id, "doc_type": "BOL"}
    
    resp = requests.post(f"{BASE_URL}/documents/upload", headers=headers, files=files, data=data)
    if resp.status_code != 200:
        log_fail("Documents: Upload with load_id", f"Status {resp.status_code}: {resp.text}")
        return None
    
    doc = resp.json()
    doc_id = doc["id"]
    
    if doc["load_id"] == load_id and doc["doc_type"] == "BOL":
        log_pass("Documents: Upload with load_id and doc_type")
    else:
        log_fail("Documents: Upload document", f"load_id or doc_type mismatch")
    
    # 5. List documents filtered by load_id
    resp = requests.get(f"{BASE_URL}/documents?load_id={load_id}", headers=headers)
    if resp.status_code == 200:
        docs = resp.json()
        if len(docs) >= 1 and all(d["load_id"] == load_id for d in docs):
            # Verify data_b64 is NOT in response
            if "data_b64" not in docs[0]:
                log_pass("Documents: List by load_id (without data_b64)")
            else:
                log_fail("Documents: List excludes data_b64", "data_b64 present in response")
        else:
            log_fail("Documents: List by load_id", "Wrong load_id in results")
    else:
        log_fail("Documents: List by load_id", f"Status {resp.status_code}")
    
    # 6. Delete document
    resp = requests.delete(f"{BASE_URL}/documents/{doc_id}", headers=headers)
    if resp.status_code == 200:
        log_pass("Documents: Delete document")
    else:
        log_fail("Documents: Delete document", f"Status {resp.status_code}")
    
    return doc_id

def test_expenses(token, load_id):
    """Test expenses CRUD"""
    print("\n=== Testing Expenses CRUD ===")
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. Create expense with load_id
    resp = requests.post(f"{BASE_URL}/expenses", headers=headers, json={
        "load_id": load_id,
        "category": "Fuel",
        "amount": 120.50,
        "description": "Fuel stop in Dallas"
    })
    if resp.status_code != 200:
        log_fail("Expenses: Create with load_id", f"Status {resp.status_code}: {resp.text}")
        return None
    
    expense = resp.json()
    expense_id = expense["id"]
    log_pass("Expenses: Create with load_id")
    
    # 2. Create expense with invalid load_id (should fail)
    resp = requests.post(f"{BASE_URL}/expenses", headers=headers, json={
        "load_id": "invalid-load-id",
        "category": "Tolls",
        "amount": 25.0
    })
    if resp.status_code == 404:
        log_pass("Expenses: Create with invalid load_id returns 404")
    else:
        log_fail("Expenses: Create with invalid load_id", f"Expected 404, got {resp.status_code}")
    
    # 3. List expenses filtered by load_id
    resp = requests.get(f"{BASE_URL}/expenses?load_id={load_id}", headers=headers)
    if resp.status_code == 200:
        expenses = resp.json()
        if len(expenses) >= 1 and all(e["load_id"] == load_id for e in expenses):
            log_pass("Expenses: List filtered by load_id")
        else:
            log_fail("Expenses: List by load_id", "Wrong load_id in results")
    else:
        log_fail("Expenses: List by load_id", f"Status {resp.status_code}")
    
    # 4. Delete expense
    resp = requests.delete(f"{BASE_URL}/expenses/{expense_id}", headers=headers)
    if resp.status_code == 200:
        log_pass("Expenses: Delete expense")
    else:
        log_fail("Expenses: Delete expense", f"Status {resp.status_code}")
    
    return expense_id

def test_compliance(token):
    """Test compliance auto-status computation"""
    print("\n=== Testing Compliance Auto-Status ===")
    headers = {"Authorization": f"Bearer {token}"}
    
    today = date.today()
    
    # 1. Create item expiring in 60 days (should be Complete)
    expires_60 = (today + timedelta(days=60)).isoformat()
    resp = requests.post(f"{BASE_URL}/compliance", headers=headers, json={
        "item_type": "DQ File",
        "entity_name": "Test Driver 1",
        "expires_on": expires_60
    })
    if resp.status_code == 200:
        item = resp.json()
        if item["status"] == "Complete":
            log_pass("Compliance: expires_on 60 days future → status Complete")
        else:
            log_fail("Compliance: 60 days future status", f"Expected Complete, got {item['status']}")
    else:
        log_fail("Compliance: Create item 60 days", f"Status {resp.status_code}")
    
    # 2. Create item expiring in 10 days (should be Expiring)
    expires_10 = (today + timedelta(days=10)).isoformat()
    resp = requests.post(f"{BASE_URL}/compliance", headers=headers, json={
        "item_type": "Insurance",
        "entity_name": "Cargo Insurance",
        "expires_on": expires_10
    })
    if resp.status_code == 200:
        item = resp.json()
        if item["status"] == "Expiring":
            log_pass("Compliance: expires_on 10 days future → status Expiring")
        else:
            log_fail("Compliance: 10 days future status", f"Expected Expiring, got {item['status']}")
    else:
        log_fail("Compliance: Create item 10 days", f"Status {resp.status_code}")
    
    # 3. Create item expired 5 days ago (should be Missing)
    expires_past = (today - timedelta(days=5)).isoformat()
    resp = requests.post(f"{BASE_URL}/compliance", headers=headers, json={
        "item_type": "Vehicle Inspection",
        "entity_name": "Truck #101",
        "expires_on": expires_past
    })
    if resp.status_code == 200:
        item = resp.json()
        if item["status"] == "Missing":
            log_pass("Compliance: expires_on 5 days past → status Missing")
        else:
            log_fail("Compliance: 5 days past status", f"Expected Missing, got {item['status']}")
    else:
        log_fail("Compliance: Create item expired", f"Status {resp.status_code}")
    
    # 4. Create item with no expires_on and explicit status='Missing' (should preserve)
    resp = requests.post(f"{BASE_URL}/compliance", headers=headers, json={
        "item_type": "DQ File",
        "entity_name": "Test Driver 2",
        "status": "Missing"
    })
    if resp.status_code == 200:
        item = resp.json()
        item_id = item["id"]
        if item["status"] == "Missing":
            log_pass("Compliance: No expires_on with status='Missing' → preserved")
        else:
            log_fail("Compliance: Preserve Missing status", f"Expected Missing, got {item['status']}")
    else:
        log_fail("Compliance: Create item no expires_on", f"Status {resp.status_code}")
        return None
    
    # 5. Update item and verify status recomputes
    new_expires = (today + timedelta(days=15)).isoformat()
    resp = requests.patch(f"{BASE_URL}/compliance/{item_id}", headers=headers, json={
        "expires_on": new_expires
    })
    if resp.status_code == 200:
        item = resp.json()
        if item["status"] == "Expiring":
            log_pass("Compliance: PATCH updates and recomputes status")
        else:
            log_fail("Compliance: PATCH recompute status", f"Expected Expiring, got {item['status']}")
    else:
        log_fail("Compliance: PATCH item", f"Status {resp.status_code}")
    
    return item_id

def test_dashboard(token):
    """Test dashboard stats and seed"""
    print("\n=== Testing Dashboard Stats + Seed ===")
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. Get stats
    resp = requests.get(f"{BASE_URL}/dashboard/stats", headers=headers)
    if resp.status_code != 200:
        log_fail("Dashboard: Get stats", f"Status {resp.status_code}")
        return
    
    stats = resp.json()
    required_fields = ["total_revenue", "total_expenses", "profit", "loads_total", 
                      "loads_active", "by_status", "compliance_alerts", 
                      "drivers_count", "documents_count"]
    
    if all(field in stats for field in required_fields):
        log_pass("Dashboard: Stats returns all required fields")
    else:
        missing = [f for f in required_fields if f not in stats]
        log_fail("Dashboard: Stats fields", f"Missing: {missing}")
    
    # 2. Seed demo data
    resp = requests.post(f"{BASE_URL}/dashboard/seed", headers=headers)
    if resp.status_code != 200:
        log_fail("Dashboard: Seed demo data", f"Status {resp.status_code}")
        return
    
    log_pass("Dashboard: Seed demo data")
    
    # 3. Verify seed created expected counts
    resp = requests.get(f"{BASE_URL}/dashboard/stats", headers=headers)
    if resp.status_code == 200:
        stats = resp.json()
        if stats["drivers_count"] == 3 and stats["loads_total"] == 5:
            log_pass("Dashboard: Seed creates 3 drivers, 5 loads")
        else:
            log_fail("Dashboard: Seed counts", f"Expected 3 drivers, 5 loads; got {stats['drivers_count']}, {stats['loads_total']}")
    
    # 4. Re-run seed (should be idempotent)
    resp = requests.post(f"{BASE_URL}/dashboard/seed", headers=headers)
    if resp.status_code == 200:
        resp = requests.get(f"{BASE_URL}/dashboard/stats", headers=headers)
        stats = resp.json()
        if stats["drivers_count"] == 3 and stats["loads_total"] == 5:
            log_pass("Dashboard: Seed is idempotent (no duplication)")
        else:
            log_fail("Dashboard: Seed idempotency", f"Expected 3/5, got {stats['drivers_count']}/{stats['loads_total']}")
    else:
        log_fail("Dashboard: Re-run seed", f"Status {resp.status_code}")

def test_tenancy_isolation():
    """Test that users cannot see each other's data"""
    print("\n=== Testing Tenancy Isolation ===")
    
    # Create user A
    email_a = random_email()
    resp_a = requests.post(f"{BASE_URL}/auth/register", json={
        "email": email_a,
        "password": "PasswordA123!"
    })
    if resp_a.status_code != 200:
        log_fail("Tenancy: Register user A", f"Status {resp_a.status_code}")
        return
    token_a = resp_a.json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}
    
    # Create user B
    email_b = random_email()
    resp_b = requests.post(f"{BASE_URL}/auth/register", json={
        "email": email_b,
        "password": "PasswordB123!"
    })
    if resp_b.status_code != 200:
        log_fail("Tenancy: Register user B", f"Status {resp_b.status_code}")
        return
    token_b = resp_b.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}
    
    # User A creates a driver
    resp = requests.post(f"{BASE_URL}/drivers", headers=headers_a, json={
        "name": "Driver A"
    })
    if resp.status_code != 200:
        log_fail("Tenancy: User A create driver", f"Status {resp.status_code}")
        return
    driver_a_id = resp.json()["id"]
    
    # User A creates a load
    resp = requests.post(f"{BASE_URL}/loads", headers=headers_a, json={
        "pickup": "City A",
        "dropoff": "City B",
        "rate": 2000.0
    })
    if resp.status_code != 200:
        log_fail("Tenancy: User A create load", f"Status {resp.status_code}")
        return
    load_a_id = resp.json()["id"]
    
    # User B lists drivers (should be empty)
    resp = requests.get(f"{BASE_URL}/drivers", headers=headers_b)
    if resp.status_code == 200 and len(resp.json()) == 0:
        log_pass("Tenancy: User B cannot see User A's drivers")
    else:
        log_fail("Tenancy: User B drivers isolation", f"Expected empty, got {len(resp.json())} drivers")
    
    # User B lists loads (should be empty)
    resp = requests.get(f"{BASE_URL}/loads", headers=headers_b)
    if resp.status_code == 200 and len(resp.json()) == 0:
        log_pass("Tenancy: User B cannot see User A's loads")
    else:
        log_fail("Tenancy: User B loads isolation", f"Expected empty, got {len(resp.json())} loads")
    
    # User B tries to get User A's load by ID (should 404)
    resp = requests.get(f"{BASE_URL}/loads/{load_a_id}", headers=headers_b)
    if resp.status_code == 404:
        log_pass("Tenancy: User B cannot GET User A's load by ID (404)")
    else:
        log_fail("Tenancy: User B access User A's load", f"Expected 404, got {resp.status_code}")

def test_cascading_delete(token):
    """Test that deleting a load also removes attached docs and expenses"""
    print("\n=== Testing Cascading Delete ===")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create a load
    resp = requests.post(f"{BASE_URL}/loads", headers=headers, json={
        "pickup": "Test City 1",
        "dropoff": "Test City 2"
    })
    if resp.status_code != 200:
        log_fail("Cascade: Create load", f"Status {resp.status_code}")
        return
    load_id = resp.json()["id"]
    
    # Attach a document
    files = {"file": ("test.pdf", io.BytesIO(b"test"), "application/pdf")}
    data = {"load_id": load_id}
    resp = requests.post(f"{BASE_URL}/documents/upload", headers=headers, files=files, data=data)
    if resp.status_code != 200:
        log_fail("Cascade: Attach document", f"Status {resp.status_code}")
        return
    doc_id = resp.json()["id"]
    
    # Attach an expense
    resp = requests.post(f"{BASE_URL}/expenses", headers=headers, json={
        "load_id": load_id,
        "category": "Fuel",
        "amount": 100.0
    })
    if resp.status_code != 200:
        log_fail("Cascade: Attach expense", f"Status {resp.status_code}")
        return
    expense_id = resp.json()["id"]
    
    # Delete the load
    resp = requests.delete(f"{BASE_URL}/loads/{load_id}", headers=headers)
    if resp.status_code != 200:
        log_fail("Cascade: Delete load", f"Status {resp.status_code}")
        return
    
    # Verify document is gone
    resp = requests.get(f"{BASE_URL}/documents?load_id={load_id}", headers=headers)
    if resp.status_code == 200 and len(resp.json()) == 0:
        log_pass("Cascade: Delete load removes attached documents")
    else:
        log_fail("Cascade: Documents not removed", f"Found {len(resp.json())} docs")
    
    # Verify expense is gone
    resp = requests.get(f"{BASE_URL}/expenses?load_id={load_id}", headers=headers)
    if resp.status_code == 200 and len(resp.json()) == 0:
        log_pass("Cascade: Delete load removes attached expenses")
    else:
        log_fail("Cascade: Expenses not removed", f"Found {len(resp.json())} expenses")

def main():
    print("=" * 60)
    print("FleetForge Backend API Test Suite")
    print(f"Testing: {BASE_URL}")
    print("=" * 60)
    
    try:
        # Test auth and get token
        token, user_id = test_auth()
        if not token:
            print("\n❌ Auth tests failed, cannot continue")
            sys.exit(1)
        
        # Test tenancy isolation (separate test with its own users)
        test_tenancy_isolation()
        
        # Test drivers
        driver_id = test_drivers(token)
        if not driver_id:
            print("\n⚠️  Driver tests failed, some tests may be skipped")
        
        # Test loads
        load1_id, load2_id = test_loads(token, driver_id) if driver_id else (None, None)
        if not load1_id:
            print("\n⚠️  Load tests failed, some tests may be skipped")
        
        # Test documents
        if load1_id:
            test_documents(token, load1_id)
        
        # Test expenses
        if load1_id:
            test_expenses(token, load1_id)
        
        # Test compliance
        test_compliance(token)
        
        # Test dashboard
        test_dashboard(token)
        
        # Test cascading delete
        test_cascading_delete(token)
        
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print(f"Total: {passed + failed}")
    
    if failed > 0:
        print("\n❌ FAILED TESTS:")
        for error in errors:
            print(f"  {error}")
        sys.exit(1)
    else:
        print("\n✅ All tests passed!")
        sys.exit(0)

if __name__ == "__main__":
    main()
