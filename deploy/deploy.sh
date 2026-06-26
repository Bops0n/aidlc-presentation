#!/bin/bash
# ============================================================
# Deploy / Redeploy Script
# Usage: bash deploy/deploy.sh
# ============================================================

set -e

echo "=== Pulling latest code ==="
git pull origin main

echo "=== Building and starting containers ==="
docker-compose --env-file .env.production up -d --build

echo "=== Running Prisma migrations ==="
docker-compose exec app npx prisma db push --skip-generate

echo "=== Done! App is running on port 80 ==="
docker-compose ps
