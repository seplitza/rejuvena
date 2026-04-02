import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import SEO, { createOrganizationSchema, createWebPageSchema } from '@/components/SEO';
import { getProducts, getCategories } from '@/api/shop';
import type { Product, Category } from '@/types/shop';
import { 
  SparklesIcon, 
  TruckIcon, 
  GiftIcon, 
  ShieldCheckIcon,
  StarIcon,
  UserGroupIcon,
  HeartIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featuredData, newData, categoriesData] = await Promise.all([
          getProducts({ isFeatured: true, limit: 8 }),
          getProducts({ sortBy: 'createdAt', sortOrder: 'desc', limit: 8 }),
          getCategories(),
        ]);

        setFeaturedProducts(featuredData.products);
        setNewProducts(newData.products);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const stats = [
    { label: 'Довольных клиентов', value: '5000+', icon: UserGroupIcon },
    { label: 'Товаров в каталоге', value: '500+', icon: SparklesIcon },
    { label: 'Средний рейтинг', value: '4.9', icon: StarIcon },
    { label: 'Доставка по РФ', value: '100%', icon: TruckIcon }
  ];

  const testimonials = [
    {
      name: 'Анна К.',
      text: 'Отличный магазин! Цены действительно ниже, чем на Wildberries. Доставка быстрая, товар качественный.',
      rating: 5
    },
    {
      name: 'Мария С.',
      text: 'Колесо фортуны - супер! Выиграла скидку 30% на первый заказ. Обязательно закажу ещё!',
      rating: 5
    },
    {
      name: 'Елена П.',
      text: 'Покупаю здесь косметику постоянно. Качество на высоте, а цены приятные. Рекомендую!',
      rating: 5
    }
  ];

  return (
    <>
      <SEO
        title="Интернет-магазин товаров для омоложения и красоты"
        description="Seplitza - профессиональные средства для ухода за кожей лица и тела. Цены ниже, чем на Wildberries и Ozon. Быстрая доставка СДЭК по всей России."
        canonical="/"
        structuredData={[createOrganizationSchema(), createWebPageSchema({
          name: 'Главная страница',
          description: 'Интернет-магазин товаров для омоложения',
          url: '/'
        })]}
      />
      
      <Layout title="Главная">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] bg-repeat" />
          </div>
          
          {/* Animated blobs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-48 -left-48 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
            />
            <motion.div
              animate={{
                x: [0, -100, 0],
                y: [0, 100, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -bottom-48 -right-48 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
            />
          </div>
          
          <div className="container mx-auto px-4 py-20 md:py-32 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  Эффективные средства для
                  <span className="block bg-white text-transparent bg-clip-text">омоложения</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-pink-50 leading-relaxed">
                  Профессиональная косметика и БАДы для здоровья и красоты. 
                  <strong className="block mt-2">На 20-40% дешевле маркетплейсов!</strong>
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/catalog" 
                    className="px-8 py-4 bg-white text-pink-600 rounded-xl font-bold text-lg hover:bg-pink-50 transition-all shadow-2xl hover:shadow-pink-300/50 hover:scale-105 transform"
                  >
                    🛍️ Перейти в каталог
                  </Link>
                  <Link 
                    href="/fortune-wheel" 
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
                  >
                    🎰 Колесо Фортуны
                  </Link>
                </div>
                
                {/* Trust badges */}
                <div className="flex flex-wrap gap-6 mt-8 text-sm">
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5" />
                    <span>Сертифицированная продукция</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TruckIcon className="w-5 h-5" />
                    <span>Доставка 1-3 дня</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GiftIcon className="w-5 h-5" />
                    <span>Подарки каждому</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="hidden lg:block"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 flex items-center justify-center">
                    <img
                      src="/seplitza-logo.png"
                      alt="Seplitza - Товары для красоты и здоровья"
                      className="w-full h-auto max-w-md object-contain"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 rounded-full mb-4">
                    <stat.icon className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Почему выбирают Seplitza?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Мы предлагаем лучшие условия для заботы о вашей красоте и здоровье
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <TruckIcon className="w-10 h-10" />,
                  title: 'Быстрая доставка',
                  description: 'СДЭК по всей России за 1-3 дня. Трек-номер сразу после отправки',
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: <GiftIcon className="w-10 h-10" />,
                  title: 'Бонусы и подарки',
                  description: 'Крутите колесо фортуны, используйте промокоды и получайте скидки',
                  color: 'from-pink-500 to-rose-500'
                },
                {
                  icon: <ShieldCheckIcon className="w-10 h-10" />,
                  title: 'Гарантия качества',
                  description: 'Только сертифицированная продукция от проверенных производителей',
                  color: 'from-green-500 to-emerald-500'
                },
                {
                  icon: <ChartBarIcon className="w-10 h-10" />,
                  title: 'Лучшие цены',
                  description: 'На 20-40% дешевле, чем на Wildberries, Ozon и Яндекс.Маркет',
                  color: 'from-purple-500 to-indigo-500'
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all group"
                >
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-center mb-12"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  ⭐ Хиты продаж
                </h2>
                <p className="text-gray-600">Самые популярные товары среди наших клиентов</p>
              </div>
              <Link 
                href="/catalog?featured=true" 
                className="mt-4 md:mt-0 text-pink-600 hover:text-pink-700 font-semibold inline-flex items-center gap-2 group"
              >
                Смотреть все 
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </motion.div>
            <ProductGrid products={featuredProducts} loading={loading} />
          </div>
        </section>

        {/* Categories */}
        <section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Категории товаров
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Найдите именно то, что нужно вашей коже
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/catalog?category=${category.slug}`}
                    className="block bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all group"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold group-hover:scale-110 transition-transform shadow-lg">
                      {category.name.charAt(0)}
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                      {category.name}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                💬 Отзывы наших клиентов
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Более 5000 довольных покупателей уже оценили наше качество и сервис
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">Покупатель</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* New Products */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-center mb-12"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  🆕 Новинки
                </h2>
                <p className="text-gray-600">Только что поступившие товары</p>
              </div>
              <Link 
                href="/catalog?sort=new" 
                className="mt-4 md:mt-0 text-pink-600 hover:text-pink-700 font-semibold inline-flex items-center gap-2 group"
              >
                Смотреть все 
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </motion.div>
            <ProductGrid products={newProducts} loading={loading} />
          </div>
        </section>

        {/* CTA Banner */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] bg-repeat" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="container mx-auto px-4 text-center relative"
          >
            <div className="max-w-3xl mx-auto text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                🎰 Испытайте удачу!
              </h2>
              <p className="text-xl mb-8 text-pink-50 leading-relaxed">
                Вращайте колесо Фортуны и получайте скидки до 50%, бесплатные товары и другие призы!
                Каждый день новый шанс выиграть!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/fortune-wheel" 
                  className="px-8 py-4 bg-white text-pink-600 rounded-xl font-bold text-lg hover:bg-pink-50 transition-all shadow-2xl hover:shadow-white/50 hover:scale-105 transform"
                >
                  🎁 Крутить колесо бесплатно →
                </Link>
              </div>
              
              <div className="mt-8 flex flex-wrap justify-center gap-8 text-pink-50">
                <div className="flex items-center gap-2">
                  <GiftIcon className="w-6 h-6" />
                  <span>Призы каждому</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartIcon className="w-6 h-6" />
                  <span>Без обязательств</span>
                </div>
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-6 h-6" />
                  <span>Ежедневное участие</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </Layout>
    </>
  );
}
