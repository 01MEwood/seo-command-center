#!/bin/bash
# ═══════════════════════════════════════════════════════════
# SEO COMMAND CENTER — Deploy auf Hostinger VPS
# Schreinerhelden × Ihr Möbel-Schreiner
# ═══════════════════════════════════════════════════════════

set -e

echo "═══════════════════════════════════════════"
echo "  SEO Command Center — Deployment"
echo "═══════════════════════════════════════════"

# ── Schritt 1: System vorbereiten ──
echo ""
echo "▸ [1/7] System aktualisieren..."
sudo apt update && sudo apt upgrade -y

# ── Schritt 2: Docker installieren (falls nicht vorhanden) ──
echo "▸ [2/7] Docker prüfen..."
if ! command -v docker &> /dev/null; then
    echo "  Docker installieren..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "  ✓ Docker installiert"
fi

if ! command -v docker compose &> /dev/null; then
    echo "  Docker Compose Plugin installieren..."
    sudo apt install -y docker-compose-plugin
fi

echo "  Docker: $(docker --version)"
echo "  Compose: $(docker compose version)"

# ── Schritt 3: Projektverzeichnis ──
echo "▸ [3/7] Projekt einrichten..."
PROJECT_DIR="/opt/seo-command-center"
sudo mkdir -p $PROJECT_DIR
sudo chown $USER:$USER $PROJECT_DIR

# Falls Git-Repo: git clone ... $PROJECT_DIR
# Alternativ: Dateien per SCP hochladen (siehe unten)

cd $PROJECT_DIR

# ── Schritt 4: .env Datei prüfen ──
echo "▸ [4/7] Environment prüfen..."
if [ ! -f .env ]; then
    echo "  ⚠️  .env Datei fehlt!"
    echo "  Kopiere .env.example → .env und fülle die Werte aus:"
    echo "  cp .env.example .env"
    echo "  nano .env"
    echo ""
    echo "  Dann starte dieses Script erneut."
    exit 1
fi
echo "  ✓ .env vorhanden"

# ── Schritt 5: SSL Zertifikat (Let's Encrypt) ──
echo "▸ [5/7] SSL prüfen..."
DOMAIN="seo.meosapp.de"

if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    echo "  SSL Zertifikat erstellen..."
    sudo apt install -y certbot
    sudo certbot certonly --standalone -d $DOMAIN --agree-tos --email mario@meosapp.de --non-interactive
    echo "  ✓ SSL Zertifikat erstellt"
else
    echo "  ✓ SSL Zertifikat vorhanden"
fi

# ── Schritt 6: Docker Build & Start ──
echo "▸ [6/7] Docker Container bauen & starten..."
docker compose down 2>/dev/null || true
docker compose build --no-cache
docker compose up -d

# Warten bis DB bereit
echo "  Warte auf Datenbank..."
sleep 10

# Prisma Migration
echo "  Datenbank-Schema anwenden..."
docker compose exec backend npx prisma db push

echo "  ✓ Container laufen"

# ── Schritt 7: Status prüfen ──
echo "▸ [7/7] Status prüfen..."
echo ""
docker compose ps
echo ""

# Health Check
echo "Health Check:"
sleep 3
curl -s http://localhost:4000/api/health | head -c 200
echo ""
echo ""

echo "═══════════════════════════════════════════"
echo "  ✅ Deployment erfolgreich!"
echo ""
echo "  App: https://$DOMAIN"
echo "  API: https://$DOMAIN/api/health"
echo ""
echo "  Container:"
echo "  - seo_frontend  (React App)"
echo "  - seo_backend   (Node.js API)"
echo "  - seo_db        (PostgreSQL)"
echo "  - seo_nginx     (Reverse Proxy + SSL)"
echo ""
echo "  Logs:  docker compose logs -f"
echo "  Stop:  docker compose down"
echo "  Start: docker compose up -d"
echo "═══════════════════════════════════════════"
