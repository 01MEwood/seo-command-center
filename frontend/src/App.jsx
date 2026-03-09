import { useState, useCallback } from "react";

// =====================================================================
// SCHREINERHELDEN SEO COMMAND CENTER v4 — "AGENCY SIMULATOR"
// 16-Person Agency Team · SEO/AEO/GEO Dominance Engine
// Build: v4.0 FINAL — Production Ready
// =====================================================================

// --- REAL DATA from schreinerhelden.de & ihr-moebel-schreiner.de ---

const BRANDS = {
  schreinerhelden: {
    id: "schreinerhelden",
    name: "Schreinerhelden",
    domain: "schreinerhelden.de",
    tagline: "Wir sind (k)eine normale Schreinerei",
    usp: "Online-Planungstermin → Festpreis → Aufmaß → Fertigung → Montage",
    color: "#e67e22",
    hero: "Wir bauen deinen Schrank nach Maß",
    cta: "Kostenloser Online-Planungstermin",
    phone: "07192 / 9789012",
    address: "Lindenstraße 9-15, 71540 Murrhardt",
    process: ["Online-Termin buchen", "Live-Planung + Festpreis", "Aufmaß bei dir", "Fertigung in Murrhardt", "Montage inkl."],
    lieferzeit: "3-8 Wochen",
    values: ["Handschlagqualität", "Schnelle Kommunikation", "Faire Preise", "Kreative Lösungen", "Saubere Montage"],
    services: [
      { id: "begehbarer-kleiderschrank", name: "Begehbarer Kleiderschrank", slug: "/begehbarer-kleiderschrank", keywords: ["begehbarer Kleiderschrank", "begehbarer Kleiderschrank nach Maß", "Ankleide", "Walk-in Closet"] },
      { id: "dachschraegenschrank", name: "Dachschrägenschrank", slug: "/dachschraegenschrank", keywords: ["Dachschrägenschrank", "Schrank Dachschräge", "Dachschrägenmöbel", "Kniestockschrank"] },
      { id: "garderobe", name: "Garderobe", slug: "/garderobe", keywords: ["Garderobe nach Maß", "Garderobe Eingangsbereich", "Flurmöbel", "Garderobenschrank"] },
      { id: "kleiderschrank", name: "Kleiderschrank", slug: "/kleiderschrank", keywords: ["Kleiderschrank nach Maß", "Kleiderschrank Schreiner", "individueller Kleiderschrank"] },
      { id: "stauraumschrank", name: "Stauraumschrank", slug: "/stauraumschrank", keywords: ["Stauraumschrank", "Stauraum Lösung", "Nischenschrank", "Abstellkammer Schrank"] },
      { id: "treppenschrank", name: "Treppenschrank", slug: "/treppenschrank-massgefertigter-schrank-unter-der-treppe", keywords: ["Treppenschrank", "Schrank unter Treppe", "Stauraum unter Treppe"] },
      { id: "waschmaschinenschrank", name: "Waschmaschinenschrank", slug: "/waschmaschinenschrank", keywords: ["Waschmaschinenschrank", "Hauswirtschaftsraum Schrank", "Waschküche Möbel"] },
    ],
  },
  "ihr-moebel-schreiner": {
    id: "ihr-moebel-schreiner",
    name: "Möbelschreiner Mario Esch",
    domain: "ihr-moebel-schreiner.de",
    tagline: "Möbel nach Maß vom Schreinermeister",
    usp: "Persönlich betreut vom ersten Gespräch bis zur fertigen Montage",
    color: "#2c3e50",
    hero: "Maßgefertigte Einbauschränke & Möbel vom Schreiner für Räume, die perfekt passen",
    cta: "Jetzt unverbindlich beraten lassen",
    phone: "07192 9357200",
    address: "Lindenstraße 9-15, 71540 Murrhardt",
    process: ["Direkt anrufen", "Rückruf-Service", "Online-Beratung", "Aufmaß vor Ort", "Fertigung + Montage"],
    lieferzeit: "4-8 Wochen",
    values: ["Schreinermeister-Qualität", "Kein Subunternehmer", "Millimetergenaue Fertigung", "Langfristige Wertsteigerung"],
    services: [
      { id: "einbauschrank", name: "Einbauschrank", slug: "/einbauschrank-murrhardt/", keywords: ["Einbauschrank", "Einbauschrank nach Maß", "Einbauschrank Murrhardt", "Einbaumöbel"] },
      { id: "dachschraegenschrank-ims", name: "Dachschrägenschrank", slug: "/dachschraegenschrank-nach-mass-schreiner-murrhardt-backnang/", keywords: ["Dachschrägenschrank", "Dachschräge Schreiner", "Kniestock Schrank"] },
      { id: "begehbarer-ims", name: "Begehbarer Kleiderschrank", slug: "/begehbarer-kleiderschrank-vom-schreiner-in-murrhardt-massanfertigung/", keywords: ["begehbarer Kleiderschrank Schreiner", "Ankleide nach Maß"] },
      { id: "garderobe-ims", name: "Garderobe nach Maß", slug: "/garderobe-nach-mass/", keywords: ["Garderobe nach Maß", "Flurgarderobe", "Garderobenmöbel Schreiner"] },
      { id: "schraenke-nach-mass", name: "Schränke nach Maß", slug: "/schraenke-nach-mass-vom-schreiner-in-murrhardt/", keywords: ["Schränke nach Maß", "Maßschrank", "Schreiner Murrhardt"] },
    ],
  },
};

// --- REGIONS with Einwohnerzahl & Kaufkraft-Index ---
const REGIONS = [
  { id: "murrhardt", name: "Murrhardt", kreis: "Rems-Murr-Kreis", einwohner: 14200, kaufkraft: 102, entfernung: 0, potential: "Basis" },
  { id: "backnang", name: "Backnang", kreis: "Rems-Murr-Kreis", einwohner: 37400, kaufkraft: 105, entfernung: 15, potential: "Hoch" },
  { id: "winnenden", name: "Winnenden", kreis: "Rems-Murr-Kreis", einwohner: 28800, kaufkraft: 110, entfernung: 25, potential: "Hoch" },
  { id: "waiblingen", name: "Waiblingen", kreis: "Rems-Murr-Kreis", einwohner: 57000, kaufkraft: 112, entfernung: 30, potential: "Sehr hoch" },
  { id: "schorndorf", name: "Schorndorf", kreis: "Rems-Murr-Kreis", einwohner: 40000, kaufkraft: 108, entfernung: 28, potential: "Hoch" },
  { id: "fellbach", name: "Fellbach", kreis: "Rems-Murr-Kreis", einwohner: 46000, kaufkraft: 118, entfernung: 35, potential: "Sehr hoch" },
  { id: "welzheim", name: "Welzheim", kreis: "Rems-Murr-Kreis", einwohner: 11300, kaufkraft: 100, entfernung: 12, potential: "Mittel" },
  { id: "stuttgart", name: "Stuttgart", kreis: "Stuttgart", einwohner: 635000, kaufkraft: 115, entfernung: 45, potential: "Maximal" },
  { id: "ludwigsburg", name: "Ludwigsburg", kreis: "Ludwigsburg", einwohner: 93800, kaufkraft: 113, entfernung: 40, potential: "Sehr hoch" },
  { id: "heilbronn", name: "Heilbronn", kreis: "Heilbronn", einwohner: 128000, kaufkraft: 106, entfernung: 50, potential: "Hoch" },
  { id: "schwaebisch-hall", name: "Schwäbisch Hall", kreis: "Schwäbisch Hall", einwohner: 42000, kaufkraft: 103, entfernung: 40, potential: "Mittel" },
  { id: "schwaebisch-gmuend", name: "Schwäbisch Gmünd", kreis: "Ostalbkreis", einwohner: 61000, kaufkraft: 101, entfernung: 45, potential: "Hoch" },
  { id: "gaildorf", name: "Gaildorf", kreis: "Schwäbisch Hall", einwohner: 12400, kaufkraft: 98, entfernung: 20, potential: "Mittel" },
  { id: "oehringen", name: "Öhringen", kreis: "Hohenlohekreis", einwohner: 25000, kaufkraft: 104, entfernung: 55, potential: "Mittel" },
  { id: "crailsheim", name: "Crailsheim", kreis: "Schwäbisch Hall", einwohner: 35000, kaufkraft: 100, entfernung: 65, potential: "Mittel" },
  { id: "aalen", name: "Aalen", kreis: "Ostalbkreis", einwohner: 69000, kaufkraft: 104, entfernung: 60, potential: "Hoch" },
  { id: "esslingen", name: "Esslingen", kreis: "Esslingen", einwohner: 94000, kaufkraft: 114, entfernung: 50, potential: "Sehr hoch" },
  { id: "boeblingen", name: "Böblingen", kreis: "Böblingen", einwohner: 50000, kaufkraft: 120, entfernung: 55, potential: "Sehr hoch" },
];

// --- AGENCY TEAM (16 Specialists) ---
const AGENCY_TEAM = [
  { id: "strategist", name: "SEO-Stratege", icon: "🎯", role: "Keyword-Cluster, Intent-Mapping, Dual-Domain-Strategie ohne Kannibalisierung", status: "active" },
  { id: "aeo", name: "AEO-Spezialist", icon: "🤖", role: "Answer Engine Optimization — Featured Snippets, PAA, AI Overview Targeting", status: "active" },
  { id: "geo", name: "GEO-Spezialist", icon: "🌐", role: "Generative Engine Optimization — ChatGPT/Gemini/Perplexity Sichtbarkeit", status: "active" },
  { id: "technical", name: "Tech-SEO Engineer", icon: "⚙️", role: "Schema Markup, Core Web Vitals, Crawlability, Structured Data", status: "active" },
  { id: "local", name: "Local SEO Manager", icon: "📍", role: "GBP Optimization, Citations, NAP-Konsistenz, Review-Strategie", status: "active" },
  { id: "content", name: "Content-Stratege", icon: "📝", role: "Intent-Cluster-Planung, Topical Authority Map, Content-Kalender", status: "active" },
  { id: "copywriter", name: "Conversion Copywriter", icon: "✍️", role: "Storytelling, psychologische Trigger, Heatmap-informierte Texte", status: "active" },
  { id: "ux", name: "UX/CRO-Experte", icon: "🧠", role: "Conversion-Architektur, Heatmap-Analyse, A/B-Test Konzepte", status: "active" },
  { id: "designer", name: "UI-Designer", icon: "🎨", role: "Visuelle Hierarchie, Above-the-Fold, Mobile-First Design", status: "active" },
  { id: "social", name: "Social Media Manager", icon: "📱", role: "Instagram, Facebook, TikTok, Pinterest Content-Planung", status: "active" },
  { id: "video", name: "Video-Produzent", icon: "🎬", role: "YouTube-Strategie, Reels/TikTok Scripts, Thumbnail-Konzepte", status: "active" },
  { id: "ads-google", name: "Google Ads Manager", icon: "💰", role: "Search Ads, PMax, LSA-Kampagnen, Keyword-Bidding", status: "active" },
  { id: "ads-meta", name: "Meta Ads Manager", icon: "🎯", role: "3-Schichten-Funnel, Lookalike Audiences, Creative Testing", status: "active" },
  { id: "analytics", name: "Analytics-Spezialist", icon: "📊", role: "GA4, GSC, GBP Insights, Conversion-Tracking, Attribution", status: "active" },
  { id: "pr", name: "PR & Outreach", icon: "🔗", role: "Lokale Backlinks, Pressemitteilungen, Community-Building", status: "active" },
  { id: "brand", name: "Brand-Stratege", icon: "👑", role: "Markenpositionierung, Dual-Brand-Architektur, Tone of Voice", status: "active" },
];

// --- CHANNELS ---
const CHANNELS = [
  { id: "website", label: "Landing Page", icon: "🌐", color: "#2563eb" },
  { id: "gbp", label: "Google Business", icon: "📍", color: "#ea4335" },
  { id: "facebook", label: "Facebook", icon: "📘", color: "#1877f2" },
  { id: "instagram", label: "Instagram", icon: "📸", color: "#e4405f" },
  { id: "pinterest", label: "Pinterest", icon: "📌", color: "#bd081c" },
  { id: "tiktok", label: "TikTok", icon: "🎵", color: "#010101" },
  { id: "youtube", label: "YouTube", icon: "▶️", color: "#ff0000" },
  { id: "houzz", label: "Houzz", icon: "🏠", color: "#4dbc7c" },
  { id: "email", label: "Newsletter", icon: "✉️", color: "#6366f1" },
  { id: "googleads", label: "Google Ads", icon: "💰", color: "#fbbc04" },
  { id: "metaads", label: "Meta Ads", icon: "🎯", color: "#0668e1" },
];

// --- PSYCHOLOGICAL LP ARCHITECTURE (Heatmap-informed) ---
const LP_ARCHITECTURE = {
  sections: [
    { id: "hero", name: "Hero Section", position: 1, heatmapZone: "HOT", psychology: "Pattern Interrupt + Wertversprechen in <3 Sek. Gehirn entscheidet in 50ms ob Seite relevant ist.", elements: ["H1 mit Ort + Service", "Subline mit USP", "Hero-Bild (echtes Projekt, kein Stock)", "Primary CTA (Above the Fold)", "Trust-Badge (Bewertungen)"], copyRules: "Max 8 Worte H1. Kein 'Willkommen'. Direkt den Nutzen adressieren. Lokalität im H1." },
    { id: "pain-agitate", name: "Pain & Agitate", position: 2, heatmapZone: "WARM", psychology: "Empathie aufbauen. Das Problem des Besuchers spiegeln. Cognitive Bias: Loss Aversion — 'Was verlierst du ohne Lösung?'", elements: ["Problem-Statement (2-3 Sätze)", "Emotionale Verstärkung", "Überleitung zur Lösung"], copyRules: "Du-Ansprache. Kurze Sätze. Spezifische Szenarien aus dem Alltag." },
    { id: "solution", name: "Lösung & USP", position: 3, heatmapZone: "WARM", psychology: "Kognitive Entlastung: Zeige den einfachen Weg. Zeigarnik-Effekt: Prozess andeuten, Neugier wecken.", elements: ["3-5 Schritt Prozess-Visualisierung", "USP-Punkte mit Icons", "Zweiter CTA"], copyRules: "Nummerierte Schritte. Jeder Schritt max 1 Zeile. Benefit-orientiert, nicht Feature-orientiert." },
    { id: "social-proof", name: "Social Proof", position: 4, heatmapZone: "WARM-COOL", psychology: "Bandwagon Effect + Authority Bias. Echte Kundenstimmen wirken 12x stärker als Eigenaussagen.", elements: ["3 Kundenstimmen mit Name + Ort", "Google-Bewertungs-Badge", "Projekt-Zahlen (200+ Projekte, 15 Jahre)"], copyRules: "Echte Zitate mit spezifischen Details. Kein generisches 'War super'. Ort des Kunden nennen." },
    { id: "showcase", name: "Projekt-Showcase", position: 5, heatmapZone: "COOL-WARM", psychology: "Visual Proof + Aspiration. Besucher muss sich vorstellen können: 'Das will ich auch!'", elements: ["3-4 Projektbilder (regional relevant)", "Vorher/Nachher wenn möglich", "Material + Ort Tag"], copyRules: "Bildunterschriften mit Ort + Service. Keine langen Texte — Bilder sprechen." },
    { id: "faq-aeo", name: "FAQ (AEO-optimiert)", position: 6, heatmapZone: "COOL", psychology: "Einwandbehandlung. Jede unbeantwortete Frage = Conversion-Killer. Answer-First für AI-Snippets.", elements: ["4-6 FAQ-Akkordeons", "Schema-Markup (FAQPage)", "Preis-Transparenz-Frage"], copyRules: "Frage = Exakte Suchanfrage. Antwort: Erste 50 Worte = komplette Antwort (AEO). Dann Details." },
    { id: "final-cta", name: "Final CTA", position: 7, heatmapZone: "WARM (Scroll-Back)", psychology: "Commitment & Consistency. Wiederholung des Wertangebots. Urgency ohne Fake-Countdown.", elements: ["CTA-Block mit Zusammenfassung", "Telefon + Online-Termin", "Vertrauens-Statement"], copyRules: "Wiederhole den Kern-Benefit. Entferne letzte Hürden: 'Kostenlos', 'Unverbindlich', 'In 2 Minuten'." },
  ],
};

// --- MAIN NAVIGATION ---
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "lp-builder", label: "LP Builder", icon: "🏗️" },
  { id: "bulk-matrix", label: "Bulk Matrix", icon: "⚡" },
  { id: "content-hub", label: "Content Hub", icon: "✍️" },
  { id: "channels", label: "Kanäle", icon: "📡" },
  { id: "calendar", label: "Kalender", icon: "📅" },
  { id: "keywords", label: "Keywords", icon: "🔍" },
  { id: "competitors", label: "Wettbewerber", icon: "⚔️" },
  { id: "schema", label: "Schema.org", icon: "🏷️" },
  { id: "team", label: "Agency Team", icon: "👥" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

// =====================================================================
// OPENAI API INTEGRATION
// =====================================================================
async function callOpenAI(prompt, systemPrompt, apiKey) {
  if (!apiKey) return { error: "Kein API Key konfiguriert" };
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });
    const data = await res.json();
    if (data.error) return { error: data.error.message };
    return { text: data.choices?.[0]?.message?.content || "" };
  } catch (e) {
    return { error: e.message };
  }
}

// System prompts for each "team member"
const SYSTEM_PROMPTS = {
  copywriter: `Du bist ein Elite-Conversion-Copywriter der für Marken wie Apple, Tesla und Gucci arbeitet. Du schreibst für eine Schreinerei namens "Schreinerhelden" in Murrhardt. 

DEINE EXPERTISE:
- Psychologische Trigger: Loss Aversion, Social Proof, Anchoring, Scarcity (aber KEINE Fake-Urgency)
- Heatmap-informiertes Schreiben: Du weißt wo Besucher hinschauen (Hero = 80% Aufmerksamkeit, Below-the-fold = drastischer Drop)
- Conversion-Architektur: Problem → Agitation → Solution → Proof → CTA
- Storytelling das fesselt: Zeige den Kunden in seiner besseren Zukunft

REGELN:
- IMMER Du-Ansprache (informell, warm, nahbar)
- Deutsche Sprache, kein Denglisch
- Kurze Sätze. Kurze Absätze. Wie eine Unterhaltung.
- Jeder Text hat einen klaren nächsten Schritt (CTA)
- Lokale Referenzen einbauen (Ort, Region)
- Keine leeren Floskeln. Jedes Wort muss verdient sein.
- KEIN "Herzlich Willkommen" — das ist ein Conversion-Killer`,

  strategist: `Du bist ein SEO/AEO/GEO-Strategieberater auf dem Niveau von Joy Hawkins, Julian Dziki und Aleyda Solis. Du berätst die Marke "Schreinerhelden" (schreinerhelden.de) und "Möbelschreiner Mario Esch" (ihr-moebel-schreiner.de).

DEINE EXPERTISE:
- Dual-Domain-Strategie ohne Keyword-Kannibalisierung
- Intent-Cluster statt Einzel-Keywords
- AEO: Answer-First-Struktur für AI Overviews & Featured Snippets
- GEO: Optimierung für ChatGPT, Gemini, Perplexity Sichtbarkeit
- Local SEO: GBP, Citations, Reviews, Hyper-Local-Targeting
- Entity-Building: Marke als Google-Entität etablieren

DUAL-DOMAIN-STRATEGIE:
- schreinerhelden.de = Marke + Online-Prozess + Direkt-CTA + Emotional
- ihr-moebel-schreiner.de = Schreinermeister + Ratgeber + E-E-A-T + Regional-Seiten
Keine Überschneidung bei identischen Keywords.`,

  social: `Du bist Social Media Manager für eine Premium-Handwerksmarke. Du erstellst Content für Instagram, Facebook, TikTok, Pinterest, YouTube und Houzz. 

DEIN STIL:
- Authentisch, nicht polished. Echte Werkstatt > Studio.
- Storytelling: Zeige den Prozess, nicht nur das Ergebnis
- Community-Building: Fragen stellen, Interaktion fördern
- Hashtag-Strategie: Mix aus Nischen (#SchrankNachMaß) und Reichweite (#Handwerk)
- Plattform-spezifisch: TikTok ≠ LinkedIn ≠ Pinterest

MARKENTONALITÄT:
Warm, kompetent, nahbar. Wie ein Freund der zufällig Schreinermeister ist.`,

  gbp: `Du erstellst Google Business Profile Posts für eine Schreinerei. Format: Kurz (max 300 Wörter), mit CTA-Button-Text. Lokale Relevanz betonen. Emoji sparsam. Immer mit konkretem Angebot oder Projekt enden.`,

  instagram: `Du erstellst Instagram Content (Caption + Hashtags + Reel-Idee) für eine Schreinerei. Authentisch, visual-first. Hashtags: Mix aus Nische und Reichweite. Caption max 200 Wörter. Reel-Script mit Sekundenangaben.`,

  facebook: `Du erstellst Facebook Posts und Ad Copy für eine lokale Schreinerei. Organische Posts: Community-orientiert, Storytelling. Ad Copy: Headline (max 40 Zeichen), Primary Text, Description, CTA. Zielgruppe: Hausbesitzer 30-65.`,

  pinterest: `Du erstellst Pinterest Pin-Content für Möbel/Interior. SEO-optimierte Pin-Titel und Beschreibungen (Pinterest ist eine Suchmaschine!). Hochformat-Bilder empfehlen. Board-Strategie. Alt-Text für Accessibility.`,

  tiktok: `Du erstellst TikTok Scripts für Handwerk/Woodworking Content. Hook in den ersten 3 Sekunden. ASMR-Werkstattgeräusche empfehlen. Trending-Sound-Strategie. Behind-the-Scenes. Kein overpolished Content. Sekundengenauer Ablauf.`,

  youtube: `Du erstellst YouTube-Content: Titel (max 60 Zeichen, clickworthy), Description mit Kapitelmarken, Tags, Thumbnail-Idee. Für Handwerker/Schreiner-Kanal. SEO-optimiert für YouTube-Suche. Länge: 8-12 Min ideal.`,

  houzz: `Du erstellst Houzz-Projektbeschreibungen für maßgefertigte Möbel. Professionell, detail-orientiert. Material, Maße, Herausforderungen, Lösung beschreiben. Ideabook-Titel vorschlagen. Tags für Houzz-Suche.`,

  email: `Du erstellst Newsletter/E-Mail-Kampagnen für eine Schreinerei. Subject Line (max 50 Zeichen, neugierig machend), Preview Text, Body mit einem klaren CTA. Persönlich, nicht werblich. Segmentiert nach Region.`,

  googleads: `Du erstellst Google Ads Content: 8 Headlines (je max 30 Zeichen), 2 Descriptions (je max 90 Zeichen), Sitelink-Vorschläge, Callout-Extensions, Structured Snippets. Keyword-fokussiert, lokal, mit USP.`,

  metaads: `Du erstellst Meta Ads (Facebook + Instagram) in 3 Funnel-Stufen:
1. AWARENESS: Brand-Video/Reel, breites Targeting, 5-10€/Tag
2. RETARGETING: Karussell/Testimonial, Website-Besucher + Video-Viewer, 5-8€/Tag  
3. LEAD GEN: Lead Ad mit Instant Form, Lookalike + Warm Audience, 10-15€/Tag
Für jeden: Ad Copy, Format-Empfehlung, Targeting, Budget.`,
};

// Channel-specific prompt builders
function buildChannelPrompt(channel, service, region, brand) {
  const reg = REGIONS.find(r => r.id === region);
  const base = `SERVICE: ${service.name}\nORT: ${reg.name} (${reg.kreis}, ${reg.einwohner.toLocaleString("de-DE")} Einwohner, KKI ${reg.kaufkraft})\nMARKE: ${brand.name} (${brand.domain})\nTELEFON: ${brand.phone}\nUSP: ${brand.usp}\nKEYWORDS: ${service.keywords.join(", ")}`;
  
  const channelInstructions = {
    gbp: `${base}\n\nErstelle einen Google Business Profile Post als JSON:\n{"title":"...","body":"...","cta":"...","tips":"..."}`,
    instagram: `${base}\n\nErstelle Instagram Content als JSON:\n{"caption":"...","hashtags":"...","reelScript":"...","bestTime":"...","tips":"..."}`,
    facebook: `${base}\n\nErstelle Facebook Content als JSON:\n{"organicPost":"...","adHeadline":"...","adPrimaryText":"...","adDescription":"...","adCta":"...","tips":"..."}`,
    pinterest: `${base}\n\nErstelle Pinterest Content als JSON:\n{"pinTitle":"...","pinDescription":"...","boardName":"...","altText":"...","tips":"..."}`,
    tiktok: `${base}\n\nErstelle TikTok Content als JSON:\n{"hook":"...","script":"...","sounds":"...","hashtags":"...","tips":"..."}`,
    youtube: `${base}\n\nErstelle YouTube Content als JSON:\n{"title":"...","description":"...","tags":["..."],"thumbnailIdea":"...","chapters":"...","tips":"..."}`,
    houzz: `${base}\n\nErstelle Houzz Content als JSON:\n{"projectTitle":"...","projectDescription":"...","ideabook":"...","tags":["..."],"tips":"..."}`,
    email: `${base}\n\nErstelle Newsletter Content als JSON:\n{"subject":"...","previewText":"...","body":"...","cta":"...","tips":"..."}`,
    googleads: `${base}\n\nErstelle Google Ads Content als JSON:\n{"headlines":["..."],"descriptions":["..."],"sitelinks":["..."],"callouts":["..."],"tips":"..."}`,
    metaads: `${base}\n\nErstelle Meta Ads 3-Stufen-Funnel als JSON:\n{"awareness":{"copy":"...","format":"...","targeting":"...","budget":"..."},"retargeting":{"copy":"...","format":"...","targeting":"...","budget":"..."},"leadgen":{"copy":"...","format":"...","targeting":"...","budget":"...","formFields":["..."]},"tips":"..."}`,
  };
  return channelInstructions[channel] || base;
}

// =====================================================================
// UI COMPONENTS
// =====================================================================

const colors = {
  bg: "#0a0a1a",
  surface: "#111128",
  surfaceHover: "#1a1a3e",
  border: "rgba(255,255,255,0.06)",
  borderActive: "rgba(245,158,11,0.4)",
  amber: "#f59e0b",
  amberDark: "#d97706",
  green: "#22c55e",
  red: "#ef4444",
  blue: "#3b82f6",
  text: "#e2e8f0",
  textMuted: "#64748b",
  textDim: "#475569",
};

function PotentialBadge({ potential }) {
  const map = {
    "Maximal": { bg: "#22c55e20", color: "#22c55e", label: "★★★★★" },
    "Sehr hoch": { bg: "#3b82f620", color: "#3b82f6", label: "★★★★" },
    "Hoch": { bg: "#f59e0b20", color: "#f59e0b", label: "★★★" },
    "Mittel": { bg: "#94a3b820", color: "#94a3b8", label: "★★" },
    "Basis": { bg: "#6366f120", color: "#6366f1", label: "★" },
  };
  const m = map[potential] || map["Mittel"];
  return (
    <span style={{ background: m.bg, color: m.color, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
      {m.label} {potential}
    </span>
  );
}

// =====================================================================
// MAIN APP
// =====================================================================

export default function AgencySimulator() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [activeBrand, setActiveBrand] = useState("schreinerhelden");
  const [selectedRegions, setSelectedRegions] = useState(["murrhardt", "backnang", "waiblingen", "stuttgart"]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedChannels, setSelectedChannels] = useState(["website", "gbp", "instagram", "facebook", "pinterest", "googleads"]);
  const [apiKey, setApiKey] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState({});
  const [channelContent, setChannelContent] = useState({});
  const [activeContentTab, setActiveContentTab] = useState("lp-preview");
  const [generatingChannel, setGeneratingChannel] = useState(null);
  const [contentLog, setContentLog] = useState([]);
  const [showApiModal, setShowApiModal] = useState(false);
  const [dfsLogin, setDfsLogin] = useState("");
  const [dfsPw, setDfsPw] = useState("");
  const [keywordResults, setKeywordResults] = useState([]);
  const [serpResults, setSerpResults] = useState([]);
  const [competitorResults, setCompetitorResults] = useState([]);
  const [kwLoading, setKwLoading] = useState(false);
  const [serpLoading, setSerpLoading] = useState(false);
  const [compLoading, setCompLoading] = useState(false);
  const [kwInput, setKwInput] = useState("");
  const [compDomain, setCompDomain] = useState("");
  const [exportReady, setExportReady] = useState(false);

  const brand = BRANDS[activeBrand];
  const sortedRegions = [...REGIONS].sort((a, b) => {
    const score = (r) => (r.einwohner / 1000) * (r.kaufkraft / 100) * (1 / (1 + r.entfernung / 50));
    return score(b) - score(a);
  });

  const toggleRegion = (id) => setSelectedRegions(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleChannel = (id) => setSelectedChannels(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  // --- Generate Content with OpenAI ---
  const generateLPContent = async (service, region) => {
    if (!apiKey) { setShowApiModal(true); return; }
    setGenerating(true);
    const reg = REGIONS.find(r => r.id === region);
    const prompt = `Erstelle eine komplette Landing Page für "${service.name}" in "${reg.name}" (${reg.kreis}).

MARKE: ${brand.name} — ${brand.tagline}
DOMAIN: ${brand.domain}
USP: ${brand.usp}
TELEFON: ${brand.phone}

ZIELGRUPPE: Hausbesitzer in ${reg.name} und Umgebung. Kaufkraft-Index: ${reg.kaufkraft}. ${reg.einwohner} Einwohner.

Erstelle folgende Elemente im JSON-Format:
{
  "meta": { "title": "...", "description": "...", "h1": "..." },
  "hero": { "headline": "...", "subline": "...", "cta": "..." },
  "painAgitate": { "headline": "...", "body": "..." },
  "solution": { "headline": "...", "steps": ["...", "..."], "cta": "..." },
  "socialProof": { "headline": "...", "testimonials": [{"name": "...", "ort": "...", "text": "..."}] },
  "faq": [{"q": "...", "a": "..."}],
  "finalCta": { "headline": "...", "body": "...", "cta": "..." },
  "answerFirst": "50-Wort AEO-Absatz der die Kernfrage direkt beantwortet"
}

Nutze psychologische Trigger. Jede Section folgt der Heatmap-Logik: Hero = maximale Aufmerksamkeit, danach abnehmend. Baue Loss Aversion in Pain-Section ein. Social Proof mit spezifischen Details. FAQ = exakte Suchanfragen als Fragen.`;

    const result = await callOpenAI(prompt, SYSTEM_PROMPTS.copywriter, apiKey);
    setGenerating(false);
    if (result.error) {
      setGeneratedContent(prev => ({ ...prev, [`${service.id}-${region}`]: { _error: result.error } }));
      return;
    }
    if (result.text) {
      try {
        const cleaned = result.text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleaned);
        setGeneratedContent(prev => ({ ...prev, [`${service.id}-${region}`]: parsed }));
      } catch {
        setGeneratedContent(prev => ({ ...prev, [`${service.id}-${region}`]: { raw: result.text } }));
      }
    }
  };

  // Generate content for a specific channel
  const generateChannelContent = async (channelId, service, region) => {
    if (!apiKey) { setShowApiModal(true); return; }
    setGeneratingChannel(channelId);
    const sysPrompt = SYSTEM_PROMPTS[channelId] || SYSTEM_PROMPTS.social;
    const prompt = buildChannelPrompt(channelId, service, REGIONS.find(r => r.id === region) ? region : selectedRegions[0], brand);
    const result = await callOpenAI(prompt, sysPrompt, apiKey);
    setGeneratingChannel(null);
    if (result.text) {
      try {
        const cleaned = result.text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleaned);
        setChannelContent(prev => ({ ...prev, [channelId]: parsed }));
        setContentLog(prev => [{ channel: channelId, time: new Date().toLocaleTimeString("de-DE"), status: "success" }, ...prev]);
      } catch {
        setChannelContent(prev => ({ ...prev, [channelId]: { raw: result.text } }));
        setContentLog(prev => [{ channel: channelId, time: new Date().toLocaleTimeString("de-DE"), status: "parse-error" }, ...prev]);
      }
    } else {
      setContentLog(prev => [{ channel: channelId, time: new Date().toLocaleTimeString("de-DE"), status: "error", error: result.error }, ...prev]);
    }
  };

  // Multiply content across all selected channels sequentially
  const multiplyContent = async () => {
    if (!selectedService || selectedRegions.length === 0) return;
    const region = selectedRegions[0];
    // First generate LP
    await generateLPContent(selectedService, region);
    // Then each channel
    for (const chId of selectedChannels.filter(c => c !== "website")) {
      await generateChannelContent(chId, selectedService, region);
    }
  };

  // --- DataForSEO API — COMPREHENSIVE ENGINE ---
  const callDataForSEO = async (endpoint, body) => {
    if (!dfsLogin || !dfsPw) return { error: "DataForSEO Credentials fehlen. Bitte unter Settings eintragen." };
    try {
      const res = await fetch(`https://api.dataforseo.com/v3/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Basic " + btoa(`${dfsLogin}:${dfsPw}`) },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.status_code === 20000) return data;
      return { error: data.status_message || `Status ${data.status_code}`, raw: data };
    } catch (e) {
      return { error: e.message };
    }
  };

  // ═══════════════════════════════════════════════════════
  // MODULE 1: SERP TRACKING (Priority #1)
  // Google Organic + Maps + Local Finder + AI Mode
  // ═══════════════════════════════════════════════════════
  const trackSERP = async (keyword, locationName) => {
    setSerpLoading(true);
    const loc = REGIONS.find(r => r.name === locationName) || REGIONS[0];
    // Google Organic SERP — Live Advanced (includes all SERP features)
    const organicResult = await callDataForSEO("serp/google/organic/live/advanced", [{
      keyword, language_code: "de", location_name: `${loc.name},Baden-Württemberg,Germany`,
      device: "desktop", depth: 20, // Top 20
    }]);
    // Google Maps for local pack
    const mapsResult = await callDataForSEO("serp/google/maps/live/advanced", [{
      keyword, language_code: "de", location_name: `${loc.name},Baden-Württemberg,Germany`, depth: 10,
    }]);
    const organic = organicResult.tasks?.[0]?.result?.[0];
    const maps = mapsResult.tasks?.[0]?.result?.[0];
    const serpData = {
      keyword, location: loc.name, timestamp: new Date().toISOString(),
      organicItems: (organic?.items || []).filter(i => ["organic", "featured_snippet", "people_also_ask", "local_pack", "ai_overview"].includes(i.type)).map((item, i) => ({
        position: item.rank_absolute || item.rank_group || i + 1,
        type: item.type, title: item.title, domain: item.domain, url: item.url,
        description: item.description?.substring(0, 150),
        isOurs: item.domain === brand.domain || item.url?.includes(brand.domain),
      })),
      serpFeatures: (organic?.item_types || []),
      totalResults: organic?.se_results_count,
      mapsResults: (maps?.items || []).slice(0, 5).map(item => ({
        title: item.title, rating: item.rating?.value, reviews: item.rating?.votes_count,
        address: item.address, domain: item.domain, phone: item.phone,
        isOurs: item.domain === brand.domain || item.title?.toLowerCase().includes("schreinerhelden"),
      })),
      ourPosition: null, // calculated below
    };
    // Find our position
    const ourOrganic = serpData.organicItems.find(i => i.isOurs);
    const ourMaps = serpData.mapsResults.find(i => i.isOurs);
    serpData.ourPosition = { organic: ourOrganic?.position || "Nicht in Top 20", maps: ourMaps ? serpData.mapsResults.indexOf(ourMaps) + 1 : "Nicht im Map Pack" };
    setSerpResults(prev => [serpData, ...prev.filter(s => !(s.keyword === keyword && s.location === loc.name))]);
    setSerpLoading(false);
    return serpData;
  };

  // Bulk SERP check: all services × selected region
  const bulkSERPCheck = async (regionId) => {
    const reg = REGIONS.find(r => r.id === regionId) || REGIONS[0];
    setSerpLoading(true);
    for (const svc of brand.services) {
      for (const kw of svc.keywords.slice(0, 2)) {
        await trackSERP(`${kw} ${reg.name}`, reg.name);
      }
    }
    setSerpLoading(false);
  };

  // ═══════════════════════════════════════════════════════
  // MODULE 2: KEYWORD INTELLIGENCE (Priority #2)
  // Search Volume + Suggestions + Related + Trends
  // ═══════════════════════════════════════════════════════
  const searchKeywords = async (keywords) => {
    setKwLoading(true);
    const kws = keywords.split(",").map(k => k.trim()).filter(Boolean);
    if (dfsLogin && dfsPw) {
      // Search Volume from Google Ads
      const volResult = await callDataForSEO("keywords_data/google_ads/search_volume/live", [{
        keywords: kws, language_code: "de", location_code: 2276,
      }]);
      if (volResult.tasks?.[0]?.result) {
        const results = volResult.tasks[0].result.map(r => ({
          keyword: r.keyword, volume: r.search_volume, cpc: r.cpc,
          competition: r.competition, competitionLevel: r.competition_level,
          trend: r.monthly_searches || [],
          lowBid: r.low_top_of_page_bid, highBid: r.high_top_of_page_bid,
          source: "dataforseo",
        }));
        setKeywordResults(results);
        setKwLoading(false);
        return results;
      }
    }
    // GPT Fallback
    if (apiKey) {
      const prompt = `Analysiere diese Keywords für eine Schreinerei in Murrhardt (Rems-Murr-Kreis): ${kws.join(", ")}\n\nJSON-Liste:\n[{"keyword":"...","volume":1000,"cpc":2.5,"competition":"medium","competitionLevel":"MEDIUM","intent":"transactional|informational|navigational","difficulty":"easy|medium|hard","recommendation":"..."}]\n\nRealistisch für deutschen Markt. Intent-Mapping wichtig.`;
      const result = await callOpenAI(prompt, SYSTEM_PROMPTS.strategist, apiKey);
      if (result.text) {
        try { setKeywordResults(JSON.parse(result.text.replace(/```json\n?|```\n?/g, "").trim()).map(r => ({ ...r, source: "gpt-estimate" }))); }
        catch { setKeywordResults([{ keyword: "Parse-Error", volume: 0, raw: result.text, source: "error" }]); }
      }
    }
    setKwLoading(false);
  };

  // Keyword Suggestions from DataForSEO
  const getKeywordSuggestions = async (seedKeyword) => {
    if (!dfsLogin || !dfsPw) return [];
    const result = await callDataForSEO("keywords_data/google_ads/keywords_for_keywords/live", [{
      keywords: [seedKeyword], language_code: "de", location_code: 2276, sort_by: "search_volume", limit: 30,
    }]);
    return (result.tasks?.[0]?.result || []).map(r => ({
      keyword: r.keyword, volume: r.search_volume, cpc: r.cpc, competition: r.competition_level,
    }));
  };

  // Google Autocomplete suggestions
  const getAutocomplete = async (keyword) => {
    if (!dfsLogin || !dfsPw) return [];
    const result = await callDataForSEO("serp/google/autocomplete/live/advanced", [{
      keyword, language_code: "de", location_code: 2276,
    }]);
    return (result.tasks?.[0]?.result?.[0]?.items || []).map(i => i.suggestion_text || i.title).filter(Boolean);
  };

  // ═══════════════════════════════════════════════════════
  // MODULE 3: BACKLINK ANALYSIS (Priority #3)
  // Our profile + Competitor comparison + Link Gaps
  // ═══════════════════════════════════════════════════════
  const [backlinkData, setBacklinkData] = useState({});
  const [backlinkLoading, setBacklinkLoading] = useState(false);

  const analyzeBacklinks = async (targetDomain) => {
    setBacklinkLoading(true);
    if (dfsLogin && dfsPw) {
      // Summary
      const summary = await callDataForSEO("backlinks/summary/live", [{ target: targetDomain, internal_list_limit: 0, backlinks_filters: ["dofollow", "=", true] }]);
      // Top referring domains
      const referring = await callDataForSEO("backlinks/referring_domains/live", [{ target: targetDomain, limit: 20, order_by: ["rank,desc"], backlinks_filters: ["dofollow", "=", true] }]);
      // Top anchors
      const anchors = await callDataForSEO("backlinks/anchors/live", [{ target: targetDomain, limit: 15, order_by: ["backlinks,desc"] }]);

      const data = {
        domain: targetDomain, timestamp: new Date().toISOString(),
        summary: summary.tasks?.[0]?.result?.[0] ? {
          totalBacklinks: summary.tasks[0].result[0].backlinks,
          referringDomains: summary.tasks[0].result[0].referring_domains,
          referringIPs: summary.tasks[0].result[0].referring_ips,
          rank: summary.tasks[0].result[0].rank,
          domainRank: summary.tasks[0].result[0].broken_backlinks !== undefined ? "Analysiert" : null,
        } : null,
        topReferring: (referring.tasks?.[0]?.result || []).map(r => ({
          domain: r.domain, backlinks: r.backlinks, rank: r.rank, firstSeen: r.first_seen,
        })),
        topAnchors: (anchors.tasks?.[0]?.result || []).map(a => ({
          anchor: a.anchor, backlinks: a.backlinks, domains: a.referring_domains,
        })),
        source: "dataforseo",
      };
      setBacklinkData(prev => ({ ...prev, [targetDomain]: data }));
    }
    setBacklinkLoading(false);
  };

  // Link Gap: domains linking to competitor but NOT to us
  const findLinkGap = async (competitorDomain) => {
    if (!dfsLogin || !dfsPw) return [];
    const result = await callDataForSEO("backlinks/domain_intersection/live", [{
      targets: { 1: competitorDomain, 2: brand.domain },
      exclude_targets: [brand.domain],
      limit: 20, order_by: ["1.rank,desc"],
    }]);
    return (result.tasks?.[0]?.result || []).map(r => ({
      domain: r["1"]?.domain, rank: r["1"]?.rank, backlinks: r["1"]?.backlinks,
      opportunity: "Links zu Wettbewerber, aber nicht zu uns",
    }));
  };

  // ═══════════════════════════════════════════════════════
  // MODULE 4: ON-PAGE AUDIT (Priority #4)
  // ═══════════════════════════════════════════════════════
  const [onpageData, setOnpageData] = useState(null);
  const [onpageLoading, setOnpageLoading] = useState(false);

  const runOnPageAudit = async (targetDomain) => {
    setOnpageLoading(true);
    if (dfsLogin && dfsPw) {
      // Start on-page task
      const taskResult = await callDataForSEO("on_page/task_post", [{
        target: `https://${targetDomain}`, max_crawl_pages: 50, load_resources: true, enable_javascript: true,
        check_spell: true, custom_user_agent: "Mozilla/5.0 (compatible; SchreinheldenBot/1.0)",
      }]);
      const taskId = taskResult.tasks?.[0]?.id;
      if (taskId) {
        // Wait and poll for summary (simplified: single attempt after delay)
        await new Promise(r => setTimeout(r, 15000));
        const summaryResult = await callDataForSEO("on_page/summary/" + taskId, null);
        if (summaryResult.tasks?.[0]?.result?.[0]) {
          const s = summaryResult.tasks[0].result[0];
          setOnpageData({
            domain: targetDomain, taskId, timestamp: new Date().toISOString(),
            crawlStatus: s.crawl_status,
            pagesCount: s.pages_count,
            pagesWith: {
              duplicate_title: s.pages_with_duplicate_title,
              duplicate_description: s.pages_with_duplicate_description,
              duplicate_content: s.pages_with_duplicate_content,
              broken_links: s.pages_with_broken_links,
              redirects: s.pages_with_redirect,
              errors4xx: s.pages_with_4xx_code,
              errors5xx: s.pages_with_5xx_code,
              no_title: s.pages_without_title,
              no_description: s.pages_without_description,
              no_h1: s.pages_without_h1,
              slow: s.pages_with_large_page_size,
            },
            checks: s.checks || {},
            source: "dataforseo",
          });
        }
      }
    }
    setOnpageLoading(false);
  };

  // ═══════════════════════════════════════════════════════
  // MODULE 5: AI OPTIMIZATION (Priority #5)
  // LLM Mentions + AI Overviews tracking
  // ═══════════════════════════════════════════════════════
  const [aiOptData, setAiOptData] = useState([]);
  const [aiOptLoading, setAiOptLoading] = useState(false);

  const checkAIVisibility = async (keyword) => {
    setAiOptLoading(true);
    // Check Google AI Mode
    if (dfsLogin && dfsPw) {
      const aiModeResult = await callDataForSEO("serp/google/ai_mode/live/advanced", [{
        keyword, language_code: "de", location_name: "Germany",
      }]);
      const aiItems = aiModeResult.tasks?.[0]?.result?.[0]?.items || [];
      const mentionsUs = aiItems.some(item => {
        const text = JSON.stringify(item).toLowerCase();
        return text.includes("schreinerhelden") || text.includes("mario esch") || text.includes(brand.domain);
      });
      setAiOptData(prev => [...prev, {
        keyword, timestamp: new Date().toISOString(), source: "google-ai-mode",
        mentioned: mentionsUs, itemCount: aiItems.length,
        snippet: aiItems[0]?.description?.substring(0, 200) || aiItems[0]?.text?.substring(0, 200) || "—",
        references: aiItems.filter(i => i.url).map(i => ({ domain: i.domain, url: i.url, title: i.title })).slice(0, 5),
      }]);
    }
    setAiOptLoading(false);
  };

  const analyzeSERP = async (keyword) => {
    return trackSERP(keyword, REGIONS.find(r => r.id === selectedRegions[0])?.name || "Murrhardt");
  };

  const analyzeCompetitor = async (domain) => {
    setCompLoading(true);
    // DataForSEO backlinks for hard data
    if (dfsLogin && dfsPw) {
      await analyzeBacklinks(domain);
    }
    // GPT for strategic analysis
    if (apiKey) {
      const blData = backlinkData[domain];
      const svc = selectedService || brand.services[0];
      const prompt = `Analysiere den Wettbewerber "${domain}" im Vergleich zu ${brand.domain} für "${svc.name}" im Rems-Murr-Kreis.${blData?.summary ? `\n\nBACKLINK-DATEN (von DataForSEO):\n- Backlinks: ${blData.summary.totalBacklinks}\n- Referring Domains: ${blData.summary.referringDomains}\n- Top Anchors: ${blData.topAnchors?.slice(0,5).map(a=>a.anchor).join(", ")}` : ""}\n\nJSON:\n{"domain":"${domain}","strengths":["..."],"weaknesses":["..."],"topKeywords":["..."],"contentGaps":["..."],"ourAdvantages":["..."],"backlinks":"...","localPresence":"...","recommendations":["..."]}`;
      const result = await callOpenAI(prompt, SYSTEM_PROMPTS.strategist, apiKey);
      if (result.text) {
        try { setCompetitorResults(prev => [...prev, JSON.parse(result.text.replace(/```json\n?|```\n?/g, "").trim())]); }
        catch { setCompetitorResults(prev => [...prev, { domain, raw: result.text }]); }
      }
    }
    setCompLoading(false);
  };

  // --- EXPORT ALL ---
  const exportAll = (format) => {
    const data = {
      meta: { brand: brand.domain, generatedAt: new Date().toISOString(), service: selectedService?.name, regions: selectedRegions.map(r => REGIONS.find(x => x.id === r)?.name) },
      landingPages: generatedContent,
      channelContent,
      keywords: keywordResults,
      serpAnalysis: serpResults,
      competitors: competitorResults,
      backlinks: backlinkData,
      onPageAudit: onpageData,
      aiOptimization: aiOptData,
    };
    if (format === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `schreinerhelden-export-${Date.now()}.json`; a.click(); URL.revokeObjectURL(url);
    } else {
      let md = `# ${brand.name} — SEO Command Center Export\n\n`;
      md += `**Domain:** ${brand.domain}\n**Datum:** ${new Date().toLocaleString("de-DE")}\n**Service:** ${selectedService?.name || "Alle"}\n**Regionen:** ${selectedRegions.map(r => REGIONS.find(x => x.id === r)?.name).join(", ")}\n\n---\n\n`;
      // LPs
      Object.entries(generatedContent).forEach(([key, lp]) => {
        md += `## Landing Page: ${key}\n\n`;
        if (lp.meta) { md += `**Title:** ${lp.meta.title}\n**H1:** ${lp.meta.h1}\n**Description:** ${lp.meta.description}\n\n`; }
        if (lp.hero) { md += `### Hero\n**Headline:** ${lp.hero.headline}\n**Subline:** ${lp.hero.subline}\n**CTA:** ${lp.hero.cta}\n\n`; }
        if (lp.answerFirst) { md += `### AEO Answer-First\n${lp.answerFirst}\n\n`; }
        if (lp.painAgitate) { md += `### Pain & Agitate\n${lp.painAgitate.headline}\n${lp.painAgitate.body}\n\n`; }
        if (lp.solution) { md += `### Lösung\n${lp.solution.headline}\n${(lp.solution.steps || []).map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n`; }
        if (lp.faq) { md += `### FAQ\n${lp.faq.map(f => `**F:** ${f.q}\n**A:** ${f.a}`).join("\n\n")}\n\n`; }
        if (lp.finalCta) { md += `### Final CTA\n${lp.finalCta.headline}\n${lp.finalCta.body}\n\n`; }
        md += "---\n\n";
      });
      // Channels
      Object.entries(channelContent).forEach(([chId, data]) => {
        const ch = CHANNELS.find(c => c.id === chId);
        md += `## ${ch?.icon} ${ch?.label}\n\n`;
        Object.entries(data).forEach(([k, v]) => {
          md += `### ${k}\n${typeof v === "object" ? JSON.stringify(v, null, 2) : v}\n\n`;
        });
        md += "---\n\n";
      });
      // Keywords
      if (keywordResults.length > 0) {
        md += `## Keywords\n\n| Keyword | Volume | CPC | Intent | Difficulty |\n|---|---|---|---|---|\n`;
        keywordResults.forEach(k => { md += `| ${k.keyword} | ${k.volume} | ${k.cpc || "-"} | ${k.intent || "-"} | ${k.difficulty || "-"} |\n`; });
        md += "\n---\n\n";
      }
      const blob = new Blob([md], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `schreinerhelden-export-${Date.now()}.md`; a.click(); URL.revokeObjectURL(url);
    }
  };

  // =====================================================================
  // RENDER
  // =====================================================================
  return (
    <div style={{ display: "flex", height: "100vh", background: colors.bg, color: colors.text, fontFamily: "'Outfit', sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .fade-in { animation: fadeIn 0.35s ease-out; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        .pulse { animation: pulse 1.5s infinite; }
      `}</style>

      {/* SIDEBAR */}
      <nav style={{
        width: 220, background: colors.surface, borderRight: `1px solid ${colors.border}`,
        display: "flex", flexDirection: "column", flexShrink: 0,
      }}>
        {/* Brand Switcher */}
        <div style={{ padding: 16, borderBottom: `1px solid ${colors.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${brand.color}, ${brand.color}88)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 900, color: "#fff",
            }}>
              {brand.name[0]}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>SEO Command</div>
              <div style={{ fontSize: 10, color: colors.textMuted }}>Agency Simulator</div>
            </div>
          </div>
          {Object.values(BRANDS).map(b => (
            <button
              key={b.id}
              onClick={() => { setActiveBrand(b.id); setSelectedService(null); }}
              style={{
                display: "block", width: "100%", textAlign: "left",
                background: activeBrand === b.id ? `${b.color}20` : "transparent",
                border: activeBrand === b.id ? `1px solid ${b.color}40` : `1px solid transparent`,
                borderRadius: 8, padding: "8px 10px", marginBottom: 4,
                color: activeBrand === b.id ? b.color : colors.textMuted,
                cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.2s",
              }}
            >
              {b.domain}
            </button>
          ))}
        </div>

        {/* Nav Items */}
        <div style={{ padding: "8px 8px", flex: 1, overflowY: "auto" }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                background: activeNav === item.id ? `${colors.amber}15` : "transparent",
                border: activeNav === item.id ? `1px solid ${colors.borderActive}` : "1px solid transparent",
                borderRadius: 10, padding: "10px 12px", marginBottom: 2,
                color: activeNav === item.id ? colors.amber : colors.textMuted,
                cursor: "pointer", fontSize: 13, fontWeight: activeNav === item.id ? 700 : 500,
                textAlign: "left", transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* API Key */}
        <div style={{ padding: 12, borderTop: `1px solid ${colors.border}` }}>
          <button
            onClick={() => setShowApiModal(true)}
            style={{
              width: "100%", background: apiKey ? `${colors.green}15` : `${colors.red}15`,
              border: `1px solid ${apiKey ? colors.green : colors.red}30`,
              borderRadius: 8, padding: "8px", color: apiKey ? colors.green : colors.red,
              fontSize: 11, fontWeight: 600, cursor: "pointer", marginBottom: 6,
            }}
          >
            {apiKey ? "✓ OpenAI verbunden" : "⚠ API Key setzen"}
          </button>
          <div style={{ fontSize: 9, color: colors.textDim, textAlign: "center" }}>
            v4.0 · {brand.services.length} Services · {REGIONS.length} Regionen
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, overflowY: "auto", padding: 0 }}>

        {/* --- DASHBOARD (ENHANCED) --- */}
        {activeNav === "dashboard" && (
          <div className="fade-in" style={{ padding: 28 }}>
            {/* Onboarding Banner */}
            {!apiKey && (
              <div style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(217,119,6,0.05))", border: `1px solid ${colors.borderActive}`, borderRadius: 14, padding: 20, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 4 }}>👋 Willkommen im Agency Simulator</h3>
                  <p style={{ fontSize: 12, color: colors.textMuted }}>
                    Verbinde deinen OpenAI API Key um loszulegen. Das Tool generiert mit GPT-4o komplette Landing Pages, Content für 11 Kanäle, Keyword-Analysen und Wettbewerber-Reports.
                  </p>
                </div>
                <button onClick={() => setShowApiModal(true)} style={{ background: `linear-gradient(135deg, ${colors.amber}, ${colors.amberDark})`, border: "none", borderRadius: 10, padding: "12px 24px", color: "#000", fontWeight: 800, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
                  🔑 API Key verbinden
                </button>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{brand.name} — Command Center</h1>
                <p style={{ color: colors.textMuted, fontSize: 14 }}>{brand.domain} · {brand.tagline}</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => exportAll("json")} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "8px 14px", color: colors.amber, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>💾 Export</button>
                <button onClick={() => setActiveNav("bulk-matrix")} style={{ background: `linear-gradient(135deg, ${colors.amber}, ${colors.amberDark})`, border: "none", borderRadius: 8, padding: "8px 14px", color: "#000", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>⚡ Bulk Matrix</button>
              </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 24 }}>
              {[
                { label: "Services", value: brand.services.length, icon: "🪵", color: colors.amber },
                { label: "Regionen", value: `${selectedRegions.length}/${REGIONS.length}`, icon: "📍", color: colors.blue },
                { label: "Kanäle", value: `${selectedChannels.length}/${CHANNELS.length}`, icon: "📡", color: "#8b5cf6" },
                { label: "LPs generiert", value: Object.keys(generatedContent).length, icon: "🌐", color: colors.green },
                { label: "Channel Content", value: Object.keys(channelContent).length, icon: "✍️", color: "#ec4899" },
                { label: "LP Potential", value: brand.services.length * selectedRegions.length, icon: "🚀", color: "#f97316" },
              ].map((kpi, i) => (
                <div key={i} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{kpi.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: kpi.color }}>{kpi.value}</div>
                  <div style={{ fontSize: 10, color: colors.textMuted, fontWeight: 600 }}>{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Coverage Matrix Preview */}
            <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 20, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: colors.amber, textTransform: "uppercase", letterSpacing: 1 }}>Coverage Matrix — Service × Region</h2>
                <button onClick={() => setActiveNav("bulk-matrix")} style={{ background: "transparent", border: `1px solid ${colors.border}`, color: colors.textMuted, borderRadius: 6, padding: "4px 10px", fontSize: 10, cursor: "pointer" }}>Vollansicht →</button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "6px 8px", textAlign: "left", color: colors.textDim, borderBottom: `1px solid ${colors.border}`, position: "sticky", left: 0, background: colors.surface }}></th>
                      {selectedRegions.slice(0, 8).map(rId => {
                        const r = REGIONS.find(x => x.id === rId);
                        return <th key={rId} style={{ padding: "6px 8px", textAlign: "center", color: colors.textMuted, borderBottom: `1px solid ${colors.border}`, whiteSpace: "nowrap", fontWeight: 600 }}>{r?.name}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {brand.services.map(svc => (
                      <tr key={svc.id}>
                        <td style={{ padding: "6px 8px", fontWeight: 600, color: "#fff", borderBottom: `1px solid ${colors.border}`, whiteSpace: "nowrap", position: "sticky", left: 0, background: colors.surface }}>{svc.name}</td>
                        {selectedRegions.slice(0, 8).map(rId => {
                          const key = `${svc.id}-${rId}`;
                          const has = !!generatedContent[key];
                          return (
                            <td key={rId} style={{ padding: "6px 8px", textAlign: "center", borderBottom: `1px solid ${colors.border}` }}>
                              <button
                                onClick={() => { setSelectedService(svc); setSelectedRegions(prev => prev.includes(rId) ? prev : [rId, ...prev]); setActiveNav("content-hub"); }}
                                style={{ width: 24, height: 24, borderRadius: 6, border: "none", cursor: "pointer", background: has ? colors.green : "rgba(255,255,255,0.04)", color: has ? "#fff" : colors.textDim, fontSize: 10, fontWeight: 700 }}
                              >
                                {has ? "✓" : "·"}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions + Agency Team (compact) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              {/* Quick Actions */}
              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 20 }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: colors.amber, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>Quick Actions</h2>
                <div style={{ display: "grid", gap: 8 }}>
                  {[
                    { label: "LP Builder öffnen", icon: "🏗️", nav: "lp-builder", color: colors.amber },
                    { label: "Content multiplizieren", icon: "✍️", nav: "content-hub", color: "#8b5cf6" },
                    { label: "Keywords recherchieren", icon: "🔍", nav: "keywords", color: colors.blue },
                    { label: "Wettbewerber analysieren", icon: "⚔️", nav: "competitors", color: colors.red },
                    { label: "Content-Kalender", icon: "📅", nav: "calendar", color: colors.green },
                    { label: "Schema.org generieren", icon: "🏷️", nav: "schema", color: "#f97316" },
                  ].map((action, i) => (
                    <button key={i} onClick={() => setActiveNav(action.nav)} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.02)", border: `1px solid ${colors.border}`, borderRadius: 8, padding: "10px 14px", cursor: "pointer", textAlign: "left", width: "100%", color: colors.text, fontSize: 13, fontWeight: 500, transition: "all 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = action.color}
                      onMouseLeave={e => e.currentTarget.style.borderColor = colors.border}
                    >
                      <span style={{ fontSize: 18 }}>{action.icon}</span>
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Agency Team compact */}
              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: colors.amber, textTransform: "uppercase", letterSpacing: 1 }}>Agency Team</h2>
                  <span style={{ fontSize: 10, background: `${colors.green}20`, color: colors.green, padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>{AGENCY_TEAM.length} aktiv</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {AGENCY_TEAM.map(m => (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0", fontSize: 11, color: colors.textMuted }}>
                      <span>{m.icon}</span> {m.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Services */}
            <h2 style={{ fontSize: 14, fontWeight: 700, color: colors.amber, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Services — {brand.domain}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
              {brand.services.map(svc => (
                <button key={svc.id} onClick={() => { setSelectedService(svc); setActiveNav("lp-builder"); }}
                  style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 14, textAlign: "left", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = brand.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = colors.border}
                >
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 4 }}>{svc.name}</div>
                  <div style={{ fontSize: 10, color: colors.textMuted }}>{svc.keywords.slice(0, 2).join(" · ")}</div>
                  <div style={{ fontSize: 10, color: brand.color, marginTop: 6, fontWeight: 600 }}>→ LP Builder</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- LP BUILDER --- */}
        {activeNav === "lp-builder" && (
          <div className="fade-in" style={{ padding: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 4 }}>
              🏗️ Landing Page Builder
            </h1>
            <p style={{ color: colors.textMuted, fontSize: 13, marginBottom: 24 }}>
              Service + Region auswählen → Psychologisch optimierte LP generieren → Content multiplizieren
            </p>

            {/* Service Selector */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: colors.amber, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                ① Service wählen
              </h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {brand.services.map(svc => (
                  <button
                    key={svc.id}
                    onClick={() => setSelectedService(svc)}
                    style={{
                      background: selectedService?.id === svc.id ? `${brand.color}20` : colors.surface,
                      border: `2px solid ${selectedService?.id === svc.id ? brand.color : colors.border}`,
                      borderRadius: 10, padding: "10px 16px",
                      color: selectedService?.id === svc.id ? brand.color : colors.textMuted,
                      cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.2s",
                    }}
                  >
                    {svc.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Region Selector with Potential */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: colors.amber, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                ② Regionen wählen (sortiert nach Erfolgspotential)
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
                {sortedRegions.map(reg => {
                  const active = selectedRegions.includes(reg.id);
                  const score = Math.round((reg.einwohner / 1000) * (reg.kaufkraft / 100) * (1 / (1 + reg.entfernung / 50)));
                  return (
                    <button
                      key={reg.id}
                      onClick={() => toggleRegion(reg.id)}
                      style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        background: active ? `${colors.amber}10` : colors.surface,
                        border: `1px solid ${active ? colors.borderActive : colors.border}`,
                        borderRadius: 10, padding: "10px 14px",
                        cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: active ? "#fff" : colors.textMuted }}>
                          {active ? "✓ " : ""}{reg.name}
                        </div>
                        <div style={{ fontSize: 11, color: colors.textDim }}>
                          {reg.kreis} · {reg.einwohner.toLocaleString("de-DE")} EW · KKI {reg.kaufkraft} · {reg.entfernung}km
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <PotentialBadge potential={reg.potential} />
                        <div style={{ fontSize: 10, color: colors.textDim, marginTop: 2 }}>Score: {score}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Channel Selector */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: colors.amber, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                ③ Kanäle für Content-Multiplikation
              </h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {CHANNELS.map(ch => {
                  const active = selectedChannels.includes(ch.id);
                  return (
                    <button
                      key={ch.id}
                      onClick={() => toggleChannel(ch.id)}
                      style={{
                        background: active ? `${ch.color}20` : colors.surface,
                        border: `2px solid ${active ? ch.color : colors.border}`,
                        borderRadius: 10, padding: "8px 14px",
                        cursor: "pointer", fontSize: 12, fontWeight: 600,
                        color: active ? ch.color : colors.textMuted, transition: "all 0.2s",
                      }}
                    >
                      {ch.icon} {ch.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LP Architecture Preview */}
            {selectedService && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, color: colors.amber, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                  ④ Conversion-Architektur (Heatmap-informiert)
                </h3>
                <div style={{ display: "grid", gap: 8 }}>
                  {LP_ARCHITECTURE.sections.map((sec, i) => (
                    <div
                      key={sec.id}
                      style={{
                        background: colors.surface, border: `1px solid ${colors.border}`,
                        borderRadius: 12, padding: 16,
                        borderLeft: `4px solid ${sec.heatmapZone === "HOT" ? "#ef4444" : sec.heatmapZone.includes("WARM") ? "#f59e0b" : "#3b82f6"}`,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>
                          {i + 1}. {sec.name}
                        </div>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                          background: sec.heatmapZone === "HOT" ? "#ef444420" : sec.heatmapZone.includes("WARM") ? "#f59e0b20" : "#3b82f620",
                          color: sec.heatmapZone === "HOT" ? "#ef4444" : sec.heatmapZone.includes("WARM") ? "#f59e0b" : "#3b82f6",
                        }}>
                          🔥 {sec.heatmapZone}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8, lineHeight: 1.5 }}>
                        <strong style={{ color: colors.amber }}>Psychologie:</strong> {sec.psychology}
                      </div>
                      <div style={{ fontSize: 11, color: colors.textDim }}>
                        <strong>Elemente:</strong> {sec.elements.join(" · ")}
                      </div>
                      <div style={{ fontSize: 11, color: colors.textDim, marginTop: 4, fontStyle: "italic" }}>
                        <strong>Copy-Regel:</strong> {sec.copyRules}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generate Button */}
            {selectedService && selectedRegions.length > 0 && (
              <button
                onClick={() => {
                  const firstRegion = selectedRegions[0];
                  generateLPContent(selectedService, firstRegion);
                }}
                disabled={generating || !apiKey}
                style={{
                  width: "100%", padding: 18,
                  background: generating ? colors.surface : `linear-gradient(135deg, ${colors.amber}, ${colors.amberDark})`,
                  color: generating ? colors.textMuted : "#000",
                  border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800,
                  cursor: generating ? "wait" : "pointer", transition: "all 0.3s",
                }}
              >
                {generating ? (
                  <span className="pulse">🤖 Agency-Team arbeitet...</span>
                ) : (
                  `🚀 LP generieren: ${selectedService.name} × ${selectedRegions.length} Regionen × ${selectedChannels.length} Kanäle`
                )}
              </button>
            )}

            {/* Generated Content Preview */}
            {Object.keys(generatedContent).length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.green, marginBottom: 12 }}>
                  ✅ Generierter Content
                </h3>
                {Object.entries(generatedContent).map(([key, content]) => (
                  <div key={key} style={{
                    background: colors.surface, border: `1px solid ${colors.border}`,
                    borderRadius: 12, padding: 16, marginBottom: 12,
                  }}>
                    <div style={{ fontWeight: 700, color: "#fff", marginBottom: 8 }}>{key}</div>
                    <pre style={{
                      whiteSpace: "pre-wrap", wordBreak: "break-word",
                      fontSize: 12, color: colors.textMuted, lineHeight: 1.6,
                      maxHeight: 400, overflowY: "auto",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {typeof content === "object" ? JSON.stringify(content, null, 2) : content}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TEAM VIEW --- */}
        {activeNav === "team" && (
          <div className="fade-in" style={{ padding: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 4 }}>
              👥 Dein Agency Team — 16 Spezialisten
            </h1>
            <p style={{ color: colors.textMuted, fontSize: 13, marginBottom: 24 }}>
              Jeder Spezialist bringt seine Expertise ein — gesteuert über ChatGPT-4o
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
              {AGENCY_TEAM.map(member => (
                <div
                  key={member.id}
                  style={{
                    background: colors.surface, border: `1px solid ${colors.border}`,
                    borderRadius: 14, padding: 20,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: `${colors.amber}15`, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 24,
                    }}>
                      {member.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>{member.name}</div>
                      <span style={{
                        fontSize: 10, background: `${colors.green}20`, color: colors.green,
                        padding: "2px 8px", borderRadius: 4, fontWeight: 600,
                      }}>
                        ACTIVE
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.6 }}>
                    {member.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- KEYWORDS (FULL IMPLEMENTATION) --- */}
        {activeNav === "keywords" && (
          <div className="fade-in" style={{ padding: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 4 }}>🔍 Keyword Intelligence</h1>
            <p style={{ color: colors.textMuted, fontSize: 13, marginBottom: 20 }}>
              DataForSEO + GPT-4o · Keyword-Recherche · SERP-Analyse · Intent-Mapping
            </p>

            {/* Quick Keyword Input */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <input
                value={kwInput}
                onChange={e => setKwInput(e.target.value)}
                placeholder="Keywords komma-getrennt: Dachschrägenschrank Backnang, Einbauschrank nach Maß..."
                style={{ flex: 1, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 13, outline: "none" }}
                onKeyDown={e => e.key === "Enter" && kwInput && searchKeywords(kwInput)}
              />
              <button
                onClick={() => kwInput && searchKeywords(kwInput)}
                disabled={kwLoading || (!apiKey && !dfsLogin)}
                style={{ background: `linear-gradient(135deg, ${colors.amber}, ${colors.amberDark})`, border: "none", borderRadius: 10, padding: "12px 24px", color: "#000", fontWeight: 800, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                {kwLoading ? <span className="pulse">⏳</span> : "🔍 Analysieren"}
              </button>
            </div>

            {/* Quick-Fill Buttons from selected service */}
            {selectedService && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
                <span style={{ fontSize: 11, color: colors.textDim, paddingTop: 6 }}>Vorschläge:</span>
                {selectedService.keywords.map(kw => (
                  <button key={kw} onClick={() => setKwInput(prev => prev ? `${prev}, ${kw}` : kw)} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 6, padding: "4px 10px", color: colors.amber, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
                    + {kw}
                  </button>
                ))}
                {selectedRegions.slice(0, 3).map(rId => {
                  const r = REGIONS.find(x => x.id === rId);
                  return selectedService.keywords.slice(0, 2).map(kw => (
                    <button key={`${kw}-${rId}`} onClick={() => setKwInput(prev => prev ? `${prev}, ${kw} ${r.name}` : `${kw} ${r.name}`)} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 6, padding: "4px 10px", color: colors.blue, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
                      + {kw} {r.name}
                    </button>
                  ));
                })}
              </div>
            )}

            {/* Keyword Results */}
            {keywordResults.length > 0 && (
              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
                <div style={{ padding: "12px 16px", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>📊 Keyword-Ergebnisse ({keywordResults.length})</h3>
                  <button onClick={() => navigator.clipboard.writeText(JSON.stringify(keywordResults, null, 2))} style={{ background: "transparent", border: `1px solid ${colors.border}`, color: colors.textMuted, borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>📋 Kopieren</button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                        {["Keyword", "Volume", "CPC", "Intent", "Difficulty", "Empfehlung"].map(h => (
                          <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: colors.textDim, fontWeight: 600, borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {keywordResults.map((kw, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${colors.border}` }}>
                          <td style={{ padding: "10px 12px", fontWeight: 600, color: "#fff" }}>
                            <span style={{ cursor: "pointer" }} onClick={() => analyzeSERP(kw.keyword)}>{kw.keyword}</span>
                          </td>
                          <td style={{ padding: "10px 12px", color: colors.amber, fontWeight: 700 }}>{kw.volume?.toLocaleString("de-DE") || "-"}</td>
                          <td style={{ padding: "10px 12px", color: colors.textMuted }}>{kw.cpc ? `€${kw.cpc}` : "-"}</td>
                          <td style={{ padding: "10px 12px" }}>
                            <span style={{ background: kw.intent === "transactional" ? "#22c55e20" : kw.intent === "informational" ? "#3b82f620" : "#f59e0b20", color: kw.intent === "transactional" ? "#22c55e" : kw.intent === "informational" ? "#3b82f6" : "#f59e0b", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600 }}>
                              {kw.intent || "-"}
                            </span>
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            <span style={{ color: kw.difficulty === "easy" ? colors.green : kw.difficulty === "hard" ? colors.red : colors.amber, fontWeight: 600 }}>
                              {kw.difficulty || "-"}
                            </span>
                          </td>
                          <td style={{ padding: "10px 12px", color: colors.textMuted, maxWidth: 200 }}>{kw.recommendation || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SERP Analysis */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.amber, marginBottom: 10 }}>🔎 SERP-Analyse (DataForSEO Live)</h3>
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <input
                  placeholder="Keyword für SERP-Analyse..."
                  onKeyDown={e => e.key === "Enter" && e.target.value && analyzeSERP(e.target.value)}
                  style={{ flex: 1, minWidth: 200, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 12, outline: "none" }}
                />
                <button onClick={() => selectedRegions[0] && bulkSERPCheck(selectedRegions[0])} disabled={serpLoading || !dfsLogin}
                  style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "8px 14px", color: colors.blue, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                  {serpLoading ? <span className="pulse">⏳</span> : `⚡ Bulk-Check: Alle Services × ${REGIONS.find(r=>r.id===selectedRegions[0])?.name || "Region"}`}
                </button>
              </div>
              {serpResults.length > 0 && serpResults.map((serp, si) => (
                <div key={si} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
                  {/* SERP Header with our position */}
                  <div style={{ padding: "12px 16px", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <span style={{ fontWeight: 800, color: "#fff", fontSize: 14 }}>"{serp.keyword}"</span>
                      <span style={{ fontSize: 11, color: colors.textDim, marginLeft: 8 }}>📍 {serp.location} · {serp.totalResults?.toLocaleString("de-DE") || "?"} Ergebnisse</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ background: typeof serp.ourPosition?.organic === "number" ? `${colors.green}20` : `${colors.red}20`, color: typeof serp.ourPosition?.organic === "number" ? colors.green : colors.red, padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                        🌐 Organic: {typeof serp.ourPosition?.organic === "number" ? `#${serp.ourPosition.organic}` : serp.ourPosition?.organic || "?"}
                      </span>
                      <span style={{ background: typeof serp.ourPosition?.maps === "number" ? `${colors.green}20` : `${colors.red}20`, color: typeof serp.ourPosition?.maps === "number" ? colors.green : colors.red, padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                        📍 Maps: {typeof serp.ourPosition?.maps === "number" ? `#${serp.ourPosition.maps}` : serp.ourPosition?.maps || "?"}
                      </span>
                    </div>
                  </div>
                  {/* SERP Features Tags */}
                  {serp.serpFeatures?.length > 0 && (
                    <div style={{ padding: "8px 16px", borderBottom: `1px solid ${colors.border}`, display: "flex", gap: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 10, color: colors.textDim, paddingTop: 2 }}>SERP Features:</span>
                      {serp.serpFeatures.map((f, fi) => (
                        <span key={fi} style={{ background: f === "ai_overview" ? "#8b5cf620" : f === "local_pack" ? `${colors.green}20` : "rgba(255,255,255,0.04)", color: f === "ai_overview" ? "#8b5cf6" : f === "local_pack" ? colors.green : colors.textMuted, padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 600 }}>{f}</span>
                      ))}
                    </div>
                  )}
                  {/* Organic Results */}
                  {(serp.organicItems || []).slice(0, 10).map((item, i) => (
                    <div key={i} style={{ padding: "8px 14px", borderBottom: `1px solid ${colors.border}`, display: "flex", gap: 10, alignItems: "flex-start", background: item.isOurs ? `${colors.green}08` : "transparent" }}>
                      <div style={{ width: 26, height: 26, borderRadius: 6, background: item.isOurs ? colors.green : i < 3 ? `${colors.amber}20` : "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11, color: item.isOurs ? "#fff" : i < 3 ? colors.amber : colors.textDim, flexShrink: 0 }}>
                        {item.position}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 12, color: item.isOurs ? colors.green : "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.isOurs && "⭐ "}{item.title || item.domain}
                        </div>
                        <div style={{ fontSize: 10, color: item.isOurs ? colors.green : "#4ade80" }}>{item.domain}</div>
                      </div>
                      <span style={{ fontSize: 9, background: item.type === "ai_overview" ? "#8b5cf620" : "rgba(255,255,255,0.04)", padding: "2px 6px", borderRadius: 4, color: item.type === "ai_overview" ? "#8b5cf6" : colors.textDim, flexShrink: 0 }}>{item.type}</span>
                    </div>
                  ))}
                  {/* Maps Results */}
                  {serp.mapsResults?.length > 0 && (
                    <div style={{ padding: "10px 14px", borderTop: `2px solid ${colors.border}` }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: colors.amber, marginBottom: 6 }}>📍 Google Maps / Local Pack</div>
                      {serp.mapsResults.map((m, mi) => (
                        <div key={mi} style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 0", fontSize: 11, color: m.isOurs ? colors.green : colors.textMuted, fontWeight: m.isOurs ? 700 : 400 }}>
                          <span style={{ width: 18, textAlign: "center", fontWeight: 800 }}>{mi + 1}</span>
                          <span>{m.isOurs && "⭐ "}{m.title}</span>
                          {m.rating && <span style={{ color: colors.amber }}>★ {m.rating} ({m.reviews})</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* --- BACKLINK ANALYSIS SECTION --- */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#8b5cf6", marginBottom: 10 }}>🔗 Backlink-Analyse (DataForSEO)</h3>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <button onClick={() => analyzeBacklinks(brand.domain)} disabled={backlinkLoading || !dfsLogin}
                  style={{ background: "#8b5cf615", border: "1px solid #8b5cf630", borderRadius: 8, padding: "8px 16px", color: "#8b5cf6", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  {backlinkLoading ? <span className="pulse">⏳</span> : `🔗 ${brand.domain} analysieren`}
                </button>
                <button onClick={() => analyzeBacklinks(activeBrand === "schreinerhelden" ? "ihr-moebel-schreiner.de" : "schreinerhelden.de")} disabled={backlinkLoading || !dfsLogin}
                  style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "8px 16px", color: colors.textMuted, fontSize: 12, cursor: "pointer" }}>
                  🔗 Andere Domain
                </button>
              </div>
              {Object.entries(backlinkData).map(([domain, data]) => (
                <div key={domain} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
                  <div style={{ padding: "10px 14px", borderBottom: `1px solid ${colors.border}`, fontWeight: 700, color: "#fff", fontSize: 13 }}>🔗 {domain}</div>
                  {data.summary && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, padding: 14 }}>
                      {[{ l: "Backlinks", v: data.summary.totalBacklinks }, { l: "Referring Domains", v: data.summary.referringDomains }, { l: "Referring IPs", v: data.summary.referringIPs }, { l: "Rank", v: data.summary.rank }].map((s, si) => (
                        <div key={si} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 20, fontWeight: 900, color: "#8b5cf6" }}>{s.v?.toLocaleString("de-DE") || "—"}</div>
                          <div style={{ fontSize: 10, color: colors.textDim }}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {data.topAnchors?.length > 0 && (
                    <div style={{ padding: "0 14px 10px" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 4 }}>Top Anchors:</div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {data.topAnchors.slice(0, 8).map((a, ai) => (
                          <span key={ai} style={{ background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 4, fontSize: 10, color: colors.textMuted }}>
                            "{a.anchor}" ({a.backlinks})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {data.topReferring?.length > 0 && (
                    <div style={{ padding: "0 14px 14px" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 4 }}>Top Referring Domains:</div>
                      {data.topReferring.slice(0, 5).map((r, ri) => (
                        <div key={ri} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: colors.textMuted, padding: "2px 0", borderBottom: `1px solid ${colors.border}` }}>
                          <span>{r.domain}</span>
                          <span style={{ color: "#8b5cf6" }}>{r.backlinks} Links · Rank {r.rank}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* --- ON-PAGE AUDIT --- */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f97316", marginBottom: 10 }}>🔧 On-Page Audit (DataForSEO)</h3>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <button onClick={() => runOnPageAudit(brand.domain)} disabled={onpageLoading || !dfsLogin}
                  style={{ background: "#f9731615", border: "1px solid #f9731630", borderRadius: 8, padding: "8px 16px", color: "#f97316", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  {onpageLoading ? <span className="pulse">⏳ Crawling... (~15s)</span> : `🔧 ${brand.domain} scannen`}
                </button>
              </div>
              {onpageData && (
                <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16 }}>
                  <div style={{ fontWeight: 700, color: "#fff", marginBottom: 12 }}>🔧 {onpageData.domain} — {onpageData.pagesCount} Seiten gecrawlt</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
                    {Object.entries(onpageData.pagesWith || {}).map(([key, val]) => {
                      const isError = val > 0 && ["broken_links", "errors4xx", "errors5xx", "no_title", "no_description", "no_h1"].includes(key);
                      const isWarning = val > 0 && ["duplicate_title", "duplicate_description", "duplicate_content", "redirects", "slow"].includes(key);
                      return (
                        <div key={key} style={{ background: isError ? `${colors.red}10` : isWarning ? `${colors.amber}10` : `${colors.green}10`, border: `1px solid ${isError ? colors.red : isWarning ? colors.amber : colors.green}20`, borderRadius: 8, padding: 10, textAlign: "center" }}>
                          <div style={{ fontSize: 22, fontWeight: 900, color: isError ? colors.red : isWarning ? colors.amber : colors.green }}>{val}</div>
                          <div style={{ fontSize: 10, color: colors.textMuted }}>{key.replace(/_/g, " ")}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* --- AI OPTIMIZATION --- */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#06b6d4", marginBottom: 10 }}>🤖 AI Sichtbarkeit (Google AI Mode)</h3>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input placeholder="Keyword für AI-Check..." onKeyDown={e => e.key === "Enter" && e.target.value && checkAIVisibility(e.target.value)}
                  style={{ flex: 1, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 12, outline: "none" }} />
                {aiOptLoading && <span className="pulse" style={{ color: "#06b6d4", fontSize: 12, paddingTop: 8 }}>⏳</span>}
              </div>
              {aiOptData.length > 0 && (
                <div style={{ display: "grid", gap: 8 }}>
                  {aiOptData.map((ai, i) => (
                    <div key={i} style={{ background: colors.surface, border: `1px solid ${ai.mentioned ? colors.green : colors.border}`, borderRadius: 10, padding: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>"{ai.keyword}"</span>
                        <span style={{ background: ai.mentioned ? `${colors.green}20` : `${colors.red}20`, color: ai.mentioned ? colors.green : colors.red, padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                          {ai.mentioned ? "✓ ERWÄHNT" : "✗ NICHT ERWÄHNT"}
                        </span>
                      </div>
                      {ai.snippet && <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 6, lineHeight: 1.5 }}>{ai.snippet}</div>}
                      {ai.references?.length > 0 && (
                        <div style={{ fontSize: 10, color: colors.textDim }}>
                          Referenzen: {ai.references.map(r => r.domain).join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- COMPETITORS (FULL IMPLEMENTATION) --- */}
        {activeNav === "competitors" && (
          <div className="fade-in" style={{ padding: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 4 }}>⚔️ Wettbewerbsanalyse</h1>
            <p style={{ color: colors.textMuted, fontSize: 13, marginBottom: 20 }}>GPT-4o powered Wettbewerber-Intelligence · Stärken · Schwächen · Content Gaps</p>

            {/* Competitor Input */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <input
                value={compDomain}
                onChange={e => setCompDomain(e.target.value)}
                placeholder="Wettbewerber-Domain eingeben: z.B. schreinerei-mueller.de"
                style={{ flex: 1, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 13, outline: "none" }}
                onKeyDown={e => e.key === "Enter" && compDomain && analyzeCompetitor(compDomain)}
              />
              <button
                onClick={() => compDomain && analyzeCompetitor(compDomain)}
                disabled={compLoading || !apiKey}
                style={{ background: `linear-gradient(135deg, #ef4444, #dc2626)`, border: "none", borderRadius: 10, padding: "12px 24px", color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                {compLoading ? <span className="pulse">⏳</span> : "⚔️ Analysieren"}
              </button>
            </div>

            {/* Quick Competitor Suggestions */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
              <span style={{ fontSize: 11, color: colors.textDim, paddingTop: 4 }}>Vorschläge:</span>
              {["nobilia.de", "ikea.de", "meine-moebelmanufaktur.de", "deinSchrank.de", "cabinet.de", "elfa.com"].map(d => (
                <button key={d} onClick={() => { setCompDomain(d); analyzeCompetitor(d); }} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 6, padding: "4px 10px", color: colors.red, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
                  ⚔️ {d}
                </button>
              ))}
            </div>

            {/* Competitor Results */}
            {competitorResults.length > 0 && (
              <div style={{ display: "grid", gap: 16 }}>
                {competitorResults.map((comp, i) => (
                  <div key={i} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, overflow: "hidden" }}>
                    <div style={{ padding: "14px 20px", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>⚔️ {comp.domain || `Wettbewerber ${i + 1}`}</h3>
                      <button onClick={() => navigator.clipboard.writeText(JSON.stringify(comp, null, 2))} style={{ background: "transparent", border: `1px solid ${colors.border}`, color: colors.textMuted, borderRadius: 6, padding: "4px 10px", fontSize: 10, cursor: "pointer" }}>📋</button>
                    </div>
                    {comp.raw ? (
                      <pre style={{ padding: 16, whiteSpace: "pre-wrap", fontSize: 12, color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{comp.raw}</pre>
                    ) : (
                      <div style={{ padding: 20 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                          {/* Strengths */}
                          <div>
                            <h4 style={{ fontSize: 12, fontWeight: 700, color: colors.red, marginBottom: 8 }}>👎 Ihre Stärken</h4>
                            {(comp.strengths || []).map((s, j) => (
                              <div key={j} style={{ fontSize: 12, color: colors.textMuted, padding: "4px 0", borderBottom: `1px solid ${colors.border}` }}>• {s}</div>
                            ))}
                          </div>
                          {/* Weaknesses */}
                          <div>
                            <h4 style={{ fontSize: 12, fontWeight: 700, color: colors.green, marginBottom: 8 }}>👍 Ihre Schwächen (= Unsere Chance)</h4>
                            {(comp.weaknesses || []).map((s, j) => (
                              <div key={j} style={{ fontSize: 12, color: colors.textMuted, padding: "4px 0", borderBottom: `1px solid ${colors.border}` }}>• {s}</div>
                            ))}
                          </div>
                        </div>
                        {/* Content Gaps */}
                        {comp.contentGaps && (
                          <div style={{ marginBottom: 16 }}>
                            <h4 style={{ fontSize: 12, fontWeight: 700, color: colors.amber, marginBottom: 8 }}>📝 Content Gaps (was wir schreiben müssen)</h4>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              {comp.contentGaps.map((g, j) => (
                                <span key={j} style={{ background: `${colors.amber}15`, border: `1px solid ${colors.amber}30`, color: colors.amber, padding: "4px 10px", borderRadius: 6, fontSize: 11 }}>{g}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Our Advantages */}
                        {comp.ourAdvantages && (
                          <div style={{ marginBottom: 16 }}>
                            <h4 style={{ fontSize: 12, fontWeight: 700, color: colors.green, marginBottom: 8 }}>💪 Unsere Vorteile</h4>
                            {comp.ourAdvantages.map((a, j) => (
                              <div key={j} style={{ fontSize: 12, color: colors.green, padding: "4px 0" }}>✓ {a}</div>
                            ))}
                          </div>
                        )}
                        {/* Recommendations */}
                        {comp.recommendations && (
                          <div style={{ background: "rgba(245,158,11,0.05)", borderRadius: 10, padding: 14, border: `1px solid ${colors.amber}20` }}>
                            <h4 style={{ fontSize: 12, fontWeight: 700, color: colors.amber, marginBottom: 8 }}>🎯 Empfohlene Maßnahmen</h4>
                            {comp.recommendations.map((r, j) => (
                              <div key={j} style={{ fontSize: 12, color: colors.text, padding: "4px 0", borderBottom: `1px solid rgba(255,255,255,0.03)` }}>{j + 1}. {r}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- CONTENT HUB (FULL IMPLEMENTATION) --- */}
        {activeNav === "content-hub" && (
          <div className="fade-in" style={{ padding: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 4 }}>✍️ Content Hub — Multiplier Engine</h1>
            <p style={{ color: colors.textMuted, fontSize: 13, marginBottom: 20 }}>
              Wähle Service + Region → Generiere LP → Multipliziere auf alle Kanäle via GPT-4o
            </p>

            {/* Quick Config Bar */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
              <select
                value={selectedService?.id || ""}
                onChange={e => setSelectedService(brand.services.find(s => s.id === e.target.value) || null)}
                style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 13, outline: "none", minWidth: 200 }}
              >
                <option value="">Service wählen...</option>
                {brand.services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select
                value={selectedRegions[0] || ""}
                onChange={e => { if (e.target.value && !selectedRegions.includes(e.target.value)) setSelectedRegions([e.target.value, ...selectedRegions]); else if (e.target.value) setSelectedRegions([e.target.value, ...selectedRegions.filter(r => r !== e.target.value)]); }}
                style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 13, outline: "none", minWidth: 180 }}
              >
                {REGIONS.map(r => <option key={r.id} value={r.id}>{r.name} ({r.kreis})</option>)}
              </select>
              <button
                onClick={multiplyContent}
                disabled={!selectedService || !apiKey || generating || generatingChannel}
                style={{
                  background: (selectedService && apiKey && !generating && !generatingChannel) ? `linear-gradient(135deg, ${colors.amber}, ${colors.amberDark})` : colors.surface,
                  border: "none", borderRadius: 10, padding: "10px 24px",
                  color: (selectedService && apiKey) ? "#000" : colors.textDim,
                  fontWeight: 800, fontSize: 13, cursor: (selectedService && apiKey && !generating && !generatingChannel) ? "pointer" : "not-allowed",
                }}
              >
                {(generating || generatingChannel) ? <span className="pulse">🤖 Generiert...</span> : `🚀 Alles generieren (${selectedChannels.length} Kanäle)`}
              </button>
            </div>

            {/* Active Channels */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
              {CHANNELS.map(ch => {
                const active = selectedChannels.includes(ch.id);
                const hasContent = ch.id === "website" ? Object.keys(generatedContent).length > 0 : !!channelContent[ch.id];
                const isGenerating = ch.id === "website" ? generating : generatingChannel === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      toggleChannel(ch.id);
                      if (hasContent) setActiveContentTab(ch.id);
                    }}
                    style={{
                      background: hasContent ? `${ch.color}20` : active ? `${ch.color}10` : colors.surface,
                      border: `2px solid ${hasContent ? ch.color : active ? `${ch.color}40` : colors.border}`,
                      borderRadius: 8, padding: "6px 12px",
                      color: hasContent ? ch.color : active ? `${ch.color}` : colors.textDim,
                      cursor: "pointer", fontSize: 11, fontWeight: 700, transition: "all 0.2s",
                      position: "relative",
                    }}
                  >
                    {isGenerating && <span className="pulse" style={{ marginRight: 4 }}>⏳</span>}
                    {hasContent && <span style={{ marginRight: 4 }}>✓</span>}
                    {ch.icon} {ch.label}
                  </button>
                );
              })}
            </div>

            {/* Content Tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto", borderBottom: `1px solid ${colors.border}`, paddingBottom: 8 }}>
              <button onClick={() => setActiveContentTab("lp-preview")} style={{ background: activeContentTab === "lp-preview" ? colors.amber : "transparent", color: activeContentTab === "lp-preview" ? "#000" : colors.textMuted, border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                🌐 LP Preview
              </button>
              {selectedChannels.filter(c => c !== "website").map(chId => {
                const ch = CHANNELS.find(c => c.id === chId);
                const has = !!channelContent[chId];
                return (
                  <button key={chId} onClick={() => setActiveContentTab(chId)} style={{ background: activeContentTab === chId ? ch.color : "transparent", color: activeContentTab === chId ? "#fff" : has ? ch.color : colors.textDim, border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                    {ch.icon} {ch.label} {has && "✓"}
                  </button>
                );
              })}
              <button onClick={() => setActiveContentTab("log")} style={{ background: activeContentTab === "log" ? colors.surface : "transparent", color: colors.textDim, border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                📋 Log
              </button>
            </div>

            {/* LP PREVIEW TAB */}
            {activeContentTab === "lp-preview" && (() => {
              const key = selectedService && selectedRegions[0] ? `${selectedService.id}-${selectedRegions[0]}` : null;
              const lp = key ? generatedContent[key] : null;
              if (!lp) return (
                <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 40, textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🌐</div>
                  <div style={{ fontWeight: 700, color: "#fff", marginBottom: 8 }}>Noch keine LP generiert</div>
                  <div style={{ color: colors.textMuted, fontSize: 13 }}>Wähle Service + Region und klicke "Alles generieren"</div>
                </div>
              );
              if (lp._error) return (
                <div style={{ background: `${colors.red}10`, border: `1px solid ${colors.red}30`, borderRadius: 14, padding: 24 }}>
                  <div style={{ fontWeight: 700, color: colors.red, marginBottom: 8 }}>❌ Fehler bei der Generierung</div>
                  <div style={{ fontSize: 13, color: colors.textMuted }}>{lp._error}</div>
                  <button onClick={() => selectedService && generateLPContent(selectedService, selectedRegions[0])} style={{ marginTop: 12, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "8px 16px", color: colors.amber, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>🔄 Erneut versuchen</button>
                </div>
              );
              if (lp.raw) return (
                <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 20 }}>
                  <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{lp.raw}</pre>
                </div>
              );
              // Rendered LP Preview
              const reg = REGIONS.find(r => r.id === selectedRegions[0]);
              return (
                <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${colors.border}` }}>
                  {/* Visual LP Preview */}
                  <div style={{ background: "#fff", color: "#1a1a2e", fontFamily: "system-ui, sans-serif" }}>
                    {/* Hero */}
                    <div style={{ background: `linear-gradient(135deg, ${brand.color}15, ${brand.color}05)`, padding: "48px 32px", borderBottom: "1px solid #eee" }}>
                      <div style={{ maxWidth: 700 }}>
                        <div style={{ fontSize: 11, color: brand.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
                          {brand.name} · {reg?.name}
                        </div>
                        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#1a1a2e", lineHeight: 1.2, marginBottom: 12 }}>
                          {lp.hero?.headline || lp.meta?.h1 || "Landing Page"}
                        </h1>
                        <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>
                          {lp.hero?.subline || lp.meta?.description || ""}
                        </p>
                        <div style={{ display: "flex", gap: 12 }}>
                          <span style={{ background: brand.color, color: "#fff", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14 }}>
                            {lp.hero?.cta || brand.cta}
                          </span>
                          <span style={{ background: "#f1f5f9", color: "#475569", padding: "12px 24px", borderRadius: 10, fontWeight: 600, fontSize: 14 }}>
                            📞 {brand.phone}
                          </span>
                        </div>
                      </div>
                      <div style={{ position: "absolute", top: 8, right: 12, background: "#ef444420", color: "#ef4444", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>🔥 HOT ZONE</div>
                    </div>

                    {/* AEO Answer-First */}
                    {lp.answerFirst && (
                      <div style={{ padding: "24px 32px", background: "#f0fdf4", borderBottom: "1px solid #eee" }}>
                        <div style={{ fontSize: 10, color: "#22c55e", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>AEO · Answer-First Absatz</div>
                        <p style={{ fontSize: 14, color: "#1e293b", lineHeight: 1.6 }}>{lp.answerFirst}</p>
                      </div>
                    )}

                    {/* Pain & Agitate */}
                    {lp.painAgitate && (
                      <div style={{ padding: "32px 32px", borderBottom: "1px solid #eee" }}>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", marginBottom: 12 }}>{lp.painAgitate.headline}</h2>
                        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>{lp.painAgitate.body}</p>
                      </div>
                    )}

                    {/* Solution Steps */}
                    {lp.solution && (
                      <div style={{ padding: "32px 32px", background: "#f8fafc", borderBottom: "1px solid #eee" }}>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", marginBottom: 16 }}>{lp.solution.headline}</h2>
                        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(lp.solution.steps?.length || 3, 5)}, 1fr)`, gap: 12 }}>
                          {(lp.solution.steps || []).map((step, i) => (
                            <div key={i} style={{ background: "#fff", borderRadius: 10, padding: 16, border: "1px solid #e2e8f0" }}>
                              <div style={{ fontSize: 24, fontWeight: 900, color: brand.color, marginBottom: 8 }}>{i + 1}</div>
                              <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.5 }}>{step}</div>
                            </div>
                          ))}
                        </div>
                        {lp.solution.cta && (
                          <div style={{ marginTop: 16 }}>
                            <span style={{ background: brand.color, color: "#fff", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 13 }}>{lp.solution.cta}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Social Proof */}
                    {lp.socialProof && (
                      <div style={{ padding: "32px 32px", borderBottom: "1px solid #eee" }}>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", marginBottom: 16 }}>{lp.socialProof.headline}</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12 }}>
                          {(lp.socialProof.testimonials || []).map((t, i) => (
                            <div key={i} style={{ background: "#f8fafc", borderRadius: 10, padding: 16, borderLeft: `3px solid ${brand.color}` }}>
                              <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, fontStyle: "italic", marginBottom: 8 }}>"{t.text}"</p>
                              <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>{t.name} — {t.ort}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* FAQ */}
                    {lp.faq && lp.faq.length > 0 && (
                      <div style={{ padding: "32px 32px", background: "#f8fafc", borderBottom: "1px solid #eee" }}>
                        <div style={{ fontSize: 10, color: "#22c55e", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>FAQ · Schema-Markup Ready</div>
                        {lp.faq.map((f, i) => (
                          <div key={i} style={{ background: "#fff", borderRadius: 8, padding: 16, marginBottom: 8, border: "1px solid #e2e8f0" }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a2e", marginBottom: 6 }}>F: {f.q}</div>
                            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>A: {f.a}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Final CTA */}
                    {lp.finalCta && (
                      <div style={{ padding: "32px 32px", background: `${brand.color}10` }}>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", marginBottom: 8 }}>{lp.finalCta.headline}</h2>
                        <p style={{ fontSize: 14, color: "#475569", marginBottom: 16 }}>{lp.finalCta.body}</p>
                        <span style={{ background: brand.color, color: "#fff", padding: "14px 28px", borderRadius: 10, fontWeight: 800, fontSize: 15 }}>{lp.finalCta.cta}</span>
                      </div>
                    )}
                  </div>

                  {/* Meta/SEO Info Bar */}
                  <div style={{ background: colors.surface, padding: 16 }}>
                    <div style={{ fontSize: 11, color: colors.textDim }}>
                      <strong style={{ color: colors.amber }}>Title:</strong> {lp.meta?.title} &nbsp;|&nbsp;
                      <strong style={{ color: colors.amber }}>H1:</strong> {lp.meta?.h1} &nbsp;|&nbsp;
                      <strong style={{ color: colors.amber }}>Desc:</strong> {lp.meta?.description?.substring(0, 80)}...
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* CHANNEL CONTENT TABS */}
            {activeContentTab !== "lp-preview" && activeContentTab !== "log" && (() => {
              const ch = CHANNELS.find(c => c.id === activeContentTab);
              const data = channelContent[activeContentTab];
              if (!data) return (
                <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 32, textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{ch?.icon}</div>
                  <div style={{ fontWeight: 700, color: "#fff", marginBottom: 8 }}>{ch?.label} Content</div>
                  <div style={{ color: colors.textMuted, fontSize: 13, marginBottom: 16 }}>Noch nicht generiert</div>
                  <button
                    onClick={() => selectedService && generateChannelContent(activeContentTab, selectedService, selectedRegions[0])}
                    disabled={!selectedService || !apiKey || generatingChannel === activeContentTab}
                    style={{ background: ch?.color || colors.amber, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                  >
                    {generatingChannel === activeContentTab ? "⏳ Generiert..." : `${ch?.icon} Jetzt generieren`}
                  </button>
                </div>
              );
              // Render channel content
              return (
                <div style={{ background: colors.surface, border: `1px solid ${ch?.color}30`, borderRadius: 14, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{ch?.icon} {ch?.label} — Fertiger Content</h3>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => { navigator.clipboard.writeText(typeof data === "object" ? JSON.stringify(data, null, 2) : data); }}
                        style={{ background: `${ch?.color}20`, border: `1px solid ${ch?.color}40`, color: ch?.color, borderRadius: 6, padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                      >
                        📋 Alles kopieren
                      </button>
                      <button
                        onClick={() => selectedService && generateChannelContent(activeContentTab, selectedService, selectedRegions[0])}
                        disabled={generatingChannel === activeContentTab}
                        style={{ background: "transparent", border: `1px solid ${colors.border}`, color: colors.textMuted, borderRadius: 6, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}
                      >
                        🔄 Neu generieren
                      </button>
                    </div>
                  </div>
                  {typeof data === "object" && !data.raw ? (
                    <div style={{ display: "grid", gap: 10 }}>
                      {Object.entries(data).map(([key, val]) => (
                        <div key={key} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: 14, borderLeft: `3px solid ${ch?.color}` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 13, textTransform: "capitalize" }}>
                              {key.replace(/([A-Z])/g, " $1")}
                            </span>
                            <button
                              onClick={() => navigator.clipboard.writeText(typeof val === "object" ? JSON.stringify(val, null, 2) : String(val))}
                              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", borderRadius: 4, padding: "2px 8px", fontSize: 10, cursor: "pointer" }}
                            >
                              📋
                            </button>
                          </div>
                          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", color: "#cbd5e1", fontSize: 12, lineHeight: 1.6, margin: 0, fontFamily: typeof val === "object" ? "'JetBrains Mono', monospace" : "inherit" }}>
                            {typeof val === "object" ? JSON.stringify(val, null, 2) : String(val)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
                      {data.raw || JSON.stringify(data, null, 2)}
                    </pre>
                  )}
                </div>
              );
            })()}

            {/* LOG TAB */}
            {activeContentTab === "log" && (
              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 12 }}>📋 Generation Log</h3>
                {contentLog.length === 0 ? (
                  <div style={{ color: colors.textMuted, fontSize: 13 }}>Noch keine Generierungen durchgeführt.</div>
                ) : (
                  <div style={{ display: "grid", gap: 6 }}>
                    {contentLog.map((log, i) => {
                      const ch = CHANNELS.find(c => c.id === log.channel);
                      return (
                        <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 12, color: colors.textMuted }}>
                          <span style={{ color: colors.textDim, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{log.time}</span>
                          <span>{ch?.icon} {ch?.label}</span>
                          <span style={{ color: log.status === "success" ? colors.green : colors.red, fontWeight: 600 }}>
                            {log.status === "success" ? "✓ OK" : log.status === "parse-error" ? "⚠ Parse Error (raw saved)" : `✗ ${log.error}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- CHANNELS (Functional) --- */}
        {activeNav === "channels" && (
          <div className="fade-in" style={{ padding: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 4 }}>📡 Kanal-Management</h1>
            <p style={{ color: colors.textMuted, fontSize: 13, marginBottom: 20 }}>Aktiviere Kanäle und generiere Content direkt</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
              {CHANNELS.map(ch => {
                const active = selectedChannels.includes(ch.id);
                const hasContent = ch.id === "website" ? Object.keys(generatedContent).length > 0 : !!channelContent[ch.id];
                return (
                  <div key={ch.id} style={{
                    background: colors.surface, border: `1px solid ${active ? `${ch.color}40` : colors.border}`,
                    borderRadius: 14, padding: 20, transition: "all 0.2s",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 28 }}>{ch.icon}</span>
                        <div>
                          <div style={{ fontWeight: 700, color: ch.color, fontSize: 15 }}>{ch.label}</div>
                          <div style={{ fontSize: 10, color: hasContent ? colors.green : active ? colors.textMuted : colors.textDim }}>
                            {hasContent ? "✓ Content bereit" : active ? "Aktiv — kein Content" : "Inaktiv"}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleChannel(ch.id)}
                        style={{
                          width: 44, height: 24, borderRadius: 12, border: "none",
                          background: active ? ch.color : "rgba(255,255,255,0.1)",
                          cursor: "pointer", position: "relative", transition: "all 0.2s",
                        }}
                      >
                        <div style={{
                          width: 18, height: 18, borderRadius: "50%", background: "#fff",
                          position: "absolute", top: 3, left: active ? 23 : 3, transition: "left 0.2s",
                        }} />
                      </button>
                    </div>
                    {active && !hasContent && ch.id !== "website" && (
                      <button
                        onClick={() => selectedService && generateChannelContent(ch.id, selectedService, selectedRegions[0])}
                        disabled={!selectedService || !apiKey || generatingChannel === ch.id}
                        style={{
                          width: "100%", background: `${ch.color}15`, border: `1px solid ${ch.color}30`,
                          borderRadius: 8, padding: "8px", color: ch.color, fontSize: 12, fontWeight: 600,
                          cursor: (!selectedService || !apiKey) ? "not-allowed" : "pointer",
                        }}
                      >
                        {generatingChannel === ch.id ? "⏳..." : "Generieren"}
                      </button>
                    )}
                    {hasContent && (
                      <button
                        onClick={() => { setActiveNav("content-hub"); setActiveContentTab(ch.id === "website" ? "lp-preview" : ch.id); }}
                        style={{
                          width: "100%", background: `${colors.green}15`, border: `1px solid ${colors.green}30`,
                          borderRadius: 8, padding: "8px", color: colors.green, fontSize: 12, fontWeight: 600, cursor: "pointer",
                        }}
                      >
                        → Content anzeigen
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- BULK MATRIX --- */}
        {activeNav === "bulk-matrix" && (
          <div className="fade-in" style={{ padding: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 4 }}>⚡ Bulk Matrix — Service × Region</h1>
            <p style={{ color: colors.textMuted, fontSize: 13, marginBottom: 20 }}>
              Generiere LPs für alle Kombinationen. Grün = fertig. Klick = generieren.
            </p>
            <div style={{ overflowX: "auto", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr>
                    <th style={{ padding: "8px 10px", textAlign: "left", color: colors.amber, borderBottom: `1px solid ${colors.border}`, position: "sticky", left: 0, background: colors.surface, fontWeight: 800, minWidth: 160 }}>Service ↓ / Region →</th>
                    {sortedRegions.filter(r => selectedRegions.includes(r.id)).map(r => (
                      <th key={r.id} style={{ padding: "8px 6px", textAlign: "center", color: colors.textMuted, borderBottom: `1px solid ${colors.border}`, whiteSpace: "nowrap", fontWeight: 600, fontSize: 11 }}>
                        <div>{r.name}</div>
                        <div style={{ fontSize: 9, color: colors.textDim }}>{(r.einwohner / 1000).toFixed(0)}k · KKI {r.kaufkraft}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {brand.services.map(svc => (
                    <tr key={svc.id}>
                      <td style={{ padding: "10px 10px", fontWeight: 700, color: "#fff", borderBottom: `1px solid ${colors.border}`, position: "sticky", left: 0, background: colors.surface, whiteSpace: "nowrap" }}>
                        {svc.name}
                      </td>
                      {sortedRegions.filter(r => selectedRegions.includes(r.id)).map(r => {
                        const key = `${svc.id}-${r.id}`;
                        const has = !!generatedContent[key];
                        const isGen = generating && selectedService?.id === svc.id;
                        return (
                          <td key={r.id} style={{ padding: "6px", textAlign: "center", borderBottom: `1px solid ${colors.border}` }}>
                            <button
                              onClick={() => { setSelectedService(svc); generateLPContent(svc, r.id); }}
                              disabled={isGen || !apiKey}
                              style={{
                                width: 36, height: 36, borderRadius: 8, border: "none", cursor: apiKey ? "pointer" : "not-allowed",
                                background: has ? `${colors.green}20` : isGen ? `${colors.amber}20` : "rgba(255,255,255,0.03)",
                                color: has ? colors.green : isGen ? colors.amber : colors.textDim,
                                fontSize: 14, fontWeight: 700, transition: "all 0.2s",
                              }}
                            >
                              {isGen ? <span className="pulse">⏳</span> : has ? "✓" : "○"}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Bulk Generate Button */}
            <button
              onClick={async () => {
                if (!apiKey) { setShowApiModal(true); return; }
                for (const svc of brand.services) {
                  for (const rId of selectedRegions) {
                    const key = `${svc.id}-${rId}`;
                    if (!generatedContent[key]) {
                      setSelectedService(svc);
                      await generateLPContent(svc, rId);
                    }
                  }
                }
              }}
              disabled={generating || !apiKey}
              style={{ marginTop: 16, width: "100%", padding: 16, background: (!generating && apiKey) ? `linear-gradient(135deg, ${colors.amber}, ${colors.amberDark})` : colors.surface, border: "none", borderRadius: 12, color: (!generating && apiKey) ? "#000" : colors.textDim, fontWeight: 800, fontSize: 14, cursor: (!generating && apiKey) ? "pointer" : "not-allowed" }}
            >
              {generating ? <span className="pulse">🤖 Generiert... </span> : `⚡ Alle fehlenden LPs generieren (${brand.services.length * selectedRegions.length - Object.keys(generatedContent).length} offen)`}
            </button>
          </div>
        )}

        {/* --- CONTENT CALENDAR --- */}
        {activeNav === "calendar" && (
          <div className="fade-in" style={{ padding: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 4 }}>📅 Content-Kalender</h1>
            <p style={{ color: colors.textMuted, fontSize: 13, marginBottom: 20 }}>
              30-Tage Posting-Plan über alle Kanäle — basierend auf Service × Region Rotation
            </p>
            {(() => {
              const today = new Date();
              const days = Array.from({ length: 30 }, (_, i) => {
                const d = new Date(today); d.setDate(d.getDate() + i);
                return d;
              });
              const channelRotation = selectedChannels.filter(c => c !== "website");
              const serviceRotation = brand.services;
              const regionRotation = selectedRegions.map(r => REGIONS.find(x => x.id === r)).filter(Boolean);
              const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
              const postDays = [1, 2, 3, 4, 5]; // Mo-Fr
              return (
                <div style={{ display: "grid", gap: 6 }}>
                  {days.map((day, i) => {
                    const isPostDay = postDays.includes(day.getDay());
                    const svc = serviceRotation[i % serviceRotation.length];
                    const reg = regionRotation[i % regionRotation.length];
                    const ch1 = channelRotation[(i * 2) % channelRotation.length];
                    const ch2 = channelRotation[(i * 2 + 1) % channelRotation.length];
                    const chObj1 = CHANNELS.find(c => c.id === ch1);
                    const chObj2 = CHANNELS.find(c => c.id === ch2);
                    const isToday = i === 0;
                    const isWeekend = [0, 6].includes(day.getDay());
                    return (
                      <div key={i} style={{
                        display: "flex", gap: 12, alignItems: "center",
                        background: isToday ? `${colors.amber}10` : isWeekend ? "rgba(255,255,255,0.01)" : colors.surface,
                        border: `1px solid ${isToday ? colors.borderActive : colors.border}`,
                        borderRadius: 10, padding: "10px 14px",
                        opacity: isWeekend && !isPostDay ? 0.5 : 1,
                      }}>
                        <div style={{ width: 50, textAlign: "center", flexShrink: 0 }}>
                          <div style={{ fontSize: 10, color: colors.textDim, fontWeight: 600 }}>{dayNames[day.getDay()]}</div>
                          <div style={{ fontSize: 18, fontWeight: 900, color: isToday ? colors.amber : "#fff" }}>{day.getDate()}</div>
                          <div style={{ fontSize: 9, color: colors.textDim }}>{day.toLocaleDateString("de-DE", { month: "short" })}</div>
                        </div>
                        {isPostDay ? (
                          <div style={{ flex: 1, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                            <span style={{ background: `${brand.color}15`, border: `1px solid ${brand.color}30`, color: brand.color, padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                              {svc?.name}
                            </span>
                            <span style={{ fontSize: 11, color: colors.textDim }}>×</span>
                            <span style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: colors.blue, padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                              📍 {reg?.name}
                            </span>
                            <span style={{ fontSize: 11, color: colors.textDim }}>→</span>
                            {chObj1 && <span style={{ background: `${chObj1.color}15`, color: chObj1.color, padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{chObj1.icon} {chObj1.label}</span>}
                            {chObj2 && <span style={{ background: `${chObj2.color}15`, color: chObj2.color, padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{chObj2.icon} {chObj2.label}</span>}
                          </div>
                        ) : (
                          <div style={{ flex: 1, fontSize: 12, color: colors.textDim, fontStyle: "italic" }}>Wochenende — kein geplanter Post</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* --- SCHEMA.ORG GENERATOR --- */}
        {activeNav === "schema" && (
          <div className="fade-in" style={{ padding: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 4 }}>🏷️ Schema.org Generator</h1>
            <p style={{ color: colors.textMuted, fontSize: 13, marginBottom: 20 }}>
              Structured Data für jede LP — LocalBusiness, FAQPage, Service, BreadcrumbList
            </p>
            {brand.services.map(svc => {
              const schemas = selectedRegions.slice(0, 4).map(rId => {
                const reg = REGIONS.find(r => r.id === rId);
                return {
                  region: reg,
                  localBusiness: { "@context": "https://schema.org", "@type": "LocalBusiness", "name": brand.name, "description": `${svc.name} nach Maß in ${reg.name}. ${brand.usp}`, "telephone": brand.phone, "address": { "@type": "PostalAddress", "streetAddress": "Lindenstraße 9-15", "addressLocality": "Murrhardt", "postalCode": "71540", "addressRegion": "Baden-Württemberg", "addressCountry": "DE" }, "areaServed": [{ "@type": "City", "name": reg.name }, { "@type": "AdministrativeArea", "name": reg.kreis }], "url": `https://${brand.domain}${svc.slug}`, "priceRange": "€€-€€€" },
                  service: { "@context": "https://schema.org", "@type": "Service", "name": `${svc.name} nach Maß`, "provider": { "@type": "LocalBusiness", "name": brand.name }, "areaServed": { "@type": "City", "name": reg.name }, "description": `Individuelle ${svc.name} vom Schreinermeister in ${reg.name}. Aufmaß, Fertigung und Montage aus einer Hand.` },
                  faq: { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
                    { "@type": "Question", "name": `Was kostet ein ${svc.name.toLowerCase()} vom Schreiner in ${reg.name}?`, "acceptedAnswer": { "@type": "Answer", "text": `Ein ${svc.name.toLowerCase()} nach Maß beginnt bei ca. 2.900 €. Der genaue Preis hängt von Größe und Ausstattung ab.` }},
                    { "@type": "Question", "name": `Wie lange dauert die Fertigung?`, "acceptedAnswer": { "@type": "Answer", "text": `Die Lieferzeit beträgt ${brand.lieferzeit} ab Auftragsbestätigung, inklusive Montage vor Ort.` }},
                  ]},
                  breadcrumb: { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": `https://${brand.domain}/` },
                    { "@type": "ListItem", "position": 2, "name": svc.name, "item": `https://${brand.domain}${svc.slug}` },
                    { "@type": "ListItem", "position": 3, "name": `${svc.name} ${reg.name}`, "item": `https://${brand.domain}/${svc.id}-${rId}/` },
                  ]},
                };
              });
              return (
                <div key={svc.id} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, marginBottom: 16, overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>🪵 {svc.name}</h3>
                    <span style={{ fontSize: 10, color: colors.textMuted }}>{schemas.length} Regionen</span>
                  </div>
                  {schemas.map((s, i) => (
                    <div key={i} style={{ padding: 14, borderBottom: `1px solid ${colors.border}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontWeight: 600, fontSize: 12, color: colors.blue }}>📍 {s.region.name}</span>
                        <div style={{ display: "flex", gap: 4 }}>
                          {["LocalBusiness", "Service", "FAQ", "Breadcrumb"].map((type, j) => {
                            const schemaObj = [s.localBusiness, s.service, s.faq, s.breadcrumb][j];
                            return (
                              <button key={type} onClick={() => navigator.clipboard.writeText(`<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>`)}
                                style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${colors.border}`, color: colors.textMuted, borderRadius: 4, padding: "2px 8px", fontSize: 9, cursor: "pointer", fontWeight: 600 }}>
                                📋 {type}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <pre style={{ fontSize: 10, color: colors.textDim, lineHeight: 1.4, maxHeight: 80, overflow: "hidden", fontFamily: "'JetBrains Mono', monospace" }}>
                        {JSON.stringify(s.localBusiness, null, 2).substring(0, 200)}...
                      </pre>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* --- SETTINGS --- */}
        {activeNav === "settings" && (
          <div className="fade-in" style={{ padding: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 24 }}>⚙️ Einstellungen & Export</h1>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 900 }}>
              {/* OpenAI */}
              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  🤖 OpenAI API Key
                  {apiKey && <span style={{ fontSize: 10, background: `${colors.green}20`, color: colors.green, padding: "2px 6px", borderRadius: 4 }}>✓ Verbunden</span>}
                </h3>
                <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-proj-..."
                  style={{ width: "100%", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", outline: "none" }} />
                <p style={{ fontSize: 11, color: colors.textMuted, marginTop: 8 }}>GPT-4o für Content, Keywords, Wettbewerber</p>
              </div>

              {/* DataForSEO */}
              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  📊 DataForSEO
                  {dfsLogin && dfsPw && <span style={{ fontSize: 10, background: `${colors.green}20`, color: colors.green, padding: "2px 6px", borderRadius: 4 }}>✓ Verbunden</span>}
                </h3>
                <input value={dfsLogin} onChange={e => setDfsLogin(e.target.value)} placeholder="Login (E-Mail)"
                  style={{ width: "100%", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none", marginBottom: 8 }} />
                <input type="password" value={dfsPw} onChange={e => setDfsPw(e.target.value)} placeholder="API Passwort"
                  style={{ width: "100%", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none" }} />
                <p style={{ fontSize: 11, color: colors.textMuted, marginTop: 8 }}>Echte Suchvolumen, SERP-Daten, Rankings</p>
              </div>
            </div>

            {/* Export Section */}
            <div style={{ background: colors.surface, border: `1px solid ${colors.amber}20`, borderRadius: 14, padding: 24, marginTop: 20, maxWidth: 900 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.amber, marginBottom: 12 }}>📦 Alles exportieren</h3>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 16 }}>
                Exportiert alle generierten LPs, Channel-Content, Keywords und Wettbewerbsanalysen
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => exportAll("json")} style={{ background: `linear-gradient(135deg, ${colors.amber}, ${colors.amberDark})`, border: "none", borderRadius: 10, padding: "12px 24px", color: "#000", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
                  💾 JSON Export
                </button>
                <button onClick={() => exportAll("markdown")} style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${colors.border}`, borderRadius: 10, padding: "12px 24px", color: colors.text, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  📝 Markdown Export
                </button>
              </div>
              <div style={{ marginTop: 12, fontSize: 11, color: colors.textDim }}>
                Enthält: {Object.keys(generatedContent).length} LPs · {Object.keys(channelContent).length} Kanal-Inhalte · {keywordResults.length} Keywords · {competitorResults.length} Wettbewerber
              </div>
            </div>

            {/* Status Overview */}
            <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 24, marginTop: 20, maxWidth: 900 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 12 }}>📋 System-Status</h3>
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  { label: "OpenAI GPT-4o", status: !!apiKey, detail: apiKey ? "Verbunden" : "Nicht konfiguriert" },
                  { label: "DataForSEO", status: !!(dfsLogin && dfsPw), detail: (dfsLogin && dfsPw) ? "Verbunden" : "Optional — GPT-Fallback aktiv" },
                  { label: "Aktive Brand", status: true, detail: `${brand.domain} (${brand.services.length} Services)` },
                  { label: "Regionen", status: selectedRegions.length > 0, detail: `${selectedRegions.length} ausgewählt` },
                  { label: "Kanäle", status: selectedChannels.length > 0, detail: `${selectedChannels.length} aktiv` },
                  { label: "Generierte Inhalte", status: Object.keys(generatedContent).length > 0, detail: `${Object.keys(generatedContent).length} LPs, ${Object.keys(channelContent).length} Channel-Inhalte` },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${colors.border}` }}>
                    <span style={{ fontSize: 13, color: colors.text }}>{item.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, color: colors.textMuted }}>{item.detail}</span>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.status ? colors.green : colors.red }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* API KEY MODAL (Enhanced) */}
      {showApiModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}
          onClick={() => setShowApiModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: colors.surface, borderRadius: 20, padding: 32,
              width: 500, border: `1px solid ${colors.border}`, maxHeight: "90vh", overflowY: "auto",
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 6 }}>🔑 API Konfiguration</h2>
            <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 20 }}>
              Verbinde deine APIs um das volle Potential des Agency Simulators zu nutzen.
            </p>

            {/* OpenAI */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: colors.amber, display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                🤖 OpenAI API Key (Pflicht)
                {apiKey && <span style={{ fontSize: 9, background: `${colors.green}20`, color: colors.green, padding: "1px 6px", borderRadius: 3 }}>✓</span>}
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="sk-proj-..."
                autoFocus
                style={{ width: "100%", background: colors.bg, border: `1px solid ${apiKey ? colors.green + "40" : colors.border}`, borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", outline: "none" }}
              />
              <p style={{ fontSize: 10, color: colors.textDim, marginTop: 4 }}>GPT-4o für Content-Generierung, Keywords (Fallback), Wettbewerber-Analyse</p>
            </div>

            {/* DataForSEO */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: colors.blue, display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                📊 DataForSEO (Optional — für echte Suchvolumen)
                {dfsLogin && dfsPw && <span style={{ fontSize: 9, background: `${colors.green}20`, color: colors.green, padding: "1px 6px", borderRadius: 3 }}>✓</span>}
              </label>
              <input value={dfsLogin} onChange={e => setDfsLogin(e.target.value)} placeholder="Login (E-Mail)"
                style={{ width: "100%", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none", marginBottom: 6 }} />
              <input type="password" value={dfsPw} onChange={e => setDfsPw(e.target.value)} placeholder="API Passwort"
                style={{ width: "100%", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none" }} />
              <p style={{ fontSize: 10, color: colors.textDim, marginTop: 4 }}>Ohne DataForSEO nutzt das System GPT-4o als Fallback für Keyword-Daten</p>
            </div>

            {/* Status */}
            <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: 12, marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: colors.textMuted, display: "grid", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Content-Generierung (GPT-4o)</span>
                  <span style={{ color: apiKey ? colors.green : colors.red }}>{apiKey ? "✓ Bereit" : "✗ API Key fehlt"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Keyword-Recherche</span>
                  <span style={{ color: (dfsLogin && dfsPw) ? colors.green : apiKey ? colors.amber : colors.red }}>{(dfsLogin && dfsPw) ? "✓ DataForSEO" : apiKey ? "⚠ GPT Fallback" : "✗ Keine API"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>SERP-Analyse</span>
                  <span style={{ color: (dfsLogin && dfsPw) ? colors.green : apiKey ? colors.amber : colors.red }}>{(dfsLogin && dfsPw) ? "✓ DataForSEO" : apiKey ? "⚠ GPT Fallback" : "✗ Keine API"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Wettbewerber-Analyse</span>
                  <span style={{ color: apiKey ? colors.green : colors.red }}>{apiKey ? "✓ GPT-4o" : "✗ API Key fehlt"}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowApiModal(false)}
              style={{
                width: "100%", padding: 14,
                background: apiKey ? `linear-gradient(135deg, ${colors.amber}, ${colors.amberDark})` : "rgba(255,255,255,0.06)",
                border: "none", borderRadius: 10, color: apiKey ? "#000" : colors.textMuted, fontWeight: 800,
                fontSize: 14, cursor: "pointer",
              }}
            >
              {apiKey ? "✓ Gespeichert — Los geht's!" : "Schließen (ohne API Key eingeschränkt)"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
