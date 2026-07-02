import React, { useState, useEffect } from 'react';
import type { Competition, MatchFixture, Team } from '../types/tactics';
import { fetchCompetitions, fetchMatchesByCompetition, fetchTeams, triggerSyncWorldCup } from '../services/api';
import { Trophy, Calendar, Sparkles, ArrowRight, Swords, Shield, RefreshCw, Search, X } from 'lucide-react';

interface MatchSelectionProps {
  onSelectMatch: (homeTeam: Team, awayTeam: Team, stage?: string) => void;
}

export const MatchSelection: React.FC<MatchSelectionProps> = ({ onSelectMatch }) => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedCompCode, setSelectedCompCode] = useState<string>('WC');
  const [fixtures, setFixtures] = useState<MatchFixture[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  
  // Search Term
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Custom Matchup Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [customHomeTeamId, setCustomHomeTeamId] = useState<string>('');
  const [customAwayTeamId, setCustomAwayTeamId] = useState<string>('');
  
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      const compData = await fetchCompetitions();
      setCompetitions(compData);
      
      const teamData = await fetchTeams();
      setTeams(teamData);
      if (teamData && teamData.length >= 2) {
        setCustomHomeTeamId(teamData[0].id);
        setCustomAwayTeamId(teamData[1].id);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    async function loadMatches() {
      const matchData = await fetchMatchesByCompetition(selectedCompCode);
      setFixtures(matchData);
    }
    loadMatches();
  }, [selectedCompCode]);

  const activeCompetition = competitions.find((c) => c.code === selectedCompCode);

  // Filter Fixtures by Search Term (Team Name, Code, or Stage)
  const filteredFixtures = fixtures.filter((f) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const homeName = f.homeTeam?.name?.toLowerCase() || '';
    const awayName = f.awayTeam?.name?.toLowerCase() || '';
    const stageName = f.stage?.toLowerCase() || '';
    return homeName.includes(term) || awayName.includes(term) || stageName.includes(term);
  });

  const handleStartCustomMatch = () => {
    if (teams.length < 2) return;
    const home = teams.find((t) => t.id === customHomeTeamId) || teams[0];
    const away = teams.find((t) => t.id === customAwayTeamId) || teams[1];
    setIsModalOpen(false);
    onSelectMatch(home, away, 'CONFRONTO PERSONALIZADO');
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    const res = await triggerSyncWorldCup();
    setSyncMessage(res.message);
    
    setTimeout(async () => {
      const matchData = await fetchMatchesByCompetition(selectedCompCode);
      setFixtures(matchData);
      const teamData = await fetchTeams();
      setTeams(teamData);
      setIsSyncing(false);
      setSyncMessage(null);
    }, 3000);
  };

  return (
    <div className="w-screen h-screen bg-[#0b1120] text-slate-100 p-3 md:p-6 overflow-y-auto custom-scrollbar flex flex-col justify-between">
      {/* Top Action Bar & Header */}
      <div className="max-w-7xl mx-auto w-full mb-4 shrink-0">
        <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            PRANCHA TÁTICA PROFISSIONAL • REST API & POSTGRESQL
          </div>

          {/* Top Corner Custom Matchup Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-sm btn-warning text-slate-950 font-extrabold flex items-center gap-1.5 text-xs shadow hover:brightness-110 transition"
            >
              <Swords className="w-4 h-4" />
              <span>Confronto Personalizado</span>
            </button>

            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="btn btn-sm btn-outline-info text-info flex items-center gap-1.5 text-xs font-bold hover:bg-info/10"
              title="Disparar job de sincronização no backend"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sincronizar Copa</span>
            </button>
          </div>
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white mb-1">
            TATIC <span className="text-blue-500">PRO</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm">
            Selecione uma competição ou pesquisa uma partida para abrir a prancha tática de jogo.
          </p>
        </div>

        {/* Sync Status Alert */}
        {syncMessage && (
          <div className="mt-2 inline-block px-4 py-1 rounded-lg bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 text-xs font-bold animate-pulse">
            {syncMessage}
          </div>
        )}
      </div>

      {/* Main Content Dashboard */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col space-y-4 overflow-hidden">
        {/* Competitions Horizontal Selector */}
        <div className="glass-panel p-3 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Competições Sincronizadas
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {competitions.length} Competições no Banco
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {competitions.map((comp) => (
              <button
                key={comp.code}
                onClick={() => setSelectedCompCode(comp.code)}
                className={`btn btn-sm text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  selectedCompCode === comp.code
                    ? 'btn-primary shadow-lg scale-105'
                    : 'btn-outline-secondary text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                <span>{comp.name}</span>
                {comp.featured && (
                  <span className="badge bg-yellow-400 text-slate-950 font-black text-[9px] uppercase">
                    Copa 2026
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar & Matches Grid */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Search Input Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3 shrink-0">
            <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2 shrink-0">
              <Calendar className="w-4 h-4 text-blue-400" />
              Partidas ({activeCompetition?.name || 'Copa do Mundo'}) ({filteredFixtures.length})
            </h3>

            {/* Search Input Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar seleção, país ou fase..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/90 border border-white/20 rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Matches Grid */}
          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {filteredFixtures.length > 0 ? (
              <div className="responsive-dashboard-grid pb-2">
                {filteredFixtures.map((fixture) => (
                  <div
                    key={fixture.id}
                    className="glass-panel p-4 hover:border-blue-500/50 transition-all duration-200 group flex flex-col justify-between"
                  >
                    <div>
                      {/* Fixture Stage Badge */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-3 pb-2 border-b border-white/10">
                        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 truncate max-w-[180px]">
                          {fixture.stage}
                        </span>
                        <span>{new Date(fixture.utcDate).toLocaleDateString('pt-BR')}</span>
                      </div>

                      {/* Matchup Banner */}
                      <div className="flex items-center justify-between my-2">
                        {/* Home Team */}
                        <div className="flex items-center gap-2.5 truncate">
                          <span 
                            className="w-9 h-9 rounded-full font-black flex items-center justify-center text-xs border-2 border-slate-900 shadow shrink-0"
                            style={{ backgroundColor: fixture.homeTeam?.primaryColor || '#FDE047', color: fixture.homeTeam?.textColor || '#000' }}
                          >
                            {fixture.homeTeam?.shortName || 'HOME'}
                          </span>
                          <div className="truncate">
                            <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors truncate">
                              {fixture.homeTeam?.name}
                            </h4>
                            <span className="text-[9px] text-slate-400 font-mono block">Mandante</span>
                          </div>
                        </div>

                        <span className="text-base font-black text-slate-500 italic mx-2 shrink-0">VS</span>

                        {/* Away Team */}
                        <div className="flex items-center gap-2.5 text-right flex-row-reverse truncate">
                          <span 
                            className="w-9 h-9 rounded-full font-black flex items-center justify-center text-xs border-2 border-white shadow shrink-0"
                            style={{ backgroundColor: fixture.awayTeam?.primaryColor || '#2563EB', color: fixture.awayTeam?.textColor || '#FFF' }}
                          >
                            {fixture.awayTeam?.shortName || 'AWAY'}
                          </span>
                          <div className="truncate">
                            <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors truncate">
                              {fixture.awayTeam?.name}
                            </h4>
                            <span className="text-[9px] text-slate-400 font-mono block">Visitante</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => onSelectMatch(fixture.homeTeam, fixture.awayTeam, fixture.stage)}
                      className="mt-4 w-full btn btn-primary btn-sm font-bold py-1.5 flex items-center justify-center gap-2 group-hover:bg-blue-600 transition"
                    >
                      <span>Abrir Prancha Tática</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-8 text-center text-slate-400">
                {searchTerm
                  ? `Nenhuma partida encontrada para "${searchTerm}". Tente pesquisar outro termo.`
                  : 'Nenhuma partida agendada no banco para esta competição.'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dedicated Custom Matchup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-lg p-5 border border-white/20 shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-yellow-400" />
                <div>
                  <h3 className="font-bold text-base text-white">Confronto Personalizado</h3>
                  <p className="text-xs text-slate-400">
                    Monte um duelo tático livre entre qualquer seleção cadastrada no banco.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {teams.length >= 2 ? (
              <div className="space-y-4">
                {/* Home Team Picker */}
                <div className="bg-slate-900/80 p-3 rounded-xl border border-white/10">
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    Time A (Mandante / Ataca da Esquerda)
                  </label>
                  <select
                    value={customHomeTeamId}
                    onChange={(e) => setCustomHomeTeamId(e.target.value)}
                    className="w-full bg-slate-950 text-white p-2.5 rounded-lg border border-white/20 text-xs font-semibold outline-none cursor-pointer"
                  >
                    {teams.map((t) => (
                      <option key={`modal-home-${t.id}`} value={t.id}>
                        {t.name} ({t.shortName}) - {t.formation}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Away Team Picker */}
                <div className="bg-slate-900/80 p-3 rounded-xl border border-white/10">
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-blue-400" />
                    Time B (Visitante / Ataca da Direita)
                  </label>
                  <select
                    value={customAwayTeamId}
                    onChange={(e) => setCustomAwayTeamId(e.target.value)}
                    className="w-full bg-slate-950 text-white p-2.5 rounded-lg border border-white/20 text-xs font-semibold outline-none cursor-pointer"
                  >
                    {teams.map((t) => (
                      <option key={`modal-away-${t.id}`} value={t.id}>
                        {t.name} ({t.shortName}) - {t.formation}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleStartCustomMatch}
                  className="w-full btn btn-warning text-slate-950 font-extrabold py-2 text-xs flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition"
                >
                  <span>Iniciar Prancha Tática Personalizada</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-4 text-center text-slate-400 text-xs">
                Carregando seleções do banco de dados PostgreSQL...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
