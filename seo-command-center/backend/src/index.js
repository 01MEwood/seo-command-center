import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';
import cron from 'node-cron';
import { createLogger, format, transports } from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// ── Logger ──
const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// ── Middleware ──
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// ── Google Auth ──
function getGoogleAuth() {
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

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '3.0.0' });
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
    logger.error('GSC fetch error:', error.message);
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
    logger.error('GSC pages error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── PageSpeed Insights ──
app.get('/api/pagespeed/:url', async (req, res) => {
  try {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://${req.params.url}&strategy=mobile&category=performance&category=seo`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    const metrics = data.lighthouseResult?.audits;
    res.json({
      performance: Math.round((data.lighthouseResult?.categories?.performance?.score || 0) * 100),
      seo: Math.round((data.lighthouseResult?.categories?.seo?.score || 0) * 100),
      lcp: metrics?.['largest-contentful-paint']?.numericValue,
      cls: metrics?.['cumulative-layout-shift']?.numericValue,
      fid: metrics?.['max-potential-fid']?.numericValue,
    });
  } catch (error) {
    logger.error('PageSpeed error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── Google Indexing API: Request Indexing ──
app.post('/api/indexing/request', async (req, res) => {
  try {
    const auth = getGoogleAuth();
    const indexing = google.indexing({ version: 'v3', auth });
    
    const { url } = req.body;
    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url,
        type: 'URL_UPDATED',
      },
    });

    logger.info(`Indexing requested: ${url}`);
    res.json({ success: true, url, response: response.data });
  } catch (error) {
    logger.error('Indexing error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── DataForSEO: Keyword Research ──
app.post('/api/dataforseo/keywords', async (req, res) => {
  try {
    const { keywords, location = 2276 } = req.body; // 2276 = Germany
    
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
    logger.error('DataForSEO error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── DataForSEO: SERP Analysis ──
app.post('/api/dataforseo/serp', async (req, res) => {
  try {
    const { keyword, location = 2276 } = req.body;
    
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
    logger.error('SERP error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── DataForSEO: Competitor Backlinks ──
app.post('/api/dataforseo/backlinks', async (req, res) => {
  try {
    const { target } = req.body;
    
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
    logger.error('Backlinks error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── AI: Expert Analysis (Claude) ──
app.post('/api/ai/expert-audit', async (req, res) => {
  try {
    const { expertId, pageUrl, pageContent } = req.body;
    
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
    logger.error('AI audit error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── AI: Longtail Keyword Generation (ChatGPT) ──
app.post('/api/ai/longtails', async (req, res) => {
  try {
    const { seedKeyword, domain } = req.body;
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
    logger.error('Longtail error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── CRUD: Keywords ──
app.get('/api/keywords', async (req, res) => {
  const { domainId, cluster } = req.query;
  const where = {};
  if (domainId) where.domainId = domainId;
  if (cluster) where.cluster = cluster;
  const keywords = await prisma.keyword.findMany({ where, orderBy: { volume: 'desc' }, include: { domain: true } });
  res.json(keywords);
});

app.post('/api/keywords', async (req, res) => {
  const keyword = await prisma.keyword.create({ data: req.body });
  res.json(keyword);
});

// ── CRUD: Articles ──
app.get('/api/articles', async (req, res) => {
  const { domainId } = req.query;
  const where = domainId ? { domainId } : {};
  const articles = await prisma.article.findMany({ where, orderBy: { number: 'asc' }, include: { domain: true, keywords: true } });
  res.json(articles);
});

app.patch('/api/articles/:id', async (req, res) => {
  const article = await prisma.article.update({ where: { id: req.params.id }, data: req.body });
  res.json(article);
});

// ── CRUD: Competitors ──
app.get('/api/competitors', async (req, res) => {
  const competitors = await prisma.competitor.findMany({ orderBy: { traffic: 'desc' } });
  res.json(competitors);
});

// ── CRUD: Cannibalization Risks ──
app.get('/api/cannibalization', async (req, res) => {
  const risks = await prisma.cannibalRisk.findMany({ orderBy: { risk: 'asc' } });
  res.json(risks);
});

app.patch('/api/cannibalization/:id', async (req, res) => {
  const risk = await prisma.cannibalRisk.update({ where: { id: req.params.id }, data: req.body });
  res.json(risk);
});

// ── CRUD: Audit Scores ──
app.get('/api/audits/:domainId', async (req, res) => {
  const scores = await prisma.auditScore.findMany({
    where: { domainId: req.params.domainId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(scores);
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
    logger.error('GSC cron error:', error.message);
  }
});

// ── Start Server ──
app.listen(PORT, () => {
  logger.info(`SEO Command Center Backend running on port ${PORT}`);
});
