import { useState, useRef } from 'react';
import { Card, Btn, Input, Select, Spinner, EmptyState, ErrorBox, TabBar, Badge } from '../components/ui';
import * as api from '../services/api';
import { REGIONS, SH_SERVICES } from '../config/constants';

export default function Content() {
  const [tab, setTab] = useState('landingpage');
  const tabs = [
    { id: 'landingpage', label: 'HTML Landing Page' },
    { id: 'article', label: 'Markdown Artikel' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Content</h2>
        <p className="text-gray-500 text-sm mt-1">SEO-optimierte Seiten und Artikel generieren (GPT-4o)</p>
      </div>
      <TabBar tabs={tabs} active={tab} onChange={setTab} />
      {tab === 'landingpage' ? <LandingPageGenerator /> : <ArticleGenerator />}
    </div>
  );
}

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
    try {
      const data = await api.aiLandingPage(keyword, region, service || keyword);
      setResult(data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const copyHtml = () => { if (result?.html) navigator.clipboard.writeText(result.html); };

  const downloadHtml = () => {
    if (!result?.html) return;
    const blob = new Blob([result.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${keyword.replace(/\s+/g, '-').toLowerCase()}-${region.toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const regionOptions = REGIONS.map(r => ({ value: r.name, label: r.name }));
  const serviceOptions = [{ value: '', label: '— Aus Keyword ableiten —' }, ...SH_SERVICES.map(s => ({ value: s, label: s }))];

  return (
    <>
      <Card title="HTML Landing Page generieren">
        <p className="text-gray-500 text-xs mb-4">
          Komplette HTML-Seite im Schreinerhelden-Design. Einfügefertig als Elementor HTML-Widget.
          Inkl. Schema.org, Meta-Daten, Hero, Content (1.400–1.800 Wörter), FAQ, CTA.
        </p>
        <div className="grid grid-cols-12 gap-4 items-end mb-4">
          <Input className="col-span-4" label="Keyword" value={keyword} onChange={setKeyword}
            placeholder="z.B. Einbauschrank nach Maß" onKeyDown={e => e.key === 'Enter' && !loading && generate()} />
          <Select className="col-span-3" label="Region" value={region} onChange={setRegion} options={regionOptions} />
          <Select className="col-span-3" label="Service" value={service} onChange={setService} options={serviceOptions} />
          <div className="col-span-2">
            <Btn onClick={generate} disabled={loading || !keyword.trim()} className="w-full justify-center">
              {loading ? <><Spinner /> Läuft...</> : '🏗️ LP bauen'}
            </Btn>
          </div>
        </div>
        {loading && (
          <div className="bg-blue-900/10 border border-blue-800/30 rounded-lg p-4 text-center">
            <Spinner size="md" />
            <p className="text-blue-400 text-sm mt-3">SERP scannen → Longtails generieren → HTML bauen...</p>
            <p className="text-gray-600 text-xs mt-1">Dauert ca. 30–60 Sekunden</p>
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
                {result.wordCount?.toLocaleString('de')}
              </p>
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
                <Btn size="sm" variant="secondary" onClick={downloadHtml}>💾 .html Download</Btn>
                <Btn size="sm" variant={showPreview ? 'primary' : 'ghost'} onClick={() => setShowPreview(!showPreview)}>
                  👁️ {showPreview ? 'Vorschau aus' : 'Vorschau'}
                </Btn>
              </div>
              <Badge color={result.wordCount >= 1400 ? 'green' : 'yellow'}>
                {result.wordCount >= 1400 ? '✓ Mindestlänge erreicht' : '⚠ Unter 1.400 Wörter'}
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
            <pre className="text-gray-400 text-xs bg-gray-800/40 rounded-lg p-4 max-h-[500px] overflow-auto font-mono leading-relaxed whitespace-pre-wrap break-all">{result.html}</pre>
          </Card>
        </>
      )}

      {!result && !loading && (
        <Card>
          <EmptyState icon="🏗️" title="HTML Landing Page Generator"
            desc="Keyword + Region eingeben → komplette HTML-Seite im Schreinerhelden-Design. Copy-Paste in Elementor HTML-Widget." />
        </Card>
      )}
    </>
  );
}

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
      const context = `Region: ${region}. Service-Kontext: ${SH_SERVICES.join(', ')}`;
      const result = await api.aiContent(keyword, context);
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
            <Btn size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(content)}>📋 Kopieren</Btn>
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
