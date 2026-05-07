from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware
import logging

from db import db, close_db
from auth import router as auth_router
from routers.drivers import router as drivers_router
from routers.loads import router as loads_router
from routers.documents import router as documents_router
from routers.expenses import router as expenses_router
from routers.compliance import router as compliance_router
from routers.dashboard import router as dashboard_router

app = FastAPI(title="FleetForge API")

api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"name": "FleetForge API", "status": "ok"}


@api_router.get("/health")
async def health():
    return {"status": "ok"}


# include sub-routers
api_router.include_router(auth_router)
api_router.include_router(drivers_router)
api_router.include_router(loads_router)
api_router.include_router(documents_router)
api_router.include_router(expenses_router)
api_router.include_router(compliance_router)
api_router.include_router(dashboard_router)

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def on_start():
    # Helpful indexes
    await db.users.create_index("email", unique=True)
    await db.drivers.create_index("user_id")
    await db.loads.create_index("user_id")
    await db.documents.create_index("user_id")
    await db.expenses.create_index("user_id")
    await db.compliance.create_index("user_id")
    logger.info("FleetForge API started")


@app.on_event("shutdown")
async def on_shutdown():
    await close_db()
