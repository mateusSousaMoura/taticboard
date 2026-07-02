import { useState } from 'react';
import { initialBrazilTeam, initialJapanTeam, FORMATION_LAYOUTS } from './data/mockData';
import type { Team, Player, ToolMode, TacticalLine, ArrowAnnotation, DisplaySettings, PhaseState } from './types/tactics';
import { Header } from './components/Header';
import { ControlBar } from './components/ControlBar';
import { TacticalPitch } from './components/TacticalPitch';
import { TeamPanel } from './components/TeamPanel';
import { SubstitutionModal } from './components/SubstitutionModal';
import { MatchSelection } from './components/MatchSelection';

export function App() {
  // Navigation Screen: 'matches' (Selection Dashboard) or 'pitch' (Tactical Board)
  const [currentScreen, setCurrentScreen] = useState<'matches' | 'pitch'>('matches');

  const [teamA, setTeamA] = useState<Team>(initialBrazilTeam);
  const [teamB, setTeamB] = useState<Team>(initialJapanTeam);
  
  // Phase State: who is attacking
  const [phaseState, setPhaseState] = useState<PhaseState>('teamA_attack');

  const [toolMode, setToolMode] = useState<ToolMode>('select');
  const [drawingColor, setDrawingColor] = useState<string>('#00f0ff');
  const [lineStyle, setLineStyle] = useState<'solid' | 'dashed'>('solid');

  const [lines, setLines] = useState<TacticalLine[]>([]);
  const [arrows, setArrows] = useState<ArrowAnnotation[]>([]);

  // Display settings (Photo vs Number/Icon mode)
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    viewMode: 'photo',
    showNames: true,
  });

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [subModalPlayer, setSubModalPlayer] = useState<Player | null>(null);

  // Handle Match Selection from Dashboard
  const handleSelectMatch = (home: Team, away: Team) => {
    // Clone starting squads so dragging/subs don't alter global templates
    setTeamA({ ...home, starting: JSON.parse(JSON.stringify(home.starting)) });
    setTeamB({ ...away, starting: JSON.parse(JSON.stringify(away.starting)) });
    setPhaseState('teamA_attack');
    setLines([]);
    setArrows([]);
    setCurrentScreen('pitch');
  };

  // Update single player position on drag
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

  // Select Attacking Team & dynamically update layout positions
  const handleSelectPhase = (newPhase: PhaseState) => {
    setPhaseState(newPhase);

    // Reposition Team A
    const layoutA = FORMATION_LAYOUTS[teamA.formation] || FORMATION_LAYOUTS['4-3-3'];
    const positionsA = newPhase === 'teamA_attack' ? layoutA.attack : layoutA.defense;

    const updatedStartingA = teamA.starting.map((p, idx) => {
      const pos = positionsA[idx] || positionsA[positionsA.length - 1];
      return { ...p, position: pos.position as any, x: pos.x, y: pos.y };
    });

    // Reposition Team B
    const layoutB = FORMATION_LAYOUTS[teamB.formation] || FORMATION_LAYOUTS['3-4-2-1'] || FORMATION_LAYOUTS['4-3-3'];
    const positionsB = newPhase === 'teamB_attack' ? layoutB.attack : layoutB.defense;

    const updatedStartingB = teamB.starting.map((p, idx) => {
      const pos = positionsB[idx] || positionsB[positionsB.length - 1];
      return { ...p, position: pos.position as any, x: 100 - pos.x, y: pos.y };
    });

    setTeamA({ ...teamA, starting: updatedStartingA });
    setTeamB({ ...teamB, starting: updatedStartingB });
  };

  // Execute player substitution
  const handleConfirmSubstitution = (subOutPlayer: Player, subInPlayer: Player) => {
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
  };

  // Apply formation preset taking into account current phase (Attacking or Defending)
  const handleApplyFormation = (teamId: string, formationName: string) => {
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
    setPhaseState('teamA_attack');
    setLines([]);
    setArrows([]);
    handleSelectPhase('teamA_attack');
  };

  const handleClearDrawings = () => {
    setLines([]);
    setArrows([]);
  };

  if (currentScreen === 'matches') {
    return <MatchSelection onSelectMatch={handleSelectMatch} />;
  }

  return (
    <div className="w-screen h-screen p-2 flex flex-col justify-between overflow-hidden bg-[#0b1120]">
      {/* Header Bar */}
      <Header
        teamA={teamA}
        teamB={teamB}
        phaseState={phaseState}
        onSelectPhase={handleSelectPhase}
        onClearDrawings={handleClearDrawings}
        onResetPositions={handleResetPositions}
        onBackToMatches={() => setCurrentScreen('matches')}
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
        <div className="col-span-9 xl:col-span-10 flex items-center justify-center w-full h-full overflow-hidden">
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
            onUpdatePlayerPosition={handleUpdatePlayerPosition}
            onSelectPlayer={setSelectedPlayer}
            selectedPlayer={selectedPlayer}
            onOpenSubModal={setSubModalPlayer}
          />
        </div>

        {/* Compact Sidebar */}
        <div className="col-span-3 xl:col-span-2 w-full h-full overflow-hidden">
          <TeamPanel
            teamA={teamA}
            teamB={teamB}
            phaseState={phaseState}
            onOpenSubModal={setSubModalPlayer}
            onApplyFormation={(tId, fmt) => handleApplyFormation(tId, fmt)}
          />
        </div>
      </div>

      {/* Substitution Modal */}
      <SubstitutionModal
        targetPlayer={subModalPlayer}
        teamA={teamA}
        teamB={teamB}
        onClose={() => setSubModalPlayer(null)}
        onConfirmSub={handleConfirmSubstitution}
      />
    </div>
  );
}

export default App;
