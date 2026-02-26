import { useState, useRef, useEffect } from 'react';
import { FortuneWheelPrize } from '@/types/shop';

interface FortuneWheelProps {
  prizes: FortuneWheelPrize[];
  onSpin: () => Promise<FortuneWheelPrize>;
  spinning: boolean;
}

const FortuneWheel = ({ prizes, onSpin, spinning }: FortuneWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState<FortuneWheelPrize | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const handleSpin = async () => {
    if (spinning) return;

    try {
      const wonPrize = await onSpin();
      setSelectedPrize(wonPrize);

      // Find the index of the won prize
      const prizeIndex = prizes.findIndex((p) => p._id === wonPrize._id);
      const segmentAngle = 360 / prizes.length;
      const targetAngle = 360 - (prizeIndex * segmentAngle + segmentAngle / 2);

      // Add multiple full rotations for effect (5-7 rotations)
      const fullRotations = 5 + Math.random() * 2;
      const finalRotation = rotation + fullRotations * 360 + targetAngle;

      setRotation(finalRotation);
    } catch (error) {
      console.error('Spin failed:', error);
    }
  };

  const segmentAngle = 360 / prizes.length;

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
        <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-primary-500 drop-shadow-lg" />
      </div>

      {/* Wheel */}
      <div
        ref={wheelRef}
        className="relative aspect-square rounded-full overflow-hidden shadow-2xl"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
        }}
      >
        {prizes.map((prize, index) => {
          const startAngle = index * segmentAngle;
          const endAngle = startAngle + segmentAngle;

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
                className="absolute w-full h-full origin-center"
                style={{
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((endAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((endAngle - 90) * Math.PI / 180)}%)`,
                }}
              >
                <div
                  className="w-full h-full flex items-start justify-center pt-8"
                  style={{ backgroundColor: prize.color }}
                >
                  <div
                    className="text-white text-center"
                    style={{ transform: `rotate(${segmentAngle / 2}deg)` }}
                  >
                    <div className="text-3xl mb-1">{prize.icon || '🎁'}</div>
                    <div className="text-xs font-semibold px-2">
                      {prize.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Center Button */}
        <button
          onClick={handleSpin}
          disabled={spinning}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center font-bold text-primary-600 text-lg border-4 border-primary-500 hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed z-10"
        >
          {spinning ? '...' : 'КРУТИТЬ'}
        </button>
      </div>

      {/* Prize Display */}
      {selectedPrize && !spinning && (
        <div className="mt-6 bg-white rounded-xl p-6 text-center shadow-lg border-2 border-primary-500 animate-fadeIn">
          <div className="text-5xl mb-3">{selectedPrize.icon || '🎁'}</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Поздравляем!
          </h3>
          <p className="text-lg text-primary-600 font-semibold mb-2">
            {selectedPrize.name}
          </p>
          {selectedPrize.description && (
            <p className="text-gray-600 text-sm">{selectedPrize.description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FortuneWheel;
