import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { mkdirSync } from 'fs';

import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import gscRoutes from './routes/gsc.js';
import serpRoutes from './routes/serp.js';
import keywordRoutes from './routes/keywords.js';
import competitorRoutes from './routes/competitors.js';
import pipelineRoutes from './routes/pipeline.js';
import aiRoutes from './routes/ai.js';
import trackingRoutes from './routes/tracking.js';
import citationRoutes from './routes/citations.js';
import pagespeedRoutes from './routes/pagespeed.js';
import domainRoutes from './routes/domains.js';
import promptRoutes from './routes/prompts.js';

import { startCronJobs } from './cron/gsc.js';
import { log } from './services/logger.js';

dotenv.config();
try { mkdirSync('logs', { recursive: true }); } catch {}

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// Make prisma available to routes
app.locals.prisma = prisma;

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '5mb' }));
app.use((req, res, next) => { log.info(`${req.method} ${req.path}`); next(); });

// Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/gsc', gscRoutes);
app.use('/api/serp', serpRoutes);
app.use('/api/keywords', keywordRoutes);
app.use('/api/competitors', competitorRoutes);
app.use('/api/pipeline', pipelineRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/citations', citationRoutes);
app.use('/api/pagespeed', pagespeedRoutes);
app.use('/api/domains', domainRoutes);
app.use('/api/prompts', promptRoutes);

// Also handle /health for Docker healthcheck
app.get('/health', async (req, res) => {
  try { await prisma.$queryRaw`SELECT 1`; res.json({ status: 'ok' }); }
  catch { res.status(503).json({ status: 'error' }); }
});

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found', path: req.path }));

// Error handler
app.use((err, req, res, next) => {
  log.error('Unhandled:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown
async function shutdown(sig) {
  log.info(`${sig} received, shutting down...`);
  await prisma.$disconnect();
  process.exit(0);
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Start
startCronJobs(prisma);
app.listen(PORT, '0.0.0.0', () => log.info(`MEOS:SEO v5.4 running on port ${PORT}`));
