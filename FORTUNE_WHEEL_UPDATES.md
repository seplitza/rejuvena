# Обновления Колеса Фортуны

**Дата:** 8 марта 2026  
**Версия:** 1.1.0

## Исправленные проблемы

### 1. ✅ Синхронизация вращения колеса с результатом

**Проблема:** Приз под стрелкой не совпадал с призом в модальном окне поздравления.

**Причина:** Неправильный расчёт угла поворота колеса.

**Решение:** Исправлена формула расчёта в `FortuneWheel.tsx`:

```typescript
// БЫЛО (неправильно):
const targetAngle = 360 - (prizeIndex * segmentAngle + segmentAngle / 2);

// СТАЛО (правильно):
const prizeAngle = prizeIndex * segmentAngle + segmentAngle / 2;
const targetAngle = 360 - prizeAngle;
```

**Комментарии в коде:**
- Указатель находится вверху (0°)
- Первый приз начинается с 0°
- Чтобы приз оказался под стрелкой, нужно повернуть на его угол в обратную сторону

### 2. ✅ Кнопка подтверждения/активации приза

**Проблема:** Не было возможности подтвердить/активировать выигранный приз.

**Решение:** Добавлена кнопка "🎁 Забрать приз" в модальное окно результата.

#### Frontend изменения:

**Файл:** `web/src/components/FortuneWheel.tsx`

- Добавлено состояние `confirming` и `prizeConfirmed`
- Добавлен пропс `onConfirmPrize?: (prize: Prize) => Promise<void>`
- Добавлена кнопка с обработчиком подтверждения
- После подтверждения показывается зелёное уведомление "✅ Приз активирован и добавлен в ваш профиль!"

**Файл:** `web/src/pages/fortune-wheel.tsx`

- Добавлена функция `handleConfirmPrize()`
- Функция передаётся в компонент `FortuneWheel`

#### Backend изменения:

**Файл:** `Backend-rejuvena/src/routes/fortune-wheel.routes.ts`

**Новый endpoint:** `POST /api/fortune-wheel/confirm-prize`

**Параметры запроса:**
```json
{
  "prizeId": "объектID приза"
}
```

**Ответ при успехе:**
```json
{
  "success": true,
  "message": "Приз успешно активирован",
  "prize": { /* объект приза */ }
}
```

**Логика:**
1. Проверка авторизации пользователя
2. Поиск приза в массиве `user.fortuneWheelGifts`, который:
   - Имеет указанный `prizeId`
   - Не активирован (`!isUsed && !used`)
3. Установка флагов активации:
   - `isUsed = true`
   - `used = true`
   - `usedAt = new Date()`
4. Сохранение пользователя

## Деплой

### Frontend
```bash
cd web
npm run build
npm run deploy
```
✅ Задеплоено: https://seplitza.github.io/rejuvena/fortune-wheel

### Backend
```bash
git add src/routes/fortune-wheel.routes.ts
git commit -m "feat: Добавлен endpoint для подтверждения/активации призов"
git push

ssh root@37.252.20.170
cd /var/www/rejuvena-backend
git pull
npm run build
pm2 restart rejuvena-backend
```
✅ Задеплоено: commit `4324450`

## Что осталось сделать

### 🔴 Интеграция с профилем пользователя

**Требуется:**
1. Показывать активированные призы в Dashboard → "Последняя активность"
2. Показывать призы в Профиле → "История покупок"
3. При активации призов типа `discount` или `freeProduct` — создавать промокод или автоматически применять скидку

**Файлы для изменения:**
- `web/src/pages/dashboard.tsx` - добавить секцию с призами
- `web/src/pages/profile.tsx` - добавить призы в историю покупок
- `Backend-rejuvena/src/routes/user.routes.ts` - добавить endpoint для получения активированных призов

**Пример API:**
```
GET /api/user/fortune-prizes
```

**Ответ:**
```json
{
  "activePrizes": [
    {
      "_id": "...",
      "description": "Скидка 20%",
      "type": "discount",
      "discountPercent": 20,
      "expiryDate": "2026-04-08T00:00:00.000Z",
      "isUsed": true,
      "usedAt": "2026-03-08T09:25:00.000Z"
    }
  ]
}
```

### 🔴 Применение призов к заказам

**Требуется:**
- При оформлении заказа показывать доступные призы (скидки, бесплатная доставка)
- Позволить применить приз к заказу
- Связать приз с заказом через поле `orderId` в `fortuneWheelGifts`

## Тестирование

### Тестовые пользователи со спинами:
- testux@test.com (10 спинов)
- seplitza@gmail.com (10 спинов)
- testov3@mail.ru (10 спинов)
- testuser@rejuvena.com (10 спинов)

### Проверка:
1. ✅ Колесо вращается корректно
2. ✅ Приз под стрелкой = приз в модальном окне
3. ✅ Кнопка "Забрать приз" работает
4. ✅ После активации показывается зелёное уведомление
5. ❌ Приз появляется в профиле (TODO)
6. ❌ Приз можно применить к заказу (TODO)

## API Endpoints

### Публичные
- `GET /api/fortune-wheel/prizes` - список активных призов

### С авторизацией
- `GET /api/fortune-wheel/available-spins` - количество доступных спинов
- `POST /api/fortune-wheel/spin` - прокрутить колесо
- `GET /api/fortune-wheel/history` - история вращений
- `POST /api/fortune-wheel/confirm-prize` - ✨ **НОВЫЙ** - активировать приз

### Админ-панель
- `POST /api/admin/fortune-wheel/grant-spins` - выдать спины пользователю
- `POST /api/admin/fortune-wheel/grant-spins-test-users` - выдать спины всем тестовым пользователям
