import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { guestUserLogin } from '../store/modules/auth/slice';
import LanguageSelector from '../components/common/LanguageSelector';
import OffersGrid from '../components/OffersGrid';

const GuestPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Только перенаправляем если это НАСТОЯЩИЙ пользователь (не гость)
    if (isAuthenticated && user && user.email && !user.email.includes('@guest')) {
      router.push('/dashboard');
      return;
    }
    
    // Автоматический гостевой логин если совсем не авторизован
    if (!isAuthenticated) {
      dispatch(guestUserLogin());
    }
  }, [isAuthenticated, user, dispatch, router]);

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
              onClick={() => router.push('/auth/login')}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              Вход
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Добро пожаловать, Гость!
          </h2>
          <p className="text-gray-600">
            Email: Не указан
          </p>
        </div>

        {/* Offers Grid - Premium + Marathons */}
        <OffersGrid />

        {/* Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => router.push('/exercises')}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left"
          >
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-1">Упражнения</h3>
            <p className="text-sm text-gray-600">Просмотр доступных упражнений</p>
          </button>

          <button
            onClick={() => router.push('/photo-diary')}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left"
          >
            <div className="text-4xl mb-2">📸</div>
            <h3 className="font-semibold text-gray-900 mb-1">Фото-дневник</h3>
            <p className="text-sm text-gray-600">Отслеживайте свой прогресс</p>
          </button>

          <button
            onClick={() => router.push('/profile/settings')}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left"
          >
            <div className="text-4xl mb-2">👤</div>
            <h3 className="font-semibold text-gray-900 mb-1">Профиль</h3>
            <p className="text-sm text-gray-600">Настройки аккаунта</p>
          </button>

          <button
            onClick={() => router.push('/auth/login')}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left border-2 border-purple-300"
          >
            <div className="text-4xl mb-2">🔐</div>
            <h3 className="font-semibold text-purple-600 mb-1">Войти</h3>
            <p className="text-sm text-gray-600">Получить полный доступ</p>
          </button>
        </div>

        {/* Гость не видит активность */}
      </main>
    </div>
  );
};

export default GuestPage;
