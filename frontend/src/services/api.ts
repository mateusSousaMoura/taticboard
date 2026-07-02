import type { Competition, MatchFixture, Team } from '../types/tactics';
import { MOCK_COMPETITIONS, MOCK_FIXTURES, MOCK_TEAMS } from '../data/mockData';

const API_BASE_URL = 'http://localhost:8000/api';

export async function fetchCompetitions(): Promise<Competition[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/competitions`, { signal: AbortSignal.timeout(2500) });
    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) return data;
    return MOCK_COMPETITIONS;
  } catch (error) {
    console.warn('[Frontend API] Backend unreachable. Using cached competitions fallback.', error);
    return MOCK_COMPETITIONS;
  }
}

export async function fetchMatchesByCompetition(code: string): Promise<MatchFixture[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/competitions/${code}/matches?limit=100`, { signal: AbortSignal.timeout(2500) });
    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) return data;
    return MOCK_FIXTURES.filter((f) => f.competitionCode === code);
  } catch (error) {
    console.warn('[Frontend API] Backend unreachable. Using cached matches fallback.', error);
    return MOCK_FIXTURES.filter((f) => f.competitionCode === code);
  }
}

export async function fetchTeams(): Promise<Team[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/teams?limit=100`, { signal: AbortSignal.timeout(2500) });
    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) return data;
    return MOCK_TEAMS;
  } catch (error) {
    console.warn('[Frontend API] Backend unreachable. Using cached teams fallback.', error);
    return MOCK_TEAMS;
  }
}

export async function triggerSyncWorldCup(): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/sync/world-cup`, { method: 'POST', signal: AbortSignal.timeout(3000) });
    return await response.json();
  } catch (error) {
    return { message: 'Servidor backend offline. Ative o container Docker ou uvicorn.' };
  }
}
