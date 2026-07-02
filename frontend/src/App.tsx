import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { initialBrazilTeam, initialJapanTeam, FORMATION_LAYOUTS } from './data/mockData';
import type { Team, Player, ToolMode, TacticalLine, ArrowAnnotation, DisplaySettings, PhaseState } from './types/tactics';
import { Header } from './components/Header';
import { ControlBar } from './components/ControlBar';
import { TacticalPitch } from './components/TacticalPitch';
import { TeamPanel } from './components/TeamPanel';
import { SubstitutionModal } from './components/SubstitutionModal';
import { MatchSelection } from './components/MatchSelection';

interface HistorySnapshot {
  teamA: Team;
  teamB: Team;
  lines: TacticalLine[];
  arrows: ArrowAnnotation[];
  phaseState: PhaseState;
}

export function App() {
  const navigate = useNavigate();

  const [teamA, setTeamA] = useState<Team>(initialBrazilTeam);
  const [teamB, setTeamB] = useState<Team>(initialJapanTeam);
  
  // Phase State: who is attacking
  const [phaseState, setPhaseState] = useState<PhaseState>('teamA_attack');

  const [toolMode, setToolMode] = useState<ToolMode>('select');
  const [drawingColor, setDrawingColor] = useState<string>('#00f0ff');
  const [lineStyle, setLineStyle] = useState<'solid' | 'dashed'>('solid');

  const [lines, setLines] = useState<TacticalLine[]>([]);
  const [arrows, setArrows] = useState<ArrowAnnotation[]>([]);

  // History Stack for Ctrl+Z Undo
  const [historyStack, setHistoryStack] = useState<HistorySnapshot[]>([]);

  const saveSnapshot = useCallback(() => {
    setHistoryStack((prev) => [
      ...prev.slice(-49), // Keep max 50 snapshots
      {
        teamA: JSON.parse(JSON.stringify(teamA)),
        teamB: JSON.parse(JSON.stringify(teamB)),
        lines: JSON.parse(JSON.stringify(lines)),
        arrows: JSON.parse(JSON.stringify(arrows)),
        phaseState
      }
    ]);
  }, [teamA, teamB, lines, arrows, phaseState]);

  const handleUndo = useCallback(() => {
    if (historyStack.length === 0) return;

    const previousSnapshot = historyStack[historyStack.length - 1];
    setHistoryStack((prev) => prev.slice(0, -1));

    setTeamA(previousSnapshot.teamA);
    setTeamB(previousSnapshot.teamB);
    setLines(previousSnapshot.lines);
    setArrows(previousSnapshot.arrows);
    setPhaseState(previousSnapshot.phaseState);
  }, [historyStack]);

  // Global Ctrl+Z / Cmd+Z Keyboard Shortcut Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElem = document.activeElement;
      if (
        activeElem && 
        (activeElem.tagName === 'INPUT' || activeElem.tagName === 'TEXTAREA' || (activeElem as HTMLElement).isContentEditable)
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo]);

  // Default display viewMode set to 'number'
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    viewMode: 'number',
    showNames: true,
  });

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [subModalPlayer, setSubModalPlayer] = useState<Player | null>(null);

  // Interactive Pulsing Substitution state
  const [pendingSubPlayer, setPendingSubPlayer] = useState<Player | null>(null);

  // Format initial starting XI coordinates
  const formatInitialMatchPostures = (home: Team, away: Team) => {
    const layoutA = FORMATION_LAYOUTS[home.formation] || FORMATION_LAYOUTS['4-3-3'];
    const positionsA = layoutA.attack;

    const updatedStartingA = home.starting.map((p, idx) => {
      const pos = positionsA[idx] || positionsA[positionsA.length - 1];
      return { ...p, position: pos.position as any, x: pos.x, y: pos.y, teamId: home.id };
    });

    const layoutB = FORMATION_LAYOUTS[away.formation] || FORMATION_LAYOUTS['3-4-2-1'] || FORMATION_LAYOUTS['4-3-3'];
    const positionsB = layoutB.defense;

    const updatedStartingB = away.starting.map((p, idx) => {
      const pos = positionsB[idx] || positionsB[positionsB.length - 1];
      return { ...p, position: pos.position as any, x: 100 - pos.x, y: pos.y, teamId: away.id };
    });

    let primaryB = away.primaryColor;
    let secondaryB = away.secondaryColor;
    let textB = away.textColor;

    if (home.primaryColor.toUpperCase() === away.primaryColor.toUpperCase()) {
      primaryB = '#2563EB';
      secondaryB = '#FFFFFF';
      textB = '#FFFFFF';
    }

    setTeamA({
      ...home,
      starting: updatedStartingA
    });

    setTeamB({
      ...away,
      primaryColor: primaryB,
      secondaryColor: secondaryB,
      textColor: textB,
      starting: updatedStartingB
    });

    setPhaseState('teamA_attack');
    setLines([]);
    setArrows([]);
    setPendingSubPlayer(null);
    setHistoryStack([]);
  };

  useEffect(() => {
    formatInitialMatchPostures(initialBrazilTeam, initialJapanTeam);
  }, []);

  const handleSelectMatch = (home: Team, away: Team) => {
    formatInitialMatchPostures(home, away);
    navigate('/pitch');
  };

  // Front-end player name editing during match simulation
  const handleRenamePlayer = (playerId: string, newName: string) => {
    saveSnapshot();
    const renameInTeam = (t: Team): Team => ({
      ...t,
      starting: t.starting.map((p) => (p.id === playerId ? { ...p, name: newName } : p)),
      bench: t.bench.map((p) => (p.id === playerId ? { ...p, name: newName } : p))
    });

    if (teamA.starting.some((p) => p.id === playerId) || teamA.bench.some((p) => p.id === playerId)) {
      setTeamA(renameInTeam(teamA));
    } else if (teamB.starting.some((p) => p.id === playerId) || teamB.bench.some((p) => p.id === playerId)) {
      setTeamB(renameInTeam(teamB));
    }
  };

  // Update uniform colors dynamically
  const handleUpdateTeamColors = (teamId: string, primaryColor: string, secondaryColor: string, textColor: string) => {
    saveSnapshot();
    if (teamId === teamA.id) {
      setTeamA({ ...teamA, primaryColor, secondaryColor, textColor });
    } else {
      setTeamB({ ...teamB, primaryColor, secondaryColor, textColor });
    }
  };

  // Update single player position on drag (save snapshot before drag)
  const handleUpdatePlayerPosition = (playerId: string, x: number, y: number) => {
    const updateTeam = (team: Team): Team => ({
      ...team,
      starting: team.starting.map((p) => (p.id === playerId ? { ...p, x, y } : p))
    });

    if (teamA.starting.some((p) => p.id === playerId)) {
      setTeamA(updateTeam(teamA));
    } else if (teamB.starting.some((p) => p.id === playerId)) {
      setTeamB(updateTeam(teamB));
    }
  };

  // Save snapshot before dragging or drawing starts
  const handlePitchActionStart = () => {
    saveSnapshot();
  };

  // Select Attacking Team & dynamically update layout positions
  const handleSelectPhase = (newPhase: PhaseState) => {
    saveSnapshot();
    setPhaseState(newPhase);

    const layoutA = FORMATION_LAYOUTS[teamA.formation] || FORMATION_LAYOUTS['4-3-3'];
    const positionsA = newPhase === 'teamA_attack' ? layoutA.attack : layoutA.defense;

    const updatedStartingA = teamA.starting.map((p, idx) => {
      const pos = positionsA[idx] || positionsA[positionsA.length - 1];
      return { ...p, position: pos.position as any, x: pos.x, y: pos.y };
    });

    const layoutB = FORMATION_LAYOUTS[teamB.formation] || FORMATION_LAYOUTS['3-4-2-1'] || FORMATION_LAYOUTS['4-3-3'];
    const positionsB = newPhase === 'teamB_attack' ? layoutB.attack : layoutB.defense;

    const updatedStartingB = teamB.starting.map((p, idx) => {
      const pos = positionsB[idx] || positionsB[positionsB.length - 1];
      return { ...p, position: pos.position as any, x: 100 - pos.x, y: pos.y };
    });

    setTeamA({ ...teamA, starting: updatedStartingA });
    setTeamB({ ...teamB, starting: updatedStartingB });
  };

  // Interactive Substitution Execution (Swap bench player with clicked field player)
  const handleConfirmSubstitution = (subOutPlayer: Player, subInPlayer: Player) => {
    saveSnapshot();
    const isTeamA = subOutPlayer.teamId === teamA.id;
    const targetTeam = isTeamA ? teamA : teamB;
    const setTargetTeam = isTeamA ? setTeamA : setTeamB;

    const newStarting = targetTeam.starting.map((p) =>
      p.id === subOutPlayer.id
        ? { ...subInPlayer, x: subOutPlayer.x, y: subOutPlayer.y, isStarting: true, teamId: targetTeam.id }
        : p
    );

    const newBench = targetTeam.bench.map((p) =>
      p.id === subInPlayer.id
        ? { ...subOutPlayer, isStarting: false, x: 0, y: 0, teamId: targetTeam.id }
        : p
    );

    setTargetTeam({
      ...targetTeam,
      starting: newStarting,
      bench: newBench
    });

    setSubModalPlayer(null);
    setPendingSubPlayer(null);
  };

  // Apply formation preset taking into account current phase
  const handleApplyFormation = (teamId: string, formationName: string) => {
    saveSnapshot();
    const layout = FORMATION_LAYOUTS[formationName];
    if (!layout) return;

    const isTeamA = teamId === teamA.id;
    const targetTeam = isTeamA ? teamA : teamB;
    const setTargetTeam = isTeamA ? setTeamA : setTeamB;

    const isAttacking = 
      (isTeamA && phaseState === 'teamA_attack') ||
      (!isTeamA && phaseState === 'teamB_attack');

    const positions = isAttacking ? layout.attack : layout.defense;

    const updatedStarting = targetTeam.starting.map((player, idx) => {
      const posInfo = positions[idx] || positions[positions.length - 1];
      let x = posInfo.x;
      let y = posInfo.y;

      if (!isTeamA) {
        x = 100 - x;
      }

      return {
        ...player,
        position: posInfo.position as any,
        x,
        y
      };
    });

    setTargetTeam({
      ...targetTeam,
      formation: formationName,
      starting: updatedStarting
    });
  };

  const handleResetPositions = () => {
    saveSnapshot();
    handleSelectPhase('teamA_attack');
    setLines([]);
    setArrows([]);
    setPendingSubPlayer(null);
  };

  const handleClearDrawings = () => {
    saveSnapshot();
    setLines([]);
    setArrows([]);
  };

  return (
    <Routes>
      {/* Route 1: Match & Competition Selection Dashboard */}
      <Route path="/" element={<MatchSelection onSelectMatch={handleSelectMatch} />} />
      <Route path="/matches" element={<MatchSelection onSelectMatch={handleSelectMatch} />} />

      {/* Route 2: Tactical Board View */}
      <Route
        path="/pitch"
        element={
          <div className="w-screen h-screen p-2 flex flex-col justify-between overflow-hidden bg-[#0b1120]">
            {/* Header Bar */}
            <Header
              teamA={teamA}
              teamB={teamB}
              phaseState={phaseState}
              onSelectPhase={handleSelectPhase}
              onClearDrawings={handleClearDrawings}
              onResetPositions={handleResetPositions}
              onBackToMatches={() => navigate('/')}
              onUndo={handleUndo}
              canUndo={historyStack.length > 0}
            />

            {/* Control Bar */}
            <ControlBar
              toolMode={toolMode}
              setToolMode={setToolMode}
              displaySettings={displaySettings}
              setDisplaySettings={setDisplaySettings}
              drawingColor={drawingColor}
              setDrawingColor={setDrawingColor}
              lineStyle={lineStyle}
              setLineStyle={setLineStyle}
            />

            {/* Full Viewport Grid Layout */}
            <div className="flex-1 grid grid-cols-12 gap-2 overflow-hidden items-center">
              {/* Maximized Landscape Pitch Container */}
              <div 
                className="col-span-9 xl:col-span-10 flex items-center justify-center w-full h-full overflow-hidden"
                onMouseDown={handlePitchActionStart}
              >
                <TacticalPitch
                  teamA={teamA}
                  teamB={teamB}
                  toolMode={toolMode}
                  displaySettings={displaySettings}
                  lines={lines}
                  setLines={setLines}
                  arrows={arrows}
                  setArrows={setArrows}
                  drawingColor={drawingColor}
                  lineStyle={lineStyle}
                  pendingSubPlayer={pendingSubPlayer}
                  onConfirmSub={handleConfirmSubstitution}
                  onUpdatePlayerPosition={handleUpdatePlayerPosition}
                  onSelectPlayer={setSelectedPlayer}
                  selectedPlayer={selectedPlayer}
                  onOpenSubModal={setSubModalPlayer}
                  onRenamePlayer={handleRenamePlayer}
                />
              </div>

              {/* Compact Sidebar */}
              <div className="col-span-3 xl:col-span-2 w-full h-full overflow-hidden">
                <TeamPanel
                  teamA={teamA}
                  teamB={teamB}
                  phaseState={phaseState}
                  pendingSubPlayer={pendingSubPlayer}
                  onStartSubstitution={(p) => setPendingSubPlayer(p)}
                  onCancelSubstitution={() => setPendingSubPlayer(null)}
                  onOpenSubModal={setSubModalPlayer}
                  onApplyFormation={(tId, fmt) => handleApplyFormation(tId, fmt)}
                  onUpdateTeamColors={handleUpdateTeamColors}
                  onRenamePlayer={handleRenamePlayer}
                />
              </div>
            </div>

            {/* Substitution Modal (Secondary / Context Menu Fallback) */}
            <SubstitutionModal
              targetPlayer={subModalPlayer}
              teamA={teamA}
              teamB={teamB}
              onClose={() => setSubModalPlayer(null)}
              onConfirmSub={handleConfirmSubstitution}
            />
          </div>
        }
      />
    </Routes>
  );
}

export default App;
