import { Router } from 'express';
import * as dfs from '../services/dataforseo.js';
import { log } from '../services/logger.js';

const router = Router();

router.post('/backlinks', async (req, res) => {
  try {
    const { target } = req.body;
    if (!target) return res.status(400).json({ error: 'Target domain required' });
    const data = await dfs.backlinksSummary(target);
    res.json(data);
  } catch (error) {
    log.error('Backlinks error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/keywords', async (req, res) => {
  try {
    const { target, location = 2276 } = req.body;
    if (!target) return res.status(400).json({ error: 'Target domain required' });
    const data = await dfs.rankedKeywords(target, location);
    res.json(data);
  } catch (error) {
    log.error('Competitor keywords error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
