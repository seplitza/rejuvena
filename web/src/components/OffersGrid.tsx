/**
 * Offers Grid - Premium + Marathons
 * Показывает Premium подписку и марафоны в едином формате карточек
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { API_ENDPOINTS } from '@/config/api';

interface Marathon {
  _id: string;
  title: string;
  description?: string;
  numberOfDays: number;
  cost: number;
  isPaid: boolean;
  startDate: string;
  language: string;
  tenure: number;
}

export default function OffersGrid() {
  const router = useRouter();
  const [marathons, setMarathons] = useState<Marathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchMarathons();
  }, []);

  const fetchMarathons = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://37.252.20.170:9527'}/api/marathons`);
      const data = await response.json();
      
      if (data.success && data.marathons) {
        setMarathons(data.marathons);
      }
    } catch (error) {
      console.error('Failed to fetch marathons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePremiumPurchase = async () => {
    setPurchaseLoading('premium');
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert('Необходимо войти в систему');
        router.push('/auth/login');
        return;
      }

      const response = await fetch(API_ENDPOINTS.payment.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: 990,
          description: 'Премиум подписка на 30 дней',
          planType: 'premium',
          duration: 30
        })
      });

      const data = await response.json();
      if (data.success && data.payment?.paymentUrl) {
        window.location.href = data.payment.paymentUrl;
      } else {
        alert(data.error || 'Ошибка создания платежа');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Ошибка при создании платежа');
    } finally {
      setPurchaseLoading(null);
    }
  };

  const handleMarathonAction = async (marathon: Marathon) => {
    if (marathon.isPaid) {
      // Платный марафон - переход на оплату
      setPurchaseLoading(marathon._id);
      
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          alert('Необходимо войти в систему');
          router.push('/auth/login');
          return;
        }

        const response = await fetch(API_ENDPOINTS.payment.create, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            amount: marathon.cost,
            description: `Марафон: ${marathon.title}`,
            planType: 'marathon',
            marathonId: marathon._id
          })
        });

        const data = await response.json();
        if (data.success && data.payment?.paymentUrl) {
          window.location.href = data.payment.paymentUrl;
        } else {
          alert(data.error || 'Ошибка создания платежа');
        }
      } catch (error) {
        console.error('Payment error:', error);
        alert('Ошибка при создании платежа');
      } finally {
        setPurchaseLoading(null);
      }
    } else {
      // Бесплатный марафон - сразу записываем
      router.push(`/marathons/${marathon._id}`);
    }
  };

  const getDaysText = (days: number) => {
    if (days === 0) return 'Бесконечный марафон';
    if (days % 10 === 1 && days % 100 !== 11) return `${days} день`;
    if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) return `${days} дня`;
    return `${days} дней`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {/* Premium Card */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-200 hover:border-purple-400 transition-all duration-300">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold">Премиум доступ</h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-yellow-900">
              ⭐ Популярный
            </span>
          </div>
          <p className="text-purple-100">Полный доступ ко всем упражнениям</p>
        </div>

        <div className="p-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Полное видео-инструкция</h4>
                <p className="text-sm text-gray-600">Детальная демонстрация каждого упражнения</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Доступ на 1 месяц</h4>
                <p className="text-sm text-gray-600">30 дней автоматического доступа</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Все категории упражнений</h4>
                <p className="text-sm text-gray-600">100+ видео, лицо, шея, тело + другое</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-4xl font-bold text-gray-900">990 ₽</span>
                <span className="text-gray-600 ml-2">/ месяц</span>
              </div>
            </div>

            <button
              onClick={handlePremiumPurchase}
              disabled={purchaseLoading === 'premium'}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {purchaseLoading === 'premium' ? 'Обработка...' : 'Оплатить 990 ₽'}
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              Безопасная оплата через Альфа-Банк
            </p>
          </div>
        </div>
      </div>

      {/* Marathon Cards */}
      {marathons.map((marathon) => (
        <div
          key={marathon._id}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-blue-200 hover:border-blue-400 transition-all duration-300"
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold">{marathon.title}</h3>
              {!marathon.isPaid && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-400 text-green-900">
                  🎁 Бесплатно
                </span>
              )}
            </div>
            <p className="text-blue-100">{marathon.description || 'Марафон омоложения'}</p>
          </div>

          <div className="p-6">
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Длительность</h4>
                  <p className="text-sm text-gray-600">{getDaysText(marathon.numberOfDays)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Старт марафона</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(marathon.startDate).toLocaleDateString('ru-RU', { 
                      day: 'numeric', 
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {marathon.numberOfDays === 0 ? 'Каждый день' : 'Ежедневные упражнения'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {marathon.numberOfDays === 0 
                      ? 'Одинаковый набор упражнений каждый день'
                      : 'Новые упражнения каждый день'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  {marathon.isPaid ? (
                    <>
                      <span className="text-4xl font-bold text-gray-900">{marathon.cost} ₽</span>
                      <span className="text-gray-600 ml-2">разовый платеж</span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-green-600">Бесплатно</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleMarathonAction(marathon)}
                disabled={purchaseLoading === marathon._id}
                className={`w-full ${
                  marathon.isPaid
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                    : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
                } text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {purchaseLoading === marathon._id
                  ? 'Обработка...'
                  : marathon.isPaid
                  ? `Оплатить ${marathon.cost} ₽`
                  : 'Присоединиться бесплатно'
                }
              </button>

              {marathon.isPaid && (
                <p className="text-xs text-gray-500 text-center mt-3">
                  Безопасная оплата через Альфа-Банк
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
