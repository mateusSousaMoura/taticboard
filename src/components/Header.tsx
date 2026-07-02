import React from 'react';
import type { Team, PhaseState } from '../types/tactics';
import { RotateCcw, Zap } from 'lucide-react';

interface HeaderProps {
  teamA: Team;
  teamB: Team;
  phaseState: PhaseState;
  onSelectPhase: (phase: PhaseState) => void;
  onClearDrawings: () => void;
  onResetPositions: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  teamA,
  teamB,
  phaseState,
  onSelectPhase,
  onClearDrawings,
  onResetPositions
}) => {
  return (
    <header className="glass-panel w-full px-4 py-2.5 mb-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <h1 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
          <span>TATIC</span>
          <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">
            {teamA.name} vs {teamB.name}
          </span>
        </h1>
      </div>

      {/* Requirement 8: Select who is attacking */}
      <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-white/10 text-xs">
        <span className="text-slate-400 font-medium px-2 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          Posse de Bola / Ataque:
        </span>

        <button
          onClick={() => onSelectPhase('teamA_attack')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            phaseState === 'teamA_attack'
              ? 'bg-yellow-400 text-slate-950 shadow-md scale-105'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          {teamA.name} Atacando
        </button>

        <button
          onClick={() => onSelectPhase('teamB_attack')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            phaseState === 'teamB_attack'
              ? 'bg-blue-600 text-white shadow-md scale-105'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          {teamB.name} Atacando
        </button>
      </div>

      {/* Minimalist actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onClearDrawings}
          className="btn-secondary text-xs"
          title="Limpar desenhos"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Limpar Desenhos</span>
        </button>

        <button
          onClick={onResetPositions}
          className="btn-secondary text-xs"
          title="Resetar posições"
        >
          <span>Resetar Posições</span>
        </button>
      </div>
    </header>
  );
};
