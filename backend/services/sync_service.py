import os
import time
import asyncio
import httpx
import datetime
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from models.football import CompetitionModel, TeamModel, PlayerModel, MatchModel
from database import SessionLocal

load_dotenv()

API_TOKEN = os.getenv("FOOTBALL_DATA_API_TOKEN", "")
API_URL = os.getenv("FOOTBALL_DATA_API_URL", "https://api.football-data.org/v4")
# Minimum delay between requests to strictly respect 10 req/min limit (60s / 10 = 6s + 1s buffer)
REQUEST_DELAY_SECONDS = float(os.getenv("API_REQUEST_DELAY_SECONDS", "7.0"))

class RateLimitedApiClient:
    """Client that enforces strict rate limits (max 10 requests per minute)."""
    
    def __init__(self, api_token: str, base_url: str):
        self.api_token = api_token
        self.base_url = base_url
        self.last_request_time = 0.0
        self.requests_count = 0

    async def get(self, endpoint: str):
        if not self.api_token or self.api_token == "your_token_here":
            print("[SyncService] No valid API token configured. Skipping API call.")
            return None

        # Enforce rate limit delay
        now = time.time()
        elapsed = now - self.last_request_time
        if elapsed < REQUEST_DELAY_SECONDS:
            wait_time = REQUEST_DELAY_SECONDS - elapsed
            print(f"[RateLimiter] Waiting {wait_time:.2f}s before next API request to prevent hitting rate limit...")
            await asyncio.sleep(wait_time)

        headers = {"X-Auth-Token": self.api_token}
        url = f"{self.base_url}{endpoint}"

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                print(f"[SyncService] Fetching API: {url}")
                self.last_request_time = time.time()
                self.requests_count += 1
                response = await client.get(url, headers=headers)

                if response.status_code == 429:
                    print("[RateLimiter] Received HTTP 429 (Too Many Requests). Waiting 60s...")
                    await asyncio.sleep(60.0)
                    return None

                response.raise_for_status()
                return response.json()
        except Exception as e:
            print(f"[SyncService] API Request error ({url}): {e}")
            return None

api_client = RateLimitedApiClient(API_TOKEN, API_URL)

async def sync_world_cup_job():
    """Background job to safely sync FIFA World Cup data into Database."""
    print(f"[Scheduler] Starting World Cup Data Sync Job at {datetime.datetime.utcnow()}...")
    db: Session = SessionLocal()
    try:
        # 1. Ensure World Cup Competition Record
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

        # 2. Try fetching teams from API (WC / 2000)
        teams_data = await api_client.get("/competitions/WC/teams")
        if teams_data and "teams" in teams_data:
            print(f"[SyncService] Synced {len(teams_data['teams'])} World Cup Teams from Football API!")
            for t in teams_data["teams"]:
                team_id = t["id"]
                existing_team = db.query(TeamModel).filter(TeamModel.id == team_id).first()
                if not existing_team:
                    existing_team = TeamModel(
                        id=team_id,
                        name=t.get("name", "Desconhecido"),
                        short_name=t.get("shortName", t.get("tla", "TEAM")),
                        code=t.get("tla", "TEAM"),
                        crest=t.get("crest", ""),
                        primary_color="#FDE047" if "Brazil" in t.get("name", "") else "#2563EB",
                        secondary_color="#16A34A" if "Brazil" in t.get("name", "") else "#FFFFFF"
                    )
                    db.add(existing_team)
            db.commit()

        # 3. Try fetching World Cup matches
        matches_data = await api_client.get("/competitions/WC/matches")
        if matches_data and "matches" in matches_data:
            print(f"[SyncService] Synced {len(matches_data['matches'])} World Cup Matches!")

        print("[Scheduler] World Cup Data Sync Job Completed Successfully!")
    except Exception as e:
        print(f"[SyncService] Error during World Cup sync job: {e}")
    finally:
        db.close()
