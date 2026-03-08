import { useState, useRef } from 'react';
import Link from 'next/link';

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

interface FortuneWheelProps {
  prizes: Prize[];
  onSpin: () => Promise<{ prize: Prize; prizeIndex: number }>; // Возвращает приз и его индекс
  onConfirmPrize?: (prize: Prize) => Promise<void>;
  spinning: boolean;
}

// Предустановленные цвета для сегментов
const SEGMENT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
  '#F72585', '#4CC9F0', '#F15BB5', '#00BBF9', '#FEE440'
];

const FortuneWheel = ({ prizes, onSpin, onConfirmPrize, spinning }: FortuneWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [prizeConfirmed, setPrizeConfirmed] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const handleSpin = async () => {
    if (spinning) return;

    try {
      // Сбрасываем предыдущий результат
      setSelectedPrize(null);
      setPrizeConfirmed(false);
      
      const { prize: wonPrize, prizeIndex: backendIndex } = await onSpin();
      
      // КРИТИЧЕСКИ ВАЖНО: Находим индекс приза в НАШЕМ массиве по _id
      // Backend может вернуть индекс из другого снимка данных
      const localPrizeIndex = prizes.findIndex(p => p._id === wonPrize._id);
      
      if (localPrizeIndex === -1) {
        console.error('❌ Prize not found in local array!', wonPrize);
        // Fallback: используем индекс от backend (может быть неточно)
        const prizeIndex = backendIndex || 0;
        setSelectedPrize(wonPrize);
        return;
      }
      
      const prizeIndex = localPrizeIndex;
      console.log(`🎯 Won prize: "${wonPrize.name}" (backend index: ${backendIndex}, local index: ${prizeIndex})`);
      
      const segmentAngle = 360 / prizes.length;
      
      // Центр приза на колесе
      const prizeAngle = prizeIndex * segmentAngle + segmentAngle / 2;
      
      // ВАЖНО: Учитываем текущее положение колеса
      const currentAngle = rotation % 360;
      const targetAngle = 360 - prizeAngle;
      
      // Вычисляем необходимый поворот от текущего положения
      let deltaAngle = targetAngle - currentAngle;
      if (deltaAngle < 0) deltaAngle += 360; // Всегда крутим по часовой

      // Добавляем 5-7 полных оборотов для эффекта
      const fullRotations = 5 + Math.random() * 2;
      const finalRotation = rotation + fullRotations * 360 + deltaAngle;
      
      console.log(`🎯 Rotation: prize=${wonPrize.name}, index=${prizeIndex}, angle=${prizeAngle.toFixed(1)}°, current=${currentAngle.toFixed(1)}°, target=${targetAngle.toFixed(1)}°, delta=${deltaAngle.toFixed(1)}°, final=${finalRotation.toFixed(1)}°`);

      setRotation(finalRotation);
      
      // ВАЖНО: Показываем приз ТОЛЬКО после завершения анимации (4 секунды)
      setTimeout(() => {
        setSelectedPrize(wonPrize);
        console.log('🎁 Wheel stopped, showing prize:', wonPrize.name);
      }, 4000);
    } catch (error) {
      console.error('Spin failed:', error);
    }
  };

  const segmentAngle = 360 / prizes.length;

  const getPrizeIcon = (prize: Prize) => {
    if (prize.type === 'extraSpin') return '🎰';
    if (prize.type === 'discount') return '🏷️';
    if (prize.type === 'freeShipping') return '📦';
    if (prize.type === 'freeProduct' || prize.type === 'product') return '🎁';
    return '🎁';
  };

  const renderPrizeIcon = (prize: Prize) => {
    const icon = getPrizeIcon(prize);
    // Если иконка - это emoji (1-2 символа), отобразить как текст
    if (icon.length <= 2) {
      return <div className="text-xl mb-1">{icon}</div>;
    }
    // Иначе - это путь к картинке
    return (
      <div className="w-6 h-6 mb-1 mx-auto">
        <img 
          src={icon} 
          alt={prize.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback на emoji если картинка не загрузилась
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.innerHTML = getPrizeIcon(prize);
              parent.className = 'text-xl mb-1';
            }
          }}
        />
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Указатель */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
        <div 
          className="w-0 h-0"
          style={{
            borderLeft: '20px solid transparent',
            borderRight: '20px solid transparent',
            borderTop: '40px solid #F72585',
            filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))'
          }}
        />
      </div>

      {/* Колесо */}
      <div
        ref={wheelRef}
        className="relative aspect-square rounded-full overflow-hidden"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        }}
      >
        {prizes.map((prize, index) => {
          const startAngle = index * segmentAngle;
          const color = SEGMENT_COLORS[index % SEGMENT_COLORS.length];

          return (
            <div
              key={prize._id}
              className="absolute inset-0"
              style={{
                transform: `rotate(${startAngle}deg)`,
                transformOrigin: 'center',
              }}
            >
              <div
                className="absolute w-full h-full flex items-center justify-center"
                style={{
                  background: color,
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((segmentAngle * Math.PI) / 180)}% ${50 - 50 * Math.cos((segmentAngle * Math.PI) / 180)}%)`,
                }}
              >
                {/* Текст - максимально близко к внешнему краю */}
                <div
                  className="text-white text-center absolute"
                  style={{ 
                    transform: `rotate(${segmentAngle / 2}deg) translateY(-168px)`,
                    transformOrigin: 'center',
                    width: '80px'
                  }}
                >
                  <div className="text-[10px] font-bold px-1 leading-tight" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                    {prize.name}
                  </div>
                </div>
                
                {/* Иконка - под текстом, ближе к центру */}
                <div
                  className="text-white text-center absolute"
                  style={{ 
                    transform: `rotate(${segmentAngle / 2}deg) translateY(-125px)`,
                    transformOrigin: 'center',
                    width: '80px'
                  }}
                >
                  {renderPrizeIcon(prize)}
                </div>
              </div>
            </div>
          );
        })}

        {/* Центральная кнопка */}
        <button
          onClick={handleSpin}
          disabled={spinning}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center font-bold text-lg border-4 transition-transform disabled:opacity-50 disabled:cursor-not-allowed z-10"
          style={{
            borderColor: '#F72585',
            color: '#F72585',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transform: spinning ? 'translate(-50%, -50%) scale(0.95)' : 'translate(-50%, -50%) scale(1)',
          }}
          onMouseEnter={(e) => {
            if (!spinning) {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!spinning) {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
            }
          }}
        >
          {spinning ? '...' : 'КРУТИТЬ'}
        </button>
      </div>

      {/* Результат */}
      {selectedPrize && !spinning && (
        <div className="mt-6 bg-white rounded-xl p-6 text-center border-2 animate-fadeIn"
          style={{
            borderColor: '#F72585',
            boxShadow: '0 4px 12px rgba(247, 37, 133, 0.3)',
          }}
        >
          <div className="text-5xl mb-3 flex justify-center">{renderPrizeIcon(selectedPrize)}</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Поздравляем!
          </h3>
          <p className="text-lg font-semibold mb-2" style={{ color: '#F72585' }}>
            {selectedPrize.name}
          </p>
          {selectedPrize.description && (
            <p className="text-gray-600 text-sm mb-4">{selectedPrize.description}</p>
          )}
          
          {!prizeConfirmed && (
            <button
              onClick={async () => {
                if (onConfirmPrize) {
                  setConfirming(true);
                  try {
                    await onConfirmPrize(selectedPrize);
                    setPrizeConfirmed(true);
                  } catch (error) {
                    console.error('Failed to confirm prize:', error);
                    alert('Не удалось активировать приз');
                  } finally {
                    setConfirming(false);
                  }
                }
              }}
              disabled={confirming}
              className="mt-4 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {confirming ? 'Активация...' : '🎁 Забрать приз'}
            </button>
          )}
          
          {prizeConfirmed && (
            <div className="mt-4 space-y-3">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-semibold mb-2">✅ Приз активирован и добавлен в ваш профиль!</p>
                <p className="text-sm text-green-600">
                  Вы можете просмотреть все свои призы в личном кабинете
                </p>
              </div>
              <Link 
                href="/dashboard"
                className="inline-block w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md text-center"
              >
                🏠 Перейти в Личный кабинет
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FortuneWheel;
