from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- PUBLIC PLAYER SCHEMAS ---
class PlayerSchema(BaseModel):
    id: str
    name: str
    number: int
    position: str
    teamId: str
    photoUrl: Optional[str] = None
    isStarting: bool = False
    x: float = 50.0
    y: float = 50.0

    class Config:
        from_attributes = True

class PlayerCreateSchema(BaseModel):
    name: str
    shirt_number: int
    position: str
    team_id: int
    photo_url: Optional[str] = None
    is_starting: bool = False
    x: float = 50.0
    y: float = 50.0

class PlayerUpdateSchema(BaseModel):
    name: Optional[str] = None
    shirt_number: Optional[int] = None
    position: Optional[str] = None
    photo_url: Optional[str] = None
    is_starting: Optional[bool] = None
    x: Optional[float] = None
    y: Optional[float] = None

# --- PUBLIC TEAM SCHEMAS ---
class TeamSchema(BaseModel):
    id: str
    name: str
    shortName: str
    code: str
    crest: Optional[str] = None
    primaryColor: str = "#FDE047"
    secondaryColor: str = "#16A34A"
    textColor: str = "#0F172A"
    formation: str = "4-3-3"
    starting: List[PlayerSchema] = []
    bench: List[PlayerSchema] = []

    class Config:
        from_attributes = True

class TeamCreateSchema(BaseModel):
    name: str
    short_name: str
    code: str
    crest: Optional[str] = ""
    primary_color: str = "#2563EB"
    secondary_color: str = "#FFFFFF"
    text_color: str = "#FFFFFF"
    formation: str = "4-3-3"

class TeamUpdateSchema(BaseModel):
    name: Optional[str] = None
    short_name: Optional[str] = None
    code: Optional[str] = None
    crest: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    text_color: Optional[str] = None
    formation: Optional[str] = None

# --- COMPETITION SCHEMAS ---
class CompetitionSchema(BaseModel):
    id: str
    code: str
    name: str
    type: str
    emblem: Optional[str] = None
    season: int
    country: Optional[str] = None
    featured: bool = False

    class Config:
        from_attributes = True

class CompetitionCreateSchema(BaseModel):
    id: str
    code: str
    name: str
    type: str = "WORLD_CUP"
    emblem: Optional[str] = ""
    season: int = 2026
    country: Optional[str] = "Internacional"

class CompetitionUpdateSchema(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    emblem: Optional[str] = None
    season: Optional[int] = None
    country: Optional[str] = None

# --- MATCH SCHEMAS ---
class MatchFixtureSchema(BaseModel):
    id: str
    competitionCode: str
    utcDate: str
    stage: str
    status: str
    homeTeam: TeamSchema
    awayTeam: TeamSchema

    class Config:
        from_attributes = True

class MatchCreateSchema(BaseModel):
    competition_code: str = "WC"
    stage: str = "FASE DE GRUPOS"
    status: str = "SCHEDULED"
    utc_date: str
    home_team_id: int
    away_team_id: int

class MatchUpdateSchema(BaseModel):
    stage: Optional[str] = None
    status: Optional[str] = None
    utc_date: Optional[str] = None
    home_team_id: Optional[int] = None
    away_team_id: Optional[int] = None

# --- AUTH & SYNC SCHEMAS ---
class AdminLoginRequest(BaseModel):
    username: str
    password: str

class AdminLoginResponse(BaseModel):
    token: str
    tokenType: str = "Bearer"
    username: str

class SyncStatusSchema(BaseModel):
    status: str
    message: str
    lastSynced: Optional[datetime] = None
    requestsMade: int = 0
