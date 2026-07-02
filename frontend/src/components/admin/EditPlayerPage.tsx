import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { Team, Player } from '../../types/tactics';
import { fetchTeams } from '../../services/api';
import { ArrowLeft, Save, User } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

export const EditPlayerPage: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [searchParams] = useSearchParams();
  const defaultTeamId = searchParams.get('teamId') || '';

  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');

  const [teams, setTeams] = useState<Team[]>([]);
  const [name, setName] = useState<string>('');
  const [number, setNumber] = useState<number>(10);
  const [position, setPosition] = useState<string>('CM');
  const [teamId, setTeamId] = useState<string>(defaultTeamId);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [photoUrl, setPhotoUrl] = useState<string>('');

  const [saving, setSaving] = useState<boolean>(false);
  const [msg, setMsg] = useState<string | null>(null);

  const isNew = !playerId || playerId === 'new';

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }

    async function loadData() {
      const allTeams = await fetchTeams();
      setTeams(allTeams);

      if (!isNew && playerId) {
        let foundPlayer: Player | null = null;
        for (const t of allTeams) {
          const p = [...t.starting, ...t.bench].find((item) => item.id === playerId);
          if (p) {
            foundPlayer = p;
            break;
          }
        }

        if (foundPlayer) {
          setName(foundPlayer.name);
          setNumber(foundPlayer.number);
          setPosition(foundPlayer.position);
          setTeamId(foundPlayer.teamId);
          setIsStarting(foundPlayer.isStarting);
          setPhotoUrl(foundPlayer.photoUrl || '');
        }
      } else if (allTeams.length > 0 && !teamId) {
        setTeamId(allTeams[0].id);
      }
    }
    loadData();
  }, [playerId, token, navigate, isNew, teamId]);

  const handleSavePlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    setMsg(null);

    const url = isNew
      ? `${API_BASE_URL}/admin/players`
      : `${API_BASE_URL}/admin/players/${playerId}`;

    const method = isNew ? 'POST' : 'PUT';

    const payload = isNew
      ? {
          name,
          shirt_number: number,
          position,
          team_id: parseInt(teamId, 10) || 1,
          is_starting: isStarting,
          photo_url: photoUrl
        }
      : {
          name,
          shirt_number: number,
          position,
          is_starting: isStarting,
          photo_url: photoUrl
        };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Erro ao salvar jogador');

      setMsg(isNew ? 'Jogador cadastrado com sucesso!' : 'Jogador atualizado com sucesso!');
      setTimeout(() => {
        if (teamId) {
          navigate(`/admin/teams/edit/${teamId}`);
        } else {
          navigate('/admin');
        }
      }, 1200);
    } catch (err: any) {
      setMsg(err.message || 'Falha ao salvar jogador');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#0b1120] text-slate-100 p-4 md:p-6 overflow-y-auto custom-scrollbar flex items-center justify-center">
      <div className="max-w-xl w-full space-y-4">
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
            <User className="w-5 h-5 text-blue-400" />
            {isNew ? 'Novo Jogador' : `Editar Jogador: ${name}`}
          </h1>
        </div>

        {msg && (
          <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold text-center">
            {msg}
          </div>
        )}

        <form onSubmit={handleSavePlayer} className="glass-panel p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Nome Completo do Jogador</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-white/20 rounded p-2.5 text-xs text-white outline-none focus:border-blue-500"
              placeholder="EX: Vinícius Júnior"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Número da Camisa</label>
              <input
                type="number"
                value={number}
                onChange={(e) => setNumber(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-slate-900 border border-white/20 rounded p-2 text-xs text-white"
                min="1"
                max="99"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Posição Tática</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full bg-slate-900 border border-white/20 rounded p-2 text-xs text-white font-mono"
              >
                <option value="GK">GK - Goleiro</option>
                <option value="CB">CB - Zagueiro</option>
                <option value="LB">LB - Lateral Esquerdo</option>
                <option value="RB">RB - Lateral Direito</option>
                <option value="CDM">CDM - Volante</option>
                <option value="CM">CM - Meia Central</option>
                <option value="CAM">CAM - Meia Atacante</option>
                <option value="LW">LW - Ponta Esquerda</option>
                <option value="RW">RW - Ponta Direita</option>
                <option value="ST">ST - Centroavante</option>
              </select>
            </div>
          </div>

          {isNew && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Seleção / Time</label>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full bg-slate-900 border border-white/20 rounded p-2.5 text-xs text-white font-semibold"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.shortName})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isStartingChk"
              checked={isStarting}
              onChange={(e) => setIsStarting(e.target.checked)}
              className="w-4 h-4 text-blue-500 rounded border-white/20 bg-slate-900 cursor-pointer"
            />
            <label htmlFor="isStartingChk" className="text-xs text-slate-200 font-semibold cursor-pointer">
              Iniciar como Titular nos 11 Iniciais
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">URL da Foto (Opcional)</label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full bg-slate-900 border border-white/20 rounded p-2 text-xs text-white placeholder-slate-500"
              placeholder="https://.../player.png"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full btn btn-primary font-bold text-xs py-2.5 flex items-center justify-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Salvando...' : 'Salvar Jogador'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
