import React, { useState } from 'react';

const PremiumPlanCard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const oldToken = localStorage.getItem('auth_token');
      console.log("🔑 Old token:", oldToken ? `length: ${oldToken.length}` : "missing");
      
      if (!oldToken) {
        setError('Необходимо войти в систему');
        setLoading(false);
        return;
      }

      // Шаг 1: Обмениваем старый Azure токен на новый DuckDNS токен
      console.log("🔄 Exchanging token...");
      const exchangeResponse = await fetch('http://37.252.20.170:9527/api/auth/exchange-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${oldToken}`
        }
      });

      console.log("📡 Exchange status:", exchangeResponse.status);
      
      if (!exchangeResponse.ok) {
        setError('Ошибка авторизации. Пожалуйста, войдите заново');
        setLoading(false);
        return;
      }

      const exchangeData = await exchangeResponse.json();
      console.log("✅ Token exchanged successfully");
      const newToken = exchangeData.token;

      // Шаг 2: Создаем платеж с новым токеном
      const response = await fetch('http://37.252.20.170:9527/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`
        },
        body: JSON.stringify({
          amount: 990,
          description: 'Премиум подписка на 30 дней - Полный доступ ко всем упражнениям',
          planType: 'premium',
          duration: 30
        })
      });

      console.log("📡 Payment status:", response.status);
      const data = await response.json();
      console.log("📦 Payment data:", data);
      
      if (response.status === 401) {
        setError("Ошибка авторизации");
        setLoading(false);
        return;
      }
      
      if (data.success && data.payment?.paymentUrl) {
        window.location.href = data.payment.paymentUrl;
      } else {
        setError(data.error || 'Не удалось создать платеж');
        setLoading(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Ошибка при создании платежа');
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Премиум доступ</h2>
        <span className="bg-yellow-400 text-purple-900 px-4 py-2 rounded-full text-sm font-semibold">
          Популярный
        </span>
      </div>
      
      <p className="text-purple-100 mb-6">Полный доступ ко всем упражнениям</p>
      
      <ul className="space-y-4 mb-8">
        <li className="flex items-start">
          <svg className="w-6 h-6 mr-3 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold">Полное видео-инструкция</p>
            <p className="text-purple-200 text-sm">Детальная демонстрация каждого упражнения</p>
          </div>
        </li>
        <li className="flex items-start">
          <svg className="w-6 h-6 mr-3 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold">Детальное описание техники</p>
            <p className="text-purple-200 text-sm">Пошаговые инструкции и рекомендации</p>
          </div>
        </li>
        <li className="flex items-start">
          <svg className="w-6 h-6 mr-3 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold">Доступ на 1 месяц</p>
            <p className="text-purple-200 text-sm">30 дней неограниченного доступа</p>
          </div>
        </li>
        <li className="flex items-start">
          <svg className="w-6 h-6 mr-3 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold">Все категории упражнений</p>
            <p className="text-purple-200 text-sm">Шея, лицо, губы, челюсть и другие</p>
          </div>
        </li>
      </ul>
      
      <div className="mb-6">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-sm text-purple-200">Всего за</span>
            <div className="text-5xl font-bold mt-1">990 ₽</div>
          </div>
          <div className="text-right">
            <span className="text-sm text-purple-200">≈ 33 ₽/день</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="w-full bg-white text-purple-600 font-bold py-4 px-6 rounded-xl hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Обработка...
          </span>
        ) : (
          'Оплатить 990 ₽'
        )}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-500 bg-opacity-20 border border-red-300 rounded-lg">
          <p className="text-white text-sm">{error}</p>
        </div>
      )}
      
      <div className="mt-6 flex items-center justify-center space-x-4 text-sm">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Безопасно</span>
        </div>
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
          </svg>
          <span>Альфа-Банк</span>
        </div>
      </div>
    </div>
  );
};

export default PremiumPlanCard;
