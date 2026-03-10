import { Router } from 'express';
import * as ai from '../services/openai.js';
import { log } from '../services/logger.js';

const router = Router();

const OUR_BRANDS = ['schreinerhelden', 'ihr möbel-schreiner', 'ihr-moebel-schreiner', 'mario esch'];

function analyzeMention(text) {
  const lower = text.toLowerCase();
  for (const brand of OUR_BRANDS) {
    if (lower.includes(brand)) {
      // Determine mention type
      const sentences = text.split(/[.!?]+/).filter(s => s.toLowerCase().includes(brand));
      const snippet = sentences[0]?.trim().slice(0, 300) || '';

      if (lower.includes('empfehl') || lower.includes('recommend') || lower.includes('top ')) {
        return { mentioned: true, mentionType: 'recommendation', snippet };
      }
      if (lower.includes('laut ') || lower.includes('according') || lower.includes('quelle')) {
        return { mentioned: true, mentionType: 'direct_citation', snippet };
      }
      return { mentioned: true, mentionType: 'passing_mention', snippet };
    }
  }
  return { mentioned: false, mentionType: 'not_found', snippet: null };
}

function extractCompetitors(text) {
  // Common competitors in the Schreiner/furniture space Stuttgart region
  const knownCompetitors = [
    'cabinet', 'holzconnection', 'schreinerei grimm', 'juliangrimm', 'dachschrägenmöbel kopf',
    'kopf gmbh', 'mu-massmoebel', 'holzmöblerei', 'elha', 'kieppe', 'held schreinerei',
    'nobilia', 'ikea', 'höffner', 'roller', 'xxxlutz', 'poco',
  ];
  const lower = text.toLowerCase();
  return knownCompetitors.filter(c => lower.includes(c));
}

// ── POST /api/citations/check — Check a single query across AI engines ──
router.post('/check', async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { query, keyword, region } = req.body;
    if (!query) return res.status(400).json({ error: 'Query required' });

    log.info(`Citation check: "${query}"`);

    // Save or find the query
    let cq = await prisma.citationQuery.findUnique({ where: { query } });
    if (!cq) {
      cq = await prisma.citationQuery.create({
        data: { query, keyword: keyword || query, region: region || '' },
      });
    }

    const results = {};

    // ── Check via GPT-4o (simulates ChatGPT) ──
    try {
      const chatgptResponse = await ai.chat(
        'Du bist ein hilfreicher Assistent. Beantworte die Frage so wie ChatGPT es tun würde — ehrlich, informativ, mit konkreten Empfehlungen wenn passend. Antworte auf Deutsch.',
        query,
        { temperature: 0.7, maxTokens: 1500 }
      );

      const analysis = analyzeMention(chatgptResponse);
      const competitors = extractCompetitors(chatgptResponse);

      await prisma.citationCheck.create({
        data: {
          citationQueryId: cq.id,
          engine: 'chatgpt',
          mentioned: analysis.mentioned,
          mentionType: analysis.mentionType,
          snippet: analysis.snippet,
          competitorsMentioned: JSON.stringify(competitors),
          fullResponse: chatgptResponse.slice(0, 5000),
        },
      });

      results.chatgpt = {
        mentioned: analysis.mentioned,
        mentionType: analysis.mentionType,
        snippet: analysis.snippet,
        competitors,
        responsePreview: chatgptResponse.slice(0, 500),
      };
    } catch (e) {
      results.chatgpt = { error: e.message };
      log.warn('ChatGPT citation check failed:', e.message);
    }

    // ── Check via GPT-4o with Perplexity-style prompt ──
    try {
      const perplexityResponse = await ai.chat(
        'Du bist eine AI-Suchmaschine wie Perplexity. Beantworte die Frage mit konkreten Fakten, nenne spezifische Unternehmen und Anbieter wenn relevant. Gib Quellen an. Antworte auf Deutsch. Fokus auf Region Stuttgart / Baden-Württemberg.',
        query,
        { temperature: 0.5, maxTokens: 1500 }
      );

      const analysis = analyzeMention(perplexityResponse);
      const competitors = extractCompetitors(perplexityResponse);

      await prisma.citationCheck.create({
        data: {
          citationQueryId: cq.id,
          engine: 'perplexity',
          mentioned: analysis.mentioned,
          mentionType: analysis.mentionType,
          snippet: analysis.snippet,
          competitorsMentioned: JSON.stringify(competitors),
          fullResponse: perplexityResponse.slice(0, 5000),
        },
      });

      results.perplexity = {
        mentioned: analysis.mentioned,
        mentionType: analysis.mentionType,
        snippet: analysis.snippet,
        competitors,
        responsePreview: perplexityResponse.slice(0, 500),
      };
    } catch (e) {
      results.perplexity = { error: e.message };
      log.warn('Perplexity citation check failed:', e.message);
    }

    // ── Check via GPT-4o with Gemini-style prompt ──
    try {
      const geminiResponse = await ai.chat(
        'Du bist Google Gemini. Beantworte die Frage ausführlich und nenne konkrete lokale Anbieter wenn die Frage nach Services oder Unternehmen fragt. Antworte auf Deutsch.',
        query,
        { temperature: 0.6, maxTokens: 1500 }
      );

      const analysis = analyzeMention(geminiResponse);
      const competitors = extractCompetitors(geminiResponse);

      await prisma.citationCheck.create({
        data: {
          citationQueryId: cq.id,
          engine: 'gemini',
          mentioned: analysis.mentioned,
          mentionType: analysis.mentionType,
          snippet: analysis.snippet,
          competitorsMentioned: JSON.stringify(competitors),
          fullResponse: geminiResponse.slice(0, 5000),
        },
      });

      results.gemini = {
        mentioned: analysis.mentioned,
        mentionType: analysis.mentionType,
        snippet: analysis.snippet,
        competitors,
        responsePreview: geminiResponse.slice(0, 500),
      };
    } catch (e) {
      results.gemini = { error: e.message };
      log.warn('Gemini citation check failed:', e.message);
    }

    // Calculate Share of AI Voice
    const engines = ['chatgpt', 'perplexity', 'gemini'];
    const checked = engines.filter(e => results[e] && !results[e].error);
    const mentioned = checked.filter(e => results[e].mentioned);
    const shareOfVoice = checked.length > 0 ? Math.round((mentioned.length / checked.length) * 100) : 0;

    // Collect all competitors mentioned across engines
    const allCompetitors = {};
    for (const e of checked) {
      for (const c of (results[e].competitors || [])) {
        allCompetitors[c] = (allCompetitors[c] || 0) + 1;
      }
    }

    res.json({
      query,
      shareOfVoice,
      enginesChecked: checked.length,
      enginesMentioned: mentioned.length,
      results,
      competitorFrequency: Object.entries(allCompetitors)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, mentionedIn: count })),
    });
  } catch (error) {
    log.error('Citation check error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── GET /api/citations/queries — List all monitored queries ──
router.get('/queries', async (req, res) => {
  try {
    const queries = await req.app.locals.prisma.citationQuery.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      include: {
        checks: { orderBy: { date: 'desc' }, take: 9 }, // last 3 per engine
      },
    });

    // Enrich with latest share of voice
    const enriched = queries.map(q => {
      const latestByEngine = {};
      for (const check of q.checks) {
        if (!latestByEngine[check.engine]) latestByEngine[check.engine] = check;
      }
      const engines = Object.keys(latestByEngine);
      const mentioned = engines.filter(e => latestByEngine[e].mentioned);
      return {
        ...q,
        latestShareOfVoice: engines.length > 0 ? Math.round((mentioned.length / engines.length) * 100) : null,
        latestResults: latestByEngine,
      };
    });

    res.json(enriched);
  } catch (error) {
    log.error('Citation queries error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── GET /api/citations/dashboard — Aggregated citation stats ──
router.get('/dashboard', async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const totalQueries = await prisma.citationQuery.count({ where: { active: true } });
    const totalChecks = await prisma.citationCheck.count();
    const mentionedChecks = await prisma.citationCheck.count({ where: { mentioned: true } });

    // Last 7 days trend
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentChecks = await prisma.citationCheck.findMany({
      where: { date: { gte: weekAgo } },
      select: { engine: true, mentioned: true, date: true },
    });

    const byEngine = {};
    for (const check of recentChecks) {
      if (!byEngine[check.engine]) byEngine[check.engine] = { total: 0, mentioned: 0 };
      byEngine[check.engine].total++;
      if (check.mentioned) byEngine[check.engine].mentioned++;
    }

    res.json({
      totalQueries,
      totalChecks,
      overallShareOfVoice: totalChecks > 0 ? Math.round((mentionedChecks / totalChecks) * 100) : 0,
      byEngine: Object.entries(byEngine).map(([engine, data]) => ({
        engine,
        shareOfVoice: data.total > 0 ? Math.round((data.mentioned / data.total) * 100) : 0,
        checks: data.total,
      })),
    });
  } catch (error) {
    log.error('Citation dashboard error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── POST /api/citations/bulk — Check default queries ──
router.post('/bulk', async (req, res) => {
  try {
    const { queries } = req.body;
    if (!queries?.length) return res.status(400).json({ error: 'Queries array required' });

    log.info(`Bulk citation check: ${queries.length} queries`);
    const results = [];

    for (const q of queries.slice(0, 10)) { // Max 10 per bulk
      try {
        // Forward to single check handler internally
        const response = await fetch(`http://localhost:${process.env.PORT || 4000}/api/citations/check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q.query, keyword: q.keyword, region: q.region }),
        });
        const data = await response.json();
        results.push(data);

        // Rate limit between queries
        await new Promise(r => setTimeout(r, 2000));
      } catch (e) {
        results.push({ query: q.query, error: e.message });
      }
    }

    res.json({ checked: results.length, results });
  } catch (error) {
    log.error('Bulk citation error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
