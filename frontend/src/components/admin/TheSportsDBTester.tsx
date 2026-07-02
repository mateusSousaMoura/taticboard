import React, { useState } from 'react';
import { Play, Terminal, Code, CheckCircle2, AlertCircle, Sparkles, Copy, RefreshCw } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

interface PresetEndpoint {
  title: string;
  endpoint: string;
  params: Record<string, string>;
  description: string;
}

const PRESETS: PresetEndpoint[] = [
  {
    title: 'Lookup Copa do Mundo (ID 4429)',
    endpoint: 'lookupleague.php',
    params: { id: '4429' },
    description: 'Busca os detalhes da FIFA World Cup pelo ID 4429'
  },
  {
    title: 'Listar Times da Copa (ID 4429)',
    endpoint: 'lookup_all_teams.php',
    params: { id: '4429' },
    description: 'Lista todas as equipes cadastradas no ID da Copa'
  },
  {
    title: 'Pesquisar Seleção "Brazil"',
    endpoint: 'searchteams.php',
    params: { t: 'Brazil' },
    description: 'Busca a seleção ou time pelo nome Brazil'
  },
  {
    title: 'Pesquisar Time "Arsenal"',
    endpoint: 'searchteams.php',
    params: { t: 'Arsenal' },
    description: 'Busca detalhes do Arsenal (disponível na chave free 123)'
  },
  {
    title: 'Listar Atletas do Time (ID 133604)',
    endpoint: 'lookup_all_players.php',
    params: { id: '133604' },
    description: 'Lista jogadores cadastrados do time ID 133604'
  },
  {
    title: 'Ver Jogos da Temporada 2026',
    endpoint: 'eventsseason.php',
    params: { id: '4429', s: '2026' },
    description: 'Lista partidas agendadas para a temporada 2026'
  },
  {
    title: 'Listar Todas as Ligas Suportadas',
    endpoint: 'all_leagues.php',
    params: {},
    description: 'Lista todas as ligas retornadas pela chave gratuita'
  }
];

export const TheSportsDBTester: React.FC = () => {
  const token = localStorage.getItem('admin_token');

  const [apiKey, setApiKey] = useState<string>('123');
  const [endpoint, setEndpoint] = useState<string>('lookupleague.php');
  const [paramKey, setParamKey] = useState<string>('id');
  const [paramValue, setParamValue] = useState<string>('4429');

  const [loading, setLoading] = useState<boolean>(false);
  const [responseResult, setResponseResult] = useState<any | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleRunTest = async (overrideEndpoint?: string, overrideParams?: Record<string, string>) => {
    if (!token) return;

    setLoading(true);
    setResponseResult(null);

    const targetEndpoint = overrideEndpoint || endpoint;
    const targetParams = overrideParams || (paramKey ? { [paramKey]: paramValue } : {});

    try {
      const res = await fetch(`${API_BASE_URL}/admin/test-thesportsdb`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          endpoint: targetEndpoint,
          params: targetParams,
          apiKey: apiKey || '123'
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Erro na execução do teste');
      }

      const result = await res.json();
      setResponseResult(result);
    } catch (err: any) {
      setResponseResult({
        status_code: 500,
        url: `https://www.thesportsdb.com/api/v1/json/${apiKey}/${targetEndpoint}`,
        latency_ms: 0,
        data: { error: err.message || 'Erro ao conectar com TheSportsDB' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (p: PresetEndpoint) => {
    setEndpoint(p.endpoint);
    const keys = Object.keys(p.params);
    if (keys.length > 0) {
      setParamKey(keys[0]);
      setParamValue(p.params[keys[0]]);
    } else {
      setParamKey('');
      setParamValue('');
    }
    handleRunTest(p.endpoint, p.params);
  };

  const handleCopyJson = () => {
    if (!responseResult) return;
    navigator.clipboard.writeText(JSON.stringify(responseResult.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel p-5 space-y-5 flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <span>Playground TheSportsDB API (v1)</span>
              <span className="badge bg-yellow-400 text-slate-950 font-black text-[9px] uppercase">
                TESTER DE ENDPOINTS
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Teste individualmente os endpoints para verificar dados da Copa e respostas da API em tempo real.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Action Chips */}
      <div className="shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          Presets Rápidos de Teste:
        </span>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(p)}
              className="btn btn-xs btn-outline-secondary text-slate-300 border-white/10 hover:bg-white/10 text-[11px] font-bold whitespace-nowrap"
              title={p.description}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Input Parameters Form */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10 space-y-3 shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* API Key Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Chave da API (Key)</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-950 border border-white/20 rounded-lg p-2 text-xs text-yellow-300 font-mono"
              placeholder="123 (Free) ou Chave Premium"
            />
          </div>

          {/* Endpoint Selector / Input */}
          <div className="md:col-span-1">
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Endpoint (PHP script)</label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="w-full bg-slate-950 border border-white/20 rounded-lg p-2 text-xs text-white font-mono"
              placeholder="ex: lookupleague.php"
            />
          </div>

          {/* Parameter Key */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Parâmetro (Chave)</label>
            <input
              type="text"
              value={paramKey}
              onChange={(e) => setParamKey(e.target.value)}
              className="w-full bg-slate-950 border border-white/20 rounded-lg p-2 text-xs text-white font-mono"
              placeholder="ex: id, t, l, p"
            />
          </div>

          {/* Parameter Value */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Valor do Parâmetro</label>
            <input
              type="text"
              value={paramValue}
              onChange={(e) => setParamValue(e.target.value)}
              className="w-full bg-slate-950 border border-white/20 rounded-lg p-2 text-xs text-white font-mono"
              placeholder="ex: 4429, Brazil, Arsenal"
            />
          </div>
        </div>

        <button
          onClick={() => handleRunTest()}
          disabled={loading}
          className="w-full btn btn-primary font-bold text-xs py-2 flex items-center justify-center gap-2 shadow-lg hover:bg-blue-600 transition"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Requisitando TheSportsDB API...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Executar Requisição ao Vivo</span>
            </>
          )}
        </button>
      </div>

      {/* Response Display Output */}
      {responseResult && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950/90 rounded-xl border border-white/10 overflow-hidden">
          {/* Status Bar */}
          <div className="px-4 py-2.5 bg-slate-900 border-b border-white/10 flex items-center justify-between gap-3 text-xs shrink-0 flex-wrap">
            <div className="flex items-center gap-2 font-mono truncate">
              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                responseResult.status_code === 200 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                HTTP {responseResult.status_code}
              </span>
              <span className="text-slate-400 truncate max-w-md">{responseResult.url}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-slate-400">
                {responseResult.latency_ms} ms
              </span>

              <button
                onClick={handleCopyJson}
                className="btn btn-xs btn-outline-secondary text-slate-300 flex items-center gap-1 text-[10px]"
              >
                {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copiado!' : 'Copiar JSON'}</span>
              </button>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar font-mono text-xs text-emerald-400 whitespace-pre-wrap select-text">
            {JSON.stringify(responseResult.data, null, 2)}
          </div>
        </div>
      )}
    </div>
  );
};
