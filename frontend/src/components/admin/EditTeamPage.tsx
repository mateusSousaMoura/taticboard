import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Team, Player } from '../../types/tactics';
import { fetchTeams } from '../../services/api';
import { ArrowLeft, Save, Shield, User, Plus, Trash2, Edit, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

export const EditTeamPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');

  const [team, setTeam] = useState<Team | null>(null);
  const [name, setName] = useState<string>('');
  const [shortName, setShortName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [primaryColor, setPrimaryColor] = useState<string>('#2563EB');
  const [secondaryColor, setSecondaryColor] = useState<string>('#FFFFFF');
  const [textColor, setTextColor] = useState<string>('#FFFFFF');
  const [formation, setFormation] = useState<string>('4-3-3');

  // Pairwise Substitution State (Starter & Reserve Selection)
  const [selectedStarterId, setSelectedStarterId] = useState<string | null>(null);
  const [selectedBenchId, setSelectedBenchId] = useState<string | null>(null);
  const [subbing, setSubbing] = useState<boolean>(false);

  const [saving, setSaving] = useState<boolean>(false);
  const [msg, setMsg] = useState<string | null>(null);

  const loadTeam = async () => {
    const allTeams = await fetchTeams();
    const found = allTeams.find((t) => t.id === teamId);
    if (found) {
      setTeam(found);
      setName(found.name);
      setShortName(found.shortName);
      setCode(found.code || found.shortName);
      setPrimaryColor(found.primaryColor);
      setSecondaryColor(found.secondaryColor);
      setTextColor(found.textColor);
      setFormation(found.formation);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }
    loadTeam();
  }, [teamId, token, navigate]);

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId || !token) return;

    setSaving(true);
    setMsg(null);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/teams/${teamId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          short_name: shortName,
          code,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          text_color: textColor,
          formation
        })
      });

      if (!res.ok) throw new Error('Erro ao salvar seleção');

      setMsg('Seleção atualizada com sucesso!');
      setTimeout(() => navigate('/admin'), 1200);
    } catch (err: any) {
      setMsg(err.message || 'Falha na atualização');
    } finally {
      setSaving(false);
    }
  };

  // Perform Simultaneous Pairwise Substitution (Swap 2 players at once)
  const handlePerformPairwiseSubstitution = async () => {
    if (!selectedStarterId || !selectedBenchId || !token) return;

    setSubbing(true);
    try {
      // 1. Set starter to bench (is_starting: false)
      const res1 = fetch(`${API_BASE_URL}/admin/players/${selectedStarterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_starting: false })
      });

      // 2. Set bench to starter (is_starting: true)
      const res2 = fetch(`${API_BASE_URL}/admin/players/${selectedBenchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_starting: true })
      });

      await Promise.all([res1, res2]);

      // Reload team state
      await loadTeam();
      setSelectedStarterId(null);
      setSelectedBenchId(null);
      setMsg('Substituição de titulares realizada com sucesso! (11 Mantidos)');
    } catch (e) {
      console.error(e);
      setMsg('Erro ao realizar substituição');
    } finally {
      setSubbing(false);
    }
  };

  const handleDeletePlayer = async (playerId: string) => {
    if (!confirm('Deseja excluir este jogador?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/players/${playerId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await loadTeam();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!team) {
    return (
      <div className="w-screen h-screen bg-[#0b1120] text-slate-100 p-6 flex items-center justify-center">
        <div className="glass-panel p-6 text-center text-slate-400">
          Carregando dados da seleção...
        </div>
      </div>
    );
  }

  const startingPlayers = team.starting || [];
  const benchPlayers = team.bench || [];

  const selectedStarterObj = startingPlayers.find((p) => p.id === selectedStarterId);
  const selectedBenchObj = benchPlayers.find((p) => p.id === selectedBenchId);

  return (
    <div className="w-screen h-screen bg-[#0b1120] text-slate-100 p-4 md:p-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/admin')}
            className="btn btn-sm btn-outline-light text-xs flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Painel Admin</span>
          </button>

          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-400" />
            Editar Seleção: <span className="text-blue-400">{team.name}</span>
          </h1>
        </div>

        {msg && (
          <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold text-center">
            {msg}
          </div>
        )}

        {/* Team Details Form */}
        <form onSubmit={handleSaveTeam} className="glass-panel p-5 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-white/10">
            Dados Gerais & Uniformes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Nome do País/Time</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-white/20 rounded p-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Nome Curto</label>
              <input
                type="text"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                className="w-full bg-slate-900 border border-white/20 rounded p-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Sigla TLA (3 Letras)</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-900 border border-white/20 rounded p-2 text-xs text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Cor Camisa (Primária)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                />
                <span className="font-mono text-xs text-slate-400">{primaryColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Cor Borda (Secundária)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                />
                <span className="font-mono text-xs text-slate-400">{secondaryColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Cor Números (Texto)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                />
                <span className="font-mono text-xs text-slate-400">{textColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Esquema Padrão</label>
              <select
                value={formation}
                onChange={(e) => setFormation(e.target.value)}
                className="w-full bg-slate-900 border border-white/20 rounded p-2 text-xs text-white"
              >
                <option value="4-3-3">4-3-3</option>
                <option value="4-4-2">4-4-2</option>
                <option value="3-5-2">3-5-2</option>
                <option value="3-4-2-1">3-4-2-1</option>
                <option value="4-2-3-1">4-2-3-1</option>
                <option value="5-3-2">5-3-2</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary font-bold text-xs py-2 px-4 flex items-center gap-2 shadow"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Salvando...' : 'Salvar Alterações da Seleção'}</span>
          </button>
        </form>

        {/* Pairwise Substitution & Squad Management */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 flex-wrap gap-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              Gestão de Elenco & Substituição de Titulares
            </h2>

            <button
              onClick={() => navigate(`/admin/players/new?teamId=${team.id}`)}
              className="btn btn-xs btn-success font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Jogador</span>
            </button>
          </div>

          {/* Pairwise Substitution Control Bar */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-300 flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white flex items-center gap-1">
                <ArrowLeftRight className="w-4 h-4 text-warning" />
                Troca Simultânea de Titular:
              </span>
              <span>
                Saindo: <span className="font-bold text-yellow-400">{selectedStarterObj ? `${selectedStarterObj.number}. ${selectedStarterObj.name}` : 'Nenhum selecionado'}</span>
              </span>
              <span>•</span>
              <span>
                Entrando: <span className="font-bold text-emerald-400">{selectedBenchObj ? `${selectedBenchObj.number}. ${selectedBenchObj.name}` : 'Nenhum selecionado'}</span>
              </span>
            </div>

            <button
              onClick={handlePerformPairwiseSubstitution}
              disabled={!selectedStarterId || !selectedBenchId || subbing}
              className={`btn btn-sm text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                selectedStarterId && selectedBenchId && !subbing
                  ? 'btn-warning text-slate-950 shadow hover:brightness-110'
                  : 'btn-outline-secondary text-slate-500 border-white/10 opacity-50 cursor-not-allowed'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{subbing ? 'Substituindo...' : 'Trocar 2 ao Mesmo Tempo'}</span>
            </button>
          </div>

          {/* 2 Columns: Titulares (11) vs Reservas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1: Titulares (11) */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-white/10">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-yellow-400 mb-2 flex items-center justify-between">
                <span>⚡ Titulares Iniciais ({startingPlayers.length})</span>
                <span className="text-[10px] text-slate-400 font-normal">Selecione 1 para sair</span>
              </h3>

              <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                {startingPlayers.map((player) => {
                  const isSelected = selectedStarterId === player.id;

                  return (
                    <div
                      key={player.id}
                      onClick={() => setSelectedStarterId(isSelected ? null : player.id)}
                      className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition ${
                        isSelected
                          ? 'bg-yellow-400/20 border-yellow-400 text-white shadow'
                          : 'bg-slate-900/80 border-white/10 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-6 h-6 rounded-full font-mono font-bold text-[10px] flex items-center justify-center shrink-0"
                          style={{ backgroundColor: primaryColor, color: textColor }}
                        >
                          {player.number}
                        </span>
                        <div className="truncate">
                          <span className="font-bold text-white block truncate">{player.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">{player.position}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-yellow-400" />}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/players/edit/${player.id}`);
                          }}
                          className="btn btn-xs btn-outline-info p-1"
                          title="Editar Jogador"
                        >
                          <Edit className="w-3 h-3" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePlayer(player.id);
                          }}
                          className="btn btn-xs btn-outline-danger p-1"
                          title="Excluir Jogador"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Reservas */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-white/10">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-2 flex items-center justify-between">
                <span>🛡️ Banco de Reservas ({benchPlayers.length})</span>
                <span className="text-[10px] text-slate-400 font-normal">Selecione 1 para entrar</span>
              </h3>

              <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                {benchPlayers.map((player) => {
                  const isSelected = selectedBenchId === player.id;

                  return (
                    <div
                      key={player.id}
                      onClick={() => setSelectedBenchId(isSelected ? null : player.id)}
                      className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-400 text-white shadow'
                          : 'bg-slate-900/80 border-white/10 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-6 h-6 rounded-full font-mono font-bold text-[10px] flex items-center justify-center shrink-0"
                          style={{ backgroundColor: primaryColor, color: textColor }}
                        >
                          {player.number}
                        </span>
                        <div className="truncate">
                          <span className="font-bold text-white block truncate">{player.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">{player.position}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/players/edit/${player.id}`);
                          }}
                          className="btn btn-xs btn-outline-info p-1"
                          title="Editar Jogador"
                        >
                          <Edit className="w-3 h-3" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePlayer(player.id);
                          }}
                          className="btn btn-xs btn-outline-danger p-1"
                          title="Excluir Jogador"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
