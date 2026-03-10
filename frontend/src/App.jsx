// ============================================================================
// SEO COMMAND CENTER v4.1 "Agency Simulator"
// Schreinerhelden GmbH & Co. KG — seo.meosapp.de
// React + Vite + Tailwind — Single-File App
// ============================================================================
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// ─── VERSION ────────────────────────────────────────────────────────────────
const APP_VERSION = 'v4.1';
const APP_NAME = 'SEO Command Center';
const APP_SUBTITLE = 'Agency Simulator · 16 Spezialisten';

// ─── HARDCODED USERS (v4.1 Login) ──────────────────────────────────────────
const USERS = [
  { username: 'admin', password: 'schreinerhelden2026', role: 'Admin' },
  { username: 'mario', password: 'meos2026!', role: 'Owner' },
  { username: 'team', password: 'seoTeam2026', role: 'Team' },
];

// ─── 16 AGENCY TEAM MEMBERS ────────────────────────────────────────────────
const AGENCY_TEAM = [
  { id: 1, name: 'Strategie-Lead', role: 'SEO-Stratege', emoji: '🎯', desc: 'Gesamtstrategie, Roadmap, KPI-Steuerung' },
  { id: 2, name: 'AEO-Spezialist', role: 'Answer Engine Optimizer', emoji: '🤖', desc: 'AI Overviews, Featured Snippets, Answer-First Content' },
  { id: 3, name: 'GEO-Spezialist', role: 'Generative Engine Optimizer', emoji: '🌐', desc: 'ChatGPT/Gemini/Perplexity Sichtbarkeit' },
  { id: 4, name: 'Tech-SEO', role: 'Technical SEO Engineer', emoji: '⚙️', desc: 'Core Web Vitals, Schema, Crawling, Indexing' },
  { id: 5, name: 'Local-SEO', role: 'Local SEO Manager', emoji: '📍', desc: 'GBP, Citations, Local Pack, Rezensionen' },
  { id: 6, name: 'Content-Stratege', role: 'Content-Stratege', emoji: '📝', desc: 'Content-Plan, Themenfindung, E-E-A-T' },
  { id: 7, name: 'Copywriter', role: 'Conversion Copywriter', emoji: '✍️', desc: 'Landing Pages, Headlines, CTA, Heatmap-optimiert' },
  { id: 8, name: 'UX/CRO', role: 'UX/CRO-Experte', emoji: '🧪', desc: 'Conversion Rate, A/B Tests, User Journey' },
  { id: 9, name: 'UI-Designer', role: 'UI-Designer', emoji: '🎨', desc: 'Visuelles Design, Branding, Layout' },
  { id: 10, name: 'Social Media', role: 'Social Media Manager', emoji: '📱', desc: 'Instagram, Facebook, Pinterest, TikTok, LinkedIn' },
  { id: 11, name: 'Video', role: 'Video-Produzent', emoji: '🎬', desc: 'YouTube, Reels, TikTok, Workshop-Content' },
  { id: 12, name: 'Google Ads', role: 'Google Ads Manager', emoji: '💰', desc: 'Search, PMax, LSA, Display' },
  { id: 13, name: 'Meta Ads', role: 'Meta Ads Manager', emoji: '📣', desc: 'Facebook/Instagram Ads, 3-Layer Funnel' },
  { id: 14, name: 'Analytics', role: 'Analytics-Spezialist', emoji: '📊', desc: 'GA4, GSC, Tracking, Reporting' },
  { id: 15, name: 'PR & Outreach', role: 'PR & Outreach', emoji: '🤝', desc: 'Linkbuilding, Pressemitteilungen, Kooperationen' },
  { id: 16, name: 'Brand', role: 'Brand-Stratege', emoji: '👑', desc: 'Markenpositionierung, Messaging, Tone of Voice' },
];

// ─── 18 REGIONS WITH SCORING ───────────────────────────────────────────────
const REGIONS = [
  { name: 'Stuttgart', einwohner: 635911, kki: 111.2, km: 40, tier: 'Maximal' },
  { name: 'Waiblingen', einwohner: 57141, kki: 113.5, km: 25, tier: 'Sehr hoch' },
  { name: 'Fellbach', einwohner: 45780, kki: 115.8, km: 30, tier: 'Sehr hoch' },
  { name: 'Ludwigsburg', einwohner: 93482, kki: 110.3, km: 35, tier: 'Sehr hoch' },
  { name: 'Esslingen', einwohner: 93542, kki: 107.6, km: 45, tier: 'Sehr hoch' },
  { name: 'Böblingen', einwohner: 51512, kki: 114.2, km: 55, tier: 'Sehr hoch' },
  { name: 'Backnang', einwohner: 37266, kki: 104.1, km: 10, tier: 'Hoch' },
  { name: 'Winnenden', einwohner: 28590, kki: 108.3, km: 18, tier: 'Hoch' },
  { name: 'Schorndorf', einwohner: 39606, kki: 106.7, km: 22, tier: 'Hoch' },
  { name: 'Heilbronn', einwohner: 126592, kki: 102.4, km: 50, tier: 'Hoch' },
  { name: 'Schwäbisch Gmünd', einwohner: 61186, kki: 99.8, km: 45, tier: 'Hoch' },
  { name: 'Aalen', einwohner: 68456, kki: 101.1, km: 60, tier: 'Hoch' },
  { name: 'Schwäbisch Hall', einwohner: 41106, kki: 100.5, km: 40, tier: 'Mittel' },
  { name: 'Öhringen', einwohner: 24627, kki: 103.2, km: 45, tier: 'Mittel' },
  { name: 'Crailsheim', einwohner: 35117, kki: 98.6, km: 65, tier: 'Mittel' },
  { name: 'Gaildorf', einwohner: 12343, kki: 96.4, km: 15, tier: 'Mittel' },
  { name: 'Welzheim', einwohner: 11234, kki: 105.1, km: 12, tier: 'Mittel' },
  { name: 'Murrhardt', einwohner: 14198, kki: 101.8, km: 0, tier: 'Basis' },
];

// ─── SCHREINERHELDEN SERVICES ──────────────────────────────────────────────
const SH_SERVICES = [
  'Begehbarer Kleiderschrank', 'Dachschrägenschrank', 'Garderobe',
  'Kleiderschrank', 'Stauraumschrank', 'Treppenschrank', 'Waschmaschinenschrank'
];

const IMS_SERVICES = [
  'Einbauschrank', 'Dachschrägenschrank', 'Begehbarer Kleiderschrank',
  'Garderobe nach Maß', 'Schränke nach Maß'
];

// ─── CONTENT CHANNELS ──────────────────────────────────────────────────────
const CHANNELS = [
  { id: 'gbp', name: 'Google Business Profile', emoji: '📌', active: true },
  { id: 'instagram', name: 'Instagram', emoji: '📸', active: true },
  { id: 'facebook', name: 'Facebook', emoji: '👥', active: true },
  { id: 'pinterest', name: 'Pinterest', emoji: '📌', active: true },
  { id: 'tiktok', name: 'TikTok', emoji: '🎵', active: false },
  { id: 'youtube', name: 'YouTube', emoji: '▶️', active: true },
  { id: 'houzz', name: 'Houzz', emoji: '🏠', active: true },
  { id: 'email', name: 'Email Newsletter', emoji: '📧', active: false },
  { id: 'googleads', name: 'Google Ads', emoji: '💰', active: false },
  { id: 'metaads', name: 'Meta Ads', emoji: '📣', active: false },
  { id: 'linkedin', name: 'LinkedIn', emoji: '💼', active: false },
];

// ─── LP SECTIONS (Heatmap Psychology) ──────────────────────────────────────
const LP_SECTIONS = [
  { id: 'hero', name: 'Hero', heat: 'HOT', color: '#ef4444', desc: 'Pattern Interrupt, max 8 Worte H1' },
  { id: 'pain', name: 'Pain & Agitate', heat: 'WARM', color: '#f97316', desc: 'Loss Aversion, Du-Ansprache' },
  { id: 'solution', name: 'Solution & USP', heat: 'WARM', color: '#eab308', desc: '3-5 Schritt Prozess, Zeigarnik-Effekt' },
  { id: 'social', name: 'Social Proof', heat: 'WARM-COOL', color: '#22c55e', desc: 'Bandwagon Effect, echte Testimonials' },
  { id: 'showcase', name: 'Project Showcase', heat: 'COOL-WARM', color: '#3b82f6', desc: 'Visual Proof + Aspiration' },
  { id: 'faq', name: 'FAQ AEO', heat: 'COOL', color: '#8b5cf6', desc: 'Answer-First 50 Worte, FAQPage Schema' },
  { id: 'cta', name: 'Final CTA', heat: 'WARM', color: '#ef4444', desc: 'Commitment & Consistency' },
];

// ─── TIER COLORS ───────────────────────────────────────────────────────────
const TIER_COLORS = {
  'Maximal': '#ef4444', 'Sehr hoch': '#f97316', 'Hoch': '#eab308',
  'Mittel': '#22c55e', 'Basis': '#3b82f6'
};

// ─── REGION SCORE CALC ─────────────────────────────────────────────────────
const calcRegionScore = (r) => ((r.einwohner / 1000) * (r.kki / 100) * (1 / (1 + r.km / 50))).toFixed(1);

// ─── GPT-4o CALL ───────────────────────────────────────────────────────────
const callGPT = async (apiKey, systemPrompt, userPrompt, temperature = 0.7) => {
  if (!apiKey) throw new Error('OpenAI API Key fehlt! Bitte unter Settings eingeben.');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o', temperature,
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
    }),
  });
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error?.message || `GPT Error ${res.status}`); }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
};

// ─── DATAFORSEO CALL ───────────────────────────────────────────────────────
const callDataForSEO = async (login, password, endpoint, body) => {
  if (!login || !password) throw new Error('DataForSEO Credentials fehlen! Bitte unter Settings eingeben.');
  const res = await fetch(`https://api.dataforseo.com/v3/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${login}:${password}`),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`DataForSEO Error ${res.status}`);
  return await res.json();
};

// ─── SYSTEM PROMPTS ────────────────────────────────────────────────────────
const PROMPTS = {
  copywriter: `Du bist ein Elite-Level Conversion Copywriter (Apple/Tesla/Gucci Niveau) für Schreinerhelden, eine Premium-Schreinerei in Murrhardt bei Stuttgart.
REGELN:
- Du-Ansprache (NIEMALS Sie)
- KEIN "Herzlich Willkommen", KEIN "Wir freuen uns"
- Heatmap-informiert: Hero=HOT, Pain=WARM, Solution=WARM, Proof=COOL, CTA=HOT
- Max 8 Worte für H1 Headlines
- Pattern Interrupt in der Hero Section
- Loss Aversion in Pain Section
- Zeigarnik-Effekt in Solution (offene Loops)
- Bandwagon Effect in Social Proof
- Schwäbisch/bodenständig aber premium
- USP: "Wir sind (k)eine normale Schreinerei"
- Prozess: Online-Termin → Festpreis → Aufmaß → Fertigung → Montage
- Kontakt: 07192/9789012 | Lindenstraße 9-15, 71540 Murrhardt`,

  strategist: `Du bist ein SEO/AEO/GEO Stratege auf Joy Hawkins/Julian Dziki/Aleyda Solis Level.
KONTEXT: Schreinerhelden GmbH, Murrhardt bei Stuttgart. Zwei Domains:
- schreinerhelden.de = B2C Brand, Produkt-Keywords (Einbauschrank, Dachschräge, Ankleide)
- ihr-moebel-schreiner.de = B2B/Architekten, Service-Keywords (Schreinerei, Innenausbau, Objektbau)
WICHTIG: Keine Keyword-Kannibalisierung zwischen den Domains!
STRATEGIE 2026: Local SEO als Operating Model, GBP als KI-Plattform, Intent-Cluster statt Einzel-Keywords, AEO für AI Overviews, GEO für ChatGPT/Gemini/Perplexity Sichtbarkeit.`,

  social: `Du erstellst Social Media Content für Schreinerhelden — eine authentische Handwerker-Marke.
STIL: Echt, handwerklich, nahbar aber premium. Team-Sprache ("Unser Team", "Mario Esch als Ansprechpartner").
KEIN Corporate-Sprech. Plattform-spezifisch optimiert.
Hashtags nur wo sinnvoll. Emojis sparsam.`,
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// ─── LOGIN SCREEN ──────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const found = USERS.find(u => u.username === user && u.password === pass);
    if (found) { onLogin(found); }
    else { setError('Falscher Benutzername oder Passwort'); }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">🎯</div>
          <h1 className="text-xl font-bold text-white">{APP_NAME}</h1>
          <p className="text-gray-500 text-sm">{APP_SUBTITLE}</p>
        </div>
        {error && <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}
        <input className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 mb-3 focus:outline-none focus:border-blue-500" placeholder="Benutzername" value={user} onChange={e => { setUser(e.target.value); setError(''); }} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        <input className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 mb-4 focus:outline-none focus:border-blue-500" placeholder="Passwort" type="password" value={pass} onChange={e => { setPass(e.target.value); setError(''); }} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg py-3 transition-colors" onClick={handleLogin}>Einloggen</button>
        <p className="text-gray-600 text-xs text-center mt-4">{APP_VERSION} · Schreinerhelden GmbH</p>
      </div>
    </div>
  );
}

// ─── SIDEBAR ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', emoji: '📊' },
  { id: 'lpbuilder', label: 'LP Builder', emoji: '🏗️' },
  { id: 'bulkmatrix', label: 'Bulk Matrix', emoji: '⚡' },
  { id: 'contenthub', label: 'Content Hub', emoji: '✍️' },
  { id: 'channels', label: 'Kanäle', emoji: '📡' },
  { id: 'calendar', label: 'Kalender', emoji: '📅' },
  { id: 'keywords', label: 'Keywords', emoji: '🔍' },
  { id: 'competitors', label: 'Wettbewerber', emoji: '⚔️' },
  { id: 'schema', label: 'Schema.org', emoji: '🏷️' },
  { id: 'agencyteam', label: 'Agency Team', emoji: '👥' },
  { id: 'settings', label: 'Settings', emoji: '⚙️' },
];

function Sidebar({ active, onNav, user, onLogout }) {
  return (
    <div className="w-56 bg-gray-950 border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-white font-bold text-sm">🎯 {APP_NAME}</h1>
        <p className="text-gray-500 text-xs">{APP_VERSION} · {APP_SUBTITLE}</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => onNav(item.id)} className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${active === item.id ? 'bg-blue-600/20 text-blue-400 border-r-2 border-blue-400' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}>
            <span>{item.emoji}</span><span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="text-gray-500 text-xs mb-2">Eingeloggt: <span className="text-gray-300">{user?.username}</span></div>
        <button onClick={onLogout} className="w-full text-left text-gray-500 hover:text-red-400 text-xs transition-colors">↪ Ausloggen</button>
      </div>
    </div>
  );
}

// ─── SHARED COMPONENTS ─────────────────────────────────────────────────────
function Card({ title, children, className = '', actions }) {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl p-5 ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-white font-semibold text-sm">{title}</h3>}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

function Btn({ children, onClick, variant = 'primary', size = 'md', disabled, className = '' }) {
  const base = 'font-medium rounded-lg transition-all inline-flex items-center gap-1.5 disabled:opacity-40';
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-sm' };
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700',
    danger: 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-800',
    ghost: 'hover:bg-gray-800 text-gray-400',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
  };
  return <button onClick={onClick} disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>{children}</button>;
}

function Badge({ children, color = 'gray' }) {
  const colors = { gray: 'bg-gray-800 text-gray-400', blue: 'bg-blue-900/40 text-blue-400', green: 'bg-emerald-900/40 text-emerald-400', red: 'bg-red-900/40 text-red-400', yellow: 'bg-yellow-900/40 text-yellow-400', purple: 'bg-purple-900/40 text-purple-400' };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.gray}`}>{children}</span>;
}

function Spinner() {
  return <div className="inline-block w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />;
}

function EmptyState({ emoji, title, desc }) {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-3">{emoji}</div>
      <p className="text-gray-400 font-medium">{title}</p>
      {desc && <p className="text-gray-600 text-sm mt-1">{desc}</p>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 1: DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
function DashboardModule({ config, generated }) {
  const stats = useMemo(() => {
    const totalCombos = SH_SERVICES.length * REGIONS.length;
    const generatedCount = Object.keys(generated.landingPages || {}).length;
    const contentCount = Object.keys(generated.content || {}).length;
    return { totalCombos, generatedCount, contentCount, coverage: totalCombos > 0 ? ((generatedCount / totalCombos) * 100).toFixed(0) : 0 };
  }, [generated]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Dashboard</h2>
        <p className="text-gray-500 text-sm">Überblick über alle SEO-Aktivitäten</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Landing Pages', value: stats.generatedCount, sub: `von ${stats.totalCombos}`, emoji: '🏗️' },
          { label: 'Content Pieces', value: stats.contentCount, sub: 'generiert', emoji: '✍️' },
          { label: 'Coverage', value: `${stats.coverage}%`, sub: 'Service×Region', emoji: '📊' },
          { label: 'Services', value: SH_SERVICES.length, sub: 'Schreinerhelden', emoji: '🪚' },
          { label: 'Regionen', value: REGIONS.length, sub: 'aktiv', emoji: '📍' },
          { label: 'Team', value: AGENCY_TEAM.length, sub: 'Spezialisten', emoji: '👥' },
        ].map((kpi, i) => (
          <Card key={i}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider">{kpi.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{kpi.value}</p>
                <p className="text-gray-600 text-xs mt-0.5">{kpi.sub}</p>
              </div>
              <span className="text-2xl">{kpi.emoji}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Coverage Matrix Mini */}
      <Card title="Coverage Matrix (Service × Region Top 6)">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-500 pb-2 pr-4">Service</th>
                {REGIONS.slice(0, 6).map(r => <th key={r.name} className="text-center text-gray-500 pb-2 px-1">{r.name.slice(0, 8)}</th>)}
              </tr>
            </thead>
            <tbody>
              {SH_SERVICES.map(s => (
                <tr key={s} className="border-b border-gray-800/50">
                  <td className="py-1.5 pr-4 text-gray-300">{s}</td>
                  {REGIONS.slice(0, 6).map(r => {
                    const key = `${s}__${r.name}`;
                    const has = generated.landingPages?.[key];
                    return <td key={r.name} className="text-center py-1.5 px-1"><span className={`inline-block w-3 h-3 rounded-full ${has ? 'bg-emerald-500' : 'bg-gray-800'}`} /></td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Agency Team Compact */}
      <Card title="Agency Team">
        <div className="grid grid-cols-4 gap-2">
          {AGENCY_TEAM.map(m => (
            <div key={m.id} className="bg-gray-800/50 rounded-lg p-2 text-center">
              <div className="text-xl mb-1">{m.emoji}</div>
              <div className="text-white text-xs font-medium">{m.name}</div>
              <div className="text-gray-500 text-[10px]">{m.role}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 2: LP BUILDER
// ═══════════════════════════════════════════════════════════════════════════
function LPBuilderModule({ config, generated, setGenerated }) {
  const [selService, setSelService] = useState(SH_SERVICES[0]);
  const [selRegion, setSelRegion] = useState(REGIONS[0].name);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  const generateLP = async () => {
    setLoading(true); setError('');
    try {
      const region = REGIONS.find(r => r.name === selRegion);
      const prompt = `Erstelle eine vollständige Landing Page für:
SERVICE: ${selService}
REGION: ${selRegion} (${region.einwohner} Einwohner, KKI: ${region.kki}, Entfernung: ${region.km}km)
DOMAIN: schreinerhelden.de
MARKE: Schreinerhelden — "Wir sind (k)eine normale Schreinerei"

Erstelle ALLE 7 Sektionen:
1. HERO (HOT) — Pattern Interrupt H1 (max 8 Worte), Subheadline, CTA
2. PAIN & AGITATE (WARM) — 3 Pain Points mit Loss Aversion
3. SOLUTION & USP (WARM) — 5-Schritt Prozess (Online-Termin → Festpreis → Aufmaß → Fertigung → Montage)
4. SOCIAL PROOF (WARM-COOL) — 3 Testimonials mit Ort (Region ${selRegion})
5. PROJECT SHOWCASE (COOL-WARM) — 3 Projekt-Beschreibungen
6. FAQ AEO (COOL) — 5 FAQs, Answer-First (erste 50 Worte = Snippet)
7. FINAL CTA (WARM) — Commitment-Trigger, Kontakt: 07192/9789012

Format: HTML mit Tailwind-Klassen.`;

      const html = await callGPT(config.openaiKey, PROMPTS.copywriter, prompt, 0.8);
      setPreview(html);
      setGenerated(prev => ({
        ...prev,
        landingPages: { ...prev.landingPages, [`${selService}__${selRegion}`]: { html, date: new Date().toISOString(), service: selService, region: selRegion } }
      }));
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">🏗️ LP Builder</h2>
        <p className="text-gray-500 text-sm">Heatmap-optimierte Landing Pages generieren</p>
      </div>

      {/* Section Architecture */}
      <Card title="LP-Architektur (7 Sektionen, Heatmap-basiert)">
        <div className="flex gap-1">
          {LP_SECTIONS.map(s => (
            <div key={s.id} className="flex-1 rounded-lg p-2 text-center" style={{ backgroundColor: s.color + '20', borderLeft: `3px solid ${s.color}` }}>
              <div className="text-white text-xs font-bold">{s.name}</div>
              <div className="text-[10px] mt-0.5" style={{ color: s.color }}>{s.heat}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Generator */}
      <Card title="Landing Page generieren">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-gray-500 text-xs block mb-1">Service</label>
            <select value={selService} onChange={e => setSelService(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
              {SH_SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-gray-500 text-xs block mb-1">Region (Score)</label>
            <select value={selRegion} onChange={e => setSelRegion(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
              {REGIONS.map(r => <option key={r.name} value={r.name}>{r.name} — Score {calcRegionScore(r)} ({r.tier})</option>)}
            </select>
          </div>
        </div>
        {error && <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}
        <Btn onClick={generateLP} disabled={loading}>{loading ? <><Spinner /> Generiere...</> : '🚀 Landing Page generieren'}</Btn>
      </Card>

      {/* Preview */}
      {preview && (
        <Card title="Vorschau">
          <div className="bg-white rounded-lg p-6 max-h-[600px] overflow-y-auto" dangerouslySetInnerHTML={{ __html: preview }} />
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 3: BULK MATRIX
// ═══════════════════════════════════════════════════════════════════════════
function BulkMatrixModule({ config, generated, setGenerated }) {
  const [generating, setGenerating] = useState(null);

  const generateOne = async (service, region) => {
    const key = `${service}__${region}`;
    setGenerating(key);
    try {
      const r = REGIONS.find(x => x.name === region);
      const prompt = `Erstelle eine kurze, SEO-optimierte Landing Page Zusammenfassung für: ${service} in ${region} (${r.einwohner} EW, KKI ${r.kki}). Schreinerhelden.de, Murrhardt. Format: HTML Snippet mit H1, Intro-Text, 3 USPs, CTA.`;
      const html = await callGPT(config.openaiKey, PROMPTS.copywriter, prompt, 0.7);
      setGenerated(prev => ({
        ...prev,
        landingPages: { ...prev.landingPages, [key]: { html, date: new Date().toISOString(), service, region } }
      }));
    } catch (e) { console.error(e); }
    setGenerating(null);
  };

  const missing = [];
  SH_SERVICES.forEach(s => REGIONS.forEach(r => {
    if (!generated.landingPages?.[`${s}__${r.name}`]) missing.push({ service: s, region: r.name });
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">⚡ Bulk Matrix</h2>
          <p className="text-gray-500 text-sm">{SH_SERVICES.length} Services × {REGIONS.length} Regionen = {SH_SERVICES.length * REGIONS.length} Kombinationen · {missing.length} fehlen</p>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-500 pb-2 pr-2 sticky left-0 bg-gray-900">Service</th>
                {REGIONS.map(r => (
                  <th key={r.name} className="text-center text-gray-500 pb-2 px-1 whitespace-nowrap">
                    <div>{r.name.length > 8 ? r.name.slice(0, 7) + '…' : r.name}</div>
                    <div className="text-[9px]" style={{ color: TIER_COLORS[r.tier] }}>{r.tier}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SH_SERVICES.map(s => (
                <tr key={s} className="border-b border-gray-800/50">
                  <td className="py-1.5 pr-2 text-gray-300 whitespace-nowrap sticky left-0 bg-gray-900">{s}</td>
                  {REGIONS.map(r => {
                    const key = `${s}__${r.name}`;
                    const has = generated.landingPages?.[key];
                    const isGen = generating === key;
                    return (
                      <td key={r.name} className="text-center py-1.5 px-1">
                        {isGen ? <Spinner /> : has ? (
                          <span className="text-emerald-500 cursor-default" title={`Generiert: ${new Date(has.date).toLocaleDateString('de')}`}>✓</span>
                        ) : (
                          <button onClick={() => generateOne(s, r.name)} disabled={!!generating} className="text-gray-700 hover:text-blue-400 disabled:opacity-30" title="Generieren">○</button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 4: CONTENT HUB
// ═══════════════════════════════════════════════════════════════════════════
function ContentHubModule({ config, generated, setGenerated }) {
  const [selLP, setSelLP] = useState('');
  const [selChannel, setSelChannel] = useState('gbp');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [log, setLog] = useState([]);

  const lpKeys = Object.keys(generated.landingPages || {});

  const channelPrompts = {
    gbp: 'Erstelle einen Google Business Profile Post (max 1500 Zeichen). Handwerker-Ton, lokal relevant, mit CTA.',
    instagram: 'Erstelle einen Instagram Post mit Caption (max 2200 Zeichen), 20 Hashtags, und einem Bildbeschreibungs-Vorschlag.',
    facebook: 'Erstelle einen Facebook Post, etwas länger als Instagram, mit Story-Element und CTA.',
    pinterest: 'Erstelle eine Pinterest Pin-Beschreibung (max 500 Zeichen) mit Keywords für Home Decor Suche.',
    tiktok: 'Erstelle ein TikTok Script (30-60 Sek), Workshop-Style, ASMR-Holzbearbeitung Vibes.',
    youtube: 'Erstelle ein YouTube Video Script (3-5 Min), mit Hook, Agenda, Content, CTA. SEO-Titel und Beschreibung.',
    houzz: 'Erstelle einen Houzz Projekt-Post, professionell für Designer/Architekten, mit technischen Details.',
    email: 'Erstelle einen Email Newsletter Abschnitt, persönlich von Mario, mit einem Projekt-Highlight.',
    googleads: 'Erstelle 3 Google Ads Textanzeigen (Responsive Search Ads): je 15 Headlines (30 Zeichen) + 4 Descriptions (90 Zeichen).',
    metaads: 'Erstelle Facebook/Instagram Ad Copy für 3-Layer Funnel: Awareness, Retargeting, Lead Gen.',
    linkedin: 'Erstelle einen LinkedIn Post, professionell aber nahbar, für Architekten und Interior Designer.',
  };

  const multiply = async () => {
    if (!selLP) return;
    setLoading(true); setError('');
    try {
      const lp = generated.landingPages[selLP];
      const channel = CHANNELS.find(c => c.id === selChannel);
      const prompt = `${channelPrompts[selChannel]}

Basierend auf dieser Landing Page:
SERVICE: ${lp.service}
REGION: ${lp.region}
INHALT (Zusammenfassung): ${lp.html.slice(0, 1500)}

Marke: Schreinerhelden, Murrhardt. Tel: 07192/9789012`;

      const content = await callGPT(config.openaiKey, PROMPTS.social, prompt, 0.8);
      setResult(content);
      const contentKey = `${selLP}__${selChannel}__${Date.now()}`;
      setGenerated(prev => ({
        ...prev,
        content: { ...prev.content, [contentKey]: { text: content, channel: selChannel, lp: selLP, date: new Date().toISOString() } }
      }));
      setLog(prev => [{ channel: channel.name, service: lp.service, region: lp.region, time: new Date().toLocaleTimeString('de') }, ...prev.slice(0, 19)]);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">✍️ Content Hub</h2>
        <p className="text-gray-500 text-sm">GPT-4o Content-Multiplizierer · LP → 11 Kanäle</p>
      </div>

      <Card title="Content generieren">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-gray-500 text-xs block mb-1">Landing Page Quelle</label>
            <select value={selLP} onChange={e => setSelLP(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
              <option value="">— Wählen —</option>
              {lpKeys.map(k => <option key={k} value={k}>{k.replace('__', ' → ')}</option>)}
            </select>
          </div>
          <div>
            <label className="text-gray-500 text-xs block mb-1">Kanal</label>
            <select value={selChannel} onChange={e => setSelChannel(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
              {CHANNELS.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
            </select>
          </div>
        </div>
        {error && <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}
        <Btn onClick={multiply} disabled={loading || !selLP}>{loading ? <><Spinner /> Generiere...</> : '🔄 Content multiplizieren'}</Btn>
      </Card>

      {result && (
        <Card title="Ergebnis">
          <pre className="text-gray-300 text-sm whitespace-pre-wrap bg-gray-800/50 rounded-lg p-4 max-h-96 overflow-y-auto">{result}</pre>
          <div className="mt-3"><Btn size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(result)}>📋 Kopieren</Btn></div>
        </Card>
      )}

      {log.length > 0 && (
        <Card title="Generation Log">
          <div className="space-y-1">
            {log.map((l, i) => (
              <div key={i} className="text-xs text-gray-500 flex gap-3"><span className="text-gray-600">{l.time}</span><span className="text-gray-400">{l.channel}</span><span className="text-gray-500">→ {l.service} · {l.region}</span></div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 5: CHANNELS
// ═══════════════════════════════════════════════════════════════════════════
function ChannelsModule({ config }) {
  const [channels, setChannels] = useState(CHANNELS);

  const toggle = (id) => setChannels(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">📡 Kanäle</h2>
        <p className="text-gray-500 text-sm">{channels.filter(c => c.active).length} von {channels.length} aktiv</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {channels.map(c => (
          <Card key={c.id} className={c.active ? 'border-emerald-800/50' : ''}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{c.emoji}</span>
                <div>
                  <div className="text-white text-sm font-medium">{c.name}</div>
                  <div className="text-gray-600 text-xs">{c.active ? 'Aktiv' : 'Inaktiv'}</div>
                </div>
              </div>
              <button onClick={() => toggle(c.id)} className={`w-10 h-6 rounded-full transition-colors ${c.active ? 'bg-emerald-600' : 'bg-gray-700'} relative`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${c.active ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 6: CALENDAR
// ═══════════════════════════════════════════════════════════════════════════
function CalendarModule({ config }) {
  const [posts, setPosts] = useState(() => {
    const p = [];
    const activeChannels = CHANNELS.filter(c => c.active);
    const today = new Date();
    let serviceIdx = 0, regionIdx = 0, channelIdx = 0;
    for (let d = 0; d < 30; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() + d);
      if (date.getDay() === 0 || date.getDay() === 6) continue; // Mo-Fr
      p.push({
        date: date.toISOString().split('T')[0],
        service: SH_SERVICES[serviceIdx % SH_SERVICES.length],
        region: REGIONS[regionIdx % REGIONS.length].name,
        channel: activeChannels[channelIdx % activeChannels.length]?.name || 'GBP',
        status: d < 3 ? 'published' : d < 7 ? 'scheduled' : 'planned',
      });
      serviceIdx++; regionIdx++; channelIdx++;
    }
    return p;
  });

  const statusColors = { published: 'text-emerald-400', scheduled: 'text-blue-400', planned: 'text-gray-500' };
  const statusLabels = { published: '✅', scheduled: '📅', planned: '○' };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">📅 Kalender</h2>
        <p className="text-gray-500 text-sm">30-Tage Posting-Plan · Auto-Rotation Service × Region × Kanal · Mo-Fr</p>
      </div>
      <Card>
        <div className="space-y-1">
          <div className="grid grid-cols-5 text-xs text-gray-600 pb-2 border-b border-gray-800 font-medium">
            <span>Datum</span><span>Service</span><span>Region</span><span>Kanal</span><span>Status</span>
          </div>
          {posts.map((p, i) => (
            <div key={i} className="grid grid-cols-5 text-xs py-1.5 border-b border-gray-800/30">
              <span className="text-gray-400">{new Date(p.date).toLocaleDateString('de', { weekday: 'short', day: '2-digit', month: '2-digit' })}</span>
              <span className="text-gray-300">{p.service}</span>
              <span className="text-gray-400">{p.region}</span>
              <span className="text-gray-400">{p.channel}</span>
              <span className={statusColors[p.status]}>{statusLabels[p.status]} {p.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 7: KEYWORDS
// ═══════════════════════════════════════════════════════════════════════════
function KeywordsModule({ config }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [serpResults, setSerpResults] = useState(null);
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('search');

  const searchKeywords = async () => {
    if (!query.trim()) return;
    setLoading('keywords'); setError('');
    try {
      const data = await callDataForSEO(config.dfsLogin, config.dfsPassword,
        'keywords_data/google_ads/search_volume/live', [{ keywords: [query], language_code: 'de', location_code: 2276 }]);
      setResults(data);
    } catch (e) { setError(e.message); }
    setLoading('');
  };

  const searchSERP = async () => {
    if (!query.trim()) return;
    setLoading('serp'); setError('');
    try {
      const data = await callDataForSEO(config.dfsLogin, config.dfsPassword,
        'serp/google/organic/live/advanced', [{ keyword: query, language_code: 'de', location_code: 2276, device: 'desktop', os: 'windows' }]);
      setSerpResults(data);
    } catch (e) { setError(e.message); }
    setLoading('');
  };

  const tabs = [
    { id: 'search', label: 'Keyword-Suche' },
    { id: 'serp', label: 'SERP Tracking' },
    { id: 'backlinks', label: 'Backlinks' },
    { id: 'audit', label: 'On-Page Audit' },
    { id: 'ai', label: 'AI Optimization' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">🔍 Keywords</h2>
        <p className="text-gray-500 text-sm">DataForSEO + GPT-4o Intelligence · 5 Module</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 px-3 py-2 text-xs rounded-md transition-colors ${tab === t.id ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}>{t.label}</button>
        ))}
      </div>

      {error && <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm rounded-lg p-3">{error}</div>}

      {/* Keyword Search Tab */}
      {tab === 'search' && (
        <Card title="Keyword Intelligence">
          <div className="flex gap-3 mb-4">
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchKeywords()} placeholder="z.B. Einbauschrank nach Maß Stuttgart" className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            <Btn onClick={searchKeywords} disabled={loading === 'keywords'}>{loading === 'keywords' ? <Spinner /> : '🔍 Suchen'}</Btn>
          </div>
          {results?.tasks?.[0]?.result && (
            <div className="space-y-2">
              {results.tasks[0].result.map((r, i) => (
                <div key={i} className="bg-gray-800/50 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <div className="text-white text-sm font-medium">{r.keyword}</div>
                    <div className="text-gray-500 text-xs">CPC: €{r.cpc || '–'} · Competition: {r.competition || '–'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-400 font-bold">{r.search_volume?.toLocaleString('de') || '–'}</div>
                    <div className="text-gray-600 text-xs">Suchvolumen/Monat</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!results && <EmptyState emoji="🔍" title="Keyword eingeben und suchen" desc="DataForSEO liefert Suchvolumen, CPC und Wettbewerb" />}
        </Card>
      )}

      {/* SERP Tab */}
      {tab === 'serp' && (
        <Card title="SERP Tracking">
          <div className="flex gap-3 mb-4">
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchSERP()} placeholder="Keyword für SERP-Analyse" className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            <Btn onClick={searchSERP} disabled={loading === 'serp'}>{loading === 'serp' ? <Spinner /> : '📊 SERP analysieren'}</Btn>
          </div>
          {serpResults?.tasks?.[0]?.result?.[0]?.items && (
            <div className="space-y-1">
              {serpResults.tasks[0].result[0].items.filter(i => i.type === 'organic').slice(0, 20).map((item, i) => {
                const isUs = item.domain?.includes('schreinerhelden') || item.domain?.includes('ihr-moebel-schreiner');
                return (
                  <div key={i} className={`flex items-center gap-3 py-2 px-3 rounded-lg text-sm ${isUs ? 'bg-emerald-900/20 border border-emerald-800/50' : 'bg-gray-800/30'}`}>
                    <span className={`w-6 text-center font-bold ${isUs ? 'text-emerald-400' : 'text-gray-600'}`}>{item.rank_group}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`truncate ${isUs ? 'text-emerald-400 font-medium' : 'text-white'}`}>{item.title}</div>
                      <div className="text-gray-600 text-xs truncate">{item.domain}</div>
                    </div>
                    {isUs && <Badge color="green">UNSERE SEITE</Badge>}
                  </div>
                );
              })}
            </div>
          )}
          {!serpResults && <EmptyState emoji="📊" title="SERP-Position tracken" desc="Finde heraus wo schreinerhelden.de rankt" />}
        </Card>
      )}

      {/* Backlinks Tab */}
      {tab === 'backlinks' && (
        <Card title="Backlink-Analyse">
          <EmptyState emoji="🔗" title="Backlink-Analyse" desc="Domain eingeben um Backlinks, Referring Domains und Anchors zu analysieren" />
        </Card>
      )}

      {/* Audit Tab */}
      {tab === 'audit' && (
        <Card title="On-Page Audit">
          <EmptyState emoji="🩺" title="On-Page Audit" desc="50-Seiten Crawl starten um technische SEO-Probleme zu finden" />
        </Card>
      )}

      {/* AI Mode Tab */}
      {tab === 'ai' && (
        <Card title="AI Optimization (Google AI Mode)">
          <EmptyState emoji="🤖" title="AI Mode Sichtbarkeit" desc="Prüfe ob deine Inhalte in Google AI Mode erscheinen" />
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 8: COMPETITORS
// ═══════════════════════════════════════════════════════════════════════════
function CompetitorsModule({ config }) {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!domain.trim()) return;
    setLoading(true); setError('');
    try {
      const prompt = `Analysiere diesen Wettbewerber für Schreinerhelden (Premium-Schreinerei Murrhardt, Region Stuttgart):
DOMAIN: ${domain}

Erstelle eine Analyse mit:
1. STÄRKEN (was machen sie gut?)
2. SCHWÄCHEN (wo sind sie verwundbar?)
3. CONTENT GAPS (welche Inhalte fehlen ihnen, die wir erstellen können?)
4. KEYWORD OPPORTUNITIES (Keywords die sie ranken und wir nicht)
5. EMPFEHLUNG (konkrete Maßnahmen für Schreinerhelden)

Sei spezifisch und actionable.`;

      const content = await callGPT(config.openaiKey, PROMPTS.strategist, prompt, 0.7);
      setResult(content);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">⚔️ Wettbewerber</h2>
        <p className="text-gray-500 text-sm">GPT-4o + DataForSEO Competitor Intelligence</p>
      </div>
      <Card title="Wettbewerber analysieren">
        <div className="flex gap-3 mb-4">
          <input value={domain} onChange={e => setDomain(e.target.value)} onKeyDown={e => e.key === 'Enter' && analyze()} placeholder="z.B. holzconnection.de" className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          <Btn onClick={analyze} disabled={loading}>{loading ? <><Spinner /> Analysiere...</> : '⚔️ Analysieren'}</Btn>
        </div>
        {error && <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}
      </Card>
      {result && (
        <Card title={`Analyse: ${domain}`}>
          <pre className="text-gray-300 text-sm whitespace-pre-wrap">{result}</pre>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 9: SCHEMA.ORG
// ═══════════════════════════════════════════════════════════════════════════
function SchemaModule({ config }) {
  const [selService, setSelService] = useState(SH_SERVICES[0]);
  const [selRegion, setSelRegion] = useState(REGIONS[0].name);
  const [schemas, setSchemas] = useState(null);

  const generate = () => {
    const region = REGIONS.find(r => r.name === selRegion);
    const localBusiness = {
      "@context": "https://schema.org", "@type": "LocalBusiness",
      "name": "Schreinerhelden", "image": "https://schreinerhelden.de/logo.jpg",
      "telephone": "+49-7192-9789012",
      "address": { "@type": "PostalAddress", "streetAddress": "Lindenstraße 9-15", "addressLocality": "Murrhardt", "postalCode": "71540", "addressRegion": "Baden-Württemberg", "addressCountry": "DE" },
      "areaServed": { "@type": "City", "name": selRegion },
      "priceRange": "€€€",
    };
    const service = {
      "@context": "https://schema.org", "@type": "Service",
      "name": selService, "provider": { "@type": "LocalBusiness", "name": "Schreinerhelden" },
      "areaServed": { "@type": "City", "name": selRegion },
      "description": `${selService} nach Maß vom Schreinermeister in ${selRegion} und Umgebung.`,
    };
    const faq = {
      "@context": "https://schema.org", "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": `Was kostet ein ${selService} in ${selRegion}?`, "acceptedAnswer": { "@type": "Answer", "text": `Die Kosten für einen ${selService} in ${selRegion} hängen von Größe, Material und Ausstattung ab. Bei Schreinerhelden erhalten Sie nach einem kostenlosen Aufmaß-Termin einen transparenten Festpreis.` } },
        { "@type": "Question", "name": `Wie lange dauert die Fertigung eines ${selService}?`, "acceptedAnswer": { "@type": "Answer", "text": `Die Fertigung eines ${selService} dauert in der Regel 4-6 Wochen ab Auftragsbestätigung. Montage vor Ort in ${selRegion} erfolgt an einem Tag.` } },
      ],
    };
    const breadcrumb = {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://schreinerhelden.de" },
        { "@type": "ListItem", "position": 2, "name": selService, "item": `https://schreinerhelden.de/${selService.toLowerCase().replace(/\s+/g, '-')}` },
        { "@type": "ListItem", "position": 3, "name": selRegion, "item": `https://schreinerhelden.de/${selService.toLowerCase().replace(/\s+/g, '-')}/${selRegion.toLowerCase().replace(/\s+/g, '-')}` },
      ],
    };
    setSchemas({ localBusiness, service, faq, breadcrumb });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">🏷️ Schema.org</h2>
        <p className="text-gray-500 text-sm">Auto-generiert: LocalBusiness, Service, FAQPage, BreadcrumbList</p>
      </div>
      <Card title="Schema generieren">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-gray-500 text-xs block mb-1">Service</label>
            <select value={selService} onChange={e => setSelService(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
              {SH_SERVICES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-gray-500 text-xs block mb-1">Region</label>
            <select value={selRegion} onChange={e => setSelRegion(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
              {REGIONS.map(r => <option key={r.name}>{r.name}</option>)}
            </select>
          </div>
        </div>
        <Btn onClick={generate}>🏷️ Schema generieren</Btn>
      </Card>
      {schemas && Object.entries(schemas).map(([key, schema]) => (
        <Card key={key} title={key} actions={<Btn size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(JSON.stringify(schema, null, 2))}>📋</Btn>}>
          <pre className="text-gray-400 text-xs overflow-x-auto bg-gray-800/50 rounded-lg p-3 max-h-48 overflow-y-auto">{JSON.stringify(schema, null, 2)}</pre>
        </Card>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 10: AGENCY TEAM
// ═══════════════════════════════════════════════════════════════════════════
function AgencyTeamModule() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">👥 Agency Team</h2>
        <p className="text-gray-500 text-sm">16 KI-Spezialisten simulieren ein komplettes Agenturteam</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {AGENCY_TEAM.map(m => (
          <Card key={m.id}>
            <div className="flex items-start gap-4">
              <div className="text-3xl">{m.emoji}</div>
              <div>
                <div className="text-white font-semibold">{m.name}</div>
                <div className="text-blue-400 text-sm">{m.role}</div>
                <div className="text-gray-500 text-xs mt-1">{m.desc}</div>
              </div>
              <Badge color="blue">KI</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 11: SETTINGS
// ═══════════════════════════════════════════════════════════════════════════
function SettingsModule({ config, setConfig, generated }) {
  const [exportData, setExportData] = useState('');

  const exportJSON = () => {
    const data = { version: APP_VERSION, exported: new Date().toISOString(), generated, config: { ...config, openaiKey: '***', dfsPassword: '***' } };
    setExportData(JSON.stringify(data, null, 2));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">⚙️ Settings</h2>
        <p className="text-gray-500 text-sm">API-Keys, Export, System-Status</p>
      </div>

      {/* API Keys */}
      <Card title="API Credentials">
        <div className="space-y-4">
          <div>
            <label className="text-gray-500 text-xs block mb-1">OpenAI API Key</label>
            <input value={config.openaiKey} onChange={e => setConfig(prev => ({ ...prev, openaiKey: e.target.value }))} placeholder="sk-..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm font-mono focus:outline-none focus:border-blue-500" type="password" />
          </div>
          <div>
            <label className="text-gray-500 text-xs block mb-1">DataForSEO Login (Email)</label>
            <input value={config.dfsLogin} onChange={e => setConfig(prev => ({ ...prev, dfsLogin: e.target.value }))} placeholder="your@email.com" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-gray-500 text-xs block mb-1">DataForSEO Passwort</label>
            <input value={config.dfsPassword} onChange={e => setConfig(prev => ({ ...prev, dfsPassword: e.target.value }))} placeholder="API Passwort" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm font-mono focus:outline-none focus:border-blue-500" type="password" />
          </div>
        </div>
      </Card>

      {/* System Status */}
      <Card title="System Status">
        <div className="space-y-2">
          {[
            { label: 'OpenAI GPT-4o', status: config.openaiKey ? 'connected' : 'missing' },
            { label: 'DataForSEO', status: config.dfsLogin && config.dfsPassword ? 'connected' : 'missing' },
            { label: 'Landing Pages', status: `${Object.keys(generated.landingPages || {}).length} generiert` },
            { label: 'Content Pieces', status: `${Object.keys(generated.content || {}).length} generiert` },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between py-1.5">
              <span className="text-gray-400 text-sm">{s.label}</span>
              <span className={`text-sm ${s.status === 'connected' ? 'text-emerald-400' : s.status === 'missing' ? 'text-red-400' : 'text-gray-500'}`}>
                {s.status === 'connected' ? '🟢 Verbunden' : s.status === 'missing' ? '🔴 Fehlt' : s.status}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Export */}
      <Card title="Export" actions={<Btn size="sm" variant="secondary" onClick={exportJSON}>📦 JSON Export</Btn>}>
        {exportData ? (
          <div>
            <pre className="text-gray-400 text-xs bg-gray-800/50 rounded-lg p-3 max-h-48 overflow-y-auto">{exportData.slice(0, 2000)}{exportData.length > 2000 ? '\n...' : ''}</pre>
            <div className="mt-2"><Btn size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(exportData)}>📋 Kopieren</Btn></div>
          </div>
        ) : (
          <p className="text-gray-600 text-sm">Klicke "JSON Export" um alle Daten zu exportieren.</p>
        )}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  // ─── Auth State (localStorage persist) ─────────────────────────────────
  const [user, setUser] = useState(() => {
    try { const u = localStorage.getItem('scc_user'); return u ? JSON.parse(u) : null; } catch { return null; }
  });

  // ─── Navigation ────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('dashboard');

  // ─── API Config (localStorage persist) ─────────────────────────────────
  const [config, setConfig] = useState(() => {
    try {
      return {
        openaiKey: localStorage.getItem('scc_openai_key') || '',
        dfsLogin: localStorage.getItem('scc_dfs_login') || '',
        dfsPassword: localStorage.getItem('scc_dfs_password') || '',
      };
    } catch { return { openaiKey: '', dfsLogin: '', dfsPassword: '' }; }
  });

  // ─── Generated Content State ───────────────────────────────────────────
  const [generated, setGenerated] = useState(() => {
    try { const g = localStorage.getItem('scc_generated'); return g ? JSON.parse(g) : { landingPages: {}, content: {} }; } catch { return { landingPages: {}, content: {} }; }
  });

  // ─── Persist to localStorage ───────────────────────────────────────────
  useEffect(() => { try { if (user) localStorage.setItem('scc_user', JSON.stringify(user)); else localStorage.removeItem('scc_user'); } catch {} }, [user]);
  useEffect(() => { try { localStorage.setItem('scc_openai_key', config.openaiKey); localStorage.setItem('scc_dfs_login', config.dfsLogin); localStorage.setItem('scc_dfs_password', config.dfsPassword); } catch {} }, [config]);
  useEffect(() => { try { localStorage.setItem('scc_generated', JSON.stringify(generated)); } catch {} }, [generated]);

  // ─── Login/Logout ──────────────────────────────────────────────────────
  const handleLogin = (u) => setUser(u);
  const handleLogout = () => { setUser(null); localStorage.removeItem('scc_user'); };

  // ─── Render Login Screen if not logged in ──────────────────────────────
  if (!user) return <LoginScreen onLogin={handleLogin} />;

  // ─── Module Router ─────────────────────────────────────────────────────
  const renderModule = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardModule config={config} generated={generated} />;
      case 'lpbuilder': return <LPBuilderModule config={config} generated={generated} setGenerated={setGenerated} />;
      case 'bulkmatrix': return <BulkMatrixModule config={config} generated={generated} setGenerated={setGenerated} />;
      case 'contenthub': return <ContentHubModule config={config} generated={generated} setGenerated={setGenerated} />;
      case 'channels': return <ChannelsModule config={config} />;
      case 'calendar': return <CalendarModule config={config} />;
      case 'keywords': return <KeywordsModule config={config} />;
      case 'competitors': return <CompetitorsModule config={config} />;
      case 'schema': return <SchemaModule config={config} />;
      case 'agencyteam': return <AgencyTeamModule />;
      case 'settings': return <SettingsModule config={config} setConfig={setConfig} generated={generated} />;
      default: return <DashboardModule config={config} generated={generated} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Sidebar active={activeTab} onNav={setActiveTab} user={user} onLogout={handleLogout} />
      <main className="ml-56 p-8 max-w-6xl">
        {renderModule()}
      </main>
    </div>
  );
}
