import React, { useState, useRef } from 'react';
import type { Player, Team, ToolMode, TacticalLine, ArrowAnnotation, DisplaySettings } from '../types/tactics';
import { PlayerMarker } from './PlayerMarker';

interface TacticalPitchProps {
  teamA: Team;
  teamB: Team;
  toolMode: ToolMode;
  displaySettings: DisplaySettings;
  lines: TacticalLine[];
  setLines: React.Dispatch<React.SetStateAction<TacticalLine[]>>;
  arrows: ArrowAnnotation[];
  setArrows: React.Dispatch<React.SetStateAction<ArrowAnnotation[]>>;
  drawingColor: string;
  lineStyle: 'solid' | 'dashed';
  onUpdatePlayerPosition: (playerId: string, x: number, y: number) => void;
  onSelectPlayer: (player: Player | null) => void;
  selectedPlayer: Player | null;
  onOpenSubModal: (player: Player) => void;
}

export const TacticalPitch: React.FC<TacticalPitchProps> = ({
  teamA,
  teamB,
  toolMode,
  displaySettings,
  lines,
  setLines,
  arrows,
  setArrows,
  drawingColor,
  lineStyle,
  onUpdatePlayerPosition,
  onSelectPlayer,
  selectedPlayer,
  onOpenSubModal
}) => {
  const pitchRef = useRef<HTMLDivElement>(null);
  const [draggingPlayerId, setDraggingPlayerId] = useState<string | null>(null);

  // Highlight line selection
  const [highlightSelectedPlayers, setHighlightSelectedPlayers] = useState<string[]>([]);
  
  // Arrow drawing state
  const [arrowDrawingStart, setArrowDrawingStart] = useState<{ x: number; y: number } | null>(null);
  const [arrowDrawingCurrent, setArrowDrawingCurrent] = useState<{ x: number; y: number } | null>(null);

  const allPlayers = [...teamA.starting, ...teamB.starting];

  const getPercentageCoords = (clientX: number, clientY: number) => {
    if (!pitchRef.current) return { x: 50, y: 50 };
    const rect = pitchRef.current.getBoundingClientRect();
    let x = ((clientX - rect.left) / rect.width) * 100;
    let y = ((clientY - rect.top) / rect.height) * 100;

    x = Math.max(2, Math.min(98, x));
    y = Math.max(3, Math.min(97, y));

    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent, player: Player) => {
    if (toolMode === 'select') {
      e.stopPropagation();
      setDraggingPlayerId(player.id);
      onSelectPlayer(player);
    } else if (toolMode === 'highlight') {
      e.stopPropagation();
      handleHighlightPlayerClick(player.id);
    } else if (toolMode === 'arrow') {
      e.stopPropagation();
      // Start arrow from player center to any location on the field
      setArrowDrawingStart({ x: player.x, y: player.y });
      setArrowDrawingCurrent({ x: player.x, y: player.y });
    }
  };

  const handleTouchStart = (e: React.TouchEvent, player: Player) => {
    if (e.touches.length === 1 && toolMode === 'select') {
      e.stopPropagation();
      setDraggingPlayerId(player.id);
      onSelectPlayer(player);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { x, y } = getPercentageCoords(e.clientX, e.clientY);

    if (draggingPlayerId) {
      onUpdatePlayerPosition(draggingPlayerId, x, y);
    } else if (arrowDrawingStart) {
      setArrowDrawingCurrent({ x, y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggingPlayerId && e.touches.length === 1) {
      const touch = e.touches[0];
      const { x, y } = getPercentageCoords(touch.clientX, touch.clientY);
      onUpdatePlayerPosition(draggingPlayerId, x, y);
    }
  };

  const handleMouseUp = () => {
    if (draggingPlayerId) {
      setDraggingPlayerId(null);
    }

    // Requirement 3: Arrow runs to any location on field
    if (arrowDrawingStart && arrowDrawingCurrent) {
      const dist = Math.hypot(
        arrowDrawingCurrent.x - arrowDrawingStart.x,
        arrowDrawingCurrent.y - arrowDrawingStart.y
      );

      if (dist > 2) {
        const newArrow: ArrowAnnotation = {
          id: `arrow-${Date.now()}`,
          startX: arrowDrawingStart.x,
          startY: arrowDrawingStart.y,
          endX: arrowDrawingCurrent.x,
          endY: arrowDrawingCurrent.y,
          color: drawingColor,
          type: 'run'
        };
        setArrows((prev) => [...prev, newArrow]);
      }
      setArrowDrawingStart(null);
      setArrowDrawingCurrent(null);
    }
  };

  const handleHighlightPlayerClick = (playerId: string) => {
    const clickedPlayer = allPlayers.find((p) => p.id === playerId);
    if (!clickedPlayer) return;

    if (highlightSelectedPlayers.length === 0) {
      setHighlightSelectedPlayers([playerId]);
    } else {
      if (highlightSelectedPlayers[0] === playerId) {
        setHighlightSelectedPlayers([]);
        return;
      }

      const newLine: TacticalLine = {
        id: `line-${Date.now()}`,
        type: 'highlight',
        playerIds: [highlightSelectedPlayers[0], playerId],
        color: drawingColor,
        style: lineStyle,
        teamId: clickedPlayer.teamId
      };

      setLines((prev) => [...prev, newLine]);
      setHighlightSelectedPlayers([]);
    }
  };

  const handlePitchMouseDown = (e: React.MouseEvent) => {
    if (toolMode === 'arrow' && !arrowDrawingStart) {
      const { x, y } = getPercentageCoords(e.clientX, e.clientY);
      setArrowDrawingStart({ x, y });
      setArrowDrawingCurrent({ x, y });
    }
  };

  const handlePlayerContextMenu = (e: React.MouseEvent, player: Player) => {
    e.preventDefault();
    onOpenSubModal(player);
  };

  return (
    <div
      ref={pitchRef}
      className="pitch-container w-full relative select-none cursor-crosshair"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseDown={handlePitchMouseDown}
      onMouseUp={handleMouseUp}
      onTouchEnd={() => setDraggingPlayerId(null)}
    >
      {/* ================= PITCH LINES & MARKINGS (BRIGHT WHITE) ================= */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 68" preserveAspectRatio="none">
        {/* Field Boundary */}
        <rect x="2" y="2" width="96" height="64" fill="none" stroke="#ffffff" strokeWidth="0.6" />
        {/* Center Line */}
        <line x1="50" y1="2" x2="50" y2="66" stroke="#ffffff" strokeWidth="0.6" />
        {/* Center Circle */}
        <circle cx="50" cy="34" r="9.15" fill="none" stroke="#ffffff" strokeWidth="0.6" />
        <circle cx="50" cy="34" r="0.6" fill="#ffffff" />

        {/* Left Penalty Area */}
        <rect x="2" y="15.8" width="16.5" height="36.4" fill="none" stroke="#ffffff" strokeWidth="0.6" />
        <rect x="2" y="24.9" width="5.5" height="18.2" fill="none" stroke="#ffffff" strokeWidth="0.6" />
        <circle cx="13" cy="34" r="0.5" fill="#ffffff" />
        <path d="M 18.5, 28.5 A 9.15 9.15 0 0 1 18.5 39.5" fill="none" stroke="#ffffff" strokeWidth="0.6" />
        <rect x="0.5" y="29.5" width="1.5" height="9" fill="none" stroke="#ffffff" strokeWidth="0.8" />

        {/* Right Penalty Area */}
        <rect x="81.5" y="15.8" width="16.5" height="36.4" fill="none" stroke="#ffffff" strokeWidth="0.6" />
        <rect x="92.5" y="24.9" width="5.5" height="18.2" fill="none" stroke="#ffffff" strokeWidth="0.6" />
        <circle cx="87" cy="34" r="0.5" fill="#ffffff" />
        <path d="M 81.5, 28.5 A 9.15 9.15 0 0 0 81.5 39.5" fill="none" stroke="#ffffff" strokeWidth="0.6" />
        <rect x="98" y="29.5" width="1.5" height="9" fill="none" stroke="#ffffff" strokeWidth="0.8" />

        {/* Corner Arcs */}
        <path d="M 2 3.5 A 1.5 1.5 0 0 0 3.5 2" fill="none" stroke="#ffffff" strokeWidth="0.6" />
        <path d="M 2 64.5 A 1.5 1.5 0 0 1 3.5 66" fill="none" stroke="#ffffff" strokeWidth="0.6" />
        <path d="M 98 3.5 A 1.5 1.5 0 0 1 96.5 2" fill="none" stroke="#ffffff" strokeWidth="0.6" />
        <path d="M 98 64.5 A 1.5 1.5 0 0 0 96.5 66" fill="none" stroke="#ffffff" strokeWidth="0.6" />
      </svg>

      {/* ================= SVG ANNOTATION LAYER (LINES & ARROWS) ================= */}
      <svg className="tactical-svg-layer">
        <defs>
          <marker id="arrowhead" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={drawingColor} />
          </marker>
          <marker id="arrowhead-white" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ffffff" />
          </marker>
        </defs>

        {/* Render Highlight Lines */}
        {lines.map((line) => {
          if (line.playerIds && line.playerIds.length === 2) {
            const p1 = allPlayers.find((p) => p.id === line.playerIds![0]);
            const p2 = allPlayers.find((p) => p.id === line.playerIds![1]);
            if (!p1 || !p2) return null;

            return (
              <g key={line.id} className="cursor-pointer" onClick={() => toolMode === 'eraser' && setLines(lines.filter(l => l.id !== line.id))}>
                <line
                  x1={`${p1.x}%`}
                  y1={`${p1.y}%`}
                  x2={`${p2.x}%`}
                  y2={`${p2.y}%`}
                  stroke={line.color}
                  strokeWidth="3"
                  strokeDasharray={line.style === 'dashed' ? "6 6" : undefined}
                  opacity="0.95"
                />
              </g>
            );
          }
          return null;
        })}

        {/* Requirement 3: Render Saved Run Arrows pointing to any field coordinate */}
        {arrows.map((arrow) => (
          <g key={arrow.id} className="cursor-pointer" onClick={() => toolMode === 'eraser' && setArrows(arrows.filter(a => a.id !== arrow.id))}>
            <line
              x1={`${arrow.startX}%`}
              y1={`${arrow.startY}%`}
              x2={`${arrow.endX}%`}
              y2={`${arrow.endY}%`}
              stroke={arrow.color}
              strokeWidth="3.5"
              markerEnd="url(#arrowhead-white)"
              opacity="0.95"
            />
          </g>
        ))}

        {/* Active Arrow Being Drawn */}
        {arrowDrawingStart && arrowDrawingCurrent && (
          <line
            x1={`${arrowDrawingStart.x}%`}
            y1={`${arrowDrawingStart.y}%`}
            x2={`${arrowDrawingCurrent.x}%`}
            y2={`${arrowDrawingCurrent.y}%`}
            stroke={drawingColor}
            strokeWidth="3.5"
            markerEnd="url(#arrowhead)"
            opacity="0.9"
          />
        )}

        {/* Requirement 4: Clean highlight ring on selected player without spinning ball */}
        {highlightSelectedPlayers.length === 1 && (
          (() => {
            const hp = allPlayers.find((p) => p.id === highlightSelectedPlayers[0]);
            if (!hp) return null;
            return (
              <circle
                cx={`${hp.x}%`}
                cy={`${hp.y}%`}
                r="2.5%"
                fill="none"
                stroke="#facc15"
                strokeWidth="2.5"
                opacity="0.9"
              />
            );
          })()
        )}
      </svg>

      {/* ================= PLAYERS MARKERS ================= */}
      {teamA.starting.map((player) => (
        <PlayerMarker
          key={player.id}
          player={player}
          team={teamA}
          displaySettings={displaySettings}
          isSelected={selectedPlayer?.id === player.id}
          isDragging={draggingPlayerId === player.id}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={(_, p) => {
            if (toolMode === 'highlight') handleHighlightPlayerClick(p.id);
            else onSelectPlayer(p);
          }}
          onContextMenu={handlePlayerContextMenu}
        />
      ))}

      {teamB.starting.map((player) => (
        <PlayerMarker
          key={player.id}
          player={player}
          team={teamB}
          displaySettings={displaySettings}
          isSelected={selectedPlayer?.id === player.id}
          isDragging={draggingPlayerId === player.id}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={(_, p) => {
            if (toolMode === 'highlight') handleHighlightPlayerClick(p.id);
            else onSelectPlayer(p);
          }}
          onContextMenu={handlePlayerContextMenu}
        />
      ))}
    </div>
  );
};
