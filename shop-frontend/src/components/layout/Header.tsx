import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store';
import { selectFavoritesCount } from '@/store/favoritesSlice';
import { ShoppingCartIcon, UserIcon, HeartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const Header = () => {
  const router = useRouter();
  const { itemsCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const favoritesCount = useAppSelector(selectFavoritesCount);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' },
    { name: 'Колесо Фортуны', href: '/fortune-wheel' },
    { name: 'О нас', href: '/about' },
    { name: 'Контакты', href: '/contacts' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl md:text-2xl">S</span>
            </div>
            <span className="text-xl md:text-2xl font-bold gradient-text hidden sm:inline">
              Seplitza
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                  router.pathname === item.href
                    ? 'text-primary-600'
                    : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Favorites */}
            <Link
              href="/favorites"
              className="relative text-gray-700 hover:text-primary-600 transition-colors"
              title="Избранное"
            >
              <HeartIcon className="w-6 h-6" />
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-gray-700 hover:text-primary-600 transition-colors"
              title="Корзина"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </Link>

            {/* User */}
            <Link
              href={isAuthenticated ? '/profile' : '/login'}
              className="text-gray-700 hover:text-primary-600 transition-colors"
              title={isAuthenticated ? 'Профиль' : 'Войти'}
            >
              <UserIcon className="w-6 h-6" />
            </Link>

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-gray-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-base font-medium transition-colors hover:text-primary-600 ${
                    router.pathname === item.href
                      ? 'text-primary-600'
                      : 'text-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
