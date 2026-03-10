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

// ── HTML Landing Page Generator (Elementor-ready) ──
export async function generateHtmlLandingPage(keyword, region, service, serpData, longtails) {
  const content = await chat(
    `Du bist ein Elite-SEO-Content-Stratege und HTML-Entwickler für Schreinerhelden, eine Premium-Schreinerei in Murrhardt bei Stuttgart.

MARKE & DESIGN:
- Markenname: Schreinerhelden — "Wir sind (k)eine normale Schreinerei"
- Font: Helvetica (system fallback)
- CTA-Button: Hintergrund #EE7E00 (Orange), weiße Schrift, border-radius 5px, padding 18px
- CTA-Link: https://schreinerhelden.de/termin
- CTA-Text: "Kostenloser Online-Planungstermin"
- Sub-CTA: "Erfahre direkt im Anschluss den Preis."
- Hintergrund: #f6f8f5 (helles Grau-Grün)
- Text: #333333 (Dunkelgrau), H-Tags: #222222
- Kontakt: 07192/9789012 | Lindenstraße 9-15, 71540 Murrhardt

CONTENT-REGELN:
- Du-Ansprache (NIEMALS Sie)
- Schwäbisch/bodenständig aber premium
- E-E-A-T: Echte Werkstatt-Erfahrung, Schreinermeister-Expertise
- AEO: Erste 50 Wörter jeder Section = Answer-First (Featured Snippet Potential)
- MINDESTENS 1.400 Wörter, MAXIMAL 1.800 Wörter
- USP-Prozess: Online-Termin → Festpreis → Aufmaß → Fertigung → Montage

STÄDTE für Regionalbezug: Aalen, Backnang, Crailsheim, Ellwangen, Heilbronn, Ludwigsburg, Öhringen, Schwäbisch Hall, Schwäbisch Gmünd, Stuttgart, Waiblingen, Welzheim, Winnenden`,

    `Erstelle eine KOMPLETTE HTML-Seite für ein Elementor HTML-Widget.

KEYWORD: "${keyword}"
REGION: ${region}
SERVICE: ${service || keyword}

TOP 10 WETTBEWERBER:
${serpData || 'Nicht verfügbar'}

LONGTAIL-KEYWORDS (einarbeiten):
${longtails || 'Nicht verfügbar'}

SEITENSTRUKTUR (genau einhalten):

1. KOMMENTAR-BLOCK oben:
   <!-- Title Tag: [max 60 Zeichen] -->
   <!-- Meta Description: [max 155 Zeichen] -->
   <!-- Focus Keyword: ${keyword} -->
   <!-- Wortanzahl: [XXXX] -->

2. SCHEMA.ORG JSON-LD:
   <script type="application/ld+json"> mit LocalBusiness + Service + FAQPage Schema

3. HERO SECTION:
   - H4 leer (Spacer)
   - H2 "Schreinerhelden" (30px, weiß, Helvetica 400)
   - H1 "[Keyword-optimierter Titel]" (55px, weiß, Helvetica 600)
   - CTA-Button (Orange #EE7E00)
   - Sub-Text: "Erfahre direkt im Anschluss den Preis."

4. INTRO SECTION (H2 + 2 lange Absätze, mind. 200 Wörter):
   - H2 mit Keyword-Variation
   - Ausführlicher Fließtext, natürlich, nicht keyword-stuffed

5. SERVICE SECTIONS (3-4 Abschnitte, jeweils H2 + langer Absatz):
   - Jeder Abschnitt min. 150 Wörter
   - Natürliche Integration von Longtail-Keywords
   - Regionaler Bezug zu ${region}

6. ZWISCHENDRIN CTA-BANNER:
   - H2: "Dein persönlicher Online-Planungstermin – einfach und individuell"
   - Beschreibung des Prozesses
   - CTA-Button

7. VORTEILE/USP SECTION (H2 + Aufzählung):
   - Warum Schreinerhelden? 5-6 Punkte
   - Echte Handwerks-Argumentation

8. FAQ SECTION (H2 + min. 5 Fragen):
   - FAQPage Schema-kompatibel
   - Jede Antwort: Answer-First (erste 50 Wörter = Snippet)
   - Fragen basierend auf echten Suchphrasen

9. ABSCHLUSS CTA:
   - H2: "Buche jetzt deinen kostenlosen Termin!"
   - Emotionaler Absatz
   - CTA-Button

CSS-REGELN:
- Inline-Styles verwenden (Elementor HTML-Widget)
- max-width: 1100px; margin: 0 auto;
- Responsive: Schriftgrößen in clamp() oder relative Einheiten
- Abstände: sections padding 40px 20px
- Links/Buttons: kein text-decoration, cursor pointer

Antworte NUR mit dem HTML-Code. Kein Markdown, keine Erklärung. Nur valides HTML.`,
    { temperature: 0.8, maxTokens: 8000 }
  );

  return content;
}

// ── Wettbewerber-Diagnose (GPT-4o mit echten SERP+Backlink-Daten) ──
export async function generateCompetitorDiagnosis(keyword, region, serpResults, ourData, competitorData) {
  const result = await chat(
    `Du bist ein SEO-Stratege auf Agentur-Niveau. Du analysierst ECHTE Daten aus DataForSEO.
Analysiere objektiv und direkt. Keine Floskeln. Konkrete Handlungsempfehlungen.
Kontext: Schreinerhelden.de, Premium-Schreinerei in Murrhardt bei Stuttgart.
Zweite Domain: ihr-moebel-schreiner.de (B2B/Architekten).
WICHTIG: Keine Keyword-Kannibalisierung zwischen den Domains!`,
    `WETTBEWERBER-DIAGNOSE für "${keyword}" in ${region}

UNSERE POSITION:
${ourData || 'Nicht in TOP 20 gefunden'}

TOP 10 SERP-ERGEBNISSE:
${serpResults || 'Keine Daten'}

BACKLINK-/DOMAIN-DATEN DER WETTBEWERBER:
${competitorData || 'Keine Daten'}

Erstelle eine strukturierte Diagnose im JSON-Format:
{
  "keyword": "${keyword}",
  "region": "${region}",
  "ourPosition": null oder Zahl,
  "summary": "2-3 Sätze Zusammenfassung",
  "competitors": [
    {
      "position": 1,
      "domain": "...",
      "strengths": ["..."],
      "weaknesses": ["..."]
    }
  ],
  "whatTheyDoBetter": ["konkrete Punkte was TOP 3 besser machen"],
  "whereWeAreStrong": ["unsere echten Stärken"],
  "actionPlan": [
    {
      "priority": "high|medium|low",
      "action": "Konkrete Maßnahme",
      "impact": "Erwarteter Effekt",
      "effort": "Aufwand: niedrig|mittel|hoch"
    }
  ],
  "contentGaps": ["Themen die TOP 10 abdecken, wir aber nicht"],
  "estimatedTimeToTop10": "Einschätzung in Monaten"
}

Antworte NUR in validem JSON.`,
    { json: true, temperature: 0.7, maxTokens: 3000 }
  );

  return JSON.parse(result);
}
