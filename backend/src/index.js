import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';
import cron from 'node-cron';
import { createLogger, format, transports } from 'winston';
import dotenv from 'dotenv';
import { mkdirSync } from 'fs';

dotenv.config();

// ── Ensure logs directory exists ──
try { mkdirSync('logs', { recursive: true }); } catch {}

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// ── Logger ──
const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console({ format: format.combine(format.colorize(), format.simple()) }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// ── Middleware ──
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '5mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// ── Google Auth ──
function getGoogleAuth() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REFRESH_TOKEN) {
    throw new Error('Google OAuth credentials not configured');
  }
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
  return oauth2Client;
}

// ════════════════════════════════════════
// ROUTES
// ════════════════════════════════════════

// ── Health Check (with DB ping) ──
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(), 
      version: '4.1.0',
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'degraded', 
      timestamp: new Date().toISOString(), 
      version: '4.1.0',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Also handle /health without /api prefix for Docker healthcheck
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'error' });
  }
});

// ── GSC: Fetch Search Analytics ──
app.get('/api/gsc/:domainUrl', async (req, res) => {
  try {
    const auth = getGoogleAuth();
    const searchconsole = google.searchconsole({ version: 'v1', auth });
    
    const siteUrl = `sc-domain:${req.params.domainUrl}`;
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const response = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit: 100,
        type: 'web',
      },
    });

    const rows = (response.data.rows || []).map(row => ({
      query: row.keys[0],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: Math.round(row.ctr * 1000) / 10,
      position: Math.round(row.position * 10) / 10,
    }));

    res.json({ domain: req.params.domainUrl, period: { startDate, endDate }, rows });
  } catch (error) {
    logger.error('GSC fetch error:', { message: error.message });
    res.status(500).json({ error: 'GSC fetch failed', details: error.message });
  }
});

// ── GSC: Fetch by Page ──
app.get('/api/gsc/:domainUrl/pages', async (req, res) => {
  try {
    const auth = getGoogleAuth();
    const searchconsole = google.searchconsole({ version: 'v1', auth });
    
    const siteUrl = `sc-domain:${req.params.domainUrl}`;
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const response = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['page'],
        rowLimit: 50,
        type: 'web',
      },
    });

    res.json({ rows: response.data.rows || [] });
  } catch (error) {
    logger.error('GSC pages error:', { message: error.message });
    res.status(500).json({ error: error.message });
  }
});

// ── PageSpeed Insights ──
app.get('/api/pagespeed/:url', async (req, res) => {
  try {
    const targetUrl = decodeURIComponent(req.params.url);
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://${targetUrl}&strategy=mobile&category=performance&category=seo`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const metrics = data.lighthouseResult?.audits;
    res.json({
      performance: Math.round((data.lighthouseResult?.categories?.performance?.score || 0) * 100),
      seo: Math.round((data.lighthouseResult?.categories?.seo?.score || 0) * 100),
      lcp: metrics?.['largest-contentful-paint']?.numericValue,
      cls: metrics?.['cumulative-layout-shift']?.numericValue,
      fid: metrics?.['max-potential-fid']?.numericValue,
      ttfb: metrics?.['server-response-time']?.numericValue,
      tbt: metrics?.['total-blocking-time']?.numericValue,
    });
  } catch (error) {
    logger.error('PageSpeed error:', { message: error.message });
    res.status(500).json({ error: error.message });
  }
});

// ── Google Indexing API: Request Indexing ──
app.post('/api/indexing/request', async (req, res) => {
  try {
    const auth = getGoogleAuth();
    const indexing = google.indexing({ version: 'v3', auth });
    
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL required' });

    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url,
        type: 'URL_UPDATED',
      },
    });

    logger.info(`Indexing requested: ${url}`);
    res.json({ success: true, url, response: response.data });
  } catch (error) {
    logger.error('Indexing error:', { message: error.message });
    res.status(500).json({ error: error.message });
  }
});

// ── DataForSEO: Keyword Research ──
app.post('/api/dataforseo/keywords', async (req, res) => {
  try {
    const { keywords, location = 2276 } = req.body; // 2276 = Germany
    
    if (!process.env.DATAFORSEO_LOGIN || !process.env.DATAFORSEO_PASSWORD) {
      return res.status(503).json({ error: 'DataForSEO credentials not configured' });
    }

    const credentials = Buffer.from(
      `${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`
    ).toString('base64');

    const response = await fetch(
      'https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live',
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
          keywords,
          location_code: location,
          language_code: 'de',
        }]),
      }
    );
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    logger.error('DataForSEO error:', { message: error.message });
    res.status(500).json({ error: error.message });
  }
});

// ── DataForSEO: SERP Analysis ──
app.post('/api/dataforseo/serp', async (req, res) => {
  try {
    const { keyword, location = 2276 } = req.body;
    
    if (!process.env.DATAFORSEO_LOGIN || !process.env.DATAFORSEO_PASSWORD) {
      return res.status(503).json({ error: 'DataForSEO credentials not configured' });
    }

    const credentials = Buffer.from(
      `${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`
    ).toString('base64');

    const response = await fetch(
      'https://api.dataforseo.com/v3/serp/google/organic/live/regular',
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
          keyword,
          location_code: location,
          language_code: 'de',
          device: 'desktop',
          depth: 20,
        }]),
      }
    );
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    logger.error('SERP error:', { message: error.message });
    res.status(500).json({ error: error.message });
  }
});

// ── DataForSEO: Competitor Backlinks ──
app.post('/api/dataforseo/backlinks', async (req, res) => {
  try {
    const { target } = req.body;
    if (!target) return res.status(400).json({ error: 'Target domain required' });
    
    if (!process.env.DATAFORSEO_LOGIN || !process.env.DATAFORSEO_PASSWORD) {
      return res.status(503).json({ error: 'DataForSEO credentials not configured' });
    }

    const credentials = Buffer.from(
      `${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`
    ).toString('base64');

    const response = await fetch(
      'https://api.dataforseo.com/v3/backlinks/summary/live',
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ target, internal_list_limit: 0 }]),
      }
    );
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    logger.error('Backlinks error:', { message: error.message });
    res.status(500).json({ error: error.message });
  }
});

// ── AI: Expert Analysis (Claude) ──
app.post('/api/ai/expert-audit', async (req, res) => {
  try {
    const { expertId, pageUrl, pageContent } = req.body;
    
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Anthropic API key not configured. Set ANTHROPIC_API_KEY in .env' });
    }

    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const expertPrompts = {
      dean: `Du bist Brian Dean (Backlinko). Analysiere diese Seite mit der Skyscraper-Methode. Bewerte 0-100: Ist dieser Content besser als alles auf Seite 1 für das Zielkeyword? Prüfe: Tiefe, Daten, Visuals, UX, Link-Würdigkeit.`,
      king: `Du bist Mike King (Relevance Engineering). Prüfe die Schema-Readiness dieser Seite. Bewerte 0-100: Kann eine AI-Engine (GPT, Gemini) diesen Content parsen und zitieren? Prüfe: Schema-Markup, Entitätsstruktur, FAQ, HowTo.`,
      barnard: `Du bist Jason Barnard (The Brand SERP Guy). Analysiere den Entity-Status. Bewerte 0-100: Wird diese Marke als Entität erkannt? Prüfe: Knowledge Panel, Wikidata, NAP-Konsistenz, sameAs, Brand-SERP.`,
      ray: `Du bist Lily Ray (Amsive). Führe ein E-E-A-T Audit durch. Bewerte 0-100: Erfüllt diese Seite Googles E-E-A-T Anforderungen für AI Overviews? Prüfe: Experience, Expertise, Authoritativeness, Trust.`,
      fishkin: `Du bist Rand Fishkin (SparkToro). Analysiere die Audience-Strategie. Bewerte 0-100: Erreicht dieser Content die Zielgruppe dort wo sie sich aufhält? Prüfe: Persona-Match, Channel-Fit, Zero-Click-Strategie.`,
      krum: `Du bist Cindy Krum (MobileMoxie). Prüfe Mobile-First und Entitäten-SEO. Bewerte 0-100: Ist diese Seite für Mobile-First-Indexierung und Entitäten-basierte Suche optimiert?`,
      irwin: `Du bist Todd Irwin (Fazer). Analysiere die Positionierung mit dem De-Positioning Framework. Bewerte 0-100: Verschiebt diese Marke das Spielfeld oder versucht sie nur besser zu sein als der Wettbewerb?`,
      dunford: `Du bist April Dunford (Obviously Awesome). Bewerte die Produkt-Positionierung. Bewerte 0-100: Ist klar in welcher Kategorie diese Marke die offensichtliche Wahl ist?`,
    };

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `${expertPrompts[expertId] || expertPrompts.dean}\n\nSeite: ${pageUrl}\n\nContent:\n${pageContent?.substring(0, 3000)}\n\nAntworte auf Deutsch. Format: Score (0-100), dann 3-5 konkrete Empfehlungen.`,
      }],
    });

    res.json({
      expertId,
      analysis: message.content[0].text,
    });
  } catch (error) {
    logger.error('AI audit error:', { message: error.message });
    res.status(500).json({ error: error.message });
  }
});

// ── AI: Longtail Keyword Generation (GPT-4o) ──
app.post('/api/ai/longtails', async (req, res) => {
  try {
    const { seedKeyword, domain } = req.body;
    
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: 'OpenAI API key not configured. Set OPENAI_API_KEY in .env' });
    }

    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: `Generiere 20 Longtail-Keywords und natürliche Suchphrasen für "${seedKeyword}" im Kontext einer Schreinerei in der Region Stuttgart, Deutschland. 
Zielgruppe: ${domain === 'sh' ? 'Privatkunden, Eigenheimbesitzer' : 'Architekten, Bauträger, Gewerbetreibende'}
Format: JSON Array mit {keyword, intent, estimated_volume, difficulty}
Berücksichtige:
- Natürliche Frage-Phrasen ("was kostet...", "wie lange dauert...")
- KI-Suchphrasen (wie Leute ChatGPT/Perplexity fragen würden)
- Lokale Varianten (Murrhardt, Backnang, Rems-Murr)
- Voice Search Phrasen
Nur JSON zurückgeben, kein Markdown.`,
      }],
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.json(result);
  } catch (error) {
    logger.error('Longtail error:', { message: error.message });
    res.status(500).json({ error: error.message });
  }
});

// ── AI: Content Generation (GPT-4o) ──
app.post('/api/ai/content', async (req, res) => {
  try {
    const { template, keyword, domain, context } = req.body;
    
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: 'OpenAI API key not configured' });
    }

    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'system',
        content: `Du bist ein SEO-Content-Experte für eine Schreinerei in der Region Stuttgart. Schreibe auf Deutsch, schwäbisch-bodenständig aber professionell. Domain: ${domain || 'schreinerhelden.de'}`
      }, {
        role: 'user',
        content: `Template: ${template}\nKeyword: ${keyword}\nKontext: ${context || 'Allgemein'}\n\nErstelle den Content.`,
      }],
      max_tokens: 2000,
    });

    res.json({
      content: completion.choices[0].message.content,
      template,
      keyword,
    });
  } catch (error) {
    logger.error('Content generation error:', { message: error.message });
    res.status(500).json({ error: error.message });
  }
});

// ── CRUD: Domains (seed if empty) ──
app.get('/api/domains', async (req, res) => {
  try {
    let domains = await prisma.domain.findMany();
    
    // Auto-seed if no domains exist
    if (domains.length === 0) {
      await prisma.domain.createMany({
        data: [
          { name: 'Schreinerhelden', url: 'schreinerhelden.de', color: '#e67e22' },
          { name: 'Ihr Möbel-Schreiner', url: 'ihr-moebel-schreiner.de', color: '#2c3e50' },
        ],
      });
      domains = await prisma.domain.findMany();
      logger.info('Domains seeded');
    }
    
    res.json(domains);
  } catch (error) {
    logger.error('Domains error:', { message: error.message });
    res.status(500).json({ error: error.message });
  }
});

// ── CRUD: Keywords ──
app.get('/api/keywords', async (req, res) => {
  try {
    const { domainId, cluster } = req.query;
    const where = {};
    if (domainId) where.domainId = domainId;
    if (cluster) where.cluster = cluster;
    const keywords = await prisma.keyword.findMany({ where, orderBy: { volume: 'desc' }, include: { domain: true } });
    res.json(keywords);
  } catch (error) {
    logger.error('Keywords fetch error:', { message: error.message });
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/keywords', async (req, res) => {
  try {
    const keyword = await prisma.keyword.create({ data: req.body });
    res.json(keyword);
  } catch (error) {
    logger.error('Keyword create error:', { message: error.message });
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/keywords/:id', async (req, res) => {
  try {
    await prisma.keyword.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    logger.error('Keyword delete error:', { message: error.message });
    res.status(500).json({ error: error.message });
  }
});

// ── CRUD: Articles ──
app.get('/api/articles', async (req, res) => {
  try {
    const { domainId } = req.query;
    const where = domainId ? { domainId } : {};
    const articles = await prisma.article.findMany({ where, orderBy: { number: 'asc' }, include: { domain: true, keywords: true } });
    res.json(articles);
  } catch (error) {
    logger.error('Articles fetch error:', { message: error.message });
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/articles', async (req, res) => {
  try {
    const article = await prisma.article.create({ data: req.body });
    res.json(article);
  } catch (error) {
    logger.error('Article create error:', { message: error.message });
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/articles/:id', async (req, res) => {
  try {
    const article = await prisma.article.update({ where: { id: req.params.id }, data: req.body });
    res.json(article);
  } catch (error) {
    logger.error('Article update error:', { message: error.message });
    res.status(500).json({ error: error.message });
  }
});

// ── CRUD: Competitors ──
app.get('/api/competitors', async (req, res) => {
  try {
    const competitors = await prisma.competitor.findMany({ orderBy: { traffic: 'desc' } });
    res.json(competitors);
  } catch (error) {
    logger.error('Competitors error:', { message: error.message });
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/competitors', async (req, res) => {
  try {
    const competitor = await prisma.competitor.create({ data: req.body });
    res.json(competitor);
  } catch (error) {
    logger.error('Competitor create error:', { message: error.message });
    res.status(500).json({ error: error.message });
  }
});

// ── CRUD: Cannibalization Risks ──
app.get('/api/cannibalization', async (req, res) => {
  try {
    const risks = await prisma.cannibalRisk.findMany({ orderBy: { risk: 'asc' } });
    res.json(risks);
  } catch (error) {
    logger.error('Cannibalization error:', { message: error.message });
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/cannibalization/:id', async (req, res) => {
  try {
    const risk = await prisma.cannibalRisk.update({ where: { id: req.params.id }, data: req.body });
    res.json(risk);
  } catch (error) {
    logger.error('Cannibalization update error:', { message: error.message });
    res.status(500).json({ error: error.message });
  }
});

// ── CRUD: Audit Scores ──
app.get('/api/audits/:domainId', async (req, res) => {
  try {
    const scores = await prisma.auditScore.findMany({
      where: { domainId: req.params.domainId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(scores);
  } catch (error) {
    logger.error('Audits error:', { message: error.message });
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════
// CRON JOBS (automated data fetching)
// ════════════════════════════════════════

// Fetch GSC data daily at 6:00 AM
cron.schedule('0 6 * * *', async () => {
  logger.info('Running daily GSC data fetch...');
  try {
    const auth = getGoogleAuth();
    const searchconsole = google.searchconsole({ version: 'v1', auth });
    
    for (const domainKey of ['schreinerhelden.de', 'ihr-moebel-schreiner.de']) {
      const domain = await prisma.domain.findUnique({ where: { url: domainKey } });
      if (!domain) continue;

      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await searchconsole.searchanalytics.query({
        siteUrl: `sc-domain:${domainKey}`,
        requestBody: {
          startDate: yesterday,
          endDate: yesterday,
          dimensions: ['query'],
          rowLimit: 500,
          type: 'web',
        },
      });

      for (const row of (response.data.rows || [])) {
        await prisma.gscDataPoint.upsert({
          where: {
            date_query_domainId: {
              date: new Date(yesterday),
              query: row.keys[0],
              domainId: domain.id,
            },
          },
          update: {
            clicks: row.clicks,
            impressions: row.impressions,
            ctr: row.ctr,
            position: row.position,
          },
          create: {
            date: new Date(yesterday),
            query: row.keys[0],
            clicks: row.clicks,
            impressions: row.impressions,
            ctr: row.ctr,
            position: row.position,
            domainId: domain.id,
          },
        });
      }

      logger.info(`GSC data saved for ${domainKey}: ${response.data.rows?.length || 0} queries`);
    }
  } catch (error) {
    logger.error('GSC cron error:', { message: error.message });
  }
});

// ════════════════════════════════════════
// ERROR HANDLING
// ════════════════════════════════════════

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', { message: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// ── Graceful Shutdown ──
async function shutdown(signal) {
  logger.info(`${signal} received, shutting down gracefully...`);
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ── Start Server ──
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`SEO Command Center v4.1 Backend running on port ${PORT}`);
});
