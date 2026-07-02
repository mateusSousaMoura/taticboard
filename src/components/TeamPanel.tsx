import React, { useState } from 'react';
import type { Team, Player, PhaseState } from '../types/tactics';
import { FORMATION_LAYOUTS } from '../data/mockData';
import { 
  Settings2, 
  Shield
} from 'lucide-react';

interface TeamPanelProps {
  teamA: Team;
  teamB: Team;
  phaseState: PhaseState;
  onOpenSubModal: (player: Player) => void;
  onApplyFormation: (teamId: 'teamA' | 'teamB', formationName: string) => void;
}

export const TeamPanel: React.FC<TeamPanelProps> = ({
  teamA,
  teamB,
  phaseState,
  onOpenSubModal,
  onApplyFormation
}) => {
  const [activeTab, setActiveTab] = useState<'teamA' | 'teamB'>('teamA');
  const currentTeam = activeTab === 'teamA' ? teamA : teamB;

  const isTeamAttacking = 
    (activeTab === 'teamA' && phaseState === 'teamA_attack') ||
    (activeTab === 'teamB' && phaseState === 'teamB_attack');

  const handleFormationChange = (formation: string) => {
    onApplyFormation(activeTab, formation);
  };

  return (
    <div className="glass-panel p-3 h-full flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Team Selector Tabs */}
        <div className="flex items-center gap-2 mb-3 p-1 bg-slate-900/80 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('teamA')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'teamA'
                ? 'bg-yellow-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-slate-900"></span>
            <span>{teamA.name}</span>
          </button>

          <button
            onClick={() => setActiveTab('teamB')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'teamB'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white"></span>
            <span>{teamB.name}</span>
          </button>
        </div>

        {/* Phase Badge */}
        <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-white/10 flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-400">Postura:</span>
          <span className={`font-bold uppercase font-mono text-[11px] ${isTeamAttacking ? 'text-yellow-400' : 'text-blue-400'}`}>
            {isTeamAttacking ? '⚡ ATACANDO' : '🛡️ DEFENDENDO'}
          </span>
        </div>

        {/* Formation Picker */}
        <div className="mb-4 bg-slate-900/60 p-2.5 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-blue-400" />
              Esquema Tático ({currentTeam.formation})
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {Object.keys(FORMATION_LAYOUTS).map((fmt) => (
              <button
                key={fmt}
                onClick={() => handleFormationChange(fmt)}
                className={`py-1.5 px-2 rounded text-xs font-mono font-bold transition ${
                  currentTeam.formation === fmt
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Bench Players List ONLY (Titulares Removed) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-yellow-400" />
              Banco de Reservas ({currentTeam.bench.length})
            </h3>
          </div>

          <div className="space-y-1.5 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
            {currentTeam.bench.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-2 rounded-lg text-xs bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-white/5 transition"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-200 shrink-0">
                    {player.number}
                  </span>
                  <span className="font-mono text-[10px] px-1 bg-white/10 rounded font-bold text-blue-300 shrink-0">
                    {player.position}
                  </span>
                  <span className="truncate font-medium">{player.name}</span>
                </div>

                <button
                  onClick={() => onOpenSubModal(player)}
                  className="px-2.5 py-1 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold hover:bg-amber-400 hover:text-slate-950 transition shrink-0"
                >
                  Sub Entrar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
