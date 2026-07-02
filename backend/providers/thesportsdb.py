import time
import asyncio
import httpx
from typing import Dict, Any, List, Optional
from core.config import settings
from core.logging import logger
from providers.base import AbstractFootballProvider

class TheSportsDBProvider(AbstractFootballProvider):
    """Implementation of AbstractFootballProvider for TheSportsDB API (v1)."""

    def __init__(self, api_key: str = settings.THESPORTSDB_API_KEY, base_url: str = settings.THESPORTSDB_API_URL):
        self.api_key = api_key
        self.base_url = f"{base_url.rstrip('/')}/{api_key}"
        self.last_request_time = 0.0
        # Default World Cup League ID on TheSportsDB
        self.wc_league_id = "4429"

    async def _get(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        # Enforce rate limit delay
        now = time.time()
        elapsed = now - self.last_request_time
        if elapsed < settings.API_REQUEST_DELAY_SECONDS:
            wait_time = settings.API_REQUEST_DELAY_SECONDS - elapsed
            logger.info(f"[TheSportsDBProvider] Waiting {wait_time:.2f}s before next request...")
            await asyncio.sleep(wait_time)

        url = f"{self.base_url}/{endpoint.lstrip('/')}"

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                logger.info(f"[TheSportsDBProvider] Fetching API: {url} with params {params}")
                self.last_request_time = time.time()
                response = await client.get(url, params=params)

                if response.status_code == 429:
                    logger.warning("[TheSportsDBProvider] HTTP 429 (Rate Limit). Cooling down for 60s...")
                    await asyncio.sleep(60.0)
                    return None

                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"[TheSportsDBProvider] API Request error ({url}): {e}")
            return None

    async def fetch_competition(self, comp_code: str) -> Optional[Dict[str, Any]]:
        # Map competition code WC to TheSportsDB League ID 4429
        league_id = self.wc_league_id if comp_code == "WC" else comp_code
        data = await self._get("/lookupleague.php", params={"id": league_id})
        if not data or not data.get("leagues"):
            return None

        league = data["leagues"][0]
        return {
            "id": league.get("idLeague") or comp_code,
            "code": comp_code,
            "name": league.get("strLeague") or "FIFA World Cup",
            "type": league.get("strSport") or "WORLD_CUP",
            "emblem": league.get("strBadge") or league.get("strLogo") or "",
            "currentSeason": {"startDate": league.get("strCurrentSeason", "2026")[:4]},
            "area": {"name": league.get("strCountry") or "Internacional"}
        }

    async def fetch_teams(self, comp_code: str) -> Optional[List[Dict[str, Any]]]:
        league_id = self.wc_league_id if comp_code == "WC" else comp_code
        data = await self._get("/lookup_all_teams.php", params={"id": league_id})
        if not data or not data.get("teams"):
            # Fallback to search by league name
            data = await self._get("/search_all_teams.php", params={"l": "FIFA World Cup"})

        if not data or not data.get("teams"):
            return None

        formatted_teams = []
        for t in data["teams"]:
            team_id = int(t.get("idTeam", 0))
            if not team_id:
                continue

            c1 = t.get("strColour1") or ""
            c2 = t.get("strColour2") or ""
            club_colors = f"{c1} / {c2}".strip(" /")

            formatted_teams.append({
                "id": team_id,
                "name": t.get("strTeam") or "Desconhecido",
                "shortName": t.get("strTeamShort") or t.get("strAlternate") or t.get("strTeam", "")[:3].upper(),
                "tla": t.get("strTeamShort") or t.get("strTeam", "")[:3].upper(),
                "crest": t.get("strBadge") or t.get("strLogo") or t.get("strEquipment") or "",
                "clubColors": club_colors,
                "squad": []
            })

        return formatted_teams

    async def fetch_team_detail(self, team_id: int) -> Optional[Dict[str, Any]]:
        data = await self._get("/lookup_all_players.php", params={"id": team_id})
        if not data or not data.get("player"):
            return None

        squad = []
        for idx, p in enumerate(data["player"]):
            try:
                num = int(p.get("strNumber"))
            except (ValueError, TypeError):
                num = idx + 1

            squad.append({
                "id": p.get("idPlayer") or f"sp-{idx}",
                "name": p.get("strPlayer") or f"Jogador {num}",
                "position": p.get("strPosition") or "CM",
                "shirtNumber": num,
                "photoUrl": p.get("strCutout") or p.get("strRender") or p.get("strThumb") or ""
            })

        return {"id": team_id, "squad": squad}

    async def fetch_matches(self, comp_code: str) -> Optional[List[Dict[str, Any]]]:
        league_id = self.wc_league_id if comp_code == "WC" else comp_code
        
        # Fetch events for season or next league events
        data = await self._get("/eventsseason.php", params={"id": league_id, "s": "2026"})
        if not data or not data.get("events"):
            data = await self._get("/eventsnextleague.php", params={"id": league_id})
        if not data or not data.get("events"):
            data = await self._get("/eventspastleague.php", params={"id": league_id})

        if not data or not data.get("events"):
            return None

        formatted_matches = []
        for m in data["events"]:
            match_id = int(m.get("idEvent", 0))
            home_id = int(m.get("idHomeTeam", 0))
            away_id = int(m.get("idAwayTeam", 0))

            if not match_id or not home_id or not away_id:
                continue

            date_str = m.get("dateEvent") or "2026-06-11"
            time_str = m.get("strTime") or "16:00:00"
            utc_date = f"{date_str}T{time_str}Z"

            status = "FINISHED" if m.get("intHomeScore") is not None else "SCHEDULED"

            formatted_matches.append({
                "id": match_id,
                "competition": {"code": comp_code},
                "stage": m.get("strRound") or m.get("strEvent") or "FASE DE GRUPOS",
                "status": status,
                "utcDate": utc_date,
                "homeTeam": {
                    "id": home_id,
                    "name": m.get("strHomeTeam") or "Mandante"
                },
                "awayTeam": {
                    "id": away_id,
                    "name": m.get("strAwayTeam") or "Visitante"
                },
                "score": {
                    "fullTime": {
                        "home": int(m.get("intHomeScore")) if m.get("intHomeScore") is not None else None,
                        "away": int(m.get("intAwayScore")) if m.get("intAwayScore") is not None else None
                    }
                }
            })

        return formatted_matches
