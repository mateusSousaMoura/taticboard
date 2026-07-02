from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.football import CompetitionModel, TeamModel, PlayerModel, MatchModel
from schemas.football import CompetitionSchema, MatchFixtureSchema, TeamSchema, PlayerSchema, SyncStatusSchema
from services.sync_service import sync_world_cup_job

router = APIRouter(prefix="/api", tags=["Football Data"])

def build_team_schema(team: TeamModel, db: Session) -> TeamSchema:
    players = db.query(PlayerModel).filter(PlayerModel.team_id == team.id).all()
    starting = []
    bench = []

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
        crest=team.crest,
        primaryColor=team.primary_color,
        secondaryColor=team.secondary_color,
        textColor=team.text_color,
        formation=team.formation,
        starting=starting,
        bench=bench
    )

@router.get("/competitions", response_model=List[CompetitionSchema])
def get_competitions(db: Session = Depends(get_db)):
    competitions = db.query(CompetitionModel).all()
    result = []
    for c in competitions:
        result.append(CompetitionSchema(
            id=c.id,
            code=c.code,
            name=c.name,
            type=c.type,
            emblem=c.emblem,
            season=c.season,
            country=c.country,
            featured=(c.code == "WC")
        ))
    return result

@router.get("/competitions/{code}/matches", response_model=List[MatchFixtureSchema])
def get_competition_matches(code: str, db: Session = Depends(get_db)):
    matches = db.query(MatchModel).filter(MatchModel.competition_code == code.upper()).all()
    result = []
    for m in matches:
        home_team_model = db.query(TeamModel).filter(TeamModel.id == m.home_team_id).first()
        away_team_model = db.query(TeamModel).filter(TeamModel.id == m.away_team_id).first()
        
        if not home_team_model or not away_team_model:
            continue

        home_schema = build_team_schema(home_team_model, db)
        away_schema = build_team_schema(away_team_model, db)

        result.append(MatchFixtureSchema(
            id=str(m.id),
            competitionCode=m.competition_code,
            utcDate=m.utc_date.isoformat(),
            stage=m.stage,
            status=m.status,
            homeTeam=home_schema,
            awayTeam=away_schema
        ))
    return result

@router.get("/teams", response_model=List[TeamSchema])
def get_teams(db: Session = Depends(get_db)):
    teams = db.query(TeamModel).all()
    return [build_team_schema(t, db) for t in teams]

@router.get("/teams/{team_id}", response_model=TeamSchema)
def get_team_by_id(team_id: int, db: Session = Depends(get_db)):
    team = db.query(TeamModel).filter(TeamModel.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return build_team_schema(team, db)

@router.post("/sync/world-cup", response_model=SyncStatusSchema)
def trigger_world_cup_sync(background_tasks: BackgroundTasks):
    """Trigger rate-limited World Cup sync job in background."""
    background_tasks.add_task(sync_world_cup_job)
    return SyncStatusSchema(
        status="PENDING",
        message="Job de sincronização da Copa do Mundo iniciado em segundo plano (respeitando o limite de 10 req/min)."
    )
