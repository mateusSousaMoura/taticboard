import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Team, Player } from '../../types/tactics';
import { fetchTeams } from '../../services/api';
import { ArrowLeft, Save, Shield, User, Plus, Trash2, Edit } from 'lucide-react';

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

  const [saving, setSaving] = useState<boolean>(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }

    async function loadTeam() {
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

  const handleDeletePlayer = async (playerId: string) => {
    if (!confirm('Deseja excluir este jogador?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/players/${playerId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setTeam((prev) => prev ? {
          ...prev,
          starting: prev.starting.filter(p => p.id !== playerId),
          bench: prev.bench.filter(p => p.id !== playerId)
        } : null);
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

  const allSquadPlayers: Player[] = [...(team.starting || []), ...(team.bench || [])];

  return (
    <div className="w-screen h-screen bg-[#0b1120] text-slate-100 p-4 md:p-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-4">
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

        {/* Squad Players Management */}
        <div className="glass-panel p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              Elenco de Jogadores ({allSquadPlayers.length})
            </h2>

            <button
              onClick={() => navigate(`/admin/players/new?teamId=${team.id}`)}
              className="btn btn-xs btn-success font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Jogador</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {allSquadPlayers.map((player) => (
              <div
                key={player.id}
                className="p-2.5 rounded-lg bg-slate-900/80 border border-white/10 flex items-center justify-between text-xs"
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
                    <span className="text-[10px] font-mono text-slate-400">
                      {player.position} • {player.isStarting ? 'Titular' : 'Reserva'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => navigate(`/admin/players/edit/${player.id}`)}
                    className="btn btn-xs btn-outline-info p-1"
                    title="Editar Jogador"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeletePlayer(player.id)}
                    className="btn btn-xs btn-outline-danger p-1"
                    title="Excluir Jogador"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
