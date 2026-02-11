import React, { useState } from 'react';
import AnimatedStartDate from '../components/landing/AnimatedStartDate';

const ColorVariantsDemo = () => {
  const [selectedVariant, setSelectedVariant] = useState(1);
  
  // Дата для теста (16 февраля 2026)
  const testDate = new Date('2026-02-16T08:00:00+03:00');
  
  const variants = [
    { id: 1, name: 'RAL 6009 (Зеленая ель)', primary: '#31372B', secondary: '#8B4513', gradient: 'linear-gradient(135deg, #31372B 0%, #5a6b4a 50%, #8B4513 100%)', desc: 'Темно-зеленый → Коричневый' },
    { id: 2, name: 'RAL 6005 (Зеленый мох)', primary: '#2F4538', secondary: '#CD853F', gradient: 'linear-gradient(135deg, #2F4538 0%, #5d6e5a 50%, #CD853F 100%)', desc: 'Оливковый → Бежевый' },
    { id: 3, name: 'RAL 6012 (Черно-зеленый)', primary: '#343E40', secondary: '#B8860B', gradient: 'linear-gradient(135deg, #343E40 0%, #5a6d5f 50%, #B8860B 100%)', desc: 'Темно-серо-зеленый → Золотистый' },
    { id: 4, name: 'RAL 6000 (Патина)', primary: '#316650', secondary: '#C0504D', gradient: null, desc: 'Сине-зеленый → Терракотовый' },
    { id: 5, name: 'RAL 6002 (Листовой зеленый)', primary: '#2D572C', secondary: '#D2691E', gradient: null, desc: 'Листовой зеленый → Шоколадный' },
    { id: 6, name: 'RAL 6020 (Хромово-зеленый)', primary: '#2E3A23', secondary: '#CD5C5C', gradient: null, desc: 'Хромово-зеленый → Индийский красный' }
  ];
  
  const current = variants.find(v => v.id === selectedVariant) || variants[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Панель выбора вариантов */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🎨 Тестирование фирменных цветов RAL
          </h1>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant.id)}
                className={`px-6 py-4 rounded-xl font-bold text-white transition-all ${
                  selectedVariant === variant.id ? 'ring-4 ring-offset-2 scale-105 shadow-2xl' : 'hover:scale-105 shadow-lg'
                }`}
                style={{ 
                  background: variant.gradient || variant.primary
                }}
              >
                <div className="text-sm opacity-80">Вариант {variant.id}</div>
                <div className="mt-1">{variant.name}</div>
                <div className="text-xs opacity-70 mt-1">{variant.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Отображение выбранного варианта */}
      <section 
        className="relative text-white py-20 px-4" 
        style={{ background: current.gradient || current.primary }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4 inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
            ✨ {current.name}: {current.desc}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            "Омолодись" - Марафон естественного омоложения по системе Сеплица
          </h1>
          <ul className="text-lg md:text-xl mb-8 space-y-2 text-left max-w-2xl mx-auto">
            <li>✓ Этап М7 стартует 16-го февраля</li>
            <li>✓ Без инъекций и операций</li>
            <li>✓ Первый результат уже через 2 недели!</li>
            <li>✓ Стоимость от 4000 рублей</li>
          </ul>
          <button 
            className="px-8 py-4 bg-white rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
            style={{ color: current.primary }}
          >
            Записаться на марафон
          </button>
        </div>
      </section>

      <div style={{ background: current.gradient || current.primary }}>
        <AnimatedStartDate 
          startDate={testDate}
          title="СТАРТ МАРАФОНА"
        />
      </div>

      {/* Детали цветов */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Все цветовые схемы RAL
          </h2>
          
          <div className="space-y-8">
            {variants.map((variant) => (
              <div key={variant.id}>
                <h3 className="text-xl font-bold mb-4">
                  {variant.name}
                  {variant.gradient ? ' (с градиентом)' : ' (чистый цвет)'}
                </h3>
                <div className="flex gap-4 mb-2">
                  <div 
                    className="flex-1 h-24 rounded-xl flex items-center justify-center text-white font-bold" 
                    style={{ backgroundColor: variant.primary }}
                  >
                    {variant.primary}
                  </div>
                  <div 
                    className="flex-1 h-24 rounded-xl flex items-center justify-center text-white font-bold" 
                    style={{ backgroundColor: variant.secondary }}
                  >
                    {variant.secondary}
                  </div>
                </div>
                {variant.gradient && (
                  <div className="h-16 rounded-xl mb-2" style={{ background: variant.gradient }}></div>
                )}
                <p className="text-gray-600">{variant.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorVariantsDemo;
