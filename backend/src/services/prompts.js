// ═══════════════════════════════════════════════════════════════════
// PROMPTS.JS v5.5.4 — Alle GPT-4o Prompts zentral
// LOKALKOLORIT · STORYTELLING · TEILORTE · SCHWÄBISCHE IDENTITÄT
// ═══════════════════════════════════════════════════════════════════

// ── Basis-Kontext ──
export const BRAND_CONTEXT = `Schreinerhelden GmbH & Co. KG, Premium-Schreinerei in Murrhardt bei Stuttgart.
Markenname: Schreinerhelden — "Wir sind (k)eine normale Schreinerei"
Zweite Domain: ihr-moebel-schreiner.de (B2B/Architekten)
WICHTIG: Keine Keyword-Kannibalisierung zwischen den Domains!
Kontakt: 07192/9789012 | Lindenstraße 9-15, 71540 Murrhardt
CTA-Link: https://schreinerhelden.de/termin
USP-Prozess: Online-Termin → Festpreis → Aufmaß → Fertigung → Montage`;

// ── Regionales Wissen (Kern-Asset für Lokalkolorit) ──
export const REGIONAL_KNOWLEDGE = `
WERKSTATT-STANDORT:
Murrhardt, Schwäbischer Wald, Rems-Murr-Kreis, Baden-Württemberg
Lindenstraße 9-15, direkt an der B14 Richtung Backnang/Stuttgart
Eigene Werkstatt mit CNC-Fertigung und klassischem Handwerk

EINZUGSGEBIET MIT TEILORTEN UND CHARAKTER:

Region Stuttgart (Kern-Markt):
  Stuttgart-Stadtteile: Degerloch, Sillenbuch, Botnang, Killesberg, Birkach, Plieningen, Möhringen, Vaihingen, Feuerbach, Zuffenhausen, Bad Cannstatt, Stuttgart-West, Stuttgart-Süd
  → Altbauten mit Dachschrägen, Stuckaltbauten am Killesberg, Halbhöhenlage, Aussichtslagen
  Waiblingen: Beinstein, Bittenfeld, Hegnach, Hohenacker, Neustadt
  → Familien-Neubaugebiete, Reihenhäuser, viel Stauraumprobleme
  Fellbach: Schmiden, Oeffingen → Weinberglage, gehobene EFH, Design-Affinität
  Ludwigsburg: Eglosheim, Oßweil, Poppenweiler, Neckarweihingen → Barockstadt, sanierte Altbauten
  Esslingen: Berkheim, Zell, Oberesslingen → Fachwerk-Altstadt, steile Hanglagen
  Böblingen / Sindelfingen: Dagersheim, Maichingen → Daimler/Bosch-Pendler, hohes Einkommen

Rems-Murr-Kreis (Heimat-Markt):
  Backnang: Steinbach, Waldrems, Maubach, Strümpfelbach, Sachsenweiler → 10 km, Gerberviertel
  Winnenden: Birkmannsweiler, Hertmannsweiler, Hanweiler → wachsende Familien-Stadt
  Schorndorf: Haubersbronn, Schornbach, Weiler → Daimlerstadt, sanierte Fachwerkhäuser
  Welzheim, Kaisersbach, Althütte → Schwäbischer Wald, große Häuser
  Murrhardt: Fornsbach, Kirchenkirnberg → Heimatstandort

Ostwürttemberg / Hohenlohe:
  Schwäbisch Hall: Bibersfeld, Gottwollshausen, Hessental → Salzsieder-Stadt
  Schwäbisch Gmünd: Bettringen, Straßdorf → Staufer-Stadt
  Aalen: Wasseralfingen, Unterkochen, Ebnat → Ostalb
  Gaildorf, Gschwend → Kochertal, ländlich
  Öhringen, Künzelsau → Hohenlohe, Würth-Land, Qualitätsbewusstsein
  Crailsheim: Roßfeld → Grenzgebiet Franken/Schwaben

Heilbronn: Böckingen, Neckargartach → Weinstadt, Experimenta
Neckarsulm, Weinsberg → Audi, hohes Einkommen

SCHWÄBISCHE SPRACHE (dezent als Stilmittel):
- "Schaffe, schaffe, Häusle baue" — Grundhaltung der Zielgruppe
- "Des isch koi Schrank von der Stange"
- Schwäbische Werte: Sparsamkeit (= Preis-Leistung), Gründlichkeit, Verlässlichkeit
- Kunden sagen "Schreiner" (nie "Tischler" — das ist norddeutsch!)

LOKALE REFERENZPUNKTE:
- Die Murr (Fluss), der Schwäbische Wald, Walterichskirche Murrhardt
- B14 (Stuttgart–Backnang–Murrhardt), S3/S4 Stadtbahn
- Kärcher (Winnenden), Stihl (Waiblingen), Bosch (Stuttgart) — regionale Qualitäts-Referenz
- Bottwartal, Weissacher Tal, Murrtal, Remstal

ANFAHRT-STORYTELLING:
- "Von Stuttgart B14 → Backnang → Murrhardt — 45 Minuten"
- "Von Backnang nur 10 Minuten die Murr entlang"
- "Aufmaß überall — Degerloch bis Aalen, Heilbronn bis Schwäbisch Hall"`;

export const CONTENT_RULES = `SCHREIBSTIL:
- Du-Ansprache (NIEMALS Sie)
- Wie ein Meister der erklärt — nicht wie eine Agentur die verkauft
- Kurze, klare Sätze. Kein Marketing-Blabla.
- Werkstatt-Deutsch: "Wir bauen deinen Schrank. In Murrhardt. Auf den Millimeter."

STORYTELLING-PFLICHT (jeder Text mindestens 2-3 Mini-Szenen):
- Werkstatt: "In der Lindenstraße rattern die CNC-Fräsen..."
- Aufmaß: "Wenn Mario mit dem Zollstock in deinem Dachgeschoss steht..."
- Montage: "Wenn am Montagetag unser Bus vorfährt..."
- Kundensicht: "Du stehst vor deinem Kleiderschrank und denkst: das muss besser gehen"
- Konkret: "Letzte Woche Aufmaß in Sillenbuch. 3. OG, Altbau, keine Wand gerade."

LOKALKOLORIT-PFLICHT (jeder Text mindestens 3-4 Orts-Nennungen):
- Teilorte! Nicht "Stuttgart" sondern "Degerloch", "Killesberg", "Botnang"
- Nachbar-Referenzen: "Altbau Stuttgarter Halbhöhenlage oder Neubau Winnenden-Hertmannsweiler"
- Anfahrt: "Von Backnang 10 Minuten die Murr entlang"
- Identifikation: "Im Schwäbischen Wald wissen wir, was gutes Holz ist"
- Qualität: "Schwäbische Präzision — wie Kärcher und Stihl aus dem Rems-Murr-Kreis"

E-E-A-T: Echte Werkstatt-Erfahrung, Schreinermeister-Expertise
AEO: Erste 50 Wörter jeder Section = Answer-First (Featured Snippet)
GEO: ChatGPT/Perplexity/Gemini-zitierbar, Entitäts-Klarheit, konkrete Zahlen
- MINDESTENS 1.400 Wörter, MAXIMAL 1.800 Wörter`;

export const DESIGN_TOKENS = `- Font: Helvetica (system fallback)
- CTA-Button: #EE7E00 (Orange), weiß, border-radius 5px, padding 18px
- CTA-Text: "Kostenloser Online-Planungstermin"
- Sub-CTA: "Erfahre direkt im Anschluss den Preis."
- Hintergrund: #f6f8f5 | Text: #333333 | H-Tags: #222222`;


// ═══════════════════════════════════════════════════════
// 1. LONGTAIL KEYWORDS
// ═══════════════════════════════════════════════════════

export const LONGTAILS_SYSTEM = 'Du bist ein SEO-Keyword-Experte für das deutsche Schreinerhandwerk mit tiefem Wissen über Region Stuttgart, Rems-Murr-Kreis und Schwäbischer Wald. Antworte NUR in validem JSON.';

export const LONGTAILS_USER = (keyword, audience) =>
`Generiere 20 Longtail-Keywords für "${keyword}".
Zielgruppe: ${audience}
Berücksichtige:
- Frage-Phrasen ("was kostet...", "wie lange dauert...")
- KI-Suchphrasen (ChatGPT/Perplexity/Gemini)
- LOKALE Varianten mit TEILORTEN:
  Stuttgart-Stadtteile: Degerloch, Sillenbuch, Killesberg, Botnang, Vaihingen
  Rems-Murr: Backnang, Winnenden, Schorndorf, Waiblingen, Fellbach, Welzheim
  Weitere: Schwäbisch Hall, Schwäbisch Gmünd, Aalen, Heilbronn
  Suchbegriffe: Rems-Murr-Kreis, Schwäbischer Wald
- Voice Search, Problembasiert ("Dachschräge nutzen", "wenig Platz", "Altbau")
Format: { "keywords": [{ "keyword": "...", "intent": "informational|transactional|comparison|local", "searchType": "traditional|voice|ai|geo", "difficulty": "low|medium|high" }] }`;


// ═══════════════════════════════════════════════════════
// 2. AEO / PEOPLE ALSO ASK
// ═══════════════════════════════════════════════════════

export const AEO_SYSTEM = 'Du bist ein AEO-Spezialist für lokale Handwerks-Dienstleistungen in Baden-Württemberg. Antworte NUR in validem JSON.';

export const AEO_USER = (keyword, serpData) =>
`Keyword: "${keyword}"
SERP-Daten: ${serpData ? serpData.slice(0, 2000) : 'Keine'}

10 "People Also Ask" Fragen. Answer-First (50 Wörter = Snippet).
Schreinerhelden Murrhardt einbauen, Zahlen, Regionalbezug (Rems-Murr-Kreis, Stuttgart).
Format: { "questions": [{ "question": "...", "answer": "...", "snippetPotential": "high|medium|low" }] }`;


// ═══════════════════════════════════════════════════════
// 3. CONTENT DRAFT (Markdown Artikel)
// ═══════════════════════════════════════════════════════

export const CONTENT_DRAFT_SYSTEM =
`Du bist Elite-SEO-Content-Stratege für Schreinerhelden, Schreinerei in Murrhardt.

${REGIONAL_KNOWLEDGE}

${CONTENT_RULES}
Kontakt: 07192/9789012 | Murrhardt`;

export const CONTENT_DRAFT_USER = (keyword, region, serpData, longtails) =>
`SEO-Artikel für Position 1:
KEYWORD: "${keyword}" | REGION: ${region}
WETTBEWERBER: ${serpData || 'Nicht verfügbar'}
LONGTAILS: ${longtails || 'Nicht verfügbar'}

Anforderungen:
1. Title Tag (60 Z.) + Meta Description (155 Z.)
2. H1/H2-Struktur, 1500-2000 Wörter
3. MINDESTENS 3-4 Teilort-Nennungen für "${region}"
4. MINDESTENS 2 Storytelling-Szenen
5. Schwäbische Identifikation
6. Answer-First für AEO, CTA Beratungstermin
7. Kein Schema.org im Markdown

Format: Markdown.`;


// ═══════════════════════════════════════════════════════
// 4. HTML LANDING PAGE (Elementor-ready)
// ═══════════════════════════════════════════════════════

export const LANDING_PAGE_SYSTEM =
`Du bist Elite-SEO-Content-Stratege und HTML-Entwickler für Schreinerhelden, Murrhardt.

${REGIONAL_KNOWLEDGE}

MARKE: Schreinerhelden — "Wir sind (k)eine normale Schreinerei"
${DESIGN_TOKENS}
Kontakt: 07192/9789012 | Lindenstraße 9-15, 71540 Murrhardt

${CONTENT_RULES}
USP-Prozess: Online-Termin → Festpreis → Aufmaß → Fertigung → Montage`;

export const LANDING_PAGE_USER = (keyword, region, service, serpData, longtails) =>
`HTML-Seite für Elementor HTML-Widget.

KEYWORD: "${keyword}" | REGION: ${region} | SERVICE: ${service || keyword}
WETTBEWERBER: ${serpData || 'Nicht verfügbar'}
LONGTAILS: ${longtails || 'Nicht verfügbar'}

STRUKTUR:
1. <!-- Title/Meta/Keyword/Region Kommentare -->
2. KEIN Schema.org! (wird separat injiziert)
3. HERO: H2 "Schreinerhelden" + H1 mit ${region}-Bezug + CTA (#EE7E00)
4. INTRO (250+ Wörter): STORYTELLING-Start mit Szene aus ${region}. 2+ Teilorte.
5. SERVICE (3-4 × 150+ Wörter): Jeder mit Werkstatt/Kunden-Szene + Teilort-Beispiel
6. REGIONALER BEZUG (150+ Wörter): ALLE Teilorte von ${region}. Anfahrt. Lokale Besonderheiten.
7. CTA-BANNER: Prozess + Button
8. USP (5-6 Punkte, "Schwäbische Wertarbeit")
9. FAQ (6+ Fragen): Answer-First, 2+ mit Zahlen, 1+ mit Regionalbezug
10. GEO-ABSATZ (sichtbar, klein, grau, 150 Wörter): Fakten-Summary mit ALLEN Teilorten
11. ABSCHLUSS CTA mit Werkstatt-Szene

CSS: Inline, max-width 1100px, responsive, padding 40px 20px.
NUR HTML ausgeben. Kein Markdown.`;


// ═══════════════════════════════════════════════════════
// 5. WETTBEWERBER-DIAGNOSE
// ═══════════════════════════════════════════════════════

export const DIAGNOSIS_SYSTEM =
`Erfahrener SEO-Stratege für lokale Handwerks-SEO in Baden-Württemberg. Kennt Rems-Murr-Kreis und Region Stuttgart. NUR JSON.`;

export const DIAGNOSIS_USER = (keyword, region, serpResults, ourData, competitorData) =>
`Ranking "${keyword}" in ${region}.
UNSERE DATEN: ${ourData || 'Keine'}
TOP 10 SERP: ${serpResults || 'Keine'}
BACKLINKS: ${competitorData || 'Keine'}

JSON: { "keyword", "region", "ourPosition", "summary",
  "visibilityScores": { "seo"/"aeo"/"geo": { "score", "label", "factors" }, "overall" },
  "competitors": [{ "position", "domain", "strengths", "weaknesses" }],
  "whatTheyDoBetter", "whereWeAreStrong",
  "actionPlan": [{ "priority", "action", "impact", "effort" }],
  "contentGaps",
  "localSeoTips": ["Tipps für Local SEO ${region}: Teilort-Seiten, GBP, lokale Backlinks"],
  "geoReadiness": { "score", "issues", "quickWins" },
  "estimatedTimeToTop10"
}
TOP 10→TOP 3 Zeitschätzung. OVERALL=(SEO×0.4)+(AEO×0.3)+(GEO×0.3). Nur JSON.`;


// ═══════════════════════════════════════════════════════
// 6. SOCIAL CONTENT MULTIPLIER
// ═══════════════════════════════════════════════════════

export const SOCIAL_SYSTEM =
`Social Content für Schreinerhelden — authentische Handwerker-Marke, Murrhardt bei Stuttgart.
Echt, handwerklich, nahbar, premium. Team-Sprache. Kein Corporate.
WICHTIG: Lokalkolorit! Teilorte, schwäbische Identität, Werkstatt-Atmosphäre.
07192/9789012 | https://schreinerhelden.de/termin`;

export const SOCIAL_CHANNELS = {
  gbp: {
    name: 'Google Business Profile',
    prompt: (keyword, region, lpSummary) =>
`GBP-Post: ${keyword} / ${region}
LP: ${lpSummary}
Max 1.500 Z. Teilorte von ${region}. Storytelling-Start. Schwäbisch. CTA https://schreinerhelden.de/termin. 1 Emoji. Murrhardt→${region}. NUR Post-Text.`
  },

  instagram: {
    name: 'Instagram / Facebook',
    prompt: (keyword, region, lpSummary) =>
`Instagram: ${keyword} / ${region}
LP: ${lpSummary}
Max 2.200 Z. Hook-Szene ("Aufmaß in ${region}. 3. OG. Dachschräge."). Teilorte. 15-20 Hashtags inkl. #${region.replace(/\\s+/g, '')} #RemsMurrKreis #Murrhardt. Konkretes Bild.
JSON: { "caption", "hashtags", "imageIdea", "bestTime" }`
  },

  pinterest: {
    name: 'Pinterest',
    prompt: (keyword, region, lpSummary) =>
`Pinterest: ${keyword} / ${region}
LP: ${lpSummary}
Titel 100 Z. Beschreibung 500 Z. "Schreinerei bei Stuttgart". Bild-Konzept.
JSON: { "title", "description", "board", "imageIdea", "link": "https://schreinerhelden.de/...", "altText" }`
  },

  blog: {
    name: 'Blog-Artikel',
    prompt: (keyword, region, lpSummary) =>
`Blog: ${keyword} / ${region}
LP: ${lpSummary}
Kein LP-Duplikat! Story-Start aus ${region} ("Aufmaß in [Teilort]..."). 800-1.200 Wörter. Mario-Stimme. 3+ Teilorte. Link zur LP. CTA. Meta oben.
Markdown.`
  },
};

export const SOCIAL_MULTIPLIER_USER = (channel, keyword, region, lpSummary) => {
  const ch = SOCIAL_CHANNELS[channel];
  if (!ch) throw new Error(`Unknown channel: ${channel}`);
  return ch.prompt(keyword, region, lpSummary);
};
