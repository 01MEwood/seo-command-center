# SEO Command Center v3
## Schreinerhelden × Ihr Möbel-Schreiner

Dual-Domain SEO/AIO/GEO Tool mit 8 Weltklasse-Experten-Frameworks und 9 API-Integrationen.

---

## Architektur

```
┌─────────────────────────────────────────────────┐
│                   Nginx (SSL)                    │
│              seo.schreinerhelden.de              │
├────────────────────┬────────────────────────────┤
│   /  → Frontend    │   /api → Backend           │
│   (React + Vite)   │   (Node.js + Express)      │
│   Port 3000        │   Port 4000                │
└────────────────────┴────────────┬───────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │      PostgreSQL 16          │
                    │   Keywords, Articles,       │
                    │   GSC Data, Audit Scores    │
                    └─────────────────────────────┘
```

## Voraussetzungen

- Hostinger VPS mit Ubuntu 22.04+
- Docker + Docker Compose
- Domain `seo.meosapp.de` auf VPS-IP zeigend
- Google Cloud Projekt mit aktivierten APIs
- DataForSEO Account
- OpenAI + Anthropic API Keys

---

## Deployment in 5 Schritten

### 1. Projekt auf VPS hochladen

```bash
# Option A: Per SCP vom lokalen Rechner
scp -r seo-command-center/ root@DEINE-VPS-IP:/opt/

# Option B: Per Git
ssh root@DEINE-VPS-IP
cd /opt
git clone https://dein-repo/seo-command-center.git
```

### 2. DNS konfigurieren

A-Record setzen bei Hostinger:
```
seo.meosapp.de → DEINE-VPS-IP
```

### 3. Environment einrichten

```bash
cd /opt/seo-command-center
cp .env.example .env
nano .env  # Alle Werte ausfüllen
```

### 4. Google APIs aktivieren

In der Google Cloud Console (console.cloud.google.com):

1. **Projekt** erstellen oder bestehendes verwenden
2. **APIs aktivieren:**
   - Search Console API
   - Google Analytics Data API
   - My Business Business Information API
   - Google Ads API
   - PageSpeed Insights API
   - Indexing API
3. **OAuth 2.0 Client** erstellen (Typ: Web Application)
4. **Refresh Token** generieren mit dem OAuth Playground:
   - https://developers.google.com/oauthplayground/
   - Scopes auswählen → Authorize → Exchange Code → Refresh Token kopieren

### 5. Deployen

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Nach dem Deployment

### Logs prüfen
```bash
docker compose logs -f           # Alle Container
docker compose logs -f backend   # Nur Backend
docker compose logs -f db        # Nur Datenbank
```

### Container verwalten
```bash
docker compose ps        # Status
docker compose restart   # Neustart
docker compose down      # Stoppen
docker compose up -d     # Starten
```

### Datenbank
```bash
# Prisma Studio (GUI)
docker compose exec backend npx prisma studio

# SQL direkt
docker compose exec db psql -U seoadmin -d seo_command
```

### Update deployen
```bash
git pull  # oder neue Dateien hochladen
docker compose build --no-cache
docker compose up -d
docker compose exec backend npx prisma db push
```

---

## API Endpunkte

| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| GET | `/api/health` | Health Check |
| GET | `/api/gsc/:domain` | GSC Daten (live) |
| GET | `/api/gsc/:domain/pages` | GSC nach Seiten |
| GET | `/api/pagespeed/:url` | Core Web Vitals |
| POST | `/api/indexing/request` | Seite indexieren lassen |
| POST | `/api/dataforseo/keywords` | Keyword-Recherche |
| POST | `/api/dataforseo/serp` | SERP-Analyse |
| POST | `/api/dataforseo/backlinks` | Backlink-Check |
| POST | `/api/ai/expert-audit` | KI Expert-Analyse |
| POST | `/api/ai/longtails` | Longtail-Generierung |
| GET | `/api/keywords` | Keywords abrufen |
| GET | `/api/articles` | Artikel-Plan |
| GET | `/api/competitors` | Wettbewerber |
| GET | `/api/cannibalization` | Risiken |

---

## Expert Board

| Expert | Framework | Funktion |
|--------|----------|----------|
| 🏗️ Brian Dean | Skyscraper-Score | Content-Qualität vs. Pos. 1 |
| ⚙️ Mike King | Schema-Readiness | AI-Parsbarkeit |
| 🎯 Jason Barnard | Entity-Mapping | Markenerkennung |
| 🛡️ Lily Ray | E-E-A-T Audit | Trust-Signale |
| 🔍 Rand Fishkin | Audience-Overlap | Zielgruppen-Kanäle |
| 📱 Cindy Krum | Mobile-Entity | Mobile + Entitäten |
| ♟️ Todd Irwin | De-Positioning | Marktdominanz |
| 💎 April Dunford | Positioning-Canvas | Kategorie-Ownership |
