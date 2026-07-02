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
  onApplyFormation: (teamId: string, formationName: string) => void;
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
    onApplyFormation(currentTeam.id, formation);
  };

  return (
    <div className="glass-panel p-3 h-full flex flex-col justify-between overflow-y-auto custom-scrollbar">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Team Selector Tabs with Bootstrap Modern Pill Buttons */}
        <div className="btn-group w-100 mb-2 shrink-0" role="group">
          <button
            onClick={() => setActiveTab('teamA')}
            className={`btn btn-sm text-[11px] font-bold transition-all truncate ${
              activeTab === 'teamA'
                ? 'btn-warning text-dark shadow'
                : 'btn-outline-secondary text-white'
            }`}
          >
            ● {teamA.name}
          </button>

          <button
            onClick={() => setActiveTab('teamB')}
            className={`btn btn-sm text-[11px] font-bold transition-all truncate ${
              activeTab === 'teamB'
                ? 'btn-primary text-white shadow'
                : 'btn-outline-secondary text-white'
            }`}
          >
            ● {teamB.name}
          </button>
        </div>

        {/* Phase Badge */}
        <div className="mb-2 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/10 flex items-center justify-between text-xs font-semibold shrink-0">
          <span className="text-slate-400 text-[11px]">Postura:</span>
          <span className={`font-bold uppercase font-mono text-[10px] ${isTeamAttacking ? 'text-warning' : 'text-info'}`}>
            {isTeamAttacking ? '⚡ ATACANDO' : '🛡️ DEFENDENDO'}
          </span>
        </div>

        {/* Formation Picker - 2 ITEMS PER ROW */}
        <div className="mb-3 bg-slate-900/60 p-2 rounded-xl border border-white/10 shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <Settings2 className="w-3.5 h-3.5 text-info" />
              Esquema ({currentTeam.formation})
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {Object.keys(FORMATION_LAYOUTS).map((fmt) => (
              <button
                key={fmt}
                onClick={() => handleFormationChange(fmt)}
                className={`btn btn-xs font-mono font-bold transition-all py-1 text-[11px] ${
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

        {/* Bench Players List (Scrollable Container) */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between mb-1.5 shrink-0">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-warning" />
              Banco ({currentTeam.bench.length})
            </h3>
          </div>

          <div className="space-y-1 overflow-y-auto pr-1 custom-scrollbar flex-1">
            {currentTeam.bench.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-1.5 rounded-lg text-xs bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-white/5 transition"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="badge bg-secondary text-white font-mono text-[9px] px-1">
                    {player.number}
                  </span>
                  <span className="badge bg-info/20 text-info font-mono text-[9px] px-1">
                    {player.position}
                  </span>
                  <span className="truncate font-medium text-[11px]">{player.name}</span>
                </div>

                <button
                  onClick={() => onOpenSubModal(player)}
                  className="btn btn-xs btn-outline-warning py-0 px-1.5 text-[9px] font-bold shrink-0"
                >
                  Sub
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
