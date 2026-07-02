from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from core.config import settings
from core.logging import logger

DATABASE_URL = settings.DATABASE_URL

try:
    # Try PostgreSQL connection with pool_pre_ping and pool_recycle
    engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=300)
    with engine.connect() as conn:
        logger.info(f"[Database] Connected successfully to PostgreSQL: {DATABASE_URL}")
except Exception as e:
    # Fallback to SQLite for instant local development if PostgreSQL is offline
    SQLITE_URL = "sqlite:///./taticboard.db"
    logger.warning(f"[Database] PostgreSQL connection failed ({e}). Falling back to SQLite: {SQLITE_URL}")
    engine = create_engine(SQLITE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
