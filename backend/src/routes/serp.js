import { Router } from 'express';
import * as dfs from '../services/dataforseo.js';
import { log } from '../services/logger.js';

const router = Router();

router.post('/analyze', async (req, res) => {
  try {
    const { keyword, location = 2276 } = req.body;
    if (!keyword) return res.status(400).json({ error: 'Keyword required' });

    const data = await dfs.serpOrganic(keyword, location);
    
    // Extract clean results
    const items = data.tasks?.[0]?.result?.[0]?.items || [];
    const organic = items
      .filter(i => i.type === 'organic')
      .slice(0, 20)
      .map((item, idx) => ({
        position: item.rank_group || idx + 1,
        url: item.url,
        domain: item.domain,
        title: item.title,
        snippet: item.description || '',
        isOurs: (item.domain || '').includes('schreinerhelden') || (item.domain || '').includes('ihr-moebel-schreiner'),
      }));

    // Extract People Also Ask if present
    const paa = items
      .filter(i => i.type === 'people_also_ask')
      .flatMap(i => i.items || [])
      .map(q => ({ question: q.title, snippet: q.description }));

    // Extract Featured Snippet if present
    const featured = items.find(i => i.type === 'featured_snippet');

    res.json({
      keyword,
      totalResults: data.tasks?.[0]?.result?.[0]?.se_results_count || 0,
      organic,
      peopleAlsoAsk: paa,
      featuredSnippet: featured ? { title: featured.title, description: featured.description, url: featured.url } : null,
    });
  } catch (error) {
    log.error('SERP analyze error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
