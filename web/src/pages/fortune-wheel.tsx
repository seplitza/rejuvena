import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import api from '../api/api';

interface Prize {
  _id: string;
  name: string;
  description: string;
  probability: number;
  type: string;
  value: number | string;
  icon?: string;
}

interface SpinResult {
  success: boolean;
  prize: Prize;
  remainingSpins: number;
  extraSpinsAwarded?: number;
  message?: string;
}

export default function FortuneWheelPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [availableSpins, setAvailableSpins] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [error, setError] = useState('');
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    loadPrizes();
    if (isAuthenticated) {
      loadAvailableSpins();
    }
  }, [isAuthenticated]);

  const loadPrizes = async () => {
    try {
      const response = await api.get('/fortune-wheel/prizes');
      setPrizes(response.data);
    } catch (err: any) {
      console.error('Error loading prizes:', err);
      setError('Не удалось загрузить призы');
    }
  };

  const loadAvailableSpins = async () => {
    try {
      const response = await api.get('/fortune-wheel/available-spins');
      setAvailableSpins(response.data.spins || 0);
    } catch (err: any) {
      console.error('Error loading spins:', err);
    }
  };

  const handleSpin = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (availableSpins <= 0) {
      setError('У вас нет доступных вращений');
      return;
    }

    setIsSpinning(true);
    setError('');
    setWonPrize(null);

    try {
      // Animate wheel rotation
      const spins = 5 + Math.random() * 3; // 5-8 full rotations
      const newRotation = rotation + 360 * spins + Math.random() * 360;
      setRotation(newRotation);

      // Call API to get actual prize
      const response = await api.post<SpinResult>('/fortune-wheel/spin');
      
      // Wait for animation to finish
      setTimeout(() => {
        setWonPrize(response.data.prize);
        setAvailableSpins(response.data.remainingSpins);
        setIsSpinning(false);

        if (response.data.extraSpinsAwarded) {
          alert(`🎉 ${response.data.message || 'Вы выиграли дополнительные вращения!'}`);
        }
      }, 3000);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при вращении колеса');
      setIsSpinning(false);
    }
  };

  return (
    <>
      <Head>
        <title>Колесо Фортуны - Rejuvena</title>
        <meta name="description" content="Крутите колесо фортуны и выигрывайте призы!" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-purple-900 mb-4">
              🎰 Колесо Фортуны
            </h1>
            <p className="text-xl text-gray-700">
              Крутите колесо и выигрывайте призы!
            </p>
          </div>

          {/* Spins Counter */}
          {isAuthenticated && (
            <div className="text-center mb-8">
              <div className="inline-block bg-white rounded-full px-8 py-4 shadow-lg">
                <div className="text-sm text-gray-600 mb-1">Доступно вращений</div>
                <div className="text-4xl font-bold text-purple-600">{availableSpins}</div>
              </div>
            </div>
          )}

          {/* Fortune Wheel */}
          <div className="relative mb-12">
            <div className="max-w-md mx-auto">
              {/* Wheel Container */}
              <div className="relative aspect-square bg-white rounded-full shadow-2xl p-8">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-10">
                  <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-red-500"></div>
                </div>

                {/* Spinning Wheel */}
                <div 
                  className="w-full h-full rounded-full border-8 border-purple-600 overflow-hidden transition-transform duration-[3000ms] ease-out"
                  style={{ 
                    transform: `rotate(${rotation}deg)`,
                    background: `conic-gradient(
                      from 0deg,
                      #ff6b6b 0% 6.67%,
                      #4ecdc4 6.67% 13.34%,
                      #45b7d1 13.34% 20%,
                      #f9ca24 20% 26.67%,
                      #6c5ce7 26.67% 33.34%,
                      #fd79a8 33.34% 40%,
                      #00b894 40% 46.67%,
                      #e17055 46.67% 53.34%,
                      #74b9ff 53.34% 60%,
                      #a29bfe 60% 66.67%,
                      #ffeaa7 66.67% 73.34%,
                      #fab1a0 73.34% 80%,
                      #ff7675 80% 86.67%,
                      #fdcb6e 86.67% 93.34%,
                      #55efc4 93.34% 100%
                    )`
                  }}
                >
                  <div className="relative w-full h-full">
                    {prizes.slice(0, 15).map((prize, index) => {
                      const angle = (360 / 15) * index;
                      return (
                        <div
                          key={prize._id}
                          className="absolute top-1/2 left-1/2 origin-left"
                          style={{
                            transform: `rotate(${angle}deg) translateX(50%)`,
                            width: '40%'
                          }}
                        >
                          <div 
                            className="text-xs font-bold text-white text-center"
                            style={{ transform: 'rotate(90deg)' }}
                          >
                            {prize.name.length > 20 ? prize.name.substring(0, 20) + '...' : prize.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Center Button */}
                <button
                  onClick={handleSpin}
                  disabled={isSpinning || !isAuthenticated || availableSpins <= 0}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-xl shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed z-20"
                >
                  {isSpinning ? '🎰' : 'КРУТИТЬ'}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
              {error}
            </div>
          )}

          {/* Won Prize Display */}
          {wonPrize && (
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-4 border-purple-500 rounded-lg p-8 mb-8 text-center animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-purple-900 mb-2">
                Поздравляем!
              </h2>
              <p className="text-xl text-purple-700 mb-4">
                Вы выиграли:
              </p>
              <div className="text-2xl font-bold text-purple-900 mb-2">
                {wonPrize.name}
              </div>
              <p className="text-gray-700">
                {wonPrize.description}
              </p>
            </div>
          )}

          {/* Login Prompt */}
          {!isAuthenticated && (
            <div className="text-center bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Войдите, чтобы крутить колесо</h3>
              <button
                onClick={() => router.push('/auth/login')}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Войти
              </button>
            </div>
          )}

          {/* Prizes List */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-purple-900 mb-6 text-center">
              🎁 Доступные Призы
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prizes.map((prize) => (
                <div key={prize._id} className="border border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="font-semibold text-purple-900 mb-2">
                    {prize.name}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {prize.description}
                  </div>
                  <div className="text-xs text-purple-600 font-semibold">
                    Шанс: {prize.probability}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
