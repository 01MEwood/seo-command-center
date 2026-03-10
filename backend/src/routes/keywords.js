import { Router } from 'express';
import * as dfs from '../services/dataforseo.js';
import { log } from '../services/logger.js';

const router = Router();

// Search volume for keyword(s)
router.post('/volume', async (req, res) => {
  try {
    const { keywords, location = 2276 } = req.body;
    if (!keywords) return res.status(400).json({ error: 'Keywords required' });
    const data = await dfs.searchVolume(keywords, location);
    res.json(data);
  } catch (error) {
    log.error('Keyword volume error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Keyword suggestions from seed
router.post('/suggestions', async (req, res) => {
  try {
    const { keyword, location = 2276 } = req.body;
    if (!keyword) return res.status(400).json({ error: 'Keyword required' });
    const data = await dfs.keywordSuggestions(keyword, location);
    res.json(data);
  } catch (error) {
    log.error('Keyword suggestions error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Related keywords
router.post('/related', async (req, res) => {
  try {
    const { keyword, location = 2276 } = req.body;
    if (!keyword) return res.status(400).json({ error: 'Keyword required' });
    const data = await dfs.relatedKeywords(keyword, location);
    res.json(data);
  } catch (error) {
    log.error('Related keywords error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// CRUD - list stored keywords
router.get('/', async (req, res) => {
  try {
    const { domainId, cluster } = req.query;
    const where = {};
    if (domainId) where.domainId = domainId;
    if (cluster) where.cluster = cluster;
    const keywords = await req.app.locals.prisma.keyword.findMany({
      where, orderBy: { volume: 'desc' }, include: { domain: true },
    });
    res.json(keywords);
  } catch (error) {
    log.error('Keywords fetch error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
