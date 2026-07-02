import React, { useState } from 'react';
import type { Team, Player, PhaseState } from '../types/tactics';
import { FORMATION_LAYOUTS } from '../data/mockData';
import { 
  Settings2, 
  Shield,
  Palette
} from 'lucide-react';

interface TeamPanelProps {
  teamA: Team;
  teamB: Team;
  phaseState: PhaseState;
  onOpenSubModal: (player: Player) => void;
  onApplyFormation: (teamId: string, formationName: string) => void;
  onUpdateTeamColors: (teamId: string, primaryColor: string, secondaryColor: string, textColor: string) => void;
}

const PRESET_COLORS = [
  { name: 'Amarelo', primary: '#FDE047', secondary: '#16A34A', text: '#0F172A' },
  { name: 'Azul', primary: '#2563EB', secondary: '#FFFFFF', text: '#FFFFFF' },
  { name: 'Vermelho', primary: '#DC2626', secondary: '#FACC15', text: '#FFFFFF' },
  { name: 'Branco', primary: '#F8FAFC', secondary: '#0F172A', text: '#0F172A' },
  { name: 'Verde', primary: '#16A34A', secondary: '#FDE047', text: '#FFFFFF' },
  { name: 'Celeste', primary: '#38BDF8', secondary: '#FFFFFF', text: '#FFFFFF' },
  { name: 'Preto', primary: '#1E293B', secondary: '#94A3B8', text: '#FFFFFF' },
  { name: 'Grená', primary: '#881337', secondary: '#FACC15', text: '#FFFFFF' },
];

export const TeamPanel: React.FC<TeamPanelProps> = ({
  teamA,
  teamB,
  phaseState,
  onOpenSubModal,
  onApplyFormation,
  onUpdateTeamColors
}) => {
  const [activeTab, setActiveTab] = useState<'teamA' | 'teamB'>('teamA');
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);

  const currentTeam = activeTab === 'teamA' ? teamA : teamB;

  const isTeamAttacking = 
    (activeTab === 'teamA' && phaseState === 'teamA_attack') ||
    (activeTab === 'teamB' && phaseState === 'teamB_attack');

  const handleFormationChange = (formation: string) => {
    onApplyFormation(currentTeam.id, formation);
  };

  const handleColorPresetSelect = (preset: typeof PRESET_COLORS[0]) => {
    onUpdateTeamColors(currentTeam.id, preset.primary, preset.secondary, preset.text);
  };

  return (
    <div className="glass-panel p-3 h-full flex flex-col justify-between overflow-y-auto custom-scrollbar">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Team Selector Tabs */}
        <div className="btn-group w-100 mb-2 shrink-0" role="group">
          <button
            onClick={() => setActiveTab('teamA')}
            className={`btn btn-sm text-[11px] font-bold transition-all truncate flex items-center justify-center gap-1.5 ${
              activeTab === 'teamA'
                ? 'btn-warning text-dark shadow'
                : 'btn-outline-secondary text-white'
            }`}
          >
            <span 
              className="w-2.5 h-2.5 rounded-full border border-black/30 shrink-0"
              style={{ backgroundColor: teamA.primaryColor }}
            />
            <span className="truncate">{teamA.name}</span>
          </button>

          <button
            onClick={() => setActiveTab('teamB')}
            className={`btn btn-sm text-[11px] font-bold transition-all truncate flex items-center justify-center gap-1.5 ${
              activeTab === 'teamB'
                ? 'btn-primary text-white shadow'
                : 'btn-outline-secondary text-white'
            }`}
          >
            <span 
              className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0"
              style={{ backgroundColor: teamB.primaryColor }}
            />
            <span className="truncate">{teamB.name}</span>
          </button>
        </div>

        {/* Phase & Posture Badge */}
        <div className="mb-2 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/10 flex items-center justify-between text-xs font-semibold shrink-0">
          <span className="text-slate-400 text-[11px]">Postura:</span>
          <span className={`font-bold uppercase font-mono text-[10px] ${isTeamAttacking ? 'text-warning' : 'text-info'}`}>
            {isTeamAttacking ? '⚡ ATACANDO' : '🛡️ DEFENDENDO'}
          </span>
        </div>

        {/* Formation Picker */}
        <div className="mb-2 bg-slate-900/60 p-2 rounded-xl border border-white/10 shrink-0">
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

        {/* Uniform Color Customizer */}
        <div className="mb-3 bg-slate-900/80 p-2 rounded-xl border border-white/10 shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-yellow-400" />
              Cores do Uniforme
            </span>
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="text-[10px] text-blue-400 font-bold hover:underline"
            >
              {showColorPicker ? 'Fechar' : 'Personalizar'}
            </button>
          </div>

          {/* Color Presets Palette */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleColorPresetSelect(preset)}
                className="w-5 h-5 rounded-full border border-white/30 shrink-0 hover:scale-110 transition-transform shadow"
                style={{ backgroundColor: preset.primary }}
                title={`Mudar uniforme para ${preset.name}`}
              />
            ))}
          </div>

          {/* Custom Color Pickers */}
          {showColorPicker && (
            <div className="mt-2 pt-2 border-t border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-300">Camisa:</span>
                <input
                  type="color"
                  value={currentTeam.primaryColor}
                  onChange={(e) => onUpdateTeamColors(currentTeam.id, e.target.value, currentTeam.secondaryColor, currentTeam.textColor)}
                  className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-300">Borda:</span>
                <input
                  type="color"
                  value={currentTeam.secondaryColor}
                  onChange={(e) => onUpdateTeamColors(currentTeam.id, currentTeam.primaryColor, e.target.value, currentTeam.textColor)}
                  className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-300">Número:</span>
                <input
                  type="color"
                  value={currentTeam.textColor}
                  onChange={(e) => onUpdateTeamColors(currentTeam.id, currentTeam.primaryColor, currentTeam.secondaryColor, e.target.value)}
                  className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Bench Players List */}
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
                  <span 
                    className="badge font-mono text-[9px] px-1 font-bold"
                    style={{ backgroundColor: currentTeam.primaryColor, color: currentTeam.textColor }}
                  >
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
