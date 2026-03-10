import { log } from './logger.js';

function getCredentials() {
  const { DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD } = process.env;
  if (!DATAFORSEO_LOGIN || !DATAFORSEO_PASSWORD) {
    throw new Error('DataForSEO credentials not configured');
  }
  return Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString('base64');
}

async function dfsRequest(endpoint, body) {
  const credentials = getCredentials();
  const res = await fetch(`https://api.dataforseo.com/v3/${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`DataForSEO Error ${res.status}`);
  const data = await res.json();

  if (data.status_code !== 20000) {
    log.error('DFS API error:', data.status_message);
    throw new Error(data.status_message || 'DataForSEO request failed');
  }

  return data;
}

// ── Keyword search volume ──
export async function searchVolume(keywords, location = 2276) {
  return dfsRequest('keywords_data/google_ads/search_volume/live', [{
    keywords: Array.isArray(keywords) ? keywords : [keywords],
    location_code: location,
    language_code: 'de',
  }]);
}

// ── Keyword suggestions (seed → related) ──
export async function keywordSuggestions(keyword, location = 2276) {
  return dfsRequest('keywords_data/google_ads/keywords_for_keywords/live', [{
    keywords: [keyword],
    location_code: location,
    language_code: 'de',
    sort_by: 'search_volume',
    limit: 50,
  }]);
}

// ── SERP organic results ──
export async function serpOrganic(keyword, location = 2276, depth = 20) {
  return dfsRequest('serp/google/organic/live/advanced', [{
    keyword,
    location_code: location,
    language_code: 'de',
    device: 'desktop',
    os: 'windows',
    depth,
  }]);
}

// ── Backlinks summary for a domain ──
export async function backlinksSummary(target) {
  return dfsRequest('backlinks/summary/live', [{
    target,
    internal_list_limit: 0,
  }]);
}

// ── Ranked keywords for a domain ──
export async function rankedKeywords(target, location = 2276, limit = 100) {
  return dfsRequest('dataforseo_labs/google/ranked_keywords/live', [{
    target,
    location_code: location,
    language_code: 'de',
    limit,
    order_by: ['keyword_data.keyword_info.search_volume,desc'],
  }]);
}

// ── Related keywords (for longtails) ──
export async function relatedKeywords(keyword, location = 2276) {
  return dfsRequest('dataforseo_labs/google/related_keywords/live', [{
    keyword,
    location_code: location,
    language_code: 'de',
    limit: 50,
    depth: 2,
  }]);
}

// ── People Also Ask ──
export async function peopleAlsoAsk(keyword, location = 2276) {
  return dfsRequest('serp/google/organic/live/advanced', [{
    keyword,
    location_code: location,
    language_code: 'de',
    device: 'desktop',
    depth: 10,
  }]);
}
