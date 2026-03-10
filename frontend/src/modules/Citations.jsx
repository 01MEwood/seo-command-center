import { useState, useEffect, useCallback } from 'react';
import { Card, Btn, Input, Select, Spinner, EmptyState, ErrorBox, Badge } from '../components/ui';
import * as api from '../services/api';
import { REGIONS } from '../config/constants';

const ENGINES = [
  { id: 'chatgpt', name: 'ChatGPT', icon: '🤖', color: '#10a37f' },
  { id: 'perplexity', name: 'Perplexity', icon: '🔮', color: '#7c3aed' },
  { id: 'gemini', name: 'Gemini', icon: '✨', color: '#4285f4' },
];

const DEFAULT_QUERIES = [
  { query: 'Welche Schreinerei in Stuttgart baut Einbauschränke nach Maß?', keyword: 'Einbauschrank nach Maß' },
  { query: 'Dachschrägenschrank vom Schreiner in der Region Stuttgart', keyword: 'Dachschrägenschrank' },
  { query: 'Begehbarer Kleiderschrank planen lassen Stuttgart', keyword: 'Begehbarer Kleiderschrank' },
  { query: 'Was kostet ein Schrank nach Maß vom Schreiner?', keyword: 'Schrank nach Maß Kosten' },
  { query: 'Beste Schreinerei für Garderobe nach Maß bei Stuttgart', keyword: 'Garderobe nach Maß' },
];

export default function Citations() {
  const [dashboard, setDashboard] = useState(null);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkResult, setCheckResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [d, q] = await Promise.all([
        api.citationDashboard().catch(() => null),
        api.citationQueries().catch(() => []),
      ]);
      setDashboard(d);
      setQueries(q);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const runCheck = async (query, keyword) => {
    setChecking(true); setError(null); setCheckResult(null);
    try {
      const result = await api.citationCheck(query, keyword);
      setCheckResult(result);
      await loadData(); // Refresh dashboard
    } catch (e) { setError(e.message); }
    setChecking(false);
  };

  const runCustom = () => {
    if (customQuery.trim()) runCheck(customQuery, customQuery);
  };

  const runBulk = async () => {
    setChecking(true); setError(null);
    try {
      await api.citationBulk(DEFAULT_QUERIES.map(q => ({ query: q.query, keyword: q.keyword })));
      await loadData();
    } catch (e) { setError(e.message); }
    setChecking(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">AI Citation Monitor</h2>
          <p className="text-gray-500 text-sm mt-1">Share of AI Voice — Werden wir von ChatGPT, Perplexity und Gemini zitiert?</p>
        </div>
        <Btn variant="secondary" size="sm" onClick={runBulk} disabled={checking}>
          {checking ? <><Spinner /> Prüfe...</> : '🚀 Standard-Queries prüfen'}
        </Btn>
      </div>

      <ErrorBox message={error} onDismiss={() => setError(null)} />

      {/* Dashboard KPIs */}
      {dashboard && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <p className="text-gray-500 text-[10px] uppercase">Share of AI Voice</p>
              <p className={`text-4xl font-bold mt-2 ${
                dashboard.overallShareOfVoice >= 60 ? 'text-emerald-400' :
                dashboard.overallShareOfVoice >= 30 ? 'text-yellow-400' : 'text-red-400'
              }`}>{dashboard.overallShareOfVoice}%</p>
              <p className="text-gray-600 text-[10px] mt-1">aus {dashboard.totalChecks} Checks</p>
            </div>
          </Card>
          {ENGINES.map(eng => {
            const data = dashboard.byEngine?.find(e => e.engine === eng.id);
            return (
              <Card key={eng.id}>
                <div className="text-center">
                  <p className="text-gray-500 text-[10px] uppercase">{eng.icon} {eng.name}</p>
                  <p className="text-2xl font-bold mt-2" style={{
                    color: data?.shareOfVoice >= 50 ? '#34d399' : data?.shareOfVoice > 0 ? '#fbbf24' : '#6b7280'
                  }}>{data?.shareOfVoice ?? '—'}%</p>
                  <p className="text-gray-600 text-[10px] mt-1">{data?.checks || 0} Checks</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Custom Query */}
      <Card title="Eigene Abfrage testen">
        <div className="flex gap-3 items-end">
          <Input className="flex-1" label="Frage (so wie ein User ChatGPT fragen würde)"
            value={customQuery} onChange={setCustomQuery}
            placeholder='z.B. "Welcher Schreiner in Stuttgart baut begehbare Kleiderschränke?"'
            onKeyDown={e => e.key === 'Enter' && !checking && runCustom()} />
          <Btn onClick={runCustom} disabled={checking || !customQuery.trim()}>
            {checking ? <Spinner /> : '🔍 Prüfen'}
          </Btn>
        </div>
      </Card>

      {/* Check Result (single) */}
      {checkResult && (
        <Card title={`Ergebnis: "${checkResult.query}"`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold ${
              checkResult.shareOfVoice >= 60 ? 'bg-emerald-900/30 text-emerald-400' :
              checkResult.shareOfVoice >= 30 ? 'bg-yellow-900/30 text-yellow-400' :
              'bg-red-900/30 text-red-400'
            }`}>{checkResult.shareOfVoice}%</div>
            <div>
              <p className="text-white font-medium">
                In {checkResult.enginesMentioned} von {checkResult.enginesChecked} AI-Engines erwähnt
              </p>
              {checkResult.competitorFrequency?.length > 0 && (
                <p className="text-gray-500 text-xs mt-1">
                  Wettbewerber erwähnt: {checkResult.competitorFrequency.map(c => c.name).join(', ')}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {ENGINES.map(eng => {
              const r = checkResult.results?.[eng.id];
              if (!r) return null;
              return (
                <div key={eng.id} className={`rounded-xl p-4 ${
                  r.error ? 'bg-gray-800/30' :
                  r.mentioned ? 'bg-emerald-900/10 border border-emerald-800/30' :
                  'bg-red-900/10 border border-red-800/30'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium">{eng.icon} {eng.name}</span>
                    {r.error ? <Badge color="gray">Fehler</Badge> :
                     r.mentioned ? <Badge color="green">Erwähnt ✓</Badge> :
                     <Badge color="red">Nicht erwähnt</Badge>}
                  </div>
                  {r.mentionType && r.mentionType !== 'not_found' && (
                    <Badge color={r.mentionType === 'recommendation' ? 'green' : r.mentionType === 'direct_citation' ? 'blue' : 'yellow'}>
                      {r.mentionType === 'recommendation' ? 'Empfehlung' :
                       r.mentionType === 'direct_citation' ? 'Direkte Zitation' : 'Erwähnung'}
                    </Badge>
                  )}
                  {r.snippet && (
                    <p className="text-gray-400 text-xs mt-2 leading-relaxed">"{r.snippet.slice(0, 200)}"</p>
                  )}
                  {r.responsePreview && !r.mentioned && (
                    <details className="mt-2">
                      <summary className="text-gray-600 text-[10px] cursor-pointer">AI-Antwort ansehen</summary>
                      <p className="text-gray-500 text-[10px] mt-1 leading-relaxed">{r.responsePreview}</p>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Quick Queries */}
      <Card title="Standard-Queries" actions={
        <span className="text-gray-600 text-xs">{DEFAULT_QUERIES.length} Queries</span>
      }>
        <div className="space-y-1">
          {DEFAULT_QUERIES.map((q, i) => {
            const saved = queries.find(sq => sq.query === q.query);
            return (
              <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-800/20 transition-colors">
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">{q.query}</p>
                  <p className="text-gray-600 text-xs">{q.keyword}</p>
                </div>
                <div className="flex items-center gap-3">
                  {saved?.latestShareOfVoice != null && (
                    <span className={`text-sm font-bold ${
                      saved.latestShareOfVoice >= 60 ? 'text-emerald-400' :
                      saved.latestShareOfVoice >= 30 ? 'text-yellow-400' : 'text-red-400'
                    }`}>{saved.latestShareOfVoice}%</span>
                  )}
                  <Btn size="xs" variant="ghost" onClick={() => runCheck(q.query, q.keyword)} disabled={checking}>
                    {checking ? <Spinner /> : '▶️'}
                  </Btn>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* History */}
      {queries.length > 0 && (
        <Card title={`Monitoring-History (${queries.length} Queries)`}>
          <div className="space-y-2">
            {queries.map(q => (
              <div key={q.id} className="bg-gray-800/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300 text-sm">{q.query}</span>
                  <div className="flex items-center gap-2">
                    {q.latestShareOfVoice != null && (
                      <span className={`text-sm font-bold ${
                        q.latestShareOfVoice >= 60 ? 'text-emerald-400' :
                        q.latestShareOfVoice >= 30 ? 'text-yellow-400' : 'text-red-400'
                      }`}>{q.latestShareOfVoice}%</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-1">
                  {ENGINES.map(eng => {
                    const check = q.latestResults?.[eng.id];
                    return (
                      <span key={eng.id} className={`text-[10px] px-2 py-0.5 rounded ${
                        check?.mentioned ? 'bg-emerald-900/30 text-emerald-400' : 'bg-gray-800 text-gray-600'
                      }`}>
                        {eng.icon} {check?.mentioned ? '✓' : '✗'}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {!dashboard && queries.length === 0 && (
        <Card>
          <EmptyState icon="🔮" title="Noch keine Citation-Checks"
            desc='Klick "Standard-Queries prüfen" um zu sehen ob ChatGPT, Perplexity und Gemini Schreinerhelden kennen.' />
        </Card>
      )}
    </div>
  );
}
