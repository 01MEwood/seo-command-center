import { log } from './logger.js';

let openaiInstance = null;

async function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY in .env');
  }
  if (!openaiInstance) {
    const OpenAI = (await import('openai')).default;
    openaiInstance = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiInstance;
}

export async function chat(systemPrompt, userPrompt, options = {}) {
  const { temperature = 0.7, maxTokens = 2000, json = false } = options;
  const openai = await getOpenAI();

  const params = {
    model: 'gpt-4o',
    temperature,
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  };

  if (json) params.response_format = { type: 'json_object' };

  const completion = await openai.chat.completions.create(params);
  return completion.choices[0].message.content;
}

// ── Longtail Keywords ──
export async function generateLongtails(keyword, domain = 'sh') {
  const audience = domain === 'sh'
    ? 'Privatkunden, Eigenheimbesitzer, Region Stuttgart'
    : 'Architekten, Bauträger, Gewerbetreibende';

  const result = await chat(
    'Du bist ein SEO-Keyword-Experte für das deutsche Schreinerhandwerk. Antworte NUR in validem JSON.',
    `Generiere 20 Longtail-Keywords und Suchphrasen für "${keyword}".
Zielgruppe: ${audience}
Berücksichtige:
- Natürliche Frage-Phrasen ("was kostet...", "wie lange dauert...")
- KI-Suchphrasen (wie Leute ChatGPT/Perplexity fragen)
- Lokale Varianten (Stuttgart, Rems-Murr, Backnang, Waiblingen)
- Voice Search Phrasen
- AEO-optimierte Fragen (Featured Snippet Potential)
Format: { "keywords": [{ "keyword": "...", "intent": "informational|transactional|comparison|local", "searchType": "traditional|voice|ai", "difficulty": "low|medium|high" }] }`,
    { json: true, temperature: 0.8 }
  );

  return JSON.parse(result);
}

// ── AEO/People Also Ask Questions ──
export async function generateAeoQuestions(keyword, serpData = '') {
  const result = await chat(
    'Du bist ein AEO-Spezialist (Answer Engine Optimization). Antworte NUR in validem JSON.',
    `Basierend auf dem Keyword "${keyword}" und diesen SERP-Daten:
${serpData ? serpData.slice(0, 2000) : 'Keine SERP-Daten verfügbar'}

Generiere 10 "People Also Ask" Fragen die Google/AI-Suchmaschinen zeigen würden.
Für jede Frage: formuliere eine Answer-First Antwort (erste 50 Wörter = Featured Snippet).
Format: { "questions": [{ "question": "...", "answer": "...", "snippetPotential": "high|medium|low" }] }`,
    { json: true, temperature: 0.7 }
  );

  return JSON.parse(result);
}

// ── Content Draft for Position 1 ──
export async function generateContentDraft(keyword, region, serpData, longtails) {
  const content = await chat(
    `Du bist ein Elite-SEO-Content-Stratege für Schreinerhelden, eine Premium-Schreinerei in Murrhardt bei Stuttgart.
WICHTIG:
- Du-Ansprache, schwäbisch/bodenständig aber premium
- E-E-A-T optimiert: Experience (echte Werkstatt-Erfahrung), Expertise (Schreinermeister)
- AEO: Erste 50 Worte jeder Section = Answer-First für Featured Snippets
- GEO: Structured Data ready, Entitäts-optimiert
- Kontakt: 07192/9789012 | Murrhardt`,
    `Erstelle einen SEO-optimierten Artikel für Position 1 zu:
KEYWORD: "${keyword}"
REGION: ${region}
TOP 10 WETTBEWERBER (SERP-Daten):
${serpData || 'Nicht verfügbar'}

LONGTAIL-KEYWORDS (einarbeiten):
${longtails || 'Nicht verfügbar'}

Der Artikel soll:
1. Title Tag (max 60 Zeichen) + Meta Description (max 155 Zeichen)
2. H1, H2-Struktur mit FAQ-Schema
3. 1500-2000 Wörter
4. Alle Longtails natürlich einarbeiten
5. Answer-First Absätze für AEO
6. Lokalen Bezug zu ${region} herstellen
7. CTA: Kostenloser Beratungstermin

Format: Markdown mit HTML-Schema-Kommentaren.`,
    { temperature: 0.8, maxTokens: 4000 }
  );

  return content;
}
