import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { wrapper } from '@/store/store';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch } from '@/store/hooks';
import { setAuthToken, setUser } from '@/store/modules/auth/slice';
import { AuthTokenManager, request, endpoints } from '@/api';

function App({ Component, pageProps }: AppProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    // Handle GitHub Pages 404 redirect with hash routing
    // 404.html redirects to /#/path, we need to extract and navigate to /path
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
        
        // Note: Profile loading removed - endpoint not yet implemented on backend
        // User data will be loaded on specific pages that need it
        console.log('✅ Token restored from localStorage');
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

  return <Component {...pageProps} />;
}

export default wrapper.withRedux(App);
// Build 1769863489
