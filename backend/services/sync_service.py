import asyncio
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from core.logging import logger
from models.football import CompetitionModel, TeamModel, PlayerModel, MatchModel
from database import SessionLocal
from providers.factory import get_football_provider

COLOR_NAME_MAP = {
    "yellow": "#FDE047", "amarelo": "#FDE047",
    "green": "#16A34A", "verde": "#16A34A",
    "blue": "#2563EB", "azul": "#2563EB",
    "navy": "#1E3A8A", "red": "#DC2626", "vermelho": "#DC2626",
    "white": "#FFFFFF", "branco": "#FFFFFF",
    "black": "#0F172A", "preto": "#0F172A",
    "orange": "#F97316", "laranja": "#F97316",
    "sky blue": "#38BDF8", "celeste": "#38BDF8",
    "maroon": "#881337", "gold": "#EAB308", "purple": "#9333EA",
}

POSITION_MAPPING = {
    "Goalkeeper": "GK", "Defence": "CB", "Defender": "CB", "Central Back": "CB",
    "Left-Back": "LB", "Right-Back": "RB", "Midfield": "CM", "Midfielder": "CM",
    "Defensive Midfield": "CDM", "Attacking Midfield": "CAM", "Offence": "ST",
    "Forward": "ST", "Winger": "RW", "Left Winger": "LW", "Right Winger": "RW",
}

def parse_api_club_colors(club_colors_str: Optional[str], team_name: str) -> Dict[str, str]:
    """Dynamically parse clubColors into primary, secondary, and text hex values."""
    if club_colors_str:
        parts = [p.strip().lower() for p in club_colors_str.replace("/", ",").split(",") if p.strip()]
        primary_hex = None
        secondary_hex = None

        for p in parts:
            if p in COLOR_NAME_MAP:
                if not primary_hex:
                    primary_hex = COLOR_NAME_MAP[p]
                elif not secondary_hex and COLOR_NAME_MAP[p] != primary_hex:
                    secondary_hex = COLOR_NAME_MAP[p]

        if primary_hex:
            sec = secondary_hex or ("#FFFFFF" if primary_hex != "#FFFFFF" else "#0F172A")
            txt = "#FFFFFF" if primary_hex not in ["#FFFFFF", "#FDE047", "#F8FAFC"] else "#0F172A"
            return {"primary": primary_hex, "secondary": sec, "text": txt}

    hash_val = sum(ord(c) for c in team_name)
    hue = (hash_val * 137) % 360
    return {
        "primary": f"hsl({hue}, 70%, 45%)",
        "secondary": "#FFFFFF",
        "text": "#FFFFFF"
    }

def upsert_competition(db: Session, comp_data: Dict[str, Any]) -> CompetitionModel:
    """Insert or update competition model in the database."""
    code = comp_data.get("code") or "WC"
    comp_id = comp_data.get("id") or code
    name = comp_data.get("name") or "FIFA World Cup"
    comp_type = comp_data.get("type") or "CUP"
    emblem = comp_data.get("emblem") or ""
    season_str = comp_data.get("currentSeason", {}).get("startDate", "2026")[:4]
    try:
        season_int = int(season_str)
    except Exception:
        season_int = 2026

    country = comp_data.get("area", {}).get("name") or "Internacional"

    existing = db.query(CompetitionModel).filter(CompetitionModel.code == code).first()
    if existing:
        existing.name = name
        existing.type = comp_type
        if emblem: existing.emblem = emblem
        existing.season = season_int
        existing.country = country
        comp_obj = existing
    else:
        comp_obj = CompetitionModel(
            id=str(comp_id),
            code=code,
            name=name,
            type=comp_type,
            emblem=emblem,
            season=season_int,
            country=country
        )
        db.add(comp_obj)

    db.flush()
    return comp_obj

def upsert_team(db: Session, team_data: Dict[str, Any]) -> TeamModel:
    """Insert or update a team record in the database."""
    team_id = team_data.get("id")
    if not team_id:
        raise ValueError("Team data must include 'id'")

    name = team_data.get("name") or "Desconhecido"
    short_name = team_data.get("shortName") or team_data.get("tla") or name[:3].upper()
    code = team_data.get("tla") or short_name[:3].upper()
    crest = team_data.get("crest") or ""

    colors = parse_api_club_colors(team_data.get("clubColors"), name)

    existing_team = db.query(TeamModel).filter(TeamModel.id == team_id).first()
    if existing_team:
        existing_team.name = name
        existing_team.short_name = short_name
        existing_team.code = code
        existing_team.primary_color = colors["primary"]
        existing_team.secondary_color = colors["secondary"]
        existing_team.text_color = colors["text"]
        if crest:
            existing_team.crest = crest
        team_obj = existing_team
    else:
        team_obj = TeamModel(
            id=team_id,
            name=name,
            short_name=short_name,
            code=code,
            crest=crest,
            primary_color=colors["primary"],
            secondary_color=colors["secondary"],
            text_color=colors["text"],
            formation="4-3-3"
        )
        db.add(team_obj)

    db.flush()

    squad = team_data.get("squad", [])
    if squad:
        upsert_squad_players(db, team_id, squad)

    return team_obj

def upsert_squad_players(db: Session, team_id: int, squad: List[Dict[str, Any]]):
    """Upsert squad players for a team."""
    for idx, member in enumerate(squad):
        player_id = f"p-{member.get('id', idx)}"
        raw_pos = member.get("position") or "CM"
        mapped_pos = POSITION_MAPPING.get(raw_pos, "CM")
        shirt_num = member.get("shirtNumber") or (idx + 1)
        name = member.get("name") or f"Jogador {shirt_num}"

        is_starting = idx < 11
        x_pos = 50.0
        y_pos = 50.0

        if is_starting:
            if idx == 0:
                x_pos, y_pos = (20.0, 50.0)
            elif idx <= 4:
                x_pos = 46.0
                y_pos = 15.0 + (idx - 1) * 23.0
            elif idx <= 7:
                x_pos = 65.0
                y_pos = 25.0 + (idx - 5) * 25.0
            else:
                x_pos = 80.0
                y_pos = 20.0 + (idx - 8) * 30.0

        existing_player = db.query(PlayerModel).filter(PlayerModel.id == player_id).first()
        if existing_player:
            existing_player.name = name
            existing_player.shirt_number = shirt_num
            existing_player.position = mapped_pos
            existing_player.team_id = team_id
            existing_player.is_starting = is_starting
        else:
            new_player = PlayerModel(
                id=player_id,
                name=name,
                shirt_number=shirt_num,
                position=mapped_pos,
                team_id=team_id,
                is_starting=is_starting,
                x=x_pos,
                y=y_pos
            )
            db.add(new_player)

def parse_utc_date(date_str: str) -> datetime:
    """Parse UTC ISO date string into datetime."""
    try:
        clean_str = date_str.replace("Z", "+00:00")
        return datetime.fromisoformat(clean_str)
    except Exception:
        return datetime.now(timezone.utc)

def upsert_match(db: Session, match_data: Dict[str, Any]):
    """Insert or update match fixture in database."""
    match_id = match_data.get("id")
    if not match_id:
        return

    home_team_raw = match_data.get("homeTeam") or {}
    away_team_raw = match_data.get("awayTeam") or {}

    if not home_team_raw.get("id") or not away_team_raw.get("id"):
        return

    home_team = upsert_team(db, home_team_raw)
    away_team = upsert_team(db, away_team_raw)

    stage_name = match_data.get("stage") or "FASE DE GRUPOS"
    group_name = match_data.get("group")
    if group_name:
        stage_name = f"{stage_name} - {group_name}"

    status = match_data.get("status") or "SCHEDULED"
    utc_date = parse_utc_date(match_data.get("utcDate", ""))

    score = match_data.get("score", {}).get("fullTime", {})
    home_score = score.get("home")
    away_score = score.get("away")

    comp_code = match_data.get("competition", {}).get("code") or "WC"

    existing_match = db.query(MatchModel).filter(MatchModel.id == match_id).first()
    if existing_match:
        existing_match.competition_code = comp_code
        existing_match.stage = stage_name
        existing_match.status = status
        existing_match.utc_date = utc_date
        existing_match.home_team_id = home_team.id
        existing_match.away_team_id = away_team.id
        existing_match.home_score = home_score
        existing_match.away_score = away_score
    else:
        new_match = MatchModel(
            id=match_id,
            competition_code=comp_code,
            stage=stage_name,
            status=status,
            utc_date=utc_date,
            home_team_id=home_team.id,
            away_team_id=away_team.id,
            home_score=home_score,
            away_score=away_score
        )
        db.add(new_match)

async def sync_world_cup_job():
    """Background ETL Orchestrator Service using the configured Data Provider."""
    logger.info("[SyncService] Executing World Cup Data Sync Pipeline via Provider...")
    provider = get_football_provider()
    db: Session = SessionLocal()
    
    try:
        # 1. Fetch Competition Record via Provider
        comp_data = await provider.fetch_competition("WC")
        if comp_data:
            upsert_competition(db, comp_data)
            db.commit()
            logger.info(f"[SyncService] Competition synced via Provider: {comp_data.get('name')}")

        # 2. Fetch Teams List via Provider
        teams = await provider.fetch_teams("WC")
        if teams:
            logger.info(f"[SyncService] Processing {len(teams)} teams via Provider...")
            for t in teams:
                if not t.get("squad"):
                    detail = await provider.fetch_team_detail(t["id"])
                    if detail and "squad" in detail:
                        t["squad"] = detail["squad"]
                upsert_team(db, t)
            db.commit()
            logger.info(f"[SyncService] Database updated with {len(teams)} Teams & Squads!")

        # 3. Fetch Matches Fixtures via Provider
        matches = await provider.fetch_matches("WC")
        if matches:
            logger.info(f"[SyncService] Processing {len(matches)} matches via Provider...")
            for m in matches:
                upsert_match(db, m)
            db.commit()
            logger.info(f"[SyncService] Database updated with {len(matches)} Matches!")

        logger.info("[SyncService] World Cup Sync Job Finished Successfully via Provider Architecture!")
    except Exception as e:
        db.rollback()
        logger.error(f"[SyncService] Error during sync pipeline: {e}")
    finally:
        db.close()
