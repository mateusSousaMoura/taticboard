import uvicorn
from fastapi import FastAPI
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from core.config import settings
from core.logging import logger
from core.middlewares import setup_middlewares
from database import engine, Base, SessionLocal
from routers import football, admin
from services.seed_service import seed_initial_world_cup_data
from services.sync_service import sync_world_cup_job

# Create Database Tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API com Painel de Administração Autenticado e Sincronização de Futebol (Copa do Mundo)",
    version=settings.VERSION
)

# Setup Centralized Middlewares (CORS & Request Logging)
setup_middlewares(app)

# Register Public & Admin API Routers
app.include_router(football.router)
app.include_router(admin.router)

scheduler = AsyncIOScheduler()

@app.on_event("startup")
async def startup_event():
    # 1. Seed Initial World Cup Data if DB is empty
    db = SessionLocal()
    try:
        seed_initial_world_cup_data(db)
    finally:
        db.close()

    # 2. Schedule World Cup Sync Job
    scheduler.add_job(sync_world_cup_job, 'interval', hours=settings.SYNC_INTERVAL_HOURS)
    scheduler.start()
    logger.info(f"[FastAPI] Server and Sync Scheduler (Interval: {settings.SYNC_INTERVAL_HOURS}h) Started Successfully!")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "adminPanel": "/admin",
        "worldCupSync": "active",
        "rateLimit": "10 requests/minute"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
