import { Router } from 'express';
import * as ai from '../services/openai.js';
import * as dfs from '../services/dataforseo.js';
import { log } from '../services/logger.js';

const router = Router();

const OUR_DOMAINS = ['schreinerhelden.de', 'ihr-moebel-schreiner.de'];

router.post('/content', async (req, res) => {
  try {
    const { keyword, context, template = 'article' } = req.body;
    if (!keyword) return res.status(400).json({ error: 'Keyword required' });
    const content = await ai.generateContentDraft(keyword, context || '', '', '');
    res.json({ content, keyword, template });
  } catch (error) {
    log.error('AI content error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── HTML Landing Page Generator ──
router.post('/landing-page', async (req, res) => {
  try {
    const { keyword, region, service, domain = 'sh' } = req.body;
    if (!keyword) return res.status(400).json({ error: 'Keyword required' });

    log.info(`Generating HTML LP: "${keyword}" ${region}`);

    // Step 1: Get SERP data
    let serpSummary = '';
    try {
      const searchKey = region ? `${keyword} ${region}` : keyword;
      const serpData = await dfs.serpOrganic(searchKey);
      const items = serpData.tasks?.[0]?.result?.[0]?.items || [];
      serpSummary = items
        .filter(i => i.type === 'organic').slice(0, 10)
        .map((r, i) => `${i + 1}. ${r.title} (${r.domain}) — ${(r.description || '').slice(0, 120)}`)
        .join('\n');
    } catch (e) { log.warn('SERP fetch for LP failed:', e.message); }

    // Step 2: Get longtails
    let longtailSummary = '';
    try {
      const lt = await ai.generateLongtails(keyword, domain);
      longtailSummary = (lt.keywords || []).map(k => k.keyword).join(', ');
    } catch (e) { log.warn('Longtails for LP failed:', e.message); }

    // Step 3: Generate HTML
    const html = await ai.generateHtmlLandingPage(keyword, region || '', service || keyword, serpSummary, longtailSummary);

    // Count words (strip HTML tags)
    const textOnly = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = textOnly.split(' ').filter(w => w.length > 0).length;

    res.json({ html, keyword, region, wordCount });
  } catch (error) {
    log.error('AI landing page error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── Wettbewerber-Diagnose ──
router.post('/competitor-diagnosis', async (req, res) => {
  try {
    const { keyword, region } = req.body;
    if (!keyword) return res.status(400).json({ error: 'Keyword required' });

    log.info(`Competitor diagnosis: "${keyword}" ${region}`);

    const searchKey = region ? `${keyword} ${region}` : keyword;

    // Step 1: SERP analysis
    const serpData = await dfs.serpOrganic(searchKey);
    const items = serpData.tasks?.[0]?.result?.[0]?.items || [];
    const organic = items.filter(i => i.type === 'organic').slice(0, 10);

    // Find our position
    const ours = organic.find(r => OUR_DOMAINS.some(d => (r.domain || '').includes(d)));
    const ourData = ours
      ? `Position ${ours.rank_group}: ${ours.title} (${ours.domain}) — ${ours.url}`
      : 'Nicht in TOP 10 gefunden';

    const serpSummary = organic.map((r, i) =>
      `Pos ${r.rank_group || i + 1}: ${r.title} (${r.domain}) — ${(r.description || '').slice(0, 150)}`
    ).join('\n');

    // Step 2: Backlink data for top 5 competitors
    let competitorDetails = '';
    const topDomains = organic.slice(0, 5).map(r => r.domain).filter(Boolean);
    for (const dom of topDomains) {
      try {
        const bl = await dfs.backlinksSummary(dom);
        const summary = bl.tasks?.[0]?.result?.[0];
        if (summary) {
          competitorDetails += `${dom}: Backlinks=${summary.backlinks || 0}, Ref.Domains=${summary.referring_domains || 0}, DA=${summary.rank || 0}\n`;
        }
        await new Promise(r => setTimeout(r, 500)); // Rate limit
      } catch (e) {
        competitorDetails += `${dom}: Daten nicht verfügbar\n`;
      }
    }

    // Also get our backlinks
    let ourBacklinks = '';
    try {
      const ourBl = await dfs.backlinksSummary('schreinerhelden.de');
      const ourSummary = ourBl.tasks?.[0]?.result?.[0];
      if (ourSummary) {
        ourBacklinks = `schreinerhelden.de: Backlinks=${ourSummary.backlinks || 0}, Ref.Domains=${ourSummary.referring_domains || 0}, DA=${ourSummary.rank || 0}`;
      }
    } catch {}

    // Step 3: GPT-4o Diagnosis
    const diagnosis = await ai.generateCompetitorDiagnosis(
      keyword, region || 'Stuttgart',
      serpSummary,
      `${ourData}\n${ourBacklinks}`,
      competitorDetails
    );

    // Add raw data
    diagnosis.rawSerp = organic.map(r => ({
      position: r.rank_group,
      domain: r.domain,
      title: r.title,
      url: r.url,
      isOurs: OUR_DOMAINS.some(d => (r.domain || '').includes(d)),
    }));

    res.json(diagnosis);
  } catch (error) {
    log.error('Competitor diagnosis error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/longtails', async (req, res) => {
  try {
    const { seedKeyword, domain = 'sh' } = req.body;
    if (!seedKeyword) return res.status(400).json({ error: 'Seed keyword required' });
    const result = await ai.generateLongtails(seedKeyword, domain);
    res.json(result);
  } catch (error) {
    log.error('AI longtails error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/aeo-questions', async (req, res) => {
  try {
    const { keyword } = req.body;
    if (!keyword) return res.status(400).json({ error: 'Keyword required' });
    const result = await ai.generateAeoQuestions(keyword);
    res.json(result);
  } catch (error) {
    log.error('AI AEO error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
