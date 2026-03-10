import { useState, useCallback } from 'react';
import { Card, Btn, Input, Select, Badge, Spinner, EmptyState, ErrorBox, TabBar } from '../components/ui';
import * as api from '../services/api';
import { REGIONS } from '../config/constants';

export default function Keywords() {
  const [tab, setTab] = useState('research');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [volumeResults, setVolumeResults] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [longtails, setLongtails] = useState(null);

  const searchVolume = useCallback(async () => {
    if (!keyword.trim()) return;
    setLoading(true); setError(null);
    try {
      const data = await api.keywordVolume([keyword]);
      setVolumeResults(data.tasks?.[0]?.result || []);
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, [keyword]);

  const fetchSuggestions = useCallback(async () => {
    if (!keyword.trim()) return;
    setLoading(true); setError(null);
    try {
      const data = await api.keywordSuggestions(keyword);
      const items = data.tasks?.[0]?.result || [];
      setSuggestions(items);
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, [keyword]);

  const generateLongtails = useCallback(async () => {
    if (!keyword.trim()) return;
    setLoading(true); setError(null);
    try {
      const data = await api.aiLongtails(keyword);
      setLongtails(data.keywords || []);
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, [keyword]);

  const tabs = [
    { id: 'research', label: 'Keyword-Recherche' },
    { id: 'longtails', label: 'Longtails / AEO' },
    { id: 'gsc', label: 'GSC Live' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Keywords</h2>
        <p className="text-gray-500 text-sm mt-1">Recherche · Suchvolumen · Longtails · AEO-Phrasen</p>
      </div>

      <TabBar tabs={tabs} active={tab} onChange={setTab} />
      <ErrorBox message={error} onDismiss={() => setError(null)} />

      {/* ── Research Tab ── */}
      {tab === 'research' && (
        <>
          <Card title="Keyword Intelligence (DataForSEO)">
            <div className="flex gap-3 mb-4">
              <Input
                className="flex-1"
                value={keyword}
                onChange={setKeyword}
                placeholder="z.B. Einbauschrank nach Maß Stuttgart"
                onKeyDown={e => e.key === 'Enter' && searchVolume()}
              />
              <Btn onClick={searchVolume} disabled={loading}>
                {loading ? <Spinner /> : '🔍 Volume'}
              </Btn>
              <Btn variant="secondary" onClick={fetchSuggestions} disabled={loading}>
                💡 Vorschläge
              </Btn>
            </div>

            {volumeResults && (
              <div className="space-y-2">
                {volumeResults.map((r, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 px-4 bg-gray-800/30 rounded-lg">
                    <div>
                      <div className="text-white text-sm font-medium">{r.keyword}</div>
                      <div className="text-gray-500 text-xs">
                        CPC: €{r.cpc || '–'} · Competition: {r.competition || '–'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-400 font-bold">{r.search_volume?.toLocaleString('de') || '–'}</div>
                      <div className="text-gray-600 text-xs">monatl. Suchen</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {suggestions && (
              <div className="mt-4 pt-4 border-t border-gray-800/50">
                <h4 className="text-gray-400 text-xs uppercase mb-3">Verwandte Keywords ({suggestions.length})</h4>
                <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                  {suggestions.map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 px-3 bg-gray-800/20 rounded">
                      <span className="text-gray-300 text-xs">{s.keyword}</span>
                      <span className="text-blue-400 text-xs font-mono">{s.search_volume?.toLocaleString('de') || '–'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!volumeResults && !suggestions && (
              <EmptyState icon="🔍" title="Keyword eingeben" desc="Suchvolumen und verwandte Keywords aus DataForSEO" />
            )}
          </Card>
        </>
      )}

      {/* ── Longtails Tab ── */}
      {tab === 'longtails' && (
        <Card title="Longtail & AEO Keywords (GPT-4o)">
          <div className="flex gap-3 mb-4">
            <Input
              className="flex-1"
              value={keyword}
              onChange={setKeyword}
              placeholder="Seed-Keyword für Longtails"
              onKeyDown={e => e.key === 'Enter' && generateLongtails()}
            />
            <Btn onClick={generateLongtails} disabled={loading}>
              {loading ? <Spinner /> : '🤖 Longtails generieren'}
            </Btn>
          </div>

          {longtails && (
            <div className="space-y-2">
              {longtails.map((lt, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-300 text-sm flex-1">{lt.keyword}</span>
                  <div className="flex gap-2 ml-3">
                    <Badge color={lt.searchType === 'ai' ? 'purple' : lt.searchType === 'voice' ? 'blue' : 'gray'}>
                      {lt.searchType}
                    </Badge>
                    <Badge color={lt.intent === 'transactional' ? 'green' : lt.intent === 'local' ? 'yellow' : 'gray'}>
                      {lt.intent}
                    </Badge>
                    <Badge color={lt.difficulty === 'low' ? 'green' : lt.difficulty === 'medium' ? 'yellow' : 'red'}>
                      {lt.difficulty}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!longtails && (
            <EmptyState icon="🤖" title="Longtails generieren"
              desc="GPT-4o generiert SEO, Voice Search und AI-Suchphrasen" />
          )}
        </Card>
      )}

      {/* ── GSC Tab ── */}
      {tab === 'gsc' && (
        <GscPanel />
      )}
    </div>
  );
}

function GscPanel() {
  const [domain, setDomain] = useState('schreinerhelden.de');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch_ = async () => {
    setLoading(true);
    try { setData(await api.gscQueries(domain)); }
    catch {} finally { setLoading(false); }
  };

  return (
    <Card title="Google Search Console (Live)">
      <div className="flex gap-3 mb-4">
        <Select value={domain} onChange={setDomain} options={[
          { value: 'schreinerhelden.de', label: 'schreinerhelden.de' },
          { value: 'ihr-moebel-schreiner.de', label: 'ihr-moebel-schreiner.de' },
        ]} className="w-64" />
        <Btn onClick={fetch_} disabled={loading}>
          {loading ? <Spinner /> : '📊 Laden'}
        </Btn>
      </div>
      {data?.rows?.length > 0 ? (
        <div className="space-y-1 max-h-[500px] overflow-y-auto">
          <div className="grid grid-cols-5 text-xs text-gray-600 pb-2 border-b border-gray-800/50 font-medium sticky top-0 bg-gray-900">
            <span>Query</span><span className="text-right">Klicks</span><span className="text-right">Impressionen</span>
            <span className="text-right">CTR</span><span className="text-right">Position</span>
          </div>
          {data.rows.map((r, i) => (
            <div key={i} className="grid grid-cols-5 text-xs py-1.5 border-b border-gray-800/20">
              <span className="text-gray-300 truncate pr-2">{r.query}</span>
              <span className="text-white text-right font-mono">{r.clicks}</span>
              <span className="text-gray-400 text-right font-mono">{r.impressions.toLocaleString('de')}</span>
              <span className="text-gray-400 text-right font-mono">{r.ctr}%</span>
              <span className={`text-right font-mono ${r.position <= 3 ? 'text-emerald-400' : r.position <= 10 ? 'text-yellow-400' : 'text-gray-400'}`}>
                {r.position}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="📊" title="GSC Daten laden" desc="Klicks, Impressionen, CTR, Position der letzten 30 Tage" />
      )}
    </Card>
  );
}
