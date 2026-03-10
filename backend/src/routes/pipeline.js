import { Router } from 'express';
import * as dfs from '../services/dataforseo.js';
import * as ai from '../services/openai.js';
import { log } from '../services/logger.js';

const router = Router();

const OUR_DOMAINS = ['schreinerhelden.de', 'ihr-moebel-schreiner.de', 'schreinerhelden', 'ihr-moebel-schreiner'];

function isOurDomain(domain) {
  return OUR_DOMAINS.some(d => (domain || '').includes(d));
}

/**
 * POST /api/pipeline/run
 * Full analysis pipeline: Keyword + Region → SERP → Volume → Longtails → AEO → Content
 */
router.post('/run', async (req, res) => {
  const prisma = req.app.locals.prisma;
  const { keyword, region, domain: domainKey = 'sh' } = req.body;

  if (!keyword || !region) {
    return res.status(400).json({ error: 'Keyword and region required' });
  }

  const searchKeyword = `${keyword} ${region}`;
  log.info(`Pipeline started: "${searchKeyword}" (domain: ${domainKey})`);

  // Find or create domain
  const domainUrl = domainKey === 'ims' ? 'ihr-moebel-schreiner.de' : 'schreinerhelden.de';
  let dbDomain = await prisma.domain.findUnique({ where: { url: domainUrl } });
  if (!dbDomain) {
    dbDomain = await prisma.domain.create({
      data: { name: domainKey === 'ims' ? 'Ihr Möbel-Schreiner' : 'Schreinerhelden', url: domainUrl, color: domainKey === 'ims' ? '#2c3e50' : '#e67e22' },
    });
  }

  // Create pipeline run
  const run = await prisma.pipelineRun.create({
    data: { keyword: searchKeyword, region, domainId: dbDomain.id, status: 'running' },
  });

  try {
    // ═══════════ STEP 1: SERP Analysis ═══════════
    log.info(`Pipeline [${run.id}] Step 1: SERP analysis`);
    const serpData = await dfs.serpOrganic(searchKeyword);
    const serpItems = serpData.tasks?.[0]?.result?.[0]?.items || [];
    const organicResults = serpItems.filter(i => i.type === 'organic').slice(0, 10);

    // Save SERP results to DB
    let ourPosition = null;
    let ourUrl = null;

    for (const [idx, item] of organicResults.entries()) {
      const ours = isOurDomain(item.domain);
      if (ours && !ourPosition) {
        ourPosition = item.rank_group || idx + 1;
        ourUrl = item.url;
      }
      await prisma.serpResult.create({
        data: {
          pipelineRunId: run.id,
          position: item.rank_group || idx + 1,
          url: item.url || '',
          domain: item.domain || '',
          title: item.title || '',
          snippet: item.description || '',
          isOurs: ours,
        },
      });
    }

    // Extract PAA questions from SERP
    const serpPaa = serpItems
      .filter(i => i.type === 'people_also_ask')
      .flatMap(i => i.items || [])
      .map(q => q.title)
      .slice(0, 5);

    // ═══════════ STEP 2: Search Volume ═══════════
    log.info(`Pipeline [${run.id}] Step 2: Search volume`);
    let searchVolume = null, cpc = null, competition = null;
    try {
      const volData = await dfs.searchVolume(searchKeyword);
      const volResult = volData.tasks?.[0]?.result?.[0];
      if (volResult) {
        searchVolume = volResult.search_volume;
        cpc = volResult.cpc;
        competition = volResult.competition;
      }
    } catch (e) {
      log.warn(`Pipeline [${run.id}] Volume fetch failed: ${e.message}`);
    }

    // Also get volume for base keyword (without region)
    let baseVolume = null;
    try {
      const baseData = await dfs.searchVolume(keyword);
      baseVolume = baseData.tasks?.[0]?.result?.[0]?.search_volume;
    } catch {}

    // ═══════════ STEP 3: Longtail Keywords (AI) ═══════════
    log.info(`Pipeline [${run.id}] Step 3: Longtails`);
    let longtails = null;
    try {
      longtails = await ai.generateLongtails(keyword, domainKey);
    } catch (e) {
      log.warn(`Pipeline [${run.id}] Longtails failed: ${e.message}`);
    }

    // ═══════════ STEP 4: AEO Questions (AI) ═══════════
    log.info(`Pipeline [${run.id}] Step 4: AEO questions`);
    let aeoQuestions = null;
    try {
      const serpContext = organicResults.map((r, i) => `${i + 1}. ${r.title} (${r.domain})`).join('\n');
      const paaContext = serpPaa.length > 0 ? `\nPeople Also Ask:\n${serpPaa.join('\n')}` : '';
      aeoQuestions = await ai.generateAeoQuestions(keyword, serpContext + paaContext);
    } catch (e) {
      log.warn(`Pipeline [${run.id}] AEO failed: ${e.message}`);
    }

    // ═══════════ STEP 5: Content Draft (AI) ═══════════
    log.info(`Pipeline [${run.id}] Step 5: Content draft`);
    let contentDraft = null;
    try {
      const serpSummary = organicResults.map((r, i) =>
        `Pos ${r.rank_group}: ${r.title} (${r.domain}) — ${(r.description || '').slice(0, 100)}`
      ).join('\n');
      const longtailSummary = longtails?.keywords?.map(k => k.keyword).join(', ') || '';
      contentDraft = await ai.generateContentDraft(keyword, region, serpSummary, longtailSummary);
    } catch (e) {
      log.warn(`Pipeline [${run.id}] Content draft failed: ${e.message}`);
    }

    // ═══════════ UPDATE PIPELINE RUN ═══════════
    const updated = await prisma.pipelineRun.update({
      where: { id: run.id },
      data: {
        status: 'complete',
        searchVolume: searchVolume || baseVolume,
        cpc,
        competition,
        ourPosition,
        ourUrl,
        totalResults: serpData.tasks?.[0]?.result?.[0]?.se_results_count,
        longtails: longtails || undefined,
        aeoQuestions: aeoQuestions || undefined,
        contentDraft,
      },
      include: { serpResults: { orderBy: { position: 'asc' } } },
    });

    log.info(`Pipeline [${run.id}] complete. Our position: ${ourPosition || 'not found'}`);
    res.json(updated);

  } catch (error) {
    log.error(`Pipeline [${run.id}] failed:`, error.message);
    await prisma.pipelineRun.update({
      where: { id: run.id },
      data: { status: 'error' },
    });
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/pipeline/history
 */
router.get('/history', async (req, res) => {
  try {
    const runs = await req.app.locals.prisma.pipelineRun.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        domain: true,
        serpResults: { where: { isOurs: true }, take: 1 },
      },
    });
    res.json(runs);
  } catch (error) {
    log.error('Pipeline history error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/pipeline/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const run = await req.app.locals.prisma.pipelineRun.findUnique({
      where: { id: req.params.id },
      include: {
        domain: true,
        serpResults: { orderBy: { position: 'asc' } },
      },
    });
    if (!run) return res.status(404).json({ error: 'Pipeline run not found' });
    res.json(run);
  } catch (error) {
    log.error('Pipeline detail error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
