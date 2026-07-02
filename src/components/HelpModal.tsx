import React from 'react';
import { X, MousePointer, Share2, MoveRight, Compass, Flag, Shield } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-panel w-full max-w-2xl p-6 border border-white/20 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <h2 className="font-extrabold text-lg text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            Guia de Uso - TATIC PRO
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/10 flex gap-3">
            <MousePointer className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm">1. Arrastar Jogadores no Canva Paisagem</h3>
              <p className="mt-1 leading-relaxed">
                Clique e arraste qualquer jogador no campo em orientação paisagem. Ao movimentar um jogador com a opção <strong className="text-amber-300">Tracking ativada</strong>, a prancha mostrará linhas de alinhamento inteligente (Eixo X/Y) em relação aos outros jogadores e a distância para o parceiro mais próximo.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/10 flex gap-3">
            <Share2 className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm">2. Linhas de Highlight Tático</h3>
              <p className="mt-1 leading-relaxed">
                Selecione a ferramenta <strong>Linha Highlight</strong> e clique consecutivamente em dois jogadores do mesmo time para criar uma conexão tática (ex: linha defensiva de 4 defensores ou triângulo de meio-campo). Escolha o estilo Sólido, Tracejado ou Neon!
              </p>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/10 flex gap-3">
            <MoveRight className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm">3. Setas de Movimentação e Passe</h3>
              <p className="mt-1 leading-relaxed">
                Selecione <strong>Setas Corrida</strong>, clique em um jogador e arraste a seta para indicar a direção da corrida, ultrapassagem ou passe de bola.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/10 flex gap-3">
            <Shield className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm">4. Substituições & Formações</h3>
              <p className="mt-1 leading-relaxed">
                No painel lateral, alterne a formação do Brasil ou Japão (ex: 4-3-3, 4-2-3-1, 3-5-2) para auto-organizar os jogadores. Clique no botão de substituição ou dê <strong>clique-direito no jogador</strong> no campo para trocar por alguém do banco de reservas.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/10 flex gap-3">
            <Flag className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm">5. Linha de Impedimento & Alternância de Visual</h3>
              <p className="mt-1 leading-relaxed">
                Ative a guia de impedimento para ver o posicionamento em tempo real do último penúltimo defensor. Alterne entre o modo <strong>Ícones do Uniforme</strong> ou <strong>Fotos dos Jogadores</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 text-right">
          <button onClick={onClose} className="btn-primary text-xs">
            Entendi, Começar!
          </button>
        </div>
      </div>
    </div>
  );
};
