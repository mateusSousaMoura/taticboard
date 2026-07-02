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
    <header className="glass-panel w-full px-3 py-2 mb-2 flex flex-wrap items-center justify-between gap-3 shadow-sm">
      {/* Brand Title */}
      <div className="flex items-center gap-2">
        <h1 className="font-extrabold text-base text-white tracking-tight flex items-center gap-2 mb-0">
          <span>TATIC</span>
          <span className="badge bg-primary text-white font-mono text-[11px]">
            {teamA.name} vs {teamB.name}
          </span>
        </h1>
      </div>

      {/* Select who is attacking with Bootstrap Button Group */}
      <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-white/10 text-xs">
        <span className="text-slate-400 font-medium px-2 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-warning" />
          Posse de Bola:
        </span>

        <div className="btn-group" role="group">
          <button
            onClick={() => onSelectPhase('teamA_attack')}
            className={`btn btn-sm text-xs font-bold transition-all ${
              phaseState === 'teamA_attack'
                ? 'btn-warning text-dark shadow-sm'
                : 'btn-outline-secondary text-slate-300'
            }`}
          >
            {teamA.name} Atacando
          </button>

          <button
            onClick={() => onSelectPhase('teamB_attack')}
            className={`btn btn-sm text-xs font-bold transition-all ${
              phaseState === 'teamB_attack'
                ? 'btn-primary text-white shadow-sm'
                : 'btn-outline-secondary text-slate-300'
            }`}
          >
            {teamB.name} Atacando
          </button>
        </div>
      </div>

      {/* Minimalist actions with Bootstrap modern buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onClearDrawings}
          className="btn btn-sm btn-outline-warning text-warning flex items-center gap-1 text-xs"
          title="Limpar desenhos"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Limpar Desenhos</span>
        </button>

        <button
          onClick={onResetPositions}
          className="btn btn-sm btn-outline-light text-slate-200 text-xs"
          title="Resetar posições"
        >
          <span>Resetar Posições</span>
        </button>
      </div>
    </header>
  );
};
