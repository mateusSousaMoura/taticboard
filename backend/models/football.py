from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from database import Base
import datetime

class CompetitionModel(Base):
    __tablename__ = "competitions"

    id = Column(String, primary_key=True, index=True) # e.g. "WC"
    code = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False) # "WORLD_CUP", "CHAMPIONS_LEAGUE", etc.
    emblem = Column(String, nullable=True)
    season = Column(Integer, nullable=False)
    country = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    matches = relationship("MatchModel", back_populates="competition", cascade="all, delete-orphan")

class TeamModel(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    short_name = Column(String, nullable=True)
    code = Column(String, nullable=True)
    crest = Column(String, nullable=True)
    primary_color = Column(String, default="#FDE047")
    secondary_color = Column(String, default="#16A34A")
    text_color = Column(String, default="#0F172A")
    formation = Column(String, default="4-3-3")
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    players = relationship("PlayerModel", back_populates="team", cascade="all, delete-orphan")

class PlayerModel(Base):
    __tablename__ = "players"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    shirt_number = Column(Integer, nullable=False)
    position = Column(String, nullable=False) # GK, CB, LB, RB, CDM, CM, CAM, RW, LW, ST
    team_id = Column(Integer, ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    photo_url = Column(String, nullable=True)
    is_starting = Column(Boolean, default=False)
    x = Column(Float, default=50.0)
    y = Column(Float, default=50.0)

    team = relationship("TeamModel", back_populates="players")

class MatchModel(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    competition_code = Column(String, ForeignKey("competitions.code", ondelete="CASCADE"), nullable=False)
    stage = Column(String, nullable=False)
    status = Column(String, default="SCHEDULED") # SCHEDULED, LIVE, FINISHED
    utc_date = Column(DateTime, nullable=False)
    
    home_team_id = Column(Integer, ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    away_team_id = Column(Integer, ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    
    home_score = Column(Integer, nullable=True)
    away_score = Column(Integer, nullable=True)
    
    home_team_formation = Column(String, default="4-3-3")
    away_team_formation = Column(String, default="4-3-3")
    
    tactical_lines = Column(JSON, default=list)
    tactical_arrows = Column(JSON, default=list)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    competition = relationship("CompetitionModel", back_populates="matches")
    home_team = relationship("TeamModel", foreign_keys=[home_team_id])
    away_team = relationship("TeamModel", foreign_keys=[away_team_id])
