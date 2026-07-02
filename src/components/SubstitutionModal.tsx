import React from 'react';
import type { Player, Team } from '../types/tactics';
import { ArrowLeftRight, X, UserCheck } from 'lucide-react';

interface SubstitutionModalProps {
  targetPlayer: Player | null;
  teamA: Team;
  teamB: Team;
  onClose: () => void;
  onConfirmSub: (subOutPlayer: Player, subInPlayer: Player) => void;
}

export const SubstitutionModal: React.FC<SubstitutionModalProps> = ({
  targetPlayer,
  teamA,
  teamB,
  onClose,
  onConfirmSub
}) => {
  if (!targetPlayer) return null;

  const currentTeam = targetPlayer.teamId === 'teamA' ? teamA : teamB;
  const isTargetStarting = targetPlayer.isStarting;

  // Available candidate players for substitution
  const candidates = isTargetStarting
    ? currentTeam.bench
    : currentTeam.starting;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-panel w-full max-w-md p-5 border border-white/20 shadow-2xl animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-400/20 text-amber-400">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Substituição de Jogador</h3>
              <p className="text-xs text-slate-400">
                Time: <span className="text-amber-300 font-bold">{currentTeam.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Target Player Banner */}
        <div className="bg-slate-900/90 p-3 rounded-xl border border-white/10 mb-4 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2"
            style={{
              backgroundColor: currentTeam.primaryColor,
              borderColor: currentTeam.secondaryColor,
              color: currentTeam.textColor
            }}
          >
            {targetPlayer.number}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">{targetPlayer.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                {targetPlayer.position}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Status atual: {isTargetStarting ? 'Titular em Campo (Sairá)' : 'Reserva no Banco (Entrará)'}
            </p>
          </div>
        </div>

        {/* List of Candidates to Swap */}
        <h4 className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
          {isTargetStarting ? 'Escolha quem Entra (Banco)' : 'Escolha quem Sai (Campo)'}
        </h4>

        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1 mb-4">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              onClick={() => {
                if (isTargetStarting) {
                  onConfirmSub(targetPlayer, candidate);
                } else {
                  onConfirmSub(candidate, targetPlayer);
                }
              }}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-amber-400/20 hover:border-amber-400/40 border border-white/5 cursor-pointer transition group"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-200 font-black text-xs flex items-center justify-center">
                  {candidate.number}
                </span>
                <div>
                  <div className="font-semibold text-xs text-slate-200 group-hover:text-white flex items-center gap-2">
                    {candidate.name}
                    <span className="text-[9px] font-mono text-slate-400">{candidate.position}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>Trocar</span>
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end">
          <button onClick={onClose} className="btn-secondary text-xs">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
