import { Router } from 'express';
const router = Router();

router.get('/health', async (req, res) => {
  try {
    await req.app.locals.prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', version: '5.0.0', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'degraded', version: '5.0.0', database: 'disconnected', error: error.message });
  }
});

export default router;
