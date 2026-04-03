/** @type {import('next').NextConfig} */
// STATIC_EXPORT=true используется только для деплоя на GitHub Pages (npm run deploy)
// Серверный деплой (shop.seplitza.ru) НЕ использует STATIC_EXPORT
const isStaticExport = process.env.STATIC_EXPORT === 'true'

const nextConfig = {
  reactStrictMode: true,
  ...(isStaticExport && { output: 'export' }),
  generateBuildId: async () => {
    return `build-shop-${Date.now()}`
  },
  images: {
    unoptimized: true,
    domains: [
      'localhost',
      'api.seplitza.ru',
      'api-rejuvena.duckdns.org',
      '37.252.20.170',
      'basket-01.wbbasket.ru',
      'basket-02.wbbasket.ru',
      'basket-03.wbbasket.ru',
      'basket-04.wbbasket.ru',
      'basket-05.wbbasket.ru',
      'basket-06.wbbasket.ru',
      'basket-07.wbbasket.ru',
      'basket-08.wbbasket.ru',
      'basket-09.wbbasket.ru',
      'basket-10.wbbasket.ru',
      'cdn1.ozone.ru',
      'cdn2.ozone.ru',
      'cdn3.ozone.ru'
    ]
  },
  // basePath для GitHub Pages: STATIC_EXPORT=true NEXT_PUBLIC_BASE_PATH=/shop
  // Для сервера shop.seplitza.ru: basePath пустой (сайт на корне домена)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false
    };
    return config;
  },
  // Не переопределяем env — используем значения из .env.production / .env.local
  // Дефолты на случай если .env файл не найден
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9527',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
  }
}

module.exports = nextConfig
