import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/shop';
import { HeartIcon, ShoppingCartIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAppDispatch, useAppSelector } from '@/store';
import { addToCart } from '@/store/cartSlice';
import { toggleFavorite as toggleFavoriteAction, selectIsFavorite } from '@/store/favoritesSlice';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector(selectIsFavorite(product._id));
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAddingToCart(true);

    try {
      dispatch(addToCart({ product, quantity: 1 }));
      
      // Show success animation
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 500);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleFavoriteAction(product));
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="product-card group relative">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-primary">
              <span className="text-white text-6xl font-bold">
                {product.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {hasDiscount && (
              <span className="badge badge-error">
                -{discountPercent}%
              </span>
            )}
            {product.isFeatured && (
              <span className="badge badge-warning flex items-center gap-1">
                <SparklesIcon className="w-3 h-3" />
                Хит
              </span>
            )}
            {product.isBundle && (
              <span className="badge badge-primary">
                Набор
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
          >
            {isFavorite ? (
              <HeartIconSolid className="w-5 h-5 text-primary-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Quick Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAddingToCart}
            className="absolute bottom-2 right-2 p-2 bg-primary-500 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingCartIcon className="w-5 h-5" />
          </button>

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">
                Нет в наличии
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          {typeof product.category !== 'string' && product.category?.name && (
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {product.category.name}
            </span>
          )}

          {/* Product Name */}
          <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {product.shortDescription}
            </p>
          )}

          {/* Price */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary-600">
                {product.price.toLocaleString('ru-RU')} ₽
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  {product.oldPrice!.toLocaleString('ru-RU')} ₽
                </span>
              )}
            </div>
          </div>

          {/* Marketplace Comparison Hint */}
          {(product.articleWB || product.skuOzon) && (
            <div className="mt-2 text-xs text-success-600 flex items-center gap-1">
              <SparklesIcon className="w-3 h-3" />
              <span>Выгоднее, чем на маркетплейсах</span>
            </div>
          )}

          {/* Stock Info */}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="mt-2 text-xs text-warning-600">
              Осталось всего {product.stock} шт.
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
