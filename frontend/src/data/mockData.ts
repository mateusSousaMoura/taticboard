import type { Competition, Team, MatchFixture, FormationPositions } from '../types/tactics';

// Competitions Data
export const MOCK_COMPETITIONS: Competition[] = [
  {
    id: 'WC',
    code: 'WC',
    name: 'FIFA World Cup 2026',
    type: 'WORLD_CUP',
    emblem: 'https://crests.football-data.org/764.svg',
    season: 2026,
    country: 'Internacional',
    featured: true
  },
  {
    id: 'CL',
    code: 'CL',
    name: 'UEFA Champions League',
    type: 'CHAMPIONS_LEAGUE',
    emblem: 'https://crests.football-data.org/CL.svg',
    season: 2026,
    country: 'Europa'
  },
  {
    id: 'BSA',
    code: 'BSA',
    name: 'Brasileirão Série A',
    type: 'DOMESTIC_LEAGUE',
    emblem: 'https://crests.football-data.org/764.svg',
    season: 2026,
    country: 'Brasil'
  },
  {
    id: 'PL',
    code: 'PL',
    name: 'Premier League',
    type: 'DOMESTIC_LEAGUE',
    emblem: 'https://crests.football-data.org/PL.svg',
    season: 2026,
    country: 'Inglaterra'
  },
  {
    id: 'CA',
    code: 'CA',
    name: 'Copa América',
    type: 'INTERNATIONAL',
    emblem: 'https://crests.football-data.org/CA.svg',
    season: 2026,
    country: 'América do Sul'
  }
];

// Teams Pool
export const MOCK_TEAMS: Team[] = [
  {
    id: '764',
    name: 'Brasil',
    shortName: 'BRA',
    code: 'BRA',
    crest: 'https://crests.football-data.org/764.svg',
    primaryColor: '#FDE047',
    secondaryColor: '#16A34A',
    textColor: '#0F172A',
    formation: '4-3-3',
    starting: [
      { id: 'bra-1', name: 'Alisson', number: 1, position: 'GK', teamId: '764', x: 20, y: 50, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
      { id: 'bra-2', name: 'Danilo', number: 2, position: 'RB', teamId: '764', x: 58, y: 14, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
      { id: 'bra-4', name: 'Marquinhos', number: 4, position: 'CB', teamId: '764', x: 46, y: 36, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
      { id: 'bra-3', name: 'G. Magalhães', number: 3, position: 'CB', teamId: '764', x: 46, y: 64, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80' },
      { id: 'bra-6', name: 'Wendell', number: 6, position: 'LB', teamId: '764', x: 58, y: 86, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80' },
      { id: 'bra-5', name: 'Casemiro', number: 5, position: 'CDM', teamId: '764', x: 55, y: 50, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
      { id: 'bra-8', name: 'B. Guimarães', number: 8, position: 'CM', teamId: '764', x: 68, y: 30, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' },
      { id: 'bra-10', name: 'Lucas Paquetá', number: 10, position: 'CAM', teamId: '764', x: 68, y: 70, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
      { id: 'bra-11', name: 'Raphinha', number: 11, position: 'RW', teamId: '764', x: 78, y: 16, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
      { id: 'bra-9', name: 'Rodrygo', number: 9, position: 'ST', teamId: '764', x: 83, y: 50, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=150&auto=format&fit=crop&q=80' },
      { id: 'bra-7', name: 'Vinicius Jr.', number: 7, position: 'LW', teamId: '764', x: 78, y: 84, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80' }
    ],
    bench: [
      { id: 'bra-12', name: 'Bento', number: 12, position: 'GK', teamId: '764', x: 0, y: 0, isStarting: false },
      { id: 'bra-13', name: 'Yan Couto', number: 13, position: 'RB', teamId: '764', x: 0, y: 0, isStarting: false },
      { id: 'bra-14', name: 'Bremer', number: 14, position: 'CB', teamId: '764', x: 0, y: 0, isStarting: false },
      { id: 'bra-15', name: 'Beraldo', number: 15, position: 'CB', teamId: '764', x: 0, y: 0, isStarting: false },
      { id: 'bra-16', name: 'G. Arana', number: 16, position: 'LB', teamId: '764', x: 0, y: 0, isStarting: false },
      { id: 'bra-17', name: 'João Gomes', number: 17, position: 'CDM', teamId: '764', x: 0, y: 0, isStarting: false },
      { id: 'bra-18', name: 'Douglas Luiz', number: 18, position: 'CM', teamId: '764', x: 0, y: 0, isStarting: false },
      { id: 'bra-20', name: 'Endrick', number: 20, position: 'ST', teamId: '764', x: 0, y: 0, isStarting: false }
    ]
  },
  {
    id: '776',
    name: 'Japão',
    shortName: 'JPN',
    code: 'JPN',
    crest: 'https://crests.football-data.org/776.svg',
    primaryColor: '#2563EB',
    secondaryColor: '#FFFFFF',
    textColor: '#FFFFFF',
    formation: '3-4-2-1',
    starting: [
      { id: 'jpn-1', name: 'Zion Suzuki', number: 1, position: 'GK', teamId: '776', x: 95, y: 50, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
      { id: 'jpn-2', name: 'Sugawara', number: 2, position: 'RWB', teamId: '776', x: 82, y: 16, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80' },
      { id: 'jpn-4', name: 'Ko Itakura', number: 4, position: 'CB', teamId: '776', x: 85, y: 34, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' },
      { id: 'jpn-16', name: 'Tomiyasu', number: 16, position: 'CB', teamId: '776', x: 86, y: 50, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
      { id: 'jpn-3', name: 'Taniguchi', number: 3, position: 'CB', teamId: '776', x: 85, y: 66, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80' },
      { id: 'jpn-5', name: 'Nagatomo', number: 5, position: 'LWB', teamId: '776', x: 82, y: 84, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
      { id: 'jpn-6', name: 'Wataru Endo', number: 6, position: 'CDM', teamId: '776', x: 74, y: 32, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
      { id: 'jpn-13', name: 'H. Morita', number: 13, position: 'CM', teamId: '776', x: 74, y: 48, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
      { id: 'jpn-20', name: 'Take Kubo', number: 20, position: 'CAM', teamId: '776', x: 74, y: 64, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
      { id: 'jpn-7', name: 'K. Mitoma', number: 7, position: 'CAM', teamId: '776', x: 74, y: 80, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=150&auto=format&fit=crop&q=80' },
      { id: 'jpn-9', name: 'Ayase Ueda', number: 9, position: 'ST', teamId: '776', x: 62, y: 50, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80' }
    ],
    bench: [
      { id: 'jpn-12', name: 'K. Osako', number: 12, position: 'GK', teamId: '776', x: 0, y: 0, isStarting: false },
      { id: 'jpn-14', name: 'D. Hashioka', number: 14, position: 'RB', teamId: '776', x: 0, y: 0, isStarting: false },
      { id: 'jpn-8', name: 'Minamino', number: 8, position: 'CAM', teamId: '776', x: 0, y: 0, isStarting: false },
      { id: 'jpn-10', name: 'Ritsu Doan', number: 10, position: 'RW', teamId: '776', x: 0, y: 0, isStarting: false },
      { id: 'jpn-11', name: 'D. Maeda', number: 11, position: 'LW', teamId: '776', x: 0, y: 0, isStarting: false }
    ]
  },
  {
    id: '762',
    name: 'Argentina',
    shortName: 'ARG',
    code: 'ARG',
    crest: 'https://crests.football-data.org/762.svg',
    primaryColor: '#38BDF8',
    secondaryColor: '#FFFFFF',
    textColor: '#FFFFFF',
    formation: '4-3-3',
    starting: [
      { id: 'arg-1', name: 'E. Martínez', number: 23, position: 'GK', teamId: '762', x: 95, y: 50, isStarting: true, photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
      { id: 'arg-2', name: 'Molina', number: 26, position: 'RB', teamId: '762', x: 82, y: 16, isStarting: true },
      { id: 'arg-3', name: 'C. Romero', number: 13, position: 'CB', teamId: '762', x: 85, y: 36, isStarting: true },
      { id: 'arg-4', name: 'Otamendi', number: 19, position: 'CB', teamId: '762', x: 85, y: 64, isStarting: true },
      { id: 'arg-5', name: 'Tagliafico', number: 3, position: 'LB', teamId: '762', x: 82, y: 84, isStarting: true },
      { id: 'arg-6', name: 'De Paul', number: 7, position: 'CM', teamId: '762', x: 74, y: 30, isStarting: true },
      { id: 'arg-7', name: 'Enzo Fernández', number: 24, position: 'CDM', teamId: '762', x: 74, y: 50, isStarting: true },
      { id: 'arg-8', name: 'Mac Allister', number: 20, position: 'CM', teamId: '762', x: 74, y: 70, isStarting: true },
      { id: 'arg-9', name: 'L. Messi', number: 10, position: 'RW', teamId: '762', x: 62, y: 20, isStarting: true },
      { id: 'arg-10', name: 'Julian Álvarez', number: 9, position: 'ST', teamId: '762', x: 60, y: 50, isStarting: true },
      { id: 'arg-11', name: 'N. González', number: 15, position: 'LW', teamId: '762', x: 62, y: 80, isStarting: true }
    ],
    bench: [
      { id: 'arg-12', name: 'Armani', number: 1, position: 'GK', teamId: '762', x: 0, y: 0, isStarting: false },
      { id: 'arg-13', name: 'Pezzella', number: 6, position: 'CB', teamId: '762', x: 0, y: 0, isStarting: false },
      { id: 'arg-14', name: 'Lautaro', number: 22, position: 'ST', teamId: '762', x: 0, y: 0, isStarting: false }
    ]
  },
  {
    id: '773',
    name: 'França',
    shortName: 'FRA',
    code: 'FRA',
    crest: 'https://crests.football-data.org/773.svg',
    primaryColor: '#1E3A8A',
    secondaryColor: '#EF4444',
    textColor: '#FFFFFF',
    formation: '4-2-3-1',
    starting: [
      { id: 'fra-1', name: 'Maignan', number: 16, position: 'GK', teamId: '773', x: 95, y: 50, isStarting: true },
      { id: 'fra-2', name: 'Koundé', number: 5, position: 'RB', teamId: '773', x: 82, y: 16, isStarting: true },
      { id: 'fra-3', name: 'Upamecano', number: 4, position: 'CB', teamId: '773', x: 85, y: 36, isStarting: true },
      { id: 'fra-4', name: 'Saliba', number: 17, position: 'CB', teamId: '773', x: 85, y: 64, isStarting: true },
      { id: 'fra-5', name: 'T. Hernández', number: 22, position: 'LB', teamId: '773', x: 82, y: 84, isStarting: true },
      { id: 'fra-6', name: 'Tchouaméni', number: 8, position: 'CDM', teamId: '773', x: 74, y: 36, isStarting: true },
      { id: 'fra-7', name: 'Rabiot', number: 14, position: 'CDM', teamId: '773', x: 74, y: 64, isStarting: true },
      { id: 'fra-8', name: 'Dembélé', number: 11, position: 'RAM', teamId: '773', x: 62, y: 18, isStarting: true },
      { id: 'fra-9', name: 'Griezmann', number: 7, position: 'CAM', teamId: '773', x: 64, y: 50, isStarting: true },
      { id: 'fra-10', name: 'Mbappé', number: 10, position: 'LAM', teamId: '773', x: 62, y: 82, isStarting: true },
      { id: 'fra-11', name: 'Giroud', number: 9, position: 'ST', teamId: '773', x: 58, y: 50, isStarting: true }
    ],
    bench: [
      { id: 'fra-12', name: 'Samba', number: 1, position: 'GK', teamId: '773', x: 0, y: 0, isStarting: false },
      { id: 'fra-13', name: 'Camavinga', number: 25, position: 'CM', teamId: '773', x: 0, y: 0, isStarting: false },
      { id: 'fra-14', name: 'Kolo Muani', number: 12, position: 'ST', teamId: '773', x: 0, y: 0, isStarting: false }
    ]
  },
  {
    id: '760',
    name: 'Espanha',
    shortName: 'ESP',
    code: 'ESP',
    crest: 'https://crests.football-data.org/760.svg',
    primaryColor: '#DC2626',
    secondaryColor: '#FACC15',
    textColor: '#FFFFFF',
    formation: '4-3-3',
    starting: [
      { id: 'esp-1', name: 'Unai Simón', number: 23, position: 'GK', teamId: '760', x: 95, y: 50, isStarting: true },
      { id: 'esp-2', name: 'Carvajal', number: 2, position: 'RB', teamId: '760', x: 82, y: 16, isStarting: true },
      { id: 'esp-3', name: 'Le Normand', number: 3, position: 'CB', teamId: '760', x: 85, y: 36, isStarting: true },
      { id: 'esp-4', name: 'Laporte', number: 14, position: 'CB', teamId: '760', x: 85, y: 64, isStarting: true },
      { id: 'esp-5', name: 'Cucurella', number: 24, position: 'LB', teamId: '760', x: 82, y: 84, isStarting: true },
      { id: 'esp-6', name: 'Rodri', number: 16, position: 'CDM', teamId: '760', x: 74, y: 50, isStarting: true },
      { id: 'esp-7', name: 'Pedri', number: 20, position: 'CM', teamId: '760', x: 74, y: 30, isStarting: true },
      { id: 'esp-8', name: 'Fabián Ruiz', number: 8, position: 'CM', teamId: '760', x: 74, y: 70, isStarting: true },
      { id: 'esp-9', name: 'Lamine Yamal', number: 19, position: 'RW', teamId: '760', x: 62, y: 18, isStarting: true },
      { id: 'esp-10', name: 'Morata', number: 7, position: 'ST', teamId: '760', x: 58, y: 50, isStarting: true },
      { id: 'esp-11', name: 'Nico Williams', number: 17, position: 'LW', teamId: '760', x: 62, y: 82, isStarting: true }
    ],
    bench: [
      { id: 'esp-12', name: 'Raya', number: 1, position: 'GK', teamId: '760', x: 0, y: 0, isStarting: false },
      { id: 'esp-13', name: 'Dani Olmo', number: 10, position: 'CAM', teamId: '760', x: 0, y: 0, isStarting: false },
      { id: 'esp-14', name: 'Oyarzabal', number: 21, position: 'LW', teamId: '760', x: 0, y: 0, isStarting: false }
    ]
  }
];

// Alias Exports for Backwards Compatibility
export const initialBrazilTeam = MOCK_TEAMS[0];
export const initialJapanTeam = MOCK_TEAMS[1];

// Preset Fixtures
export const MOCK_FIXTURES: MatchFixture[] = [
  {
    id: 'm-wc-1',
    competitionCode: 'WC',
    utcDate: '2026-06-11T16:00:00Z',
    stage: 'FASE DE GRUPOS - GRUPO A',
    status: 'SCHEDULED',
    homeTeam: MOCK_TEAMS[0], // Brasil
    awayTeam: MOCK_TEAMS[1]  // Japão
  },
  {
    id: 'm-wc-2',
    competitionCode: 'WC',
    utcDate: '2026-06-14T20:00:00Z',
    stage: 'FASE DE GRUPOS - GRUPO A',
    status: 'SCHEDULED',
    homeTeam: MOCK_TEAMS[0], // Brasil
    awayTeam: MOCK_TEAMS[2]  // Argentina
  },
  {
    id: 'm-wc-3',
    competitionCode: 'WC',
    utcDate: '2026-06-18T18:00:00Z',
    stage: 'FASE DE GRUPOS - GRUPO B',
    status: 'SCHEDULED',
    homeTeam: MOCK_TEAMS[3], // França
    awayTeam: MOCK_TEAMS[4]  // Espanha
  },
  {
    id: 'm-wc-4',
    competitionCode: 'WC',
    utcDate: '2026-06-22T21:00:00Z',
    stage: 'FASE DE GRUPOS - GRUPO C',
    status: 'SCHEDULED',
    homeTeam: MOCK_TEAMS[1], // Japão
    awayTeam: MOCK_TEAMS[4]  // Espanha
  }
];

// Tactical Layouts (Attacking vs Defending)
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
