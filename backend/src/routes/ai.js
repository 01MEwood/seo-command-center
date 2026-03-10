import { Router } from 'express';
import * as ai from '../services/openai.js';
import { log } from '../services/logger.js';

const router = Router();

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
