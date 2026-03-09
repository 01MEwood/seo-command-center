# SEO Command Center v4.1
## Schreinerhelden × Ihr Möbel-Schreiner

Dual-Domain SEO/AEO/GEO Tool mit 8 Weltklasse-Experten-Frameworks und 9 API-Integrationen.

**Live:** https://seo.meosapp.de

---

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + Recharts
- **Backend:** Node.js + Express + Prisma ORM
- **Database:** PostgreSQL 16
- **Infra:** Docker + Traefik + Hostinger VPS

## APIs

| API | Funktion |
|-----|----------|
| Google Search Console | Live-Daten, täglicher Cron |
| PageSpeed Insights | Core Web Vitals |
| Google Indexing API | Seiten indexieren |
| DataForSEO | Keywords, SERP, Backlinks |
| OpenAI (GPT-4o) | Longtails, Content Studio |
| Anthropic (Claude) | Expert Audits (8 Frameworks) |

## Deployment

### 1. Build & Push (Windows)

```bash
bash build-and-push.sh
```

### 2. Deploy (VPS)

```bash
ssh root@31.97.122.6
cd /opt/seo-command-center
# Erstmalig: cp .env.example .env && nano .env
bash deploy.sh
```

### DNS

A-Record: `seo.meosapp.de` → `31.97.122.6` (bereits gesetzt)

---

## API Endpunkte

| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| GET | `/api/health` | Health Check + DB Status |
| GET | `/api/domains` | Domains (auto-seed) |
| GET | `/api/gsc/:domain` | GSC Daten (live) |
| GET | `/api/gsc/:domain/pages` | GSC nach Seiten |
| GET | `/api/pagespeed/:url` | Core Web Vitals |
| POST | `/api/indexing/request` | Seite indexieren |
| POST | `/api/dataforseo/keywords` | Keyword-Recherche |
| POST | `/api/dataforseo/serp` | SERP-Analyse |
| POST | `/api/dataforseo/backlinks` | Backlink-Check |
| POST | `/api/ai/expert-audit` | KI Expert-Analyse (Claude) |
| POST | `/api/ai/longtails` | Longtail-Generierung (GPT-4o) |
| POST | `/api/ai/content` | Content-Generierung (GPT-4o) |
| GET | `/api/keywords` | Keywords CRUD |
| GET | `/api/articles` | Artikel-Plan |
| GET | `/api/competitors` | Wettbewerber |
| GET | `/api/cannibalization` | Kannibalisierungs-Risiken |
| GET | `/api/audits/:domainId` | Audit-Scores |

## Docker Hub

- `mariodocker/seo-command-center-frontend:latest`
- `mariodocker/seo-command-center-backend:latest`
