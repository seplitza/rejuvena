import React, { useState } from 'react';
import AnimatedStartDate from '../components/landing/AnimatedStartDate';

const ColorVariantsDemo = () => {
  const [selectedVariant, setSelectedVariant] = useState(1);
  
  // Дата для теста (16 февраля 2026)
  const testDate = new Date('2026-02-16T08:00:00+03:00');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Панель выбора вариантов */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🎨 Тестирование фирменных цветов RAL
          </h1>
          
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedVariant(1)}
              className={`px-6 py-4 rounded-xl font-bold text-white transition-all ${
                selectedVariant === 1 ? 'ring-4 ring-offset-2 ring-[#31372B] scale-105' : ''
              }`}
              style={{ background: 'linear-gradient(135deg, #31372B 0%, #5a6b4a 50%, #8B4513 100%)' }}
            >
              <div>Вариант 1</div>
              <div className="text-sm opacity-80">Зеленая ель</div>
            </button>
            
            <button
              onClick={() => setSelectedVariant(2)}
              className={`px-6 py-4 rounded-xl font-bold text-white transition-all ${
                selectedVariant === 2 ? 'ring-4 ring-offset-2 ring-[#2F4538] scale-105' : ''
              }`}
              style={{ background: 'linear-gradient(135deg, #2F4538 0%, #5d6e5a 50%, #CD853F 100%)' }}
            >
              <div>Вариант 2</div>
              <div className="text-sm opacity-80">Зеленый мох</div>
            </button>
            
            <button
              onClick={() => setSelectedVariant(3)}
              className={`px-6 py-4 rounded-xl font-bold text-white transition-all ${
                selectedVariant === 3 ? 'ring-4 ring-offset-2 ring-[#343E40] scale-105' : ''
              }`}
              style={{ background: 'linear-gradient(135deg, #343E40 0%, #5a6d5f 50%, #B8860B 100%)' }}
            >
              <div>Вариант 3</div>
              <div className="text-sm opacity-80">Черно-зеленый</div>
            </button>
          </div>
        </div>
      </div>

      {/* Вариант 1: Зеленая ель */}
      {selectedVariant === 1 && (
        <>
          <section className="relative text-white py-20 px-4" style={{ background: 'linear-gradient(135deg, #31372B 0%, #5a6b4a 50%, #8B4513 100%)' }}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-4 inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                ✨ RAL 6009: Зеленая ель → Коричневый
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
              <button className="px-8 py-4 bg-white text-[#31372B] rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all">
                Записаться на марафон
              </button>
            </div>
          </section>

          <div style={{ background: 'linear-gradient(135deg, #31372B 0%, #5a6b4a 50%, #8B4513 100%)' }}>
            <AnimatedStartDate 
              startDate={testDate}
              title="СТАРТ МАРАФОНА"
            />
          </div>
        </>
      )}

      {/* Вариант 2: Зеленый мох */}
      {selectedVariant === 2 && (
        <>
          <section className="relative text-white py-20 px-4" style={{ background: 'linear-gradient(135deg, #2F4538 0%, #5d6e5a 50%, #CD853F 100%)' }}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-4 inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                ✨ RAL 6005: Зеленый мох → Бежево-коричневый
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
              <button className="px-8 py-4 bg-white text-[#2F4538] rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all">
                Записаться на марафон
              </button>
            </div>
          </section>

          <div style={{ background: 'linear-gradient(135deg, #2F4538 0%, #5d6e5a 50%, #CD853F 100%)' }}>
            <AnimatedStartDate 
              startDate={testDate}
              title="СТАРТ МАРАФОНА"
            />
          </div>
        </>
      )}

      {/* Вариант 3: Черно-зеленый */}
      {selectedVariant === 3 && (
        <>
          <section className="relative text-white py-20 px-4" style={{ background: 'linear-gradient(135deg, #343E40 0%, #5a6d5f 50%, #B8860B 100%)' }}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-4 inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                ✨ RAL 6012: Черно-зеленый → Золотистый
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
              <button className="px-8 py-4 bg-white text-[#343E40] rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all">
                Записаться на марафон
              </button>
            </div>
          </section>

          <div style={{ background: 'linear-gradient(135deg, #343E40 0%, #5a6d5f 50%, #B8860B 100%)' }}>
            <AnimatedStartDate 
              startDate={testDate}
              title="СТАРТ МАРАФОНА"
            />
          </div>
        </>
      )}

      {/* Детали цветов */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Цветовые пары RAL с комплементарными оттенками
          </h2>
          
          <div className="space-y-8">
            {/* Вариант 1 */}
            <div>
              <h3 className="text-xl font-bold mb-4">Вариант 1: RAL 6009 (Зеленая ель)</h3>
              <div className="flex gap-4 mb-2">
                <div className="flex-1 h-24 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#31372B' }}>
                  #31372B (основной)
                </div>
                <div className="flex-1 h-24 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#8B4513' }}>
                  #8B4513 (акцент)
                </div>
              </div>
              <div className="h-16 rounded-xl" style={{ background: 'linear-gradient(90deg, #31372B 0%, #5a6b4a 50%, #8B4513 100%)' }}></div>
              <p className="text-gray-600 mt-2">Темно-зеленый → Коричневый (земельный, природный)</p>
            </div>

            {/* Вариант 2 */}
            <div>
              <h3 className="text-xl font-bold mb-4">Вариант 2: RAL 6005 (Зеленый мох)</h3>
              <div className="flex gap-4 mb-2">
                <div className="flex-1 h-24 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#2F4538' }}>
                  #2F4538 (основной)
                </div>
                <div className="flex-1 h-24 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#CD853F' }}>
                  #CD853F (акцент)
                </div>
              </div>
              <div className="h-16 rounded-xl" style={{ background: 'linear-gradient(90deg, #2F4538 0%, #5d6e5a 50%, #CD853F 100%)' }}></div>
              <p className="text-gray-600 mt-2">Оливковый → Бежево-коричневый (органический, теплый)</p>
            </div>

            {/* Вариант 3 */}
            <div>
              <h3 className="text-xl font-bold mb-4">Вариант 3: RAL 6012 (Черно-зеленый)</h3>
              <div className="flex gap-4 mb-2">
                <div className="flex-1 h-24 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#343E40' }}>
                  #343E40 (основной)
                </div>
                <div className="flex-1 h-24 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#B8860B' }}>
                  #B8860B (акцент)
                </div>
              </div>
              <div className="h-16 rounded-xl" style={{ background: 'linear-gradient(90deg, #343E40 0%, #5a6d5f 50%, #B8860B 100%)' }}></div>
              <p className="text-gray-600 mt-2">Темно-серо-зеленый → Золотистый (элегантный, премиальный)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorVariantsDemo;
