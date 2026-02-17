/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }), // Enable static export for GitHub Pages only in production  
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
  images: {
    unoptimized: true, // GitHub Pages doesn't support Next.js Image Optimization
    domains: ['faceliftnaturally.me'],
  },
  basePath: process.env.NODE_ENV === 'production' ? '/rejuvena' : '', // Matches GitHub repo name
  assetPrefix: process.env.NODE_ENV === 'production' ? '/rejuvena' : '',
  env: {
    API_URL: process.env.NODE_ENV === 'production' ? 'https://api-rejuvena.duckdns.org' : (process.env.API_URL || 'http://localhost:9527'),
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' ? 'https://api-rejuvena.duckdns.org' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9527'),
  },
}

module.exports = nextConfig
