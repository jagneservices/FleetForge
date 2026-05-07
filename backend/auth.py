import os
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
import jwt
import uuid

from db import db
from models import UserCreate, UserLogin, UserOut, TokenResponse

SECRET_KEY = os.environ.get('JWT_SECRET', 'fleetforge-dev-secret-change-me')
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_DAYS = 14

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/auth/login', auto_error=False)

router = APIRouter(prefix='/auth', tags=['auth'])


def hash_password(pw: str) -> str:
    return pwd_context.hash(pw)


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return pwd_context.verify(pw, hashed)
    except Exception:
        return False


def create_token(user_id: str) -> str:
    payload = {
        'sub': user_id,
        'exp': datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS),
        'iat': datetime.utcnow(),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def _user_to_out(u: dict) -> UserOut:
    return UserOut(
        id=u['id'],
        email=u['email'],
        company_name=u.get('company_name'),
        created_at=u['created_at'],
    )


async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> dict:
    if not token:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, 'Not authenticated')
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        uid = payload.get('sub')
        if not uid:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, 'Invalid token')
    except jwt.PyJWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, 'Invalid token')
    u = await db.users.find_one({'id': uid})
    if not u:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, 'User not found')
    return u


@router.post('/register', response_model=TokenResponse)
async def register(payload: UserCreate):
    existing = await db.users.find_one({'email': payload.email.lower()})
    if existing:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, 'Email already registered')
    user_doc = {
        'id': str(uuid.uuid4()),
        'email': payload.email.lower(),
        'password_hash': hash_password(payload.password),
        'company_name': payload.company_name,
        'created_at': datetime.utcnow(),
    }
    await db.users.insert_one(user_doc)
    token = create_token(user_doc['id'])
    return TokenResponse(access_token=token, user=_user_to_out(user_doc))


@router.post('/login', response_model=TokenResponse)
async def login(payload: UserLogin):
    u = await db.users.find_one({'email': payload.email.lower()})
    if not u or not verify_password(payload.password, u['password_hash']):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, 'Invalid email or password')
    token = create_token(u['id'])
    return TokenResponse(access_token=token, user=_user_to_out(u))


@router.get('/me', response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    return _user_to_out(user)
