# 🔄 Точка восстановления Frontend: 14 февраля 2026 г.

## 📋 Версия содержит

**Версия:** v1.4.0 - Video Support & Marathon Navigation  
**Дата:** 14 февраля 2026 г., 15:40 МСК  
**Статус:** ✅ Стабильная версия

---

## 🔗 Git информация

**Repository:** https://github.com/seplitza/rejuvena.git  
**Commit:** `f31937c`  
**Branch:** `main`  
**Subject:** fix: use explicit CSS styles for marathon day headings formatting

### Восстановление:
```bash
cd /Users/alexeipinaev/Documents/Rejuvena/web
git checkout f31937c
npm install
npm run build
npx gh-pages -d out -m "Restore: video support version"
```

---

## ✨ Ключевые изменения

### 1. Навигация по марафонам
**Файл:** `src/pages/dashboard.tsx`

Кнопка на баннере марафона теперь ведет на текущий день (после старта марафона):
```typescript
const targetUrl = hasStarted 
  ? `/marathons/${marathon._id}/day/${getCurrentDay()}`
  : `/marathons/${marathon._id}/start`;
```

### 2. Форматирование заголовков
**Файл:** `src/components/day/DayDescription.tsx`

Явные CSS стили с `!important` для корректного отображения:
```css
.day-content-prose :global(h1) {
  font-size: 1.875rem !important; /* 30px */
  font-weight: 700 !important;
  color: #581c87 !important;
}

.day-content-prose :global(h2) {
  font-size: 1.5rem !important; /* 24px */
  font-weight: 700 !important;
}

.day-content-prose :global(h3) {
  font-size: 1.25rem !important; /* 20px */
  font-weight: 600 !important;
}
```

### 3. Поддержка видео из TipTap
**Файл:** `src/components/day/DayDescription.tsx`

Добавлена поддержка рендеринга `<iframe>` для видео:
```css
.day-content-prose :global(iframe) {
  border-radius: 0.5rem !important;
  margin: 1rem 0 !important;
  width: 100% !important;
  aspect-ratio: 16 / 9 !important;
}
```

### 4. Исправление 404 редиректов
**Файлы:** 
- `public/404.html` - сохраняет путь через sessionStorage
- `public/.nojekyll` - отключает Jekyll обработку
- `src/pages/_app.tsx` - восстанавливает путь после редиректа

---

## 📊 Измененные файлы

### Основные изменения:
```
src/pages/dashboard.tsx              - Логика навигации по марафонам
src/components/day/DayDescription.tsx - CSS стили для заголовков и видео
src/pages/_app.tsx                   - GitHub Pages redirect handling
public/404.html                      - SPA fallback
public/.nojekyll                     - GitHub Pages config
```

### Коммиты в этой сессии:
- `f31937c` - fix: use explicit CSS styles for marathon day headings formatting
- `b73b359` - fix: increase heading sizes in marathon day description
- `b7f366c` - fix: marathon banner always navigates to current day
- `c0019ab` - feat: implement smart marathon banner navigation logic

---

## 🔧 Конфигурация

### Next.js (next.config.js):
```javascript
{
  output: 'export',
  basePath: '/rejuvena',
  images: { unoptimized: true }
}
```

### API URL (src/config/api.ts):
```typescript
export const API_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  'http://37.252.20.170:9527';
```

### Deployment:
- **URL:** https://seplitza.github.io/rejuvena/
- **Method:** GitHub Pages via gh-pages package
- **Trigger:** Manual или GitHub Actions

---

## ✅ Тестирование после восстановления

1. ✅ Сайт открывается на https://seplitza.github.io/rejuvena/
2. ✅ Логин/регистрация работает
3. ✅ Баннеры марафонов отображаются
4. ✅ Клик на баннер после старта марафона → текущий день
5. ✅ Клик на баннер до старта → страница /start
6. ✅ Заголовки H1/H2/H3 отображаются крупно
7. ✅ Видео из TipTap рендерится через iframe
8. ✅ Галочки упражнений сохраняются
9. ✅ Обновление страницы не сбрасывает авторизацию

---

## 🔗 Связанные файлы

**Backend restore point:** `RESTORE_POINT_2026-02-14_VIDEO_SUPPORT.md`  
См. backend репозиторий для:
- Информации о TipTap редакторе с видео
- Структуры базы данных
- API endpoints
- Production deployment инструкций

---

## 📝 Быстрое восстановление (если все сломалось)

```bash
# 1. Переключиться на стабильную версию
cd /Users/alexeipinaev/Documents/Rejuvena/web
git fetch origin
git checkout f31937c

# 2. Переустановить зависимости
rm -rf node_modules .next
npm install

# 3. Тестирование локально
npm run dev
# Открыть http://localhost:3000

# 4. Деплой на production
npm run build
npx gh-pages -d out -m "Restore: stable video support version"

# 5. Подождать 5-15 минут (GitHub Pages CDN cache)
# 6. Hard refresh в браузере (Ctrl+Shift+R)
```

---

## 🐛 Известные проблемы

### Решенные:
- ✅ Галочки упражнений исчезают между днями
- ✅ Иконки категорий не подгружаются
- ✅ Навигация застревает на /start
- ✅ Мелкие заголовки в описании дня

### Остающиеся (минорные):
- ⚠️ GitHub Pages cache - задержка 5-15 минут при деплое
- ⚠️ Tailwind prose может конфликтовать с custom CSS (используем !important)

---

## 📦 Зависимости

### Критические:
```json
{
  "next": "14.2.33",
  "react": "^18.2.0",
  "react-redux": "^8.1.3",
  "@reduxjs/toolkit": "^1.9.7",
  "redux-saga": "^1.2.3",
  "tailwindcss": "^3.4.1"
}
```

### Для деплоя:
```json
{
  "gh-pages": "^6.1.1"
}
```

---

**Дата создания:** 14 февраля 2026 г., 15:45 МСК  
**Следующий бэкап:** После следующих major изменений
