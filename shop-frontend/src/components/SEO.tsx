import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  ogTitle?: string;
  ogDescription?: string;
  structuredData?: object;
  noindex?: boolean;
}

export default function SEO({
  title,
  description,
  canonical,
  ogImage = '/images/og-default.jpg',
  ogType = 'website',
  ogTitle,
  ogDescription,
  structuredData,
  noindex = false
}: SEOProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seplitza.ru';
  const fullTitle = `${title} | Seplitza Shop`;
  const canonicalUrl = canonical || siteUrl;
  const imageUrl = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="Seplitza Shop" />
      <meta property="og:locale" content="ru_RU" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
}

// Helper functions for creating structured data

export const createOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Seplitza',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://seplitza.ru',
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://seplitza.ru'}/images/logo.png`,
  description: 'Интернет-магазин товаров для омоложения и ухода за кожей',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+7-999-999-99-99',
    contactType: 'customer service',
    email: 'support@seplitza.ru',
    availableLanguage: ['Russian']
  },
  sameAs: [
    'https://vk.com/seplitza',
    'https://t.me/seplitza'
  ]
});

export const createProductSchema = (product: {
  name: string;
  description: string;
  image: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  brand?: string;
  category?: string;
  stock: number;
  rating?: number;
  reviewCount?: number;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.image,
  sku: product.sku,
  brand: {
    '@type': 'Brand',
    name: product.brand || 'Seplitza'
  },
  category: product.category,
  offers: {
    '@type': 'Offer',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.sku}`,
    priceCurrency: 'RUB',
    price: product.price,
    priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    seller: {
      '@type': 'Organization',
      name: 'Seplitza'
    }
  },
  ...(product.rating && product.reviewCount ? {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount
    }
  } : {})
});

export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.url}`
  }))
});

export const createWebPageSchema = (page: {
  name: string;
  description: string;
  url: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: page.name,
  description: page.description,
  url: `${process.env.NEXT_PUBLIC_SITE_URL}${page.url}`,
  inLanguage: 'ru',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Seplitza Shop',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://seplitza.ru'
  }
});

export const createSearchActionSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://seplitza.ru',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://seplitza.ru'}/catalog?search={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
});

export const createOfferCatalogSchema = (products: Array<{
  name: string;
  url: string;
  image: string;
  price: number;
}>) => ({
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: 'Каталог товаров Seplitza',
  itemListElement: products.map((product, index) => ({
    '@type': 'Offer',
    position: index + 1,
    name: product.name,
    url: product.url,
    image: product.image,
    price: product.price,
    priceCurrency: 'RUB'
  }))
});
