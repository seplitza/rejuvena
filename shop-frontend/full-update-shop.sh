#!/bin/bash
# Полное обновление shop: nginx + код + пересборка
# Запускать НА СЕРВЕРЕ

set -e

echo "🔄 Полное обновление shop.seplitza.ru..."

# 1. Настроить nginx с API proxy
echo ""
echo "===== ШАГ 1: Настройка nginx ====="
bash <(curl -fsSL https://raw.githubusercontent.com/seplitza/rejuvena/main/shop-frontend/setup-shop-nginx.sh)

# 2. Обновить код shop из GitHub
echo ""
echo "===== ШАГ 2: Обновление кода ====="
cd /var/www/shop

echo "▶️  Скачиваем .env.production..."
curl -fsSL https://raw.githubusercontent.com/seplitza/rejuvena/main/shop-frontend/.env.production -o .env.production

echo "▶️  Скачиваем next.config.js..."
curl -fsSL https://raw.githubusercontent.com/seplitza/rejuvena/main/shop-frontend/next.config.js -o next.config.js

echo "▶️  Скачиваем package.json..."
curl -fsSL https://raw.githubusercontent.com/seplitza/rejuvena/main/shop-frontend/package.json -o package.json

# 3. Установить зависимости
echo ""
echo "===== ШАГ 3: Установка зависимостей ====="
npm install --legacy-peer-deps

# 4. Пересборка
echo ""
echo "===== ШАГ 4: Сборка Next.js ====="
npm run build

# 5. Перезапуск
echo ""
echo "===== ШАГ 5: Перезапуск сервиса ====="
systemctl restart seplitza-shop

echo ""
echo "✅ Обновление завершено!"
systemctl status seplitza-shop --no-pager | head -12
