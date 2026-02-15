/**
 * Main Layout Component  
 * Wraps all pages with navigation menu and burger button
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavigationMenu from '@/components/common/NavigationMenu';
import { useAppSelector } from '@/store/hooks';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Pages where menu should NOT be shown (landing, auth, etc.)
  const excludedPaths = [
    '/',
    '/auth/login',
    '/auth/register',
    '/landing',
  ];

  // Check if current route starts with excluded path
  const isExcludedPath = excludedPaths.some(path => router.pathname.startsWith(path)) && router.pathname !== '/dashboard';

  // Don't show menu on excluded pages
  const shouldShowMenu = !isExcludedPath && isAuthenticated;

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.pathname]);

  return (
    <>
      {/* Burger Button - Fixed position */}
      {shouldShowMenu && (
        <button
          onClick={() => setIsMenuOpen(true)}
          className="fixed top-4 right-4 z-30 p-3 rounded-lg shadow-lg bg-white hover:shadow-xl transition-all"
          style={{
            ':hover': {
              backgroundColor: 'var(--color-primary-light, rgba(147, 51, 234, 0.1))'
            }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-light, rgba(147, 51, 234, 0.1))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
          }}
          aria-label="Открыть меню"
        >
          <svg 
            className="w-6 h-6" 
            style={{ color: 'var(--color-primary)' }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Navigation Menu */}
      {shouldShowMenu && (
        <NavigationMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />
      )}

      {/* Page Content */}
      {children}
    </>
  );
}
