# 🚀 План деплоймента на продакшн (28 февраля 2026)

## 📦 Что деплоим

### Новые функции:
1. ✅ **Admin Panel** - Полнофункциональная CRM панель
   - ProductEditor с TipTap (rich text)
   - Marketplace интеграция (Wildberries, Ozon)
   - Emoji picker, image cropping
   - User management с историей заказов

2. ✅ **Shop Orders System** - Система заказов магазина
   - Import скрипт для CRM orders
   - Import скрипт для course payments
   - Personal discounts для пользователей

3. ✅ **Backend API Updates**
   - GET /api/admin/users/:id/details с orders
   - PUT /api/admin/users/:id/discount
   - Исправлен баг с ObjectId в Order.find()

---

## ⚠️ КРИТИЧЕСКАЯ ИНФОРМАЦИЯ

### Сервер: Timeweb VPS
- **IP**: 37.252.20.170
- **User**: root
- **Password**: `c+d2Ei@GeWWKq8`
- **OS**: Ubuntu/Debian
- **MongoDB**: localhost:27017, база `rejuvena`
- **Backend API**: порт 9527
- **Age-bot API**: порт 5000

### ⚠️ ПРОБЛЕМА: Локальная БД != Продакшн БД
**ВНИМАНИЕ**: В локальной MongoDB удалены реальные пользователи марафона!
- Локально: 11 пользователей (тестовые + импортированные из CRM)
- Продакшн: ~100+ реальных пользователей марафона

**РЕШЕНИЕ**: НЕ делать полную перезапись БД! Только добавить новые записи (CRM orders/payments).

---

## 🔹 ШАГ 1: Создать точки восстановления

### 1.1 Backup продакшн базы данных MongoDB

```bash
# SSH подключение к серверу
ssh root@37.252.20.170

# Создать директорию для бэкапов
mkdir -p /root/backups

# Создать дамп базы rejuvena
mongodump --db rejuvena --out /root/backups/rejuvena-backup-20260228-pre-deployment

# Проверить размер бэкапа
du -sh /root/backups/rejuvena-backup-20260228-pre-deployment

# Скачать бэкап на локальную машину (в новом терминале)
scp -r root@37.252.20.170:/root/backups/rejuvena-backup-20260228-pre-deployment ~/Documents/Rejuvena/backups/pre-deployment-20260228/
```

### 1.2 Backup текущего кода на сервере

```bash
# На сервере
cd /var/www
tar -czf /root/backups/backend-code-20260228.tar.gz rejuvena-backend/
tar -czf /root/backups/admin-panel-20260228.tar.gz admin-panel/ 2>/dev/null || echo "Admin panel not yet deployed"

# Проверить
ls -lh /root/backups/*.tar.gz
```

### 1.3 Создать Git теги для текущих версий

```bash
# На локальной машине
cd ~/Documents/Rejuvena

# Получить текущий коммит
git log --oneline -1

# Создать тег с точкой восстановления
git tag -a v1.3.0-pre-crm-import -m "Pre-deployment snapshot: Before CRM orders import and admin panel deployment"

# Пушнуть тег в GitHub
git push origin v1.3.0-pre-crm-import

# Проверить
git tag -l
```

### 1.4 Backup локальной БД (с CRM импортами)

```bash
# На локальной машине
mongodump --db rejuvena --out ~/Documents/Rejuvena/backups/pre-deployment-20260228/local-db-with-crm-data

# Проверить
ls -lh ~/Documents/Rejuvena/backups/pre-deployment-20260228/
```

---

## 🔹 ШАГ 2: Экспорт локальных изменений БД

### 2.1 Экспорт только новых коллекций/данных

```bash
# Экспорт CRM заказов (только импортированные)
mongoexport --db rejuvena --collection orders --query '{"orderNumber": {$regex: "^CRM-"}}' --out ~/Documents/Rejuvena/backups/pre-deployment-20260228/crm-orders.json

# Экспорт CRM платежей курсов
mongoexport --db rejuvena --collection payments --query '{"orderNumber": {$regex: "^CRM-COURSE-"}}' --out ~/Documents/Rejuvena/backups/pre-deployment-20260228/crm-course-payments.json

# Подсчитать записи
echo "CRM Orders:" && wc -l ~/Documents/Rejuvena/backups/pre-deployment-20260228/crm-orders.json
echo "CRM Payments:" && wc -l ~/Documents/Rejuvena/backups/pre-deployment-20260228/crm-course-payments.json
```

### 2.2 Экспорт пользователей из CRM (только новые)

```bash
# Экспорт пользователей, созданных скриптом импорта
# (у них есть firstName с запятыми или специфичные email)
mongoexport --db rejuvena --collection users --query '{"createdAt": {$gte: {"$date": "2026-02-28T00:00:00.000Z"}}}' --out ~/Documents/Rejuvena/backups/pre-deployment-20260228/crm-imported-users.json

# Проверить
echo "Imported Users:" && wc -l ~/Documents/Rejuvena/backups/pre-deployment-20260228/crm-imported-users.json
```

---

## 🔹 ШАГ 3: Подготовить скрипт миграции

### 3.1 Создать safe-migration.sh

```bash
#!/bin/bash
# Safe migration script - only adds CRM data, doesn't delete existing users

# 1. Импорт CRM заказов (upsert mode)
mongoimport --db rejuvena --collection orders --file crm-orders.json --mode upsert --upsertFields orderNumber

# 2. Импорт CRM платежей (upsert mode)
mongoimport --db rejuvena --collection payments --file crm-course-payments.json --mode upsert --upsertFields orderNumber

# 3. Импорт CRM пользователей (upsert mode, по email)
mongoimport --db rejuvena --collection users --file crm-imported-users.json --mode upsert --upsertFields email

echo "✅ Migration completed"
echo "Run verification:"
echo "  mongo rejuvena --eval 'db.orders.find({orderNumber: /^CRM-/}).count()'"
echo "  mongo rejuvena --eval 'db.payments.find({orderNumber: /^CRM-COURSE-/}).count()'"
```

### 3.2 Упаковать миграцию

```bash
cd ~/Documents/Rejuvena/backups/pre-deployment-20260228
chmod +x safe-migration.sh
tar -czf migration-package.tar.gz crm-*.json crm-imported-users.json safe-migration.sh
```

---

## 🔹 ШАГ 4: Сборка проектов

### 4.1 Backend

```bash
cd ~/Documents/Rejuvena/Backend-rejuvena

# Установить зависимости
npm install

# Собрать TypeScript
npm run build

# Проверить dist/
ls -lh dist/

# Ожидаемый вывод: dist/server.js, dist/routes/, dist/models/, etc.
```

### 4.2 Admin Panel

```bash
cd ~/Documents/Rejuvena/Backend-rejuvena/admin-panel

# Установить зависимости
npm install

# Создать production .env
cat > .env.production << EOF
VITE_API_URL=http://37.252.20.170:9527
EOF

# Собрать для продакшн
npm run build

# Проверить dist/
ls -lh dist/
```

---

## 🔹 ШАГ 5: Git commit и push

### 5.1 Проверить статус и изменения

```bash
cd ~/Documents/Rejuvena
git status
git diff Backend-rejuvena/src/routes/admin.routes.ts
git diff Backend-rejuvena/admin-panel/src/pages/Users.tsx
```

### 5.2 Commit всех изменений

```bash
# Добавить все изменения
git add .

# Создать коммит
git commit -m "feat: Admin panel + CRM import + Shop orders system

- Admin panel: ProductEditor with TipTap, marketplace integration, image crop
- CRM import: Orders and course payments from old CRM
- Backend: Fixed ObjectId bug in Order.find()
- Users page: Show order history with correct amounts
- Personal discount management

Breaking: Requires database migration for CRM data import"

# Пушнуть в GitHub
git push origin main
```

### 5.3 Создать релиз тег

```bash
git tag -a v1.4.0 -m "Release v1.4.0: Admin Panel + CRM Import + Shop Orders"
git push origin v1.4.0
```

---

## 🔹 ШАГ 6: Деплой на продакшн

### 6.1 Загрузить backend на сервер

```bash
# SSH подключение
ssh root@37.252.20.170

# Остановить текущий backend
pm2 stop rejuvena-backend

# Сделать backup текущей версии
cd /var/www
mv rejuvena-backend rejuvena-backend-backup-20260228

# Склонировать свежую версию из GitHub
git clone https://github.com/YOUR_USERNAME/Rejuvena.git
cd Rejuvena/Backend-rejuvena

# Установить зависимости
npm install

# Собрать TypeScript
npm run build

# Скопировать .env
cp /var/www/rejuvena-backend-backup-20260228/.env .env

# Перезапустить с PM2
pm2 start npm --name "rejuvena-backend" -- start
pm2 save

# Проверить логи
pm2 logs rejuvena-backend --lines 50
```

### 6.2 Деплой Admin Panel

```bash
# На сервере
cd /var/www

# Создать директорию для admin panel
mkdir -p admin-panel
cd admin-panel

# Скопировать собранную версию с локальной машины
# (В новом терминале на локальной машине)
cd ~/Documents/Rejuvena/Backend-rejuvena/admin-panel
scp -r dist/* root@37.252.20.170:/var/www/admin-panel/

# Настроить Nginx для admin panel
# (На сервере)
cat > /etc/nginx/sites-available/admin-panel << 'EOF'
server {
    listen 80;
    server_name admin.rejuvena.ru;  # Или другой домен

    root /var/www/admin-panel;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:9527;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Включить конфиг
ln -sf /etc/nginx/sites-available/admin-panel /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## 🔹 ШАГ 7: Запуск миграции БД

### 7.1 Загрузить пакет миграции на сервер

```bash
# С локальной машины
scp ~/Documents/Rejuvena/backups/pre-deployment-20260228/migration-package.tar.gz root@37.252.20.170:/root/

# На сервере
cd /root
tar -xzf migration-package.tar.gz
ls -lh *.json *.sh
```

### 7.2 Проверить текущее состояние БД

```bash
# На сервере
mongo rejuvena --eval "
  print('Current users:', db.users.count());
  print('Current orders:', db.orders.count());
  print('Current payments:', db.payments.count());
  print('Marathon users:', db.users.find({isPremium: true}).count());
"
```

### 7.3 Запустить миграцию

```bash
# На сервере
chmod +x safe-migration.sh
./safe-migration.sh

# Проверить результаты
mongo rejuvena --eval "
  print('CRM Orders imported:', db.orders.find({orderNumber: /^CRM-/}).count());
  print('CRM Payments imported:', db.payments.find({orderNumber: /^CRM-COURSE-/}).count());
  print('Total users after migration:', db.users.count());
"
```

---

## 🔹 ШАГ 8: Тестирование на продакшене

### 8.1 Backend API

```bash
# Health check
curl http://37.252.20.170:9527/health

# Check admin routes
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" http://37.252.20.170:9527/api/admin/users?limit=5

# Check order details
# (Замените USER_ID на ID Victoria или другого пользователя с CRM заказом)
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" http://37.252.20.170:9527/api/admin/users/USER_ID/details
```

### 8.2 Admin Panel

```bash
# Открыть в браузере
# http://admin.rejuvena.ru  (или http://37.252.20.170/admin/)

# Тест-кейсы:
# 1. Логин под админом
# 2. Перейти в Users
# 3. Найти Victoria Gorevanova
# 4. Открыть модальное окно
# 5. Проверить вкладку "Покупки курсов" - должен быть CRM-529 на 4500₽
# 6. Найти Ilona Shmagunova
# 7. Проверить вкладку "Покупки курсов" - должен быть CRM-COURSE-362
# 8. Перейти в Products
# 9. Попробовать создать/редактировать товар с TipTap редактором
# 10. Загрузить и обрезать изображение
```

### 8.3 Проверить реальных пользователей марафона

```bash
# На сервере
mongo rejuvena --eval "
  // Показать несколько реальных пользователей
  db.users.find({isPremium: true, createdAt: {\$lt: new Date('2026-02-28')}}).limit(3).forEach(u => {
    print('User:', u.email, '| Premium:', u.isPremium, '| Created:', u.createdAt);
  });
"

# В админке:
# 1. Найти этих пользователей
# 2. Убедиться, что их данные не повреждены
# 3. Проверить, что у них есть история марафонов/упражнений
```

---

## 🔄 Откат изменений (если что-то пошло не так)

### Откат базы данных

```bash
# На сервере
cd /root/backups

# Удалить текущую БД
mongo rejuvena --eval "db.dropDatabase()"

# Восстановить из бэкапа
mongorestore --db rejuvena rejuvena-backup-20260228-pre-deployment/rejuvena/

# Проверить
mongo rejuvena --eval "db.users.count()"
```

### Откат кода backend

```bash
# На сервере
pm2 stop rejuvena-backend

cd /var/www
rm -rf Rejuvena
mv rejuvena-backend-backup-20260228 rejuvena-backend

cd rejuvena-backend
pm2 start npm --name "rejuvena-backend" -- start
pm2 save
```

### Откат через Git тег

```bash
# На локальной машине
git checkout v1.3.0-pre-crm-import

# Пересобрать и задеплоить заново
```

---

## ✅ Чеклист финальной проверки

- [ ] Бэкап продакшн БД создан и скачан
- [ ] Бэкап кода на сервере создан
- [ ] Git теги созданы
- [ ] Локальная БД экспортирована
- [ ] Backend собран (`npm run build`)
- [ ] Admin panel собран (`npm run build`)
- [ ] Все изменения закоммичены и запушены
- [ ] Backend задеплоен на сервер
- [ ] Admin panel задеплоен
- [ ] Миграция БД выполнена
- [ ] API отвечает на health check
- [ ] Admin panel открывается в браузере
- [ ] Victoria's order отображается с правильной ценой (4500₽)
- [ ] Реальные пользователи марафона не повреждены
- [ ] ProductEditor работает (TipTap, images)
- [ ] Personal discount можно изменить

---

## 📞 Контакты на случай проблем

- **Сервер**: Timeweb - https://timeweb.com
- **GitHub**: https://github.com/YOUR_USERNAME/Rejuvena
- **MongoDB**: localhost:27017

---

**ВАЖНО**: Перед началом убедитесь, что у вас есть:
1. Доступ к серверу по SSH
2. Админский токен для API
3. Доступ к GitHub репозиторию
4. Резервная копия важных данных

**Время на деплой**: ~2-3 часа (с учетом тестирования)
