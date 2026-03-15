# 🚀 Инструкция по деплою Seplitza Shop на Timeweb

**Дата:** 13 марта 2026 г.  
**Сервер:** 37.252.20.170  
**Домен:** shop.seplitza.ru

---

## ✅ Готово

- [x] Репозиторий создан: https://github.com/seplitza/shop
- [x] Код загружен в GitHub
- [x] Локальная разработка работает на `localhost:3001`
- [x] Конфигурация для self-hosting настроена

---

## 📋 Шаг 1: DNS настройка (Cloudflare/REG.RU)

### Добавить A и AAAA записи:

```
Type: A
Name: shop
Content: 37.252.20.170
TTL: Auto
Proxy: On (Proxied - оранжевое облако) ← ВКЛЮЧИТЬ!

Type: AAAA
Name: shop
Content: 2a03:6f00:a::e3ac
TTL: Auto
Proxy: On (Proxied - оранжевое облако) ← ВКЛЮЧИТЬ!
```

**Настройка Cloudflare SSL/TLS:**
1. Перейдите в Cloudflare Dashboard → SSL/TLS
2. Выберите режим: **Full (strict)** или **Full**
3. SSL/TLS encryption mode: Full = HTTP между Cloudflare и сервером

**Проверка DNS** (через 5-10 минут):
```bash
nslookup shop.seplitza.ru
# Должен вернуть IP Cloudflare (НЕ ваш 37.252.20.170 - это нормально!)
```

---

## 📦 Шаг 2: Подготовка сервера

### 2.1 Подключиться к серверу

```bash
ssh root@37.252.20.170
# Пароль: ******** (из Timeweb)
```

### 2.2 Проверить Node.js

```bash
node --version  # Должна быть >= 18
npm --version
```

Если Node.js нет или старая версия:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
```

### 2.3 Проверить Nginx

```bash
nginx -v
systemctl status nginx
```

Если Nginx не установлен:
```bash
apt update
apt install -y nginx
systemctl enable nginx
systemctl start nginx
```

---

## 🚀 Шаг 3: Автоматический деплой

### Вариант A: С локального компьютера

```bash
cd /Users/alexeipinaev/Documents/SHOP
./deploy.sh
```

Скрипт автоматически:
1. Подключится к серверу
2. Склонирует репозиторий в `/var/www/shop`
3. Установит зависимости
4. Соберет Next.js приложение
5. Создаст systemd service
6. Запустит сервис

### Вариант B: Вручную на сервере

```bash
# 1. Создать директорию
mkdir -p /var/www/shop
cd /var/www/shop

# 2. Клонировать репозиторий
git clone https://github.com/seplitza/shop.git .

# 3. Установить зависимости
npm ci --legacy-peer-deps

# 4. Собрать приложение
NODE_ENV=production npm run build

# 5. Создать systemd service
cat > /etc/systemd/system/seplitza-shop.service << 'EOF'
[Unit]
Description=Seplitza Shop - Next.js Application
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/shop
Environment=NODE_ENV=production
Environment=PORT=3001
Environment=NEXT_PUBLIC_API_URL=https://api-rejuvena.duckdns.org
Environment=NEXT_PUBLIC_SITE_URL=https://shop.seplitza.ru
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# 6. Запустить сервис
systemctl daemon-reload
systemctl enable seplitza-shop
systemctl start seplitza-shop

# 7. Проверить статус
systemctl status seplitza-shop
journalctl -u seplitza-shop -f
```

---

## 🌐 Шаг 4: Настройка Nginx

### 4.1 Создать конфиг для shop.seplitza.ru

```bash
cat > /etc/nginx/sites-available/shop << 'EOF'
serverCloudflare работает по HTTP, но клиент видит HTTPS
    # Редирект на HTTPS не нужен - Cloudflare делает это

    access_log /var/log/nginx/shop-access.log;
    error_log /var/log/nginx/shop-error.log;

    # Cloudflare Real IP (для логов)
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 131.0.72.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    set_real_ip_from 2400:cb00::/32;
    set_real_ip_from 2606:4700::/32;
    set_real_ip_from 2803:f800::/32;
    set_real_ip_from 2405:b500::/32;
    set_real_ip_from 2405:8100::/32;
    set_real_ip_from 2c0f:f248::/32;
    set_real_ip_from 2a06:98c0::/29;
    real_ip_header CF-Connecting-IP;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header CF-Connecting-IP $http_cf_connecting_ip
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static {
        proxy_pass http://localhost:3001;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
EOF
```
SSL через Cloudflare

**SSL сертификат не нужен!** Cloudflare предоставляет бесплатный SSL.

### 5.1 Настройте SSL/TLS в Cloudflare

1. Войдите в Cloudflare Dashboard
2. Выберите домен `seplitza.ru`
3. **SSL/TLS** → Overview
4. Выберите режим: **Full** (рекомендуется)
   - **Full** = Cloudflare ↔ Сервер по HTTP
   - **Full (strict)** = требует сертификат на сервере (можно настроить позже)

### 5.2 Проверка SSL

```bash
# Проверить HTTPS
curl -I https://shop.seplitza.ru

# Должен вернуть: HTTP/2 200
```

### 5.3 (Опционально) Origin Certificate

Для режима **Full (strict)** создайте Origin Certificate:

1. Cloudflare → SSL/TLS → Origin Server
2. Create Certificate
3. Скачайте сертификат и ключ
4. Сохраните на сервере:
```bash
mkdir -p /etc/ssl/cloudflare
nano /etc/ssl/cloudflare/shop.pem    # Вставить сертификат
nano /etc/ssl/cloudflare/shop.key    # Вставить ключ
chmod 600 /etc/ssl/cloudflare/shop.key
```

5. Обновите nginx конфиг:
```nginx
server {
    listen 443 ssl http2;
    server_name shop.seplitza.ru;
    
    ssl_certificate /etc/ssl/cloudflare/shop.pem;
    ssl_certificate_key /etc/ssl/cloudflare/shop.key;
    
    # ... остальные настройки
}bot

```bash
apt update
apt install -y certbot python3-certbot-nginx
```

### 5.2 Получить сертификат

```bash
certbot --nginx -d shop.seplitza.ru
```

**Вопросы Certbot:**
- Email: ваш email
- Terms of Service: A (agree)
- Share email: N (no)
- Redirect HTTP to HTTPS: 2 (redirect)

### 5.3 Проверка SSL

```bash
# Проверить сертификат
certbot certificates

# Тест автообновления
certbot renew --dry-run
```

---

## ✅ Шаг 6: Проверка работы

### 6.1 Проверка сервиса

```bash
systemctl status seplitza-shop
journalctl -u seplitza-shop -n 50
```

### 6.2 Проверка сайта

Откройте в браузере: **https://shop.seplitza.ru**

Должно открыться:
- ✅ Главная страница магазина
- ✅ Каталог товаров
- ✅ Корзина
- ✅ Fortune Wheel
- ✅ Без ошибок в консоли

### 6.3 Проверка API

```bash
curl https://shop.seplitza.ru
curl https://api-rejuvena.duckdns.org/api/shop/products
```

---

## 🔄 Обновление кода

### Для обновления после изменений:

```bash
# 1. Локально закоммитить изменения
cd /Users/alexeipinaev/Documents/SHOP
git add .
git commit -m "feat: Описание изменений"
git push origin main

# 2. На сервере обновить
ssh root@37.252.20.170
cd /var/www/shop
git pull origin main
npm ci --legacy-peer-deps
NODE_ENV=production npm run build
systemctl restart seplitza-shop

# 3. Проверить
systemctl status seplitza-shop
```

Или использовать `deploy.sh` с локального компьютера.

---

## 📊 Мониторинг

### Логи приложения

```bash
journalctl -u seplitza-shop -f
```

### Логи Nginx

```bash
tail -f /var/log/nginx/shop-access.log
tail -f /var/log/nginx/shop-error.log
```

### Проверка портов

```bash
netstat -tulpn | grep :3001
```

---

## 🐛 Решение проблем

### Сервис не запускается

```bash
journaCloudflare SSL/TLS настроен (режим Full)-n 100
systemctl status seplitza-shop
```

### Порт 3001 занят

```bash
lsof -i :3001
kill -9 <PID>
systemctl restart seplitza-shop
```

### Ошибки сборки

```bash
cd /var/www/shop
rm -rf node_modules .next
npm ci --legacy-peer-deps
NODE_ENV=production npm run build
```

### 502 Bad Gateway

```bash
# Проверить что Next.js запущен
systemctl status seplitza-shop

# Проверить nginx конфиг
nginx -t
tail -f /var/log/nginx/shop-error.log
```

---

## 📝 Итоговый чеклист

- [ ] DNS настроен (A и AAAA записи)
- [ ] Подключение к серверу работает (`ssh root@37.252.20.170`)
- [ ] Node.js 18+ установлен
- [ ] Nginx установлен и запущен
- [ ] Репозиторий склонирован в `/var/www/shop`
- [ ] Зависимости установлены
- [ ] Приложение собрано (`npm run build`)
- [ ] Systemd service создан и запущен
- [ ] Nginx конфиг настроен
- [ ] SSL сертификат получен
- [ ] Сайт открывается на https://shop.seplitza.ru
- [ ] API запросы работают
- [ ] Нет ошибок в логах

---

## 🎉 Готово!

Ваш магазин доступен по адресу: **https://shop.seplitza.ru**
