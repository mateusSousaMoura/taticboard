import type { Team } from '../types/tactics';

export const initialBrazilTeam: Team = {
  id: 'teamA',
  name: 'Brasil',
  shortName: 'BRA',
  countryCode: 'BR',
  primaryColor: '#FDE047', // Yellow
  secondaryColor: '#16A34A', // Green
  textColor: '#0F172A',
  formation: '4-3-3',
  starting: [
    { id: 'bra-1', name: 'Alisson', number: 1, position: 'GK', teamId: 'teamA', x: 20, y: 50, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { id: 'bra-2', name: 'Danilo', number: 2, position: 'RB', teamId: 'teamA', x: 58, y: 14, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { id: 'bra-4', name: 'Marquinhos', number: 4, position: 'CB', teamId: 'teamA', x: 45, y: 36, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { id: 'bra-3', name: 'G. Magalhães', number: 3, position: 'CB', teamId: 'teamA', x: 45, y: 64, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80' },
    { id: 'bra-6', name: 'Wendell', number: 6, position: 'LB', teamId: 'teamA', x: 58, y: 86, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80' },
    { id: 'bra-5', name: 'Casemiro', number: 5, position: 'CDM', teamId: 'teamA', x: 54, y: 50, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
    { id: 'bra-8', name: 'B. Guimarães', number: 8, position: 'CM', teamId: 'teamA', x: 66, y: 30, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' },
    { id: 'bra-10', name: 'Lucas Paquetá', number: 10, position: 'CAM', teamId: 'teamA', x: 66, y: 70, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
    { id: 'bra-11', name: 'Raphinha', number: 11, position: 'RW', teamId: 'teamA', x: 78, y: 16, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
    { id: 'bra-9', name: 'Rodrygo', number: 9, position: 'ST', teamId: 'teamA', x: 82, y: 50, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=150&auto=format&fit=crop&q=80' },
    { id: 'bra-7', name: 'Vinicius Jr.', number: 7, position: 'LW', teamId: 'teamA', x: 78, y: 84, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80' }
  ],
  bench: [
    { id: 'bra-12', name: 'Bento', number: 12, position: 'GK', teamId: 'teamA', x: 0, y: 0, isStarting: false },
    { id: 'bra-13', name: 'Yan Couto', number: 13, position: 'RB', teamId: 'teamA', x: 0, y: 0, isStarting: false },
    { id: 'bra-14', name: 'Bremer', number: 14, position: 'CB', teamId: 'teamA', x: 0, y: 0, isStarting: false },
    { id: 'bra-15', name: 'Beraldo', number: 15, position: 'CB', teamId: 'teamA', x: 0, y: 0, isStarting: false },
    { id: 'bra-16', name: 'G. Arana', number: 16, position: 'LB', teamId: 'teamA', x: 0, y: 0, isStarting: false },
    { id: 'bra-17', name: 'João Gomes', number: 17, position: 'CDM', teamId: 'teamA', x: 0, y: 0, isStarting: false },
    { id: 'bra-18', name: 'Douglas Luiz', number: 18, position: 'CM', teamId: 'teamA', x: 0, y: 0, isStarting: false },
    { id: 'bra-19', name: 'A. Pereira', number: 19, position: 'CAM', teamId: 'teamA', x: 0, y: 0, isStarting: false },
    { id: 'bra-20', name: 'Endrick', number: 20, position: 'ST', teamId: 'teamA', x: 0, y: 0, isStarting: false },
    { id: 'bra-21', name: 'Savinho', number: 21, position: 'RW', teamId: 'teamA', x: 0, y: 0, isStarting: false },
    { id: 'bra-22', name: 'G. Martinelli', number: 22, position: 'LW', teamId: 'teamA', x: 0, y: 0, isStarting: false }
  ]
};

export const initialJapanTeam: Team = {
  id: 'teamB',
  name: 'Japão',
  shortName: 'JPN',
  countryCode: 'JP',
  primaryColor: '#2563EB', // Blue
  secondaryColor: '#FFFFFF', // White
  textColor: '#FFFFFF',
  formation: '3-4-2-1',
  starting: [
    { id: 'jpn-1', name: 'Zion Suzuki', number: 1, position: 'GK', teamId: 'teamB', x: 95, y: 50, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
    { id: 'jpn-2', name: 'Sugawara', number: 2, position: 'RWB', teamId: 'teamB', x: 82, y: 16, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80' },
    { id: 'jpn-4', name: 'Ko Itakura', number: 4, position: 'CB', teamId: 'teamB', x: 85, y: 34, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' },
    { id: 'jpn-16', name: 'Tomiyasu', number: 16, position: 'CB', teamId: 'teamB', x: 86, y: 50, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { id: 'jpn-3', name: 'Taniguchi', number: 3, position: 'CB', teamId: 'teamB', x: 85, y: 66, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80' },
    { id: 'jpn-5', name: 'Nagatomo', number: 5, position: 'LWB', teamId: 'teamB', x: 82, y: 84, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { id: 'jpn-6', name: 'Wataru Endo', number: 6, position: 'CDM', teamId: 'teamB', x: 74, y: 32, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
    { id: 'jpn-13', name: 'H. Morita', number: 13, position: 'CM', teamId: 'teamB', x: 74, y: 48, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
    { id: 'jpn-20', name: 'Take Kubo', number: 20, position: 'CAM', teamId: 'teamB', x: 74, y: 64, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
    { id: 'jpn-7', name: 'K. Mitoma', number: 7, position: 'CAM', teamId: 'teamB', x: 74, y: 80, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=150&auto=format&fit=crop&q=80' },
    { id: 'jpn-9', name: 'Ayase Ueda', number: 9, position: 'ST', teamId: 'teamB', x: 62, y: 50, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80' }
  ],
  bench: [
    { id: 'jpn-12', name: 'K. Osako', number: 12, position: 'GK', teamId: 'teamB', x: 0, y: 0, isStarting: false },
    { id: 'jpn-14', name: 'D. Hashioka', number: 14, position: 'RB', teamId: 'teamB', x: 0, y: 0, isStarting: false },
    { id: 'jpn-15', name: 'K. Machida', number: 15, position: 'CB', teamId: 'teamB', x: 0, y: 0, isStarting: false },
    { id: 'jpn-17', name: 'Ao Tanaka', number: 17, position: 'CM', teamId: 'teamB', x: 0, y: 0, isStarting: false },
    { id: 'jpn-18', name: 'Reo Hatate', number: 18, position: 'CM', teamId: 'teamB', x: 0, y: 0, isStarting: false },
    { id: 'jpn-8', name: 'Minamino', number: 8, position: 'CAM', teamId: 'teamB', x: 0, y: 0, isStarting: false },
    { id: 'jpn-10', name: 'Ritsu Doan', number: 10, position: 'RW', teamId: 'teamB', x: 0, y: 0, isStarting: false },
    { id: 'jpn-11', name: 'D. Maeda', number: 11, position: 'LW', teamId: 'teamB', x: 0, y: 0, isStarting: false },
    { id: 'jpn-19', name: 'Nakamura', number: 19, position: 'LW', teamId: 'teamB', x: 0, y: 0, isStarting: false },
    { id: 'jpn-21', name: 'Koki Ogawa', number: 21, position: 'ST', teamId: 'teamB', x: 0, y: 0, isStarting: false }
  ]
};

export interface FormationPositions {
  attack: { position: string; x: number; y: number }[];
  defense: { position: string; x: number; y: number }[];
}

export const FORMATION_LAYOUTS: Record<string, FormationPositions> = {
  '4-3-3': {
    attack: [
      { position: 'GK', x: 20, y: 50 },
      { position: 'RB', x: 58, y: 14 },
      { position: 'CB', x: 46, y: 36 },
      { position: 'CB', x: 46, y: 64 },
      { position: 'LB', x: 58, y: 86 },
      { position: 'CDM', x: 55, y: 50 },
      { position: 'CM', x: 68, y: 30 },
      { position: 'CAM', x: 68, y: 70 },
      { position: 'RW', x: 78, y: 16 },
      { position: 'ST', x: 83, y: 50 },
      { position: 'LW', x: 78, y: 84 }
    ],
    defense: [
      { position: 'GK', x: 5, y: 50 },
      { position: 'RB', x: 18, y: 16 },
      { position: 'CB', x: 15, y: 36 },
      { position: 'CB', x: 15, y: 64 },
      { position: 'LB', x: 18, y: 84 },
      { position: 'CDM', x: 26, y: 50 },
      { position: 'CM', x: 28, y: 30 },
      { position: 'CM', x: 28, y: 70 },
      { position: 'RW', x: 36, y: 18 },
      { position: 'ST', x: 44, y: 50 },
      { position: 'LW', x: 36, y: 82 }
    ]
  },
  '4-4-2': {
    attack: [
      { position: 'GK', x: 20, y: 50 },
      { position: 'RB', x: 56, y: 14 },
      { position: 'CB', x: 46, y: 36 },
      { position: 'CB', x: 46, y: 64 },
      { position: 'LB', x: 56, y: 86 },
      { position: 'RM', x: 68, y: 18 },
      { position: 'CM', x: 62, y: 38 },
      { position: 'CM', x: 62, y: 62 },
      { position: 'LM', x: 68, y: 82 },
      { position: 'ST', x: 82, y: 38 },
      { position: 'ST', x: 82, y: 62 }
    ],
    defense: [
      { position: 'GK', x: 5, y: 50 },
      { position: 'RB', x: 18, y: 16 },
      { position: 'CB', x: 15, y: 36 },
      { position: 'CB', x: 15, y: 64 },
      { position: 'LB', x: 18, y: 84 },
      { position: 'RM', x: 32, y: 18 },
      { position: 'CM', x: 28, y: 38 },
      { position: 'CM', x: 28, y: 62 },
      { position: 'LM', x: 32, y: 82 },
      { position: 'ST', x: 42, y: 38 },
      { position: 'ST', x: 42, y: 62 }
    ]
  },
  '4-2-3-1': {
    attack: [
      { position: 'GK', x: 20, y: 50 },
      { position: 'RB', x: 58, y: 14 },
      { position: 'CB', x: 46, y: 36 },
      { position: 'CB', x: 46, y: 64 },
      { position: 'LB', x: 58, y: 86 },
      { position: 'CDM', x: 56, y: 36 },
      { position: 'CDM', x: 56, y: 64 },
      { position: 'RAM', x: 74, y: 20 },
      { position: 'CAM', x: 72, y: 50 },
      { position: 'LAM', x: 74, y: 80 },
      { position: 'ST', x: 84, y: 50 }
    ],
    defense: [
      { position: 'GK', x: 5, y: 50 },
      { position: 'RB', x: 18, y: 16 },
      { position: 'CB', x: 15, y: 36 },
      { position: 'CB', x: 15, y: 64 },
      { position: 'LB', x: 18, y: 84 },
      { position: 'CDM', x: 26, y: 36 },
      { position: 'CDM', x: 26, y: 64 },
      { position: 'RAM', x: 34, y: 20 },
      { position: 'CAM', x: 32, y: 50 },
      { position: 'LAM', x: 34, y: 80 },
      { position: 'ST', x: 42, y: 50 }
    ]
  },
  '3-5-2': {
    attack: [
      { position: 'GK', x: 20, y: 50 },
      { position: 'CB', x: 46, y: 24 },
      { position: 'CB', x: 44, y: 50 },
      { position: 'CB', x: 46, y: 76 },
      { position: 'RWB', x: 62, y: 12 },
      { position: 'CDM', x: 56, y: 36 },
      { position: 'CDM', x: 56, y: 64 },
      { position: 'LWB', x: 62, y: 88 },
      { position: 'CAM', x: 70, y: 50 },
      { position: 'ST', x: 82, y: 38 },
      { position: 'ST', x: 82, y: 62 }
    ],
    defense: [
      { position: 'GK', x: 5, y: 50 },
      { position: 'CB', x: 16, y: 30 },
      { position: 'CB', x: 14, y: 50 },
      { position: 'CB', x: 16, y: 70 },
      { position: 'RWB', x: 18, y: 14 },
      { position: 'CDM', x: 26, y: 36 },
      { position: 'CDM', x: 26, y: 64 },
      { position: 'LWB', x: 18, y: 86 },
      { position: 'CAM', x: 32, y: 50 },
      { position: 'ST', x: 42, y: 38 },
      { position: 'ST', x: 42, y: 62 }
    ]
  },
  '5-4-1': {
    attack: [
      { position: 'GK', x: 20, y: 50 },
      { position: 'RWB', x: 56, y: 14 },
      { position: 'CB', x: 46, y: 32 },
      { position: 'CB', x: 44, y: 50 },
      { position: 'CB', x: 46, y: 68 },
      { position: 'LWB', x: 56, y: 86 },
      { position: 'RM', x: 68, y: 20 },
      { position: 'CM', x: 62, y: 38 },
      { position: 'CM', x: 62, y: 62 },
      { position: 'LM', x: 68, y: 80 },
      { position: 'ST', x: 80, y: 50 }
    ],
    defense: [
      { position: 'GK', x: 5, y: 50 },
      { position: 'RWB', x: 16, y: 14 },
      { position: 'CB', x: 14, y: 32 },
      { position: 'CB', x: 13, y: 50 },
      { position: 'CB', x: 14, y: 68 },
      { position: 'LWB', x: 16, y: 86 },
      { position: 'RM', x: 28, y: 20 },
      { position: 'CM', x: 26, y: 40 },
      { position: 'CM', x: 26, y: 60 },
      { position: 'LM', x: 28, y: 80 },
      { position: 'ST', x: 38, y: 50 }
    ]
  }
};
