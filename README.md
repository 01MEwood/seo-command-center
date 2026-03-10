# SEO Command Center v5.0

**Schreinerhelden GmbH & Co. KG** — seo.meosapp.de

Analyse · Content · Tracking — Ein scharfes SEO-Werkzeug.

## Was ist das?

Ein Tool zum:
1. **Analysieren** — Keyword + Region → TOP 10 Wettbewerber, Suchvolumen, Longtails, AEO-Fragen
2. **Bauen** — GPT-4o generiert SEO-optimierte Artikel für Position 1
3. **Tracken** — Position-Monitoring über Zeit

## Stack

- **Frontend:** React + Vite + Tailwind (Outfit Font)
- **Backend:** Express + Prisma + PostgreSQL
- **APIs:** DataForSEO, OpenAI GPT-4o, Google Search Console
- **Deploy:** Docker Hub → Hostinger VPS (GitHub Actions CI/CD)

## Architektur (v5.0 vs v4.1)

| | v4.1 | v5.0 |
|---|---|---|
| Frontend | 1.157 Zeilen in einer Datei | 6 Module, 8 Components, Services-Layer |
| API Keys | Im Browser (localStorage) | Serverseitig (.env) |
| Backend | 670 Zeilen in einer Datei | 10 Route-Dateien, 4 Services |
| Wettbewerber | GPT-only (Halluzination) | DataForSEO SERP + Volume + Backlinks |
| Tracking | Nicht vorhanden | Position-Snapshots über Zeit |
| Tabs | 11 (davon 5 Placeholder) | 6 (alle funktional) |

## Module

| Tab | Funktion |
|---|---|
| **Dashboard** | KPIs, System-Status, letzte Analysen |
| **Analyse** | Keyword+Region → SERP → Volume → Longtails → AEO → Content |
| **Keywords** | Recherche (DataForSEO), Longtails (GPT-4o), GSC Live |
| **Content** | SEO-Artikel generieren |
| **Tracking** | Position-Monitoring mit Sparkline-Charts |
| **Settings** | System-Status, Service-Health |

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

Push auf `main` → GitHub Actions baut Docker Images → Deploy auf Hostinger VPS.

```bash
# Manuell (falls nötig)
docker build -t memario/seo-command-center-backend:latest ./backend
docker build -t memario/seo-command-center-frontend:latest ./frontend
docker push memario/seo-command-center-backend:latest
docker push memario/seo-command-center-frontend:latest
```

## Datenbank-Modelle

- **PipelineRun** — Eine Analyse (Keyword+Region)
- **SerpResult** — SERP-Position eines Wettbewerbers
- **TrackedKeyword** — Keyword im Position-Monitoring
- **PositionSnapshot** — Täglicher Positions-Check
- **GscDataPoint** — GSC-Daten (automatisch via Cron)
