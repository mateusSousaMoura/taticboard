import os
from providers.base import AbstractFootballProvider
from providers.football_data_org import FootballDataOrgProvider

def get_football_provider() -> AbstractFootballProvider:
    """Factory function to instantiate the active football data provider based on environment config."""
    provider_type = os.getenv("FOOTBALL_PROVIDER_TYPE", "football_data_org").lower()

    if provider_type == "football_data_org":
        return FootballDataOrgProvider()
    
    # Fallback to default provider
    return FootballDataOrgProvider()
