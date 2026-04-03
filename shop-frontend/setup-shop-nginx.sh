#!/bin/bash
# Setup nginx для shop.seplitza.ru с API proxy
# Запускать НА СЕРВЕРЕ: bash setup-shop-nginx.sh

set -e

echo "📝 Настройка nginx для shop.seplitza.ru..."

# 1. Скачать nginx конфиг из GitHub
echo "▶️  Скачиваем nginx конфиг..."
curl -fsSL https://raw.githubusercontent.com/seplitza/rejuvena/main/shop-frontend/nginx-shop-with-api-proxy.conf \
  -o /etc/nginx/sites-available/shop.seplitza.ru

# 2. Проверить SSL сертификаты
echo "▶️  Проверяем SSL сертификаты..."
if [ ! -f /etc/letsencrypt/live/shop.seplitza.ru/fullchain.pem ]; then
  echo "⚠️  SSL сертификат для shop.seplitza.ru не найден!"
  echo "Установка Let's Encrypt сертификата..."
  certbot certonly --nginx -d shop.seplitza.ru --non-interactive --agree-tos --email seplitza@gmail.com || {
    echo "❌ Не удалось установить SSL. Используем HTTP только."
    # Создать упрощенный конфиг без HTTPS
    cat > /etc/nginx/sites-available/shop.seplitza.ru <<'EOF'
server {
    listen 80;
    server_name shop.seplitza.ru;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://localhost:9527/api/;
        add_header 'Access-Control-Allow-Origin' '*' always;
    }
}
EOF
  }
fi

# 3. Создать симлинк
echo "▶️  Активируем конфигурацию..."
ln -sf /etc/nginx/sites-available/shop.seplitza.ru /etc/nginx/sites-enabled/shop.seplitza.ru

# 4. Проверить конфигурацию nginx
echo "▶️  Проверяем конфигурацию nginx..."
nginx -t

# 5. Перезагрузить nginx
echo "▶️  Перезагружаем nginx..."
systemctl reload nginx

echo "✅ Nginx настроен!"
echo "🌐 Shop доступен на https://shop.seplitza.ru"
echo "📡 API проксируется через /api/* → localhost:9527/api/*"
