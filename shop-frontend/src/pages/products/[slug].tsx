import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import { getProductById, compareProductPrice } from '@/api/shop';
import type { Product, MarketplaceComparison } from '@/types/shop';
import { useAppDispatch } from '@/store';
import { addToCart } from '@/store/cartSlice';
import { toast } from 'react-toastify';
import {
  ShoppingCartIcon,
  HeartIcon,
  TruckIcon,
  SparklesIcon,
  ShieldCheckIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

export default function ProductPage() {
  const router = useRouter();
  const { slug } = router.query;
  const dispatch = useAppDispatch();

  const [product, setProduct] = useState<Product | null>(null);
  const [comparison, setComparison] = useState<MarketplaceComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await getProductById(slug as string);
      setProduct(productData);

      // Load price comparison
      if (productData.articleWB || productData.skuOzon) {
        try {
          const comparisonData = await compareProductPrice(productData._id);
          setComparison(comparisonData);
        } catch (error) {
          console.error('Failed to load comparison:', error);
        }
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Не удалось загрузить товар');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    dispatch(addToCart({ product, quantity }));
    toast.success(`${product.name} добавлен в корзину`);
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <Layout title="Загрузка...">
        <div className="container-custom py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-xl" />
              <div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-8" />
                <div className="h-12 bg-gray-200 rounded w-1/3 mb-8" />
                <div className="h-40 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout title="Товар не найден">
        <div className="container-custom py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
          <button onClick={() => router.push('/catalog')} className="btn-primary">
            Вернуться в каталог
          </button>
        </div>
      </Layout>
    );
  }

  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100)
    : 0;

  return (
    <Layout title={product.name} description={product.shortDescription}>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="sticky top-24">
                {/* Main Image */}
                <div className="aspect-square rounded-xl overflow-hidden bg-white mb-4">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[selectedImage] || product.images[0]}
                      alt={product.name}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-primary">
                      <span className="text-white text-9xl font-bold">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnail Images */}
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 ${
                          selectedImage === index ? 'border-primary-500' : 'border-transparent'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} - фото ${index + 1}`}
                          width={150}
                          height={150}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Category */}
              {typeof product.category !== 'string' && product.category?.name && (
                <span className="text-sm text-gray-500 uppercase tracking-wide">
                  {product.category.name}
                </span>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
                {product.name}
              </h1>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-lg text-gray-600 mb-6">{product.shortDescription}</p>
              )}

              {/* Price */}
              <div className="bg-white rounded-xl p-6 mb-6">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-4xl font-bold text-primary-600">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        {product.oldPrice!.toLocaleString('ru-RU')} ₽
                      </span>
                      <span className="badge badge-error">-{discountPercent}%</span>
                    </>
                  )}
                </div>

                {/* Marketplace Comparison */}
                {comparison && comparison.savings > 0 && (
                  <div className="bg-success-50 border border-success-200 rounded-lg p-3 mt-4">
                    <div className="flex items-center gap-2 text-success-700">
                      <SparklesIcon className="w-5 h-5" />
                      <span className="font-semibold">
                        Экономия {comparison.savingsPercent}% по сравнению с маркетплейсами
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-success-600">
                      {comparison.wildberries && (
                        <p>Wildberries: {comparison.wildberries.price} ₽</p>
                      )}
                      {comparison.ozon && (
                        <p>Ozon: {comparison.ozon.price} ₽</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Количество
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white rounded-lg border border-gray-300">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MinusIcon className="w-5 h-5" />
                    </button>
                    <span className="px-6 font-semibold">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.stock > 0 ? `В наличии: ${product.stock} шт.` : 'Нет в наличии'}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  {product.stock === 0 ? 'Нет в наличии' : 'Добавить в корзину'}
                </button>
                <button className="btn-outline p-3">
                  <HeartIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 gap-4 mb-8">
                <div className="flex items-center gap-3 text-gray-700">
                  <TruckIcon className="w-6 h-6 text-primary-500" />
                  <span>Доставка СДЭК по всей России</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <ShieldCheckIcon className="w-6 h-6 text-primary-500" />
                  <span>Гарантия подлинности</span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Описание</h2>
                <div
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />

                {/* Additional Info */}
                {(product.manufacturer || product.countryOfOrigin || product.weight) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold mb-3">Характеристики</h3>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      {product.manufacturer && (
                        <>
                          <dt className="text-gray-600">Производитель:</dt>
                          <dd className="font-medium">{product.manufacturer}</dd>
                        </>
                      )}
                      {product.countryOfOrigin && (
                        <>
                          <dt className="text-gray-600">Страна:</dt>
                          <dd className="font-medium">{product.countryOfOrigin}</dd>
                        </>
                      )}
                      {product.weight && (
                        <>
                          <dt className="text-gray-600">Вес:</dt>
                          <dd className="font-medium">{product.weight} г</dd>
                        </>
                      )}
                    </dl>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
