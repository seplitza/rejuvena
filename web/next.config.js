/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enable static export for GitHub Pages
  images: {
    unoptimized: true, // GitHub Pages doesn't support Next.js Image Optimization
    domains: ['faceliftnaturally.me'],
  },
  basePath: process.env.NODE_ENV === 'production' ? '/Rejuvena' : '', // Replace 'Rejuvena' with your repo name
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Rejuvena' : '',
  env: {
    API_URL: process.env.API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig
