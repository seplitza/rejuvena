import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { getProducts, getCategories } from '@/api/shop';
import type { Product, Category } from '@/types/shop';
import { SparklesIcon, TruckIcon, GiftIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featuredData, newData, categoriesData] = await Promise.all([
          getProducts({ isFeatured: true, limit: 4 }),
          getProducts({ sortBy: 'createdAt', sortOrder: 'desc', limit: 4 }),
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

  return (
    <Layout title="Главная">
      {/* Hero Section */}
      <section className="relative bg-gradient-primary text-white section-padding overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] bg-repeat" />
        </div>
        
        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
              Эффективные средства для омоложения
            </h1>
            <p className="text-lg md:text-xl mb-8 text-pink-50 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              Профессиональные товары для ухода за кожей лица и тела. 
              Выгоднее, чем на маркетплейсах!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <Link href="/catalog" className="btn-primary bg-white text-primary-600 hover:bg-pink-50">
                Перейти в каталог
              </Link>
              <Link href="/fortune-wheel" className="btn-secondary border-white hover:bg-white hover:bg-opacity-10">
                🎰 Колесо Фортуны
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <TruckIcon className="w-8 h-8" />,
                title: 'Быстрая доставка',
                description: 'СДЭК по всей России',
              },
              {
                icon: <GiftIcon className="w-8 h-8" />,
                title: 'Бонусы и подарки',
                description: 'Колесо Фортуны и промокоды',
              },
              {
                icon: <ShieldCheckIcon className="w-8 h-8" />,
                title: 'Гарантия качества',
                description: 'Сертифицированная продукция',
              },
              {
                icon: <SparklesIcon className="w-8 h-8" />,
                title: 'Лучшие цены',
                description: 'Дешевле, чем на Wildberries',
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center card-hover">
                <div className="text-primary-500 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              ⭐ Хиты продаж
            </h2>
            <Link href="/catalog?featured=true" className="text-primary-600 hover:text-primary-700 font-medium">
              Смотреть все →
            </Link>
          </div>
          <ProductGrid products={featuredProducts} loading={loading} />
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Категории товаров
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category._id}
                href={`/catalog?category=${category.slug}`}
                className="bg-white rounded-xl p-6 text-center card-hover"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {category.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              🆕 Новинки
            </h2>
            <Link href="/catalog?sort=new" className="text-primary-600 hover:text-primary-700 font-medium">
              Смотреть все →
            </Link>
          </div>
          <ProductGrid products={newProducts} loading={loading} />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-secondary text-white section-padding">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            🎰 Испытайте удачу!
          </h2>
          <p className="text-lg mb-8 text-purple-100 max-w-2xl mx-auto">
            Вращайте колесо Фортуны и получайте скидки, бесплатные товары и другие призы!
          </p>
          <Link href="/fortune-wheel" className="btn-primary bg-white text-purple-600 hover:bg-purple-50">
            Крутить колесо →
          </Link>
        </div>
      </section>
    </Layout>
  );
}
