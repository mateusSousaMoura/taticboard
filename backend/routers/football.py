from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models.football import CompetitionModel, TeamModel, PlayerModel, MatchModel
from schemas.football import (
    CompetitionSchema,
    MatchFixtureSchema,
    TeamSchema,
    PlayerSchema,
    SyncStatusSchema
)
from services.sync_service import sync_world_cup_job
from core.logging import logger

router = APIRouter(prefix="/api", tags=["REST Football API"])

def build_team_schema(team: TeamModel, db: Session) -> TeamSchema:
    """Helper to construct TeamSchema with starting and bench players."""
    players = db.query(PlayerModel).filter(PlayerModel.team_id == team.id).all()
    starting: List[PlayerSchema] = []
    bench: List[PlayerSchema] = []

    for p in players:
        p_schema = PlayerSchema(
            id=p.id,
            name=p.name,
            number=p.shirt_number,
            position=p.position,
            teamId=str(p.team_id),
            photoUrl=p.photo_url,
            isStarting=p.is_starting,
            x=p.x,
            y=p.y
        )
        if p.is_starting:
            starting.append(p_schema)
        else:
            bench.append(p_schema)

    return TeamSchema(
        id=str(team.id),
        name=team.name,
        shortName=team.short_name or team.name[:3].upper(),
        code=team.code or team.name[:3].upper(),
        crest=team.crest or "",
        primaryColor=team.primary_color or "#2563EB",
        secondaryColor=team.secondary_color or "#FFFFFF",
        textColor=team.text_color or "#FFFFFF",
        formation=team.formation or "4-3-3",
        starting=starting,
        bench=bench
    )

def build_match_schema(match: MatchModel, db: Session) -> Optional[MatchFixtureSchema]:
    """Helper to construct MatchFixtureSchema."""
    home_team_model = db.query(TeamModel).filter(TeamModel.id == match.home_team_id).first()
    away_team_model = db.query(TeamModel).filter(TeamModel.id == match.away_team_id).first()

    if not home_team_model or not away_team_model:
        return None

    home_schema = build_team_schema(home_team_model, db)
    away_schema = build_team_schema(away_team_model, db)

    return MatchFixtureSchema(
        id=str(match.id),
        competitionCode=match.competition_code,
        utcDate=match.utc_date.isoformat() if match.utc_date else "",
        stage=match.stage or "FASE DE GRUPOS",
        status=match.status or "SCHEDULED",
        homeTeam=home_schema,
        awayTeam=away_schema
    )

# --- RESTFUL ENDPOINTS ---

@router.get("/competitions", response_model=List[CompetitionSchema])
def list_competitions(db: Session = Depends(get_db)):
    """GET /api/competitions - List all registered football competitions."""
    competitions = db.query(CompetitionModel).all()
    return [
        CompetitionSchema(
            id=c.id,
            code=c.code,
            name=c.name,
            type=c.type,
            emblem=c.emblem,
            season=c.season,
            country=c.country,
            featured=(c.code == "WC")
        )
        for c in competitions
    ]

@router.get("/competitions/{code}", response_model=CompetitionSchema)
def get_competition_by_code(code: str, db: Session = Depends(get_db)):
    """GET /api/competitions/{code} - Get details of a single competition."""
    comp = db.query(CompetitionModel).filter(CompetitionModel.code == code.upper()).first()
    if not comp:
        raise HTTPException(status_code=404, detail=f"Competition '{code}' not found")
    return CompetitionSchema(
        id=comp.id,
        code=comp.code,
        name=comp.name,
        type=comp.type,
        emblem=comp.emblem,
        season=comp.season,
        country=comp.country,
        featured=(comp.code == "WC")
    )

@router.get("/competitions/{code}/matches", response_model=List[MatchFixtureSchema])
def list_competition_matches(
    code: str,
    stage: Optional[str] = None,
    status: Optional[str] = None,
    limit: Optional[int] = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """GET /api/competitions/{code}/matches - List matches for a competition with optional filters."""
    query = db.query(MatchModel).filter(MatchModel.competition_code == code.upper())
    
    if stage:
        query = query.filter(MatchModel.stage.ilike(f"%{stage}%"))
    if status:
        query = query.filter(MatchModel.status == status.upper())

    matches = query.order_by(MatchModel.utc_date.asc()).limit(limit).all()
    
    results = []
    for m in matches:
        schema = build_match_schema(m, db)
        if schema:
            results.append(schema)
            
    logger.info(f"[REST API] Returned {len(results)} matches for competition '{code}'")
    return results

@router.get("/teams", response_model=List[TeamSchema])
def list_teams(limit: Optional[int] = Query(default=100, ge=1, le=200), db: Session = Depends(get_db)):
    """GET /api/teams - List all teams in database with their squads."""
    teams = db.query(TeamModel).limit(limit).all()
    return [build_team_schema(t, db) for t in teams]

@router.get("/teams/{team_id}", response_model=TeamSchema)
def get_team(team_id: int, db: Session = Depends(get_db)):
    """GET /api/teams/{team_id} - Get team details by ID with squad roster."""
    team = db.query(TeamModel).filter(TeamModel.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail=f"Team with ID '{team_id}' not found")
    return build_team_schema(team, db)

@router.get("/matches/{match_id}", response_model=MatchFixtureSchema)
def get_match(match_id: int, db: Session = Depends(get_db)):
    """GET /api/matches/{match_id} - Get match details with home and away teams."""
    match = db.query(MatchModel).filter(MatchModel.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail=f"Match with ID '{match_id}' not found")
    schema = build_match_schema(match, db)
    if not schema:
        raise HTTPException(status_code=500, detail="Match teams data incomplete")
    return schema

@router.post("/sync/world-cup", response_model=SyncStatusSchema)
def trigger_world_cup_sync(background_tasks: BackgroundTasks):
    """POST /api/sync/world-cup - Trigger background rate-limited sync job."""
    background_tasks.add_task(sync_world_cup_job)
    return SyncStatusSchema(
        status="PENDING",
        message="Job de sincronização da Copa do Mundo iniciado em segundo plano (respeitando o limite de 10 req/min)."
    )
