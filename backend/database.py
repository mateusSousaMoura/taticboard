from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from core.config import settings
from core.logging import logger

DATABASE_URL = settings.DATABASE_URL
SQLITE_URL = "sqlite:///./taticboard.db"

def create_db_engine():
    try:
        eng = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=300)
        with eng.connect() as conn:
            logger.info(f"[Database] Connected successfully to PostgreSQL: {DATABASE_URL}")
        return eng
    except Exception as e:
        logger.warning(f"[Database] PostgreSQL connection failed ({e}). Falling back to SQLite: {SQLITE_URL}")
        return create_engine(SQLITE_URL, connect_args={"check_same_thread": False})

engine = create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    try:
        db = SessionLocal()
        # Ping DB connection
        db.execute("SELECT 1")
        yield db
    except Exception as e:
        logger.warning(f"[Database] Session execution failed ({e}). Falling back to SQLite session.")
        sqlite_engine = create_engine(SQLITE_URL, connect_args={"check_same_thread": False})
        Base.metadata.create_all(bind=sqlite_engine)
        FallbackSession = sessionmaker(autocommit=False, autoflush=False, bind=sqlite_engine)
        db = FallbackSession()
        yield db
    finally:
        try:
            db.close()
        except Exception:
            pass
