# 🔄 Точки восстановления Frontend

Индекс версий frontend приложения Rejuvena.

---

## 📌 Последняя стабильная версия

**v1.4.0 - Video Support** (14 февраля 2026)  
**Commit:** `f31937c`  
**Файл:** [RESTORE_POINT_2026-02-14_VIDEO_SUPPORT.md](./RESTORE_POINT_2026-02-14_VIDEO_SUPPORT.md)

**Быстрое восстановление:**
```bash
git checkout f31937c
npm install && npm run build
npx gh-pages -d out -m "Restore v1.4.0"
```

---

## 📦 История версий

### v1.4.0 - Video Support (14 февраля 2026)
- ✅ Форматирование заголовков (H1/H2/H3)
- ✅ Навигация на текущий день марафона
- ✅ Поддержка iframe видео из TipTap
- ✅ Фикс 404 редиректов для GitHub Pages

**Commit:** `f31937c`

### Предыдущие версии
См. [Backend RESTORE_POINTS_INDEX.md](https://github.com/seplitza/backend-rejuvena/blob/main/RESTORE_POINTS_INDEX.md)

---

## 🚀 Как восстановить версию

1. **Выберите commit** из истории выше
2. **Переключитесь** на нужный коммит:
   ```bash
   cd /Users/alexeipinaev/Documents/Rejuvena/web
   git checkout <commit-hash>
   ```
3. **Установите зависимости:**
   ```bash
   npm install
   ```
4. **Тестируйте локально:**
   ```bash
   npm run dev
   ```
5. **Задеплойте:**
   ```bash
   npm run build
   npx gh-pages -d out -m "Restore: version description"
   ```

---

## 📝 Связанная документация

- **Backend restore points:** [Backend-rejuvena/RESTORE_POINTS_INDEX.md](https://github.com/seplitza/backend-rejuvena/blob/main/RESTORE_POINTS_INDEX.md)
- **Deployment guide:** [../Backend-rejuvena/DEPLOYMENT_WORKFLOW.md](https://github.com/seplitza/backend-rejuvena/blob/main/DEPLOYMENT_WORKFLOW.md)
- **API integration:** [../Backend-rejuvena/FRONTEND_INTEGRATION.md](https://github.com/seplitza/backend-rejuvena/blob/main/FRONTEND_INTEGRATION.md)

---

**Обновлено:** 14 февраля 2026 г.
