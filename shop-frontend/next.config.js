/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
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
  basePath: process.env.NODE_ENV === 'production' ? '/shop' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/shop' : '',
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false
    };
    return config;
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://api-rejuvena.duckdns.org' 
      : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'),
    NEXT_PUBLIC_SITE_URL: process.env.NODE_ENV === 'production'
      ? 'https://seplitza.github.io/shop'
      : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001')
  }
}

module.exports = nextConfig
