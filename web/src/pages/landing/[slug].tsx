import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { Landing } from '../../types/landing';
import FeaturesSection from '../../components/landing/FeaturesSection';
import ProblemsSection from '../../components/landing/ProblemsSection';
import AboutSection from '../../components/landing/AboutSection';
import StepsSection from '../../components/landing/StepsSection';
import ProcessSection from '../../components/landing/ProcessSection';
import StatsSection from '../../components/landing/StatsSection';
import ResultsGallerySection from '../../components/landing/ResultsGallerySection';
import TestimonialsGallerySection from '../../components/landing/TestimonialsGallerySection';
import MarathonRegistrationModal from '../../components/landing/MarathonRegistrationModal';
import MarathonDetailsModal from '../../components/landing/MarathonDetailsModal';
import MarathonPricingCard from '../../components/landing/MarathonPricingCard';

interface LandingPageProps {
  landing?: Landing | null;
  error?: string;
}

const LandingPage: React.FC<LandingPageProps> = ({ landing: landingProp, error: errorProp }) => {
  const router = useRouter();
  const { slug } = router.query;
  const [landing, setLanding] = useState<Landing | null>(landingProp || null);
  const [loading, setLoading] = useState(!landingProp);
  const [error, setError] = useState<string | null>(errorProp || null);
  const [registrationModal, setRegistrationModal] = useState<{
    isOpen: boolean;
    marathonId: string;
    marathonTitle: string;
    marathonPrice: number;
    isAdvanced: boolean;
  } | null>(null);
  
  const [spotsLeft, setSpotsLeft] = useState(9);
  const [detailsModal, setDetailsModal] = useState<{
    isOpen: boolean;
    title: string;
    marathonTitle: string;
    description: string;
    price: number;
    oldPrice?: number;
    tenure: number;
    features: string[];
    onPayment: () => void;
  } | null>(null);

  useEffect(() => {
    // Если данные уже получены через SSG, не делаем fetch
    if (!slug) return;

    const fetchLanding = async () => {
      try {
        setLoading(true);
        const response = await axios.get<{ success: boolean; landing: Landing }>(`${API_BASE_URL}/api/landings/public/${slug}`);
        
        if (response.data.success) {
          setLanding(response.data.landing);
        }
      } catch (err: any) {
        console.error('Error fetching landing:', err);
        setError(err.response?.data?.error || 'Страница не найдена');
      } finally {
        setLoading(false);
      }
    };

    fetchLanding();
  }, [slug, landingProp]);

  // Счетчик оставшихся мест (имитация)
  useEffect(() => {
    if (!slug) return;
    
    const key = `landing_spots_${slug}`;
    const savedSpots = localStorage.getItem(key);
    const savedTimestamp = localStorage.getItem(`${key}_timestamp`);
    
    if (savedSpots && savedTimestamp) {
      const elapsed = Date.now() - parseInt(savedTimestamp);
      const visits = Math.floor(elapsed / 10000); // Каждые 10 секунд - новый визит
      const currentSpots = Math.max(1, parseInt(savedSpots) - visits);
      setSpotsLeft(currentSpots);
    } else {
      // Первый визит - 9 мест
      localStorage.setItem(key, '9');
      localStorage.setItem(`${key}_timestamp`, Date.now().toString());
      setSpotsLeft(9);
    }
    
    // Через 10 секунд уменьшаем на 1
    const timer = setTimeout(() => {
      setSpotsLeft(prev => {
        const newValue = Math.max(1, prev - 1);
        localStorage.setItem(key, newValue.toString());
        localStorage.setItem(`${key}_timestamp`, Date.now().toString());
        return newValue;
      });
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [slug]);

  const trackConversion = async () => {
    if (!slug) return;
    try {
      await axios.post(`${API_BASE_URL}/api/landings/public/${slug}/conversion`);
    } catch (err) {
      console.error('Error tracking conversion:', err);
    }
  };

  const handleCtaClick = (link: string) => {
    trackConversion();
    router.push(link);
  };

  // Helper для извлечения ID из populated marathonId
  const extractMarathonId = (marathonIdField: any): string => {
    if (!marathonIdField) return '';
    if (typeof marathonIdField === 'string') return marathonIdField;
    if (marathonIdField._id) return String(marathonIdField._id);
    return '';
  };

  // Функция для форматирования subtitle с буллетами
  const formatSubtitle = (text: string) => {
    // Проверяем, есть ли в тексте дефисы в начале строк
    if (!text.includes('\n-') && !text.startsWith('-')) {
      return <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">{text}</p>;
    }

    // Разбиваем на строки и фильтруем пустые
    const lines = text.split('\n').filter(line => line.trim());
    
    return (
      <div className="text-xl md:text-2xl mb-8 opacity-90">
        <ul className="space-y-3 text-left max-w-3xl mx-auto">
          {lines.map((line, index) => {
            const cleanLine = line.trim().replace(/^-\s*/, '');
            return (
              <li key={index} className="flex items-start gap-3">
                <span className="text-2xl mt-1">•</span>
                <span className="leading-relaxed">{cleanLine}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const handleMarathonClick = async (marathonId: string, marathonTitle: string, marathonPrice: number, isAdvanced: boolean = false) => {
    trackConversion();
    const token = localStorage.getItem('auth_token');

    if (token) {
      // Пользователь авторизован - сразу создаем платеж
      try {
        const response = await axios.post<{
          success: boolean;
          paymentUrl?: string;
          error?: string;
        }>(
          `${API_BASE_URL}/api/payment/create`,
          {
            marathonId,
            marathonName: marathonTitle,
            type: 'marathon',
            planType: 'marathon'
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success && response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        } else {
          alert('Ошибка создания платежа');
        }
      } catch (err) {
        console.error('Payment error:', err);
        alert('Ошибка при создании платежа');
      }
    } else {
      // Пользователь не авторизован - показываем модалку регистрации
      setRegistrationModal({
        isOpen: true,
        marathonId,
        marathonTitle,
        marathonPrice,
        isAdvanced
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error || !landing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">{error || 'Страница не найдена'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{landing.title}</title>
        <meta name="description" content={landing.metaDescription} />
        <meta property="og:title" content={landing.title} />
        <meta property="og:description" content={landing.metaDescription} />
        {landing.ogImage && <meta property="og:image" content={landing.ogImage} />}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {landing.heroSection.title}
            </h1>
            {formatSubtitle(landing.heroSection.subtitle)}
            <button
              onClick={() => handleCtaClick(landing.heroSection.ctaButton.link)}
              className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              {landing.heroSection.ctaButton.text}
            </button>
          </div>
        </section>

        {/* Features Section - Что такое система */}
        {landing.featuresSection && <FeaturesSection section={landing.featuresSection} />}

        {/* Problems Section - Сеплица стирает возрастные признаки */}
        {landing.problemsSection && <ProblemsSection section={landing.problemsSection} />}

        {/* About Section - Обо мне */}
        {landing.aboutSection && <AboutSection section={landing.aboutSection} />}

        {/* Steps Section - 4 ступени системы */}
        {landing.stepsSection && <StepsSection section={landing.stepsSection} />}

        {/* Process Section - Как проходит программа */}
        {landing.processSection && <ProcessSection section={landing.processSection} />}

        {/* Stats Section - Результаты клиентов */}
        {landing.statsSection && <StatsSection section={landing.statsSection} />}

        {/* Results Gallery Section - Галерея результатов */}
        {landing.resultsGallerySection && <ResultsGallerySection section={landing.resultsGallerySection} />}

        {/* Testimonials Gallery Section - Галерея отзывов */}
        {landing.testimonialsGallerySection && <TestimonialsGallerySection section={landing.testimonialsGallerySection} />}

        {/* Marathons Section */}
        {landing.marathonsSection && (
          <section id="marathon" className="py-20 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                {landing.marathonsSection.sectionTitle}
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Basic Marathon */}
                {landing.marathonsSection.basic && (
                  <MarathonPricingCard
                    title={landing.marathonsSection.basic.title}
                    duration={landing.marathonsSection.basic.duration}
                    tenure={(landing.marathonsSection.basic as any).marathonId?.tenure || (landing.marathonsSection.basic as any).marathonId?.numberOfDays}
                    price={landing.marathonsSection.basic.price}
                    oldPrice={landing.marathonsSection.basic.oldPrice}
                    features={landing.marathonsSection.basic.features}
                    isAdvanced={false}
                    spotsLeft={spotsLeft}
                    onPaymentClick={() => handleMarathonClick(
                      extractMarathonId(landing.marathonsSection!.basic!.marathonId),
                      landing.marathonsSection!.basic!.title,
                      landing.marathonsSection!.basic!.price,
                      false
                    )}
                    onDetailsClick={() => setDetailsModal({
                      isOpen: true,
                      title: landing.marathonsSection!.basic!.title,
                      marathonTitle: (landing.marathonsSection!.basic as any).marathonId?.title || 'Rejuvena',
                      description: (landing.marathonsSection!.basic as any).marathonId?.courseDescription || '',
                      price: landing.marathonsSection!.basic!.price,
                      oldPrice: landing.marathonsSection!.basic!.oldPrice,
                      tenure: (landing.marathonsSection!.basic as any).marathonId?.tenure || 44,
                      features: landing.marathonsSection!.basic!.features,
                      onPayment: () => handleMarathonClick(
                        extractMarathonId(landing.marathonsSection!.basic!.marathonId),
                        landing.marathonsSection!.basic!.title,
                        landing.marathonsSection!.basic!.price,
                        false
                      )
                    })}
                    buttonText={landing.marathonsSection.basic.ctaButton.text}
                  />
                )}

                {/* Advanced Marathon */}
                {landing.marathonsSection.advanced && (
                  <MarathonPricingCard
                    title={landing.marathonsSection.advanced.title}
                    duration={landing.marathonsSection.advanced.duration}
                    tenure={(landing.marathonsSection.advanced as any).marathonId?.tenure}
                    price={landing.marathonsSection.advanced.price}
                    oldPrice={landing.marathonsSection.advanced.oldPrice}
                    features={landing.marathonsSection.advanced.features}
                    isAdvanced={true}
                    spotsLeft={spotsLeft}
                    onPaymentClick={() => handleMarathonClick(
                      extractMarathonId(landing.marathonsSection!.advanced!.marathonId),
                      landing.marathonsSection!.advanced!.title,
                      landing.marathonsSection!.advanced!.price,
                      true
                    )}
                    onDetailsClick={() => setDetailsModal({
                      isOpen: true,
                      title: landing.marathonsSection!.advanced!.title,
                      marathonTitle: (landing.marathonsSection!.advanced as any).marathonId?.title || 'Rejuvena PRO',
                      description: (landing.marathonsSection!.advanced as any).marathonId?.courseDescription || '',
                      price: landing.marathonsSection!.advanced!.price,
                      oldPrice: landing.marathonsSection!.advanced!.oldPrice,
                      tenure: (landing.marathonsSection!.advanced as any).marathonId?.tenure || 51,
                      features: landing.marathonsSection!.advanced!.features,
                      onPayment: () => handleMarathonClick(
                        extractMarathonId(landing.marathonsSection!.advanced!.marathonId),
                        landing.marathonsSection!.advanced!.title,
                        landing.marathonsSection!.advanced!.price,
                        true
                      )
                    })}
                    buttonText={landing.marathonsSection.advanced.ctaButton.text}
                  />
                )}
              </div>
            </div>
          </section>
        )}

        {/* Benefits Section */}
        {landing.benefitsSection && landing.benefitsSection.benefits && landing.benefitsSection.benefits.length > 0 && (
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                Почему выбирают нас
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                {landing.benefitsSection.benefits.map((benefit, idx) => (
                  <div key={idx} className="text-center p-6">
                    <div className="text-5xl mb-4">{benefit.icon}</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        {landing.testimonialsSection && landing.testimonialsSection.testimonials && landing.testimonialsSection.testimonials.length > 0 && (
          <section id="marathon" className="py-20 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                Отзывы наших клиентов
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {landing.testimonialsSection.testimonials.map((testimonial, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-4 mb-4">
                      {testimonial.photo ? (
                        <img
                          src={testimonial.photo}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl">
                          {testimonial.name[0]}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                        <div className="flex gap-1 text-yellow-400">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        {landing.ctaSection && (
          <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {landing.ctaSection.title}
              </h2>
              <p className="text-xl mb-8 opacity-90">
                {landing.ctaSection.subtitle}
              </p>
              <button
                onClick={() => handleCtaClick(landing.ctaSection!.ctaButton.link)}
                className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                {landing.ctaSection.ctaButton.text}
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Модалка регистрации для марафонов */}
      {registrationModal && (
        <MarathonRegistrationModal
          isOpen={registrationModal.isOpen}
          onClose={() => setRegistrationModal(null)}
          marathonId={registrationModal.marathonId}
          marathonTitle={registrationModal.marathonTitle}
          marathonPrice={registrationModal.marathonPrice}
          isAdvanced={registrationModal.isAdvanced}
        />
      )}
      
      {detailsModal && (
        <MarathonDetailsModal
          isOpen={detailsModal.isOpen}
          onClose={() => setDetailsModal(null)}
          title={detailsModal.title}
          marathonTitle={detailsModal.marathonTitle}
          description={detailsModal.description}
          price={detailsModal.price}
          oldPrice={detailsModal.oldPrice}
          tenure={detailsModal.tenure}
          features={detailsModal.features}
          onPayment={detailsModal.onPayment}
        />
      )}
    </>
  );
};

export default LandingPage;

// GitHub Pages требует предварительную генерацию всех путей  
export async function getStaticPaths() {
  try {
    const axios = require('axios');
    const API_URL = 'https://api-rejuvena.duckdns.org';
    
    const response = await axios.get(`${API_URL}/api/landings/public`, {
    });
    
    const paths = response.data.landings?.map((landing: any) => ({
      params: { slug: landing.slug }
    })) || [];
    
    console.log(`[Build] Generated ${paths.length} landing pages`);
    
    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('[Build] Error fetching landings:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  try {
    const axios = require('axios');
    const API_URL = 'https://api-rejuvena.duckdns.org';
    
    console.log(`[Build] Fetching landing: ${params.slug}`);
    
    const response = await axios.get(`${API_URL}/api/landings/public/${params.slug}`, {
      timeout: 10000,
    });
    
    if (!response.data.success || !response.data.landing) {
      return {
        props: {
          landing: null,
          error: 'Страница не найдена',
        },
      };
    }
    
    console.log(`[Build] Successfully fetched landing: ${params.slug}`);
    
    return {
      props: {
        landing: response.data.landing,
      },
    };
  } catch (error: any) {
    console.error(`[Build] Error fetching landing ${params.slug}:`, error.message);
    return {
      props: {
        landing: null,
        error: 'Ошибка загрузки страницы',
      },
    };
  }
}
