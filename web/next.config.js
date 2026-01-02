/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }), // Enable static export for GitHub Pages only in production
  images: {
    unoptimized: true, // GitHub Pages doesn't support Next.js Image Optimization
    domains: ['faceliftnaturally.me'],
  },
  basePath: process.env.NODE_ENV === 'production' ? '/rejuvena' : '', // Matches GitHub repo name
  assetPrefix: process.env.NODE_ENV === 'production' ? '/rejuvena' : '',
  env: {
    API_URL: process.env.API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig
