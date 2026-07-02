import os
from providers.base import AbstractFootballProvider
from providers.football_data_org import FootballDataOrgProvider
from providers.thesportsdb import TheSportsDBProvider

def get_football_provider() -> AbstractFootballProvider:
    """Factory function to instantiate the active football data provider based on environment config."""
    provider_type = os.getenv("FOOTBALL_PROVIDER_TYPE", "football_data_org").lower()

    if provider_type == "football_data_org":
        return FootballDataOrgProvider()
    elif provider_type == "thesportsdb":
        return TheSportsDBProvider()
    
    # Default fallback
    return FootballDataOrgProvider()
