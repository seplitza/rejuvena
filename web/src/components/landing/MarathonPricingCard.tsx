import React from 'react';

interface MarathonPricingCardProps {
  title: string;
  duration: string;
  tenure?: number; // Общая продолжительность в днях
  price: number;
  oldPrice?: number;
  features: string[];
  isAdvanced?: boolean;
  spotsLeft: number;
  onPaymentClick: () => void;
  onDetailsClick: () => void;
  buttonText: string;
}

const MarathonPricingCard: React.FC<MarathonPricingCardProps> = ({
  title,
  duration,
  tenure,
  price,
  oldPrice,
  features,
  isAdvanced = false,
  spotsLeft,
  onPaymentClick,
  onDetailsClick,
  buttonText
}) => {
  const baseClasses = isAdvanced 
    ? "bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white transform md:scale-105 relative"
    : "bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200 hover:border-blue-400 transition";

  return (
    <div className={baseClasses}>
      {isAdvanced && (
        <div className="absolute -top-4 right-4 bg-yellow-400 text-purple-900 px-4 py-1 rounded-full text-sm font-bold">
          Популярный
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className={`text-2xl font-bold mb-2 ${isAdvanced ? '' : 'text-blue-600'}`}>
          {title}
        </h3>
        
        {/* Продолжительность (количество дней доступа) */}
        {tenure && (
          <p className={`text-lg mt-1 ${isAdvanced ? 'opacity-90' : 'text-gray-600'}`}>
            {tenure} {tenure === 1 ? 'день' : tenure < 5 ? 'дня' : 'дней'} полного доступа
          </p>
        )}
        
        {/* Цена */}
        <div className="mt-4">
          {oldPrice && (
            <div className="mb-1">
              <span className={`text-2xl line-through ${isAdvanced ? 'text-white opacity-50' : 'text-gray-400'}`}>
                {oldPrice}₽
              </span>
            </div>
          )}
          <span className={`text-4xl font-bold ${isAdvanced ? '' : 'text-gray-800'}`}>
            {price}₽
          </span>
        </div>
        
        {/* Динамический счетчик мест */}
        <div className="mt-3">
          <p className={`text-sm font-medium ${isAdvanced ? 'text-yellow-300' : 'text-orange-600'}`}>
            Успей занять место по льготной цене
          </p>
          <p className={`text-xs mt-1 ${isAdvanced ? 'opacity-90' : 'text-gray-600'}`}>
            Осталось мест: <span className="font-bold">{spotsLeft}</span>
          </p>
        </div>
      </div>

      {/* Список фич */}
      <ul className="space-y-3 mb-6">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className={`text-xl ${isAdvanced ? 'text-yellow-300' : 'text-green-500'}`}>✓</span>
            <span className={isAdvanced ? '' : 'text-gray-700'}>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Кнопка "Подробнее" */}
      <button
        onClick={onDetailsClick}
        className={`w-full py-2 mb-3 rounded-lg font-medium transition ${
          isAdvanced 
            ? 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
      >
        Подробнее →
      </button>

      {/* Основная кнопка оплаты */}
      <button
        onClick={onPaymentClick}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          isAdvanced
            ? 'bg-white text-purple-600 hover:shadow-lg'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {buttonText}
      </button>

      {/* Текст о скидке - только для продвинутого */}
      {isAdvanced && (
        <div className="mt-4 text-center text-xs text-white opacity-80">
          <p className="mb-1">
            У тех кто проходил Марафон Сеплица ранее скидка 50%
          </p>
          <a 
            href="https://t.me/seplitza_support" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-yellow-300 hover:underline"
          >
            Обратитесь в поддержку
          </a>
        </div>
      )}
    </div>
  );
};

export default MarathonPricingCard;
