import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Competition, Team, MatchFixture } from '../types/tactics';
import { fetchCompetitions, fetchMatchesByCompetition, fetchTeams, triggerSyncWorldCup } from '../services/api';
import { 
  ShieldCheck, 
  Trophy, 
  Shield, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit, 
  LogOut, 
  ArrowLeft, 
  RefreshCw, 
  Lock,
  X
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

export const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  
  // Auth State
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [usernameInput, setUsernameInput] = useState<string>('admin');
  const [passwordInput, setPasswordInput] = useState<string>('admin123');
  const [authError, setAuthError] = useState<string | null>(null);

  // Data State
  const [activeTab, setActiveTab] = useState<'competitions' | 'teams' | 'matches'>('competitions');
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [fixtures, setFixtures] = useState<MatchFixture[]>([]);
  
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  // Modal / Form State
  const [showCompModal, setShowCompModal] = useState<boolean>(false);
  const [newCompCode, setNewCompCode] = useState<string>('');
  const [newCompName, setNewCompName] = useState<string>('');

  const [showTeamModal, setShowTeamModal] = useState<boolean>(false);
  const [newTeamName, setNewTeamName] = useState<string>('');
  const [newTeamShort, setNewTeamShort] = useState<string>('');
  const [newTeamColor, setNewTeamColor] = useState<string>('#2563EB');

  // Load Data
  const loadAdminData = async () => {
    const compData = await fetchCompetitions();
    setCompetitions(compData);
    
    const teamData = await fetchTeams();
    setTeams(teamData);
    
    const matchData = await fetchMatchesByCompetition('WC');
    setFixtures(matchData);
  };

  useEffect(() => {
    if (token) {
      loadAdminData();
    }
  }, [token]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      
      if (!res.ok) {
        throw new Error('Credenciais de administrador inválidas');
      }
      
      const data = await res.json();
      localStorage.setItem('admin_token', data.token);
      setToken(data.token);
      loadAdminData();
    } catch (err: any) {
      setAuthError(err.message || 'Erro ao realizar login de administrador');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  // Trigger World Cup API Sync
  const handleTriggerSync = async () => {
    setIsSyncing(true);
    const res = await triggerSyncWorldCup();
    setSyncMsg(res.message);
    setTimeout(async () => {
      await loadAdminData();
      setIsSyncing(false);
      setSyncMsg(null);
    }, 3000);
  };

  // --- DELETE ACTIONS (FIXED WITH BEARER TOKEN & CASCADE BACKEND) ---

  const handleDeleteCompetition = async (code: string) => {
    if (!token) return;
    if (!confirm(`Tem certeza que deseja excluir a competição '${code}' e seus jogos?`)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/competitions/${code}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        setCompetitions((prev) => prev.filter((c) => c.code !== code));
      } else {
        const err = await res.json();
        alert(`Erro ao excluir: ${err.detail || 'Falha na operação'}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (!token) return;
    if (!confirm(`Tem certeza que deseja excluir esta seleção, seus jogadores e jogos?`)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/teams/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        setTeams((prev) => prev.filter((t) => t.id !== id));
      } else {
        const err = await res.json();
        alert(`Erro ao excluir: ${err.detail || 'Falha na operação'}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteMatch = async (id: string) => {
    if (!token) return;
    if (!confirm(`Tem certeza que deseja excluir esta partida?`)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/matches/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        setFixtures((prev) => prev.filter((m) => m.id !== id));
      } else {
        const err = await res.json();
        alert(`Erro ao excluir: ${err.detail || 'Falha na operação'}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- CREATE ACTIONS ---

  const handleCreateCompetition = async () => {
    if (!newCompCode || !newCompName || !token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/competitions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: newCompCode.toUpperCase(),
          code: newCompCode.toUpperCase(),
          name: newCompName,
          type: 'CUP',
          season: 2026
        })
      });
      if (res.ok) {
        setShowCompModal(false);
        setNewCompCode('');
        setNewCompName('');
        await loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamName || !token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newTeamName,
          short_name: newTeamShort || newTeamName.slice(0, 3).toUpperCase(),
          code: newTeamShort || newTeamName.slice(0, 3).toUpperCase(),
          primary_color: newTeamColor
        })
      });
      if (res.ok) {
        setShowTeamModal(false);
        setNewTeamName('');
        setNewTeamShort('');
        await loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Render Login Card if unauthenticated
  if (!token) {
    return (
      <div className="w-screen h-screen bg-[#0b1120] text-slate-100 flex items-center justify-center p-4">
        <div className="glass-panel w-full max-w-md p-6 shadow-2xl border border-white/20">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Painel do Administrador</h2>
            <p className="text-xs text-slate-400 mt-1">
              Acesse com suas credenciais para gerenciar o banco de dados PostgreSQL
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-2.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Usuário</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-slate-900 border border-white/20 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Senha</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-900 border border-white/20 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full btn btn-primary font-bold py-2 text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Entrar no Painel CRUD</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full btn btn-outline-secondary text-xs py-2 text-slate-300"
            >
              ← Voltar para a Prancha Tática
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-[#0b1120] text-slate-100 p-4 md:p-6 overflow-y-auto custom-scrollbar flex flex-col justify-between">
      {/* Admin Top Header */}
      <div className="max-w-7xl mx-auto w-full mb-6 shrink-0">
        <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="btn btn-sm btn-outline-light text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao App</span>
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              ADMINISTRADOR AUTENTICADO
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="btn btn-sm btn-outline-info text-info flex items-center gap-1 text-xs font-bold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sincronizar Copa</span>
            </button>

            <button
              onClick={handleLogout}
              className="btn btn-sm btn-outline-danger text-red-400 text-xs flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          Gerenciador do Banco de Dados <span className="text-blue-500">(PostgreSQL CRUD)</span>
        </h1>

        {syncMsg && (
          <div className="mt-2 p-2 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-xs font-bold animate-pulse">
            {syncMsg}
          </div>
        )}
      </div>

      {/* Main Admin Dashboard */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col space-y-4 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="glass-panel p-2 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('competitions')}
            className={`btn btn-sm text-xs font-bold flex items-center gap-1.5 ${
              activeTab === 'competitions' ? 'btn-primary' : 'btn-outline-secondary text-slate-300'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Competições ({competitions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('teams')}
            className={`btn btn-sm text-xs font-bold flex items-center gap-1.5 ${
              activeTab === 'teams' ? 'btn-primary' : 'btn-outline-secondary text-slate-300'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Seleções / Times ({teams.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`btn btn-sm text-xs font-bold flex items-center gap-1.5 ${
              activeTab === 'matches' ? 'btn-primary' : 'btn-outline-secondary text-slate-300'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Partidas / Jogos ({fixtures.length})</span>
          </button>
        </div>

        {/* TAB 1: COMPETITIONS CRUD */}
        {activeTab === 'competitions' && (
          <div className="glass-panel p-4 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h3 className="text-sm font-bold text-white">Tabela de Competições</h3>
              <button
                onClick={() => setShowCompModal(true)}
                className="btn btn-xs btn-success font-bold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Competição</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-mono sticky top-0">
                  <tr>
                    <th className="p-2.5">Código</th>
                    <th className="p-2.5">Nome</th>
                    <th className="p-2.5">Tipo</th>
                    <th className="p-2.5">Ano</th>
                    <th className="p-2.5">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {competitions.map((comp) => (
                    <tr key={comp.code} className="hover:bg-white/5">
                      <td className="p-2.5 font-mono font-bold text-yellow-400">{comp.code}</td>
                      <td className="p-2.5 font-bold text-white">{comp.name}</td>
                      <td className="p-2.5">{comp.type}</td>
                      <td className="p-2.5">{comp.season}</td>
                      <td className="p-2.5 flex items-center gap-1">
                        <button
                          onClick={() => handleDeleteCompetition(comp.code)}
                          className="btn btn-xs btn-outline-danger p-1 text-red-400"
                          title="Excluir Competição"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: TEAMS CRUD */}
        {activeTab === 'teams' && (
          <div className="glass-panel p-4 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h3 className="text-sm font-bold text-white">Tabela de Seleções & Times</h3>
              <button
                onClick={() => setShowTeamModal(true)}
                className="btn btn-xs btn-success font-bold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Seleção</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-mono sticky top-0">
                  <tr>
                    <th className="p-2.5">ID</th>
                    <th className="p-2.5">Seleção</th>
                    <th className="p-2.5">Sigla</th>
                    <th className="p-2.5">Cor Uniforme</th>
                    <th className="p-2.5">Titulares / Banco</th>
                    <th className="p-2.5">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {teams.map((team) => (
                    <tr key={team.id} className="hover:bg-white/5">
                      <td className="p-2.5 font-mono">{team.id}</td>
                      <td className="p-2.5 font-bold text-white">{team.name}</td>
                      <td className="p-2.5 font-mono">{team.shortName}</td>
                      <td className="p-2.5">
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="w-4 h-4 rounded-full border border-white/30 inline-block"
                            style={{ backgroundColor: team.primaryColor }}
                          />
                          <span className="font-mono text-[10px] text-slate-400">{team.primaryColor}</span>
                        </div>
                      </td>
                      <td className="p-2.5 font-mono text-[11px]">
                        {team.starting?.length || 0} Titulares / {team.bench?.length || 0} Reservas
                      </td>
                      <td className="p-2.5 flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/admin/teams/edit/${team.id}`)}
                          className="btn btn-xs btn-outline-info p-1 text-blue-400"
                          title="Página de Edição de Seleção"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteTeam(team.id)}
                          className="btn btn-xs btn-outline-danger p-1 text-red-400"
                          title="Excluir Seleção"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MATCHES CRUD */}
        {activeTab === 'matches' && (
          <div className="glass-panel p-4 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h3 className="text-sm font-bold text-white">Tabela de Partidas & Jogos</h3>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-mono sticky top-0">
                  <tr>
                    <th className="p-2.5">ID</th>
                    <th className="p-2.5">Fase / Estágio</th>
                    <th className="p-2.5">Mandante vs Visitante</th>
                    <th className="p-2.5">Data UTC</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {fixtures.map((m) => (
                    <tr key={m.id} className="hover:bg-white/5">
                      <td className="p-2.5 font-mono text-slate-400">{m.id}</td>
                      <td className="p-2.5 font-bold text-white">{m.stage}</td>
                      <td className="p-2.5">
                        <span className="font-bold text-yellow-400">{m.homeTeam?.name}</span> vs <span className="font-bold text-blue-400">{m.awayTeam?.name}</span>
                      </td>
                      <td className="p-2.5 font-mono text-[11px]">{new Date(m.utcDate).toLocaleString('pt-BR')}</td>
                      <td className="p-2.5">
                        <span className="badge bg-secondary font-mono text-[9px]">{m.status}</span>
                      </td>
                      <td className="p-2.5 flex items-center gap-1">
                        <button
                          onClick={() => handleDeleteMatch(m.id)}
                          className="btn btn-xs btn-outline-danger p-1 text-red-400"
                          title="Excluir Partida"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CREATE COMPETITION MODAL */}
      {showCompModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md p-5 border border-white/20">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">Criar Nova Competição</h3>
              <button onClick={() => setShowCompModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Código (ex: WC, CL, PL)</label>
                <input
                  type="text"
                  value={newCompCode}
                  onChange={(e) => setNewCompCode(e.target.value)}
                  className="w-full bg-slate-900 border border-white/20 rounded p-2 text-xs text-white"
                  placeholder="EX: EURO"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nome da Competição</label>
                <input
                  type="text"
                  value={newCompName}
                  onChange={(e) => setNewCompName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/20 rounded p-2 text-xs text-white"
                  placeholder="EX: UEFA Euro 2026"
                />
              </div>

              <button
                onClick={handleCreateCompetition}
                className="w-full btn btn-success font-bold text-xs py-2 mt-2"
              >
                Salvar no PostgreSQL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE TEAM MODAL */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md p-5 border border-white/20">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">Criar Nova Seleção</h3>
              <button onClick={() => setShowTeamModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nome da Seleção</label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/20 rounded p-2 text-xs text-white"
                  placeholder="EX: Itália"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Sigla / TLA (3 Letras)</label>
                <input
                  type="text"
                  value={newTeamShort}
                  onChange={(e) => setNewTeamShort(e.target.value)}
                  className="w-full bg-slate-900 border border-white/20 rounded p-2 text-xs text-white"
                  placeholder="EX: ITA"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Cor Primária</label>
                <input
                  type="color"
                  value={newTeamColor}
                  onChange={(e) => setNewTeamColor(e.target.value)}
                  className="w-full h-8 bg-transparent cursor-pointer rounded"
                />
              </div>

              <button
                onClick={handleCreateTeam}
                className="w-full btn btn-success font-bold text-xs py-2 mt-2"
              >
                Salvar Seleção no Banco
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
