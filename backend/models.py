from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Literal
from datetime import datetime
import uuid


def _uid() -> str:
    return str(uuid.uuid4())


# ---------- Users ----------
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    company_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: EmailStr
    company_name: Optional[str] = None
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: UserOut


# ---------- Drivers ----------
class DriverCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    notes: Optional[str] = None


class DriverUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    notes: Optional[str] = None


class Driver(BaseModel):
    id: str = Field(default_factory=_uid)
    user_id: str
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ---------- Loads ----------
LoadStatus = Literal['Pending', 'Dispatched', 'In Transit', 'Delivered', 'Completed']


class LoadCreate(BaseModel):
    pickup: str
    dropoff: str
    rate: Optional[float] = None
    customer: Optional[str] = None
    pickup_date: Optional[str] = None  # ISO date string
    delivery_date: Optional[str] = None
    driver_id: Optional[str] = None
    miles: Optional[float] = None
    notes: Optional[str] = None


class LoadUpdate(BaseModel):
    pickup: Optional[str] = None
    dropoff: Optional[str] = None
    rate: Optional[float] = None
    customer: Optional[str] = None
    pickup_date: Optional[str] = None
    delivery_date: Optional[str] = None
    driver_id: Optional[str] = None
    miles: Optional[float] = None
    notes: Optional[str] = None
    status: Optional[LoadStatus] = None


class StatusUpdate(BaseModel):
    status: LoadStatus


class AssignDriver(BaseModel):
    driver_id: Optional[str] = None


class Load(BaseModel):
    id: str = Field(default_factory=_uid)
    user_id: str
    load_number: str
    pickup: str
    dropoff: str
    rate: Optional[float] = None
    customer: Optional[str] = None
    pickup_date: Optional[str] = None
    delivery_date: Optional[str] = None
    driver_id: Optional[str] = None
    miles: Optional[float] = None
    notes: Optional[str] = None
    status: LoadStatus = 'Pending'
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ---------- Documents ----------
DocType = Literal['Rate Confirmation', 'BOL', 'Receipt', 'Other']


class DocumentOut(BaseModel):
    id: str
    user_id: str
    load_id: Optional[str] = None
    doc_type: DocType
    filename: str
    mime_type: str
    size: int
    extracted: Optional[dict] = None
    created_at: datetime


class ParseResult(BaseModel):
    doc_type: DocType
    extracted: dict


# ---------- Expenses ----------
ExpenseCategory = Literal['Fuel', 'Tolls', 'Maintenance', 'Other']


class ExpenseCreate(BaseModel):
    load_id: Optional[str] = None
    category: ExpenseCategory
    amount: float
    description: Optional[str] = None
    occurred_on: Optional[str] = None


class Expense(BaseModel):
    id: str = Field(default_factory=_uid)
    user_id: str
    load_id: Optional[str] = None
    category: ExpenseCategory
    amount: float
    description: Optional[str] = None
    occurred_on: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ---------- Compliance ----------
ComplianceItemType = Literal['DQ File', 'Insurance', 'Vehicle Inspection']
ComplianceStatus = Literal['Complete', 'Missing', 'Expiring']


class ComplianceCreate(BaseModel):
    item_type: ComplianceItemType
    entity_name: str  # driver name or vehicle id
    entity_id: Optional[str] = None  # driver_id if applicable
    expires_on: Optional[str] = None
    status: ComplianceStatus = 'Complete'
    notes: Optional[str] = None


class ComplianceUpdate(BaseModel):
    item_type: Optional[ComplianceItemType] = None
    entity_name: Optional[str] = None
    entity_id: Optional[str] = None
    expires_on: Optional[str] = None
    status: Optional[ComplianceStatus] = None
    notes: Optional[str] = None


class ComplianceItem(BaseModel):
    id: str = Field(default_factory=_uid)
    user_id: str
    item_type: ComplianceItemType
    entity_name: str
    entity_id: Optional[str] = None
    expires_on: Optional[str] = None
    status: ComplianceStatus = 'Complete'
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
