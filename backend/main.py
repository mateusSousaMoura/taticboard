import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from database import engine, Base, SessionLocal
from routers import football
from services.seed_service import seed_initial_world_cup_data
from services.sync_service import sync_world_cup_job

# Create Database Tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TATIC PRO API",
    description="Backend API para a Prancha Tática de Futebol (Copa do Mundo e Competições)",
    version="1.0.0"
)

# CORS Configuration for Frontend Integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(football.router)

scheduler = AsyncIOScheduler()

@app.on_event("startup")
async def startup_event():
    # 1. Seed Initial World Cup Data if DB is empty
    db = SessionLocal()
    try:
        seed_initial_world_cup_data(db)
    finally:
        db.close()

    # 2. Schedule World Cup Sync Job (runs every 6 hours safely within 10 req/min limit)
    scheduler.add_job(sync_world_cup_job, 'interval', hours=6)
    scheduler.start()
    print("[FastAPI] Server and Sync Scheduler Started Successfully!")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "TATIC PRO Backend API",
        "worldCupSync": "active",
        "rateLimit": "10 requests/minute"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
