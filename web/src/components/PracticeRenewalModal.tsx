/**
 * Practice Renewal Modal - Special offer for marathon practice extension
 */

import { useState, useEffect } from 'react';
import { API_URL } from '@/config/api';

interface PracticeRenewalModalProps {
  isOpen: boolean;
  onClose: () => void;
  marathonId: string;
  marathonName: string;
  onPaymentSuccess?: () => void;
}

const SPECIAL_OFFER_KEY = 'practiceRenewal_specialOfferUsed';
const TIMER_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

export default function PracticeRenewalModal({
  isOpen,
  onClose,
  marathonId,
  marathonName,
  onPaymentSuccess
}: PracticeRenewalModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(TIMER_DURATION);
  const [showSpecialOffer, setShowSpecialOffer] = useState(false);

  // Check if special offer was used this month
  useEffect(() => {
    if (!isOpen) return;

    // Check if offer was already used this month
    const lastUsed = localStorage.getItem(`${SPECIAL_OFFER_KEY}_${marathonId}`);
    if (lastUsed) {
      const lastUsedDate = new Date(parseInt(lastUsed));
      const now = new Date();
      const monthDiff = (now.getFullYear() - lastUsedDate.getFullYear()) * 12 + 
                       (now.getMonth() - lastUsedDate.getMonth());
      
      if (monthDiff < 1) {
        // Used this month - no special offer
        setShowSpecialOffer(false);
        return;
      }
    }

    // Check existing timer
    const timerStart = localStorage.getItem(`practiceRenewalTimer_${marathonId}`);
    
    if (timerStart) {
      // Timer exists - check if still valid
      const elapsed = Date.now() - parseInt(timerStart);
      const remaining = Math.max(0, TIMER_DURATION - elapsed);
      
      if (remaining > 0) {
        // Timer still active
        setShowSpecialOffer(true);
        setTimeRemaining(remaining);
      } else {
        // Timer expired
        setShowSpecialOffer(false);
        localStorage.removeItem(`practiceRenewalTimer_${marathonId}`);
      }
    } else {
      // First time - create timer
      setShowSpecialOffer(true);
      const now = Date.now();
      localStorage.setItem(`practiceRenewalTimer_${marathonId}`, now.toString());
      setTimeRemaining(TIMER_DURATION);
    }
  }, [isOpen, marathonId]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || !showSpecialOffer) return;

    const timerStart = localStorage.getItem(`practiceRenewalTimer_${marathonId}`);
    if (!timerStart) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - parseInt(timerStart);
      const remaining = Math.max(0, TIMER_DURATION - elapsed);
      
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        setShowSpecialOffer(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, showSpecialOffer, marathonId]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePayment = async (useSpecialOffer: boolean) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      const price = useSpecialOffer ? 1000 : 1500;

      const response = await fetch(`${API_URL}/api/payment/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'practice_renewal',
          marathonId,
          amount: price,
          description: `Продление практики марафона "${marathonName}"`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при создании платежа');
      }

      const data = await response.json();

      if (!data.paymentUrl) {
        throw new Error('Не получена ссылка для оплаты');
      }

      // Mark special offer as used if applicable
      if (useSpecialOffer) {
        localStorage.setItem(`${SPECIAL_OFFER_KEY}_${marathonId}`, Date.now().toString());
        localStorage.removeItem(`practiceRenewalTimer_${marathonId}`);
      }

      // Redirect to payment page
      window.location.href = data.paymentUrl;
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при оплате');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const regularPrice = 1500;
  const specialPrice = 1000;
  const discount = regularPrice - specialPrice;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={loading}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>
          Продление доступа к практике
        </h2>

        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            <strong>Марафон:</strong> {marathonName}
          </p>
          <p className="text-gray-700 mb-4">
            Уважаемый пользователь! При продлении вы получите:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Доступ к материалам марафона на <strong>30 дней</strong></li>
            <li>Курс начнется с <strong>1-го дня практики</strong></li>
            <li>Полный доступ ко всем упражнениям и видео</li>
          </ul>
        </div>

        {showSpecialOffer && timeRemaining > 0 ? (
          <>
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-400 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-orange-600">🎉 Специальное предложение!</span>
                <span className="text-sm bg-red-500 text-white px-2 py-1 rounded-full font-bold">
                  1 раз в месяц
                </span>
              </div>
              <p className="text-gray-700 mb-3">
                Только сегодня при первом заходе — скидка <strong>{discount} ₽</strong>!
              </p>
              <div className="bg-white rounded p-3 mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 line-through">Обычная цена:</span>
                  <span className="text-gray-600 line-through">{regularPrice} ₽</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-orange-600">Специальная цена:</span>
                  <span className="text-2xl font-bold text-orange-600">{specialPrice} ₽</span>
                </div>
              </div>
              <div className="bg-red-500 text-white text-center py-2 rounded-lg">
                <p className="text-sm mb-1">Предложение действует:</p>
                <p className="text-2xl font-bold font-mono">{formatTime(timeRemaining)}</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <button
              onClick={() => handlePayment(true)}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg mb-3"
            >
              {loading ? 'Обработка...' : `💳 Перейти к оплате — ${specialPrice} ₽`}
            </button>

            <button
              onClick={() => handlePayment(false)}
              disabled={loading}
              className="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Оплатить по обычной цене — {regularPrice} ₽
            </button>
          </>
        ) : (
          <>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">Стоимость продления:</span>
                <span className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                  {regularPrice} ₽
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <button
              onClick={() => handlePayment(false)}
              disabled={loading}
              className="w-full font-bold py-4 px-6 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }}
            >
              {loading ? 'Обработка...' : '💳 Перейти к оплате'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
