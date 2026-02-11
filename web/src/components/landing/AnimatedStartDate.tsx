import React, { useState, useEffect } from 'react';

interface AnimatedStartDateProps {
  startDate: Date; // 16 Feb 2026, 08:00 MSK
  title?: string;
}

const AnimatedStartDate: React.FC<AnimatedStartDateProps> = ({ 
  startDate,
  title = "СТАРТ МАРАФОНА"
}) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = startDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate]);

  const formatDate = () => {
    return startDate.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    }).toUpperCase();
  };

  return (
    <div className="relative py-20 px-4 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Animated title - elements fly in from sides */}
        <div className="mb-8 overflow-hidden text-center">
          <div className="inline-block">
            {title.split(' ').map((word, wordIndex) => (
              <div key={wordIndex} className="inline-block" style={{ marginRight: wordIndex < title.split(' ').length - 1 ? '0.75rem' : '0' }}>
                {word.split('').map((letter, letterIndex) => (
                  <span
                    key={letterIndex}
                    className={`text-4xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-2xl inline-block ${
                      mounted ? 'animate-slide-in-letter' : 'opacity-0'
                    }`}
                    style={{
                      animationDelay: `${(wordIndex * 10 + letterIndex) * 50}ms`,
                      animationDirection: wordIndex % 2 === 0 ? 'normal' : 'reverse'
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Date banner */}
        <div 
          className={`text-center mb-10 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{ animationDelay: '800ms' }}
        >
          <div className="inline-block bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl border-2 border-white/30 shadow-2xl">
            <p className="text-2xl md:text-4xl font-bold text-white tracking-wide">
              {formatDate()}
            </p>
            <p className="text-lg md:text-xl text-white/90 mt-1">
              08:00 МСК
            </p>
          </div>
        </div>

        {/* Countdown timer */}
        <div 
          className={`grid grid-cols-4 gap-3 md:gap-6 max-w-3xl mx-auto ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{ animationDelay: '1200ms' }}
        >
          {[
            { value: timeLeft.days, label: 'ДНЕЙ' },
            { value: timeLeft.hours, label: 'ЧАСОВ' },
            { value: timeLeft.minutes, label: 'МИНУТ' },
            { value: timeLeft.seconds, label: 'СЕКУНД' }
          ].map((item, index) => (
            <div 
              key={item.label}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 shadow-xl transform hover:scale-105 transition-transform"
            >
              <div className="text-4xl md:text-6xl font-black text-white tabular-nums">
                {String(item.value).padStart(2, '0')}
              </div>
              <div className="text-xs md:text-sm text-white/80 mt-2 font-semibold tracking-wider">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Pulsing call-to-action */}
        <div 
          className={`text-center mt-10 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{ animationDelay: '1600ms' }}
        >
          <p className="text-xl md:text-2xl text-white font-semibold animate-pulse">
            🚀 Успей записаться до старта!
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-40px) translateX(-10px); }
          75% { transform: translateY(-20px) translateX(5px); }
        }

        @keyframes slide-in-left {
          0% {
            opacity: 0;
            transform: translateX(-100px) rotate(-20deg);
          }
          100% {
            opacity: 1;
            transform: translateX(0) rotate(0);
          }
        }

        @keyframes slide-in-right {
          0% {
            opacity: 0;
            transform: translateX(100px) rotate(20deg);
          }
          100% {
            opacity: 1;
            transform: translateX(0) rotate(0);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float infinite ease-in-out;
        }

        .animate-slide-in-letter {
          animation: slide-in-left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        [style*="animation-direction: reverse"] .animate-slide-in-letter {
          animation-name: slide-in-right;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AnimatedStartDate;
