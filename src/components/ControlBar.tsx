import React from 'react';
import type { ToolMode, DisplaySettings } from '../types/tactics';
import { 
  MousePointer, 
  Share2, 
  MoveRight, 
  Eraser, 
  User, 
  Shield
} from 'lucide-react';

interface ControlBarProps {
  toolMode: ToolMode;
  setToolMode: (mode: ToolMode) => void;
  displaySettings: DisplaySettings;
  setDisplaySettings: React.Dispatch<React.SetStateAction<DisplaySettings>>;
  drawingColor: string;
  setDrawingColor: (color: string) => void;
  lineStyle: 'solid' | 'dashed';
  setLineStyle: (style: 'solid' | 'dashed') => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  toolMode,
  setToolMode,
  displaySettings,
  setDisplaySettings,
  drawingColor,
  setDrawingColor,
  lineStyle,
  setLineStyle
}) => {
  const colors = [
    { name: 'Ciano', value: '#00f0ff' },
    { name: 'Amarelo', value: '#facc15' },
    { name: 'Branco', value: '#ffffff' },
    { name: 'Vermelho', value: '#ef4444' }
  ];

  return (
    <div className="glass-panel p-2 mb-3 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Primary Tool Selector */}
      <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-white/10">
        <button
          onClick={() => setToolMode('select')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
            toolMode === 'select'
              ? 'bg-blue-600 text-white font-bold shadow'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <MousePointer className="w-3.5 h-3.5" />
          <span>Mover Jogadores</span>
        </button>

        <button
          onClick={() => setToolMode('highlight')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
            toolMode === 'highlight'
              ? 'bg-yellow-400 text-slate-950 font-bold shadow'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Linha Highlight</span>
        </button>

        <button
          onClick={() => setToolMode('arrow')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
            toolMode === 'arrow'
              ? 'bg-emerald-500 text-white font-bold shadow'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <MoveRight className="w-3.5 h-3.5" />
          <span>Setas Corrida</span>
        </button>

        <button
          onClick={() => setToolMode('eraser')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
            toolMode === 'eraser'
              ? 'bg-red-500 text-white font-bold shadow'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Eraser className="w-3.5 h-3.5" />
          <span>Borracha</span>
        </button>
      </div>

      {/* Drawing Options (Color & Style) */}
      {(toolMode === 'highlight' || toolMode === 'arrow') && (
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1 rounded-xl border border-white/10">
          <span className="text-slate-400 font-mono text-[11px]">COR:</span>
          <div className="flex items-center gap-1.5">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => setDrawingColor(c.value)}
                className={`w-4 h-4 rounded-full border transition-all ${
                  drawingColor === c.value
                    ? 'scale-125 border-white ring-2 ring-blue-400'
                    : 'border-white/20 hover:scale-110'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
          </div>

          {toolMode === 'highlight' && (
            <>
              <div className="h-3 w-[1px] bg-white/20 mx-1"></div>
              <button
                onClick={() => setLineStyle('solid')}
                className={`px-2 py-0.5 rounded ${lineStyle === 'solid' ? 'bg-white/20 text-white font-bold' : 'text-slate-400'}`}
              >
                Sólida
              </button>
              <button
                onClick={() => setLineStyle('dashed')}
                className={`px-2 py-0.5 rounded ${lineStyle === 'dashed' ? 'bg-white/20 text-white font-bold' : 'text-slate-400'}`}
              >
                Tracejada
              </button>
            </>
          )}
        </div>
      )}

      {/* Requirement 5: Display View Mode toggle - ONLY Photo vs Numbers/Icons */}
      <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-white/10">
        <button
          onClick={() =>
            setDisplaySettings((prev) => ({
              ...prev,
              viewMode: prev.viewMode === 'photo' ? 'number' : 'photo'
            }))
          }
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition"
        >
          {displaySettings.viewMode === 'photo' ? (
            <>
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Exibição: Fotos</span>
            </>
          ) : (
            <>
              <Shield className="w-3.5 h-3.5 text-yellow-400" />
              <span>Exibição: Números/Ícones</span>
            </>
          )}
        </button>

        <button
          onClick={() =>
            setDisplaySettings((prev) => ({
              ...prev,
              showNames: !prev.showNames
            }))
          }
          className={`px-2 py-1 rounded-lg text-xs transition ${
            displaySettings.showNames ? 'bg-white/20 text-white font-bold' : 'text-slate-400'
          }`}
        >
          {displaySettings.showNames ? 'Nomes Visíveis' : 'Nomes Ocultos'}
        </button>
      </div>
    </div>
  );
};
