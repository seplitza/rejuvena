import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { wrapper } from '@/store/store';
import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setAuthToken, setUser } from '@/store/modules/auth/slice';
import { AuthTokenManager, request, endpoints } from '@/api';

function App({ Component, pageProps }: AppProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Восстанавливаем токен и пользователя из localStorage при загрузке приложения
    const initAuth = async () => {
      const token = AuthTokenManager.get();
      if (token) {
        dispatch(setAuthToken(token));
        
        // Загружаем данные пользователя
        try {
          const userProfile = await request.get(endpoints.get_user_profile);
          dispatch(setUser(userProfile)); // response.data уже извлечён interceptor'ом
          console.log('✅ User restored from token:', userProfile);
        } catch (error) {
          console.error('❌ Failed to load user profile:', error);
          // Если токен невалидный - удаляем
          AuthTokenManager.remove();
        }
      }
    };
    
    initAuth();
  }, [dispatch]);

  return <Component {...pageProps} />;
}

export default wrapper.withRedux(App);
