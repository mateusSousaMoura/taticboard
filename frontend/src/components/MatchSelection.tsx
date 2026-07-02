import React, { useState } from 'react';
import type { Competition, MatchFixture, Team } from '../types/tactics';
import { MOCK_COMPETITIONS, MOCK_FIXTURES, MOCK_TEAMS } from '../data/mockData';
import { Trophy, Calendar, Sparkles, ArrowRight, Swords, Shield } from 'lucide-react';

interface MatchSelectionProps {
  onSelectMatch: (homeTeam: Team, awayTeam: Team, stage?: string) => void;
}

export const MatchSelection: React.FC<MatchSelectionProps> = ({ onSelectMatch }) => {
  const [selectedCompCode, setSelectedCompCode] = useState<string>('WC');
  const [customHomeTeamId, setCustomHomeTeamId] = useState<string>(MOCK_TEAMS[0].id); // Brasil
  const [customAwayTeamId, setCustomAwayTeamId] = useState<string>(MOCK_TEAMS[1].id); // Japão

  const activeCompetition = MOCK_COMPETITIONS.find((c) => c.code === selectedCompCode) || MOCK_COMPETITIONS[0];
  const filteredFixtures = MOCK_FIXTURES.filter((f) => f.competitionCode === selectedCompCode);

  const handleStartCustomMatch = () => {
    const home = MOCK_TEAMS.find((t) => t.id === customHomeTeamId) || MOCK_TEAMS[0];
    const away = MOCK_TEAMS.find((t) => t.id === customAwayTeamId) || MOCK_TEAMS[1];
    onSelectMatch(home, away, 'CONFRONTO PERSONALIZADO');
  };

  return (
    <div className="min-h-screen w-full bg-[#0b1120] text-slate-100 p-4 md:p-8 overflow-y-auto">
      {/* Header Banner */}
      <div className="max-w-6xl mx-auto mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold mb-3">
          <Sparkles className="w-4 h-4" />
          PRANCHA TÁTICA PROFISSIONAL
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
          TATIC <span className="text-blue-500">PRO</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
          Selecione uma competição, escolha uma partida oficial ou monte um confronto personalizado entre qualquer seleção para montar suas táticas de jogo.
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Competitions Selector Bar */}
        <div className="glass-panel p-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Competições em Destaque
            </h2>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {MOCK_COMPETITIONS.map((comp) => (
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

        {/* Available Fixtures Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Partidas Cadastradas ({activeCompetition.name})
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Base de Dados Sincronizada
            </span>
          </div>

          {filteredFixtures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFixtures.map((fixture) => (
                <div
                  key={fixture.id}
                  className="glass-panel p-5 hover:border-blue-500/50 transition-all duration-200 group flex flex-col justify-between"
                >
                  <div>
                    {/* Fixture Stage Badge */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-4 pb-2 border-b border-white/10">
                      <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        {fixture.stage}
                      </span>
                      <span>{new Date(fixture.utcDate).toLocaleDateString('pt-BR')}</span>
                    </div>

                    {/* Matchup Banner */}
                    <div className="flex items-center justify-between my-2">
                      {/* Home Team */}
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-full bg-yellow-400 text-slate-950 font-black flex items-center justify-center text-sm border-2 border-slate-900 shadow">
                          {fixture.homeTeam.shortName}
                        </span>
                        <div>
                          <h4 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">
                            {fixture.homeTeam.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">Mandante</span>
                        </div>
                      </div>

                      <span className="text-xl font-black text-slate-500 italic mx-2">VS</span>

                      {/* Away Team */}
                      <div className="flex items-center gap-3 text-right flex-row-reverse">
                        <span className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-sm border-2 border-white shadow">
                          {fixture.awayTeam.shortName}
                        </span>
                        <div>
                          <h4 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">
                            {fixture.awayTeam.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">Visitante</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => onSelectMatch(fixture.homeTeam, fixture.awayTeam, fixture.stage)}
                    className="mt-5 w-full btn btn-primary font-bold py-2 flex items-center justify-center gap-2 group-hover:bg-blue-600 transition"
                  >
                    <span>Abrir Prancha Tática</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel p-8 text-center text-slate-400">
              Nenhuma partida agendada para esta competição no momento. Utilize o confronto personalizado abaixo!
            </div>
          )}
        </div>

        {/* Custom Matchup Setup (Qualquer Seleção vs Qualquer Seleção) */}
        <div className="glass-panel p-6 border-2 border-blue-500/30">
          <div className="flex items-center gap-2 mb-4">
            <Swords className="w-5 h-5 text-yellow-400" />
            <div>
              <h3 className="text-base font-bold text-white">Confronto Personalizado</h3>
              <p className="text-xs text-slate-400">
                Monte uma partida entre qualquer seleção ou clube independente da competição.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Home Team Picker */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10">
              <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-yellow-400" />
                Time A (Casa / Ataca da Esquerda)
              </label>
              <select
                value={customHomeTeamId}
                onChange={(e) => setCustomHomeTeamId(e.target.value)}
                className="w-full bg-slate-950 text-white p-2.5 rounded-lg border border-white/20 text-sm font-semibold outline-none cursor-pointer"
              >
                {MOCK_TEAMS.map((t) => (
                  <option key={`home-${t.id}`} value={t.id}>
                    {t.name} ({t.shortName}) - {t.formation}
                  </option>
                ))}
              </select>
            </div>

            {/* Away Team Picker */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10">
              <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-400" />
                Time B (Visitante / Ataca da Direita)
              </label>
              <select
                value={customAwayTeamId}
                onChange={(e) => setCustomAwayTeamId(e.target.value)}
                className="w-full bg-slate-950 text-white p-2.5 rounded-lg border border-white/20 text-sm font-semibold outline-none cursor-pointer"
              >
                {MOCK_TEAMS.map((t) => (
                  <option key={`away-${t.id}`} value={t.id}>
                    {t.name} ({t.shortName}) - {t.formation}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleStartCustomMatch}
            className="w-full btn btn-warning text-slate-950 font-extrabold py-2.5 flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition"
          >
            <span>Iniciar Prancha Tática Personalizada</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
