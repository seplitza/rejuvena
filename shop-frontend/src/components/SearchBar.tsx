import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, ClockIcon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface SearchResult {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images?: string[];
  category?: { name: string; slug: string };
}

interface SearchProps {
  isMobile?: boolean;
}

export default function SearchBar({ isMobile = false }: SearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await axios.get(`${API_URL}/api/shop/products`, {
          params: {
            search: query,
            limit: 5
          }
        });
        setResults(response.data.products || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    // Navigate to search results
    router.push(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  return (
    <div ref={searchRef} className={`relative ${isMobile ? 'w-full' : 'flex-1 max-w-2xl mx-8'}`}>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          placeholder="Поиск товаров..."
          className="w-full pl-12 pr-10 py-3 bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 focus:border-pink-500 rounded-xl transition-all outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </form>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (query.length >= 2 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-[500px] overflow-y-auto"
          >
            {/* Loading State */}
            {isLoading && (
              <div className="p-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent"></div>
                <p className="mt-2 text-gray-600">Поиск...</p>
              </div>
            )}

            {/* Search Results */}
            {!isLoading && query.length >= 2 && (
              <div>
                {results.length > 0 ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-700">
                        Найдено товаров: {results.length}
                      </p>
                    </div>
                    <div className="py-2">
                      {results.map((product) => (
                        <Link
                          key={product._id}
                          href={`/products/${product.slug}`}
                          onClick={() => {
                            handleSearch(query);
                          }}
                          className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                            {product.images?.[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold">
                                {product.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            {product.category && (
                              <p className="text-xs text-gray-500">
                                {product.category.name}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <span className="text-lg font-bold text-pink-600">
                              {product.price}₽
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                      <button
                        onClick={() => handleSearch(query)}
                        className="w-full text-center text-sm font-semibold text-pink-600 hover:text-pink-700"
                      >
                        Показать все результаты →
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-600">Ничего не найдено</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Попробуйте изменить запрос
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="py-2">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <p className="text-sm font-semibold text-gray-700">
                      Недавние поиски
                    </p>
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Очистить
                  </button>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(search);
                      handleSearch(search);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <ClockIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700">{search}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Popular Searches (Optional) */}
            {!query && recentSearches.length === 0 && (
              <div className="py-2">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-pink-500" />
                    <p className="text-sm font-semibold text-gray-700">
                      Популярные запросы
                    </p>
                  </div>
                </div>
                {['Крем для лица', 'Сыворотка', 'Витамины', 'Маска'].map((popularSearch, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(popularSearch);
                      handleSearch(popularSearch);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <SparklesIcon className="w-5 h-5 text-pink-500 flex-shrink-0" />
                    <span className="text-gray-700">{popularSearch}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
