import { useState, useEffect } from 'react';
import { Card, StatCard, Badge, Spinner, EmptyState } from '../components/ui';
import * as api from '../services/api';
import { REGIONS, DOMAINS } from '../config/constants';

export default function Dashboard({ onNavigate }) {
  const [health, setHealth] = useState(null);
  const [pipelineRuns, setPipelineRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [h, runs] = await Promise.all([
          api.health().catch(() => null),
          api.pipelineHistory().catch(() => []),
        ]);
        setHealth(h);
        setPipelineRuns(runs);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const completedRuns = pipelineRuns.filter(r => r.status === 'complete');
  const avgPosition = completedRuns.length > 0
    ? (completedRuns.filter(r => r.ourPosition).reduce((sum, r) => sum + r.ourPosition, 0) / completedRuns.filter(r => r.ourPosition).length).toFixed(1)
    : '–';
  const foundInTop10 = completedRuns.filter(r => r.ourPosition && r.ourPosition <= 10).length;

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Überblick über Analysen und Rankings</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Analysen" value={completedRuns.length} sub="Pipeline Runs" />
        <StatCard label="Ø Position" value={avgPosition} sub="unsere Domains" />
        <StatCard label="Top 10" value={foundInTop10} sub="Keywords gefunden" />
        <StatCard label="Regionen" value={REGIONS.length} sub="im Einzugsgebiet" />
      </div>

      {/* System Status */}
      <Card title="System">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${health?.status === 'ok' ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <div>
              <div className="text-white text-xs font-medium">Backend</div>
              <div className="text-gray-600 text-[10px]">{health?.version || 'offline'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${health?.database === 'connected' ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <div>
              <div className="text-white text-xs font-medium">Datenbank</div>
              <div className="text-gray-600 text-[10px]">{health?.database || 'offline'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <div>
              <div className="text-white text-xs font-medium">Domains</div>
              <div className="text-gray-600 text-[10px]">{Object.values(DOMAINS).map(d => d.url).join(', ')}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Pipeline Runs */}
      <Card title="Letzte Analysen" actions={
        completedRuns.length > 0 && (
          <button onClick={() => onNavigate('analyse')} className="text-blue-400 hover:text-blue-300 text-xs">
            Alle anzeigen →
          </button>
        )
      }>
        {pipelineRuns.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="Noch keine Analysen"
            desc="Starte deine erste Keyword+Region Analyse"
            action={
              <button onClick={() => onNavigate('analyse')} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">
                → Erste Analyse starten
              </button>
            }
          />
        ) : (
          <div className="space-y-1">
            {pipelineRuns.slice(0, 8).map(run => (
              <div key={run.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    run.status === 'complete' ? 'bg-emerald-400' : run.status === 'running' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
                  }`} />
                  <div>
                    <span className="text-white text-sm">{run.keyword}</span>
                    <span className="text-gray-600 text-xs ml-2">{run.region}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {run.searchVolume && (
                    <span className="text-gray-500 text-xs">{run.searchVolume.toLocaleString('de')} SV</span>
                  )}
                  {run.ourPosition ? (
                    <Badge color={run.ourPosition <= 3 ? 'green' : run.ourPosition <= 10 ? 'yellow' : 'red'}>
                      Pos. {run.ourPosition}
                    </Badge>
                  ) : run.status === 'complete' ? (
                    <Badge color="gray">nicht gefunden</Badge>
                  ) : null}
                  <span className="text-gray-700 text-[10px]">
                    {new Date(run.createdAt).toLocaleDateString('de', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
