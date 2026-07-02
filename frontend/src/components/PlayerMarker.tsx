import React from 'react';
import type { Player, DisplaySettings, Team } from '../types/tactics';

interface PlayerMarkerProps {
  player: Player;
  team: Team;
  displaySettings: DisplaySettings;
  isSelected: boolean;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent, player: Player) => void;
  onTouchStart: (e: React.TouchEvent, player: Player) => void;
  onClick: (e: React.MouseEvent, player: Player) => void;
  onContextMenu: (e: React.MouseEvent, player: Player) => void;
}

export const PlayerMarker: React.FC<PlayerMarkerProps> = ({
  player,
  team,
  displaySettings,
  isSelected,
  isDragging,
  onMouseDown,
  onTouchStart,
  onClick,
  onContextMenu
}) => {
  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing transition-transform duration-75 select-none z-20 ${
        isDragging ? 'scale-125 z-50' : 'hover:scale-110'
      }`}
      style={{
        left: `${player.x}%`,
        top: `${player.y}%`,
      }}
      onMouseDown={(e) => onMouseDown(e, player)}
      onTouchStart={(e) => onTouchStart(e, player)}
      onClick={(e) => onClick(e, player)}
      onContextMenu={(e) => onContextMenu(e, player)}
      title={`${player.number}. ${player.name} (${player.position})`}
    >
      <div className="flex flex-col items-center group">
        {/* Player Token Circle */}
        <div
          className={`relative rounded-full flex items-center justify-center transition-all duration-150 ${
            isSelected
              ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-slate-950 scale-105 shadow-xl'
              : 'shadow-md'
          }`}
          style={{
            width: '42px',
            height: '42px',
            backgroundColor: team.primaryColor,
            border: `3px solid ${team.secondaryColor}`,
          }}
        >
          {displaySettings.viewMode === 'photo' && player.photoUrl ? (
            <div className="w-full h-full rounded-full overflow-hidden p-0.5">
              <img
                src={player.photoUrl}
                alt={player.name}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          ) : (
            /* Number / Icon Mode */
            <span 
              className="font-black text-base leading-none"
              style={{ color: team.textColor }}
            >
              {player.number}
            </span>
          )}

          {/* Position Tag */}
          <div 
            className="absolute -bottom-1 bg-slate-950 text-white font-mono text-[9px] px-1 rounded border border-white/20 font-bold"
          >
            {player.position}
          </div>
        </div>

        {/* Name Label */}
        {displaySettings.showNames && (
          <span className="mt-1 bg-slate-950/90 text-white font-medium text-[10px] px-2 py-0.5 rounded-full border border-white/10 shadow-sm whitespace-nowrap max-w-[100px] truncate">
            {player.name}
          </span>
        )}
      </div>
    </div>
  );
};
