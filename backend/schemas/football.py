from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

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

class SyncStatusSchema(BaseModel):
    status: str
    message: str
    lastSynced: Optional[datetime] = None
    requestsMade: int = 0
