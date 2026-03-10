import { useState } from 'react';
import { Card, Btn, Input, Select, Spinner, EmptyState, ErrorBox } from '../components/ui';
import * as api from '../services/api';
import { REGIONS, SH_SERVICES } from '../config/constants';

export default function Content() {
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
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Content</h2>
        <p className="text-gray-500 text-sm mt-1">SEO-optimierte Artikel generieren (GPT-4o)</p>
      </div>

      <Card title="Artikel generieren">
        <div className="grid grid-cols-12 gap-4 items-end mb-4">
          <Input className="col-span-5" label="Keyword / Thema" value={keyword} onChange={setKeyword}
            placeholder="z.B. Begehbarer Kleiderschrank Kosten" />
          <Select className="col-span-3" label="Region" value={region} onChange={setRegion}
            options={REGIONS.map(r => ({ value: r.name, label: r.name }))} />
          <div className="col-span-4">
            <Btn onClick={generate} disabled={loading || !keyword.trim()} className="w-full justify-center">
              {loading ? <><Spinner /> Generiere...</> : '✍️ Content erstellen'}
            </Btn>
          </div>
        </div>
        <p className="text-gray-600 text-xs">
          Erstellt einen 1500-2000 Wörter SEO-Artikel mit Title Tag, Meta Description, H-Struktur, FAQ-Schema und lokalen Bezügen.
        </p>
      </Card>

      <ErrorBox message={error} onDismiss={() => setError(null)} />

      {content && (
        <Card title="Generierter Content" actions={
          <div className="flex gap-2">
            <Btn size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(content)}>📋 Kopieren</Btn>
            <Btn size="sm" variant="secondary" onClick={() => {
              const blob = new Blob([content], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${keyword.replace(/\s+/g, '-').toLowerCase()}.md`;
              a.click();
            }}>💾 .md Download</Btn>
          </div>
        }>
          <div className="bg-gray-800/30 rounded-lg p-5 max-h-[700px] overflow-y-auto">
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">{content}</pre>
          </div>
        </Card>
      )}

      {!content && !loading && (
        <Card>
          <EmptyState icon="✍️" title="Content-Werkstatt"
            desc="Gib ein Keyword ein und GPT-4o erstellt einen vollständigen SEO-Artikel optimiert für Position 1" />
        </Card>
      )}
    </div>
  );
}
