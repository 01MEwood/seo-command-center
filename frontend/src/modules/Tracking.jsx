import { useState, useEffect, useCallback } from 'react';
import { Card, Btn, Badge, Spinner, EmptyState, ErrorBox, Input, Select } from '../components/ui';
import * as api from '../services/api';

export default function Tracking() {
  const [tracked, setTracked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [newKeyword, setNewKeyword] = useState('');
  const [newRegion, setNewRegion] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await api.trackingList();
      setTracked(data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const refresh = async () => {
    setRefreshing(true); setError(null);
    try {
      await api.trackingRefresh();
      await load();
    } catch (e) { setError(e.message); }
    setRefreshing(false);
  };

  const addKeyword = async () => {
    if (!newKeyword.trim()) return;
    try {
      await api.trackingAdd(newKeyword, 'sh', newRegion);
      setNewKeyword(''); setNewRegion(''); setShowAdd(false);
      await load();
    } catch (e) { setError(e.message); }
  };

  const viewHistory = async (id) => {
    try {
      const data = await api.trackingHistory(id);
      setSelectedHistory({ id, snapshots: data });
    } catch (e) { setError(e.message); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Tracking</h2>
          <p className="text-gray-500 text-sm mt-1">Position-Monitoring über Zeit · {tracked.length} Keywords</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="secondary" size="sm" onClick={() => setShowAdd(!showAdd)}>+ Keyword</Btn>
          <Btn size="sm" onClick={refresh} disabled={refreshing}>
            {refreshing ? <><Spinner /> Aktualisiere...</> : '🔄 Alle prüfen'}
          </Btn>
        </div>
      </div>

      <ErrorBox message={error} onDismiss={() => setError(null)} />

      {/* Add keyword form */}
      {showAdd && (
        <Card>
          <div className="flex gap-3 items-end">
            <Input className="flex-1" label="Keyword" value={newKeyword} onChange={setNewKeyword}
              placeholder="z.B. Einbauschrank nach Maß Stuttgart" />
            <Input className="w-40" label="Region (optional)" value={newRegion} onChange={setNewRegion}
              placeholder="z.B. Stuttgart" />
            <Btn onClick={addKeyword}>Hinzufügen</Btn>
          </div>
        </Card>
      )}

      {/* Tracked Keywords */}
      {tracked.length === 0 ? (
        <Card>
          <EmptyState icon="📈" title="Noch keine Keywords im Tracking"
            desc="Füge Keywords hinzu oder starte eine Analyse und klicke 'Tracking starten'" />
        </Card>
      ) : (
        <Card noPad>
          <div className="divide-y divide-gray-800/30">
            {tracked.map(tk => {
              const latest = tk.snapshots?.[0];
              const previous = tk.snapshots?.[1];
              const change = latest?.position && previous?.position
                ? previous.position - latest.position
                : null;

              return (
                <div key={tk.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-800/15 transition-colors">
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{tk.keyword}</div>
                    <div className="text-gray-600 text-xs">{tk.domain?.name} · {tk.region || 'global'}</div>
                  </div>

                  {/* Mini Sparkline */}
                  <div className="w-24 h-6 mx-4">
                    <MiniChart snapshots={tk.snapshots || []} />
                  </div>

                  {/* Current Position */}
                  <div className="w-20 text-right">
                    {latest?.position ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={`font-bold text-sm ${
                          latest.position <= 3 ? 'text-emerald-400' :
                          latest.position <= 10 ? 'text-yellow-400' : 'text-gray-400'
                        }`}>
                          {latest.position}
                        </span>
                        {change !== null && change !== 0 && (
                          <span className={`text-xs ${change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {change > 0 ? `↑${change}` : `↓${Math.abs(change)}`}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-600 text-xs">–</span>
                    )}
                  </div>

                  {/* Actions */}
                  <button onClick={() => viewHistory(tk.id)}
                    className="text-gray-600 hover:text-blue-400 text-xs ml-4 transition-colors">
                    Details
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* History Detail */}
      {selectedHistory && (
        <Card title="Positionsverlauf" actions={
          <Btn variant="ghost" size="xs" onClick={() => setSelectedHistory(null)}>✕</Btn>
        }>
          {selectedHistory.snapshots.length === 0 ? (
            <EmptyState icon="📉" title="Noch keine Daten" desc="Position wird beim nächsten Refresh erfasst" />
          ) : (
            <div className="space-y-1">
              {selectedHistory.snapshots.map((s, i) => (
                <div key={s.id || i} className="grid grid-cols-3 text-xs py-1.5 border-b border-gray-800/20">
                  <span className="text-gray-400">
                    {new Date(s.date).toLocaleDateString('de', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className={`font-mono ${
                    s.position && s.position <= 10 ? 'text-emerald-400' : 'text-gray-400'
                  }`}>
                    {s.position || 'nicht gefunden'}
                  </span>
                  <span className="text-gray-600 truncate">{s.url || '–'}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

// Mini SVG chart for position over time
function MiniChart({ snapshots }) {
  if (!snapshots || snapshots.length < 2) return null;

  const positions = [...snapshots].reverse().map(s => s.position || 50).slice(-14);
  const max = Math.max(...positions, 20);
  const min = Math.min(...positions, 1);
  const range = max - min || 1;
  const w = 96;
  const h = 24;

  const points = positions.map((p, i) => {
    const x = (i / (positions.length - 1)) * w;
    const y = h - (((p - min) / range) * (h - 4) + 2); // Inverted: lower position (better) = higher on chart
    return `${x},${y}`;
  }).join(' ');

  const color = positions[positions.length - 1] <= 10 ? '#34d399' : '#6b7280';

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  );
}
