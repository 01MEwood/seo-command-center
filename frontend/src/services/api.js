// ═══════════════════════════════════════════════════════════════════
// API Service — All calls routed through backend
// No API keys in the browser. Ever.
// ═══════════════════════════════════════════════════════════════════

const BASE = '/api';

async function request(path, options = {}) {
  const { method = 'GET', body, timeout = 60000 } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || `HTTP ${res.status}`);
    }

    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

// ── Health ──
export const health = () => request('/health');

// ── Auth ──
export const authLogin = (email, password) =>
  request('/auth/login', { method: 'POST', body: { email, password } });

export const authUsers = () => request('/auth/users');

export const authCreateUser = (email, name, password, role) =>
  request('/auth/users', { method: 'POST', body: { email, name, password, role } });

export const authUpdateUser = (id, data) =>
  request(`/auth/users/${id}`, { method: 'PATCH', body: data });

export const authDeleteUser = (id) =>
  request(`/auth/users/${id}`, { method: 'DELETE' });

// ── SERP Analysis (DataForSEO) ──
export const serpAnalyze = (keyword, location = 2276) =>
  request('/serp/analyze', { method: 'POST', body: { keyword, location } });

// ── Keyword Research (DataForSEO) ──
export const keywordVolume = (keywords, location = 2276) =>
  request('/keywords/volume', { method: 'POST', body: { keywords, location } });

export const keywordSuggestions = (keyword, location = 2276) =>
  request('/keywords/suggestions', { method: 'POST', body: { keyword, location } });

export const keywordRelated = (keyword, location = 2276) =>
  request('/keywords/related', { method: 'POST', body: { keyword, location } });

// ── Competitor Analysis ──
export const competitorBacklinks = (target) =>
  request('/competitors/backlinks', { method: 'POST', body: { target } });

export const competitorKeywords = (target, location = 2276) =>
  request('/competitors/keywords', { method: 'POST', body: { target, location } });

// ── Ranking Pipeline (the new core feature) ──
export const pipelineRun = (keyword, region, domain = 'sh') =>
  request('/pipeline/run', { method: 'POST', body: { keyword, region, domain }, timeout: 120000 });

export const pipelineHistory = () =>
  request('/pipeline/history');

export const pipelineDetail = (id) =>
  request(`/pipeline/${id}`);

export const pipelineRescan = (id) =>
  request(`/pipeline/${id}/rescan`, { method: 'POST', timeout: 120000 });

// ── AI Content Generation ──
export const aiContent = (keyword, context, template = 'article') =>
  request('/ai/content', { method: 'POST', body: { keyword, context, template }, timeout: 90000 });

export const aiLandingPage = (keyword, region, service, domain = 'sh') =>
  request('/ai/landing-page', { method: 'POST', body: { keyword, region, service, domain }, timeout: 180000 });

export const aiCompetitorDiagnosis = (keyword, region) =>
  request('/ai/competitor-diagnosis', { method: 'POST', body: { keyword, region }, timeout: 120000 });

export const aiLongtails = (seedKeyword, domain = 'sh') =>
  request('/ai/longtails', { method: 'POST', body: { seedKeyword, domain } });

export const aiAeoQuestions = (keyword) =>
  request('/ai/aeo-questions', { method: 'POST', body: { keyword } });

export const aiSocial = (channel, keyword, region, lpSummary) =>
  request('/ai/social', { method: 'POST', body: { channel, keyword, region, lpSummary }, timeout: 90000 });

export const aiSocialBulk = (keyword, region, lpSummary, channels) =>
  request('/ai/social/bulk', { method: 'POST', body: { keyword, region, lpSummary, channels }, timeout: 180000 });

// ── Google Search Console ──
export const gscQueries = (domain) =>
  request(`/gsc/${domain}`);

export const gscPages = (domain) =>
  request(`/gsc/${domain}/pages`);

// ── PageSpeed ──
export const pagespeed = (url) =>
  request(`/pagespeed/${encodeURIComponent(url)}`);

// ── Tracking (position history) ──
export const trackingList = () =>
  request('/tracking');

export const trackingAdd = (keyword, domain, region) =>
  request('/tracking', { method: 'POST', body: { keyword, domain, region } });

export const trackingHistory = (id) =>
  request(`/tracking/${id}/history`);

export const trackingRefresh = () =>
  request('/tracking/refresh', { method: 'POST', timeout: 120000 });

// ── AI Citation Monitor ──
export const citationCheck = (query, keyword, region) =>
  request('/citations/check', { method: 'POST', body: { query, keyword, region }, timeout: 120000 });

export const citationQueries = () =>
  request('/citations/queries');

export const citationDashboard = () =>
  request('/citations/dashboard');

export const citationBulk = (queries) =>
  request('/citations/bulk', { method: 'POST', body: { queries }, timeout: 300000 });

// ── Prompt Editor ──
export const promptsList = () =>
  request('/prompts');

export const promptSave = (key, value) =>
  request(`/prompts/${key}`, { method: 'PUT', body: { value } });

export const promptReset = (key) =>
  request(`/prompts/${key}`, { method: 'DELETE' });

// ── Schema.org ──
export const schemaGenerate = (keyword, region, domain, types, options = {}) =>
  request('/schema/generate', {
    method: 'POST',
    body: { keyword, region, domain, types, ...options },
    timeout: 60000,
  });

export const schemaValidate = (jsonld) =>
  request('/schema/validate', { method: 'POST', body: { jsonld } });
