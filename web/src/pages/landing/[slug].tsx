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

  useEffect(() => {
    // Если данные уже получены через SSG, не делаем fetch
    if (landingProp || !slug) return;

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
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              {landing.heroSection.subtitle}
            </p>
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

        {/* Marathons Section */}
        {landing.marathonsSection && (
          <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                {landing.marathonsSection.sectionTitle}
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Basic Marathon */}
                {landing.marathonsSection.basic && (
                  <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200 hover:border-blue-400 transition">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-blue-600 mb-2">
                        {landing.marathonsSection.basic.title}
                      </h3>
                      <p className="text-gray-600">{landing.marathonsSection.basic.duration}</p>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-gray-800">
                          {landing.marathonsSection.basic.price}₽
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {landing.marathonsSection.basic.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-green-500 text-xl">✓</span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleCtaClick(landing.marathonsSection!.basic!.ctaButton.link)}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      {landing.marathonsSection.basic.ctaButton.text}
                    </button>
                  </div>
                )}

                {/* Advanced Marathon */}
                {landing.marathonsSection.advanced && (
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white transform md:scale-105 relative">
                    <div className="absolute -top-4 right-4 bg-yellow-400 text-purple-900 px-4 py-1 rounded-full text-sm font-bold">
                      Популярный
                    </div>
                    
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2">
                        {landing.marathonsSection.advanced.title}
                      </h3>
                      <p className="opacity-90">{landing.marathonsSection.advanced.duration}</p>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">
                          {landing.marathonsSection.advanced.price}₽
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {landing.marathonsSection.advanced.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-yellow-300 text-xl">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleCtaClick(landing.marathonsSection!.advanced!.ctaButton.link)}
                      className="w-full py-3 bg-white text-purple-600 rounded-lg font-semibold hover:shadow-lg transition"
                    >
                      {landing.marathonsSection.advanced.ctaButton.text}
                    </button>
                  </div>
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
          <section className="py-20 px-4 bg-gray-50">
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
