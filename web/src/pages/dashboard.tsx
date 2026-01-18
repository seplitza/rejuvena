import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/modules/auth/slice';
import { AuthTokenManager, request } from '../api';
import * as endpoints from '../api/endpoints';
import LanguageSelector from '../components/common/LanguageSelector';
import PremiumPlanCard from '../components/payment/PremiumPlanCard';

interface Payment {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  metadata?: {
    planType?: string;
    duration?: number;
  };
}

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);

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
    
    if (isAuthenticated) {
      loadPayments();
    }
  }, [isAuthenticated]);

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
                // Clear auth state in Redux
                dispatch(logout());
                // Clear token from localStorage
                AuthTokenManager.remove();
                // Redirect to login page
                router.push('/auth/login');
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Добро пожаловать, {user?.firstName || 'Пользователь'}!
          </h2>
          <p className="text-gray-600">
            Email: {user?.email || 'Не указан'}
          </p>
        </div>

        {/* Premium Status or Plan Card */}
        {user?.isPremium ? (
          <div className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">✨ Премиум доступ активен</h3>
                <p className="text-purple-100">
                  Активен до: {user?.premiumEndDate ? new Date(user.premiumEndDate).toLocaleDateString('ru-RU') : 'неизвестно'}
                </p>
                <p className="text-purple-100 mt-1">
                  🎯 Полный доступ ко всем упражнениям и материалам
                </p>
              </div>
              <div className="text-6xl">👑</div>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <PremiumPlanCard />
          </div>
        )}

        {/* Recent Activity Section */}
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
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {payment.status === 'succeeded' ? '✅' : 
                       payment.status === 'processing' ? '⏳' : 
                       payment.status === 'failed' ? '❌' : '⏸️'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {payment.status === 'succeeded' ? 'Оплата успешна' : 
                         payment.status === 'processing' ? 'Обработка оплаты' : 
                         payment.status === 'failed' ? 'Ошибка оплаты' : 'Ожидание оплаты'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {payment.metadata?.planType === 'premium' 
                          ? `Премиум доступ на ${payment.metadata.duration} дней` 
                          : 'Покупка'}
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

        {/* Recent Activity */}
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Последняя активность
            </h3>
          </div>
          <div className="p-6">
            <div className="text-center text-gray-500 py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="mt-2">Активности пока нет</p>
              <p className="text-sm">Начните с выбора курса!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
