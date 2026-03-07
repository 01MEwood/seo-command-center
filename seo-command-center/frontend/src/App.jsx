import { useState, useEffect, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
// SCHREINERHELDEN × IHR-MÖBEL-SCHREINER
// SEO · AIO · GEO COMMAND CENTER v3
// Expert Board: Dean, King, Barnard, Ray, Fishkin, Krum, Irwin, Dunford
// API Layer: Google Search Console, Analytics, DataForSEO, ChatGPT
// ═══════════════════════════════════════════════════════════════

const DOMAINS = {
  sh: { id: "sh", name: "Schreinerhelden", domain: "schreinerhelden.de", color: "#E8490F", accent: "#FF6B3D", icon: "🔶", positioning: "Maßmöbel-Marke", audience: "Privatkunden, Eigenheimbesitzer" },
  ims: { id: "ims", name: "Ihr Möbel-Schreiner", domain: "ihr-moebel-schreiner.de", color: "#1B7A52", accent: "#2EAA72", icon: "🟢", positioning: "Werkstatt & Partnerschaft", audience: "Architekten, Bauträger, Gewerbe" },
};

// ── World-Class Expert Board ──
const EXPERTS = [
  {
    id: "dean", name: "Brian Dean", role: "Traffic & Backlinks",
    color: "#2563EB", icon: "🏗️",
    credential: "Gründer Backlinko (→ SEMrush). 812K Follower. Skyscraper Technique.",
    framework: "Skyscraper-Score",
    frameworkDesc: "Ist unser Content besser als ALLES auf Seite 1? 3 Stufen: 1) Finde den besten Content zum Keyword. 2) Mach etwas deutlich Besseres. 3) Kontaktiere die richtigen Leute.",
    audit: [
      { check: "Content länger & detaillierter als Pos. 1?", field: "depth" },
      { check: "Enthält echte Daten/Tabellen die Pos. 1 fehlen?", field: "data" },
      { check: "Visuell überlegen (Fotos, Grafiken)?", field: "visual" },
      { check: "Bessere UX (schneller, mobil, strukturiert)?", field: "ux" },
      { check: "Link-würdig? Würde ein Journalist das zitieren?", field: "linkable" },
    ],
  },
  {
    id: "king", name: "Mike King", role: "Technical SEO / GEO Infrastruktur",
    color: "#7C3AED", icon: "⚙️",
    credential: "Erfinder 'Relevance Engineering'. SEO Week 2025 Keynote. AI Mode Experte.",
    framework: "Schema-Readiness-Check",
    frameworkDesc: "Kann eine AI-Engine unseren Content parsen? Strukturierte Daten = die Sprache die Maschinen lesen. Ohne Schema bist du für GPT/Gemini unsichtbar.",
    audit: [
      { check: "LocalBusiness Schema (NAP, Öffnungszeiten)?", field: "local" },
      { check: "Product/Offer Schema (Preise, Verfügbarkeit)?", field: "product" },
      { check: "FAQ Schema (mind. 5 Fragen)?", field: "faq" },
      { check: "HowTo Schema (Prozess-Seiten)?", field: "howto" },
      { check: "AggregateRating (Bewertungen eingebunden)?", field: "rating" },
      { check: "Breadcrumb + SiteNavigationElement?", field: "nav" },
    ],
  },
  {
    id: "barnard", name: "Jason Barnard", role: "Entity SEO / Knowledge Panels",
    color: "#DC2626", icon: "🎯",
    credential: "The Brand SERP Guy. Buch: 'Winning in Google & AI with Personal Brand'. GEO-Pionier.",
    framework: "Entity-Mapping",
    frameworkDesc: "Wird 'Schreinerhelden' als Entität erkannt? Google Knowledge Graph + Wikidata + Schema = die Trifecta. Ohne Entitätserkennung existierst du für KI nicht.",
    audit: [
      { check: "Google Knowledge Panel vorhanden?", field: "panel" },
      { check: "Wikidata-Eintrag für Unternehmen?", field: "wikidata" },
      { check: "Konsistente NAP über alle Verzeichnisse?", field: "nap" },
      { check: "Schema Organization mit sameAs-Links?", field: "sameAs" },
      { check: "Brand-SERP sauber (eigene Ergebnisse dominieren)?", field: "brandserp" },
      { check: "Wird Marke in ChatGPT/Perplexity erwähnt?", field: "aiMention" },
    ],
  },
  {
    id: "ray", name: "Lily Ray", role: "E-E-A-T / AI Overviews",
    color: "#DB2777", icon: "🛡️",
    credential: "Head of Organic Research, Amsive. 731K Google Citations. E-E-A-T Autorität Nr. 1.",
    framework: "E-E-A-T Audit",
    frameworkDesc: "Experience, Expertise, Authoritativeness, Trust — die 4 Säulen die Google (und AI Overviews) entscheiden lassen ob du zitiert wirst oder nicht.",
    audit: [
      { check: "Experience: Echte Projektfotos, nicht Stock?", field: "experience" },
      { check: "Experience: Autor mit Handwerks-Biografie?", field: "authorBio" },
      { check: "Expertise: Fachlich korrekte Angaben (SVS, Preise)?", field: "expertise" },
      { check: "Authoritativeness: Backlinks von Fachmedien/IHK?", field: "authority" },
      { check: "Trust: Impressum, DSGVO, SSL, Bewertungen?", field: "trust" },
      { check: "AIO-Signal: Wird Seite in AI Overviews zitiert?", field: "aio" },
    ],
  },
  {
    id: "fishkin", name: "Rand Fishkin", role: "Audience Intelligence",
    color: "#0891B2", icon: "🔍",
    credential: "Co-Gründer Moz ($50M+ SaaS) & SparkToro. 699K Follower. Audience-First Strategie.",
    framework: "Audience-Overlap Analyse",
    frameworkDesc: "Wo ist deine Zielgruppe BEVOR sie googelt? Welche Podcasts hört sie, welche YouTube-Kanäle, welche Social Accounts? Dort musst du sichtbar sein.",
    audit: [
      { check: "Zielgruppen-Persona definiert (Alter, Einkommen, Region)?", field: "persona" },
      { check: "Audience Sources identifiziert (wo informieren die sich)?", field: "sources" },
      { check: "Content auf Audience-Kanälen platziert?", field: "placement" },
      { check: "Zero-Click Strategie (Snippets, Knowledge Panels)?", field: "zeroClick" },
      { check: "Dark Social / Empfehlungsverkehr analysiert?", field: "darkSocial" },
    ],
  },
  {
    id: "krum", name: "Cindy Krum", role: "Mobile-First & Entitäten-SEO",
    color: "#059669", icon: "📱",
    credential: "CEO MobileMoxie. Vorreiterin Mobile-First-Indexierung. Entitäten-SEO Pionierin.",
    framework: "Mobile-Entity-Check",
    frameworkDesc: "Google indexiert Mobile-First. Wenn deine mobile Seite schlechter ist als Desktop, verlierst du. Plus: Entitäten > Keywords — Google versteht Konzepte, nicht Wörter.",
    audit: [
      { check: "Mobile Page Speed < 2.5s LCP?", field: "speed" },
      { check: "Mobile UX: Keine Layout Shifts (CLS < 0.1)?", field: "cls" },
      { check: "Mobile CTA: Thumb-friendly, above fold?", field: "mobileCta" },
      { check: "Entitäten-Netz: Co-Entities im Content verknüpft?", field: "entities" },
      { check: "Fraggles: Content in verdaulichen Fragmenten?", field: "fraggles" },
    ],
  },
  {
    id: "irwin", name: "Todd Irwin", role: "De-Positioning / Marktdominanz",
    color: "#D97706", icon: "♟️",
    credential: "Gründer Fazer. Erfinder 'De-Positioning'. 30+ Jahre Brand Strategy.",
    framework: "De-Positioning Matrix",
    frameworkDesc: "Nicht differenzieren — das Spielfeld verschieben. Mach den Wettbewerb irrelevant. Schreinerhelden ≠ 'besser als IKEA' sondern 'eine komplett andere Kategorie'.",
    audit: [
      { check: "Wettbewerber-Schwäche als eigene Stärke geframt?", field: "reframe" },
      { check: "Kategorie neu definiert (nicht 'Schreiner' sondern '...')?", field: "category" },
      { check: "Kunden-Pain als Hero-Message?", field: "pain" },
      { check: "Ökosystem-Lock-in (Beratung → Aufmaß → Montage → Service)?", field: "ecosystem" },
      { check: "Competitor's Strength als Liability positioniert?", field: "deposition" },
    ],
  },
  {
    id: "dunford", name: "April Dunford", role: "Product Positioning",
    color: "#6D28D9", icon: "💎",
    credential: "Autorin 'Obviously Awesome'. Die weltweite Referenz für Positioning.",
    framework: "Positioning-Canvas",
    frameworkDesc: "In welcher Kategorie gewinnen wir automatisch? Nicht 'was macht uns anders' — sondern 'wofür sind wir die offensichtliche Wahl?'",
    audit: [
      { check: "Competitive Alternatives klar benannt?", field: "alternatives" },
      { check: "Unique Attributes definiert (was NUR wir können)?", field: "unique" },
      { check: "Value diese Attributes liefern (Kundennutzen)?", field: "value" },
      { check: "Zielkunde der diesen Value maximal schätzt?", field: "bestCustomer" },
      { check: "Marktkategorie die unsere Stärke offensichtlich macht?", field: "marketCat" },
    ],
  },
];

const TABS = [
  { id: "command", label: "Command Center", icon: "◉" },
  { id: "experts", label: "Expert Board", icon: "🧠" },
  { id: "audit", label: "Site Audit", icon: "🔬" },
  { id: "territories", label: "Territorien", icon: "🗺️" },
  { id: "cannibal", label: "Kannibalisierung", icon: "⚠️" },
  { id: "content", label: "Content-Plan", icon: "✍️" },
  { id: "apis", label: "API Hub", icon: "🔌" },
];

// ── API Config State ──
const API_SERVICES = [
  { id: "gsc", name: "Google Search Console", icon: "📊", desc: "Rankings, Klicks, Impressionen, CTR, Position", endpoint: "searchconsole.googleapis.com", scopes: ["webmasters.readonly"], status: "ready" },
  { id: "ga4", name: "Google Analytics 4", icon: "📈", desc: "Traffic, Conversions, User Behavior, Events", endpoint: "analyticsdata.googleapis.com", scopes: ["analytics.readonly"], status: "ready" },
  { id: "gmb", name: "Google Business Profile", icon: "📍", desc: "Lokale Sichtbarkeit, Bewertungen, Impressionen", endpoint: "mybusinessbusinessinformation.googleapis.com", scopes: ["business.manage"], status: "ready" },
  { id: "gads", name: "Google Ads", icon: "💰", desc: "Keyword Planner Daten, CPC, Wettbewerb", endpoint: "googleads.googleapis.com", scopes: ["adwords"], status: "ready" },
  { id: "psi", name: "PageSpeed Insights", icon: "⚡", desc: "Core Web Vitals, LCP, CLS, FID", endpoint: "pagespeedonline.googleapis.com", scopes: ["public"], status: "ready" },
  { id: "indexing", name: "Indexing API", icon: "🔄", desc: "Sofort-Indexierung neuer Seiten", endpoint: "indexing.googleapis.com", scopes: ["indexing"], status: "ready" },
  { id: "dataforseo", name: "DataForSEO", icon: "🔑", desc: "Keyword-Volumen, SERP, Backlinks, Trends", endpoint: "api.dataforseo.com", scopes: ["v3"], status: "ready" },
  { id: "chatgpt", name: "ChatGPT API", icon: "🤖", desc: "Content-Analyse, Longtails, AI Visibility Check", endpoint: "api.openai.com", scopes: ["chat.completions"], status: "ready" },
  { id: "claude", name: "Claude API", icon: "🧠", desc: "Semantik-Analyse, E-E-A-T Scoring, Expert Reasoning", endpoint: "api.anthropic.com", scopes: ["messages"], status: "ready" },
];

// ── GSC Mock Data ──
const GSC_DATA = {
  sh: [
    { query: "einbauschrank nach maß kosten", clicks: 47, impressions: 1280, ctr: 3.7, position: 8.2, trend: "up" },
    { query: "schreiner murrhardt", clicks: 31, impressions: 420, ctr: 7.4, position: 3.1, trend: "stable" },
    { query: "einbauschrank dachschräge", clicks: 22, impressions: 890, ctr: 2.5, position: 12.4, trend: "up" },
    { query: "ankleide planen", clicks: 18, impressions: 1100, ctr: 1.6, position: 15.7, trend: "up" },
    { query: "maßschrank kosten pro meter", clicks: 12, impressions: 540, ctr: 2.2, position: 9.8, trend: "stable" },
    { query: "schreiner vs ikea pax", clicks: 8, impressions: 720, ctr: 1.1, position: 18.3, trend: "down" },
    { query: "aufmaß termin schreiner", clicks: 5, impressions: 180, ctr: 2.8, position: 6.4, trend: "up" },
  ],
  ims: [
    { query: "schreinerei murrhardt", clicks: 28, impressions: 310, ctr: 9.0, position: 2.4, trend: "stable" },
    { query: "schreiner backnang", clicks: 19, impressions: 380, ctr: 5.0, position: 4.8, trend: "up" },
    { query: "innenausbau gewerbe", clicks: 8, impressions: 290, ctr: 2.8, position: 14.2, trend: "up" },
    { query: "küche vom schreiner", clicks: 6, impressions: 520, ctr: 1.2, position: 19.1, trend: "new" },
    { query: "schreiner für architekten", clicks: 4, impressions: 140, ctr: 2.9, position: 8.7, trend: "up" },
  ],
};

// ── Utility Components ──

function Badge({ children, bg, color, border }) {
  return <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 10, background: bg, color, border: border || "none", letterSpacing: 0.5, whiteSpace: "nowrap", display: "inline-block" }}>{children}</span>;
}

function DomainPill({ id }) {
  const d = DOMAINS[id]; if (!d) return null;
  return <Badge bg={d.color + "15"} color={d.color} border={`1px solid ${d.color}30`}>{d.icon} {d.domain}</Badge>;
}

function TrendIcon({ trend }) {
  const m = { up: { s: "▲", c: "#10B981" }, down: { s: "▼", c: "#EF4444" }, stable: { s: "●", c: "#6B7280" }, new: { s: "✦", c: "#F59E0B" } };
  const t = m[trend] || m.stable;
  return <span style={{ color: t.c, fontSize: 11, fontWeight: 800 }}>{t.s}</span>;
}

function Card({ children, accent, hover, onClick, style: cs }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered && hover ? "#1A1A30" : "#13132A",
        border: `1px solid ${accent ? accent + "25" : "#22224A"}`,
        borderRadius: 14, overflow: "hidden", position: "relative",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.15s ease",
        transform: hovered && hover ? "translateY(-1px)" : "none",
        ...cs,
      }}
    >
      {accent && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${accent}, transparent)` }} />}
      {children}
    </div>
  );
}

function Metric({ label, value, sub, color = "#E8490F", change }) {
  return (
    <Card accent={color}>
      <div style={{ padding: "18px 22px" }}>
        <div style={{ color: "#6B6B9A", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 30, fontWeight: 800, color: "#EDEDF5", fontFamily: "'Space Mono', monospace" }}>{value}</span>
          {sub && <span style={{ color: "#6B6B9A", fontSize: 12 }}>{sub}</span>}
        </div>
        {change !== undefined && (
          <div style={{ marginTop: 6, fontSize: 12, fontWeight: 700, color: change >= 0 ? "#10B981" : "#EF4444" }}>
            {change >= 0 ? "↑" : "↓"} {Math.abs(change)}% vs. Vormonat
          </div>
        )}
      </div>
    </Card>
  );
}

// ── Command Center (Dashboard) ──
function CommandCenter() {
  const [activeDomain, setActiveDomain] = useState("sh");
  const gsc = GSC_DATA[activeDomain];
  const d = DOMAINS[activeDomain];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Domain Switch */}
      <div style={{ display: "flex", gap: 8 }}>
        {Object.values(DOMAINS).map(dom => (
          <button key={dom.id} onClick={() => setActiveDomain(dom.id)} style={{
            padding: "10px 22px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700,
            background: activeDomain === dom.id ? dom.color + "15" : "transparent",
            border: `1px solid ${activeDomain === dom.id ? dom.color + "40" : "#22224A"}`,
            color: activeDomain === dom.id ? dom.color : "#6B6B9A",
          }}>{dom.icon} {dom.name}</button>
        ))}
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
        <Metric label="Org. Klicks" value={gsc.reduce((s, r) => s + r.clicks, 0)} sub="/Monat" color="#10B981" change={12.3} />
        <Metric label="Impressionen" value={(gsc.reduce((s, r) => s + r.impressions, 0) / 1000).toFixed(1) + "K"} sub="/Monat" color="#3B82F6" change={8.7} />
        <Metric label="Ø CTR" value={(gsc.reduce((s, r) => s + r.ctr, 0) / gsc.length).toFixed(1) + "%"} color="#F59E0B" change={1.2} />
        <Metric label="Ø Position" value={(gsc.reduce((s, r) => s + r.position, 0) / gsc.length).toFixed(1)} color="#7C3AED" change={-2.4} />
        <Metric label="APIs Aktiv" value={API_SERVICES.filter(a => a.status === "ready").length + "/" + API_SERVICES.length} color="#E8490F" />
      </div>

      {/* GSC Table + Expert Insights */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}>
        <Card accent={d.color}>
          <div style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ color: "#EDEDF5", fontSize: 15, fontWeight: 700, margin: 0 }}>📊 GSC Live — {d.domain}</h3>
              <Badge bg="#10B98115" color="#10B981">LIVE API</Badge>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["Query", "Klicks", "Impr.", "CTR", "Pos.", ""].map(h => (
                  <th key={h} style={{ color: "#6B6B9A", fontSize: 10, fontWeight: 700, padding: "6px 10px", textAlign: "left", borderBottom: "1px solid #22224A", letterSpacing: 1 }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {gsc.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #18182E" }}>
                    <td style={{ color: "#EDEDF5", fontSize: 12, padding: "9px 10px", fontFamily: "'Space Mono', monospace", maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis" }}>{row.query}</td>
                    <td style={{ color: "#10B981", fontSize: 12, padding: "9px 10px", fontWeight: 700 }}>{row.clicks}</td>
                    <td style={{ color: "#8888AA", fontSize: 12, padding: "9px 10px" }}>{row.impressions.toLocaleString()}</td>
                    <td style={{ color: row.ctr > 3 ? "#10B981" : "#F59E0B", fontSize: 12, padding: "9px 10px", fontWeight: 600 }}>{row.ctr}%</td>
                    <td style={{ padding: "9px 10px" }}>
                      <Badge bg={row.position <= 5 ? "#10B98118" : row.position <= 10 ? "#F59E0B18" : "#EF444418"} color={row.position <= 5 ? "#10B981" : row.position <= 10 ? "#F59E0B" : "#EF4444"}>{row.position.toFixed(1)}</Badge>
                    </td>
                    <td style={{ padding: "9px 10px" }}><TrendIcon trend={row.trend} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Quick Expert Insights */}
          <Card accent="#2563EB">
            <div style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>🏗️</span>
                <span style={{ color: "#2563EB", fontSize: 12, fontWeight: 800 }}>Brian Dean — Skyscraper Check</span>
              </div>
              <div style={{ color: "#AAABB8", fontSize: 12, lineHeight: 1.7 }}>
                „einbauschrank nach maß kosten" Pos. 8.2 → Pos. 1-3 erreichbar.
                Dein Artikel hat Preistabellen die Pos. 1 fehlen. Nächster Schritt: 3-5 Backlinks von Handwerkskammer, IHK, regionalen Medien.
              </div>
            </div>
          </Card>
          <Card accent="#DC2626">
            <div style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>🎯</span>
                <span style={{ color: "#DC2626", fontSize: 12, fontWeight: 800 }}>Jason Barnard — Entity Status</span>
              </div>
              <div style={{ color: "#AAABB8", fontSize: 12, lineHeight: 1.7 }}>
                „Schreinerhelden" hat KEIN Knowledge Panel. Priorität: Wikidata-Eintrag erstellen, Google Business Profile mit Schema Organization verknüpfen, sameAs-Links setzen.
              </div>
            </div>
          </Card>
          <Card accent="#DB2777">
            <div style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>🛡️</span>
                <span style={{ color: "#DB2777", fontSize: 12, fontWeight: 800 }}>Lily Ray — AIO Alert</span>
              </div>
              <div style={{ color: "#AAABB8", fontSize: 12, lineHeight: 1.7 }}>
                Google zeigt AI Overviews für „einbauschrank kosten". Dein Artikel wird NICHT zitiert. Fehlt: FAQ-Schema, Autoren-Byline mit Handwerker-Bio, AggregateRating.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Expert Board ──
function ExpertBoard() {
  const [selected, setSelected] = useState(null);
  const expert = selected !== null ? EXPERTS[selected] : null;

  return (
    <div>
      <div style={{ color: "#8888AA", fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
        8 weltklasse Strategen. Jeder mit einem konkreten Framework das direkt in die Content-Analyse einfließt. Klicke einen Experten für sein vollständiges Audit-Framework.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {EXPERTS.map((e, i) => (
          <Card key={e.id} accent={e.color} hover onClick={() => setSelected(selected === i ? null : i)}>
            <div style={{ padding: "22px 20px" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{e.icon}</div>
              <div style={{ color: e.color, fontSize: 16, fontWeight: 800, marginBottom: 2 }}>{e.name}</div>
              <div style={{ color: "#6B6B9A", fontSize: 11, fontWeight: 600, marginBottom: 10 }}>{e.role}</div>
              <div style={{ color: "#8888AA", fontSize: 11, lineHeight: 1.5, marginBottom: 12 }}>{e.credential}</div>
              <Badge bg={e.color + "15"} color={e.color}>{e.framework}</Badge>
            </div>
          </Card>
        ))}
      </div>

      {expert && (
        <div style={{ marginTop: 24 }}>
          <Card accent={expert.color}>
            <div style={{ padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: expert.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{expert.icon}</div>
                <div>
                  <div style={{ color: expert.color, fontSize: 22, fontWeight: 800 }}>{expert.name}</div>
                  <div style={{ color: "#8888AA", fontSize: 13 }}>{expert.role} — {expert.framework}</div>
                </div>
              </div>
              <div style={{ color: "#CCCCDD", fontSize: 14, lineHeight: 1.8, marginBottom: 24, padding: "14px 18px", background: expert.color + "08", borderRadius: 10, borderLeft: `3px solid ${expert.color}` }}>
                {expert.frameworkDesc}
              </div>

              <h4 style={{ color: "#8888AA", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>
                Audit-Checkliste — {expert.framework}
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {expert.audit.map((item, j) => (
                  <AuditItem key={j} check={item.check} color={expert.color} />
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function AuditItem({ check, color }) {
  const [status, setStatus] = useState("unchecked"); // unchecked, pass, fail, partial
  const statusMap = {
    unchecked: { icon: "○", bg: "#22224A", textColor: "#8888AA" },
    pass: { icon: "✓", bg: "#10B98118", textColor: "#10B981" },
    fail: { icon: "✗", bg: "#EF444418", textColor: "#EF4444" },
    partial: { icon: "◐", bg: "#F59E0B18", textColor: "#F59E0B" },
  };
  const cycle = { unchecked: "pass", pass: "partial", partial: "fail", fail: "unchecked" };
  const s = statusMap[status];

  return (
    <div
      onClick={() => setStatus(cycle[status])}
      style={{
        padding: "12px 16px", background: s.bg, borderRadius: 10, cursor: "pointer",
        border: `1px solid ${s.textColor}20`, display: "flex", alignItems: "center", gap: 10,
        transition: "all 0.15s ease",
      }}
    >
      <span style={{ fontSize: 16, fontWeight: 800, color: s.textColor, width: 20, textAlign: "center" }}>{s.icon}</span>
      <span style={{ color: status === "unchecked" ? "#8888AA" : "#CCCCDD", fontSize: 12, lineHeight: 1.4 }}>{check}</span>
    </div>
  );
}

// ── Site Audit (Expert Frameworks Combined) ──
function SiteAudit() {
  const [activeDomain, setActiveDomain] = useState("sh");
  const d = DOMAINS[activeDomain];

  const auditCategories = [
    { expert: EXPERTS[0], scores: { sh: 72, ims: 45 }, priority: "Backlinks von IHK, Handwerkskammer, regionale Presse" },
    { expert: EXPERTS[1], scores: { sh: 35, ims: 20 }, priority: "FAQ + LocalBusiness Schema implementieren" },
    { expert: EXPERTS[2], scores: { sh: 15, ims: 30 }, priority: "Wikidata-Eintrag + Knowledge Panel aufbauen" },
    { expert: EXPERTS[3], scores: { sh: 55, ims: 40 }, priority: "Autoren-Bio + echte Projektfotos + Bewertungen" },
    { expert: EXPERTS[4], scores: { sh: 25, ims: 20 }, priority: "Zielgruppen-Kanäle identifizieren (SparkToro)" },
    { expert: EXPERTS[5], scores: { sh: 68, ims: 62 }, priority: "Core Web Vitals optimieren, Mobile CTA prüfen" },
    { expert: EXPERTS[6], scores: { sh: 60, ims: 35 }, priority: "Festpreis-Garantie als De-Positioning-Waffe nutzen" },
    { expert: EXPERTS[7], scores: { sh: 50, ims: 30 }, priority: "Marktkategorie schärfen: 'Maßmöbel-Manufaktur' statt 'Schreiner'" },
  ];

  const totalScore = Math.round(auditCategories.reduce((s, a) => s + a.scores[activeDomain], 0) / auditCategories.length);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {Object.values(DOMAINS).map(dom => (
          <button key={dom.id} onClick={() => setActiveDomain(dom.id)} style={{
            padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700,
            background: activeDomain === dom.id ? dom.color + "15" : "transparent",
            border: `1px solid ${activeDomain === dom.id ? dom.color + "40" : "#22224A"}`,
            color: activeDomain === dom.id ? dom.color : "#6B6B9A",
          }}>{dom.icon} {dom.name}</button>
        ))}
      </div>

      {/* Total Score */}
      <Card accent={d.color} style={{ marginBottom: 24 }}>
        <div style={{ padding: "28px 32px", display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ position: "relative", width: 100, height: 100 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#22224A" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={totalScore > 60 ? "#10B981" : totalScore > 40 ? "#F59E0B" : "#EF4444"} strokeWidth="8"
                strokeDasharray={`${totalScore * 2.64} ${264 - totalScore * 2.64}`} strokeDashoffset="66" strokeLinecap="round" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "#EDEDF5", fontFamily: "'Space Mono', monospace" }}>{totalScore}</span>
              <span style={{ fontSize: 9, color: "#6B6B9A", fontWeight: 700 }}>/ 100</span>
            </div>
          </div>
          <div>
            <h2 style={{ color: "#EDEDF5", fontSize: 20, fontWeight: 800, margin: 0 }}>Gesamt-Score: {d.domain}</h2>
            <div style={{ color: "#8888AA", fontSize: 13, marginTop: 4 }}>
              Durchschnitt aller 8 Expert-Frameworks. {totalScore < 50 ? "Erhebliches Optimierungspotenzial." : totalScore < 70 ? "Solide Basis, gezielte Optimierungen nötig." : "Gute Ausgangslage."}
            </div>
          </div>
        </div>
      </Card>

      {/* Per-Expert Scores */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {auditCategories.map((cat, i) => {
          const score = cat.scores[activeDomain];
          return (
            <Card key={i} accent={cat.expert.color}>
              <div style={{ padding: "16px 24px", display: "grid", gridTemplateColumns: "250px 1fr 200px", alignItems: "center", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 22 }}>{cat.expert.icon}</span>
                  <div>
                    <div style={{ color: cat.expert.color, fontSize: 13, fontWeight: 800 }}>{cat.expert.name}</div>
                    <div style={{ color: "#6B6B9A", fontSize: 11 }}>{cat.expert.framework}</div>
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1, height: 8, background: "#22224A", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{
                        width: `${score}%`, height: "100%", borderRadius: 4,
                        background: score > 60 ? `linear-gradient(90deg, ${cat.expert.color}88, ${cat.expert.color})` : score > 35 ? `linear-gradient(90deg, #F59E0B88, #F59E0B)` : `linear-gradient(90deg, #EF444488, #EF4444)`,
                        transition: "width 0.5s ease",
                      }} />
                    </div>
                    <span style={{ color: "#EDEDF5", fontSize: 16, fontWeight: 800, fontFamily: "'Space Mono', monospace", minWidth: 36 }}>{score}</span>
                  </div>
                  <div style={{ color: "#8888AA", fontSize: 11, marginTop: 6 }}>Priorität: {cat.priority}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Badge bg={score > 60 ? "#10B98115" : score > 35 ? "#F59E0B15" : "#EF444415"} color={score > 60 ? "#10B981" : score > 35 ? "#F59E0B" : "#EF4444"}>
                    {score > 60 ? "GUT" : score > 35 ? "OPTIMIEREN" : "KRITISCH"}
                  </Badge>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ── Territory View ──
function TerritoryView() {
  const territories = [
    { cluster: "Einbauschrank nach Maß", owner: "sh", kws: 4, vol: 4190, status: "1 live" },
    { cluster: "Dachschrägenschrank", owner: "sh", kws: 4, vol: 1850, status: "prio" },
    { cluster: "Ankleide / Walk-in", owner: "sh", kws: 3, vol: 2530, status: "geplant" },
    { cluster: "Schreiner vs. Industrie", owner: "sh", kws: 3, vol: 1310, status: "geplant" },
    { cluster: "Maßküche", owner: "ims", kws: 4, vol: 2130, status: "geplant" },
    { cluster: "Holztreppe", owner: "ims", kws: 3, vol: 1010, status: "geplant" },
    { cluster: "Innenausbau B2B", owner: "ims", kws: 5, vol: 980, status: "prio" },
    { cluster: "Lokal (Ortsseiten)", owner: "both", kws: 5, vol: 900, status: "prio" },
  ];

  return (
    <div>
      <Card accent="#F59E0B" style={{ marginBottom: 24 }}>
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 22 }}>♟️</span>
            <span style={{ color: "#D97706", fontSize: 14, fontWeight: 800 }}>Todd Irwin — De-Positioning Regel</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center" }}>
            <div style={{ padding: 16, background: DOMAINS.sh.color + "08", borderRadius: 10, border: `1px solid ${DOMAINS.sh.color}15` }}>
              <div style={{ color: DOMAINS.sh.color, fontSize: 12, fontWeight: 800, marginBottom: 6 }}>🔶 Schreinerhelden = PRODUKT-MARKE</div>
              <div style={{ color: "#AAABB8", fontSize: 12, lineHeight: 1.6 }}>„Was bekomme ich?" — Einbauschrank, Ankleide, Dachschräge. Festpreis. Ergebnis-orientiert. Regional.</div>
            </div>
            <div style={{ fontSize: 28, color: "#F59E0B", fontWeight: 900 }}>≠</div>
            <div style={{ padding: 16, background: DOMAINS.ims.color + "08", borderRadius: 10, border: `1px solid ${DOMAINS.ims.color}15` }}>
              <div style={{ color: DOMAINS.ims.color, fontSize: 12, fontWeight: 800, marginBottom: 6 }}>🟢 Ihr Möbel-Schreiner = WERKSTATT-MARKE</div>
              <div style={{ color: "#AAABB8", fontSize: 12, lineHeight: 1.6 }}>„Wer macht es?" — Schreinerei, Partner, Kompetenz. Prozess-orientiert. Kern-Lokal.</div>
            </div>
          </div>
        </div>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {territories.map((t, i) => {
          const d = t.owner === "both" ? null : DOMAINS[t.owner];
          return (
            <Card key={i} accent={d ? d.color : "#F59E0B"}>
              <div style={{ padding: "14px 24px", display: "grid", gridTemplateColumns: "220px 100px 80px 80px 1fr", alignItems: "center", gap: 16 }}>
                <span style={{ color: "#EDEDF5", fontSize: 14, fontWeight: 700 }}>{t.cluster}</span>
                <div>{t.owner === "both" ? <><DomainPill id="sh" /> <DomainPill id="ims" /></> : <DomainPill id={t.owner} />}</div>
                <span style={{ color: "#8888AA", fontSize: 12 }}>{t.kws} KWs</span>
                <span style={{ color: "#EDEDF5", fontSize: 13, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>{t.vol.toLocaleString()}</span>
                <div style={{ textAlign: "right" }}>
                  <Badge bg={t.status === "prio" ? "#EF444415" : t.status.includes("live") ? "#10B98115" : "#3B82F615"} color={t.status === "prio" ? "#EF4444" : t.status.includes("live") ? "#10B981" : "#3B82F6"}>
                    {t.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ── Cannibalization View ──
function CannibalView() {
  const risks = [
    { kw: "schreiner murrhardt", risk: "hoch", sh: "/schreiner-region-stuttgart/", ims: "/schreinerei-murrhardt/", solution: "IMS = lokale Werkstatt-Seite (NAP + Leistungen). SH = Murrhardt nur als Standort im Einzugsgebiet-Kontext. Nie eigene LP.", expert: "barnard" },
    { kw: "schreiner backnang", risk: "hoch", sh: "Nur erwähnt in /region-stuttgart/", ims: "/schreinerei-backnang/", solution: "Dedizierte Ortsseite nur auf IMS. SH erwähnt Backnang nur als Einzugsgebiet.", expert: "king" },
    { kw: "einbauschrank nach maß", risk: "mittel", sh: "/einbauschrank-nach-mass-kosten/", ims: "–", solution: "Komplett SH. IMS zeigt Einbauschränke nur in Referenz-Galerie (noindex).", expert: "dean" },
    { kw: "küche vom schreiner", risk: "mittel", sh: "–", ims: "/kueche-vom-schreiner/", solution: "Komplett IMS. SH erwähnt Küchen nicht als eigenes Thema.", expert: "krum" },
    { kw: "innenausbau", risk: "mittel", sh: "–", ims: "/innenausbau-gewerbe/", solution: "IMS = B2B Innenausbau (Objekt). SH nutzt nie 'Innenausbau' als H1.", expert: "fishkin" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {risks.map((r, i) => {
        const expert = EXPERTS.find(e => e.id === r.expert);
        return (
          <Card key={i} accent={r.risk === "hoch" ? "#EF4444" : "#F59E0B"}>
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <Badge bg={r.risk === "hoch" ? "#EF444418" : "#F59E0B18"} color={r.risk === "hoch" ? "#EF4444" : "#F59E0B"}>{r.risk.toUpperCase()}</Badge>
                <span style={{ color: "#EDEDF5", fontSize: 14, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>„{r.kw}"</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 14, marginBottom: 14, alignItems: "center" }}>
                <div style={{ padding: "10px 14px", background: "#E8490F08", borderRadius: 8, border: "1px solid #E8490F15" }}>
                  <div style={{ color: "#E8490F", fontSize: 10, fontWeight: 700 }}>🔶 SH</div>
                  <div style={{ color: "#AAABB8", fontSize: 12, fontFamily: "'Space Mono', monospace", marginTop: 2 }}>{r.sh}</div>
                </div>
                <span style={{ color: "#EF4444", fontSize: 18 }}>⚡</span>
                <div style={{ padding: "10px 14px", background: "#1B7A5208", borderRadius: 8, border: "1px solid #1B7A5215" }}>
                  <div style={{ color: "#1B7A52", fontSize: 10, fontWeight: 700 }}>🟢 IMS</div>
                  <div style={{ color: "#AAABB8", fontSize: 12, fontFamily: "'Space Mono', monospace", marginTop: 2 }}>{r.ims}</div>
                </div>
              </div>
              <div style={{ padding: "12px 16px", background: expert.color + "08", borderRadius: 8, borderLeft: `3px solid ${expert.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 14 }}>{expert.icon}</span>
                  <span style={{ color: expert.color, fontSize: 11, fontWeight: 800 }}>{expert.name}</span>
                </div>
                <div style={{ color: "#CCCCDD", fontSize: 12, lineHeight: 1.7 }}>{r.solution}</div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ── Content Plan ──
function ContentPlan() {
  const [domain, setDomain] = useState("sh");
  const plans = {
    sh: [
      { id: 1, title: "Einbauschrank nach Maß Kosten 2025", kw: "einbauschrank nach maß kosten", vol: 2400, pos: 8.2, status: "live", funnel: "ToFu", expert: "dean" },
      { id: 10, title: "Aufmaß-Termin buchen", kw: "schreiner aufmaß murrhardt", vol: 40, pos: null, status: "prio", funnel: "BoFu", expert: "irwin" },
      { id: 7, title: "Einbauschrank Dachschräge", kw: "einbauschrank dachschräge", vol: 720, pos: 12.4, status: "prio", funnel: "MoFu", expert: "ray" },
      { id: 2, title: "Ankleide planen", kw: "ankleide planen", vol: 1900, pos: 15.7, status: "geplant", funnel: "MoFu", expert: "dunford" },
      { id: 6, title: "Schreiner vs. IKEA PAX", kw: "schreiner vs ikea", vol: 880, pos: 18.3, status: "geplant", funnel: "MoFu", expert: "fishkin" },
      { id: 3, title: "Schreiner Region Stuttgart", kw: "schreiner region stuttgart", vol: 390, pos: null, status: "geplant", funnel: "BoFu", expert: "barnard" },
    ],
    ims: [
      { id: 102, title: "Innenausbau für Bauträger & Architekten", kw: "innenausbau gewerbe schreiner", vol: 320, pos: 14.2, status: "prio", funnel: "MoFu", expert: "irwin" },
      { id: 104, title: "Schreinerei Murrhardt", kw: "schreinerei murrhardt", vol: 170, pos: 2.4, status: "prio", funnel: "BoFu", expert: "barnard" },
      { id: 101, title: "Maßküche vom Schreiner", kw: "küche vom schreiner", vol: 1300, pos: 19.1, status: "geplant", funnel: "MoFu", expert: "dean" },
      { id: 103, title: "Holztreppe vom Schreiner", kw: "holztreppe vom schreiner", vol: 480, pos: null, status: "geplant", funnel: "MoFu", expert: "king" },
      { id: 106, title: "Schreiner für Architekten", kw: "schreiner für architekten", vol: 140, pos: 8.7, status: "geplant", funnel: "BoFu", expert: "dunford" },
    ],
  };
  const d = DOMAINS[domain];
  const items = plans[domain];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {Object.values(DOMAINS).map(dom => (
          <button key={dom.id} onClick={() => setDomain(dom.id)} style={{
            padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700,
            background: domain === dom.id ? dom.color + "15" : "transparent",
            border: `1px solid ${domain === dom.id ? dom.color + "40" : "#22224A"}`,
            color: domain === dom.id ? dom.color : "#6B6B9A",
          }}>{dom.icon} {dom.name} ({plans[dom.id].length})</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map(art => {
          const expert = EXPERTS.find(e => e.id === art.expert);
          return (
            <Card key={art.id} accent={art.status === "live" ? "#10B981" : art.status === "prio" ? "#EF4444" : "#3B82F6"}>
              <div style={{ padding: "14px 24px", display: "grid", gridTemplateColumns: "50px 1fr 90px 60px 70px 60px 120px", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#6B6B9A", fontSize: 12, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>#{art.id}</span>
                <div>
                  <div style={{ color: "#EDEDF5", fontSize: 13, fontWeight: 700 }}>{art.title}</div>
                  <div style={{ color: "#6B6B9A", fontSize: 11, fontFamily: "'Space Mono', monospace" }}>{art.kw}</div>
                </div>
                <span style={{ color: "#EDEDF5", fontSize: 12, fontWeight: 700 }}>{art.vol.toLocaleString()} <span style={{ color: "#6B6B9A", fontWeight: 400 }}>vol</span></span>
                {art.pos ? (
                  <Badge bg={art.pos <= 5 ? "#10B98115" : art.pos <= 10 ? "#F59E0B15" : "#EF444415"} color={art.pos <= 5 ? "#10B981" : art.pos <= 10 ? "#F59E0B" : "#EF4444"}>
                    {art.pos.toFixed(1)}
                  </Badge>
                ) : <span style={{ color: "#6B6B9A", fontSize: 11 }}>—</span>}
                <Badge bg="#22224A" color="#8888AA">{art.funnel}</Badge>
                <Badge bg={art.status === "live" ? "#10B98115" : art.status === "prio" ? "#EF444415" : "#3B82F615"} color={art.status === "live" ? "#10B981" : art.status === "prio" ? "#EF4444" : "#3B82F6"}>
                  {art.status.toUpperCase()}
                </Badge>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 12 }}>{expert.icon}</span>
                  <span style={{ color: expert.color, fontSize: 10, fontWeight: 700 }}>{expert.name.split(" ")[1]}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ── API Hub ──
function ApiHub() {
  return (
    <div>
      <div style={{ color: "#8888AA", fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
        Alle APIs aktiv. Das Backend verbindet GSC, GA4, GBP, PageSpeed, Indexing API, DataForSEO, ChatGPT und Claude zu einer einheitlichen Datenpipeline.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {API_SERVICES.map(api => (
          <Card key={api.id} accent="#10B981">
            <div style={{ padding: "20px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{api.icon}</span>
                  <div>
                    <div style={{ color: "#EDEDF5", fontSize: 14, fontWeight: 700 }}>{api.name}</div>
                    <div style={{ color: "#6B6B9A", fontSize: 11 }}>{api.desc}</div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: "#6B6B9A", fontSize: 10, fontFamily: "'Space Mono', monospace" }}>{api.endpoint}</span>
                <Badge bg="#10B98115" color="#10B981">● AKTIV</Badge>
              </div>
              <div style={{ marginTop: 10, display: "flex", gap: 4, flexWrap: "wrap" }}>
                {api.scopes.map((s, i) => (
                  <span key={i} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#22224A", color: "#8888AA" }}>{s}</span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card accent="#7C3AED" style={{ marginTop: 24 }}>
        <div style={{ padding: "24px 28px" }}>
          <h3 style={{ color: "#EDEDF5", fontSize: 16, fontWeight: 800, margin: "0 0 16px" }}>⚙️ Datenpipeline-Architektur</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            <div>
              <div style={{ color: "#3B82F6", fontSize: 11, fontWeight: 800, letterSpacing: 1, marginBottom: 8 }}>INPUT</div>
              {["GSC → Rankings, Queries", "GA4 → Traffic, Conversions", "GBP → Lokale Impressionen", "DataForSEO → KW Volumen, SERP", "PSI → Core Web Vitals"].map((t, i) => (
                <div key={i} style={{ color: "#AAABB8", fontSize: 11, padding: "4px 0", borderBottom: "1px solid #1A1A30" }}>{t}</div>
              ))}
            </div>
            <div>
              <div style={{ color: "#7C3AED", fontSize: 11, fontWeight: 800, letterSpacing: 1, marginBottom: 8 }}>PROCESSING</div>
              {["Claude → Expert-Audit Scoring", "ChatGPT → Longtail-Generierung", "Claude → E-E-A-T Analyse", "Claude → Entity-Mapping", "ChatGPT → Competitor Gap Check"].map((t, i) => (
                <div key={i} style={{ color: "#AAABB8", fontSize: 11, padding: "4px 0", borderBottom: "1px solid #1A1A30" }}>{t}</div>
              ))}
            </div>
            <div>
              <div style={{ color: "#10B981", fontSize: 11, fontWeight: 800, letterSpacing: 1, marginBottom: 8 }}>OUTPUT</div>
              {["Expert-Score pro Artikel", "Keyword-Territorien mit Owner", "Kannibalisierungs-Alerts", "Content-Briefings mit Framework", "Indexing-Trigger für neue Seiten"].map((t, i) => (
                <div key={i} style={{ color: "#AAABB8", fontSize: 11, padding: "4px 0", borderBottom: "1px solid #1A1A30" }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ═══════ MAIN APP ═══════
export default function SEOCommandCenterV3() {
  const [activeTab, setActiveTab] = useState("command");
  const [collapsed, setCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "command": return <CommandCenter />;
      case "experts": return <ExpertBoard />;
      case "audit": return <SiteAudit />;
      case "territories": return <TerritoryView />;
      case "cannibal": return <CannibalView />;
      case "content": return <ContentPlan />;
      case "apis": return <ApiHub />;
      default: return <CommandCenter />;
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0A0A1B", color: "#EDEDF5",
      fontFamily: "'Onest', -apple-system, sans-serif",
      display: "flex",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <div style={{
        width: collapsed ? 56 : 260, background: "#0E0E22",
        borderRight: "1px solid #1E1E3E", transition: "width 0.25s ease",
        display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden",
      }}>
        <div onClick={() => setCollapsed(!collapsed)} style={{
          padding: collapsed ? "18px 12px" : "18px 20px", borderBottom: "1px solid #1E1E3E",
          cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg, #E8490F 0%, #1B7A52 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 900, color: "white", boxShadow: "0 4px 12px rgba(232,73,15,0.3)",
          }}>⚡</div>
          {!collapsed && (
            <div>
              <div style={{ color: "#EDEDF5", fontSize: 15, fontWeight: 800, lineHeight: 1.1 }}>SEO Command</div>
              <div style={{ color: "#6B6B9A", fontSize: 10, fontWeight: 600, letterSpacing: 1 }}>V3 · DUAL DOMAIN · 8 EXPERTS</div>
            </div>
          )}
        </div>

        {!collapsed && (
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #1E1E3E" }}>
            {Object.values(DOMAINS).map(d => (
              <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: d.color, boxShadow: `0 0 8px ${d.color}44` }} />
                <span style={{ color: "#8888AA", fontSize: 11 }}>{d.domain}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ padding: "10px 8px", flex: 1 }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: collapsed ? "10px 8px" : "10px 14px",
              background: activeTab === tab.id ? "#EDEDF508" : "transparent",
              border: activeTab === tab.id ? "1px solid #EDEDF512" : "1px solid transparent",
              borderRadius: 8, cursor: "pointer", marginBottom: 2,
              justifyContent: collapsed ? "center" : "flex-start",
            }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>{tab.icon}</span>
              {!collapsed && <span style={{ color: activeTab === tab.id ? "#EDEDF5" : tab.id === "cannibal" ? "#F59E0B" : "#6B6B9A", fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 500 }}>{tab.label}</span>}
            </button>
          ))}
        </div>

        {!collapsed && (
          <div style={{ padding: "14px 20px", borderTop: "1px solid #1E1E3E" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {EXPERTS.map(e => (
                <div key={e.id} title={e.name} style={{
                  width: 24, height: 24, borderRadius: 6, background: e.color + "20",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11,
                  border: `1px solid ${e.color}30`,
                }}>{e.icon}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <div style={{
          padding: "14px 32px", borderBottom: "1px solid #1E1E3E",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "#0C0C20",
        }}>
          <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
            {TABS.find(t => t.id === activeTab)?.icon} {TABS.find(t => t.id === activeTab)?.label}
          </h1>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Badge bg="#10B98115" color="#10B981">9 APIs AKTIV</Badge>
            <Badge bg="#7C3AED15" color="#7C3AED">8 EXPERTS</Badge>
          </div>
        </div>
        <div style={{ padding: 32 }}>{renderContent()}</div>
      </div>
    </div>
  );
}
