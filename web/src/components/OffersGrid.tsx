/**
 * Offers Grid - Premium + Marathons
 * Показывает Premium подписку и марафоны в едином формате карточек с Swiper slider
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { API_ENDPOINTS } from '@/config/api';
import dynamic from 'next/dynamic';

// Статический импорт CSS
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Динамический импорт Swiper для избежания SSR проблем
const Swiper = dynamic(() => import('swiper/react').then(mod => mod.Swiper), { ssr: false });
const SwiperSlide = dynamic(() => import('swiper/react').then(mod => mod.SwiperSlide), { ssr: false });

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
  const [error, setError] = useState<string | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);
  const [swiperModules, setSwiperModules] = useState<any>(null);

  // Динамическая загрузка Swiper модулей
  useEffect(() => {
    import('swiper/modules').then((modules) => {
      setSwiperModules(modules);
    }).catch(err => {
      console.error('Failed to load Swiper modules:', err);
    });
  }, []);

  useEffect(() => {
    fetchMarathons();
  }, []);

  const fetchMarathons = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9527';
      console.log('Fetching marathons from:', `${apiUrl}/api/marathons`);
      
      const response = await fetch(`${apiUrl}/api/marathons`);
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Marathons data:', data);
      
      if (data.success && data.marathons) {
        setMarathons(data.marathons);
        console.log('Loaded marathons:', data.marathons.length);
      } else {
        setError('Не удалось загрузить марафоны');
      }
    } catch (error) {
      console.error('Failed to fetch marathons:', error);
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
        <span className="ml-4 text-gray-600">Загрузка предложений...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 text-center">
        <p className="text-red-600 font-semibold">{error}</p>
        <button 
          onClick={fetchMarathons}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  // Если нет марафонов, показываем только Premium
  if (marathons.length === 0) {
    console.warn('No marathons loaded, showing Premium only');
  }

  // Premium card data
  const premiumCard = {
    id: 'premium',
    title: 'Премиум доступ',
    subtitle: 'Полный доступ ко всем упражнениям',
    badge: '⭐ Популярный',
    badgeColor: 'bg-yellow-400 text-yellow-900',
    gradient: 'from-purple-600 to-pink-600',
    borderColor: 'border-purple-200 hover:border-purple-400',
    buttonGradient: 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
    price: 990,
    priceLabel: '/ месяц',
    buttonText: 'Оплатить 990 ₽',
    features: [
      { title: 'Полное видео-инструкция', description: 'Детальная демонстрация каждого упражнения' },
      { title: 'Доступ на 1 месяц', description: '30 дней автоматического доступа' },
      { title: 'Все категории упражнений', description: '100+ видео, лицо, шея, тело + другое' }
    ]
  };

  // All cards: Premium + Marathons
  const allCards = [
    premiumCard,
    ...marathons.map(m => ({
      id: m._id,
      title: m.title,
      subtitle: m.description || 'Марафон омоложения',
      badge: !m.isPaid ? '🎁 Бесплатно' : null,
      badgeColor: 'bg-green-400 text-green-900',
      gradient: 'from-blue-600 to-cyan-600',
      borderColor: 'border-blue-200 hover:border-blue-400',
      buttonGradient: m.isPaid 
        ? 'from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
        : 'from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700',
      price: m.isPaid ? m.cost : null,
      priceLabel: m.isPaid ? 'разовый платеж' : null,
      buttonText: m.isPaid ? `Оплатить ${m.cost} ₽` : 'Присоединиться бесплатно',
      isPaidMarathon: m.isPaid,
      features: [
        { title: 'Длительность', description: getDaysText(m.numberOfDays) },
        { 
          title: 'Старт марафона', 
          description: new Date(m.startDate).toLocaleDateString('ru-RU', { 
            day: 'numeric', 
            month: 'long',
            year: 'numeric'
          })
        },
        { 
          title: m.numberOfDays === 0 ? 'Каждый день' : 'Ежедневные упражнения',
          description: m.numberOfDays === 0 
            ? 'Одинаковый набор упражнений каждый день'
            : 'Новые упражнения каждый день'
        }
      ],
      marathonData: m
    }))
  ];

  const handleCardAction = async (card: any) => {
    if (card.id === 'premium') {
      await handlePremiumPurchase();
    } else if (card.marathonData) {
      await handleMarathonAction(card.marathonData);
    }
  };

  // Рендер карточки
  const renderCard = (card: any) => (
    <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden border-2 ${card.borderColor} transition-all duration-300 h-full flex flex-col`}>
      <div className={`bg-gradient-to-r ${card.gradient} p-6 text-white`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold">{card.title}</h3>
          {card.badge && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${card.badgeColor}`}>
              {card.badge}
            </span>
          )}
        </div>
        <p className={card.id === 'premium' ? 'text-purple-100' : 'text-blue-100'}>
          {card.subtitle}
        </p>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="space-y-4 mb-6 flex-grow">
          {card.features.map((feature: any, idx: number) => (
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
              {card.price !== null ? (
                <>
                  <span className="text-4xl font-bold text-gray-900">{card.price} ₽</span>
                  <span className="text-gray-600 ml-2">{card.priceLabel}</span>
                </>
              ) : card.id !== 'premium' && (
                <span className="text-4xl font-bold text-green-600">Бесплатно</span>
              )}
            </div>
          </div>

          <button
            onClick={() => handleCardAction(card)}
            disabled={purchaseLoading === card.id}
            className={`w-full bg-gradient-to-r ${card.buttonGradient} text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {purchaseLoading === card.id ? 'Обработка...' : card.buttonText}
          </button>

          {(card.id === 'premium' || ('isPaidMarathon' in card && card.isPaidMarathon)) && (
            <p className="text-xs text-gray-500 text-center mt-3">
              Безопасная оплата через Альфа-Банк
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // Если Swiper модули не загрузились, показываем Grid
  if (!swiperModules || !Swiper || !SwiperSlide) {
    console.log('Swiper not loaded, using grid layout');
    return (
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCards.map((card) => (
            <div key={card.id}>
              {renderCard(card)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { EffectCoverflow, Navigation, Pagination, Autoplay } = swiperModules;

  return (
    <div className="mb-6 offers-slider-container">
      <style jsx global>{`
        .offers-slider-container .swiper {
          padding: 20px 10px 50px;
        }
        .offers-slider-container .swiper-slide {
          height: auto;
          display: flex;
        }
        .offers-slider-container .swiper-button-prev,
        .offers-slider-container .swiper-button-next {
          color: #9333ea;
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .offers-slider-container .swiper-button-prev:after,
        .offers-slider-container .swiper-button-next:after {
          font-size: 18px;
          font-weight: bold;
        }
        .offers-slider-container .swiper-pagination-bullet {
          background: #9333ea;
          opacity: 0.5;
        }
        .offers-slider-container .swiper-pagination-bullet-active {
          opacity: 1;
          background: #9333ea;
        }
      `}</style>

      <Swiper
        modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 10,
          stretch: 0,
          depth: 150,
          modifier: 1.5,
          slideShadows: true,
        }}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 20
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30
          }
        }}
        className="offers-swiper"
      >
        {allCards.map((card) => (
          <SwiperSlide key={card.id} style={{ width: '350px', maxWidth: '90vw' }}>
            {renderCard(card)}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
