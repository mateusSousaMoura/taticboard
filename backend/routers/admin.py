from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone

from database import get_db
from core.security import verify_admin_credentials, ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SECRET_TOKEN
from core.logging import logger
from models.football import CompetitionModel, TeamModel, PlayerModel, MatchModel
from schemas.football import (
    AdminLoginRequest, AdminLoginResponse,
    CompetitionSchema, CompetitionCreateSchema, CompetitionUpdateSchema,
    TeamSchema, TeamCreateSchema, TeamUpdateSchema,
    PlayerSchema, PlayerCreateSchema, PlayerUpdateSchema,
    MatchFixtureSchema, MatchCreateSchema, MatchUpdateSchema
)
from routers.football import build_team_schema, build_match_schema

router = APIRouter(prefix="/api/admin", tags=["Admin Authenticated CRUD"])

# --- ADMIN AUTHENTICATION ---

@router.post("/login", response_model=AdminLoginResponse)
def admin_login(payload: AdminLoginRequest):
    """POST /api/admin/login - Authenticate admin credentials and issue token."""
    if payload.username != ADMIN_USERNAME or payload.password != ADMIN_PASSWORD:
        logger.warning(f"[AdminAuth] Failed login attempt for username: '{payload.username}'")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais de administrador incorretas."
        )
    
    logger.info(f"[AdminAuth] Successful admin login for '{payload.username}'")
    return AdminLoginResponse(
        token=ADMIN_SECRET_TOKEN,
        tokenType="Bearer",
        username=payload.username
    )

# --- COMPETITIONS CRUD ---

@router.post("/competitions", response_model=CompetitionSchema, dependencies=[Depends(verify_admin_credentials)])
def create_competition(payload: CompetitionCreateSchema, db: Session = Depends(get_db)):
    """POST /api/admin/competitions - Create a new competition."""
    existing = db.query(CompetitionModel).filter(CompetitionModel.code == payload.code.upper()).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Competition '{payload.code}' already exists")

    comp = CompetitionModel(
        id=payload.id,
        code=payload.code.upper(),
        name=payload.name,
        type=payload.type,
        emblem=payload.emblem or "",
        season=payload.season,
        country=payload.country or "Internacional"
    )
    db.add(comp)
    db.commit()
    db.refresh(comp)
    logger.info(f"[AdminCRUD] Competition '{comp.code}' created.")
    return CompetitionSchema(
        id=comp.id, code=comp.code, name=comp.name, type=comp.type,
        emblem=comp.emblem, season=comp.season, country=comp.country, featured=(comp.code == "WC")
    )

@router.put("/competitions/{code}", response_model=CompetitionSchema, dependencies=[Depends(verify_admin_credentials)])
def update_competition(code: str, payload: CompetitionUpdateSchema, db: Session = Depends(get_db)):
    """PUT /api/admin/competitions/{code} - Update an existing competition."""
    comp = db.query(CompetitionModel).filter(CompetitionModel.code == code.upper()).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Competition not found")

    if payload.name is not None: comp.name = payload.name
    if payload.type is not None: comp.type = payload.type
    if payload.emblem is not None: comp.emblem = payload.emblem
    if payload.season is not None: comp.season = payload.season
    if payload.country is not None: comp.country = payload.country

    db.commit()
    db.refresh(comp)
    logger.info(f"[AdminCRUD] Competition '{code}' updated.")
    return CompetitionSchema(
        id=comp.id, code=comp.code, name=comp.name, type=comp.type,
        emblem=comp.emblem, season=comp.season, country=comp.country, featured=(comp.code == "WC")
    )

@router.delete("/competitions/{code}", dependencies=[Depends(verify_admin_credentials)])
def delete_competition(code: str, db: Session = Depends(get_db)):
    """DELETE /api/admin/competitions/{code} - Delete a competition and its matches."""
    comp = db.query(CompetitionModel).filter(CompetitionModel.code == code.upper()).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Competition not found")

    # Clean up associated matches
    db.query(MatchModel).filter(MatchModel.competition_code == comp.code).delete()
    db.delete(comp)
    db.commit()
    logger.info(f"[AdminCRUD] Competition '{code}' and associated matches deleted.")
    return {"message": f"Competition '{code}' deleted successfully"}

# --- TEAMS CRUD ---

@router.post("/teams", response_model=TeamSchema, dependencies=[Depends(verify_admin_credentials)])
def create_team(payload: TeamCreateSchema, db: Session = Depends(get_db)):
    """POST /api/admin/teams - Create a new team."""
    max_id = db.query(TeamModel).count() + 800
    team = TeamModel(
        id=max_id + 1,
        name=payload.name,
        short_name=payload.short_name,
        code=payload.code.upper(),
        crest=payload.crest or "",
        primary_color=payload.primary_color,
        secondary_color=payload.secondary_color,
        text_color=payload.text_color,
        formation=payload.formation
    )
    db.add(team)
    db.commit()
    db.refresh(team)
    logger.info(f"[AdminCRUD] Team '{team.name}' (ID: {team.id}) created.")
    return build_team_schema(team, db)

@router.put("/teams/{team_id}", response_model=TeamSchema, dependencies=[Depends(verify_admin_credentials)])
def update_team(team_id: int, payload: TeamUpdateSchema, db: Session = Depends(get_db)):
    """PUT /api/admin/teams/{team_id} - Update an existing team."""
    team = db.query(TeamModel).filter(TeamModel.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    if payload.name is not None: team.name = payload.name
    if payload.short_name is not None: team.short_name = payload.short_name
    if payload.code is not None: team.code = payload.code
    if payload.crest is not None: team.crest = payload.crest
    if payload.primary_color is not None: team.primary_color = payload.primary_color
    if payload.secondary_color is not None: team.secondary_color = payload.secondary_color
    if payload.text_color is not None: team.text_color = payload.text_color
    if payload.formation is not None: team.formation = payload.formation

    db.commit()
    db.refresh(team)
    logger.info(f"[AdminCRUD] Team ID {team_id} updated.")
    return build_team_schema(team, db)

@router.delete("/teams/{team_id}", dependencies=[Depends(verify_admin_credentials)])
def delete_team(team_id: int, db: Session = Depends(get_db)):
    """DELETE /api/admin/teams/{team_id} - Delete a team and associated matches/players."""
    team = db.query(TeamModel).filter(TeamModel.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Clean up associated matches where team is home or away
    db.query(MatchModel).filter((MatchModel.home_team_id == team_id) | (MatchModel.away_team_id == team_id)).delete()
    db.query(PlayerModel).filter(PlayerModel.team_id == team_id).delete()
    
    db.delete(team)
    db.commit()
    logger.info(f"[AdminCRUD] Team ID {team_id} deleted successfully.")
    return {"message": f"Team {team_id} deleted successfully"}

# --- PLAYERS CRUD ---

@router.post("/players", response_model=PlayerSchema, dependencies=[Depends(verify_admin_credentials)])
def create_player(payload: PlayerCreateSchema, db: Session = Depends(get_db)):
    """POST /api/admin/players - Create a new player."""
    player_id = f"custom-{db.query(PlayerModel).count() + 1}"
    player = PlayerModel(
        id=player_id,
        name=payload.name,
        shirt_number=payload.shirt_number,
        position=payload.position,
        team_id=payload.team_id,
        photo_url=payload.photo_url,
        is_starting=payload.is_starting,
        x=payload.x,
        y=payload.y
    )
    db.add(player)
    db.commit()
    db.refresh(player)
    logger.info(f"[AdminCRUD] Player '{player.name}' created.")
    return PlayerSchema(
        id=player.id,
        name=player.name,
        number=player.shirt_number,
        position=player.position,
        teamId=str(player.team_id),
        photoUrl=player.photo_url,
        isStarting=player.is_starting,
        x=player.x,
        y=player.y
    )

@router.put("/players/{player_id}", response_model=PlayerSchema, dependencies=[Depends(verify_admin_credentials)])
def update_player(player_id: str, payload: PlayerUpdateSchema, db: Session = Depends(get_db)):
    """PUT /api/admin/players/{player_id} - Update an existing player."""
    player = db.query(PlayerModel).filter(PlayerModel.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")

    if payload.name is not None: player.name = payload.name
    if payload.shirt_number is not None: player.shirt_number = payload.shirt_number
    if payload.position is not None: player.position = payload.position
    if payload.photo_url is not None: player.photo_url = payload.photo_url
    if payload.is_starting is not None: player.is_starting = payload.is_starting
    if payload.x is not None: player.x = payload.x
    if payload.y is not None: player.y = payload.y

    db.commit()
    db.refresh(player)
    logger.info(f"[AdminCRUD] Player '{player_id}' updated.")
    return PlayerSchema(
        id=player.id,
        name=player.name,
        number=player.shirt_number,
        position=player.position,
        teamId=str(player.team_id),
        photoUrl=player.photo_url,
        isStarting=player.is_starting,
        x=player.x,
        y=player.y
    )

@router.delete("/players/{player_id}", dependencies=[Depends(verify_admin_credentials)])
def delete_player(player_id: str, db: Session = Depends(get_db)):
    """DELETE /api/admin/players/{player_id} - Delete a player."""
    player = db.query(PlayerModel).filter(PlayerModel.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")

    db.delete(player)
    db.commit()
    logger.info(f"[AdminCRUD] Player '{player_id}' deleted.")
    return {"message": f"Player '{player_id}' deleted successfully"}

# --- MATCHES CRUD ---

@router.post("/matches", response_model=MatchFixtureSchema, dependencies=[Depends(verify_admin_credentials)])
def create_match(payload: MatchCreateSchema, db: Session = Depends(get_db)):
    """POST /api/admin/matches - Create a new match."""
    match_id = db.query(MatchModel).count() + 500000
    try:
        dt = datetime.fromisoformat(payload.utc_date.replace("Z", "+00:00"))
    except Exception:
        dt = datetime.now(timezone.utc)

    match = MatchModel(
        id=match_id,
        competition_code=payload.competition_code,
        stage=payload.stage,
        status=payload.status,
        utc_date=dt,
        home_team_id=payload.home_team_id,
        away_team_id=payload.away_team_id
    )
    db.add(match)
    db.commit()
    db.refresh(match)
    logger.info(f"[AdminCRUD] Match ID {match.id} created.")
    schema = build_match_schema(match, db)
    if not schema:
        raise HTTPException(status_code=500, detail="Error building match response")
    return schema

@router.put("/matches/{match_id}", response_model=MatchFixtureSchema, dependencies=[Depends(verify_admin_credentials)])
def update_match(match_id: int, payload: MatchUpdateSchema, db: Session = Depends(get_db)):
    """PUT /api/admin/matches/{match_id} - Update an existing match."""
    match = db.query(MatchModel).filter(MatchModel.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    if payload.stage is not None: match.stage = payload.stage
    if payload.status is not None: match.status = payload.status
    if payload.home_team_id is not None: match.home_team_id = payload.home_team_id
    if payload.away_team_id is not None: match.away_team_id = payload.away_team_id
    if payload.utc_date is not None:
        try:
            match.utc_date = datetime.fromisoformat(payload.utc_date.replace("Z", "+00:00"))
        except Exception:
            pass

    db.commit()
    db.refresh(match)
    logger.info(f"[AdminCRUD] Match ID {match_id} updated.")
    schema = build_match_schema(match, db)
    if not schema:
        raise HTTPException(status_code=500, detail="Error building match response")
    return schema

@router.delete("/matches/{match_id}", dependencies=[Depends(verify_admin_credentials)])
def delete_match(match_id: int, db: Session = Depends(get_db)):
    """DELETE /api/admin/matches/{match_id} - Delete a match."""
    match = db.query(MatchModel).filter(MatchModel.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    db.delete(match)
    db.commit()
    logger.info(f"[AdminCRUD] Match ID {match_id} deleted.")
    return {"message": f"Match {match_id} deleted successfully"}
