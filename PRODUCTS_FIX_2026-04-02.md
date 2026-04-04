# Исправление товаров и каталога - 02.04.2026

## Проблемы

1. ❌ Товар "Омега-3 в капсулах" отображался с неправильной ценой после редактирования
2. ❌ Формат цен в базе данных хранился некорректно (рубли вместо копеек)
3. ❌ Каталог товаров пустовал на фронтенде
4. ❌ Нет карусели с хитами продаж

## Решения

### 1. Исправлены цены в базе данных

#### Проблема
Цены хранятся в **копейках** (правильный подход для точности), но один товар имел цену `160000` (1600 руб) вместо `1600` (16 руб).

#### Решение
```bash
# Исправлена цена товара Омега-3 1:1
db.products.updateOne(
  {_id: ObjectId('69aa4ba6a5258720ecf885fc')},
  {$set: {
    price: 1600,        # 16 рублей в копейках
    compareAtPrice: 1920 # 19.20 рублей в копейках
  }}
);
```

#### Результат
✅ Все цены в БД теперь в копейках:
- `Омега-3 1:1`: 1600 копеек (16.00 ₽)
- `Омега-3 5:1 в капсулах`: 1600 копеек (16.00 ₽)

---

### 2. Исправлена админ-панель

#### Проблема
В [ProductEditorNew.tsx](Backend-rejuvena/admin-panel/src/pages/ProductEditorNew.tsx) цены:
- **При загрузке**: приходили в копейках, но отображались как есть (16 показывалось как 0.16 ₽)
- **При сохранении**: вводились в рублях, но сохранялись как есть (пользователь вводил 16, сохранялось 16 копеек = 0.16 ₽)

#### Решение
Добавлена конвертация цен:

```typescript
// При загрузке товара (копейки → рубли для отображения)
setPrice(p.price ? p.price / 100 : 0);
setCompareAtPrice(p.compareAtPrice ? p.compareAtPrice / 100 : 0);

// При сохранении (рубли → копейки для БД)
price: Math.round(price * 100),
compareAtPrice: compareAtPrice ? Math.round(compareAtPrice * 100) : undefined,
```

Также обновлены подписи полей:
- ~~"Цена"~~ → **"Цена в рублях"** с плейсхолдером `16.00`
- ~~"Старая цена"~~ → **"Старая цена в рублях"** с плейсхолдером `19.20`

#### Файлы изменены
- [Backend-rejuvena/admin-panel/src/pages/ProductEditorNew.tsx](Backend-rejuvena/admin-panel/src/pages/ProductEditorNew.tsx)

#### Деплой
```bash
cd Backend-rejuvena
./deploy-admin.sh
```

✅ Админ-панель обновлена: https://api-rejuvena.duckdns.org/admin/

---

### 3. Добавлена карусель товаров на фронтенд

#### Компонент ProductCarousel

Создан компонент [web/src/components/ProductCarousel.tsx](web/src/components/ProductCarousel.tsx):

**Функционал:**
- 📦 Загружает товары с `isFeatured: true` (отмечены как "Хиты продаж")
- 🔍 Фильтрует по наличию (`stock > 0`)
- 💰 Форматирует цены (копейки → рубли с правильной локализацией)
- 🏷️ Показывает скидку если есть `compareAtPrice`
- 📊 Отображает остаток товара
- 📱 Горизонтальная прокрутка (carousel)

**Дизайн:**
- Карточка товара: 256px ширина
- Изображение 192px высота
- Hover эффект на shadow
- Адаптивно для мобильных

#### API endpoints

Добавлены эндпоинты в [web/src/api/endpoints.ts](web/src/api/endpoints.ts):

```typescript
export const get_products = '/api/shop/products';
export const get_product_by_id = (id: string) => `/api/shop/products/${id}`;
export const get_featured_products = '/api/shop/products?isFeatured=true';
export const get_product_categories = '/api/shop/categories';
```

#### Интеграция в дашборд

Добавлена карусель на [web/src/pages/dashboard.tsx](web/src/pages/dashboard.tsx):

```tsx
import ProductCarousel from '../components/ProductCarousel';

// ...

{/* Featured Products Carousel */}
<div className="bg-white rounded-lg shadow p-6 mb-6">
  <ProductCarousel />
</div>
```

**Расположение:** между блоком "Офферы/Марафоны" и "Призы Колеса Фортуны"

---

## Проверка

### Админ-панель
1. Перейти: https://api-rejuvena.duckdns.org/admin/products
2. Открыть любой товар на редактирование
3. Проверить что цена отображается в рублях (например, `16.00`)
4. Изменить цену, сохранить
5. Убедиться что в БД сохранилось в копейках

### Фронтенд
1. Перейти: https://seplitza.github.io/rejuvena/dashboard
2. Пролистать до секции "Хиты продаж"
3. Должны отображаться товары с `isFeatured: true`
4. Цены должны быть корректными (16.00 ₽, а не 0.16 ₽)

### База данных
```bash
# Проверить цены товаров
mongosh rejuvena --eval "db.products.find({name: /Омега/}, {name: 1, price: 1, isFeatured: 1}).pretty()"
```

Должны быть:
- `price: 1600` (16 рублей)
- `isFeatured: true` для хитов продаж

---

## Структура товаров

### Модель Product
```typescript
interface IProduct {
  name: string;              // Название
  slug: string;              // URL-friendly идентификатор
  price: number;             // Цена в КОПЕЙКАХ
  compareAtPrice?: number;   // Старая цена в КОПЕЙКАХ (для зачеркивания)
  stock: number;             // Остаток на складе
  isFeatured: boolean;       // Хит продаж (выводится в карусели)
  isActive: boolean;         // Активен ли товар
  images: string[];          // Массив URL изображений
  category: ObjectId;        // Категория товара
  // ... другие поля
}
```

### Backend API
- `GET /api/shop/products` - Все активные товары
- `GET /api/shop/products?isFeatured=true` - Только хиты продаж
- `GET /admin/products` - Админский список (все товары)
- `PUT /admin/products/:id` - Обновить товар

---

## Рекомендации

### Добавление нового товара в "Хиты продаж"

1. Зайти в админку: https://api-rejuvena.duckdns.org/admin/products
2. Найти нужный товар
3. Нажать "Изменить"
4. Поставить галочку **"⭐ Хит продаж"** (`isFeatured`)
5. Убедиться что `Остаток на складе > 0`
6. Сохранить

Товар автоматически появится в карусели на фронтенде.

### Формат цен

**Всегда вводите цены в РУБЛЯХ** в админке:
- ✅ Правильно: `16.00` (сохранится как 1600 копеек)
- ❌ Неправильно: `1600` (сохранится как 160000 копеек = 1600 руб)

**В базе данных** цены всегда в копейках:
- `1600` = 16.00 рублей
- `1920` = 19.20 рублей

---

## Коммиты

### Backend
```
Admin-panel: Fix price conversion (rubles ↔ kopecks)
- Convert prices from kopecks to rubles when loading product
- Convert prices from rubles to kopecks when saving product
- Update field labels to clarify price is in rubles
- Add placeholders to guide expected format
```

### Frontend
```
Add product carousel with featured products
- Create ProductCarousel component
- Add shop API endpoints
- Display featured products (isFeatured: true) on dashboard
- Format prices correctly (kopecks to rubles)
- Show discount badges and stock badges
- Horizontal scrollable layout
```

---

## Итоги

✅ **Проблема с ценами решена** - админка корректно конвертирует рубли ↔ копейки  
✅ **База данных исправлена** - все цены в копейках  
✅ **Карусель товаров работает** - выводятся хиты продаж на дашборде  
✅ **Фильтр по isFeatured** - только отмеченные товары появляются в карусели  

**URL для проверки:**
- Админка: https://api-rejuvena.duckdns.org/admin/products
- Фронтенд: https://seplitza.github.io/rejuvena/dashboard

**Дата:** 02.04.2026  
**Время выполнения:** ~1 час
