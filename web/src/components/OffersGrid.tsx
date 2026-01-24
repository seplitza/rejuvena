/**
 * Offers Grid - Premium + Marathons
 * Красивый grid с CSS анимациями
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
}

export default function OffersGrid() {
  const router = useRouter();
  const [marathons, setMarathons] = useState<Marathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchMarathons();
  }, []);

  const fetchMarathons = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9527';
      console.log('🔍 Fetching marathons from:', `${apiUrl}/api/marathons`);
      
      const response = await fetch(`${apiUrl}/api/marathons`);
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 Marathons data:', data);
      
      if (data.success && data.marathons) {
        setMarathons(data.marathons);
        console.log('✅ Loaded marathons:', data.marathons.length);
      } else {
        console.warn('⚠️ No marathons in response');
      }
    } catch (error) {
      console.error('❌ Failed to fetch marathons:', error);
      setError('Ошибка загрузки марафонов');
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
      <div className="flex flex-col justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <span className="text-gray-600 font-medium">Загрузка предложений...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 text-center">
        <p className="text-red-600 font-semibold mb-2">{error}</p>
        <p className="text-sm text-gray-600 mb-4">Проверьте подключение к серверу</p>
        <button 
          onClick={fetchMarathons}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .offer-card {
          animation: fadeInUp 0.6s ease-out forwards;
          animation-delay: calc(var(--card-index) * 0.1s);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .offer-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .offer-card-header {
          background: linear-gradient(135deg, var(--gradient-from), var(--gradient-to));
          position: relative;
          overflow: hidden;
        }

        .offer-card-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.6s;
        }

        .offer-card:hover .offer-card-header::before {
          transform: translateX(100%);
        }

        .pulse-badge {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Premium Card */}
        <div 
          className="offer-card bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-purple-200 hover:border-purple-400"
          style={{ '--card-index': 0, '--gradient-from': '#9333ea', '--gradient-to': '#ec4899' } as any}
        >
          <div className="offer-card-header p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold">Премиум доступ</h3>
              <span className="pulse-badge inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-yellow-900">
                ⭐ Популярный
              </span>
            </div>
            <p className="text-purple-100">Полный доступ ко всем упражнениям</p>
          </div>

          <div className="p-6">
            <div className="space-y-4 mb-6">
              {[
                { title: 'Полное видео-инструкция', description: 'Детальная демонстрация каждого упражнения' },
                { title: 'Доступ на 1 месяц', description: '30 дней автоматического доступа' },
                { title: 'Все категории упражнений', description: '100+ видео, лицо, шея, тело + другое' }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
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
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
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
        {marathons.map((marathon, index) => (
          <div
            key={marathon._id}
            className="offer-card bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-blue-200 hover:border-blue-400"
            style={{ '--card-index': index + 1, '--gradient-from': '#2563eb', '--gradient-to': '#06b6d4' } as any}
          >
            <div className="offer-card-header p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold">{marathon.title}</h3>
                {!marathon.isPaid && (
                  <span className="pulse-badge inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-400 text-green-900">
                    🎁 Бесплатно
                  </span>
                )}
              </div>
              <p className="text-blue-100">{marathon.description || 'Марафон омоложения'}</p>
            </div>

            <div className="p-6">
              <div className="space-y-4 mb-6">
                {[
                  { title: 'Длительность', description: getDaysText(marathon.numberOfDays) },
                  { 
                    title: 'Старт марафона', 
                    description: new Date(marathon.startDate).toLocaleDateString('ru-RU', { 
                      day: 'numeric', month: 'long', year: 'numeric'
                    })
                  },
                  { 
                    title: marathon.numberOfDays === 0 ? 'Каждый день' : 'Ежедневные упражнения',
                    description: marathon.numberOfDays === 0 
                      ? 'Одинаковый набор упражнений каждый день'
                      : 'Новые упражнения каждый день'
                  }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
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
                  } text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl`}
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

      {marathons.length === 0 && !loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-600 font-semibold">Марафоны скоро появятся!</p>
          <p className="text-sm text-gray-600 mt-2">Мы работаем над новыми программами</p>
        </div>
      )}
    </>
  );
}
