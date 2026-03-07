import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import SEO from '@/components/SEO';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectFavorites, clearFavorites } from '@/store/favoritesSlice';
import { HeartIcon, ShoppingBagIcon, SparklesIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectFavorites);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearAll = () => {
    dispatch(clearFavorites());
    setShowClearConfirm(false);
  };

  return (
    <>
      <SEO
        title="Избранные товары"
        description="Ваши избранные товары для красоты и омоложения. Сохраняйте понравившиеся продукты и возвращайтесь к ним позже."
        canonical="/favorites"
      />
      
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 py-12">
          <div className="container mx-auto px-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                <HeartIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Избранные товары
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {favorites.length > 0
                  ? `У вас ${favorites.length} ${getFavoritesWord(favorites.length)} в избранном`
                  : 'Вы еще не добавили товары в избранное'}
              </p>
            </motion.div>

            {favorites.length > 0 ? (
              <>
                {/* Actions Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-xl p-4 shadow-md"
                >
                  <div className="flex items-center gap-2 text-gray-700">
                    <SparklesIcon className="w-5 h-5 text-pink-500" />
                    <span className="font-medium">
                      Добавьте в корзину и получите скидку 5% на весь заказ!
                    </span>
                  </div>
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="text-red-600 hover:text-red-700 font-medium inline-flex items-center gap-2 transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                    Очистить избранное
                  </button>
                </motion.div>

                {/* Products Grid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <ProductGrid products={favorites} loading={false} />
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-12 text-center"
                >
                  <Link
                    href="/catalog"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:scale-105 transform transition-all shadow-lg hover:shadow-xl"
                  >
                    <ShoppingBagIcon className="w-6 h-6" />
                    Продолжить покупки
                  </Link>
                </motion.div>
              </>
            ) : (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl mx-auto"
              >
                <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
                  {/* Empty heart illustration */}
                  <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <HeartIcon className="w-16 h-16 text-gray-400" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Ваше избранное пусто
                  </h2>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Добавляйте товары в избранное, нажимая на иконку ❤️ на карточке товара.
                    Так вы сможете легко найти понравившиеся продукты позже.
                  </p>

                  {/* Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left">
                    {[
                      {
                        icon: '⭐',
                        title: 'Быстрый доступ',
                        description: 'Все любимые товары в одном месте',
                      },
                      {
                        icon: '🔔',
                        title: 'Уведомления',
                        description: 'Узнавайте о скидках первыми',
                      },
                      {
                        icon: '🎁',
                        title: 'Бонусы',
                        description: 'Специальные предложения',
                      },
                    ].map((benefit, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4"
                      >
                        <div className="text-3xl mb-2">{benefit.icon}</div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/catalog"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:scale-105 transform transition-all shadow-lg hover:shadow-xl"
                  >
                    <ShoppingBagIcon className="w-6 h-6" />
                    Перейти в каталог
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Clear Confirmation Modal */}
            {showClearConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowClearConfirm(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrashIcon className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Очистить избранное?
                    </h3>
                    <p className="text-gray-600">
                      Вы уверены, что хотите удалить все товары из избранного? Это действие нельзя отменить.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                    >
                      Удалить все
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}

// Helper function for Russian pluralization
function getFavoritesWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'товаров';
  }

  if (lastDigit === 1) {
    return 'товар';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'товара';
  }

  return 'товаров';
}
