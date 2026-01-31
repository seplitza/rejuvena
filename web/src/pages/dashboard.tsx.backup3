import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/modules/auth/slice';
import { AuthTokenManager, request } from '../api';
import * as endpoints from '../api/endpoints';
import LanguageSelector from '../components/common/LanguageSelector';
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
  userEnrolled?: boolean;
  userEnrollmentStatus?: 'pending' | 'active' | 'completed' | 'cancelled';
}

// Функция форматирования названия продукта
const formatProductName = (payment: Payment): string => {
  const meta = payment.metadata;
  if (!meta) return 'Покупка';
  
  if (meta.type === 'premium' || meta.planType === 'premium') {
    return 'Покупка: Премиум доступ';
  }
  
  if (meta.type === 'marathon' && meta.marathonName) {
    return `Покупка: ${meta.marathonName}`;
  }
  
  if (meta.type === 'exercise' && meta.exerciseName) {
    return `Покупка: ${meta.exerciseName}`;
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

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

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
        
        const response = await fetch(`${apiUrl}/api/marathons`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.marathons) {
            const enrolled = data.marathons.filter((m: Marathon) => m.userEnrolled);
            setEnrolledMarathons(enrolled);
          }
        }
      } catch (error) {
        console.error('Failed to load marathons:', error);
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
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
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
            <LanguageSelector />
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
            Добро пожаловать, {user?.firstName || 'Гость'}!
          </h2>
          <p className="text-gray-600">
            Email: {user?.email || 'Не указан'}
          </p>
        </div>

        {/* Premium Status or Plan Card */}
        {user?.isPremium && (
          <div className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">✨ Премиум доступ активен</h3>
                <p className="text-purple-100">
                  Активен до: {user?.premiumEndDate ? new Date(user.premiumEndDate).toLocaleDateString('ru-RU') : 'неизвестно'}
                </p>
                {user?.premiumEndDate && (
                  <p className="text-purple-100 mt-1">
                    Осталось дней: {Math.max(0, Math.ceil((new Date(user.premiumEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                  </p>
                )}
                <p className="text-purple-100 mt-1">
                  🎯 Разблокирован доступ ко всем упражнениям
                </p>
              </div>
              <div className="text-6xl">👑</div>
            </div>
          </div>
        )}

        {/* Enrolled Marathons Banner */}
        {enrolledMarathons.length > 0 && (
          <div className="mb-6 space-y-4">
            {enrolledMarathons.map((marathon) => (
              <div 
                key={marathon._id}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => router.push(`/marathons/${marathon._id}/start`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">🎯 {marathon.title}</h3>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Оплачено</span>
                    </div>
                    {marathon.description && (
                      <p className="text-blue-100 mb-2">{marathon.description}</p>
                    )}
                    <p className="text-blue-100">
                      📅 Длительность: {marathon.numberOfDays} дней
                    </p>
                  </div>
                  <button className="ml-4 bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors flex-shrink-0">
                    Перейти в марафон →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Marathons and Offers - Always visible */}
        <div className="mb-6">
          <OffersGrid />
        </div>

        {/* Quick Actions with colorful icons like burger menu */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                className="flex items-center space-x-3 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-left group border border-purple-200"
                onClick={() => router.push('/courses')}
              >
                <span className="text-3xl">📚</span>
                <span className="text-base font-medium text-gray-800 group-hover:text-purple-600">Мои курсы</span>
              </button>

              <button
                className="flex items-center space-x-3 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-left group border border-purple-200"
                onClick={() => router.push('/exercises')}
              >
                <span className="text-3xl">🏋️</span>
                <span className="text-base font-medium text-gray-800 group-hover:text-purple-600">Упражнения</span>
              </button>

              <button
                className="flex items-center space-x-3 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-left group border border-purple-200"
                onClick={() => router.push('/photo-diary')}
              >
                <span className="text-3xl">📸</span>
                <span className="text-base font-medium text-gray-800 group-hover:text-purple-600">Фото-дневник</span>
              </button>

              <button
                className="flex items-center space-x-3 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-left group border border-purple-200"
                onClick={() => router.push('/profile/settings')}
              >
                <span className="text-3xl">👤</span>
                <span className="text-base font-medium text-gray-800 group-hover:text-purple-600">Профиль</span>
              </button>
            </div>
        </div>

        {/* Recent Activity Section - only for authenticated users */}
        {isAuthenticated && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Последняя активность</h2>
            {recentPayments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-5xl mb-2">📭</div>
              <p className="text-gray-500">Активности пока нет</p>
              <p className="text-gray-400 text-sm mt-1">Начните с выбора курса!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div 
                  key={payment.id} 
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
              ))}
            </div>
          )}
        </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
