#!/bin/bash
# ============================================================
# Деплой shop-frontend на сервер shop.seplitza.ru
# Использование: ./deploy-to-server.sh
#
# НЕ использует git pull (т.к. на сервере другой remote)
# Загружает файлы напрямую через SCP, затем пересобирает
# ============================================================

set -e

SERVER="root@37.252.20.170"
REMOTE_DIR="/var/www/shop"
LOCAL_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "📦 Деплой shop-frontend → $SERVER:$REMOTE_DIR"
echo ""

# 1. Загрузить исходники на сервер (кроме node_modules и .next)
echo "▶️  Копирование файлов на сервер..."
rsync -avz --progress \
  --exclude 'node_modules/' \
  --exclude '.next/' \
  --exclude 'out/' \
  --exclude '.git/' \
  --exclude '*.log' \
  "$LOCAL_DIR/" "$SERVER:$REMOTE_DIR/"

echo ""
echo "▶️  Установка зависимостей и сборка на сервере..."
ssh "$SERVER" "cd $REMOTE_DIR && \
  npm install --legacy-peer-deps && \
  npm run build && \
  systemctl restart seplitza-shop"

echo ""
echo "▶️  Проверка статуса сервиса..."
ssh "$SERVER" "systemctl status seplitza-shop --no-pager | head -15"

echo ""
echo "✅ Деплой завершён!"
echo "🌐 Проверьте: https://shop.seplitza.ru"
