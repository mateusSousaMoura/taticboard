export type PositionCode = 
  | 'GK' 
  | 'CB' | 'LB' | 'RB' | 'LWB' | 'RWB'
  | 'CDM' | 'CM' | 'CAM' | 'LM' | 'RM'
  | 'LW' | 'RW' | 'ST' | 'CF';

export interface Player {
  id: string;
  name: string;
  number: number;
  position: PositionCode;
  teamId: string;
  photoUrl?: string;
  x: number; // Percentage on canvas 0 - 100
  y: number; // Percentage on canvas 0 - 100
  isStarting: boolean;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  code: string;
  crest: string; // Flag/Emblem URL
  primaryColor: string; // e.g. '#facc15'
  secondaryColor: string; // e.g. '#16A34A'
  textColor: string;
  formation: string; // e.g. '4-3-3'
  starting: Player[];
  bench: Player[];
}

export interface Competition {
  id: string;
  code: string;
  name: string;
  type: 'WORLD_CUP' | 'CHAMPIONS_LEAGUE' | 'DOMESTIC_LEAGUE' | 'INTERNATIONAL';
  emblem: string;
  season: number;
  country: string;
  featured?: boolean;
}

export interface MatchFixture {
  id: string;
  competitionCode: string;
  utcDate: string;
  stage: string;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED';
  homeTeam: Team;
  awayTeam: Team;
}

export type ToolMode = 'select' | 'highlight' | 'arrow' | 'eraser';

export interface TacticalLine {
  id: string;
  type: 'highlight';
  playerIds?: string[];
  color: string;
  style: 'solid' | 'dashed';
  teamId?: string;
}

export interface ArrowAnnotation {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  type: 'run' | 'pass';
}

export interface DisplaySettings {
  viewMode: 'photo' | 'number';
  showNames: boolean;
}

export type PhaseState = 'teamA_attack' | 'teamB_attack';
