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
  teamId: 'teamA' | 'teamB';
  photoUrl?: string;
  x: number; // Percentage on canvas 0 - 100
  y: number; // Percentage on canvas 0 - 100
  isStarting: boolean;
}

export interface Team {
  id: 'teamA' | 'teamB';
  name: string;
  shortName: string;
  countryCode: string;
  primaryColor: string; // e.g. '#facc15' for Brazil Yellow
  secondaryColor: string; // e.g. '#16A34A' for Brazil Green
  textColor: string;
  formation: string; // e.g. '4-3-3', '4-2-3-1'
  starting: Player[];
  bench: Player[];
}

export type ToolMode = 'select' | 'highlight' | 'arrow' | 'eraser';

export interface TacticalLine {
  id: string;
  type: 'highlight';
  playerIds?: string[];
  color: string;
  style: 'solid' | 'dashed';
  teamId?: 'teamA' | 'teamB';
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
  viewMode: 'photo' | 'number'; // 'photo' = Foto do jogador, 'number' = Número/Ícone no círculo
  showNames: boolean;
}

export type PhaseState = 'teamA_attack' | 'teamB_attack';
