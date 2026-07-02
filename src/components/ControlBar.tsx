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
    <div className="glass-panel p-2 mb-2 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Primary Tool Selector with Bootstrap Button Group */}
      <div className="btn-group" role="group">
        <button
          onClick={() => setToolMode('select')}
          className={`btn btn-sm text-xs font-semibold flex items-center gap-1.5 ${
            toolMode === 'select'
              ? 'btn-primary text-white shadow-sm'
              : 'btn-outline-secondary text-slate-300 border-white/20'
          }`}
        >
          <MousePointer className="w-3.5 h-3.5" />
          <span>Mover Jogadores</span>
        </button>

        <button
          onClick={() => setToolMode('highlight')}
          className={`btn btn-sm text-xs font-semibold flex items-center gap-1.5 ${
            toolMode === 'highlight'
              ? 'btn-warning text-dark shadow-sm'
              : 'btn-outline-secondary text-slate-300 border-white/20'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Linha Highlight</span>
        </button>

        <button
          onClick={() => setToolMode('arrow')}
          className={`btn btn-sm text-xs font-semibold flex items-center gap-1.5 ${
            toolMode === 'arrow'
              ? 'btn-success text-white shadow-sm'
              : 'btn-outline-secondary text-slate-300 border-white/20'
          }`}
        >
          <MoveRight className="w-3.5 h-3.5" />
          <span>Setas Corrida</span>
        </button>

        <button
          onClick={() => setToolMode('eraser')}
          className={`btn btn-sm text-xs font-semibold flex items-center gap-1.5 ${
            toolMode === 'eraser'
              ? 'btn-danger text-white shadow-sm'
              : 'btn-outline-secondary text-slate-300 border-white/20'
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
                    ? 'scale-125 border-white ring-2 ring-info'
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
              <div className="btn-group btn-group-sm" role="group">
                <button
                  onClick={() => setLineStyle('solid')}
                  className={`btn btn-xs ${lineStyle === 'solid' ? 'btn-light font-bold' : 'btn-outline-secondary text-slate-300'}`}
                >
                  Sólida
                </button>
                <button
                  onClick={() => setLineStyle('dashed')}
                  className={`btn btn-xs ${lineStyle === 'dashed' ? 'btn-light font-bold' : 'btn-outline-secondary text-slate-300'}`}
                >
                  Tracejada
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* View Mode Toggle with Bootstrap Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            setDisplaySettings((prev) => ({
              ...prev,
              viewMode: prev.viewMode === 'photo' ? 'number' : 'photo'
            }))
          }
          className="btn btn-sm btn-outline-info text-info flex items-center gap-1.5 text-xs"
        >
          {displaySettings.viewMode === 'photo' ? (
            <>
              <User className="w-3.5 h-3.5" />
              <span>Fotos</span>
            </>
          ) : (
            <>
              <Shield className="w-3.5 h-3.5" />
              <span>Números/Ícones</span>
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
          className={`btn btn-sm text-xs ${
            displaySettings.showNames
              ? 'btn-secondary text-white font-bold'
              : 'btn-outline-secondary text-slate-400'
          }`}
        >
          {displaySettings.showNames ? 'Nomes Visíveis' : 'Nomes Ocultos'}
        </button>
      </div>
    </div>
  );
};
