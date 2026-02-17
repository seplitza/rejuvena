#!/bin/bash
# Скрипт настройки Nginx для backend.seplitza.ru

echo "📋 Создание конфигурации Nginx для backend.seplitza.ru..."

cat > /etc/nginx/sites-available/backend-api << 'EOF'
server {
    listen 80;
    server_name backend.seplitza.ru;

    # Логи
    access_log /var/log/nginx/backend-access.log;
    error_log /var/log/nginx/backend-error.log;

    # Увеличить размер тела запроса (для загрузки фото)
    client_max_body_size 50M;

    # Проксирование на backend API
    location / {
        proxy_pass http://localhost:9527;
        proxy_http_version 1.1;
        
        # Заголовки
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket поддержка
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
        
        # CORS заголовки
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        
        # Для OPTIONS запросов
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }
}
EOF

echo "✅ Конфигурация создана"
echo ""

echo "📋 Активация конфигурации..."
ln -sf /etc/nginx/sites-available/backend-api /etc/nginx/sites-enabled/backend-api
echo "✅ Симлинк создан"
echo ""

echo "🧪 Проверка конфигурации Nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Конфигурация корректна"
    echo ""
    
    echo "🔄 Перезагрузка Nginx..."
    systemctl reload nginx
    
    if [ $? -eq 0 ]; then
        echo "✅ Nginx успешно перезагружен"
        echo ""
        echo "🎉 Настройка завершена!"
        echo ""
        echo "Проверьте работоспособность:"
        echo "  curl -I http://backend.seplitza.ru/health"
        echo ""
        echo "После проверки можно деплоить frontend!"
    else
        echo "❌ Ошибка при перезагрузке Nginx"
        systemctl status nginx
    fi
else
    echo "❌ Ошибка в конфигурации Nginx"
    echo "Проверьте вывод выше"
fi
