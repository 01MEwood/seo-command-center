import { Router } from 'express';
import { fetchGscQueries, fetchGscPages } from '../services/google.js';
import { log } from '../services/logger.js';

const router = Router();

router.get('/:domain', async (req, res) => {
  try {
    const data = await fetchGscQueries(req.params.domain);
    res.json(data);
  } catch (error) {
    log.error('GSC error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:domain/pages', async (req, res) => {
  try {
    const data = await fetchGscPages(req.params.domain);
    res.json(data);
  } catch (error) {
    log.error('GSC pages error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
