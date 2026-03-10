import { Router } from 'express';
import { fetchPageSpeed } from '../services/google.js';
import { log } from '../services/logger.js';

const router = Router();

router.get('/:url', async (req, res) => {
  try {
    const data = await fetchPageSpeed(decodeURIComponent(req.params.url));
    res.json(data);
  } catch (error) {
    log.error('PageSpeed error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
