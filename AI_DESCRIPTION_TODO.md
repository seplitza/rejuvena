# TODO: AI Product Description Enhancement

## Цель
Добавить функцию улучшения описания товара с помощью DeepSeek AI в админку

## Компоненты для создания/изменения

### 1. Backend API Endpoint
**Файл:** `/Backend-rejuvena/src/routes/admin/product-admin.routes.ts`

Добавить:
```typescript
router.post('/enhance-description', async (req, res) => {
  // Endpoint для улучшения описания через DeepSeek API
  // Input: { description, additionalPrompt?, productName }
  // Output: { description, shortDescription, seo: { title, description, keywords } }
})
```

### 2. DeepSeek Service
**Файл:** `/Backend-rejuvena/src/services/deepseek.service.ts` (создать новый)

Функции:
- `enhanceProductDescription(text, productName, additionalPrompt)` - основная функция
- Промпт должен генерировать:
  - Полное описание (HTML с эмоджи, выделением ключевых слов)
  - Краткое описание (1-2 предложения)
  - SEO title (до 60 символов)
  - SEO description (до 160 символов)
  - SEO keywords (массив 5-10 ключевых слов)

### 3. Frontend Modal Component
**Файл:** `/Backend-rejuvena/admin-panel/src/components/AIDescriptionModal.tsx` (создать новый)

Компоненты:
- Модальное окно с результатом от ИИ
- Поле для дополнительного промпта
- Кнопки: "Принять", "Отклонить и генерировать новый", "Отмена"
- Превью HTML описания
- Отображение SEO полей

### 4. Integration в ProductEditor
**Файл:** `/Backend-rejuvena/admin-panel/src/pages/ProductEditor.tsx`

Добавить:
- Кнопку "✨ Улучшить описание с ИИ" рядом с полем описания
- State для управления модалкой
- Логику сохранения исходного текста перед применением
- Функцию применения результата ко всем полям

### 5. History/Archive System
**MongoDB Model:** `/Backend-rejuvena/src/models/ProductDescriptionHistory.model.ts`

Схема:
```typescript
{
  productId: ObjectId,
  originalDescription: String,
  enhancedDescription: String,
  seoData: Object,
  createdBy: ObjectId,
  createdAt: Date
}
```

## Промпт для DeepSeek

```
Ты - эксперт маркетолог и SEO специалист. Твоя задача улучшить описание товара для интернет-магазина косметики и БАДов.

ИСХОДНОЕ ОПИСАНИЕ:
{description}

НАЗВАНИЕ ТОВАРА: {productName}

ДОПОЛНИТЕЛЬНЫЕ ТРЕБОВАНИЯ: {additionalPrompt || 'Нет'}

ЗАДАЧИ:
1. Создай привлекательное полное описание товара в HTML формате:
   - Используй эмоджи умеренно и стильно (не более 5-7 на весь текст)
   - Выделяй ключевые преимущества жирным (<strong>)
   - Добавь маркированные списки для характеристик
   - Естественно вплетай SEO ключевые слова (3-5% плотность)
   - Структурируй текст с подзаголовками (<h3>)
   - Используй призывы к действию
   - Объем: 400-800 слов

2. Создай краткое описание (2-3 предложения, до 150 символов)

3. Составь SEO метаданные:
   - Title: до 60 символов, включая название товара
   - Description: до 160 символов, включая призыв к действию
   - Keywords: 7-10 релевантных ключевых слов на русском

ВАЖНО:
- Фокусируйся на пользе для покупателя
- Используй эмоциональный язык, но оставайся профессиональным
- Соблюдай естественность - избегай переспама ключевыми словами
- Учитывай, что это косметика/БАДы - указывай на безопасность, эффективность
- Не используй медицинские заявления без подтверждений

ФОРМАТ ОТВЕТА (JSON):
{
  "description": "HTML описание",
  "shortDescription": "Краткое описание",
  "seo": {
    "title": "SEO заголовок",
    "description": "SEO описание",
    "keywords": ["ключ1", "ключ2", ...]
  }
}
```

## Порядок реализации

1. ✅ Исправить overflow в Products.tsx для горизонтальной прокрутки
2. Создать DeepSeek service с промптом
3. Добавить backend endpoint `/admin/products/enhance-description`
4. Создать MongoDB модель для истории
5. Создать React компонент AIDescriptionModal
6. Интегрировать в ProductEditor
7. Добавить кнопку и функционал применения
8. Протестировать с реальными данными

## Токен DeepSeek
Токен должен быть в переменных окружения: `DEEPSEEK_API_KEY`

## Примечания
- Сохранять оригинал перед применением
- Возможность отмены и возврата к оригиналу
- Поддержка дополнительных промптов для уточнения стиля
