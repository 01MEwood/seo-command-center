import { Router } from 'express';
import { log } from '../services/logger.js';
import * as P from '../services/prompts.js';

const router = Router();

// ── List all prompt templates (defaults + overrides) ──
router.get('/', async (req, res) => {
  try {
    // Get DB overrides
    const overrides = await req.app.locals.prisma.promptOverride.findMany();
    const overrideMap = {};
    for (const o of overrides) {
      overrideMap[o.key] = o;
    }

    // Build template list from known prompt keys
    const templates = [
      {
        key: 'BRAND_CONTEXT',
        label: 'Marken-Kontext',
        category: 'basis',
        description: 'Basis-Info über Schreinerhelden (wird in mehreren Prompts verwendet)',
        defaultValue: P.BRAND_CONTEXT,
        type: 'text',
      },
      {
        key: 'CONTENT_RULES',
        label: 'Content-Regeln',
        category: 'basis',
        description: 'Allgemeine Regeln für Content (Ansprache, E-E-A-T, AEO, GEO, Wortanzahl)',
        defaultValue: P.CONTENT_RULES,
        type: 'text',
      },
      {
        key: 'DESIGN_TOKENS',
        label: 'Design-Tokens',
        category: 'basis',
        description: 'Farben, Fonts, CTA-Styling für HTML-Output',
        defaultValue: P.DESIGN_TOKENS,
        type: 'text',
      },
      {
        key: 'LONGTAILS_SYSTEM',
        label: 'Longtail Keywords — System',
        category: 'keywords',
        description: 'System-Prompt für Longtail-Keyword-Generierung',
        defaultValue: P.LONGTAILS_SYSTEM,
        type: 'text',
      },
      {
        key: 'AEO_SYSTEM',
        label: 'AEO / PAA — System',
        category: 'keywords',
        description: 'System-Prompt für People Also Ask Generierung',
        defaultValue: P.AEO_SYSTEM,
        type: 'text',
      },
      {
        key: 'CONTENT_DRAFT_SYSTEM',
        label: 'Artikel — System',
        category: 'content',
        description: 'System-Prompt für Markdown-Artikel-Generierung',
        defaultValue: P.CONTENT_DRAFT_SYSTEM,
        type: 'text',
      },
      {
        key: 'LANDING_PAGE_SYSTEM',
        label: 'Landing Page — System',
        category: 'content',
        description: 'System-Prompt für HTML Landing Page Generierung',
        defaultValue: P.LANDING_PAGE_SYSTEM,
        type: 'text',
      },
      {
        key: 'DIAGNOSIS_SYSTEM',
        label: 'Wettbewerber-Diagnose — System',
        category: 'analyse',
        description: 'System-Prompt für Wettbewerber-Analyse',
        defaultValue: P.DIAGNOSIS_SYSTEM,
        type: 'text',
      },
      {
        key: 'SOCIAL_SYSTEM',
        label: 'Social Multiplier — System',
        category: 'social',
        description: 'System-Prompt für Social Content (alle Kanäle)',
        defaultValue: P.SOCIAL_SYSTEM,
        type: 'text',
      },
    ];

    // Merge overrides
    const result = templates.map(t => ({
      ...t,
      currentValue: overrideMap[t.key]?.value || null,
      isOverridden: !!overrideMap[t.key],
      overrideId: overrideMap[t.key]?.id || null,
      updatedAt: overrideMap[t.key]?.updatedAt || null,
    }));

    res.json(result);
  } catch (error) {
    log.error('Prompts list error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── Save override ──
router.put('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    if (!value || !value.trim()) return res.status(400).json({ error: 'Value required' });

    const override = await req.app.locals.prisma.promptOverride.upsert({
      where: { key },
      create: { key, value: value.trim() },
      update: { value: value.trim() },
    });

    log.info(`Prompt override saved: ${key}`);
    res.json(override);
  } catch (error) {
    log.error('Prompt save error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── Reset to default (delete override) ──
router.delete('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    await req.app.locals.prisma.promptOverride.deleteMany({ where: { key } });
    log.info(`Prompt override deleted: ${key}`);
    res.json({ ok: true, key });
  } catch (error) {
    log.error('Prompt reset error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
