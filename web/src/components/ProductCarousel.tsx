/**
 * Product Carousel Component
 * Displays featured products in a scrollable carousel
 */

import { useState, useEffect } from 'react';
import { request } from '../api/request';
import { get_featured_products } from '../api/endpoints';

interface Product {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  isFeatured: boolean;
  stock: number;
}

export default function ProductCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response: any = await request.get(get_featured_products + '&limit=10&page=1');
      console.log('Featured products response:', response);
      
      if (response && response.products) {
        const featured = response.products.filter((p: Product) => p.isFeatured && p.stock > 0);
        setProducts(featured);
      }
    } catch (error) {
      console.error('Failed to load featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (priceInCents: number) => {
    const rubles = priceInCents / 100;
    return rubles.toLocaleString('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Загрузка товаров...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return null; // Don't show if no featured products
  }

  return (
    <div className="w-full py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Хиты продаж</h2>
      
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide" style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {products.map((product) => (
          <div 
            key={product._id}
            className="flex-shrink-0 w-64 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => window.open(`https://api-rejuvena.duckdns.org/admin/products`, '_blank')}
          >
            {/* Product Image */}
            {product.images[0] && (
              <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                    -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                  </div>
                )}
              </div>
            )}
            
            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.shortDescription}</p>
              
              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold" style={{ color: 'var(--color-primary, #E87C61)' }}>
                  {formatPrice(product.price)} ₽
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.compareAtPrice)} ₽
                  </span>
                )}
              </div>
              
              {/* Stock Badge */}
              <div className="mt-3">
                {product.stock > 0 && product.stock <= 5 && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Осталось {product.stock} шт.
                  </span>
                )}
                {product.stock > 5 && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    В наличии
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Scroll hint */}
      <p className="text-sm text-gray-500 text-center mt-2">← Прокрутите для просмотра всех товаров →</p>
    </div>
  );
}
