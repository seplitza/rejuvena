import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from '../store/hooks';
import { request } from '../api';
import * as endpoints from '../api/endpoints';
import FortuneWheel from '../components/FortuneWheel';

interface Prize {
  _id: string;
  name: string;
  description?: string;
  type: string;
  value: any;
  probability: number;
  icon?: string;
  validityDays?: number;
  isActive: boolean;
}

interface SpinResult {
  success: boolean;
  prize: Prize;
  prizeIndex: number; // Индекс приза на колесе
  extraSpinsAwarded?: number;
  remainingSpins: number;
  message?: string;
}

export default function FortuneWheelPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [availableSpins, setAvailableSpins] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPrizes();
    if (isAuthenticated) {
      loadAvailableSpins();
    }
  }, [isAuthenticated]);

  const loadPrizes = async () => {
    try {
      const response = await request.get(endpoints.get_fortune_wheel_prizes) as unknown as Prize[];
      setPrizes(response);
    } catch (err: any) {
      console.error('Failed to load prizes:', err);
      setError('Не удалось загрузить призы');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSpins = async () => {
    try {
      const response = await request.get(
        endpoints.get_available_spins
      ) as unknown as { availableSpins: number };
      setAvailableSpins(response.availableSpins || 0);
    } catch (err: any) {
      console.error('Failed to load spins:', err);
    }
  };

  const handleSpin = async (): Promise<{ prize: Prize; prizeIndex: number }> => {
    if (!isAuthenticated) {
      alert('Войдите, чтобы крутить колесо');
      router.push('/auth/login?returnUrl=' + encodeURIComponent('/fortune-wheel'));
      throw new Error('Not authenticated');
    }

    if (availableSpins <= 0) {
      alert('У вас нет доступных вращений');
      throw new Error('No spins available');
    }

    setSpinning(true);
    console.log('🎰 Starting spin...');

    try {
      const result = await request.post(endpoints.spin_wheel) as unknown as SpinResult;
      console.log('🎁 Spin result:', result);
      
      // Обновляем количество спинов
      setAvailableSpins(result.remainingSpins);
      console.log(`✅ Remaining spins: ${result.remainingSpins}`);

      // Если выиграли дополнительные спины, показываем сообщение
      if (result.extraSpinsAwarded) {
        setTimeout(() => {
          alert(`🎉 ${result.message || `Вы выиграли ${result.extraSpinsAwarded} дополнительных вращения!`}`);
        }, 4500);
      }

      // Ждем завершения анимации и разблокируем кнопку
      setTimeout(() => {
        setSpinning(false);
        console.log('✅ Spin animation completed, button unlocked');
      }, 4500); // Увеличено до 4.5 сек для завершения анимации

      return { prize: result.prize, prizeIndex: result.prizeIndex || 0 };
    } catch (err: any) {
      console.error('❌ Spin error:', err);
      setSpinning(false);
      // Reload available spins after error to show correct count
      await loadAvailableSpins();
      const message = err.message || 'Не удалось прокрутить колесо';
      alert(message);
      throw err;
    }
  };

  const handleConfirmPrize = async (prize: Prize) => {
    console.log('🎁 [FortuneWheelPage] Confirming prize:', prize);
    
    try {
      const result = await request.post('/api/fortune-wheel/confirm-prize', { 
        prizeId: prize._id 
      }) as any;
      
      console.log('✅ Prize confirmed:', result);
      
      // Обновляем количество доступных спинов (после активации = 0)
      if (result.remainingSpins !== undefined) {
        setAvailableSpins(result.remainingSpins);
        console.log(`🎰 Spins updated to: ${result.remainingSpins}`);
      }
    } catch (err: any) {
      console.error('❌ Prize confirmation error:', err);
      const message = err.message || 'Не удалось активировать приз';
      throw new Error(message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="text-center">
          <div className="text-6xl mb-4">🎰</div>
          <p className="text-gray-600">Загрузка колеса фортуны...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-6xl mb-4">😞</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-purple-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎰 Колесо Фортуны
          </h1>
          <p className="text-lg text-gray-700">
            Испытайте удачу! Крутите колесо и выигрывайте скидки, бесплатные товары и дополнительные спины.
          </p>
        </div>

        {/* Счетчик спинов */}
        {isAuthenticated ? (
          <div className="bg-white rounded-2xl p-8 text-center mb-8 shadow-xl max-w-md mx-auto">
            <div className="text-6xl mb-3">🎟️</div>
            <p className="text-gray-600 mb-2 text-lg">Доступно вращений:</p>
            <p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {availableSpins}
            </p>
            {availableSpins === 0 && (
              <p className="text-sm text-gray-500 mt-3">
                Вращения начисляются при покупке товаров
              </p>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center mb-8 shadow-xl max-w-md mx-auto">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-2xl font-semibold mb-3">Войдите, чтобы крутить колесо</h3>
            <p className="text-gray-600 mb-6">
              Получайте бесплатные вращения за покупки!
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              Войти
            </button>
          </div>
        )}

        {/* Колесо */}
        <div className="mb-12">
          <FortuneWheel
            prizes={prizes}
            onSpin={handleSpin}
            onConfirmPrize={handleConfirmPrize}
            spinning={spinning}
          />
        </div>

        {/* Информация о призах */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🎁 Призы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prizes.filter(p => p.isActive).map((prize) => (
              <div
                key={prize._id}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
              >
                <div className="text-3xl">{prize.type === 'extraSpin' ? '🎰' : prize.type === 'discount' ? '🏷️' : prize.type === 'freeShipping' ? '📦' : '🎁'}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{prize.name}</div>
                  {prize.description && (
                    <div className="text-sm text-gray-600">{prize.description}</div>
                  )}
                </div>
                <div className="text-sm font-bold text-purple-600">
                  {prize.probability}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Кнопка назад */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 text-purple-600 hover:text-purple-700 font-semibold"
          >
            ← Вернуться на главную
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
