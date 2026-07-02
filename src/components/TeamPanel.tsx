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
        {/* Team Selector Tabs with Bootstrap Modern Pill Buttons */}
        <div className="btn-group w-100 mb-3" role="group">
          <button
            onClick={() => setActiveTab('teamA')}
            className={`btn btn-sm text-xs font-bold transition-all ${
              activeTab === 'teamA'
                ? 'btn-warning text-dark shadow'
                : 'btn-outline-secondary text-white'
            }`}
          >
            ● {teamA.name}
          </button>

          <button
            onClick={() => setActiveTab('teamB')}
            className={`btn btn-sm text-xs font-bold transition-all ${
              activeTab === 'teamB'
                ? 'btn-primary text-white shadow'
                : 'btn-outline-secondary text-white'
            }`}
          >
            ● {teamB.name}
          </button>
        </div>

        {/* Phase Badge */}
        <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-white/10 flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-400">Postura:</span>
          <span className={`font-bold uppercase font-mono text-[11px] ${isTeamAttacking ? 'text-warning' : 'text-info'}`}>
            {isTeamAttacking ? '⚡ ATACANDO' : '🛡️ DEFENDENDO'}
          </span>
        </div>

        {/* Formation Picker - 2 ITEMS PER ROW */}
        <div className="mb-4 bg-slate-900/60 p-2.5 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-info" />
              Esquema Tático ({currentTeam.formation})
            </span>
          </div>

          {/* 2 items per row requirement */}
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(FORMATION_LAYOUTS).map((fmt) => (
              <button
                key={fmt}
                onClick={() => handleFormationChange(fmt)}
                className={`btn btn-sm font-mono font-bold transition-all text-xs ${
                  currentTeam.formation === fmt
                    ? 'btn-primary text-white shadow-sm'
                    : 'btn-outline-light text-slate-200 border-white/20 hover:bg-white/10'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Bench Players List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-warning" />
              Banco de Reservas ({currentTeam.bench.length})
            </h3>
          </div>

          <div className="space-y-1.5 max-h-[calc(100vh-340px)] overflow-y-auto pr-1">
            {currentTeam.bench.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-2 rounded-lg text-xs bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-white/5 transition"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="badge bg-secondary text-white font-mono text-[10px]">
                    {player.number}
                  </span>
                  <span className="badge bg-info/20 text-info font-mono text-[10px]">
                    {player.position}
                  </span>
                  <span className="truncate font-medium">{player.name}</span>
                </div>

                <button
                  onClick={() => onOpenSubModal(player)}
                  className="btn btn-xs btn-outline-warning py-0.5 px-2 text-[10px] font-bold"
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
