// ═══════════════════════════════════════════════════════════════════
// OpenAI Service — Logik only. Prompts → see prompts.js
// ═══════════════════════════════════════════════════════════════════

import { log } from './logger.js';
import * as P from './prompts.js';
import { PrismaClient } from '@prisma/client';

let openaiInstance = null;
let promptOverrides = {};
let overridesLoadedAt = 0;

// Load prompt overrides from DB (cache for 60s)
async function loadOverrides() {
  const now = Date.now();
  if (now - overridesLoadedAt < 60000) return promptOverrides;
  try {
    const prisma = new PrismaClient();
    const rows = await prisma.promptOverride.findMany();
    await prisma.$disconnect();
    promptOverrides = {};
    for (const r of rows) promptOverrides[r.key] = r.value;
    overridesLoadedAt = now;
  } catch (e) {
    log.warn('Failed to load prompt overrides:', e.message);
  }
  return promptOverrides;
}

// Get prompt value: override if exists, else default
async function getPrompt(key) {
  const overrides = await loadOverrides();
  return overrides[key] || P[key];
}

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

  const sys = await getPrompt('LONGTAILS_SYSTEM');
  const result = await chat(sys, P.LONGTAILS_USER(keyword, audience), { json: true, temperature: 0.8 });
  return JSON.parse(result);
}

// ── AEO/People Also Ask Questions ──
export async function generateAeoQuestions(keyword, serpData = '') {
  const sys = await getPrompt('AEO_SYSTEM');
  const result = await chat(sys, P.AEO_USER(keyword, serpData), { json: true, temperature: 0.7 });
  return JSON.parse(result);
}

// ── Content Draft (Markdown) ──
export async function generateContentDraft(keyword, region, serpData, longtails) {
  const sys = await getPrompt('CONTENT_DRAFT_SYSTEM');
  return await chat(sys, P.CONTENT_DRAFT_USER(keyword, region, serpData, longtails), { temperature: 0.8, maxTokens: 4000 });
}

// ── HTML Landing Page (Elementor-ready) ──
export async function generateHtmlLandingPage(keyword, region, service, serpData, longtails) {
  const sys = await getPrompt('LANDING_PAGE_SYSTEM');
  return await chat(sys, P.LANDING_PAGE_USER(keyword, region, service, serpData, longtails), { temperature: 0.8, maxTokens: 8000 });
}

// ── Wettbewerber-Diagnose ──
export async function generateCompetitorDiagnosis(keyword, region, serpResults, ourData, competitorData) {
  const sys = await getPrompt('DIAGNOSIS_SYSTEM');
  const result = await chat(sys, P.DIAGNOSIS_USER(keyword, region, serpResults, ourData, competitorData), { json: true, temperature: 0.7, maxTokens: 3000 });
  return JSON.parse(result);
}

// ── Social Content Multiplier ──
export async function generateSocialContent(channel, keyword, region, lpSummary) {
  const sys = await getPrompt('SOCIAL_SYSTEM');
  const userPrompt = P.SOCIAL_MULTIPLIER_USER(channel, keyword, region, lpSummary);
  const isJson = ['instagram', 'pinterest'].includes(channel);
  const result = await chat(sys, userPrompt, {
    temperature: 0.8,
    maxTokens: 2000,
    json: isJson,
  });
  return isJson ? JSON.parse(result) : result;
}
