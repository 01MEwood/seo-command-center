import { useState } from 'react';
import { Card, Btn, Input, Select, Spinner, EmptyState, ErrorBox, Badge } from '../components/ui';
import * as api from '../services/api';
import { REGIONS } from '../config/constants';

export default function Diagnose() {
  const [keyword, setKeyword] = useState('');
  const [region, setRegion] = useState('Stuttgart');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const run = async () => {
    if (!keyword.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const data = await api.aiCompetitorDiagnosis(keyword, region);
      setResult(data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const priorityColors = { high: 'red', medium: 'yellow', low: 'green' };
  const regionOptions = REGIONS.map(r => ({ value: r.name, label: r.name }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Diagnose</h2>
        <p className="text-gray-500 text-sm mt-1">Wettbewerber-Analyse mit echten SERP- und Backlink-Daten (DataForSEO + GPT-4o)</p>
      </div>

      {/* Input */}
      <Card title="Keyword + Region analysieren">
        <div className="grid grid-cols-12 gap-4 items-end mb-4">
          <Input className="col-span-5" label="Keyword" value={keyword} onChange={setKeyword}
            placeholder="z.B. Einbauschrank nach Maß" onKeyDown={e => e.key === 'Enter' && !loading && run()} />
          <Select className="col-span-3" label="Region" value={region} onChange={setRegion} options={regionOptions} />
          <div className="col-span-4">
            <Btn onClick={run} disabled={loading || !keyword.trim()} className="w-full justify-center">
              {loading ? <><Spinner /> Analysiere...</> : '⚔️ Diagnose starten'}
            </Btn>
          </div>
        </div>
        {loading && (
          <div className="bg-blue-900/10 border border-blue-800/30 rounded-lg p-4 text-center">
            <Spinner size="md" />
            <p className="text-blue-400 text-sm mt-3">SERP scannen → Backlinks abrufen → GPT-4o Diagnose...</p>
            <p className="text-gray-600 text-xs mt-1">Dauert ca. 20–40 Sekunden</p>
          </div>
        )}
      </Card>

      <ErrorBox message={error} onDismiss={() => setError(null)} />

      {result && (
        <>
          {/* Summary */}
          <Card>
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold ${
                result.ourPosition && result.ourPosition <= 3 ? 'bg-emerald-900/30 text-emerald-400' :
                result.ourPosition && result.ourPosition <= 10 ? 'bg-yellow-900/30 text-yellow-400' :
                'bg-red-900/30 text-red-400'
              }`}>
                {result.ourPosition || '—'}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">
                  {result.keyword} — {result.region}
                </h3>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">{result.summary}</p>
                {result.estimatedTimeToTop10 && (
                  <p className="text-gray-600 text-xs mt-2">
                    Geschätzte Zeit bis TOP 10: <span className="text-blue-400">{result.estimatedTimeToTop10}</span>
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* SERP Results (echte Daten) */}
          {result.rawSerp && (
            <Card title="TOP 10 SERP (Live-Daten)">
              <div className="space-y-1">
                {result.rawSerp.map((r, i) => (
                  <div key={i} className={`flex items-center gap-3 py-2 px-3 rounded-lg ${
                    r.isOurs ? 'bg-emerald-900/15 border border-emerald-800/30' : 'hover:bg-gray-800/20'
                  } transition-colors`}>
                    <span className={`w-6 text-center font-bold text-sm ${
                      r.isOurs ? 'text-emerald-400' : r.position <= 3 ? 'text-yellow-400' : 'text-gray-600'
                    }`}>{r.position}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm truncate ${r.isOurs ? 'text-emerald-400 font-medium' : 'text-white'}`}>{r.title}</div>
                      <div className="text-gray-600 text-xs truncate">{r.domain}</div>
                    </div>
                    {r.isOurs && <Badge color="green">UNSERE</Badge>}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Was machen die besser? */}
          {result.whatTheyDoBetter?.length > 0 && (
            <Card title="⚠️ Was die TOP 3 besser machen">
              <div className="space-y-2">
                {result.whatTheyDoBetter.map((point, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 px-3 bg-red-900/10 border border-red-800/20 rounded-lg">
                    <span className="text-red-400 mt-0.5">✗</span>
                    <span className="text-gray-300 text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Wo sind wir stark? */}
          {result.whereWeAreStrong?.length > 0 && (
            <Card title="✅ Unsere Stärken">
              <div className="space-y-2">
                {result.whereWeAreStrong.map((point, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 px-3 bg-emerald-900/10 border border-emerald-800/20 rounded-lg">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span className="text-gray-300 text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Content Gaps */}
          {result.contentGaps?.length > 0 && (
            <Card title="📝 Content Gaps (Themen die uns fehlen)">
              <div className="flex flex-wrap gap-2">
                {result.contentGaps.map((gap, i) => (
                  <Badge key={i} color="purple">{gap}</Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Action Plan */}
          {result.actionPlan?.length > 0 && (
            <Card title="🎯 Maßnahmenplan">
              <div className="space-y-2">
                {result.actionPlan.map((action, i) => (
                  <div key={i} className="border-l-2 pl-4 py-2" style={{
                    borderColor: action.priority === 'high' ? '#ef4444' : action.priority === 'medium' ? '#eab308' : '#22c55e'
                  }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge color={priorityColors[action.priority] || 'gray'}>{action.priority}</Badge>
                      <span className="text-white text-sm font-medium">{action.action}</span>
                    </div>
                    <div className="text-gray-500 text-xs">
                      Impact: {action.impact} · Aufwand: {action.effort}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Competitor Details */}
          {result.competitors?.length > 0 && (
            <Card title="Wettbewerber im Detail">
              <div className="space-y-3">
                {result.competitors.map((comp, i) => (
                  <div key={i} className="bg-gray-800/30 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-gray-600 font-bold text-sm w-6 text-center">{comp.position}</span>
                      <span className="text-white text-sm font-medium">{comp.domain}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-emerald-400/70 block mb-1">Stärken:</span>
                        {comp.strengths?.map((s, j) => (
                          <div key={j} className="text-gray-400 py-0.5">+ {s}</div>
                        ))}
                      </div>
                      <div>
                        <span className="text-red-400/70 block mb-1">Schwächen:</span>
                        {comp.weaknesses?.map((w, j) => (
                          <div key={j} className="text-gray-400 py-0.5">− {w}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {!result && !loading && (
        <Card>
          <EmptyState icon="⚔️" title="Wettbewerber-Diagnose"
            desc="Echte SERP- und Backlink-Daten aus DataForSEO + GPT-4o Analyse: Was machen die besser? Wo sind wir stark? Was tun?" />
        </Card>
      )}
    </div>
  );
}
