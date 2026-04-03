#!/bin/bash
# Скрипт для запуска НА СЕРВЕРЕ для обновления shop из GitHub
# Использование: ssh root@37.252.20.170 'bash -s' < server-pull-from-github.sh

set -e

REPO_BASE="https://raw.githubusercontent.com/seplitza/rejuvena/main/shop-frontend"
SHOP_DIR="/var/www/shop"

echo "📥 Обновление shop из GitHub..."

# Ключевые файлы
cd "$SHOP_DIR"

echo "▶️  Обновляем next.config.js..."
curl -fsSL "$REPO_BASE/next.config.js" -o next.config.js

echo "▶️  Обновляем .env.production..."
curl -fsSL "$REPO_BASE/.env.production" -o .env.production

echo "▶️  Обновляем package.json..."
curl -fsSL "$REPO_BASE/package.json" -o package.json

echo "▶️  Обновляем src/pages/index.tsx..."
curl -fsSL "$REPO_BASE/src/pages/index.tsx" -o src/pages/index.tsx

echo "▶️  Обновляем src/components/ProductCarousel.tsx..."
curl -fsSL "$REPO_BASE/src/components/ProductCarousel.tsx" -o src/components/ProductCarousel.tsx

echo "▶️  Обновляем src/lib/api.ts..."
curl -fsSL "$REPO_BASE/src/lib/api.ts" -o src/lib/api.ts

echo ""
echo "▶️  Устанавливаем зависимости..."
npm install --legacy-peer-deps

echo ""
echo "▶️  Пересборка Next.js..."
npm run build

echo ""
echo "▶️  Перезапуск сервиса..."
systemctl restart seplitza-shop

echo ""
echo "✅ Обновление завершено!"
systemctl status seplitza-shop --no-pager | head -10
