import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { Product } from '@/types/shop';

interface ProductCarouselProps {
  products: Product[];
  autoplayInterval?: number;
  className?: string;
}

export default function ProductCarousel({ 
  products, 
  autoplayInterval = 3000,
  className = ''
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  }, [products.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Autoplay logic
  useEffect(() => {
    if (isHovered || products.length <= 1) return;

    const interval = setInterval(goToNext, autoplayInterval);
    return () => clearInterval(interval);
  }, [isHovered, autoplayInterval, goToNext, products.length]);

  if (products.length === 0) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-100 rounded-3xl ${className}`}>
        <p className="text-gray-500">Нет товаров для отображения</p>
      </div>
    );
  }

  const currentProduct = products[currentIndex];

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Carousel */}
      <div className="relative h-96 md:h-[480px] rounded-3xl overflow-hidden bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Link 
              href={`/products/${currentProduct.slug}`}
              className="relative w-full h-full flex items-center justify-center p-8 group"
            >
              {/* Product Image */}
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                {/* Product Name */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-8 left-0 right-0 text-center px-4"
                >
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {currentProduct.name}
                  </h3>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto line-clamp-2">
                    {currentProduct.description}
                  </p>
                </motion.div>

                {/* Image Container */}
                <div className="relative flex items-center justify-center w-full max-w-md h-full py-24">
                  <img
                    src={currentProduct.images?.[0] || '/placeholder-product.png'}
                    alt={currentProduct.name}
                    className="max-w-full max-h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%239ca3af"%3EФото товара%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>

                {/* Price & CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-6 px-4"
                >
                  <div className="text-center">
                    <div className="text-4xl font-bold text-pink-600">
                      {currentProduct.price.toLocaleString('ru-RU')} ₽
                    </div>
                    {currentProduct.compareAtPrice && currentProduct.compareAtPrice > currentProduct.price && (
                      <div className="text-xl text-gray-400 line-through">
                        {currentProduct.compareAtPrice.toLocaleString('ru-RU')} ₽
                      </div>
                    )}
                  </div>
                  <div className="px-6 py-3 bg-pink-600 text-white rounded-xl font-semibold group-hover:bg-pink-700 transition-colors">
                    Подробнее →
                  </div>
                </motion.div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {products.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 z-10"
              aria-label="Previous product"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 z-10"
              aria-label="Next product"
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-800" />
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {products.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                index === currentIndex
                  ? 'w-8 h-3 bg-pink-600'
                  : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
              } rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
