import React from 'react';
import AnimatedStartDate from '../components/landing/AnimatedStartDate';

const TestAnimationPage: React.FC = () => {
  // 16 февраля 2026, 08:00 МСК (UTC+3)
  const marathonStartDate = new Date('2026-02-16T08:00:00+03:00');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Тест анимированного блока старта марафона
          </h1>
          <p className="mt-2 text-gray-600">
            Прокрутите вниз, чтобы увидеть анимацию при загрузке
          </p>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-20"></div>

      {/* Animated Start Date Component */}
      <AnimatedStartDate 
        startDate={marathonStartDate}
        title="СТАРТ 16 ФЕВРАЛЯ"
      />

      {/* Additional content */}
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Особенности анимации
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Буквы вылетают слева и справа поочередно</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Плавающие частицы на фоне создают динамику</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Обратный отсчет до 8:00 утра МСК 16 февраля 2026</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Градиентный фон purple → pink → orange</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Адаптивный дизайн для всех устройств</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Эффект glass-morphism на карточках</span>
            </li>
          </ul>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Интеграция в лэндинг
            </h3>
            <p className="text-blue-800 text-sm">
              Этот компонент можно добавить в любое место лэндинга марафона. 
              Он автоматически рассчитывает время до старта и обновляется каждую секунду.
            </p>
            <div className="mt-3 bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
              {`<AnimatedStartDate 
  startDate={new Date('2026-02-16T08:00:00+03:00')}
  title="СТАРТ 16 ФЕВРАЛЯ"
/>`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAnimationPage;
