import { useState, useEffect, useCallback } from 'react';
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
    { id: 'schema', label: '🏷️ Schema.org' },
    { id: 'prompts', label: '⚙️ Prompt Editor' },
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
      {tab === 'schema' && <SchemaGenerator />}
      {tab === 'prompts' && <PromptEditor />}
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

// ═══════════════════════════════════════════════════════
// TAB 4: SCHEMA.ORG GENERATOR
// ═══════════════════════════════════════════════════════

const SCHEMA_TYPES = [
  { id: 'localBusiness', label: 'LocalBusiness', icon: '🏢', desc: 'Firmen-Stammdaten für Google Knowledge Panel' },
  { id: 'service', label: 'Service', icon: '🔧', desc: 'Dienstleistung mit Keyword + Region' },
  { id: 'faq', label: 'FAQPage', icon: '❓', desc: 'FAQ-Schema für Featured Snippets (GPT-generiert)' },
  { id: 'breadcrumb', label: 'BreadcrumbList', icon: '🔗', desc: 'Breadcrumb-Navigation für Google' },
  { id: 'article', label: 'Article', icon: '📰', desc: 'Blog-Artikel / Ratgeber Markup' },
  { id: 'product', label: 'Product', icon: '📦', desc: 'Produkt mit Preisrahmen (AggregateOffer)' },
];

function SchemaGenerator() {
  const [keyword, setKeyword] = useState('');
  const [region, setRegion] = useState('Stuttgart');
  const [domain, setDomain] = useState('sh');
  const [selectedTypes, setSelectedTypes] = useState(['localBusiness', 'service', 'faq', 'breadcrumb']);
  const [articleTitle, setArticleTitle] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [validating, setValidating] = useState(null);
  const [validationResults, setValidationResults] = useState({});
  const [expandedSchema, setExpandedSchema] = useState(null);
  const [editingFaq, setEditingFaq] = useState(null);

  const toggleType = (id) => {
    setSelectedTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const generate = async () => {
    if (!keyword.trim() || selectedTypes.length === 0) return;
    setLoading(true); setError(null); setResult(null); setValidationResults({});
    try {
      const data = await api.schemaGenerate(keyword, region, domain, selectedTypes, {
        articleTitle: articleTitle || undefined,
        priceMin: priceMin ? Number(priceMin) : undefined,
        priceMax: priceMax ? Number(priceMax) : undefined,
      });
      setResult(data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const validate = async (key, schema) => {
    setValidating(key);
    try {
      const res = await api.schemaValidate(schema);
      setValidationResults(prev => ({ ...prev, [key]: res }));
    } catch (e) {
      setValidationResults(prev => ({ ...prev, [key]: { valid: false, errors: [e.message], warnings: [] } }));
    }
    setValidating(null);
  };

  const copyJson = (obj) => navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
  const copyHtml = () => { if (result?.html) navigator.clipboard.writeText(result.html); };

  const showProductFields = selectedTypes.includes('product');
  const showArticleFields = selectedTypes.includes('article');

  return (
    <>
      <Card title="Schema.org Generator">
        <p className="text-gray-500 text-xs mb-4">
          Generiert valides JSON-LD Schema.org Markup für deine Seiten.
          LocalBusiness + Service + FAQ = Basis-Setup für jede Landing Page.
          Alles deterministic — kein GPT-Raten. FAQ-Fragen werden optional per GPT erzeugt.
        </p>

        <div className="grid grid-cols-12 gap-4 items-end mb-4">
          <Input className="col-span-4" label="Keyword" value={keyword} onChange={setKeyword}
            placeholder="z.B. Einbauschrank nach Maß" onKeyDown={e => e.key === 'Enter' && !loading && generate()} />
          <Select className="col-span-3" label="Region" value={region} onChange={setRegion}
            options={REGIONS.map(r => ({ value: r.name, label: r.name }))} />
          <Select className="col-span-2" label="Domain" value={domain} onChange={setDomain}
            options={[{ value: 'sh', label: 'SH' }, { value: 'ims', label: 'IMS' }]} />
          <div className="col-span-3">
            <Btn onClick={generate} disabled={loading || !keyword.trim() || selectedTypes.length === 0} className="w-full justify-center">
              {loading ? <><Spinner /> Generiere...</> : `🏷️ ${selectedTypes.length} Schemas`}
            </Btn>
          </div>
        </div>

        {/* Schema Type Selection */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {SCHEMA_TYPES.map(st => {
            const selected = selectedTypes.includes(st.id);
            return (
              <button key={st.id} onClick={() => toggleType(st.id)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  selected
                    ? 'border-blue-500/50 bg-blue-900/15'
                    : 'border-gray-800/40 bg-gray-800/10 hover:border-gray-700/60'
                }`}>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{st.icon}</span>
                  <span className={`text-xs font-medium ${selected ? 'text-blue-400' : 'text-gray-400'}`}>{st.label}</span>
                  {selected && <span className="text-blue-400 text-[10px] ml-auto">✓</span>}
                </div>
                <p className="text-gray-600 text-[10px] mt-1">{st.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Conditional extra fields */}
        {(showArticleFields || showProductFields) && (
          <div className="grid grid-cols-12 gap-4 items-end border-t border-gray-800/30 pt-4">
            {showArticleFields && (
              <Input className="col-span-6" label="Artikel-Titel (optional)" value={articleTitle}
                onChange={setArticleTitle} placeholder="z.B. Was kostet ein Einbauschrank nach Maß?" />
            )}
            {showProductFields && (
              <>
                <Input className="col-span-3" label="Preis ab (€)" value={priceMin}
                  onChange={setPriceMin} placeholder="z.B. 2500" />
                <Input className="col-span-3" label="Preis bis (€)" value={priceMax}
                  onChange={setPriceMax} placeholder="z.B. 15000" />
              </>
            )}
          </div>
        )}
      </Card>

      <ErrorBox message={error} onDismiss={() => setError(null)} />

      {loading && (
        <Card>
          <div className="text-center py-6">
            <Spinner size="md" />
            <p className="text-blue-400 text-sm mt-3">Schema.org Markup generieren...</p>
            {selectedTypes.includes('faq') && <p className="text-gray-600 text-xs mt-1">FAQ-Fragen werden per GPT erzeugt...</p>}
          </div>
        </Card>
      )}

      {/* Results */}
      {result && (
        <>
          {/* Summary Bar */}
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge color="green">{result.schemaCount} Schemas generiert</Badge>
                <span className="text-gray-500 text-xs">für "{result.keyword}" · {result.region}</span>
              </div>
              <div className="flex gap-2">
                <Btn size="sm" onClick={copyHtml}>📋 Alle als HTML kopieren</Btn>
                <Btn size="sm" variant="secondary" onClick={() => {
                  const blob = new Blob([result.html], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = `schema-${keyword.replace(/\s+/g, '-').toLowerCase()}.html`;
                  a.click(); URL.revokeObjectURL(url);
                }}>💾 Download</Btn>
              </div>
            </div>
          </Card>

          {/* Individual Schema Cards */}
          {Object.entries(result.schemas)
            .filter(([k, v]) => v && !k.startsWith('_'))
            .map(([key, schema]) => {
              const typeInfo = SCHEMA_TYPES.find(t => t.id === key);
              const validation = validationResults[key];
              const isExpanded = expandedSchema === key;

              return (
                <Card key={key} title={`${typeInfo?.icon || '📄'} ${typeInfo?.label || key}`} actions={
                  <div className="flex gap-1.5">
                    <Btn size="xs" variant="ghost" onClick={() => validate(key, schema)} disabled={validating === key}>
                      {validating === key ? <Spinner /> : validation?.valid ? '✅' : '🔍'} Prüfen
                    </Btn>
                    <Btn size="xs" variant="ghost" onClick={() => copyJson(schema)}>📋</Btn>
                    <Btn size="xs" variant="ghost" onClick={() => setExpandedSchema(isExpanded ? null : key)}>
                      {isExpanded ? '▼' : '▶'}
                    </Btn>
                  </div>
                }>
                  {/* Validation Results */}
                  {validation && (
                    <div className={`mb-3 p-3 rounded-lg text-xs ${
                      validation.valid ? 'bg-emerald-900/15 border border-emerald-800/30' : 'bg-red-900/15 border border-red-800/30'
                    }`}>
                      <p className={`font-medium ${validation.valid ? 'text-emerald-400' : 'text-red-400'}`}>
                        {validation.valid ? '✅ Schema valide' : `❌ ${validation.errors.length} Fehler`}
                        {validation.warnings?.length > 0 && ` · ${validation.warnings.length} Hinweise`}
                      </p>
                      {validation.errors?.map((e, i) => (
                        <p key={i} className="text-red-400/80 mt-1">• {e}</p>
                      ))}
                      {validation.warnings?.map((w, i) => (
                        <p key={i} className="text-yellow-400/60 mt-1">⚠ {w}</p>
                      ))}
                    </div>
                  )}

                  {/* Compact preview */}
                  {!isExpanded && (
                    <div className="text-gray-500 text-xs font-mono bg-gray-800/30 rounded-lg px-3 py-2 truncate">
                      @type: {Array.isArray(schema['@type']) ? schema['@type'].join(', ') : schema['@type']}
                      {schema.name ? ` · name: "${schema.name}"` : ''}
                      {schema.headline ? ` · headline: "${schema.headline}"` : ''}
                    </div>
                  )}

                  {/* Full JSON */}
                  {isExpanded && (
                    <pre className="text-gray-400 text-xs bg-gray-800/30 rounded-lg p-4 max-h-[500px] overflow-auto font-mono leading-relaxed whitespace-pre-wrap">
                      {JSON.stringify(schema, null, 2)}
                    </pre>
                  )}
                </Card>
              );
            })}

          {/* Generated FAQ Questions (editable) */}
          {result.schemas._generatedQuestions && (
            <Card title="❓ Generierte FAQ-Fragen" actions={
              <Btn size="xs" variant="secondary" onClick={() => setEditingFaq(
                editingFaq ? null : [...result.schemas._generatedQuestions]
              )}>
                {editingFaq ? 'Abbrechen' : '✏️ Bearbeiten'}
              </Btn>
            }>
              <p className="text-gray-500 text-xs mb-3">
                Diese Fragen wurden per GPT-4o generiert. Du kannst sie anpassen und das Schema neu erzeugen.
              </p>
              <div className="space-y-3">
                {(editingFaq || result.schemas._generatedQuestions).map((q, i) => (
                  <div key={i} className="border-l-2 border-blue-600/30 pl-4">
                    {editingFaq ? (
                      <>
                        <input value={editingFaq[i].question}
                          onChange={e => {
                            const copy = [...editingFaq];
                            copy[i] = { ...copy[i], question: e.target.value };
                            setEditingFaq(copy);
                          }}
                          className="w-full bg-gray-800/80 border border-gray-700/60 rounded px-3 py-1.5 text-white text-sm mb-1" />
                        <textarea value={editingFaq[i].answer}
                          onChange={e => {
                            const copy = [...editingFaq];
                            copy[i] = { ...copy[i], answer: e.target.value };
                            setEditingFaq(copy);
                          }}
                          className="w-full bg-gray-800/80 border border-gray-700/60 rounded px-3 py-1.5 text-gray-300 text-xs resize-y h-16" />
                      </>
                    ) : (
                      <>
                        <p className="text-white text-sm font-medium">{q.question}</p>
                        <p className="text-gray-400 text-xs mt-1 leading-relaxed">{q.answer}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
              {editingFaq && (
                <div className="mt-4 flex justify-end">
                  <Btn size="sm" onClick={async () => {
                    setLoading(true); setError(null);
                    try {
                      const data = await api.schemaGenerate(keyword, region, domain, selectedTypes, {
                        faqQuestions: editingFaq,
                        articleTitle: articleTitle || undefined,
                        priceMin: priceMin ? Number(priceMin) : undefined,
                        priceMax: priceMax ? Number(priceMax) : undefined,
                      });
                      setResult(data);
                      setEditingFaq(null);
                    } catch (e) { setError(e.message); }
                    setLoading(false);
                  }}>
                    🔄 Schema mit angepassten FAQs neu generieren
                  </Btn>
                </div>
              )}
            </Card>
          )}

          {/* Schema-Fehler bei FAQ */}
          {result.schemas._faqError && (
            <Card>
              <div className="bg-yellow-900/10 border border-yellow-800/30 rounded-lg p-3">
                <p className="text-yellow-400 text-xs">FAQ-Generierung fehlgeschlagen: {result.schemas._faqError}</p>
                <p className="text-gray-500 text-[10px] mt-1">Tipp: Du kannst Fragen manuell eingeben und das FAQ-Schema separat erzeugen.</p>
              </div>
            </Card>
          )}

          {/* HTML Preview */}
          <Card title="HTML-Code (komplett)" actions={
            <Btn size="xs" variant="ghost" onClick={copyHtml}>📋</Btn>
          }>
            <pre className="text-gray-400 text-xs bg-gray-800/40 rounded-lg p-4 max-h-[400px] overflow-auto font-mono leading-relaxed whitespace-pre-wrap break-all">
              {result.html}
            </pre>
          </Card>

          {/* Einbau-Anleitung */}
          <Card title="📋 Einbau-Anleitung">
            <div className="space-y-3 text-xs">
              <div className="flex gap-3 items-start">
                <span className="text-emerald-400 font-bold shrink-0">1.</span>
                <p className="text-gray-400"><strong className="text-gray-300">WordPress / Elementor:</strong> HTML-Widget → den gesamten Code oben einfügen. Am besten ganz oben auf der Seite, vor dem sichtbaren Content. Schema ist für Suchmaschinen, nicht für User.</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-emerald-400 font-bold shrink-0">2.</span>
                <p className="text-gray-400"><strong className="text-gray-300">Testen:</strong> Google Rich Results Test → <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener" className="text-blue-400 hover:underline">search.google.com/test/rich-results</a> → URL eingeben oder HTML-Snippet einfügen.</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-emerald-400 font-bold shrink-0">3.</span>
                <p className="text-gray-400"><strong className="text-gray-300">Pro Seite:</strong> Jede LP braucht ein eigenes Service + FAQ Schema. Das LocalBusiness-Schema kann site-wide im Header oder Footer eingebaut werden (einmalig).</p>
              </div>
            </div>
          </Card>
        </>
      )}

      {!result && !loading && (
        <Card>
          <EmptyState icon="🏷️" title="Schema.org JSON-LD Generator"
            desc="Keyword eingeben → validiertes Markup für LocalBusiness, Service, FAQ, Breadcrumb, Article und Product. Kein GPT-Raten — strukturiert und korrekt." />
        </Card>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════
// TAB 5: PROMPT EDITOR
// ═══════════════════════════════════════════════════════

const CATEGORY_LABELS = {
  basis: '📋 Basis-Kontext',
  keywords: '🔑 Keywords / AEO',
  content: '📝 Content-Generierung',
  analyse: '🔍 Analyse / Diagnose',
  social: '📱 Social Media',
};

function PromptEditor() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [successKey, setSuccessKey] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    try {
      const data = await api.promptsList();
      setTemplates(data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (t) => {
    setEditingKey(t.key);
    setEditValue(t.currentValue || t.defaultValue);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue('');
  };

  const save = async () => {
    if (!editValue.trim()) return;
    setSaving(true); setError(null);
    try {
      await api.promptSave(editingKey, editValue);
      setSuccessKey(editingKey);
      setTimeout(() => setSuccessKey(null), 3000);
      setEditingKey(null);
      setEditValue('');
      await load();
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const resetToDefault = async (key) => {
    if (!confirm('Wirklich auf Standard zurücksetzen? Deine Änderungen gehen verloren.')) return;
    try {
      await api.promptReset(key);
      setSuccessKey(key);
      setTimeout(() => setSuccessKey(null), 3000);
      if (editingKey === key) cancelEdit();
      await load();
    } catch (e) { setError(e.message); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  const categories = [...new Set(templates.map(t => t.category))];
  const filtered = filter === 'all' ? templates : templates.filter(t => t.category === filter);

  // Group by category
  const grouped = {};
  for (const t of filtered) {
    if (!grouped[t.category]) grouped[t.category] = [];
    grouped[t.category].push(t);
  }

  return (
    <>
      <Card title="Prompt Editor" actions={
        <div className="flex items-center gap-2">
          <Badge color="blue">{templates.filter(t => t.isOverridden).length} angepasst</Badge>
          <Badge color="gray">{templates.filter(t => !t.isOverridden).length} Standard</Badge>
        </div>
      }>
        <p className="text-gray-500 text-xs mb-4">
          Hier kannst du die System-Prompts für alle AI-Features anpassen.
          Änderungen werden in der Datenbank gespeichert und überschreiben die Defaults.
          Du kannst jederzeit auf den Standard zurücksetzen.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Btn size="xs" variant={filter === 'all' ? 'primary' : 'ghost'} onClick={() => setFilter('all')}>
            Alle ({templates.length})
          </Btn>
          {categories.map(cat => (
            <Btn key={cat} size="xs" variant={filter === cat ? 'primary' : 'ghost'} onClick={() => setFilter(cat)}>
              {CATEGORY_LABELS[cat] || cat} ({templates.filter(t => t.category === cat).length})
            </Btn>
          ))}
        </div>
      </Card>

      <ErrorBox message={error} onDismiss={() => setError(null)} />

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400 mt-4">
            {CATEGORY_LABELS[cat] || cat}
          </h3>
          {items.map(t => {
            const isEditing = editingKey === t.key;
            const isSuccess = successKey === t.key;

            return (
              <Card key={t.key}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-sm font-medium">{t.label}</span>
                      {t.isOverridden ? (
                        <Badge color="yellow">angepasst</Badge>
                      ) : (
                        <Badge color="gray">Standard</Badge>
                      )}
                      {isSuccess && <Badge color="green">gespeichert</Badge>}
                    </div>
                    <p className="text-gray-600 text-xs">{t.description}</p>
                    <p className="text-gray-700 text-[10px] mt-0.5 font-mono">{t.key}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {!isEditing && (
                      <>
                        <Btn size="xs" variant="secondary" onClick={() => startEdit(t)}>
                          ✏️ Bearbeiten
                        </Btn>
                        {t.isOverridden && (
                          <Btn size="xs" variant="ghost" onClick={() => resetToDefault(t.key)}>
                            ↩️ Reset
                          </Btn>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Preview (collapsed) */}
                {!isEditing && (
                  <pre className="text-gray-500 text-xs bg-gray-800/30 rounded-lg p-3 mt-3 max-h-[120px] overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed">
                    {(t.currentValue || t.defaultValue).slice(0, 500)}
                    {(t.currentValue || t.defaultValue).length > 500 ? '\n\n[...]' : ''}
                  </pre>
                )}

                {/* Editor */}
                {isEditing && (
                  <div className="mt-3 space-y-3">
                    <textarea
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      className="w-full bg-gray-900/80 border border-blue-500/40 rounded-lg px-4 py-3 text-gray-300 text-xs font-mono placeholder-gray-600 focus:outline-none focus:border-blue-500/80 transition-colors resize-y leading-relaxed"
                      style={{ minHeight: '200px', maxHeight: '500px' }}
                      spellCheck={false}
                    />
                    <div className="flex items-center justify-between">
                      <div className="text-gray-600 text-[10px]">
                        {editValue.length} Zeichen · {editValue.split('\n').length} Zeilen
                      </div>
                      <div className="flex gap-2">
                        <Btn size="xs" variant="ghost" onClick={() => {
                          setEditValue(t.defaultValue);
                        }}>
                          Standard laden
                        </Btn>
                        <Btn size="xs" variant="ghost" onClick={cancelEdit}>Abbrechen</Btn>
                        <Btn size="xs" onClick={save} disabled={saving}>
                          {saving ? <><Spinner /> Speichern...</> : '💾 Speichern'}
                        </Btn>
                      </div>
                    </div>
                  </div>
                )}

                {/* Override timestamp */}
                {t.isOverridden && t.updatedAt && !isEditing && (
                  <p className="text-gray-700 text-[10px] mt-2">
                    Zuletzt geändert: {new Date(t.updatedAt).toLocaleDateString('de', {
                      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      ))}
    </>
  );
}
