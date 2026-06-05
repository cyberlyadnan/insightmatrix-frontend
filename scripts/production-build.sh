#!/usr/bin/env bash
# Production build — run on the VPS after git pull
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Installing dependencies"
npm ci

echo "==> Building Next.js (production env + webpack)"
export NODE_ENV=production
npm run build

echo "==> Build complete. Start with: npm run start"
echo "    Ensure nginx proxies /_next/ to this Next process (port 3000)."
