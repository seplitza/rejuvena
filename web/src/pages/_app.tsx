import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { wrapper } from '@/store/store';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch } from '@/store/hooks';
import { setAuthToken, setUser, logout } from '@/store/modules/auth/slice';
import { AuthTokenManager, request, endpoints } from '@/api';
import { ThemeProvider } from '@/contexts/ThemeContext';

function App({ Component, pageProps }: AppProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    // Handle GitHub Pages 404 redirect
    // 404.html saves path to sessionStorage and redirects to index
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');
      const basePath = '/rejuvena';
      let targetPath = redirectPath;
      
      // Remove basePath if present
      if (targetPath.startsWith(basePath)) {
        targetPath = targetPath.slice(basePath.length);
      }
      
      // Ensure path starts with /
      if (!targetPath.startsWith('/')) {
        targetPath = '/' + targetPath;
      }
      
      console.log('🔄 Redirecting from 404 to:', targetPath);
      router.replace(targetPath);
      return;
    }
    
    // Also handle hash routing (old method)
    const hash = window.location.hash;
    if (hash && hash.startsWith('#/')) {
      const path = hash.slice(1); // Remove # to get /path
      console.log('🔄 Redirecting from hash:', hash, 'to path:', path);
      window.history.replaceState(null, '', path);
      router.replace(path);
    }
  }, [router]);

  useEffect(() => {
    // Восстанавливаем токен и пользователя из localStorage при загрузке приложения
    const initAuth = async () => {
      const token = AuthTokenManager.get();
      if (token) {
        dispatch(setAuthToken(token));
        
        try {
          // Загружаем данные пользователя
          const user: any = await request.get(endpoints.get_user_profile);
          if (user) {
            dispatch(setUser(user));
            console.log('✅ Token and user profile restored from localStorage');
          }
        } catch (error) {
          console.error('❌ Failed to load user profile:', error);
          // Если токен невалидный, очищаем
          AuthTokenManager.remove();
          dispatch(logout());
        }
      }
    };
    
    initAuth();

    // Hide Froala Editor watermark using JavaScript
    const hideFroalaWatermark = () => {
      // Remove Froala watermark elements
      const selectors = [
        'a[href*="froala"]',
        '*[data-f-id]',
        'a[title*="Froala"]',
        '*[data-f-id="pbf"]',
        '.fr-wrapper a.fr-floating-btn'
      ];
      
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          (el as HTMLElement).style.display = 'none';
          el.remove();
        });
      });

      // Remove text nodes containing "Powered by Froala Editor"
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null
      );

      const nodesToRemove: HTMLElement[] = [];
      let node;
      while (node = walker.nextNode()) {
        if (node.textContent && /Powered\s*by\s*Froala\s*Editor/i.test(node.textContent)) {
          const parent = node.parentElement;
          if (parent) {
            nodesToRemove.push(parent);
          }
        }
      }
      nodesToRemove.forEach(n => n.remove());
    };

    // Run immediately after mount
    hideFroalaWatermark();

    // Run on mutations
    const observer = new MutationObserver(hideFroalaWatermark);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, [dispatch]);

  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default wrapper.withRedux(App);
// Build 1769863489
