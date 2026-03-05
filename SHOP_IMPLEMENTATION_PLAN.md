# План реализации интернет-магазина Seplitza Shop

**Дата создания:** 26 февраля 2026 г.  
**Репозиторий:** seplitza/shop  
**Текущая структура:**
- Основной сайт: https://seplitza.github.io
- Rejuvena App: https://seplitza.github.io/rejuvena
- Планируемый магазин: https://seplitza.github.io/shop

**Целевая структура после миграции:**
- Основной сайт: https://seplitza.ru
- Rejuvena App: https://seplitza.ru/rejuvena
- Shop: https://seplitza.ru/shop

---

## 📋 ОГЛАВЛЕНИЕ

1. [Архитектура магазина](#1-архитектура-магазина)
2. [Интеграция с CRM Rejuvena](#2-интеграция-с-crm-rejuvena)
3. [Миграция доменов](#3-миграция-доменов)
4. [Технический стек](#4-технический-стек)
5. [Этапы реализации](#5-этапы-реализации)
6. [Структура базы данных](#6-структура-базы-данных)
7. [Безопасность и тестирование](#7-безопасность-и-тестирование)

---

## 1. АРХИТЕКТУРА МАГАЗИНА

### 1.1 Компоненты системы

```
┌─────────────────────────────────────────────────────────────┐
│                    SEPLITZA ECOSYSTEM                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Rejuvena   │  │     Shop     │  │  Main Site   │      │
│  │   Web App    │  │  (New Store) │  │  (Landing)   │      │
│  │ /rejuvena    │  │    /shop     │  │      /       │      │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘      │
│         │                 │                                  │
│         └─────────────────┴──────────────────┐              │
│                                               │              │
│                    ┌──────────────────────────▼────────┐    │
│                    │   UNIFIED BACKEND API             │    │
│                    │   api-rejuvena.duckdns.org        │    │
│                    │                                    │    │
│                    │  ┌─────────────────────────────┐  │    │
│                    │  │   MongoDB (Unified DB)      │  │    │
│                    │  │  - Users (общая таблица)    │  │    │
│                    │  │  - Products (товары)        │  │    │
│                    │  │  - Orders (заказы)          │  │    │
│                    │  │  - Payments (платежи)       │  │    │
│                    │  │  - MarathonEnrollments      │  │    │
│                    │  │  - ExercisePurchases        │  │    │
│                    │  └─────────────────────────────┘  │    │
│                    │                                    │    │
│                    │  ┌─────────────────────────────┐  │    │
│                    │  │   Admin Panel (React)       │  │    │
│                    │  │  /admin                     │  │    │
│                    │  │  + Shop Management (NEW)    │  │    │
│                    │  └─────────────────────────────┘  │    │
│                    └───────────────────────────────────┘    │
│                                                              │
│                    ┌───────────────────────────────────┐    │
│                    │   Payment Gateway (Alfabank)      │    │
│                    │   payment.alfabank.ru             │    │
│                    └───────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Репозитории

| Репозиторий | Назначение | Технологии |
|-------------|-----------|-----------|
| `seplitza/shop` | Frontend магазина | Next.js 14, TypeScript, Tailwind |
| `Backend-rejuvena/` | Единый backend + админка | Node.js, Express, MongoDB |
| `seplitza/seplitza.github.io` | Главная страница | Static HTML/React |

---

## 2. ИНТЕГРАЦИЯ С CRM REJUVENA

### 2.1 Единая таблица пользователей

**Существующая модель User расширяется:**

```typescript
// Backend-rejuvena/src/models/User.model.ts

export interface IUser extends Document {
  // Существующие поля
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  telegramUsername?: string;
  role: 'superadmin' | 'admin' | 'customer';  // ← добавить 'customer'
  
  // Rejuvena-специфичные
  isPremium?: boolean;
  premiumEndDate?: Date;
  photoDiaryEndDate?: Date;
  isLegacyUser?: boolean;
  azureUserId?: string;
  
  // НОВЫЕ ПОЛЯ ДЛЯ SHOP
  phone?: string;                    // Телефон для доставки
  shippingAddresses?: IShippingAddress[];  // Адреса доставки
  orderCount?: number;               // Количество заказов
  totalSpent?: number;               // Общая сумма покупок
  lastOrderDate?: Date;              // Дата последнего заказа
  shopCustomerSince?: Date;          // Дата первой покупки в магазине
  marketingConsent?: boolean;        // Согласие на рекламу
  birthDate?: Date;                  // Дата рождения для персонализации
  
  // Система скидок
  personalDiscount?: number;         // Личная постоянная скидка (процент)
  personalDiscountExpiry?: Date;     // Срок действия личной скидки
  
  // Предпочитаемые каналы связи
  preferredContactMethod?: 'telegram' | 'whatsapp' | 'viber' | 'vk' | 'sms' | 'email';
  whatsappPhone?: string;
  viberPhone?: string;
  vkUserId?: string;                 // ID пользователя ВКонтакте
  
  // Колесо Фортуны
  fortuneWheelSpins?: number;        // Доступные вращения КФ
  fortuneWheelLastSpin?: Date;       // Последнее вращение
  fortuneWheelGifts?: IWheelGift[];  // Выигранные подарки
  
  // Общие
  contactsEnabled?: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
}

interface IShippingAddress {
  _id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface IWheelGift {
  _id: string;
  type: 'discount' | 'product' | 'freeShipping' | 'personalDiscount';
  value: any;              // Процент скидки / ID товара / срок скидки
  description: string;     // "Скидка 10%", "Бесплатная доставка"
  expiryDate?: Date;       // Срок действия
  isUsed: boolean;
  usedAt?: Date;
  orderId?: string;        // К какому заказу применен
}
```

### 2.2 Новые модели для Shop

#### Product.model.ts
```typescript
export interface IProduct extends Document {
  name: string;
  slug: string;  // URL-friendly название
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;  // Зачеркнутая цена
  sku: string;  // Артикул
  images: string[];  // URLs изображений
  category: mongoose.Types.ObjectId;  // ref: 'ProductCategory'
  tags: string[];
  stock: number;
  isActive: boolean;
  isFeatured: boolean;  // Показывать на главной
  isBundle: boolean;    // Это набор/комплект?
  bundleItems?: IBundleItem[];  // Товары в наборе
  
  // Маркетплейсы
  marketplaces?: {
    wildberries?: {
      url: string;          // Ссылка на WB
      articleWB: string;    // Артикул WB
      lastPrice?: number;   // Последняя известная цена
      lastChecked?: Date;   // Когда обновляли
    };
    ozon?: {
      url: string;
      skuOzon: string;
      lastPrice?: number;
      lastChecked?: Date;
    };
  };
  
  weight?: number;  // Вес для расчета доставки
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    ingredients?: string;  // Состав для косметики
    usage?: string;        // Способ применения
  };
  createdAt: Date;
  updatedAt: Date;
}

interface IBundleItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}
```

#### Order.model.ts
```typescript
export interface IOrder extends Document {
  orderNumber: string;  // Уникальный номер заказа
  userId: mongoose.Types.ObjectId;  // ref: 'User'
  items: IOrderItem[];
  
  // Адрес доставки
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  
  // Финансы
  subtotal: number;      // Сумма товаров
  shippingCost: number;  // Стоимость доставки
  discount: number;      // Скидка (купоны + личная скидка + КФ)
  promoCode?: string;    // Использованный промокод
  promoDiscount?: number; // Скидка по промокоду
  personalDiscount?: number; // Личная скидка клиента
  wheelGiftId?: string;  // ID подарка с Колеса Фортуны
  total: number;         // Итого к оплате
  
  // Статус
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentId?: mongoose.Types.ObjectId;  // ref: 'Payment'
  
  // Доставка СДЭК
  shippingMethod: 'cdek_courier' | 'cdek_pickup' | 'cdek_postamat';
  cdekOrderId?: string;      // ID заказа в системе СДЭК
  cdekTrackingNumber?: string; // Трек-номер СДЭК
  cdekBarcode?: string;      // Штрихкод для получения
  cdekOfficeCode?: string;   // Код ПВЗ/постамата СДЭК
  cdekOfficeName?: string;   // Название ПВЗ
  cdekOfficeAddress?: string; // Адрес ПВЗ
  estimatedDeliveryDate?: Date; // Ожидаемая дата доставки
  
  // Даты
  createdAt: Date;
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
}

interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  productName: string;  // Сохраняем на момент заказа
  quantity: number;
  price: number;        // Цена на момент заказа
}
```

#### ProductCategory.model.ts
```typescript
export interface IProductCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: mongoose.Types.ObjectId;  // Для подкатегорий
  order: number;  // Порядок отображения
  isActive: boolean;
  createdAt: Date;
}
```

#### PromoCode.model.ts
```typescript
export interface IPromoCode extends Document {
  code: string;              // Сам промокод (SUMMER2026)
  discountType: 'percentage' | 'fixed' | 'freeShipping';
  discountValue: number;     // Процент или фиксированная сумма
  minOrderAmount?: number;   // Минимальная сумма заказа
  maxUses?: number;          // Максимальное количество использований
  usedCount: number;         // Сколько раз использован
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  applicableProducts?: mongoose.Types.ObjectId[];  // Только для определенных товаров
  applicableCategories?: mongoose.Types.ObjectId[]; // Только для категорий
  createdBy: mongoose.Types.ObjectId;  // Кто создал (admin)
  createdAt: Date;
}
```

#### FortuneWheelPrize.model.ts
```typescript
export interface IFortuneWheelPrize extends Document {
  name: string;              // "Скидка 15%"
  type: 'discount' | 'product' | 'freeShipping' | 'personalDiscount';
  value: any;                // Значение приза
  probability: number;       // Вероятность выпадения (0-100)
  icon?: string;             // Иконка для визуализации
  validityDays?: number;     // Срок действия в днях
  productId?: mongoose.Types.ObjectId;  // Если приз - товар
  isActive: boolean;
  createdAt: Date;
}
```

#### WheelSpin.model.ts
```typescript
export interface IWheelSpin extends Document {
  userId: mongoose.Types.ObjectId;
  prizeId: mongoose.Types.ObjectId;  // Что выиграл
  isUsed: boolean;           // Приз использован?
  usedAt?: Date;
  orderId?: mongoose.Types.ObjectId;  // К какому заказу применен
  expiryDate: Date;          // Срок действия приза
  createdAt: Date;
}
```

### 2.3 Расширение Payment.model.ts

```typescript
// Добавить в metadata существующей модели Payment
metadata?: {
  // Существующие
  planType?: string;
  type?: 'premium' | 'exercise' | 'marathon' | 'shop_order';  // ← добавить
  
  // НОВОЕ для Shop
  orderId?: string;           // ID заказа из Order.model
  orderNumber?: string;       // Номер заказа для отображения
  shippingCost?: number;      // Стоимость доставки
  productsCount?: number;     // Количество товаров
}
```

### 2.4 Интеграция в Admin Panel

**Новые секции в админке:**

```
Backend-rejuvena/admin-panel/src/pages/
├── Dashboard.tsx              # Добавить виджеты магазина
├── Users.tsx                  # Показывать статистику покупок
├── Orders.tsx                 # ← НОВОЕ: Управление заказами
├── Products.tsx               # ← НОВОЕ: Каталог товаров
├── ProductEditor.tsx          # ← НОВОЕ: Редактор товара
├── ProductCategories.tsx      # ← НОВОЕ: Категории
└── ShopSettings.tsx           # ← НОВОЕ: Настройки доставки, налогов
```

**Обновление Dashboard:**
- Виджет "Продажи магазина за месяц"
- Виджет "Новые заказы" (требуют обработки)
- График выручки (Rejuvena + Shop)
- Топ-продукты

**Обновление Users:**
- Колонка "Заказы" (количество)
- Колонка "Потрачено в Shop"
- Фильтр "Покупатели магазина"

---

## 3. МИГРАЦИЯ ДОМЕНОВ

### 3.1 Текущая ситуация

- GitHub Pages: `seplitza.github.io`
- Domain: `seplitza.ru` (**уже используется, низкий трафик**)
- Текущий магазин: `seplitza.ru/shop` (Tilda или другой конструктор)
- SSL: Автоматический через GitHub Pages

**⚠️ ВАЖНО:** Миграцию домена выполняем **ТОЛЬКО ПОСЛЕ** создания нового магазина и переноса всех товаров. Текущий магазин продолжает работать параллельно.

### 3.2 План миграции (без разрыва сервиса)

#### Фаза 1: Подготовка (1-2 дня)

**1.1. Настройка DNS для seplitza.ru**

```
# В панели управления доменом (Timeweb/Cloudflare)
# Создать A-записи для GitHub Pages:

@        A       185.199.108.153
@        A       185.199.109.153
@        A       185.199.110.153
@        A       185.199.111.153

www      CNAME   seplitza.github.io
```

**1.2. Обновление репозиториев**

Создать файл `CNAME` в каждом репозитории:

```bash
# В seplitza/seplitza.github.io
echo "seplitza.ru" > CNAME

# В seplitza/shop
echo "seplitza.ru" > public/CNAME  # для Next.js статической сборки

# В seplitza/rejuvena (web/)
# Обновить только если он в отдельном репо
```

**1.3. Обновление конфигураций**

```javascript
// seplitza/shop/next.config.js
const isProd = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.DEPLOY_TARGET === 'github';

module.exports = {
  basePath: isGitHubPages ? '/shop' : '',
  assetPrefix: isGitHubPages ? '/shop' : '',
  
  env: {
    NEXT_PUBLIC_API_URL: 'https://api-rejuvena.duckdns.org',
    NEXT_PUBLIC_SITE_URL: isGitHubPages 
      ? 'https://seplitza.github.io/shop'
      : 'https://seplitza.ru/shop'
  }
}
```

```javascript
// Rejuvena: web/next.config.js (обновить)
const isProd = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.DEPLOY_TARGET === 'github';

module.exports = {
  basePath: isGitHubPages ? '/rejuvena' : '',
  assetPrefix: isGitHubPages ? '/rejuvena' : '',
  
  env: {
    NEXT_PUBLIC_API_URL: 'https://api-rejuvena.duckdns.org',
    NEXT_PUBLIC_SITE_URL: isGitHubPages 
      ? 'https://seplitza.github.io/rejuvena'
      : 'https://seplitza.ru/rejuvena'
  }
}
```

#### Фаза 2: Тестирование (2-3 дня)

**2.1. Проверка DNS**
```bash
# Должны резолвиться до GitHub IPs
dig seplitza.ru
dig www.seplitza.ru
```

**2.2. Настройка HTTPS в репозиториях**
- Settings → Pages → Custom domain → `seplitza.ru`
- Дождаться выпуска SSL (24-48 часов)
- Включить "Enforce HTTPS"

**2.3. Тестирование редиректов**
- Проверить все основные страницы
- Проверить работу API запросов
- Проверить платежи (тестовые карты)

#### Фаза 3: Редиректы для старых ссылок (критично!)

**3.1. Создать `_redirects` файл в каждом репо**

```bash
# В seplitza.github.io/public/_redirects (для Netlify)
# Или использовать мета-редиректы для GitHub Pages
```

**3.2. Meta-редиректы для GitHub Pages**

Создать файлы HTML-заглушки:

```html
<!-- seplitza.github.io/rejuvena/index.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <meta http-equiv="refresh" content="0; URL=https://seplitza.ru/rejuvena">
  <link rel="canonical" href="https://seplitza.ru/rejuvena">
  <script>
    window.location.href = 'https://seplitza.ru/rejuvena' + window.location.pathname.replace('/rejuvena', '') + window.location.search + window.location.hash;
  </script>
</head>
<body>
  <p>Redirecting to <a href="https://seplitza.ru/rejuvena">seplitza.ru/rejuvena</a>...</p>
</body>
</html>
```

**3.3. Альтернатива: Cloudflare Page Rules (рекомендуется)**

Если использовать Cloudflare для DNS:

```
# Page Rule #1 (бесплатно до 3 правил)
seplitza.github.io/rejuvena*
→ Forwarding URL (301): https://seplitza.ru/rejuvena$1

# Page Rule #2
seplitza.github.io/shop*
→ Forwarding URL (301): https://seplitza.ru/shop$1
```

#### Фаза 4: Обновление backlinks (параллельно)

**Обновить везде, где размещены ссылки:**
- [ ] Социальные сети (VK, Instagram, Telegram)
- [ ] App Store / Google Play (описание приложения)
- [ ] Email подписи
- [ ] Рекламные кампинии
- [ ] QR-коды на физических материалах

**Создать короткие ссылки (опционально):**
```
seplitza.ru/app   → seplitza.ru/rejuvena
seplitza.ru/m     → seplitza.ru/shop
```

#### Фаза 5: Обновление Backend

```bash
# Backend-rejuvena/.env
ALFABANK_RETURN_URL=https://seplitza.ru/rejuvena/payment/success
ALFABANK_FAIL_URL=https://seplitza.ru/rejuvena/payment/fail

# Для Shop
SHOP_RETURN_URL=https://seplitza.ru/shop/checkout/success
SHOP_FAIL_URL=https://seplitza.ru/shop/checkout/fail
```

Обновить на сервере:
```bash
ssh root@37.252.20.170
cd /var/www/rejuvena-backend
nano .env
# Обновить URLs
pm2 restart rejuvena-backend
```

### 3.3 Замена текущего seplitza.ru/shop

**Текущий магазин:**
- URL: https://seplitza.ru/shop
- Платформа: Вероятно Tilda или другой конструктор

**План замены:**

1. **Сохранить бекап текущего магазина**
   - Экспорт каталога товаров (XLS/CSV)
   - Скриншоты страниц
   - Список активных заказов

2. **Параллельный запуск нового магазина**
   ```
   Старый: https://seplitza.ru/shop
   Новый:  https://seplitza.github.io/shop (временно)
   ```

3. **Тестирование на поддомене**
   ```
   Создать: shop.seplitza.ru → GitHub Pages
   Протестировать полный цикл покупки
   ```

4. **Переключение**
   - Перенос DNS записей
   - Старый магазин → архив (old-shop.seplitza.ru)
   - Новый магазин → основной URL

5. **Миграция данных клиентов**
   - Импорт email-листа в CRM
   - Создание промокодов для старых клиентов
   - Email-уведомление о новом магазине

---

## 4. ТЕХНИЧЕСКИЙ СТЕК

### 4.1 Frontend (seplitza/shop)

```json
{
  "framework": "Next.js 14",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "state": "Redux Toolkit (как в Rejuvena)",
  "forms": "React Hook Form + Zod validation",
  "payments": "Alfabank Payment API",
  "images": "Next/Image с оптимизацией",
  "analytics": "Amplitude (уже используется)"
}
```

**Ключевые библиотеки:**
```json
{
  "dependencies": {
    "next": "^14.0.4",
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3",
    "axios": "^1.13.2",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "swiper": "^11.0.0",  // Карусель товаров
    "framer-motion": "^10.16.0",  // Анимации
    "date-fns": "^4.1.0"
  }
}
```

### 4.2 Backend (расширение текущего)

**Новые роуты:**
```
Backend-rejuvena/src/routes/
├── shop.routes.ts          # Публичное API магазина
├── product.routes.ts       # CRUD товаров (admin)
├── order.routes.ts         # Заказы (admin + customer)
├── cart.routes.ts          # Корзина
├── shipping.routes.ts      # Расчет доставки СДЭК
├── promo-code.routes.ts    # Промокоды (admin + validate)
└── fortune-wheel.routes.ts # Колесо Фортуны
```

**Новые сервисы:**
```
Backend-rejuvena/src/services/
├── cart.service.ts         # Логика корзины
├── order.service.ts        # Обработка заказов
├── cdek.service.ts         # Интеграция с СДЭК API
├── inventory.service.ts    # Управление складом
├── promo-code.service.ts   # Валидация промокодов
├── fortune-wheel.service.ts # Логика Колеса Фортуны
├── notification.service.ts # Отправка в Telegram/VK/WhatsApp/SMS
├── marketplace-parser.service.ts # Парсинг цен с WB/Ozon
└── price-comparison.service.ts   # Сравнение цен
```

### 4.3 Инфраструктура

| Компонент | Текущее решение | Для Shop |
|-----------|-----------------|----------|
| Хостинг Frontend | GitHub Pages | GitHub Pages |
| Backend API | Timeweb VPS (37.252.20.170) | Тот же сервер |
| База данных | MongoDB (на VPS) | Та же база |
| Файлы/изображения | `/uploads` на VPS | Та же папка + CDN (опц.) |
| Платежи | Alfabank Production | Тот же шлюз |
| Email | Mailgun/Resend | Тот же сервис |
| SSL | GitHub Pages (auto) | GitHub Pages (auto) |
| **Доставка** | — | **СДЭК API** |
| **Уведомления** | OneSignal (push) | **+ Telegram Bot API, VK API, WhatsApp Business API** |
| **SMS** | — | **SMS.ru или Twilio** |

---

## 5. ЭТАПЫ РЕАЛИЗАЦИИ

### ЭТАП 1: Подготовка Backend (1 неделя)

**1.1. Модели данных**
- [ ] Создать Product.model.ts (+ маркетплейсы + наборы)
- [ ] Создать Order.model.ts
- [ ] Создать ProductCategory.model.ts
- [ ] Создать PromoCode.model.ts
- [ ] Создать FortuneWheelPrize.model.ts
- [ ] Создать WheelSpin.model.ts
- [ ] Создать MarketplacePrice.model.ts (история цен)
- [ ] Расширить User.model.ts (поля для Shop + скидки + КФ + мессенджеры)
- [ ] Обновить Payment.model.ts (metadata для заказов)

**1.2. API роуты (публичные)**
```typescript
// shop.routes.ts
GET    /api/shop/products          // Список товаров с фильтрами
GET    /api/shop/products/:slug    // Детали товара
GET    /api/shop/categories        // Категории
POST   /api/shop/cart              // Добавить в корзину (session/auth)
GET    /api/shop/cart              // Получить корзину
PUT    /api/shop/cart/:itemId      // Обновить количество
DELETE /api/shop/cart/:itemId      // Удалить из корзины
POST   /api/shop/checkout          // Оформление заказа → Payment
GET    /api/shop/orders/:id        // Статус заказа (auth)

// promo-code.routes.ts
POST   /api/shop/promo-codes/validate  // Проверить промокод

// fortune-wheel.routes.ts
GET    /api/shop/wheel/available   // Доступные вращения
POST   /api/shop/wheel/spin        // Крутить колесо (auth)
GET    /api/shop/wheel/prizes      // Активные призы
GET    /api/shop/wheel/my-gifts    // Мои подарки (auth)

// shipping.routes.ts (СДЭК)
POST   /api/shop/shipping/calculate // Расчет стоимости доставки
GET    /api/shop/shipping/offices   // Ближайшие ПВЗ СДЭК
GET    /api/shop/shipping/track/:barcode // Отслеживание
```

**1.3. API роуты (admin)**
```typescript
// product.routes.ts (authMiddleware + adminOnly)
GET    /api/admin/products         // Список с пагинацией
POST   /api/admin/products         // Создать товар
PUT    /api/admin/products/:id     // Обновить
DELETE /api/admin/products/:id     // Удалить (soft delete)
POST   /api/admin/products/:id/images  // Загрузить изображения

// order.routes.ts (admin)
GET    /api/admin/orders           // Все заказы
PATCH  /api/admin/orders/:id/status // Обновить статус
POST   /api/admin/orders/:id/tracking // Добавить трек-номер
```

**1.4. Сервисы**
- [ ] cart.service.ts (валидация, расчет итого с учетом скидок, наборов)
- [ ] order.service.ts (создание, обновление статуса)
- [ ] cdek.service.ts (API СДЭК: расчет, создание заказа, генерация штрихкода)
- [ ] promo-code.service.ts (валидация промокодов)
- [ ] fortune-wheel.service.ts (логика рандома, начисление призов)
- [ ] notification.service.ts (отправка в Telegram/VK/WhatsApp/SMS)
- [ ] marketplace-parser.service.ts (парсинг WB/Ozon через API/scraping)
- [ ] price-comparison.service.ts (сравнение цен, рекомендации)
- [ ] email templates для заказов (подтверждение, отправка с QR/штрихкодом)

**1.5. Seed данные**
```bash
npm run seed-shop-categories  # Создать демо категории
npm run seed-shop-products    # Создать демо товары (5-10 шт)
npm run seed-wheel-prizes     # Создать призы для Колеса Фортуны
npm run seed-promo-codes      # Создать тестовые промокоды
```

**1.6. Интеграции (настройка)**
- [ ] СДЭК API - получить тестовые credentials
- [ ] Telegram Bot API - создать бота для уведомлений (@SeplitzaShopBot)
- [ ] VK API - создать приложение, получить токен
- [ ] WhatsApp Business API (опционально, платно)
- [ ] SMS.ru - регистрация, API key
- [ ] Wildberries API - получить токен для парсинга цен (если доступно)
- [ ] Ozon Seller API - получить Client ID и API key (если доступно)

**1.7. Cron задачи**
- [ ] Обновление цен маркетплейсов (каждую минуту)
- [ ] Очистка истории цен (старше 30 дней)
- [ ] Проверка доступности товаров на WB/Ozon (раз в час)

### ЭТАП 2: Admin Panel расширение (1 неделя)

**2.1. Новые страницы**
- [ ] Products.tsx - таблица товаров (DataGrid с пагинацией) + бэйджи WB/Ozon
- [ ] ProductEditor.tsx - форма товара (TipTap для описания) + связь с маркетплейсами
- [ ] BundleEditor.tsx - создание наборов товаров
- [ ] ProductCategories.tsx - управление категориями
- [ ] Orders.tsx - таблица заказов с фильтрами + печать этикеток СДЭК
- [ ] OrderDetail.tsx - детали заказа + смена статуса + отправка уведомлений
- [ ] PromoCodes.tsx - управление промокодами
- [ ] PromoCodeEditor.tsx - создание/редактирование промокода
- [ ] FortuneWheel.tsx - настройка призов Колеса Фортуны
- [ ] MarketplacePrices.tsx - мониторинг цен WB/Ozon + графики
- [ ] ShopSettings.tsx - настройки доставки СДЭК, мессенджеров, маркетплейсов

**2.2. Обновление навигации**
```typescript
// admin-panel/src/components/Sidebar.tsx
<nav>
  <NavItem icon="📊" href="/dashboard">Dashboard</NavItem>
  <NavItem icon="👥" href="/users">Users</NavItem>
  
  {/* REJUVENA */}
  <NavSection title="Rejuvena">
    <NavItem icon="🏃" href="/exercises">Exercises</NavItem>
    <NavItem icon="🎯" href="/marathons">Marathons</NavItem>
    <NavItem icon="📧" href="/email-campaigns">Email</NavItem>
  </NavSection>
  
  {/* SHOP - НОВОЕ */}
  <NavSection title="Shop">
    <NavItem icon="📦" href="/products">Products</NavItem>
    <NavItem icon="🛒" href="/orders">Orders</NavItem>
    <NavItem icon="📂" href="/categories">Categories</NavItem>
    <NavItem icon="🎟️" href="/promo-codes">Promo Codes</NavItem>
    <NavItem icon="🎡" href="/fortune-wheel">Fortune Wheel</NavItem>
  </NavSection>
  
  <NavItem icon="💰" href="/revenue">Revenue</NavItem>
  <NavItem icon="⚙️" href="/settings">Settings</NavItem>
</nav>
```

**2.3. Dashboard виджеты**
- Виджет "Заказы сегодня" (ожидают обработки)
- Виджет "Выручка магазина (месяц)"
- График сравнения (Rejuvena vs Shop)
- Виджет "Активные промокоды" (сколько осталось использований)
- Счетчик "Вращений Колеса Фортуны сегодня"

### ЭТАП 3: Shop Frontend (2-3 недели)

**3.1. Структура проекта**
```
seplitza/shop/
├── public/
│   ├── CNAME                  # seplitza.ru
│   └── images/
├── src/
│   ├── pages/
│   │   ├── index.tsx          # Главная магазина
│   │   ├── catalog/
│   │   │   ├── index.tsx      # Каталог с фильтрами
│   │   │   └── [slug].tsx     # Страница товара
│   │   ├── cart.tsx           # Корзина
│   │   ├── checkout/
│   │   │   ├── index.tsx      # Оформление заказа
│   │   │   ├── success.tsx    # Успешная оплата
│   │   │   └── fail.tsx       # Ошибка оплаты
│   │   ├── account/
│   │   │   ├── orders.tsx     # История заказов
│   │   │   ├── profile.tsx    # Профиль + личная скидка
│   │   │   └── wheel.tsx      # Колесо Фортуны + мои подарки
│   │   └── about.tsx
│   ├── components/
│   │   ├── ProductCard.tsx           # + бэйджи WB/Ozon
│   │   ├── ProductGrid.tsx
│   │   ├── PriceComparison.tsx       # Виджет сравнения цен
│   │   ├── MarketplaceBadges.tsx     # Бэйджи маркетплейсов
│   │   ├── BundlePriceCalculator.tsx # Расчет выгоды набора
│   │   ├── Cart/
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── PromoCodeInput.tsx  # Поле для промокода
│   │   ├── Checkout/
│   │   │   ├── ShippingForm.tsx
│   │   │   ├── CdekOfficeSelector.tsx  # Выбор ПВЗ на карте
│   │   │   ├── ContactMethodSelector.tsx  # Выбор мессенджера
│   │   │   └── OrderSummary.tsx
│   │   ├── FortuneWheel/
│   │   │   ├── WheelCanvas.tsx     # Анимация колеса
│   │   │   ├── SpinButton.tsx
│   │   │   └── GiftsList.tsx       # Список подарков
│   │   └── Layout/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── MobileMenu.tsx
│   ├── store/
│   │   ├── index.ts
│   │   ├── slices/
│   │   │   ├── cartSlice.ts
│   │   │   ├── productsSlice.ts
│   │   │   └── userSlice.ts (переиспользовать из Rejuvena)
│   │   └── sagas/
│   ├── api/
│   │   ├── shop.ts
│   │   └── auth.ts (переиспользовать)
│   ├── types/
│   │   ├── product.ts
│   │   ├── order.ts
│   │   └── cart.ts
│   └── utils/
│       ├── formatPrice.ts
│       └── calculateShipping.ts
├── next.config.js
├── tailwind.config.js
└── package.json
```

**3.2. Ключевые компоненты**

```typescript
// components/ProductCard.tsx
interface ProductCardProps {
  product: IProduct;
  onAddToCart: (id: string) => void;
}

// pages/catalog/[slug].tsx
// Детальная страница товара:
// - Галерея изображений (свайпер)
// - Описание, состав
// - Кнопка "В корзину"
// - Похожие товары

// pages/checkout/index.tsx
// Мультишаговый чекаут:
// 1. Адрес доставки
// 2. Способ доставки
// 3. Подтверждение → создание Payment → редирект на Alfabank
```

**3.3. Redux Store**

```typescript
// store/slices/cartSlice.ts
interface CartState {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
}

// Действия:
// - addToCart(productId, quantity)
// - removeFromCart(itemId)
// - updateQuantity(itemId, quantity)
// - clearCart()
// - setShippingMethod(method)
```

### ЭТАП 4: Интеграция платежей (3-5 дней)

**4.1. Создание платежа для заказа**

```typescript
// Backend: order.service.ts
async function createOrderWithPayment(userId, orderData) {
  // 1. Создать Order (status: 'pending')
  const order = await Order.create({
    userId,
    orderNumber: await generateOrderNumber(),
    items: orderData.items,
    shippingAddress: orderData.shippingAddress,
    subtotal: calculateSubtotal(orderData.items),
    shippingCost: orderData.shippingCost,
    total: ...,
    status: 'pending',
    paymentStatus: 'pending'
  });
  
  // 2. Создать Payment
  const payment = await Payment.create({
    userId,
    orderNumber: order.orderNumber,
    amount: order.total * 100,  // в копейках
    currency: '643',
    status: 'pending',
    description: `Заказ #${order.orderNumber}`,
    metadata: {
      type: 'shop_order',
      orderId: order._id,
      orderNumber: order.orderNumber,
      productsCount: order.items.length
    }
  });
  
  // 3. Зарегистрировать в Alfabank
  const alfaResponse = await alfabankService.registerOrder({
    orderNumber: order.orderNumber,
    amount: order.total * 100,
    description: `Оплата заказа #${order.orderNumber}`,
    returnUrl: process.env.SHOP_RETURN_URL,
    failUrl: process.env.SHOP_FAIL_URL,
    jsonParams: {
      userId,
      orderId: order._id,
      type: 'shop_order'
    }
  });
  
  payment.alfaBankOrderId = alfaResponse.orderId;
  payment.paymentUrl = alfaResponse.formUrl;
  payment.status = 'processing';
  await payment.save();
  
  order.paymentId = payment._id;
  await order.save();
  
  return { order, paymentUrl: payment.paymentUrl };
}
```

**4.2. Webhook обработка**

```typescript
// routes/webhook.routes.ts (существующий файл, расширить)
router.post('/alfabank/webhook', async (req, res) => {
  const { orderNumber, status } = req.body;
  
  const payment = await Payment.findOne({ orderNumber });
  if (!payment) return res.status(404).send('Not found');
  
  // Обновить статус платежа
  payment.status = mapAlfabankStatus(status);
  if (status === 2) {  // Успешная оплата
    payment.status = 'succeeded';
    payment.paidAt = new Date();
  }
  await payment.save();
  
  // НОВОЕ: для shop_order обновить Order
  if (payment.metadata?.type === 'shop_order') {
    const order = await Order.findById(payment.metadata.orderId);
    if (order) {
      if (status === 2) {
        order.paymentStatus = 'paid';
        order.status = 'paid';
        order.paidAt = new Date();
        
        // Отправить email подтверждения
        await emailService.sendOrderConfirmation(order);
        
        // Уменьшить stock товаров
        await updateInventory(order.items);
      }
      await order.save();
    }
  }
  
  res.status(200).send('OK');
});
```

**4.3. Email уведомления**

Создать новые шаблоны:
- `order-confirmation` - подтверждение заказа
- `order-shipped` - товар отправлен (с трек-номером)
- `order-delivered` - доставлен

### ЭТАП 5: Миграция доменов (см. раздел 3)

### ЭТАП 6: Тестирование (1 неделя)

**6.1. Функциональное тестирование**
- [ ] Добавление товара в корзину
- [ ] Изменение количества
- [ ] Оформление заказа (гость + авторизованный)
- [ ] Тестовая оплата (Alfabank test cards)
- [ ] Webhook обработка
- [ ] Email уведомления
- [ ] Обновление статуса заказа в админке
- [ ] Добавление трек-номера

**6.2. Тестирование редиректов**
- [ ] seplitza.github.io/rejuvena → seplitza.ru/rejuvena
- [ ] seplitza.github.io/shop → seplitza.ru/shop
- [ ] Старые ссылки из соцсетей
- [ ] Deep links из мобильного приложения

**6.3. Нагрузочное тестирование (опционально)**
- Одновременные заказы
- Проверка race conditions в обновлении stock

### ЭТАП 7: Деплой и запуск (2-3 дня)

**7.1. Деплой Backend**
```bash
cd Backend-rejuvena
npm run build
./deploy.sh  # Существующий скрипт, обновить для новых моделей
```

**7.2. Деплой Admin Panel**
```bash
cd Backend-rejuvena/admin-panel
npm run build
./deploy-admin.sh
```

**7.3. Деплой Shop Frontend**
```bash
cd seplitza/shop
npm run build
npm run deploy  # Добавить gh-pages скрипт
```

**7.4. Миграция DNS**
- Переключить seplitza.ru на новую инфраструктуру
- Мониторинг 24/7 первые 48 часов

---

## 6. СТРУКТУРА БАЗЫ ДАННЫХ

### 6.1 Коллекции MongoDB

```
rejuvena-db/
├── users                   # Единая таблица (Rejuvena + Shop)
├── products                # Товары магазина (+ маркетплейсы + наборы)
├── productcategories       # Категории
├── orders                  # Заказы магазина
├── payments                # Платежи (общая для всех)
├── promocodes              # Промокоды (купоны)
├── fortunewheelprizes      # Призы Колеса Фортуны
├── wheelspins              # История вращений КФ
├── marketplaceprices       # История цен WB/Ozon
├── exercises               # Упражнения Rejuvena
├── marathons               # Марафоны
├── marathonenrollments     # Записи на марафоны
├── exercisepurchases       # Покупки упражнений
└── photodiaries            # Фотодневники
```

### 6.2 Индексы

```javascript
// Products
db.products.createIndex({ slug: 1 }, { unique: true });
db.products.createIndex({ category: 1, isActive: 1 });
db.products.createIndex({ tags: 1 });
db.products.createIndex({ isFeatured: 1, isActive: 1 });

// Orders
db.orders.createIndex({ orderNumber: 1 }, { unique: true });
db.orders.createIndex({ userId: 1, createdAt: -1 });
db.orders.createIndex({ status: 1, paymentStatus: 1 });
db.orders.createIndex({ createdAt: -1 });
db.orders.createIndex({ cdekOrderId: 1 });

// Users (добавить новые индексы)
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ shopCustomerSince: 1 });  // Новый
db.users.createIndex({ telegramUsername: 1 });   // Новый
db.users.createIndex({ vkUserId: 1 });           // Новый

// PromoCodes
db.promocodes.createIndex({ code: 1 }, { unique: true });
db.promocodes.createIndex({ isActive: 1, validUntil: 1 });

// WheelSpins
db.wheelspins.createIndex({ userId: 1, createdAt: -1 });
db.wheelspins.createIndex({ isUsed: 1, expiryDate: 1 });

// MarketplacePrices
db.marketplaceprices.createIndex({ productId: 1, marketplace: 1, createdAt: -1 });
db.marketplaceprices.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // TTL 30 дней
```

### 6.3 Миграция данных

Если текущий магазин имеет клиентов:

```javascript
// scripts/migrate-old-shop-customers.ts
import mongoose from 'mongoose';
import User from '../models/User.model';
import csv from 'csv-parser';

async function migrateCustomers() {
  // 1. Импорт из CSV (экспорт из старого магазина)
  const customers = [];
  fs.createReadStream('old-shop-customers.csv')
    .pipe(csv())
    .on('data', (row) => customers.push(row))
    .on('end', async () => {
      // 2. Создать пользователей
      for (const customer of customers) {
        const existingUser = await User.findOne({ email: customer.email });
        if (existingUser) {
          // Обновить существующего (добавить shop поля)
          existingUser.phone = customer.phone;
          existingUser.shopCustomerSince = new Date(customer.firstOrderDate);
          existingUser.orderCount = customer.orderCount || 0;
          existingUser.totalSpent = customer.totalSpent || 0;
          await existingUser.save();
        } else {
          // Создать нового
          await User.create({
            email: customer.email,
            password: generateRandomPassword(),  // Пусть потом сбросит
            firstName: customer.firstName,
            lastName: customer.lastName,
            phone: customer.phone,
            role: 'customer',
            shopCustomerSince: new Date(customer.firstOrderDate),
            orderCount: customer.orderCount || 0,
            totalSpent: customer.totalSpent || 0,
            marketingConsent: customer.marketingConsent
          });
        }
      }
      
      // 3. Отправить приветственные email с инструкциями
      // "Мы обновили магазин! Вот ваши данные для входа..."
    });
}
```

---

## 7. БЕЗОПАСНОСТЬ И ТЕСТИРОВАНИЕ

### 7.1 Безопасность

**7.1.1 Backend**
- [ ] Валидация всех входных данных (express-validator)
- [ ] Rate limiting на checkout API (10 запросов/минуту)
- [ ] CSRF защита для форм
- [ ] Проверка stock перед созданием заказа (race condition)
- [ ] Логирование всех платежей

**7.1.2 Frontend**
- [ ] Валидация форм (Zod схемы)
- [ ] XSS защита (DOMPurify для user content)
- [ ] Secure cookies для корзины
- [ ] HTTPS only

**7.1.3 Платежи**
- [ ] Проверка подлинности webhook (checksum от Alfabank)
- [ ] Двойная проверка суммы (фронт vs бэк)
- [ ] Логирование всех транзакций
- [ ] Алерты на подозрительную активность

### 7.2 Мониторинг

```javascript
// Backend: middleware/monitoring.ts
import winston from 'winston';

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'shop-errors.log', level: 'error' }),
    new winston.transports.File({ filename: 'shop-orders.log' })
  ]
});

// Логировать критичные события
router.post('/checkout', async (req, res) => {
  logger.info('Checkout started', { userId: req.userId, items: req.body.items.length });
  // ...
});
```

**Метрики для отслеживания:**
- Conversion rate (посетители → заказы)
- Брошенные корзины
- Средний чек
- Время оформления заказа
- Ошибки оплаты (по типу)

### 7.3 Бэкапы

```bash
# Ежедневный бэкап MongoDB (добавить в cron)
0 3 * * * mongodump --db rejuvena-db --out /backups/$(date +\%Y\%m\%d)

# Хранить 30 дней
find /backups -mtime +30 -delete
```

---

## 8. ДОКУМЕНТАЦИЯ ДЛЯ КОМАНДЫ

### 8.1 Создать в Backend-rejuvena/docs/

- `SHOP_API.md` - документация API магазина
- `SHOP_ADMIN_GUIDE.md` - руководство по админке (обработка заказов)
- `SHOP_DEPLOYMENT.md` - инструкции по деплою

### 8.2 Видео-туториал (опционально)

- Как добавить товар в админке
- Как обработать заказ
- Как добавить трек-номер

---

## 9. ЧЕКЛИСТ ЗАПУСКА

### 9.1 До релиза

- [ ] **Backend:**
  - [ ] Все модели созданы и протестированы
  - [ ] API роуты работают (Postman коллекция)
  - [ ] Webhook обработка настроена
  - [ ] Email шаблоны созданы
  - [ ] Миграция данных из старого магазина (если нужно)

- [ ] **Admin Panel:**
  - [ ] Все страницы работают
  - [ ] Можно создать товар с изображениями
  - [ ] Можно изменить статус заказа
  - [ ] Dashboard показывает статистику

- [ ] **Shop Frontend:**
  - [ ] Каталог загружается
  - [ ] Корзина работает
  - [ ] Чекаут проходит успешно
  - [ ] Редиректы после оплаты работают
  - [ ] Мобильная версия адаптирована

- [ ] **Домены:**
  - [ ] DNS настроен
  - [ ] SSL сертификаты выпущены
  - [ ] Редиректы со старых URL работают
  - [ ] Backend URLs обновлены

- [ ] **Платежи:**
  - [ ] Тестовые платежи проходят
  - [ ] Webhook получает уведомления
  - [ ] Email отправляются после оплаты
  - [ ] Боевые credentials Alfabank настроены

### 9.2 В день запуска

1. **08:00** - Финальный бэкап всего
2. **09:00** - Деплой Backend
3. **09:30** - Деплой Admin Panel
4. **10:00** - Деплой Shop Frontend
5. **10:30** - Переключение DNS
6. **11:00** - Тестовый заказ на проде
7. **11:30** - Анонс в соцсетях
8. **12:00** - Мониторинг метрик

### 9.3 После запуска (первая неделя)

- [ ] Ежедневный мониторинг заказов
- [ ] Отслеживание ошибок в Sentry (если подключен)
- [ ] Фидбек от первых клиентов
- [ ] Корректировка UX по результатам A/B тестов

---

## 10. РИСКИ И МИТИГАЦИЯ

| Риск | Вероятность | Влияние | Митигация |
|------|-------------|---------|-----------|
| Потеря старых клиентов при миграции домена | Средняя | Высокое | Редиректы 301, email-уведомления, промокоды для старых клиентов |
| Проблемы с оплатами в первый день | Средняя | Критич. | Двойное тестирование, мониторинг webhook в реальном времени |
| Нехватка inventory (overselling) | Низкая | Среднее | Проверка stock при checkout + блокировка товара в БД |
| Падение сервера под нагрузкой | Низкая | Высокое | Nginx rate limiting, мониторинг CPU/RAM, план масштабирования |
| Конфликт данных между Rejuvena и Shop | Средняя | Среднее | Единая User модель, тестирование сценариев (один пользователь покупает и марафон, и товар) |

---

## 11. ROADMAP ПОСЛЕ ЗАПУСКА

### Версия 1.1 (уже в MVP)

- [x] ✅ Промокоды (купоны)
- [x] ✅ Колесо Фортуны с подарками
- [x] ✅ Интеграция с СДЭК (расчет доставки, ПВЗ, штрихкоды)
- [x] ✅ Система личных скидок
- [x] ✅ Выбор мессенджера для уведомлений
- [x] ✅ Интеграция с соцсетями РФ (VK, Telegram)

### Версия 1.2 (через 1-2 месяца)

- [ ] Система отзывов на товары
- [ ] Накопительная программа лояльности (бонусные баллы)
- [ ] Персонализированные рекомендации
- [ ] Автопостинг в VK о новых товарах

### Версия 1.2 (через 3-6 месяцев)

- [ ] Мобильное приложение Shop (React Native, переиспользовать компоненты Rejuvena)
- [ ] Подписки на товары (ежемесячная доставка)
- [ ] Интеграция с Instagram Shopping
- [ ] Партнерская программа (реферальные ссылки)

---

## 12. ДЕТАЛЬНОЕ ОПИСАНИЕ НОВЫХ ФУНКЦИЙ

### 12.1 Интеграция с СДЭК

#### API Endpoints
```typescript
// cdek.service.ts

interface ICdekCalculateRequest {
  fromLocation: { code: number };  // Код города отправителя
  toLocation: { code: number };    // Код города получателя
  packages: Array<{
    weight: number;     // Вес в граммах
    length: number;     // Длина в см
    width: number;
    height: number;
  }>;
}

interface ICdekCalculateResponse {
  deliverySum: number;           // Стоимость доставки
  periodMin: number;             // Минимальный срок в днях
  periodMax: number;             // Максимальный срок
  tariffCode: number;
  tariffName: string;
}

// Основные методы
async function calculateDelivery(data: ICdekCalculateRequest): Promise<ICdekCalculateResponse>
async function getOffices(cityCode: number): Promise<ICdekOffice[]>  // Список ПВЗ
async function createOrder(orderData): Promise<{ uuid: string }>
async function generateBarcode(orderUuid: string): Promise<Buffer>  // PNG штрихкода
async function trackOrder(cdekOrderId: string): Promise<ITrackingInfo>
```

#### Поток создания заказа СДЭК
1. Пользователь выбирает товары → переходит к checkout
2. Вводит город → GET `/api/shop/shipping/offices?city=Москва`
3. Выбирает ПВЗ на карте (Yandex Maps + маркеры)
4. POST `/api/shop/shipping/calculate` → получает стоимость
5. Подтверждает заказ → создается Order + Payment
6. После оплаты webhook → `cdek.service.createOrder()` → получаем UUID
7. Генерируем штрихкод → отправляем email с QR/штрихкодом

#### Email с информацией о доставке
```html
<h2>Ваш заказ #00123 оплачен!</h2>
<p>Ожидаемая дата доставки: 3-5 марта 2026</p>
<p><strong>Пункт выдачи СДЭК:</strong><br>
ул. Ленина, д. 10 (м. Чистые пруды)<br>
Режим работы: Пн-Пт 9:00-21:00</p>

<p>Для получения заказа предъявите штрихкод:</p>
<img src="cid:barcode" alt="Barcode" />
<p>Трек-номер: 1234567890</p>
<a href="https://seplitza.ru/shop/account/orders/00123">Отследить посылку</a>
```

### 12.2 Система промокодов

#### Типы промокодов
1. **Процентная скидка** - `SUMMER15` → 15%
2. **Фиксированная скидка** - `SAVE500` → 500₽
3. **Бесплатная доставка** - `FREESHIP`
4. **Подарок к заказу** - `GIFT2026` → добавляет товар бесплатно

#### Валидация промокода
```typescript
// promo-code.service.ts
async function validatePromoCode(code: string, cart: CartItem[]): Promise<IPromoCodeResult> {
  const promo = await PromoCode.findOne({ code: code.toUpperCase(), isActive: true });
  
  if (!promo) throw new Error('Промокод не найден');
  if (new Date() > promo.validUntil) throw new Error('Промокод истек');
  if (promo.maxUses && promo.usedCount >= promo.maxUses) throw new Error('Промокод исчерпан');
  
  // Проверка минимальной суммы
  const cartTotal = calculateCartTotal(cart);
  if (promo.minOrderAmount && cartTotal < promo.minOrderAmount) {
    throw new Error(`Минимальная сумма заказа ${promo.minOrderAmount}₽`);
  }
  
  // Проверка применимости к товарам
  if (promo.applicableProducts?.length > 0) {
    const hasApplicable = cart.some(item => 
      promo.applicableProducts.includes(item.productId)
    );
    if (!hasApplicable) throw new Error('Промокод не применим к товарам в корзине');
  }
  
  return {
    valid: true,
    discountAmount: calculateDiscount(promo, cart),
    promo
  };
}
```

#### UI в корзине
```tsx
// components/Cart/PromoCodeInput.tsx
<div className="promo-input">
  <input 
    placeholder="Введите промокод" 
    value={code}
    onChange={(e) => setCode(e.target.value.toUpperCase())}
  />
  <button onClick={applyPromoCode}>Применить</button>
  
  {appliedPromo && (
    <div className="success">
      ✅ Промокод "{appliedPromo.code}" применен! Скидка: {discount}₽
    </div>
  )}
</div>
```

### 12.3 Колесо Фортуны

#### Механика
- Пользователь получает **1 вращение** при:
  - Регистрации (+1)
  - Каждом заказе от 2000₽ (+1)
  - День рождения (+3)
  - Ежедневный вход (streak: 7 дней подряд → +1)
  
#### Призы и вероятности
```typescript
const WHEEL_PRIZES = [
  { name: 'Скидка 5%', type: 'discount', value: 5, probability: 30 },
  { name: 'Скидка 10%', type: 'discount', value: 10, probability: 20 },
  { name: 'Скидка 15%', type: 'discount', value: 15, probability: 10 },
  { name: 'Бесплатная доставка', type: 'freeShipping', probability: 15 },
  { name: 'Подарок (крем)', type: 'product', value: productId, probability: 5 },
  { name: 'Личная скидка 7% на год', type: 'personalDiscount', value: 7, probability: 3 },
  { name: 'Попробуй еще', type: 'nothing', probability: 17 }
];
```

#### Алгоритм розыгрыша
```typescript
// fortune-wheel.service.ts
async function spinWheel(userId: string): Promise<IWheelResult> {
  const user = await User.findById(userId);
  
  if (!user.fortuneWheelSpins || user.fortuneWheelSpins <= 0) {
    throw new Error('Нет доступных вращений');
  }
  
  // Weighted random
  const prizes = await FortuneWheelPrize.find({ isActive: true });
  const totalProbability = prizes.reduce((sum, p) => sum + p.probability, 0);
  const random = Math.random() * totalProbability;
  
  let sum = 0;
  let wonPrize = null;
  for (const prize of prizes) {
    sum += prize.probability;
    if (random <= sum) {
      wonPrize = prize;
      break;
    }
  }
  
  // Создать запись о выигрыше
  const wheelSpin = await WheelSpin.create({
    userId,
    prizeId: wonPrize._id,
    expiryDate: wonPrize.validityDays 
      ? addDays(new Date(), wonPrize.validityDays)
      : addMonths(new Date(), 1),
    isUsed: false
  });
  
  // Уменьшить количество вращений
  user.fortuneWheelSpins -= 1;
  
  // Сохранить в историю подарков
  user.fortuneWheelGifts = user.fortuneWheelGifts || [];
  user.fortuneWheelGifts.push({
    type: wonPrize.type,
    value: wonPrize.value,
    description: wonPrize.name,
    expiryDate: wheelSpin.expiryDate,
    isUsed: false
  });
  
  await user.save();
  
  return { prize: wonPrize, spinId: wheelSpin._id };
}
```

#### Frontend анимация
```tsx
// components/FortuneWheel/WheelCanvas.tsx
// Использовать Canvas API + анимация через requestAnimationFrame
// Или библиотеку react-wheel-of-prizes

<WheelCanvas 
  prizes={prizes}
  onSpinEnd={(prizeIndex) => {
    showPrizeModal(prizes[prizeIndex]);
  }}
/>

<button onClick={handleSpin} disabled={spinsLeft === 0}>
  Крутить колесо ({spinsLeft} осталось)
</button>
```

### 12.4 Выбор канала уведомлений

#### UI при оформлении заказа
```tsx
// components/Checkout/ContactMethodSelector.tsx
<div className="contact-method">
  <h3>Как вам удобнее получить уведомление о заказе?</h3>
  
  <label>
    <input type="radio" name="method" value="telegram" />
    <span>📱 Telegram</span>
    {method === 'telegram' && (
      <input placeholder="@username" value={telegramUsername} />
    )}
  </label>
  
  <label>
    <input type="radio" name="method" value="whatsapp" />
    <span>💬 WhatsApp</span>
    {method === 'whatsapp' && (
      <input placeholder="+7 900 123-45-67" />
    )}
  </label>
  
  <label>
    <input type="radio" name="method" value="vk" />
    <span>📘 ВКонтакте</span>
    {method === 'vk' && (
      <button onClick={connectVK}>Подключить VK</button>
    )}
  </label>
  
  <label>
    <input type="radio" name="method" value="sms" />
    <span>📧 SMS на телефон</span>
  </label>
  
  <label>
    <input type="radio" name="method" value="email" checked />
    <span>📬 Email (по умолчанию)</span>
  </label>
</div>
```

#### Отправка уведомлений
```typescript
// notification.service.ts
async function sendOrderNotification(order: IOrder, event: 'created' | 'paid' | 'shipped' | 'delivered') {
  const user = await User.findById(order.userId);
  const method = user.preferredContactMethod || 'email';
  
  const message = getMessageTemplate(order, event);
  
  switch (method) {
    case 'telegram':
      await sendTelegramMessage(user.telegramUsername, message);
      break;
    case 'whatsapp':
      await sendWhatsAppMessage(user.whatsappPhone, message);
      break;
    case 'viber':
      await sendViberMessage(user.viberPhone, message);
      break;
    case 'vk':
      await sendVKMessage(user.vkUserId, message);
      break;
    case 'sms':
      await sendSMS(user.phone, message);
      break;
    default:
      await emailService.sendOrderUpdate(user.email, order, event);
  }
}
```

#### Интеграция с VK API
```typescript
// Постинг в группу VK о новом заказе
async function postToVKGroup(order: IOrder) {
  const vk = new VK({ token: process.env.VK_ACCESS_TOKEN });
  
  await vk.api.wall.post({
    owner_id: -YOUR_GROUP_ID,
    from_group: 1,
    message: `🎉 Новый заказ #${order.orderNumber}!
${order.items.map(i => `• ${i.productName}`).join('\n')}

Спасибо за покупку! Отследить заказ: https://seplitza.ru/shop/track/${order.cdekBarcode}`,
    attachments: order.items[0].productImage  // Фото первого товара
  });
}
```

### 12.5 Система личных скидок

#### Присвоение скидки
```typescript
// В админке: Users.tsx → кнопка "Установить скидку"
async function assignPersonalDiscount(userId: string, discount: number, expiryMonths: number) {
  const user = await User.findById(userId);
  
  user.personalDiscount = discount;
  user.personalDiscountExpiry = addMonths(new Date(), expiryMonths);
  
  await user.save();
  
  // Уведомить пользователя
  await notification.service.send(user, {
    title: `Вам назначена персональная скидка ${discount}%!`,
    body: `Действует до ${format(user.personalDiscountExpiry, 'dd.MM.yyyy')}. 
           Скидка применяется автоматически ко всем заказам.`
  });
}
```

#### Призвание в Колесе Фортуны
```typescript
// Приз "Личная скидка 7% на год"
{
  name: 'Личная скидка 7% на год',
  type: 'personalDiscount',
  value: 7,
  probability: 3,
  validityDays: 365
}

// При выигрыше
if (wonPrize.type === 'personalDiscount') {
  user.personalDiscount = wonPrize.value;
  user.personalDiscountExpiry = addDays(new Date(), wonPrize.validityDays);
}
```

#### Отображение в профиле
```tsx
// pages/account/profile.tsx
<div className="personal-discount-card">
  {user.personalDiscount && !isExpired(user.personalDiscountExpiry) ? (
    <>
      <h3>🎁 Ваша персональная скидка</h3>
      <div className="discount-badge">{user.personalDiscount}%</div>
      <p>Действует до {format(user.personalDiscountExpiry, 'dd MMMM yyyy')}</p>
      <p className="hint">Применяется автоматически ко всем заказам</p>
    </>
  ) : (
    <p>У вас пока нет персональной скидки. 
       Участвуйте в акциях и крутите Колесо Фортуны!</p>
  )}
</div>
```

#### Применение при checkout
```typescript
// order.service.ts - расчет итоговой суммы
function calculateOrderTotal(cart: CartItem[], user: IUser, promoCode?: IPromoCode): number {
  let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  let discount = 0;
  
  // 1. Промокод
  if (promoCode) {
    discount += calculatePromoDiscount(promoCode, subtotal);
  }
  
  // 2. Личная скидка (если промокода нет или он не конфликтует)
  if (user.personalDiscount && !isExpired(user.personalDiscountExpiry)) {
    // Личная скидка не складывается с промокодом, берем максимальную
    const personalDiscount = subtotal * (user.personalDiscount / 100);
    discount = Math.max(discount, personalDiscount);
  }
  
  // 3. Подарок с Колеса Фортуны
  const wheelGift = user.fortuneWheelGifts?.find(g => 
    g.type === 'discount' && !g.isUsed && !isExpired(g.expiryDate)
  );
  if (wheelGift) {
    discount += subtotal * (wheelGift.value / 100);
  }
  
  const shippingCost = calculateShipping(cart);
  
  return subtotal - discount + shippingCost;
}
```

### 12.6 Интеграция с маркетплейсами (Wildberries, Ozon)

#### Модель истории цен
```typescript
// MarketplacePrice.model.ts
export interface IMarketplacePrice extends Document {
  productId: mongoose.Types.ObjectId;  // ref: 'Product'
  marketplace: 'wildberries' | 'ozon';
  price: number;
  discountPrice?: number;    // Цена со скидкой
  inStock: boolean;          // Доступность
  rating?: number;           // Рейтинг на площадке
  reviewsCount?: number;     // Количество отзывов
  url: string;               // Ссылка на товар
  createdAt: Date;           // Время сбора данных
}
```

#### Парсинг цен с маркетплейсов
```typescript
// marketplace-parser.service.ts

import axios from 'axios';
import cheerio from 'cheerio';

// Wildberries API (если доступно) или scraping
async function fetchWildberriesPrice(articleWB: string): Promise<number | null> {
  try {
    // Вариант 1: API (если есть доступ)
    const response = await axios.get(
      `https://card.wb.ru/cards/detail?appType=1&curr=rub&nm=${articleWB}`
    );
    const product = response.data?.data?.products?.[0];
    if (!product) return null;
    
    const price = product.salePriceU / 100; // Цена в рублях
    return price;
  } catch (error) {
    // Вариант 2: Парсинг HTML (fallback)
    try {
      const html = await axios.get(
        `https://www.wildberries.ru/catalog/${articleWB}/detail.aspx`
      );
      const $ = cheerio.load(html.data);
      const priceText = $('.price-block__final-price').text();
      const price = parseFloat(priceText.replace(/[^\d]/g, ''));
      return price;
    } catch {
      console.error(`Failed to fetch WB price for ${articleWB}`);
      return null;
    }
  }
}

// Ozon Seller API (требует регистрации продавца)
async function fetchOzonPrice(skuOzon: string): Promise<number | null> {
  try {
    const response = await axios.post(
      'https://api-seller.ozon.ru/v2/product/info',
      {
        product_id: parseInt(skuOzon),
        sku: skuOzon
      },
      {
        headers: {
          'Client-Id': process.env.OZON_CLIENT_ID,
          'Api-Key': process.env.OZON_API_KEY
        }
      }
    );
    
    const price = response.data?.result?.price;
    return price;
  } catch (error) {
    // Fallback: публичный API или scraping
    try {
      const html = await axios.get(
        `https://www.ozon.ru/product/${skuOzon}/`
      );
      const $ = cheerio.load(html.data);
      const priceText = $('[data-widget="webPrice"]').text();
      const price = parseFloat(priceText.replace(/[^\d]/g, ''));
      return price;
    } catch {
      console.error(`Failed to fetch Ozon price for ${skuOzon}`);
      return null;
    }
  }
}

// Обновление цен для всех товаров
export async function updateAllMarketplacePrices() {
  const products = await Product.find({
    $or: [
      { 'marketplaces.wildberries.articleWB': { $exists: true } },
      { 'marketplaces.ozon.skuOzon': { $exists: true } }
    ]
  });
  
  for (const product of products) {
    // Wildberries
    if (product.marketplaces?.wildberries?.articleWB) {
      const wbPrice = await fetchWildberriesPrice(
        product.marketplaces.wildberries.articleWB
      );
      
      if (wbPrice !== null) {
        // Сохранить в историю
        await MarketplacePrice.create({
          productId: product._id,
          marketplace: 'wildberries',
          price: wbPrice,
          inStock: wbPrice > 0,
          url: product.marketplaces.wildberries.url
        });
        
        // Обновить в Product
        product.marketplaces.wildberries.lastPrice = wbPrice;
        product.marketplaces.wildberries.lastChecked = new Date();
      }
    }
    
    // Ozon
    if (product.marketplaces?.ozon?.skuOzon) {
      const ozonPrice = await fetchOzonPrice(
        product.marketplaces.ozon.skuOzon
      );
      
      if (ozonPrice !== null) {
        await MarketplacePrice.create({
          productId: product._id,
          marketplace: 'ozon',
          price: ozonPrice,
          inStock: ozonPrice > 0,
          url: product.marketplaces.ozon.url
        });
        
        product.marketplaces.ozon.lastPrice = ozonPrice;
        product.marketplaces.ozon.lastChecked = new Date();
      }
    }
    
    await product.save();
  }
}
```

#### Cron задача (каждую минуту)
```typescript
// Backend-rejuvena/src/jobs/update-marketplace-prices.ts
import cron from 'node-cron';
import { updateAllMarketplacePrices } from '../services/marketplace-parser.service';

// Каждую минуту
cron.schedule('* * * * *', async () => {
  console.log('Updating marketplace prices...');
  try {
    await updateAllMarketplacePrices();
    console.log('Marketplace prices updated successfully');
  } catch (error) {
    console.error('Error updating marketplace prices:', error);
  }
});
```

#### UI: Бэйджи маркетплейсов
```tsx
// components/MarketplaceBadges.tsx
interface MarketplaceBadgesProps {
  product: IProduct;
}

export function MarketplaceBadges({ product }: MarketplaceBadgesProps) {
  const { marketplaces } = product;
  
  return (
    <div className="flex gap-2">
      {marketplaces?.wildberries && (
        <a 
          href={marketplaces.wildberries.url}
          target="_blank"
          rel="noopener noreferrer"
          className="badge badge-wb"
        >
          <img src="/badges/wb-logo.svg" alt="WB" className="h-4" />
          Wildberries
          {marketplaces.wildberries.lastPrice && (
            <span className="ml-1 font-bold">
              {formatPrice(marketplaces.wildberries.lastPrice)}
            </span>
          )}
        </a>
      )}
      
      {marketplaces?.ozon && (
        <a 
          href={marketplaces.ozon.url}
          target="_blank"
          rel="noopener noreferrer"
          className="badge badge-ozon"
        >
          <img src="/badges/ozon-logo.svg" alt="Ozon" className="h-4" />
          Ozon
          {marketplaces.ozon.lastPrice && (
            <span className="ml-1 font-bold">
              {formatPrice(marketplaces.ozon.lastPrice)}
            </span>
          )}
        </a>
      )}
    </div>
  );
}
```

#### Компонент сравнения цен
```tsx
// components/PriceComparison.tsx
interface PriceComparisonProps {
  product: IProduct;
  isBundle?: boolean;
  bundleOriginalPrice?: number;
}

export function PriceComparison({ product, isBundle, bundleOriginalPrice }: PriceComparisonProps) {
  const ourPrice = isBundle ? product.price : product.price;
  const originalPrice = isBundle ? bundleOriginalPrice : null;
  
  const wbPrice = product.marketplaces?.wildberries?.lastPrice;
  const ozonPrice = product.marketplaces?.ozon?.lastPrice;
  
  // Найти минимальную цену на маркетплейсах
  const marketplacePrices = [wbPrice, ozonPrice].filter(Boolean);
  const minMarketplacePrice = marketplacePrices.length > 0 
    ? Math.min(...marketplacePrices) 
    : null;
  
  // Расчет выгоды
  const savingsVsMarketplace = minMarketplacePrice 
    ? ((minMarketplacePrice - ourPrice) / minMarketplacePrice * 100).toFixed() 
    : null;
  
  const savingsVsOriginal = originalPrice
    ? ((originalPrice - ourPrice) / originalPrice * 100).toFixed()
    : null;
  
  return (
    <div className="price-comparison">
      <div className="our-price">
        <span className="label">На нашем сайте:</span>
        <span className="price-value">{formatPrice(ourPrice)}</span>
        {originalPrice && (
          <span className="original-price">{formatPrice(originalPrice)}</span>
        )}
      </div>
      
      {minMarketplacePrice && (
        <div className="comparison">
          <div className="marketplace-prices">
            {wbPrice && (
              <div className="price-item">
                <span className="marketplace">WB:</span>
                <span className="price">{formatPrice(wbPrice)}</span>
              </div>
            )}
            {ozonPrice && (
              <div className="price-item">
                <span className="marketplace">Ozon:</span>
                <span className="price">{formatPrice(ozonPrice)}</span>
              </div>
            )}
          </div>
          
          {savingsVsMarketplace && parseFloat(savingsVsMarketplace) > 0 && (
            <div className="savings-badge">
              🎉 Выгоднее на {savingsVsMarketplace}%, чем на маркетплейсах!
            </div>
          )}
          
          {savingsVsMarketplace && parseFloat(savingsVsMarketplace) < 0 && (
            <div className="warning-badge">
              ⚠️ На маркетплейсах дешевле на {Math.abs(parseFloat(savingsVsMarketplace))}%
            </div>
          )}
        </div>
      )}
      
      {isBundle && savingsVsOriginal && (
        <div className="bundle-savings">
          💰 Экономия в наборе: {savingsVsOriginal}% ({formatPrice(originalPrice - ourPrice)})
        </div>
      )}
      
      <div className="last-updated">
        Цены обновлены: {formatDistanceToNow(product.marketplaces?.wildberries?.lastChecked || new Date(), { locale: ru })}
      </div>
    </div>
  );
}
```

### 12.7 Наборы товаров (Bundles)

#### Создание набора в админке
```tsx
// admin-panel/src/pages/BundleEditor.tsx
export function BundleEditor() {
  const [selectedProducts, setSelectedProducts] = useState<Array<{
    productId: string;
    quantity: number;
  }>>([]);
  const [bundlePrice, setBundlePrice] = useState(0);
  
  // Расчет оригинальной стоимости
  const originalPrice = useMemo(() => {
    return selectedProducts.reduce((sum, item) => {
      const product = products.find(p => p._id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);
  }, [selectedProducts]);
  
  const discount = ((originalPrice - bundlePrice) / originalPrice * 100).toFixed();
  
  return (
    <form onSubmit={handleSaveBundle}>
      <h2>Создать набор товаров</h2>
      
      {/* Выбор товаров */}
      <div className="product-selector">
        <label>Товары в наборе:</label>
        <SelectProducts 
          selected={selectedProducts}
          onChange={setSelectedProducts}
        />
      </div>
      
      {/* Расчет цены */}
      <div className="pricing">
        <div className="original-price">
          Оригинальная стоимость: {formatPrice(originalPrice)}
        </div>
        
        <div className="bundle-price-input">
          <label>Цена набора:</label>
          <input 
            type="number" 
            value={bundlePrice}
            onChange={(e) => setBundlePrice(parseFloat(e.target.value))}
          />
        </div>
        
        <div className="discount-display">
          Скидка: {discount}% ({formatPrice(originalPrice - bundlePrice)})
        </div>
      </div>
      
      {/* Сравнение с маркетплейсами */}
      <div className="marketplace-comparison">
        <h3>Сравнение с маркетплейсами</h3>
        {selectedProducts.map(item => {
          const product = products.find(p => p._id === item.productId);
          return (
            <div key={item.productId}>
              {product?.name}
              {product?.marketplaces && (
                <div className="marketplace-prices">
                  WB: {formatPrice(product.marketplaces.wildberries?.lastPrice)}
                  Ozon: {formatPrice(product.marketplaces.ozon?.lastPrice)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <button type="submit">Сохранить набор</button>
    </form>
  );
}
```

#### Backend: создание набора
```typescript
// product.routes.ts
router.post('/bundles', authMiddleware, adminOnly, async (req, res) => {
  const { name, description, items, price } = req.body;
  
  // Проверить наличие всех товаров
  const productIds = items.map(i => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  
  if (products.length !== productIds.length) {
    return res.status(400).json({ error: 'Some products not found' });
  }
  
  // Создать набор как отдельный Product
  const bundle = await Product.create({
    name,
    description,
    price,
    isBundle: true,
    bundleItems: items,
    sku: `BUNDLE-${Date.now()}`,
    stock: Math.min(...products.map(p => Math.floor(p.stock / items.find(i => i.productId === p._id).quantity))),
    isActive: true
  });
  
  res.json(bundle);
});
```

#### Расчет выгоды набора на странице товара
```tsx
// pages/catalog/[slug].tsx - для набора
{product.isBundle && (
  <div className="bundle-section">
    <h3>Что входит в набор:</h3>
    <ul className="bundle-items">
      {product.bundleItems.map(item => {
        const itemProduct = bundleProducts.find(p => p._id === item.productId);
        return (
          <li key={item.productId}>
            <img src={itemProduct.images[0]} />
            <span>{itemProduct.name}</span>
            <span className="quantity">× {item.quantity}</span>
            <span className="item-price">{formatPrice(itemProduct.price * item.quantity)}</span>
          </li>
        );
      })}
    </ul>
    
    <PriceComparison 
      product={product}
      isBundle={true}
      bundleOriginalPrice={bundleOriginalPrice}
    />
  </div>
)}
```

---

## 13. КОНТАКТЫ И РЕСУРСЫ

### Документация
- Next.js: https://nextjs.org/docs
- Alfabank API: (внутренняя документация)
- MongoDB: https://www.mongodb.com/docs
- **СДЭК API**: https://api-docs.cdek.ru/
- **Telegram Bot API**: https://core.telegram.org/bots/api
- **VK API**: https://dev.vk.com/ru/method
- **SMS.ru API**: https://sms.ru/api/api_rest
- **Wildberries API**: https://openapi.wb.ru/ (для продавцов)
- **Ozon Seller API**: https://docs.ozon.ru/api/seller/

### Внутренние ресурсы
- Backend repo: `Backend-rejuvena/`
- Rejuvena Web: `web/`
- Shop repo (создать): `seplitza/shop`

### Инфраструктура
- API сервер: 37.252.20.170 (Timeweb VPS)
- БД: MongoDB @ localhost:27017
- Email: Mailgun/Resend (настроено)
- СДЭК: Тестовый аккаунт (получить credentials)

---

## 14. УТВЕРЖДЕНИЕ ПЛАНА

**Ожидаемое время реализации:** 9-11 недель (с учетом интеграций с маркетплейсами)

**Критично для старта:**
1. ✅ Единая CRM (User таблица) - позволяет видеть полную картину клиента
2. ✅ Интеграция платежей через Alfabank - уже настроено для Rejuvena
3. ✅ Seamless миграция доменов - клиенты не почувствуют разрыва
4. ✅ **СДЭК интеграция** - расчет доставки, ПВЗ, штрихкоды
5. ✅ **Колесо Фортуны** - геймификация для повышения engagement
6. ✅ **Промокоды** - маркетинговые кампании
7. ✅ **Система личных скидок** - удержание VIP-клиентов
8. ✅ **Мультиканальные уведомления** - Telegram/VK/WhatsApp/SMS
9. ✅ **Интеграция с WB/Ozon** - бэйджи, парсинг цен, сравнение
10. ✅ **Наборы товаров** - увеличение среднего чека

**Следующие шаги после утверждения:**
1. Создать репозиторий `seplitza/shop`
2. Создать ветку `feature/shop` в `Backend-rejuvena`
3. Зарегистрировать тестовые аккаунты:
   - СДЭК API (песочница)
   - Telegram Bot (@SeplitzaShopBot)
   - VK API приложение
   - SMS.ru (тестовый баланс)
   - Wildberries Seller Cabinet (если еще нет)
   - Ozon Seller Cabinet (если еще нет)
4. Начать с Этапа 1 (Backend модели)
5. **ВАЖНО**: Миграцию товаров из текущего магазина seplitza.ru/shop планировать отдельно

**Приоритеты MVP (что делаем в первую очередь):**
- [P0] Backend модели + API (включая маркетплейсы)
- [P0] Интеграция СДЭК (критично для доставки)
- [P0] Промокоды (простая реализация)
- [P0] Парсинг цен WB/Ozon (cron задача каждую минуту)
- [P1] Бэйджи маркетплейсов + сравнение цен (UI)
- [P1] Наборы товаров (расчет выгоды)
- [P1] Колесо Фортуны (можно отложить на v1.1)
- [P1] Интеграция мессенджеров (начать с Telegram)
- [P2] Автопостинг в VK (не блокирует запуск)

**Технические детали парсинга:**
- Частота обновления цен: **каждую минуту** (cron)
- Хранение истории: 30 дней (TTL index в MongoDB)
- Fallback стратегия: API → Scraping HTML
- Rate limiting: максимум 100 req/min на маркетплейс
- Кеширование: Redis (опционально, если нагрузка высокая)

---

**Автор плана:** GitHub Copilot  
**Дата:** 26 февраля 2026 г.  
**Версия:** 2.1 (добавлена интеграция с маркетплейсами и наборы товаров)
