import os
from providers.base import AbstractFootballProvider
from providers.football_data_org import FootballDataOrgProvider
from providers.thesportsdb import TheSportsDBProvider

def get_football_provider() -> AbstractFootballProvider:
    """Factory function to instantiate the active football data provider based on environment config."""
    provider_type = os.getenv("FOOTBALL_PROVIDER_TYPE", "thesportsdb").lower()

    if provider_type == "thesportsdb":
        return TheSportsDBProvider()
    elif provider_type == "football_data_org":
        return FootballDataOrgProvider()
    
    # Default fallback
    return TheSportsDBProvider()
