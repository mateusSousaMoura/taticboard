from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional

class AbstractFootballProvider(ABC):
    """Abstract base provider interface for football data sync integrations."""

    @abstractmethod
    async def fetch_competition(self, comp_code: str) -> Optional[Dict[str, Any]]:
        """Fetch competition details for a given competition code."""
        pass

    @abstractmethod
    async def fetch_teams(self, comp_code: str) -> Optional[List[Dict[str, Any]]]:
        """Fetch list of teams participating in a competition."""
        pass

    @abstractmethod
    async def fetch_matches(self, comp_code: str) -> Optional[List[Dict[str, Any]]]:
        """Fetch list of match fixtures for a competition."""
        pass

    @abstractmethod
    async def fetch_team_detail(self, team_id: int) -> Optional[Dict[str, Any]]:
        """Fetch detailed squad information for a single team."""
        pass
