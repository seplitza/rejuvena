# Rejuvena Photo Diary - Version 1.0

**Release Date**: 27 ноября 2025 г.

## Основные функции

### ✅ Определение возраста
- **Face++ API** (основной метод) - облачный сервис с высокой точностью
- **InsightFace buffalo_l** (резервный метод) - локальная модель при недоступности Face++
- Автоматическое переключение между методами при ошибках

### ✅ Фотодневник (6 позиций)
1. Анфас (front)
2. Левый профиль 3/4 (left34)
3. Левый профиль (leftProfile)
4. Правый профиль 3/4 (right34)
5. Правый профиль (rightProfile)
6. Крупный план (closeup) - автоматически заполняется фото анфаса

### ✅ Автокроп лица
- **20% отступ** сверху для стандартных фото (1-5 ряды)
- **0% отступ** для крупного плана (6 ряд)
- Автоматическое заполнение 6 ряда при загрузке фото анфаса

### ✅ Создание коллажа
- Разрешение обрезки: 800x800px
- Формат имени: `rejuvena_diary_before_YYYYMMDD_HHMMSS.jpg`
- Метаданные на коллаже:
  - Дата съемки (из EXIF)
  - Дата загрузки
  - Определенный возраст

### ✅ Скачивание
- **Мобильные устройства** (iOS/Android): data URI метод
- **Десктоп**: blob URL метод
- Автоопределение платформы

### ✅ Хранение фотографий
- **Браузер**: 24 часа (сжатые копии 50% качество для предпросмотра)
- **Сервер - оригиналы**: 1 день (для коррекции обрезки)
- **Сервер - обрезанные**: 1 месяц бесплатно
- **С курсом**: весь срок курса + 1 месяц после

## Технические характеристики

### Backend (age-bot-api)
- **Framework**: Flask
- **Age estimation**: Face++ API + InsightFace fallback
- **Server**: Gunicorn (2 workers)
- **Deployment**: Timeweb VPS 37.252.20.170:5000
- **Proxy**: Cloudflare (api.seplitza.ru)
- **Memory**: ~280MB (2 workers × 140MB)

### Frontend (web)
- **Framework**: Next.js 14
- **Deployment**: GitHub Pages
- **State**: Redux Toolkit + redux-persist
- **Storage**: localStorage (автосохранение)
- **Responsive**: mobile-first design

### Mobile App
- **Framework**: React Native
- **Platforms**: iOS, Android
- **State**: Redux Toolkit + Sagas
- **Storage**: AsyncStorage
- **Navigation**: React Navigation 5

## Исправления в v1.0

### 1. Интеграция Face++ API
- ❌ **Было**: InsightFace как единственный метод
- ✅ **Стало**: Face++ (основной) + InsightFace (резерв)
- Сохранены все функции коллажа

### 2. Скачивание в мобильной версии
- ❌ **Было**: blob URL (не работал на iOS/Android)
- ✅ **Стало**: data URI для мобильных, blob для десктопа
- Добавлена задержка 100ms для iOS Safari

### 3. Автозаполнение 6 ряда
- ✅ При загрузке фото анфаса автоматически создается крупный план
- ✅ Разные отступы: 20% для анфаса, 0% для крупного плана

### 4. Видимость метаданных на мобильных
- ❌ **Было**: text-xs (12px на всех экранах)
- ✅ **Стало**: text-[11px] sm:text-xs (крупнее на мобильных)

### 5. Кнопка "Корректировать"
- ❌ **Было**: text-sm (14px) - текст не помещался
- ✅ **Стало**: text-xs (12px) - текст полностью виден

## API Endpoints

### Age Estimation
```
POST https://api.seplitza.ru/api/estimate-age
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,..."
}

Response:
{
  "age": 35,
  "confidence": 0.95,
  "status": "success"
}
```

### Collage Generation
```
POST https://api.seplitza.ru/api/create-collage
Content-Type: application/json

{
  "type": "before",
  "photos": {
    "front": "data:image/jpeg;base64,...",
    "left34": "data:image/jpeg;base64,...",
    ...
  },
  "botAge": 35,
  "realAge": 33,
  "weight": 70,
  "height": 175,
  "comment": "После 2 месяцев курса"
}

Response:
{
  "collage": "data:image/jpeg;base64,...",
  "filename": "rejuvena_diary_before_20251127_143052.jpg",
  "metadata": {...}
}
```

### Health Check
```
GET https://api.seplitza.ru/health

Response:
{
  "status": "healthy",
  "provider": "Face++ API",
  "model_loaded": true,
  "memory_mb": 159.2
}
```

## Известные ограничения

1. Face++ API требует интернет-соединения
2. InsightFace fallback работает только на сервере
3. EXIF данные могут отсутствовать в скриншотах и обработанных фото
4. Максимальный размер фото для обработки: ~10MB

## Развертывание

### Web App
```bash
cd web
npm install --legacy-peer-deps
npm run deploy  # Собирает и публикует на GitHub Pages
```

### Age-bot API
```bash
cd age-bot-api
./deploy.sh  # Деплой на Timeweb VPS
```

### Mobile App
```bash
npm install
npm run android  # или ios
fastlane android beta  # Деплой в App Center
```

## Следующие версии (планируется)

- [ ] История изменений (таймлайн прогресса)
- [ ] Сравнение "До/После" с наложением
- [ ] Экспорт данных в PDF
- [ ] Push-уведомления о необходимости новых фото
- [ ] Интеграция с курсами (автоматические напоминания)

---

**Git Tag**: `v1.0`  
**Commit**: `6733399`  
**Repository**: https://github.com/seplitza/rejuvena
