import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { getProducts, getCategories } from '@/api/shop';
import type { Product, Category } from '@/types/shop';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function CatalogPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    category: router.query.category as string || '',
    search: router.query.search as string || '',
    minPrice: router.query.minPrice as string || '',
    maxPrice: router.query.maxPrice as string || '',
    sortBy: router.query.sort as string || 'popularity',
    sortOrder: (router.query.order as 'asc' | 'desc') || 'asc',
    isFeatured: router.query.featured === 'true',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [router.query]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: parseInt(router.query.page as string) || 1,
        limit: 50,
      };

      if (router.query.category) params.category = router.query.category;
      if (router.query.search) params.search = router.query.search;
      if (router.query.minPrice) params.minPrice = parseFloat(router.query.minPrice as string);
      if (router.query.maxPrice) params.maxPrice = parseFloat(router.query.maxPrice as string);
      if (router.query.sort) params.sortBy = router.query.sort;
      if (router.query.order) params.sortOrder = router.query.order;
      if (router.query.featured === 'true') params.isFeatured = true;

      const data = await getProducts(params);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL query params
    const query: any = {};
    if (newFilters.category) query.category = newFilters.category;
    if (newFilters.search) query.search = newFilters.search;
    if (newFilters.minPrice) query.minPrice = newFilters.minPrice;
    if (newFilters.maxPrice) query.maxPrice = newFilters.maxPrice;
    if (newFilters.sortBy !== 'popularity') query.sort = newFilters.sortBy;
    if (newFilters.sortOrder !== 'asc') query.order = newFilters.sortOrder;
    if (newFilters.isFeatured) query.featured = 'true';

    router.push({ pathname: '/catalog', query }, undefined, { shallow: true });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'popularity',
      sortOrder: 'asc',
      isFeatured: false,
    });
    router.push('/catalog', undefined, { shallow: true });
  };

  const hasActiveFilters = filters.category || filters.search || filters.minPrice || filters.maxPrice || filters.isFeatured;

  return (
    <Layout title="Каталог товаров">
      <div className="bg-gray-50 min-h-screen">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Каталог товаров
            </h1>
            <p className="text-gray-600">
              {pagination.total > 0 ? `Найдено ${pagination.total} товаров` : 'Загрузка...'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="bg-white rounded-xl p-6 sticky top-24">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Фильтры</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Поиск
                  </label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Название товара..."
                    className="input-field text-sm"
                  />
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категория
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input-field text-sm"
                  >
                    <option value="">Все категории</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Цена, ₽
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      placeholder="От"
                      className="input-field text-sm"
                    />
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      placeholder="До"
                      className="input-field text-sm"
                    />
                  </div>
                </div>

                {/* Featured */}
                <div className="mb-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.isFeatured}
                      onChange={(e) => handleFilterChange('isFeatured', e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Только хиты продаж</span>
                  </label>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="btn-outline w-full text-sm">
                    Сбросить фильтры
                  </button>
                )}
              </div>
            </aside>

            {/* Products */}
            <main className="lg:col-span-3">
              {/* Toolbar */}
              <div className="bg-white rounded-xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 text-gray-700 hover:text-primary-600"
                >
                  <FunnelIcon className="w-5 h-5" />
                  Фильтры
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label className="text-sm text-gray-700 whitespace-nowrap">Сортировка:</label>
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-');
                      handleFilterChange('sortBy', sortBy);
                      handleFilterChange('sortOrder', sortOrder);
                    }}
                    className="input-field text-sm flex-1 sm:flex-initial"
                  >
                    <option value="createdAt-desc">Новинки</option>
                    <option value="price-asc">Цена: по возрастанию</option>
                    <option value="price-desc">Цена: по убыванию</option>
                    <option value="name-asc">Название: А-Я</option>
                    <option value="name-desc">Название: Я-А</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              <ProductGrid products={products} loading={loading} />

              {/* Pagination */}
              {!loading && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex gap-2">
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => router.push({ query: { ...router.query, page: pageNum } })}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            pagination.page === pageNum
                              ? 'bg-primary-500 text-white'
                              : 'bg-white text-gray-700 hover:bg-primary-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}
