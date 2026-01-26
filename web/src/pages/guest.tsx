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
    if (isAuthenticated && user && user.email && !user.email.includes('@guest')) {
      router.push('/dashboard');
      return;
    }
    if (!isAuthenticated) {
      dispatch(guestUserLogin());
    }
  }, [isAuthenticated, user, dispatch, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-        <div className="max-w-7xl mx-auto px-4 py-        <div className="max-w-7xl-3xl f        <div className="max-w-7xl mx-aut�бинет</h1>
          <div className="          <div className="          <div className="          <            <div className="          <div className="        ss          <div className="          <div className="          <div cg-          <div className="          <div classNmd">�          <div className="        >
          <div className=ader>          <div className=ader>7xl mx-          <div className=ader>          <div className=ader>7xl mx-       fr          <div cpink-50 rounded-lg shadow p-6 mb-6 border border-purple-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Добро пожаловать! 👋</h2>
          <p className="text-gray-600 mb-4">Вы просматриваете сайт в гостевом режиме. <button onClick={() =          <p className="text-gray-600 e="te          <p className="text-gray-600 mb-4">Вы просматриваете сайт в гостевом режиме. <button onClick={() =          <p className="text-gray-600 e="te         800 font-semibold underline">зарегистрируйтесь</button>, чтобы получить полный доступ.</p>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Наши предложения ✨</h2>
          <OffersGrid />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <button onClick={() => router.push('/exercises')} className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-1">Упражнения</h3>
            <p className="text-sm text-gray-600">Просмотр доступных упражнений</p>
          </button>
          <button onClick={() => router.push('/marathons')} className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left">
            <div className="text-4xl mb-2">🏃</div>
            <h3 className="font-semibold text-gray-900 mb-1">Марафоны</h3>
            <p className="text-sm text-gray-600">Присоединяйтесь к марафонам</p>
          </button>
          <button onClick={() => router.push('/auth/signup')} className="p-6 bg-gradient-to-br from-purple-500          <button onClick={() => router.push('/auth/signup')} className="p-6 bg-grrm          <button onClick={() => router.push('/auth/signup')} className="p-6 bg-gradient-to-br from-purple-500          <button onClick={() => rouц          <button onClick={() => router.push('/auth/pl          <button onClick={() => router.push('/auth/signup')} className="p-6 bg-gradi     </div>
      </main>
    </div>
  );
};

export default GuestPage;
