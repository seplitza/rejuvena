import { GetServerSidePropsContext } from 'next';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://seplitza.ru';

interface Product {
  slug: string;
  updatedAt: string;
}

interface Category {
  slug: string;
  updatedAt: string;
}

function generateSiteMap(products: Product[], categories: Category[]): string {
  const currentDate = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!-- Homepage -->
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Catalog Page -->
  <url>
    <loc>${SITE_URL}/catalog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Categories -->
  ${categories
    .map((category) => {
      return `
  <url>
    <loc>${SITE_URL}/catalog?category=${category.slug}</loc>
    <lastmod>${new Date(category.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join('')}

  <!-- Products -->
  ${products
    .map((product) => {
      return `
  <url>
    <loc>${SITE_URL}/products/${product.slug}</loc>
    <lastmod>${new Date(product.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join('')}

  <!-- Fortune Wheel -->
  <url>
    <loc>${SITE_URL}/fortune-wheel</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- About Page -->
  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Contacts Page -->
  <url>
    <loc>${SITE_URL}/contacts</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Cart -->
  <url>
    <loc>${SITE_URL}/cart</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- Favorites -->
  <url>
    <loc>${SITE_URL}/favorites</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
  try {
    // Fetch all products
    const productsResponse = await axios.get(`${API_URL}/api/shop/products`, {
      params: {
        limit: 1000, // Get all products
        fields: 'slug,updatedAt',
      },
    });

    // Fetch all categories
    const categoriesResponse = await axios.get(`${API_URL}/api/shop/categories`, {
      params: {
        limit: 100,
        fields: 'slug,updatedAt',
      },
    });

    const products = productsResponse.data.products || [];
    const categories = categoriesResponse.data.categories || [];

    // Generate the XML sitemap
    const sitemap = generateSiteMap(products, categories);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Return a basic sitemap on error
    const basicSitemap = generateSiteMap([], []);
    res.setHeader('Content-Type', 'text/xml');
    res.write(basicSitemap);
    res.end();

    return {
      props: {},
    };
  }
}

export default SiteMap;
