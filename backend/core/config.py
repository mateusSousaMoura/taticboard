import os
from pathlib import Path
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv

# Resolve absolute directory of backend/
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env from backend/ directory or root directory explicitly
env_file_backend = BASE_DIR / ".env"
env_file_root = BASE_DIR.parent / ".env"

if env_file_backend.exists():
    load_dotenv(dotenv_path=env_file_backend)
if env_file_root.exists():
    load_dotenv(dotenv_path=env_file_root)

class Settings(BaseModel):
    PROJECT_NAME: str = "TATIC PRO API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Active Provider Selector ("thesportsdb" or "football_data_org")
    FOOTBALL_PROVIDER_TYPE: str = os.getenv("FOOTBALL_PROVIDER_TYPE", "thesportsdb")
    
    # Football Data API Settings
    FOOTBALL_DATA_API_TOKEN: str = os.getenv("FOOTBALL_DATA_API_TOKEN", "")
    FOOTBALL_DATA_API_URL: str = os.getenv("FOOTBALL_DATA_API_URL", "https://api.football-data.org/v4")
    
    # TheSportsDB API Settings
    THESPORTSDB_API_KEY: str = os.getenv("THESPORTSDB_API_KEY", "123")
    THESPORTSDB_API_URL: str = os.getenv("THESPORTSDB_API_URL", "https://www.thesportsdb.com/api/v1/json")
    
    API_REQUEST_DELAY_SECONDS: float = float(os.getenv("API_REQUEST_DELAY_SECONDS", "2.0"))
    
    # Database Settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/taticboard")
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = ["*"]
    
    # Scheduler Settings
    SYNC_INTERVAL_HOURS: int = int(os.getenv("SYNC_INTERVAL_HOURS", "6"))

settings = Settings()
