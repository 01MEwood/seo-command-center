# SEO Command Center v5.5

**Schreinerhelden GmbH & Co. KG** — seo.meosapp.de

Analyse · Diagnose · Content · Tracking — Ein scharfes SEO-Werkzeug.

## Was ist das?

Ein Tool zum:
1. **Analysieren** — Keyword + Region → TOP 10 Wettbewerber, Suchvolumen, Longtails, AEO-Fragen
2. **Diagnostizieren** — Wettbewerber-Analyse mit SERP + Backlinks + GPT-4o Diagnose
3. **Bauen** — HTML Landing Pages, Markdown-Artikel, Social Content (GBP, Instagram, Pinterest, Blog)
4. **Tracken** — Position-Monitoring über Zeit
5. **Prompts anpassen** — Alle AI-Prompts live im Browser bearbeiten

## Stack

- **Frontend:** React + Vite + Tailwind
- **Backend:** Express + Prisma + PostgreSQL
- **APIs:** DataForSEO, OpenAI GPT-4o, Google Search Console, PageSpeed, Indexing API
- **Deploy:** Docker Hub → Hostinger VPS

## Module

| Tab | Funktion |
|---|---|
| **Dashboard** | KPIs, System-Status, letzte Analysen |
| **Analyse** | Keyword+Region → SERP → Volume → Longtails → AEO → Content |
| **Diagnose** | Wettbewerber-Diagnose (SEO/AEO/GEO Scores) |
| **Citations** | AI-Suchmaschinen Monitoring (ChatGPT/Perplexity/Gemini) |
| **Keywords** | Recherche (DataForSEO), Longtails (GPT-4o), GSC Live |
| **Content** | Landing Pages, Social Multiplier, Artikel, **Prompt Editor** |
| **Tracking** | Position-Monitoring mit Sparkline-Charts |
| **Settings** | System-Status, Service-Health, User-Verwaltung |

## v5.5 Änderungen

- **Prompt Editor** — Alle System-Prompts direkt im Content-Tab bearbeitbar (DB-gespeichert, mit Reset-Funktion)
- **Handlungsanweisung** — Wenn ein Keyword nicht in TOP 10 gefunden wird, zeigt die App einen konkreten 5-Schritte-Fahrplan
- **DB-Migration Fix** — Sichere Migration-Strategie (`prisma migrate deploy` mit Fallback)

## ⚠️ WICHTIG: Tracking-Daten behalten

Tracking-Daten liegen in der PostgreSQL-Datenbank im Docker Volume `seo_pgdata`.

**NIEMALS** `docker-compose down -v` verwenden! Das `-v` Flag löscht ALLE Volumes inkl. Datenbank!

Stattdessen:
```bash
# Container stoppen/updaten (Daten bleiben erhalten):
docker-compose down          # ← OHNE -v !
docker-compose pull
docker-compose up -d

# DB-Backup machen (empfohlen vor jedem Update):
docker-compose exec db pg_dump -U seoadmin seo_command > backup_$(date +%Y%m%d).sql

# DB-Backup wiederherstellen:
cat backup_20250310.sql | docker-compose exec -T db psql -U seoadmin seo_command
```

## Setup (Lokal)

```bash
# Backend
cd backend
cp ../.env.example .env  # Keys eintragen!
npm install
npx prisma db push
npm run dev

# Frontend (neues Terminal)
cd frontend
npm install
npm run dev
```

→ http://localhost:3000 (Login: admin / schreinerhelden2026)

## Deploy (Produktion)

```bash
# 1. Build & Push
docker build -t memario/seo-command-center-backend:latest ./backend
docker build -t memario/seo-command-center-frontend:latest ./frontend
docker push memario/seo-command-center-backend:latest
docker push memario/seo-command-center-frontend:latest

# 2. Auf dem VPS
ssh root@31.97.122.6
cd /opt/seo-command-center   # oder wo docker-compose.yml liegt
docker-compose exec db pg_dump -U seoadmin seo_command > backup_pre_update.sql  # BACKUP!
docker-compose down           # OHNE -v !!
docker-compose pull
docker-compose up -d
docker-compose logs -f
```

## Datenbank-Modelle

- **PipelineRun** — Eine Analyse (Keyword+Region)
- **SerpResult** — SERP-Position eines Wettbewerbers
- **TrackedKeyword** — Keyword im Position-Monitoring
- **PositionSnapshot** — Täglicher Positions-Check
- **GscDataPoint** — GSC-Daten (automatisch via Cron)
- **PromptOverride** — Angepasste AI-Prompts (Prompt Editor)
- **CitationQuery / CitationCheck** — AI-Suchmaschinen Monitoring
