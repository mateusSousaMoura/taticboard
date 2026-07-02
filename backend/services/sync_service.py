import time
import asyncio
import httpx
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from core.config import settings
from core.logging import logger
from models.football import CompetitionModel, TeamModel, PlayerModel, MatchModel
from database import SessionLocal

POSITION_MAPPING = {
  "Goalkeeper": "GK",
  "Defence": "CB",
  "Defender": "CB",
  "Central Back": "CB",
  "Left-Back": "LB",
  "Right-Back": "RB",
  "Midfield": "CM",
  "Midfielder": "CM",
  "Defensive Midfield": "CDM",
  "Attacking Midfield": "CAM",
  "Offence": "ST",
  "Forward": "ST",
  "Winger": "RW",
  "Left Winger": "LW",
  "Right Winger": "RW",
}

class RateLimitedApiClient:
    """Client that enforces strict rate limits (max 10 requests per minute)."""
    
    def __init__(self, api_token: str, base_url: str):
        self.api_token = api_token
        self.base_url = base_url
        self.last_request_time = 0.0
        self.requests_count = 0

    async def get(self, endpoint: str) -> Optional[Dict[str, Any]]:
        if not self.api_token or self.api_token == "your_token_here":
            logger.warning("[SyncService] No valid API token configured. Skipping API call.")
            return None

        # Enforce rate limit delay
        now = time.time()
        elapsed = now - self.last_request_time
        if elapsed < settings.API_REQUEST_DELAY_SECONDS:
            wait_time = settings.API_REQUEST_DELAY_SECONDS - elapsed
            logger.info(f"[RateLimiter] Waiting {wait_time:.2f}s before next API call (Limit: 10 req/min)...")
            await asyncio.sleep(wait_time)

        headers = {"X-Auth-Token": self.api_token}
        url = f"{self.base_url}{endpoint}"

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                logger.info(f"[SyncService] Fetching API: {url}")
                self.last_request_time = time.time()
                self.requests_count += 1
                response = await client.get(url, headers=headers)

                if response.status_code == 429:
                    logger.warning("[RateLimiter] HTTP 429 (Too Many Requests). Cooling down for 60s...")
                    await asyncio.sleep(60.0)
                    return None

                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"[SyncService] API Request error ({url}): {e}")
            return None

api_client = RateLimitedApiClient(settings.FOOTBALL_DATA_API_TOKEN, settings.FOOTBALL_DATA_API_URL)

def upsert_team(db: Session, team_data: Dict[str, Any]) -> TeamModel:
    """Insert or update a team record in the database."""
    team_id = team_data.get("id")
    if not team_id:
        raise ValueError("Team data must include 'id'")

    name = team_data.get("name") or "Desconhecido"
    short_name = team_data.get("shortName") or team_data.get("tla") or name[:3].upper()
    code = team_data.get("tla") or short_name[:3].upper()
    crest = team_data.get("crest") or ""

    existing_team = db.query(TeamModel).filter(TeamModel.id == team_id).first()
    if existing_team:
        existing_team.name = name
        existing_team.short_name = short_name
        existing_team.code = code
        if crest:
            existing_team.crest = crest
        team_obj = existing_team
    else:
        # Assign distinct team primary colors
        is_brazil = "Brazil" in name or "Brasil" in name
        team_obj = TeamModel(
            id=team_id,
            name=name,
            short_name=short_name,
            code=code,
            crest=crest,
            primary_color="#FDE047" if is_brazil else "#2563EB",
            secondary_color="#16A34A" if is_brazil else "#FFFFFF",
            text_color="#0F172A" if is_brazil else "#FFFFFF",
            formation="4-3-3"
        )
        db.add(team_obj)

    db.flush()

    # Process squad array if present
    squad = team_data.get("squad", [])
    if squad:
        upsert_squad_players(db, team_id, squad)

    return team_obj

def upsert_squad_players(db: Session, team_id: int, squad: List[Dict[str, Any]]):
    """Upsert squad players for a team with field layout default positions."""
    for idx, member in enumerate(squad):
        player_id = f"p-{member.get('id', idx)}"
        raw_pos = member.get("position") or "CM"
        mapped_pos = POSITION_MAPPING.get(raw_pos, "CM")
        shirt_num = member.get("shirtNumber") or (idx + 1)
        name = member.get("name") or f"Jogador {shirt_num}"

        # Assign field coordinates for first 11 players
        is_starting = idx < 11
        x_pos = 50.0
        y_pos = 50.0

        if is_starting:
            # Basic tactical layout coordinates
            if idx == 0: # GK
                x_pos, y_pos = (20.0, 50.0)
            elif idx <= 4: # Defenders
                x_pos = 46.0
                y_pos = 15.0 + (idx - 1) * 23.0
            elif idx <= 7: # Midfielders
                x_pos = 65.0
                y_pos = 25.0 + (idx - 5) * 25.0
            else: # Attackers
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
    """Safely parse ISO UTC date strings into Python datetime."""
    try:
        clean_str = date_str.replace("Z", "+00:00")
        return datetime.fromisoformat(clean_str)
    except Exception:
        return datetime.now(timezone.utc)

def upsert_match(db: Session, match_data: Dict[str, Any]):
    """Insert or update a match fixture in the database."""
    match_id = match_data.get("id")
    if not match_id:
        return

    home_team_raw = match_data.get("homeTeam") or {}
    away_team_raw = match_data.get("awayTeam") or {}

    if not home_team_raw.get("id") or not away_team_raw.get("id"):
        return

    # Ensure home and away teams are saved first
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

    existing_match = db.query(MatchModel).filter(MatchModel.id == match_id).first()
    if existing_match:
        existing_match.competition_code = "WC"
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
            competition_code="WC",
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
    """Background ETL job to fetch and update World Cup competitions, teams, and matches in PostgreSQL."""
    logger.info(f"[SyncService] Executing World Cup Data Sync Pipeline...")
    db: Session = SessionLocal()
    try:
        # 1. Ensure World Cup Competition Record in DB
        wc_comp = db.query(CompetitionModel).filter(CompetitionModel.code == "WC").first()
        if not wc_comp:
            wc_comp = CompetitionModel(
                id="WC",
                code="WC",
                name="FIFA World Cup 2026",
                type="WORLD_CUP",
                emblem="https://crests.football-data.org/764.svg",
                season=2026,
                country="Internacional"
            )
            db.add(wc_comp)
            db.commit()

        # 2. Sync Teams from Football API
        teams_data = await api_client.get("/competitions/WC/teams")
        if teams_data and "teams" in teams_data:
            logger.info(f"[SyncService] Processing {len(teams_data['teams'])} teams from Football API...")
            for t in teams_data["teams"]:
                upsert_team(db, t)
            db.commit()
            logger.info(f"[SyncService] Database updated with {len(teams_data['teams'])} World Cup Teams & Squads!")

        # 3. Sync Matches & Fixtures from Football API
        matches_data = await api_client.get("/competitions/WC/matches")
        if matches_data and "matches" in matches_data:
            logger.info(f"[SyncService] Processing {len(matches_data['matches'])} matches from Football API...")
            for m in matches_data["matches"]:
                upsert_match(db, m)
            db.commit()
            logger.info(f"[SyncService] Database updated with {len(matches_data['matches'])} World Cup Matches & Fixtures!")

        logger.info("[SyncService] World Cup Sync Job Finished Successfully!")
    except Exception as e:
        db.rollback()
        logger.error(f"[SyncService] Error during World Cup sync pipeline: {e}")
    finally:
        db.close()
