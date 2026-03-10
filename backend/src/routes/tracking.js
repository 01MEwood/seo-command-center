import { Router } from 'express';
import * as dfs from '../services/dataforseo.js';
import { log } from '../services/logger.js';

const router = Router();

const OUR_DOMAINS = ['schreinerhelden.de', 'ihr-moebel-schreiner.de'];

// List tracked keywords
router.get('/', async (req, res) => {
  try {
    const tracked = await req.app.locals.prisma.trackedKeyword.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      include: {
        domain: true,
        snapshots: { orderBy: { date: 'desc' }, take: 14 },
      },
    });
    res.json(tracked);
  } catch (error) {
    log.error('Tracking list error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Add keyword to tracking
router.post('/', async (req, res) => {
  try {
    const { keyword, domain: domainKey = 'sh', region } = req.body;
    if (!keyword) return res.status(400).json({ error: 'Keyword required' });

    const domainUrl = domainKey === 'ims' ? 'ihr-moebel-schreiner.de' : 'schreinerhelden.de';
    let dbDomain = await req.app.locals.prisma.domain.findUnique({ where: { url: domainUrl } });
    if (!dbDomain) {
      dbDomain = await req.app.locals.prisma.domain.create({
        data: { name: domainKey === 'ims' ? 'Ihr Möbel-Schreiner' : 'Schreinerhelden', url: domainUrl, color: '#e67e22' },
      });
    }

    const searchKeyword = region ? `${keyword} ${region}` : keyword;
    const tracked = await req.app.locals.prisma.trackedKeyword.upsert({
      where: { keyword_region_domainId: { keyword: searchKeyword, region: region || '', domainId: dbDomain.id } },
      create: { keyword: searchKeyword, region: region || '', domainId: dbDomain.id },
      update: { active: true },
    });

    // Immediately take first snapshot
    try {
      const serpData = await dfs.serpOrganic(searchKeyword);
      const items = serpData.tasks?.[0]?.result?.[0]?.items || [];
      const organic = items.filter(i => i.type === 'organic');
      const ours = organic.find(i => OUR_DOMAINS.some(d => (i.domain || '').includes(d)));

      await req.app.locals.prisma.positionSnapshot.create({
        data: {
          trackedKeywordId: tracked.id,
          position: ours ? ours.rank_group : null,
          url: ours ? ours.url : null,
        },
      });
    } catch (e) {
      log.warn('Initial snapshot failed:', e.message);
    }

    res.json(tracked);
  } catch (error) {
    log.error('Tracking add error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get history for a tracked keyword
router.get('/:id/history', async (req, res) => {
  try {
    const snapshots = await req.app.locals.prisma.positionSnapshot.findMany({
      where: { trackedKeywordId: req.params.id },
      orderBy: { date: 'asc' },
    });
    res.json(snapshots);
  } catch (error) {
    log.error('Tracking history error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Refresh all tracked keywords (manual trigger or cron)
router.post('/refresh', async (req, res) => {
  try {
    const tracked = await req.app.locals.prisma.trackedKeyword.findMany({
      where: { active: true },
      include: { domain: true },
    });

    let updated = 0;
    for (const tk of tracked) {
      try {
        const serpData = await dfs.serpOrganic(tk.keyword);
        const items = serpData.tasks?.[0]?.result?.[0]?.items || [];
        const organic = items.filter(i => i.type === 'organic');
        const ours = organic.find(i => OUR_DOMAINS.some(d => (i.domain || '').includes(d)));

        await req.app.locals.prisma.positionSnapshot.create({
          data: {
            trackedKeywordId: tk.id,
            position: ours ? ours.rank_group : null,
            url: ours ? ours.url : null,
          },
        });
        updated++;

        // Rate limit: wait 1s between API calls
        await new Promise(r => setTimeout(r, 1000));
      } catch (e) {
        log.warn(`Tracking refresh failed for "${tk.keyword}": ${e.message}`);
      }
    }

    res.json({ refreshed: updated, total: tracked.length });
  } catch (error) {
    log.error('Tracking refresh error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
