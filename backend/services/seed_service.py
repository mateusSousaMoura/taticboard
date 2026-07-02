from sqlalchemy.orm import Session
from models.football import CompetitionModel, TeamModel, PlayerModel, MatchModel
from core.logging import logger
import datetime

def seed_initial_world_cup_data(db: Session):
    """Seed World Cup competitions, teams, and rosters if database is empty."""
    comp_count = db.query(CompetitionModel).count()
    if comp_count > 0:
        return

    logger.info("[SeedService] Seeding database with FIFA World Cup 2026 teams and fixtures...")

    # 1. Competitions
    competitions = [
        CompetitionModel(id="WC", code="WC", name="FIFA World Cup 2026", type="WORLD_CUP", emblem="https://crests.football-data.org/764.svg", season=2026, country="Internacional"),
        CompetitionModel(id="CL", code="CL", name="UEFA Champions League", type="CHAMPIONS_LEAGUE", emblem="https://crests.football-data.org/CL.svg", season=2026, country="Europa"),
        CompetitionModel(id="BSA", code="BSA", name="Brasileirão Série A", type="DOMESTIC_LEAGUE", emblem="https://crests.football-data.org/764.svg", season=2026, country="Brasil"),
        CompetitionModel(id="PL", code="PL", name="Premier League", type="DOMESTIC_LEAGUE", emblem="https://crests.football-data.org/PL.svg", season=2026, country="Inglaterra"),
    ]
    db.add_all(competitions)

    # 2. Teams
    brasil = TeamModel(id=764, name="Brasil", short_name="BRA", code="BRA", crest="https://crests.football-data.org/764.svg", primary_color="#FDE047", secondary_color="#16A34A", text_color="#0F172A", formation="4-3-3")
    japao = TeamModel(id=776, name="Japão", short_name="JPN", code="JPN", crest="https://crests.football-data.org/776.svg", primary_color="#2563EB", secondary_color="#FFFFFF", text_color="#FFFFFF", formation="3-4-2-1")
    argentina = TeamModel(id=762, name="Argentina", short_name="ARG", code="ARG", crest="https://crests.football-data.org/762.svg", primary_color="#38BDF8", secondary_color="#FFFFFF", text_color="#FFFFFF", formation="4-3-3")
    franca = TeamModel(id=773, name="França", short_name="FRA", code="FRA", crest="https://crests.football-data.org/773.svg", primary_color="#1E3A8A", secondary_color="#EF4444", text_color="#FFFFFF", formation="4-2-3-1")
    espanha = TeamModel(id=760, name="Espanha", short_name="ESP", code="ESP", crest="https://crests.football-data.org/760.svg", primary_color="#DC2626", secondary_color="#FACC15", text_color="#FFFFFF", formation="4-3-3")

    db.add_all([brasil, japao, argentina, franca, espanha])
    db.commit()

    # 3. Players for Brasil
    bra_players = [
        PlayerModel(id="bra-1", name="Alisson", shirt_number=1, position="GK", team_id=764, is_starting=True, x=20.0, y=50.0, photo_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"),
        PlayerModel(id="bra-2", name="Danilo", shirt_number=2, position="RB", team_id=764, is_starting=True, x=58.0, y=14.0, photo_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"),
        PlayerModel(id="bra-4", name="Marquinhos", shirt_number=4, position="CB", team_id=764, is_starting=True, x=46.0, y=36.0, photo_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"),
        PlayerModel(id="bra-3", name="G. Magalhães", shirt_number=3, position="CB", team_id=764, is_starting=True, x=46.0, y=64.0, photo_url="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"),
        PlayerModel(id="bra-6", name="Wendell", shirt_number=6, position="LB", team_id=764, is_starting=True, x=58.0, y=86.0, photo_url="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"),
        PlayerModel(id="bra-5", name="Casemiro", shirt_number=5, position="CDM", team_id=764, is_starting=True, x=55.0, y=50.0, photo_url="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"),
        PlayerModel(id="bra-8", name="B. Guimarães", shirt_number=8, position="CM", team_id=764, is_starting=True, x=68.0, y=30.0, photo_url="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"),
        PlayerModel(id="bra-10", name="Lucas Paquetá", shirt_number=10, position="CAM", team_id=764, is_starting=True, x=68.0, y=70.0, photo_url="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"),
        PlayerModel(id="bra-11", name="Raphinha", shirt_number=11, position="RW", team_id=764, is_starting=True, x=78.0, y=16.0, photo_url="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"),
        PlayerModel(id="bra-9", name="Rodrygo", shirt_number=9, position="ST", team_id=764, is_starting=True, x=83.0, y=50.0, photo_url="https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=150&auto=format&fit=crop&q=80"),
        PlayerModel(id="bra-7", name="Vinicius Jr.", shirt_number=7, position="LW", team_id=764, is_starting=True, x=78.0, y=84.0, photo_url="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80"),
        PlayerModel(id="bra-12", name="Bento", shirt_number=12, position="GK", team_id=764, is_starting=False, x=0.0, y=0.0),
        PlayerModel(id="bra-20", name="Endrick", shirt_number=20, position="ST", team_id=764, is_starting=False, x=0.0, y=0.0),
    ]

    # Players for Japão
    jpn_players = [
        PlayerModel(id="jpn-1", name="Zion Suzuki", shirt_number=1, position="GK", team_id=776, is_starting=True, x=95.0, y=50.0, photo_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"),
        PlayerModel(id="jpn-2", name="Sugawara", shirt_number=2, position="RWB", team_id=776, is_starting=True, x=82.0, y=16.0),
        PlayerModel(id="jpn-4", name="Ko Itakura", shirt_number=4, position="CB", team_id=776, is_starting=True, x=85.0, y=34.0),
        PlayerModel(id="jpn-16", name="Tomiyasu", shirt_number=16, position="CB", team_id=776, is_starting=True, x=86.0, y=50.0),
        PlayerModel(id="jpn-3", name="Taniguchi", shirt_number=3, position="CB", team_id=776, is_starting=True, x=85.0, y=66.0),
        PlayerModel(id="jpn-5", name="Nagatomo", shirt_number=5, position="LWB", team_id=776, is_starting=True, x=82.0, y=84.0),
        PlayerModel(id="jpn-6", name="Wataru Endo", shirt_number=6, position="CDM", team_id=776, is_starting=True, x=74.0, y=32.0),
        PlayerModel(id="jpn-13", name="H. Morita", shirt_number=13, position="CM", team_id=776, is_starting=True, x=74.0, y=48.0),
        PlayerModel(id="jpn-20", name="Take Kubo", shirt_number=20, position="CAM", team_id=776, is_starting=True, x=74.0, y=64.0),
        PlayerModel(id="jpn-7", name="K. Mitoma", shirt_number=7, position="CAM", team_id=776, is_starting=True, x=74.0, y=80.0),
        PlayerModel(id="jpn-9", name="Ayase Ueda", shirt_number=9, position="ST", team_id=776, is_starting=True, x=62.0, y=50.0),
        PlayerModel(id="jpn-8", name="Minamino", shirt_number=8, position="CAM", team_id=776, is_starting=False, x=0.0, y=0.0),
    ]

    db.add_all(bra_players + jpn_players)
    db.commit()

    # 4. Matches
    matches = [
        MatchModel(id=327117, competition_code="WC", stage="FASE DE GRUPOS - GRUPO A", status="SCHEDULED", utc_date=datetime.datetime(2026, 6, 11, 16, 0), home_team_id=764, away_team_id=776),
        MatchModel(id=327118, competition_code="WC", stage="FASE DE GRUPOS - GRUPO A", status="SCHEDULED", utc_date=datetime.datetime(2026, 6, 14, 20, 0), home_team_id=764, away_team_id=762),
        MatchModel(id=327119, competition_code="WC", stage="FASE DE GRUPOS - GRUPO B", status="SCHEDULED", utc_date=datetime.datetime(2026, 6, 18, 18, 0), home_team_id=773, away_team_id=760),
    ]
    db.add_all(matches)
    db.commit()

    logger.info("[SeedService] Seeding completed successfully!")
