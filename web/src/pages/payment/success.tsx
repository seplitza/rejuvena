/**
 * Payment Success Page - v1769765183750
 * Страница успешной оплаты - /payment/success
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/modules/auth/slice';

export default function PaymentSuccess() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orderId } = router.query;
  
  const [status, setStatus] = useState<'checking' | 'processing' | 'succeeded' | 'failed' | 'error'>('checking');
  const [payment, setPayment] = useState<any>(null);
  const [marathon, setMarathon] = useState<any>(null);

  // Обновляем данные пользователя после успешной оплаты
  const refreshUserData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://37.252.20.170:9527'}/api/auth/me`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const userData = await response.json();
        dispatch(setUser({
          _id: userData._id || userData.id,
          firstName: userData.email?.split('@')[0] || 'User',
          email: userData.email,
          role: userData.role || 'admin',
          isPremium: userData.isPremium || false,
          premiumEndDate: userData.premiumEndDate,
        }));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  useEffect(() => {
    if (!orderId) {
      setStatus('error');
      return;
    }

    const checkStatus = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          console.error('No auth token found');
          setStatus('error');
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://37.252.20.170:9527';
        const response = await fetch(
          `${apiUrl}/api/payment/status/${orderId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        const data = await response.json();
        console.log('Payment status response:', data);
        
        if (!response.ok) {
          console.error('API error:', response.status, data);
          setStatus('error');
          return;
        }
        
        if (data.success && data.payment) {
          setPayment(data.payment);
          setStatus(data.payment.status);
          
          // Если это марафон - загружаем его данные для получения telegramGroupUrl
          if (data.payment.metadata?.type === 'marathon' || data.payment.metadata?.planType === 'marathon') {
            try {
              let marathonData = null;
              
              // Пытаемся загрузить по marathonId (новые платежи)
              if (data.payment.metadata?.marathonId) {
                const marathonResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL || 'http://37.252.20.170:9527'}/api/marathons/${data.payment.metadata.marathonId}`
                );
                if (marathonResponse.ok) {
                  marathonData = await marathonResponse.json();
                }
              }
              
              // Fallback: ищем по названию из metadata (старые платежи)
              if (!marathonData && data.payment.metadata?.marathonName) {
                const allMarathonsResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL || 'http://37.252.20.170:9527'}/api/marathons`
                );
                if (allMarathonsResponse.ok) {
                  const marathons = await allMarathonsResponse.json();
                  marathonData = marathons.find((m: any) => m.title === data.payment.metadata.marathonName);
                }
              }
              
              if (marathonData) {
                setMarathon(marathonData);
              }
            } catch (error) {
              console.error('Error loading marathon:', error);
            }
          }
          
          // Если платеж успешен - обновляем данные пользователя
          if (data.payment.status === 'succeeded') {
            await refreshUserData();
          }
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setStatus('error');
      }
    };

    checkStatus();
    
    // Проверяем статус каждые 3 секунды, пока он не изменится
    const interval = setInterval(() => {
      if (status === 'checking' || status === 'processing') {
        checkStatus();
      } else {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, status, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Checking Status */}
        {status === 'checking' && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <svg className="animate-spin w-20 h-20 text-purple-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Проверка статуса платежа</h2>
            <p className="text-gray-600">Пожалуйста, подождите...</p>
          </div>
        )}

        {/* Processing */}
        {status === 'processing' && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <svg className="animate-pulse w-20 h-20 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Обработка платежа</h2>
            <p className="text-gray-600">Ваш платеж обрабатывается. Это может занять несколько секунд.</p>
          </div>
        )}

        {/* Success */}
        {status === 'succeeded' && (
          <div>
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Оплата прошла успешно!</h2>
              <p className="text-green-100">Премиум доступ активирован</p>
            </div>

            {/* Success Details */}
            <div className="p-8">
              {payment && (
                <div className="mb-6 space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Сумма:</span>
                    <span className="text-2xl font-bold text-gray-900">{payment.amount} ₽</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Описание:</span>
                    <span className="text-gray-900 font-medium">{payment.description}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Номер заказа:</span>
                    <span className="text-xs text-gray-500 font-mono">{payment.orderNumber}</span>
                  </div>
                </div>
              )}

              {/* Показываем детали премиум доступа */}
              {payment?.metadata?.type !== 'marathon' && payment?.metadata?.type !== 'exercise' && payment?.metadata?.planType !== 'marathon' && payment?.metadata?.planType !== 'exercise' && (
                <div className="bg-purple-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-purple-900 mb-2">✨ Теперь вам доступны:</h3>
                  <ul className="space-y-2 text-sm text-purple-800">
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Полные фото и видео-инструкции</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Детальное описание техник</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Доступ на {(payment?.metadata?.duration || 30) + 30} дней</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Фотодневник на 90 дней</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* Детали для марафона */}
              {(payment?.metadata?.type === 'marathon' || payment?.metadata?.planType === 'marathon') && (
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-green-900 mb-2">🎯 Марафон "{payment?.metadata?.marathonName}"</h3>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Доступ на {payment?.metadata?.marathonTenure || 44} дней</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Ежедневные упражнения и задания</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Фотодневник на 90 дней</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Персональный трекинг прогресса</span>
                    </li>
                  </ul>
                </div>
              )}

              <Link 
                href={
                  (payment?.metadata?.type === 'marathon' || payment?.metadata?.planType === 'marathon') && payment?.metadata?.marathonId
                    ? `/marathons/${payment.metadata.marathonId}/start` 
                    : '/exercises'
                }
                className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {payment?.metadata?.type === 'marathon' || payment?.metadata?.planType === 'marathon'
                  ? 'Перейти в марафон' 
                  : 'Перейти к упражнениям'}
              </Link>

              {/* Ссылка на Telegram группу (только для марафонов) */}
              {(payment?.metadata?.type === 'marathon' || payment?.metadata?.planType === 'marathon') && marathon?.telegramGroupUrl && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📱</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 mb-2">Присоединяйтесь к группе марафона в Telegram</h3>
                      <p className="text-sm text-blue-800 mb-3">Там выходят прямые эфиры с автором</p>
                      <a
                        href={marathon.telegramGroupUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Открыть группу →
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              {(payment?.metadata?.type === 'marathon' || payment?.metadata?.planType === 'marathon') && (
                <p className="mt-3 text-center text-sm text-gray-600">
                  Детали оплаты отправлены в <a href="https://t.me/Seplitza_info_bot" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 underline">https://t.me/Seplitza_info_bot</a>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Failed */}
        {status === 'failed' && (
          <div>
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Платеж не прошел</h2>
              <p className="text-red-100">Произошла ошибка при обработке платежа</p>
            </div>

            <div className="p-8">
              <div className="bg-red-50 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm">
                  Платеж был отклонен. Возможные причины:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-red-700">
                  <li>• Недостаточно средств на карте</li>
                  <li>• Карта заблокирована или просрочена</li>
                  <li>• Введены неверные данные карты</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Link 
                  href="/"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                >
                  Попробовать снова
                </Link>
                <Link 
                  href="/exercises"
                  className="flex-1 bg-gray-100 text-gray-700 text-center font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Вернуться
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div>
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Ошибка</h2>
              <p className="text-orange-100">Не удалось проверить статус платежа</p>
            </div>

            <div className="p-8">
              <p className="text-gray-600 mb-6 text-center">
                Пожалуйста, проверьте историю платежей в личном кабинете или обратитесь в поддержку.
              </p>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">📞 Техническая поддержка</h3>
                <p className="text-sm text-blue-800 mb-3">Если возникли проблемы с приложением, обратитесь в поддержку:</p>
                <a
                  href="https://t.me/seplitza_support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Открыть поддержку →
                </a>
              </div>

              <Link 
                href="/"
                className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                Вернуться на главную
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
