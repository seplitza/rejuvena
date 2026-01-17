import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [isRussian, setIsRussian] = useState(true);

  const content = {
    ru: {
      title: 'FaceLift Naturally - Естественное Омоложение Лица',
      heading: 'FaceLift Naturally',
      subtitle: 'Сохраните привлекательность и обратите вспять возрастные изменения лица и осанки с помощью нашего проверенного метода естественного омоложения.',
      signIn: 'Войти',
      getStarted: 'Начать',
      tryGuest: 'Попробовать как гость',
      features: {
        exercises: {
          title: 'Естественные Упражнения',
          desc: 'Упражнения для лица и осанки, проверенные более 5 лет нашими специалистами.'
        },
        results: {
          title: 'Целевые Результаты',
          desc: 'Эффективное устранение морщин, обвисания, двойного подбородка и других возрастных проблем.'
        },
        time: {
          title: '20 Минут в День',
          desc: 'Меньше времени, чем любая операция или косметическая процедура, не выходя из дома.'
        }
      },
      why: 'Почему Выбрать Естественное Омоложение?',
      benefits: {
        noSurgery: {
          title: 'Без Операций',
          desc: 'Достигайте результатов без шрамов, процедур и восстановительного периода.'
        },
        proven: {
          title: 'Проверенный Метод',
          desc: 'Более 30 000 практикующих улучшили свою внешность.'
        },
        better: {
          title: 'Лучше Чем Фейс-Йога',
          desc: 'Глубокая работа с анатомией мышц и коррекция осанки.'
        },
        natural: {
          title: 'Естественная Альтернатива',
          desc: 'Избегайте ботокса и филлеров с нашим подходом, основанным на расслаблении.'
        }
      }
    },
    en: {
      title: 'FaceLift Naturally - Natural Face Rejuvenation',
      heading: 'FaceLift Naturally',
      subtitle: 'Preserve attractiveness and reverse age-related changes in the face and posture with our proven natural rejuvenation method.',
      signIn: 'Sign In',
      getStarted: 'Get Started',
      tryGuest: 'Try as Guest',
      features: {
        exercises: {
          title: 'Natural Exercises',
          desc: 'Face and posture exercises proven to work over 5 years by our specialists.'
        },
        results: {
          title: 'Targeted Results',
          desc: 'Address wrinkles, sagging, double chin, and other age-related concerns effectively.'
        },
        time: {
          title: '20 Minutes a Day',
          desc: 'Less time than any surgery or cosmetic treatment, from the comfort of your home.'
        }
      },
      why: 'Why Choose Natural Rejuvenation?',
      benefits: {
        noSurgery: {
          title: 'No Surgery Required',
          desc: 'Achieve results without scars, procedures, or downtime.'
        },
        proven: {
          title: 'Proven Method',
          desc: 'Over 30,000 practitioners have enhanced their appearance.'
        },
        better: {
          title: 'Better Than Face Yoga',
          desc: 'Deep muscle anatomy work and posture adjustment.'
        },
        natural: {
          title: 'Natural Alternative',
          desc: 'Avoid Botox and fillers with our relaxation-based approach.'
        }
      }
    }
  };

  const t = isRussian ? content.ru : content.en;

  return (
    <>
      <Head>
        <title>{t.title}</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        {/* Language Selector in top right */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsRussian(!isRussian)}
            className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition font-medium"
          >
            {isRussian ? '🇷🇺 Русский' : '🇺🇸 English'}
          </button>
        </div>
        
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {t.heading}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/auth/login"
                className="px-8 py-4 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition"
              >
                {t.signIn}
              </Link>
              <Link 
                href="/auth/signup"
                className="px-8 py-4 bg-white text-pink-600 border-2 border-pink-600 rounded-lg font-semibold hover:bg-pink-50 transition"
              >
                {t.getStarted}
              </Link>
              <button 
                onClick={() => router.push('/guest')}
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                {t.tryGuest}
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-bold mb-3">{t.features.exercises.title}</h3>
              <p className="text-gray-600">
                {t.features.exercises.desc}
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">{t.features.results.title}</h3>
              <p className="text-gray-600">
                {t.features.results.desc}
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-xl font-bold mb-3">{t.features.time.title}</h3>
              <p className="text-gray-600">
                {t.features.time.desc}
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-16 bg-white rounded-2xl p-12 shadow-sm">
            <h2 className="text-3xl font-bold text-center mb-8">{t.why}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <h4 className="font-semibold mb-1">{t.benefits.noSurgery.title}</h4>
                  <p className="text-gray-600">{t.benefits.noSurgery.desc}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <h4 className="font-semibold mb-1">{t.benefits.proven.title}</h4>
                  <p className="text-gray-600">{t.benefits.proven.desc}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <h4 className="font-semibold mb-1">{t.benefits.better.title}</h4>
                  <p className="text-gray-600">{t.benefits.better.desc}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <h4 className="font-semibold mb-1">{t.benefits.natural.title}</h4>
                  <p className="text-gray-600">{t.benefits.natural.desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
