import { useState, useCallback } from 'react';
import { Card, Btn, Badge, Spinner, Input, Select, EmptyState, ErrorBox, ProgressSteps } from '../components/ui';
import * as api from '../services/api';
import { REGIONS, DOMAINS, calcRegionScore, TIER_COLORS } from '../config/constants';

const STEPS = ['SERP Scan', 'Suchvolumen', 'Longtails', 'AEO', 'Content'];

export default function Analyse() {
  const [keyword, setKeyword] = useState('');
  const [region, setRegion] = useState('Stuttgart');
  const [domain, setDomain] = useState('sh');
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedRun, setSelectedRun] = useState(null);

  const runPipeline = useCallback(async () => {
    if (!keyword.trim()) return;
    setRunning(true);
    setError(null);
    setResult(null);
    setCurrentStep(0);

    // Simulate step progression (real steps happen server-side)
    const stepTimer = setInterval(() => {
      setCurrentStep(prev => prev < 4 ? prev + 1 : prev);
    }, 3000);

    try {
      const data = await api.pipelineRun(keyword, region, domain);
      clearInterval(stepTimer);
      setCurrentStep(5);
      setResult(data);
    } catch (e) {
      clearInterval(stepTimer);
      setError(e.message);
    } finally {
      setRunning(false);
    }
  }, [keyword, region, domain]);

  const loadHistory = useCallback(async () => {
    try {
      const data = await api.pipelineHistory();
      setHistory(data);
      setShowHistory(true);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const loadDetail = useCallback(async (id) => {
    try {
      const data = await api.pipelineDetail(id);
      setResult(data);
      setSelectedRun(id);
      setShowHistory(false);
      setCurrentStep(5);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const regionOptions = REGIONS.map(r => ({
    value: r.name,
    label: `${r.name} — Score ${calcRegionScore(r)} (${r.tier})`,
  }));

  const display = result || null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Analyse</h2>
          <p className="text-gray-500 text-sm mt-1">Keyword + Region → TOP 10 → Longtails → AEO → Content</p>
        </div>
        <Btn variant="ghost" size="sm" onClick={loadHistory}>📋 Historie</Btn>
      </div>

      {/* Input Panel */}
      <Card>
        <div className="grid grid-cols-12 gap-4 items-end">
          <Input
            className="col-span-5"
            label="Keyword"
            value={keyword}
            onChange={setKeyword}
            placeholder="z.B. Einbauschrank nach Maß"
            onKeyDown={e => e.key === 'Enter' && !running && runPipeline()}
          />
          <Select
            className="col-span-3"
            label="Region"
            value={region}
            onChange={setRegion}
            options={regionOptions}
          />
          <Select
            className="col-span-2"
            label="Domain"
            value={domain}
            onChange={setDomain}
            options={[
              { value: 'sh', label: 'Schreinerhelden' },
              { value: 'ims', label: 'IMS' },
            ]}
          />
          <div className="col-span-2">
            <Btn onClick={runPipeline} disabled={running || !keyword.trim()} className="w-full justify-center">
              {running ? <><Spinner /> Läuft...</> : '🔍 Analyse starten'}
            </Btn>
          </div>
        </div>

        {/* Progress Steps */}
        {running && (
          <div className="mt-5 pt-5 border-t border-gray-800/50">
            <ProgressSteps steps={STEPS} current={currentStep} />
          </div>
        )}
      </Card>

      <ErrorBox message={error} onDismiss={() => setError(null)} />

      {/* History Modal */}
      {showHistory && (
        <Card title="Analyse-Historie" actions={
          <Btn variant="ghost" size="xs" onClick={() => setShowHistory(false)}>✕</Btn>
        }>
          {history.length === 0 ? (
            <EmptyState icon="📋" title="Keine Analysen vorhanden" />
          ) : (
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {history.map(run => (
                <button
                  key={run.id}
                  onClick={() => loadDetail(run.id)}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-800/40 transition-colors text-left"
                >
                  <div>
                    <span className="text-white text-sm">{run.keyword}</span>
                    <span className="text-gray-600 text-xs ml-2">{run.domain?.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {run.ourPosition && <Badge color={run.ourPosition <= 10 ? 'green' : 'yellow'}>Pos. {run.ourPosition}</Badge>}
                    <span className="text-gray-700 text-xs">{new Date(run.createdAt).toLocaleDateString('de')}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ═══════ RESULTS ═══════ */}
      {display && (
        <>
          {/* KPI Summary */}
          <div className="grid grid-cols-5 gap-3">
            <Card className="text-center">
              <p className="text-gray-500 text-[10px] uppercase">Unsere Position</p>
              <p className={`text-2xl font-bold mt-1 ${
                display.ourPosition
                  ? display.ourPosition <= 3 ? 'text-emerald-400' : display.ourPosition <= 10 ? 'text-yellow-400' : 'text-red-400'
                  : 'text-gray-600'
              }`}>
                {display.ourPosition || '–'}
              </p>
            </Card>
            <Card className="text-center">
              <p className="text-gray-500 text-[10px] uppercase">Suchvolumen</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">{display.searchVolume?.toLocaleString('de') || '–'}</p>
            </Card>
            <Card className="text-center">
              <p className="text-gray-500 text-[10px] uppercase">CPC</p>
              <p className="text-2xl font-bold text-white mt-1">{display.cpc ? `€${display.cpc.toFixed(2)}` : '–'}</p>
            </Card>
            <Card className="text-center">
              <p className="text-gray-500 text-[10px] uppercase">Wettbewerb</p>
              <p className="text-2xl font-bold text-white mt-1">{display.competition || '–'}</p>
            </Card>
            <Card className="text-center">
              <p className="text-gray-500 text-[10px] uppercase">Ergebnisse</p>
              <p className="text-2xl font-bold text-white mt-1">{display.totalResults?.toLocaleString('de') || '–'}</p>
            </Card>
          </div>

          {/* TOP 10 SERP Results */}
          <Card title="TOP 10 Wettbewerber">
            <div className="space-y-1">
              {(display.serpResults || []).map((r, i) => (
                <div key={r.id || i} className={`flex items-center gap-3 py-2.5 px-3 rounded-lg ${
                  r.isOurs ? 'bg-emerald-900/15 border border-emerald-800/30' : 'hover:bg-gray-800/20'
                } transition-colors`}>
                  <span className={`w-6 text-center font-bold text-sm ${
                    r.isOurs ? 'text-emerald-400' : r.position <= 3 ? 'text-yellow-400' : 'text-gray-600'
                  }`}>
                    {r.position}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm truncate ${r.isOurs ? 'text-emerald-400 font-medium' : 'text-white'}`}>
                      {r.title}
                    </div>
                    <div className="text-gray-600 text-xs truncate">{r.domain}</div>
                  </div>
                  {r.isOurs && <Badge color="green">UNSERE</Badge>}
                </div>
              ))}
            </div>
          </Card>

          {/* Longtail Keywords */}
          {display.longtails?.keywords && (
            <Card title={`Longtail-Keywords (${display.longtails.keywords.length})`}>
              <div className="grid grid-cols-2 gap-2">
                {display.longtails.keywords.map((lt, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 px-3 bg-gray-800/30 rounded-lg">
                    <span className="text-gray-300 text-sm">{lt.keyword}</span>
                    <div className="flex gap-2">
                      <Badge color={lt.searchType === 'ai' ? 'purple' : lt.searchType === 'voice' ? 'blue' : 'gray'}>
                        {lt.searchType}
                      </Badge>
                      <Badge color={lt.intent === 'transactional' ? 'green' : lt.intent === 'local' ? 'yellow' : 'gray'}>
                        {lt.intent}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* AEO Questions */}
          {display.aeoQuestions?.questions && (
            <Card title={`AEO / People Also Ask (${display.aeoQuestions.questions.length})`}>
              <div className="space-y-3">
                {display.aeoQuestions.questions.map((q, i) => (
                  <div key={i} className="border-l-2 border-blue-600/30 pl-4">
                    <div className="text-white text-sm font-medium">{q.question}</div>
                    <div className="text-gray-400 text-xs mt-1 leading-relaxed">{q.answer}</div>
                    <Badge color={q.snippetPotential === 'high' ? 'green' : q.snippetPotential === 'medium' ? 'yellow' : 'gray'}>
                      Snippet: {q.snippetPotential}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Content Draft */}
          {display.contentDraft && (
            <Card title="Content-Entwurf (Position 1)" actions={
              <Btn size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(display.contentDraft)}>
                📋 Kopieren
              </Btn>
            }>
              <div className="prose prose-invert prose-sm max-w-none max-h-[600px] overflow-y-auto bg-gray-800/30 rounded-lg p-5">
                <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">{display.contentDraft}</pre>
              </div>
            </Card>
          )}

          {/* Action: Add to Tracking */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Keyword zum Tracking hinzufügen?</p>
                <p className="text-gray-500 text-xs mt-0.5">Position wird täglich automatisch geprüft</p>
              </div>
              <Btn variant="success" size="sm" onClick={async () => {
                try {
                  await api.trackingAdd(display.keyword, domain, display.region);
                } catch {}
              }}>
                📈 Tracking starten
              </Btn>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
