#!/bin/bash
# SEO Command Center v4 — Deploy Script
# Run on Hostinger VPS: bash deploy.sh

set -e

echo "🚀 SEO Command Center v4 — Deploy"
echo "=================================="

# Pull latest
echo "📥 Pulling latest changes..."
git pull origin main

# Build
echo "🔨 Building containers..."
docker compose build --no-cache

# Deploy
echo "🚀 Starting services..."
docker compose up -d

# Prisma migrations
echo "📊 Running database migrations..."
docker compose exec backend npx prisma db push --accept-data-loss

echo ""
echo "✅ Deploy complete!"
echo "🌐 https://seo.meosapp.de"
echo ""
docker compose ps
