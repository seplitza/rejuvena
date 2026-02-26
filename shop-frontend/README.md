# Seplitza Shop - Frontend

Интернет-магазин сопутствующих товаров для омоложения. Frontend построен на Next.js 14 с TypeScript и Tailwind CSS.

## 🚀 Технологии

- **Next.js 14** - React фреймворк
- **TypeScript** - Типобезопасность
- **Tailwind CSS** - Утилитарные стили
- **Redux Toolkit** - State management
- **Axios** - HTTP клиент
- **React Toastify** - Уведомления
- **Framer Motion** - Анимации (опционально)
- **Swiper** - Карусели

## 📋 Предварительные требования

- Node.js >= 18.0.0
- npm или yarn
- Backend API запущен (см. `Backend-rejuvena/`)

## 🛠️ Установка

1. **Клонировать репозиторий** (если еще не сделано):
```bash
cd /Users/alexeipinaev/Documents/Rejuvena/shop-frontend
```

2. **Установить зависимости**:
```bash
npm install
```

3. **Настроить переменные окружения**:
```bash
cp .env.example .env.local
```

Отредактируйте `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

## 🏃 Запуск

### Development
```bash
npm run dev
```
Откроется на [http://localhost:3001](http://localhost:3001)

### Production Build
```bash
npm run build
npm run start
```

### Статический экспорт (для GitHub Pages)
```bash
npm run export
```

## 📁 Структура проекта

```
shop-frontend/
├── public/              # Статические файлы
├── src/
│   ├── api/            # API клиенты
│   │   ├── client.ts   # Axios instance
│   │   └── shop.ts     # Shop API endpoints
│   ├── components/     # React компоненты
│   │   ├── layout/     # Header, Footer, Layout
│   │   ├── products/   # ProductCard, ProductGrid
│   │   └── FortuneWheel.tsx
│   ├── hooks/          # Custom hooks
│   │   ├── useAuth.ts
│   │   └── useCart.ts
│   ├── pages/          # Next.js страницы
│   │   ├── _app.tsx
│   │   ├── index.tsx   # Главная
│   │   ├── catalog.tsx # Каталог товаров
│   │   ├── cart.tsx    # Корзина
│   │   ├── fortune-wheel.tsx
│   │   └── products/
│   │       └── [slug].tsx  # Детали продукта
│   ├── store/          # Redux store
│   │   ├── index.ts    # Store config
│   │   ├── authSlice.ts
│   │   └── cartSlice.ts
│   ├── styles/         # Глобальные стили
│   │   └── globals.css
│   ├── types/          # TypeScript типы
│   │   └── shop.ts
│   └── utils/          # Утилиты (опционально)
├── .env.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 🎨 Темы и стили

### Цветовая палитра

**Primary (Розовый)**:
- `primary-500`: `#ec4899` - Основной розовый
- `primary-600`: `#db2777` - Темный розовый
- Градиент: `bg-gradient-primary`

**Secondary (Фиолетовый)**:
- `secondary-500`: `#8b5cf6`
- Градиент: `bg-gradient-secondary`

### Утилитарные классы

- `btn-primary` - Основная кнопка (розовый градиент)
- `btn-secondary` - Вторичная кнопка (белая с розовой рамкой)
- `btn-outline` - Контурная кнопка
- `product-card` - Карточка товара
- `card-hover` - Эффект наведения на карточку
- `gradient-text` - Градиентный текст
- `container-custom` - Контейнер с отступами
- `section-padding` - Отступы для секций

## 🔌 API Интеграция

Backend API должен быть запущен на `http://localhost:5000` (или другой адрес в `.env.local`).

### Основные endpoints:

- `GET /api/shop/products` - Список товаров
- `GET /api/shop/products/:id` - Детали товара
- `GET /api/shop/categories` - Категории
- `POST /api/shop/checkout` - Оформление заказа
- `POST /api/fortune-wheel/spin` - Крутить колесо
- `GET /api/fortune-wheel/prizes` - Призы колеса

Подробнее см. `Backend-rejuvena/SHOP_QUICKSTART.md`

## 🛒 Основные возможности

### ✅ Реализовано

- 🏠 **Главная страница** с хитами продаж и новинками
- 📦 **Каталог товаров** с фильтрами и сортировкой
- 🔍 **Детальная страница товара** с галереей изображений
- 🛒 **Корзина** с управлением количеством
- 🏷️ **Промокоды** и скидки
- 🎰 **Колесо Фортуны** с анимацией вращения
- 💰 **Сравнение цен** с маркетплейсами (WB, Ozon)
- 📱 **Responsive дизайн** для всех устройств
- 🔐 **Авторизация** (интеграция с backend)
- 🎁 **Система призов** и подарков

### 🚧 В разработке

- 💳 **Страница оформления заказа** (checkout)
- 👤 **Личный кабинет** пользователя
- 📊 **История заказов**
- ❤️ **Избранное**
- 🔔 **Уведомления**

## 🚀 Deployment

### GitHub Pages

```bash
npm run deploy
```

### Vercel

1. Импортировать проект в Vercel
2. Установить переменные окружения
3. Deploy

### Cloudflare Pages

1. Подключить репозиторий
2. Build command: `npm run build`
3. Output directory: `.next`

## 🐛 Решение проблем

### Ошибка CORS
Убедитесь, что backend настроен с правильными CORS headers для фронтенда.

### Ошибки изображений
Проверьте, что домены маркетплейсов добавлены в `next.config.js` → `images.domains`.

### Ошибки API
Проверьте, что `NEXT_PUBLIC_API_URL` в `.env.local` указывает на работающий backend.

## 📚 Дополнительная документация

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- Backend API: `../Backend-rejuvena/SHOP_QUICKSTART.md`

## 👨‍💻 Разработчики

Rejuvena Team

## 📄 Лицензия

Private Project
