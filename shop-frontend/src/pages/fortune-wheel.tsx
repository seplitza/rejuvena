import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import FortuneWheel from '@/components/FortuneWheel';
import { useAuth } from '@/hooks/useAuth';
import { getFortuneWheelPrizes, getAvailableSpins, spinWheel, getMyGifts } from '@/api/shop';
import type { FortuneWheelPrize, WheelGift } from '@/types/shop';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { GiftIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function FortuneWheelPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [prizes, setPrizes] = useState<FortuneWheelPrize[]>([]);
  const [availableSpins, setAvailableSpins] = useState(0);
  const [myGifts, setMyGifts] = useState<WheelGift[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setLoading(true);
      const prizesData = await getFortuneWheelPrizes();
      setPrizes(prizesData);

      if (isAuthenticated) {
        const [spinsData, giftsData] = await Promise.all([
          getAvailableSpins(),
          getMyGifts(),
        ]);
        setAvailableSpins(spinsData.availableSpins);
        setMyGifts(giftsData);
      }
    } catch (error) {
      console.error('Failed to load wheel data:', error);
      toast.error('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const handleSpin = async (): Promise<FortuneWheelPrize> => {
    if (!isAuthenticated) {
      toast.error('Войдите, чтобы крутить колесо');
      throw new Error('Not authenticated');
    }

    if (availableSpins <= 0) {
      toast.error('У вас нет доступных вращений');
      throw new Error('No spins available');
    }

    setSpinning(true);

    try {
      const result = await spinWheel();
      setAvailableSpins(result.remainingSpins);
      
      // Add new gift to list
      setMyGifts((prev) => [result.gift, ...prev]);

      setTimeout(() => {
        setSpinning(false);
        toast.success(`Вы выиграли: ${result.prize.name}!`, { autoClose: 5000 });
      }, 4000);

      return result.prize;
    } catch (error: any) {
      setSpinning(false);
      const message = error.response?.data?.error || 'Не удалось прокрутить колесо';
      toast.error(message);
      throw error;
    }
  };

  const formatGiftExpiry = (gift: WheelGift) => {
    const expiryDate = gift.expiryDate || gift.expiry;
    if (!expiryDate) return null;
    
    const date = new Date(expiryDate);
    const now = new Date();
    const daysLeft = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 0) return 'Истек';
    if (daysLeft === 1) return '1 день';
    if (daysLeft <= 4) return `${daysLeft} дня`;
    return `${daysLeft} дней`;
  };

  if (authLoading || loading) {
    return (
      <Layout title="Колесо Фортуны - Загрузка...">
        <div className="container-custom py-12 text-center">
          <div className="loader mx-auto mb-4" />
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Колесо Фортуны" description="Крутите колесо и получайте призы, скидки и бесплатные товары!">
      <div className="bg-gradient-radial from-purple-50 to-pink-50 min-h-screen py-12">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              🎰 Колесо Фортуны
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Испытайте удачу! Крутите колесо и выигрывайте скидки, бесплатные товары и другие призы.
            </p>
          </div>

          {/* Available Spins */}
          {isAuthenticated ? (
            <div className="bg-white rounded-xl p-6 text-center mb-8 max-w-md mx-auto shadow-lg">
              <div className="text-5xl mb-2">🎟️</div>
              <p className="text-gray-600 mb-2">Доступно вращений:</p>
              <p className="text-4xl font-bold text-primary-600">{availableSpins}</p>
              {availableSpins === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Вращения начисляются при покупке товаров
                </p>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 text-center mb-8 max-w-md mx-auto shadow-lg">
              <div className="text-5xl mb-3">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Войдите, чтобы крутить колесо</h3>
              <p className="text-gray-600 mb-4">
                Получайте бесплатные вращения за покупки!
              </p>
              <Link href="/login" className="btn-primary inline-block">
                Войти
              </Link>
            </div>
          )}

          {/* Wheel */}
          <div className="mb-12">
            <FortuneWheel
              prizes={prizes}
              onSpin={handleSpin}
              spinning={spinning}
            />
          </div>

          {/* My Gifts */}
          {isAuthenticated && myGifts.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <GiftIcon className="w-7 h-7 text-primary-500" />
                Мои призы
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myGifts.map((gift) => {
                  const isUsed = gift.isUsed || gift.used;
                  const expiryText = formatGiftExpiry(gift);
                  const isExpired = expiryText === 'Истек';

                  return (
                    <div
                      key={gift._id}
                      className={`bg-white rounded-xl p-6 shadow-md ${
                        isUsed || isExpired ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {gift.description}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Тип: {gift.prizeType === 'discount' ? '🏷️ Скидка' : 
                                  gift.prizeType === 'freeProduct' ? '🎁 Товар' : 
                                  gift.prizeType === 'freeShipping' ? '📦 Доставка' : 
                                  '✨ Бонус'}
                          </p>
                          {gift.discountPercent && (
                            <p className="text-lg font-bold text-primary-600 mt-1">
                              -{gift.discountPercent}%
                            </p>
                          )}
                        </div>
                        {isUsed ? (
                          <span className="badge badge-success">Использован</span>
                        ) : isExpired ? (
                          <span className="badge badge-error">Истек</span>
                        ) : (
                          <span className="badge badge-warning">Активен</span>
                        )}
                      </div>
                      
                      {!isUsed && !isExpired && expiryText && (
                        <p className="text-xs text-gray-500">
                          Осталось: {expiryText}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* How it works */}
          <div className="max-w-4xl mx-auto mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Как это работает?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: '🛍️',
                  title: 'Покупайте товары',
                  description: 'За каждую покупку получайте бесплатные вращения колеса',
                },
                {
                  icon: '🎰',
                  title: 'Крутите колесо',
                  description: 'Используйте ваши вращения и выигрывайте призы',
                },
                {
                  icon: '🎁',
                  title: 'Получайте призы',
                  description: 'Скидки, бесплатные товары, бесплатная доставка и многое другое!',
                },
              ].map((step, index) => (
                <div key={index} className="bg-white rounded-xl p-6 text-center shadow-md">
                  <div className="text-5xl mb-3">{step.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link href="/catalog" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
              <SparklesIcon className="w-6 h-6" />
              Начать покупки
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
