import os
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "TATIC PRO API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Football Data API Settings
    FOOTBALL_DATA_API_TOKEN: str = os.getenv("FOOTBALL_DATA_API_TOKEN", "")
    FOOTBALL_DATA_API_URL: str = os.getenv("FOOTBALL_DATA_API_URL", "https://api.football-data.org/v4")
    API_REQUEST_DELAY_SECONDS: float = float(os.getenv("API_REQUEST_DELAY_SECONDS", "7.0"))
    
    # Database Settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/taticboard")
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = ["*"]
    
    # Scheduler Settings
    SYNC_INTERVAL_HOURS: int = int(os.getenv("SYNC_INTERVAL_HOURS", "6"))

settings = Settings()
