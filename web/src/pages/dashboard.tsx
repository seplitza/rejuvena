import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/modules/auth/slice';
import { AuthTokenManager, request } from '../api';
import * as endpoints from '../api/endpoints';
import OffersGrid from "../components/OffersGrid";
import PremiumPlanCard from '../components/payment/PremiumPlanCard';

interface Payment {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  metadata?: {
    type?: 'premium' | 'marathon' | 'exercise';
    planType?: string;
    duration?: number;
    marathonId?: string;
    marathonName?: string;
    exerciseId?: string;
    exerciseName?: string;
  };
}

interface Marathon {
  _id: string;
  title: string;
  description?: string;
  numberOfDays: number;
  startDate: string;
  tenure: number;
  userEnrolled?: boolean;
  userEnrollmentStatus?: 'pending' | 'active' | 'completed' | 'cancelled';
  lastAccessedDay?: number;
  currentDay?: number;
}

interface FortunePrize {
  _id: string;
  type: string;
  description?: string;
  value: any;
  discountPercent?: number;
  expiryDate: string;
  isUsed: boolean;
  usedAt?: string;
  orderId?: string;
  prizeId?: string;
}

// Функция форматирования названия продукта
const formatProductName = (payment: Payment): string => {
  const meta = payment.metadata;
  if (!meta) return 'Покупка';
  
  if (meta.type === 'premium' || meta.planType === 'premium') {
    return 'Покупка: Премиум доступ';
  }
  
  if ((meta.type === 'marathon' || meta.planType === 'marathon') && meta.marathonName) {
    return `Покупка: марафон "${meta.marathonName}"`;
  }
  
  if ((meta.type === 'exercise' || meta.planType === 'exercise') && meta.exerciseName) {
    return `Покупка: упражнение "${meta.exerciseName}"`;
  }
  
  return 'Покупка';
};

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [enrolledMarathons, setEnrolledMarathons] = useState<Marathon[]>([]);
  const [marathonCountdowns, setMarathonCountdowns] = useState<Record<string, { days: number; hours: number; minutes: number; seconds: number; hasStarted: boolean }>>({});
  const [fortunePrizes, setFortunePrizes] = useState<FortunePrize[]>([]);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Объединенный список активностей: платежи + призы
  const recentActivities = useMemo(() => {
    const activities: Array<{
      id: string;
      type: 'payment' | 'prize';
      date: Date;
      data: Payment | FortunePrize;
    }> = [];

    // Добавляем платежи
    recentPayments.forEach(payment => {
      activities.push({
        id: payment.id,
        type: 'payment',
        date: new Date(payment.createdAt),
        data: payment
      });
    });

    // Добавляем призы (только активированные)
    fortunePrizes.filter(p => p.isUsed && p.usedAt).forEach(prize => {
      activities.push({
        id: prize._id,
        type: 'prize',
        date: new Date(prize.usedAt!),
        data: prize
      });
    });

    // Сортируем по дате (новые сначала)
    return activities.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
  }, [recentPayments, fortunePrizes]);

  useEffect(() => {
    // Wait for auth to initialize from localStorage
    const timer = setTimeout(() => {
      setIsAuthChecking(false);
    }, 500); // Give _app.tsx time to restore token
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Redirect to login only after auth check is complete
    if (!isAuthChecking && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthChecking, isAuthenticated, router]);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const response = await request.get(endpoints.payment_history) as any;
        if (response.payments) {
          setRecentPayments(response.payments.slice(0, 5)); // Последние 5
        }
      } catch (error) {
        console.error('Failed to load payments:', error);
      }
    };
    
    const loadMarathons = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://37.252.20.170:9527';
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        
        const response = await fetch(`${apiUrl}/api/marathons/user/my-enrollments`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && Array.isArray(data.enrollments)) {
            const enrolled = data.enrollments.map((e: any) => ({
              ...e.marathonId,
              lastAccessedDay: e.lastAccessedDay || 0,
              currentDay: e.currentDay || 1
            })).filter((m: any) => m._id);
            setEnrolledMarathons(enrolled);
          }
        }
      } catch (error) {
        console.error('💥 Failed to load marathons:', error);
      }
    };
    
    const loadFortunePrizes = async () => {
      try {
        const token = AuthTokenManager.get();
        if (!token) return;
        
        const response = await request.get(endpoints.get_my_fortune_prizes) as any;
        if (response && Array.isArray(response.prizes)) {
          setFortunePrizes(response.prizes);
        }
      } catch (error) {
        console.error('💥 Failed to load fortune prizes:', error);
      }
    };
    
    if (isAuthenticated) {
      console.log('🔍 Dashboard user data:', {
        isPremium: user?.isPremium,
        premiumEndDate: user?.premiumEndDate,
        premiumEndDateType: typeof user?.premiumEndDate,
        fullUser: user
      });
      loadPayments();
      loadMarathons();
      loadFortunePrizes();
    }
  }, [isAuthenticated, user]);

  // Countdown timer for marathons
  useEffect(() => {
    if (enrolledMarathons.length === 0) return;

    const updateCountdowns = () => {
      const newCountdowns: Record<string, { days: number; hours: number; minutes: number; seconds: number; hasStarted: boolean }> = {};
      
      enrolledMarathons.forEach((marathon) => {
        const now = new Date().getTime();
        const startDate = new Date(marathon.startDate).getTime();
        const distance = startDate - now;

        if (distance < 0) {
          newCountdowns[marathon._id] = { days: 0, hours: 0, minutes: 0, seconds: 0, hasStarted: true };
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          newCountdowns[marathon._id] = { days, hours, minutes, seconds, hasStarted: false };
        }
      });

      setMarathonCountdowns(newCountdowns);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);

    return () => clearInterval(interval);
  }, [enrolledMarathons]);

  // Show loading while checking auth or not authenticated
  if (isAuthChecking || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Личный кабинет
          </h1>
          <div className="flex items-center gap-4">
            {/* User Avatar - only show when authenticated */}
            {isAuthenticated && user && (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                style={{ backgroundImage: 'linear-gradient(to bottom right, var(--color-primary), var(--color-secondary))' }}
                onClick={() => router.push('/profile/settings')}
                title={`${user.firstName || 'Профиль'}`}
              >
                {user.firstName ? user.firstName.charAt(0).toUpperCase() : '👤'}
              </div>
            )}
            <button
              onClick={() => {
                if (isAuthenticated) {
                  // Clear auth state in Redux
                  dispatch(logout());
                  // Clear token from localStorage
                  AuthTokenManager.remove();
                  // Redirect to login page
                  router.push('/auth/login');
                } else {
                  // Redirect to login page
                  router.push('/auth/login');
                }
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              {isAuthenticated ? 'Выйти' : 'Войти'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Здравствуйте{user?.firstName ? `, ${user.firstName}` : ''}!
          </h2>
          {!user?.firstName && (
            <p className="text-gray-500 text-sm mb-3">
              Заполните профиль, пожалуйста, что бы мы могли к Вам правильно обращаться.
            </p>
          )}
          <p className="text-gray-600">
            Email: {user?.email || 'Не указан'}
          </p>
        </div>

        {/* Premium Status or Plan Card */}
        {user?.isPremium && (
          <div 
            className="mb-6 rounded-lg shadow-lg p-6 text-white"
            style={{ backgroundImage: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">✨ Премиум доступ активен</h3>
                <p className="opacity-90">
                  Активен до: {user?.premiumEndDate ? new Date(user.premiumEndDate).toLocaleDateString('ru-RU') : 'неизвестно'}
                </p>
                {user?.premiumEndDate && (
                  <p className="opacity-90 mt-1">
                    Осталось дней: {Math.max(0, Math.ceil((new Date(user.premiumEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                  </p>
                )}
                <p className="opacity-90 mt-1">
                  🎯 Разблокирован доступ ко всем упражнениям
                </p>
              </div>
              <div className="text-6xl">👑</div>
            </div>
          </div>
        )}

        {/* Enrolled Marathons Banner - Beautiful cards like Premium */}
        {enrolledMarathons.length > 0 && (
          <div className="mb-6 space-y-4">
            {enrolledMarathons.map((marathon) => {
              const countdown = marathonCountdowns[marathon._id];
              const hasStarted = countdown?.hasStarted ?? true;
              const hasViewedStart = (marathon.lastAccessedDay || 0) > 0;
              
              // Calculate current day of marathon based on start date
              const getCurrentDay = () => {
                if (!hasStarted) return 1;
                const now = new Date();
                const start = new Date(marathon.startDate);
                const daysPassed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                const currentLearningDay = Math.min(daysPassed + 1, marathon.numberOfDays);
                return Math.max(1, currentLearningDay);
              };

              // If marathon has started, always go to current day
              // Otherwise, show welcome/rules on start page
              const targetUrl = hasStarted 
                ? `/marathons/${marathon._id}/day/${getCurrentDay()}`
                : `/marathons/${marathon._id}/start`;

              return (
                <div 
                  key={marathon._id}
                  className="rounded-lg shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition-shadow"
                  style={{ backgroundImage: 'linear-gradient(to right, var(--color-accent), var(--color-secondary))' }}
                  onClick={() => router.push(targetUrl)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold">🎯 {marathon.title}</h3>
                        <span className="text-xs bg-white/30 px-3 py-1 rounded-full font-semibold">Марафон оплачен</span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-orange-100 flex items-center gap-2">
                          <span>📅</span>
                          <span>Длительность обучения: {marathon.numberOfDays} дней</span>
                        </p>
                        <p className="text-orange-100 flex items-center gap-2">
                          <span>🏃</span>
                          <span>Курс практики: 30 дней</span>
                        </p>
                        <p className="text-orange-100 flex items-center gap-2">
                          <span>🗓️</span>
                          <span>Старт: {new Date(marathon.startDate).toLocaleDateString('ru-RU', { 
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}</span>
                        </p>
                        
                        {!hasStarted && countdown && (
                          <div className="mt-4 bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                            <p className="text-sm font-semibold mb-2">⏰ До старта марафона:</p>
                            <div className="flex gap-3">
                              <div className="text-center">
                                <div className="text-3xl font-bold">{countdown.days}</div>
                                <div className="text-xs text-orange-200">дней</div>
                              </div>
                              <div className="text-3xl font-bold">:</div>
                              <div className="text-center">
                                <div className="text-3xl font-bold">{String(countdown.hours).padStart(2, '0')}</div>
                                <div className="text-xs text-orange-200">часов</div>
                              </div>
                              <div className="text-3xl font-bold">:</div>
                              <div className="text-center">
                                <div className="text-3xl font-bold">{String(countdown.minutes).padStart(2, '0')}</div>
                                <div className="text-xs text-orange-200">минут</div>
                              </div>
                              <div className="text-3xl font-bold">:</div>
                              <div className="text-center">
                                <div className="text-3xl font-bold">{String(countdown.seconds).padStart(2, '0')}</div>
                                <div className="text-xs text-orange-200">секунд</div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {hasStarted && (
                          <div className="mt-2 text-orange-100">
                            ✨ Разблокирован доступ ко всем упражнениям марафона
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ml-6 flex-shrink-0">
                      <div className="text-7xl mb-2">🏃</div>
                      <button className="bg-white text-orange-600 font-bold px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors whitespace-nowrap">
                        {!hasStarted ? 'Подробнее →' : hasViewedStart ? 'Перейти в марафон →' : 'Начать марафон →'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Marathons and Offers - Always visible */}
        <div className="mb-6">
          <OffersGrid />
        </div>

        {/* Fortune Wheel Prizes */}
        {fortunePrizes.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-3xl">🎁</span>
                Призы Колеса Фортуны
              </h2>
              <button
                onClick={() => router.push('/fortune-wheel')}
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
              >
                Крутить колесо →
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fortunePrizes.slice(0, 4).map((prize) => {
                const isExpired = new Date(prize.expiryDate) < new Date();
                const isActive = !prize.isUsed && !isExpired;
                
                const getPrizeIcon = (type: string) => {
                  switch (type) {
                    case 'discount': return '🏷️';
                    case 'freeShipping': return '📦';
                    case 'product': return '🎁';
                    case 'freeProduct': return '🎁';
                    case 'personalDiscount': return '💎';
                    default: return '🎉';
                  }
                };

                const getPrizeTitle = (prize: FortunePrize) => {
                  if (prize.description) return prize.description;
                  if (prize.type === 'discount' && prize.discountPercent) {
                    return `Скидка ${prize.discountPercent}%`;
                  }
                  return prize.type;
                };

                return (
                  <div
                    key={prize._id}
                    className={`border-2 rounded-lg p-4 transition-all ${
                      isActive 
                        ? 'border-green-300 bg-green-50' 
                        : prize.isUsed 
                        ? 'border-gray-300 bg-gray-50' 
                        : 'border-orange-300 bg-orange-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-3xl">{getPrizeIcon(prize.type)}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {getPrizeTitle(prize)}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Действует до: {new Date(prize.expiryDate).toLocaleDateString('ru-RU')}
                          </p>
                          {prize.isUsed && prize.usedAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              Использован: {new Date(prize.usedAt).toLocaleDateString('ru-RU')}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        {isActive && (
                          <span className="inline-block px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                            Активен
                          </span>
                        )}
                        {prize.isUsed && (
                          <span className="inline-block px-3 py-1 bg-gray-600 text-white text-xs font-semibold rounded-full">
                            Использован
                          </span>
                        )}
                        {isExpired && !prize.isUsed && (
                          <span className="inline-block px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded-full">
                            Истёк
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {fortunePrizes.length > 4 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => router.push('/profile/prizes')}
                  className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                >
                  Показать все призы ({fortunePrizes.length}) →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions with colorful icons like burger menu */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <button
                className="flex items-center space-x-3 p-4 rounded-lg transition-colors text-left group border"
                style={{ 
                  backgroundColor: 'var(--color-primary-light, rgba(147, 51, 234, 0.1))',
                  borderColor: 'var(--color-primary-border, rgba(147, 51, 234, 0.3))'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-light-hover, rgba(147, 51, 234, 0.2))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-light, rgba(147, 51, 234, 0.1))';
                }}
                onClick={() => router.push('/courses')}
              >
                <span className="text-3xl">📚</span>
                <span 
                  className="text-base font-medium"
                  style={{ color: '#1F2937' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1F2937';
                  }}
                >
                  Мои курсы
                </span>
              </button>

              <button
                className="flex items-center space-x-3 p-4 rounded-lg transition-colors text-left group border"
                style={{ 
                  backgroundColor: 'var(--color-primary-light, rgba(147, 51, 234, 0.1))',
                  borderColor: 'var(--color-primary-border, rgba(147, 51, 234, 0.3))'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-light-hover, rgba(147, 51, 234, 0.2))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-light, rgba(147, 51, 234, 0.1))';
                }}
                onClick={() => router.push('/exercises')}
              >
                <span className="text-3xl">🏋️</span>
                <span 
                  className="text-base font-medium"
                  style={{ color: '#1F2937' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1F2937';
                  }}
                >
                  Упражнения
                </span>
              </button>

              <button
                className="flex items-center space-x-3 p-4 rounded-lg transition-colors text-left group border"
                style={{ 
                  backgroundColor: 'var(--color-primary-light, rgba(147, 51, 234, 0.1))',
                  borderColor: 'var(--color-primary-border, rgba(147, 51, 234, 0.3))'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-light-hover, rgba(147, 51, 234, 0.2))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-light, rgba(147, 51, 234, 0.1))';
                }}
                onClick={() => router.push('/photo-diary')}
              >
                <span className="text-3xl">📸</span>
                <span 
                  className="text-base font-medium"
                  style={{ color: '#1F2937' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1F2937';
                  }}
                >
                  Фото-дневник
                </span>
              </button>

              <button
                className="flex items-center space-x-3 p-4 rounded-lg transition-colors text-left group border"
                style={{ 
                  backgroundColor: 'var(--color-primary-light, rgba(147, 51, 234, 0.1))',
                  borderColor: 'var(--color-primary-border, rgba(147, 51, 234, 0.3))'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-light-hover, rgba(147, 51, 234, 0.2))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-light, rgba(147, 51, 234, 0.1))';
                }}
                onClick={() => router.push('/profile/settings')}
              >
                <span className="text-3xl">👤</span>
                <span 
                  className="text-base font-medium"
                  style={{ color: '#1F2937' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1F2937';
                  }}
                >
                  Профиль
                </span>
              </button>

              <button
                className="flex items-center space-x-3 p-4 rounded-lg transition-colors text-left group border"
                style={{ 
                  backgroundColor: 'var(--color-primary-light, rgba(147, 51, 234, 0.1))',
                  borderColor: 'var(--color-primary-border, rgba(147, 51, 234, 0.3))'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-light-hover, rgba(147, 51, 234, 0.2))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-light, rgba(147, 51, 234, 0.1))';
                }}
                onClick={() => router.push('/fortune-wheel')}
              >
                <span className="text-3xl">🎰</span>
                <span 
                  className="text-base font-medium"
                  style={{ color: '#1F2937' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1F2937';
                  }}
                >
                  Колесо Фортуны
                </span>
              </button>
            </div>
        </div>

        {/* Recent Activity Section - only for authenticated users */}
        {isAuthenticated && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Последняя активность</h2>
            {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-5xl mb-2">📭</div>
              <p className="text-gray-500">Активности пока нет</p>
              <p className="text-gray-400 text-sm mt-1">Начните с выбора курса!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity) => {
                if (activity.type === 'payment') {
                  const payment = activity.data as Payment;
                  return (
                    <div 
                      key={activity.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => payment.status === 'succeeded' && router.push(`/payment/success?orderId=${payment.id}`)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {payment.status === 'succeeded' ? '✅' : 
                           payment.status === 'processing' ? '⏳' : 
                           payment.status === 'failed' ? '❌' : '⏸️'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {payment.status === 'succeeded' ? 'Оплата принята' : 
                             payment.status === 'processing' ? 'Обработка оплаты' : 
                             payment.status === 'failed' ? 'Оплата не прошла' : 'Ожидание оплаты'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatProductName(payment)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">{payment.amount} ₽</p>
                        <p className="text-xs text-gray-500">
                          {new Date(payment.createdAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                  );
                } else {
                  // Приз колеса фортуны
                  const prize = activity.data as FortunePrize;
                  const getPrizeIcon = (type: string) => {
                    switch (type) {
                      case 'discount': return '🏷️';
                      case 'freeShipping': return '📦';
                      case 'product': return '🎁';
                      case 'freeProduct': return '🎁';
                      case 'personalDiscount': return '💎';
                      default: return '🎉';
                    }
                  };

                  const getPrizeTitle = (prize: FortunePrize) => {
                    if (prize.description) return prize.description;
                    if (prize.type === 'discount' && prize.discountPercent) {
                      return `Скидка ${prize.discountPercent}%`;
                    }
                    return prize.type;
                  };

                  return (
                    <div 
                      key={activity.id} 
                      className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getPrizeIcon(prize.type)}</div>
                        <div>
                          <p className="font-medium text-gray-800">
                            🎰 Приз Колеса Фортуны
                          </p>
                          <p className="text-sm text-gray-600">
                            {getPrizeTitle(prize)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded">
                          Активирован
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(prize.usedAt!).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
