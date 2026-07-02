import time
import asyncio
import httpx
from typing import Dict, Any, List, Optional
from core.config import settings
from core.logging import logger
from providers.base import AbstractFootballProvider

class FootballDataOrgProvider(AbstractFootballProvider):
    """Implementation of AbstractFootballProvider for api.football-data.org (v4)."""

    def __init__(self, api_token: str = settings.FOOTBALL_DATA_API_TOKEN, base_url: str = settings.FOOTBALL_DATA_API_URL):
        self.api_token = api_token
        self.base_url = base_url
        self.last_request_time = 0.0

    async def _get(self, endpoint: str) -> Optional[Dict[str, Any]]:
        if not self.api_token or self.api_token == "your_token_here":
            logger.warning("[FootballDataOrgProvider] No valid API token configured. Skipping request.")
            return None

        # Enforce rate limit delay
        now = time.time()
        elapsed = now - self.last_request_time
        if elapsed < settings.API_REQUEST_DELAY_SECONDS:
            wait_time = settings.API_REQUEST_DELAY_SECONDS - elapsed
            logger.info(f"[FootballDataOrgProvider] Waiting {wait_time:.2f}s before next request...")
            await asyncio.sleep(wait_time)

        headers = {"X-Auth-Token": self.api_token}
        url = f"{self.base_url}{endpoint}"

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                logger.info(f"[FootballDataOrgProvider] Fetching API: {url}")
                self.last_request_time = time.time()
                response = await client.get(url, headers=headers)

                if response.status_code == 429:
                    logger.warning("[FootballDataOrgProvider] HTTP 429 (Rate Limit). Cooling down for 60s...")
                    await asyncio.sleep(60.0)
                    return None

                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"[FootballDataOrgProvider] API Request error ({url}): {e}")
            return None

    async def fetch_competition(self, comp_code: str) -> Optional[Dict[str, Any]]:
        return await self._get(f"/competitions/{comp_code}")

    async def fetch_teams(self, comp_code: str) -> Optional[List[Dict[str, Any]]]:
        data = await self._get(f"/competitions/{comp_code}/teams")
        if data and "teams" in data:
            return data["teams"]
        return None

    async def fetch_matches(self, comp_code: str) -> Optional[List[Dict[str, Any]]]:
        data = await self._get(f"/competitions/{comp_code}/matches")
        if data and "matches" in data:
            return data["matches"]
        return None

    async def fetch_team_detail(self, team_id: int) -> Optional[Dict[str, Any]]:
        return await self._get(f"/teams/{team_id}")
