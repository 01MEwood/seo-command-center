// ═══════════════════════════════════════════════════════════════════
// OpenAI Service — Logik only. Prompts → see prompts.js
// ═══════════════════════════════════════════════════════════════════

import { log } from './logger.js';
import * as P from './prompts.js';

let openaiInstance = null;

async function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY in .env');
  }
  if (!openaiInstance) {
    const OpenAI = (await import('openai')).default;
    openaiInstance = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiInstance;
}

export async function chat(systemPrompt, userPrompt, options = {}) {
  const { temperature = 0.7, maxTokens = 2000, json = false } = options;
  const openai = await getOpenAI();

  const params = {
    model: 'gpt-4o',
    temperature,
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  };

  if (json) params.response_format = { type: 'json_object' };

  const completion = await openai.chat.completions.create(params);
  return completion.choices[0].message.content;
}

// ── Longtail Keywords ──
export async function generateLongtails(keyword, domain = 'sh') {
  const audience = domain === 'sh'
    ? 'Privatkunden, Eigenheimbesitzer, Region Stuttgart'
    : 'Architekten, Bauträger, Gewerbetreibende';

  const result = await chat(P.LONGTAILS_SYSTEM, P.LONGTAILS_USER(keyword, audience), { json: true, temperature: 0.8 });
  return JSON.parse(result);
}

// ── AEO/People Also Ask Questions ──
export async function generateAeoQuestions(keyword, serpData = '') {
  const result = await chat(P.AEO_SYSTEM, P.AEO_USER(keyword, serpData), { json: true, temperature: 0.7 });
  return JSON.parse(result);
}

// ── Content Draft (Markdown) ──
export async function generateContentDraft(keyword, region, serpData, longtails) {
  return await chat(P.CONTENT_DRAFT_SYSTEM, P.CONTENT_DRAFT_USER(keyword, region, serpData, longtails), { temperature: 0.8, maxTokens: 4000 });
}

// ── HTML Landing Page (Elementor-ready) ──
export async function generateHtmlLandingPage(keyword, region, service, serpData, longtails) {
  return await chat(P.LANDING_PAGE_SYSTEM, P.LANDING_PAGE_USER(keyword, region, service, serpData, longtails), { temperature: 0.8, maxTokens: 8000 });
}

// ── Wettbewerber-Diagnose ──
export async function generateCompetitorDiagnosis(keyword, region, serpResults, ourData, competitorData) {
  const result = await chat(P.DIAGNOSIS_SYSTEM, P.DIAGNOSIS_USER(keyword, region, serpResults, ourData, competitorData), { json: true, temperature: 0.7, maxTokens: 3000 });
  return JSON.parse(result);
}
