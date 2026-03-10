import { useState } from 'react';
import { Card, Btn, Input, Select, Spinner, EmptyState, ErrorBox, TabBar, Badge } from '../components/ui';
import * as api from '../services/api';
import { REGIONS, SH_SERVICES } from '../config/constants';

const CHANNELS = [
  { id: 'gbp', name: 'Google Business Profile', icon: '📌' },
  { id: 'instagram', name: 'Instagram / Facebook', icon: '📸' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌' },
  { id: 'blog', name: 'Blog-Artikel', icon: '📝' },
];

export default function Content() {
  const [tab, setTab] = useState('landingpage');
  const tabs = [
    { id: 'landingpage', label: 'Landing Page' },
    { id: 'social', label: 'Social Multiplier' },
    { id: 'article', label: 'Artikel' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Content</h2>
        <p className="text-gray-500 text-sm mt-1">Landing Page bauen → in alle Kanäle multiplizieren</p>
      </div>
      <TabBar tabs={tabs} active={tab} onChange={setTab} />
      {tab === 'landingpage' && <LandingPageGenerator />}
      {tab === 'social' && <SocialMultiplier />}
      {tab === 'article' && <ArticleGenerator />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// TAB 1: HTML LANDING PAGE
// ═══════════════════════════════════════════════════════
function LandingPageGenerator() {
  const [keyword, setKeyword] = useState('');
  const [region, setRegion] = useState('Stuttgart');
  const [service, setService] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const generate = async () => {
    if (!keyword.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try { setResult(await api.aiLandingPage(keyword, region, service || keyword)); }
    catch (e) { setError(e.message); }
    setLoading(false);
  };

  const copyHtml = () => { if (result?.html) navigator.clipboard.writeText(result.html); };
  const downloadHtml = () => {
    if (!result?.html) return;
    const blob = new Blob([result.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${keyword.replace(/\s+/g, '-').toLowerCase()}-${region.toLowerCase()}.html`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Card title="HTML Landing Page generieren">
        <p className="text-gray-500 text-xs mb-4">
          Komplette HTML-Seite im Schreinerhelden-Design. Elementor HTML-Widget ready.
          Inkl. Schema.org, Meta-Daten, Hero, Content (1.400–1.800 Wörter), FAQ, CTA.
          Danach → Tab "Social Multiplier" um den Content in alle Kanäle zu verteilen.
        </p>
        <div className="grid grid-cols-12 gap-4 items-end mb-4">
          <Input className="col-span-4" label="Keyword" value={keyword} onChange={setKeyword}
            placeholder="z.B. Einbauschrank nach Maß" onKeyDown={e => e.key === 'Enter' && !loading && generate()} />
          <Select className="col-span-3" label="Region" value={region} onChange={setRegion}
            options={REGIONS.map(r => ({ value: r.name, label: r.name }))} />
          <Select className="col-span-3" label="Service" value={service} onChange={setService}
            options={[{ value: '', label: '— Aus Keyword —' }, ...SH_SERVICES.map(s => ({ value: s, label: s }))]} />
          <div className="col-span-2">
            <Btn onClick={generate} disabled={loading || !keyword.trim()} className="w-full justify-center">
              {loading ? <><Spinner /> Läuft...</> : '🏗️ LP bauen'}
            </Btn>
          </div>
        </div>
        {loading && (
          <div className="bg-blue-900/10 border border-blue-800/30 rounded-lg p-4 text-center">
            <Spinner size="md" />
            <p className="text-blue-400 text-sm mt-3">SERP → Longtails → HTML bauen...</p>
            <p className="text-gray-600 text-xs mt-1">ca. 30–60 Sekunden</p>
          </div>
        )}
      </Card>

      <ErrorBox message={error} onDismiss={() => setError(null)} />

      {result && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Card className="text-center">
              <p className="text-gray-500 text-[10px] uppercase">Wörter</p>
              <p className={`text-2xl font-bold mt-1 ${result.wordCount >= 1400 ? 'text-emerald-400' : result.wordCount >= 1000 ? 'text-yellow-400' : 'text-red-400'}`}>
                {result.wordCount?.toLocaleString('de')}</p>
              <p className="text-gray-600 text-[10px]">Ziel: 1.400–1.800</p>
            </Card>
            <Card className="text-center">
              <p className="text-gray-500 text-[10px] uppercase">Keyword</p>
              <p className="text-white text-sm font-medium mt-2">{result.keyword}</p>
            </Card>
            <Card className="text-center">
              <p className="text-gray-500 text-[10px] uppercase">Region</p>
              <p className="text-white text-sm font-medium mt-2">{result.region || '—'}</p>
            </Card>
          </div>

          <Card>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Btn size="sm" onClick={copyHtml}>📋 HTML kopieren</Btn>
                <Btn size="sm" variant="secondary" onClick={downloadHtml}>💾 Download</Btn>
                <Btn size="sm" variant={showPreview ? 'primary' : 'ghost'} onClick={() => setShowPreview(!showPreview)}>
                  👁️ {showPreview ? 'Vorschau aus' : 'Vorschau'}
                </Btn>
              </div>
              <Badge color={result.wordCount >= 1400 ? 'green' : 'yellow'}>
                {result.wordCount >= 1400 ? '✓ Mindestlänge' : '⚠ Unter 1.400'}
              </Badge>
            </div>
          </Card>

          {showPreview && (
            <Card title="Live-Vorschau" noPad>
              <div className="px-5 pb-5">
                <iframe srcDoc={result.html} className="w-full border border-gray-700 rounded-lg bg-white"
                  style={{ minHeight: '800px' }} sandbox="allow-same-origin" title="LP Preview" />
              </div>
            </Card>
          )}

          <Card title="HTML-Code" actions={<Btn size="xs" variant="ghost" onClick={copyHtml}>📋</Btn>}>
            <pre className="text-gray-400 text-xs bg-gray-800/40 rounded-lg p-4 max-h-[400px] overflow-auto font-mono leading-relaxed whitespace-pre-wrap break-all">{result.html}</pre>
          </Card>
        </>
      )}

      {!result && !loading && (
        <Card><EmptyState icon="🏗️" title="HTML Landing Page Generator"
          desc="Keyword + Region → komplette HTML-Seite. Danach Social Multiplier nutzen." /></Card>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════
// TAB 2: SOCIAL MULTIPLIER
// ═══════════════════════════════════════════════════════
function SocialMultiplier() {
  const [keyword, setKeyword] = useState('');
  const [region, setRegion] = useState('Stuttgart');
  const [lpSummary, setLpSummary] = useState('');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(null); // null | 'all' | channel id
  const [error, setError] = useState(null);

  const generateAll = async () => {
    if (!keyword.trim()) return;
    setLoading('all'); setError(null); setResults({});
    try {
      const data = await api.aiSocialBulk(keyword, region, lpSummary);
      setResults(data.channels || {});
    } catch (e) { setError(e.message); }
    setLoading(null);
  };

  const generateOne = async (channelId) => {
    if (!keyword.trim()) return;
    setLoading(channelId); setError(null);
    try {
      const data = await api.aiSocial(channelId, keyword, region, lpSummary);
      setResults(prev => ({ ...prev, [channelId]: data.content }));
    } catch (e) { setError(e.message); }
    setLoading(null);
  };

  const copyContent = (content) => {
    const text = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <Card title="LP → Social Content multiplizieren">
        <p className="text-gray-500 text-xs mb-4">
          Erstelle zuerst eine Landing Page (Tab 1), dann kopiere den Kern-Content hierher.
          Oder gib direkt ein Keyword ein — GPT-4o erstellt Content für alle Kanäle.
        </p>
        <div className="grid grid-cols-12 gap-4 items-end mb-3">
          <Input className="col-span-5" label="Keyword / Thema" value={keyword} onChange={setKeyword}
            placeholder="z.B. Dachschrägenschrank Stuttgart" />
          <Select className="col-span-3" label="Region" value={region} onChange={setRegion}
            options={REGIONS.map(r => ({ value: r.name, label: r.name }))} />
          <div className="col-span-4">
            <Btn onClick={generateAll} disabled={!!loading || !keyword.trim()} className="w-full justify-center">
              {loading === 'all' ? <><Spinner /> Alle generieren...</> : '🚀 Alle Kanäle generieren'}
            </Btn>
          </div>
        </div>
        <div>
          <label className="text-gray-500 text-xs block mb-1.5">LP-Content (optional — für bessere Ergebnisse)</label>
          <textarea value={lpSummary} onChange={e => setLpSummary(e.target.value)}
            placeholder="Kopiere hier den Text deiner Landing Page rein (oder lass es leer für rein keyword-basierten Content)"
            className="w-full bg-gray-800/80 border border-gray-700/60 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors h-24 resize-y" />
        </div>
      </Card>

      <ErrorBox message={error} onDismiss={() => setError(null)} />

      {loading === 'all' && (
        <Card>
          <div className="text-center py-6">
            <Spinner size="md" />
            <p className="text-blue-400 text-sm mt-3">Generiere Content für {CHANNELS.length} Kanäle...</p>
            <p className="text-gray-600 text-xs mt-1">ca. 30–60 Sekunden</p>
          </div>
        </Card>
      )}

      {/* Channel Cards */}
      <div className="space-y-4">
        {CHANNELS.map(ch => {
          const content = results[ch.id];
          const isLoading = loading === ch.id;
          const hasError = content?.error;

          return (
            <Card key={ch.id} title={`${ch.icon} ${ch.name}`} actions={
              <div className="flex gap-2">
                {content && !hasError && (
                  <Btn size="xs" variant="ghost" onClick={() => copyContent(content)}>📋</Btn>
                )}
                <Btn size="xs" variant="secondary" onClick={() => generateOne(ch.id)}
                  disabled={!!loading || !keyword.trim()}>
                  {isLoading ? <Spinner /> : content ? '🔄' : '▶️'}
                </Btn>
              </div>
            }>
              {hasError ? (
                <p className="text-red-400 text-sm">{content.error}</p>
              ) : content ? (
                <SocialContentDisplay channel={ch.id} content={content} />
              ) : (
                <p className="text-gray-600 text-xs">Noch nicht generiert</p>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}

function SocialContentDisplay({ channel, content }) {
  if (typeof content === 'string') {
    // GBP, Blog (plain text / markdown)
    return (
      <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed max-h-[400px] overflow-y-auto">{content}</pre>
    );
  }

  // Instagram / Pinterest (JSON)
  if (channel === 'instagram') {
    return (
      <div className="space-y-3">
        <div>
          <span className="text-gray-500 text-xs block mb-1">Caption</span>
          <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">{content.caption}</pre>
        </div>
        {content.hashtags && (
          <div>
            <span className="text-gray-500 text-xs block mb-1">Hashtags</span>
            <p className="text-blue-400 text-xs">{content.hashtags}</p>
          </div>
        )}
        {content.imageIdea && (
          <div>
            <span className="text-gray-500 text-xs block mb-1">📷 Bild-Idee</span>
            <p className="text-gray-400 text-sm">{content.imageIdea}</p>
          </div>
        )}
        {content.bestTime && (
          <div>
            <span className="text-gray-500 text-xs block mb-1">⏰ Beste Posting-Zeit</span>
            <p className="text-gray-400 text-sm">{content.bestTime}</p>
          </div>
        )}
      </div>
    );
  }

  if (channel === 'pinterest') {
    return (
      <div className="space-y-3">
        <div>
          <span className="text-gray-500 text-xs block mb-1">Pin-Titel</span>
          <p className="text-white text-sm font-medium">{content.title}</p>
        </div>
        <div>
          <span className="text-gray-500 text-xs block mb-1">Beschreibung</span>
          <p className="text-gray-300 text-sm">{content.description}</p>
        </div>
        {content.board && (
          <div>
            <span className="text-gray-500 text-xs block mb-1">Board</span>
            <Badge color="purple">{content.board}</Badge>
          </div>
        )}
        {content.imageIdea && (
          <div>
            <span className="text-gray-500 text-xs block mb-1">📷 Bild-Idee</span>
            <p className="text-gray-400 text-sm">{content.imageIdea}</p>
          </div>
        )}
        {content.link && (
          <div>
            <span className="text-gray-500 text-xs block mb-1">Link</span>
            <p className="text-blue-400 text-xs">{content.link}</p>
          </div>
        )}
      </div>
    );
  }

  // Fallback: JSON display
  return <pre className="text-gray-400 text-xs font-mono whitespace-pre-wrap">{JSON.stringify(content, null, 2)}</pre>;
}

// ═══════════════════════════════════════════════════════
// TAB 3: MARKDOWN ARTIKEL
// ═══════════════════════════════════════════════════════
function ArticleGenerator() {
  const [keyword, setKeyword] = useState('');
  const [region, setRegion] = useState('Stuttgart');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const generate = async () => {
    if (!keyword.trim()) return;
    setLoading(true); setError(null);
    try {
      const result = await api.aiContent(keyword, `Region: ${region}. Service-Kontext: ${SH_SERVICES.join(', ')}`);
      setContent(result.content || '');
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <>
      <Card title="Markdown Artikel generieren">
        <div className="grid grid-cols-12 gap-4 items-end mb-4">
          <Input className="col-span-5" label="Keyword / Thema" value={keyword} onChange={setKeyword}
            placeholder="z.B. Begehbarer Kleiderschrank Kosten" />
          <Select className="col-span-3" label="Region" value={region} onChange={setRegion}
            options={REGIONS.map(r => ({ value: r.name, label: r.name }))} />
          <div className="col-span-4">
            <Btn onClick={generate} disabled={loading || !keyword.trim()} className="w-full justify-center">
              {loading ? <><Spinner /> Generiere...</> : '✍️ Artikel erstellen'}
            </Btn>
          </div>
        </div>
      </Card>
      <ErrorBox message={error} onDismiss={() => setError(null)} />
      {content && (
        <Card title="Generierter Artikel" actions={
          <div className="flex gap-2">
            <Btn size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(content)}>📋</Btn>
            <Btn size="sm" variant="secondary" onClick={() => {
              const blob = new Blob([content], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = `${keyword.replace(/\s+/g, '-').toLowerCase()}.md`; a.click();
            }}>💾 .md</Btn>
          </div>
        }>
          <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed bg-gray-800/30 rounded-lg p-5 max-h-[700px] overflow-y-auto">{content}</pre>
        </Card>
      )}
    </>
  );
}
