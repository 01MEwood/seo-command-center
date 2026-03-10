import { Router } from 'express';
import { log } from '../services/logger.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    let domains = await req.app.locals.prisma.domain.findMany();
    if (domains.length === 0) {
      await req.app.locals.prisma.domain.createMany({
        data: [
          { name: 'Schreinerhelden', url: 'schreinerhelden.de', color: '#e67e22' },
          { name: 'Ihr Möbel-Schreiner', url: 'ihr-moebel-schreiner.de', color: '#2c3e50' },
        ],
      });
      domains = await req.app.locals.prisma.domain.findMany();
    }
    res.json(domains);
  } catch (error) {
    log.error('Domains error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
