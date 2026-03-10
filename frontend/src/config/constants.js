// ═══════════════════════════════════════════════════════════════════
// SEO Command Center v5.0 — Constants
// Schreinerhelden GmbH & Co. KG
// ═══════════════════════════════════════════════════════════════════

export const APP = {
  name: 'SEO Command Center',
  version: 'v5.1',
  subtitle: 'Analyse · Content · Tracking',
};

export const USERS = [
  { username: 'admin', password: 'schreinerhelden2026', role: 'Admin' },
  { username: 'mario', password: 'meos2026!', role: 'Owner' },
  { username: 'team', password: 'seoTeam2026', role: 'Team' },
];

// ── 18 Regions with scoring data ──
export const REGIONS = [
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

export const TIER_COLORS = {
  'Maximal': '#ef4444',
  'Sehr hoch': '#f97316',
  'Hoch': '#eab308',
  'Mittel': '#22c55e',
  'Basis': '#3b82f6',
};

// ── Services (Schreinerhelden = B2C, IMS = B2B) ──
export const SH_SERVICES = [
  'Begehbarer Kleiderschrank', 'Dachschrägenschrank', 'Garderobe',
  'Kleiderschrank', 'Stauraumschrank', 'Treppenschrank', 'Waschmaschinenschrank',
];

export const IMS_SERVICES = [
  'Einbauschrank', 'Dachschrägenschrank', 'Begehbarer Kleiderschrank',
  'Garderobe nach Maß', 'Schränke nach Maß',
];

// ── Domain Territory Split ──
export const DOMAINS = {
  sh: { name: 'Schreinerhelden', url: 'schreinerhelden.de', territory: 'Produkt-Keywords (B2C)' },
  ims: { name: 'Ihr Möbel-Schreiner', url: 'ihr-moebel-schreiner.de', territory: 'Service-Keywords (B2B/Architekten)' },
};

// ── Region Score Calculation ──
export const calcRegionScore = (r) =>
  ((r.einwohner / 1000) * (r.kki / 100) * (1 / (1 + r.km / 50))).toFixed(1);

// ── Navigation ──
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'analyse', label: 'Analyse', icon: '🔍' },
  { id: 'diagnose', label: 'Diagnose', icon: '⚔️' },
  { id: 'keywords', label: 'Keywords', icon: '🎯' },
  { id: 'content', label: 'Content', icon: '✍️' },
  { id: 'tracking', label: 'Tracking', icon: '📈' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];
