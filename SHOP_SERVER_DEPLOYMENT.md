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
Proxy: Off (DNS only)

Type: AAAA
Name: shop
Content: 2a03:6f00:a::e3ac
TTL: Auto
Proxy: Off (DNS only)
```

**Проверка DNS** (через 5-10 минут):
```bash
nslookup shop.seplitza.ru
# Должен вернуть 37.252.20.170
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
server {
    listen 80;
    listen [::]:80;
    server_name shop.seplitza.ru;

    # Временно закомментируем редирект на HTTPS до установки SSL
    # return 301 https://$server_name$request_uri;

    access_log /var/log/nginx/shop-access.log;
    error_log /var/log/nginx/shop-error.log;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
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

### 4.2 Активировать конфиг

```bash
# Создать симлинк
ln -s /etc/nginx/sites-available/shop /etc/nginx/sites-enabled/

# Проверить конфиг
nginx -t

# Перезагрузить Nginx
systemctl reload nginx
```

### 4.3 Проверка без SSL

```bash
# На сервере
curl http://localhost:3001

# С локального компьютера (после DNS propagation)
curl http://shop.seplitza.ru
```

---

## 🔒 Шаг 5: Установка SSL (Let's Encrypt)

### 5.1 Установить Certbot

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
journalctl -u seplitza-shop -n 100
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
