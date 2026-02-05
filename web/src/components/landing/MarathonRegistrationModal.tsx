import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

interface MarathonRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  marathonId: string;
  marathonTitle: string;
  marathonPrice: number;
  isAdvanced?: boolean;
}

const MarathonRegistrationModal: React.FC<MarathonRegistrationModalProps> = ({
  isOpen,
  onClose,
  marathonId,
  marathonTitle,
  marathonPrice,
  isAdvanced = false
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const motivationText = isAdvanced
    ? 'Разумный выбор! Оплачивая Продвинутый уровень Вы получаете доступ к Базовой части марафона, по окончании которой сможете приступить к изучению и практике продвинутых практик.'
    : 'Отличный выбор!';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Регистрация пользователя
      const registerResponse = await axios.post(`${API_BASE_URL}/api/auth/register-and-pay`, {
        email: email.toLowerCase().trim()
      });

      if (!registerResponse.data.success) {
        throw new Error(registerResponse.data.error || 'Ошибка регистрации');
      }

      const { token, password } = registerResponse.data;
      
      // Сохраняем токен
      localStorage.setItem('auth_token', token);

      // 2. Создаем платеж
      const paymentResponse = await axios.post(
        `${API_BASE_URL}/api/payment/create`,
        {
          marathonId,
          marathonName: marathonTitle,
          type: 'marathon',
          planType: 'marathon'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!paymentResponse.data.success) {
        throw new Error('Ошибка создания платежа');
      }

      // 3. Переход на оплату в Альфа-банк
      window.location.href = paymentResponse.data.paymentUrl;

    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || err.message || 'Произошла ошибка');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Заголовок */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {motivationText.split('!')[0]}!
          </h2>
          <p className="text-gray-600 text-sm">
            {motivationText}
          </p>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Введите ваш email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Отправим туда чек и проведем короткую регистрацию. Сразу перейдем к оплате.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Регистрация...' : `Перейти к оплате ${marathonPrice}₽`}
          </button>
        </form>

        {/* Поддержка */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            При возникновении любых сложностей с марафонами обращайтесь в поддержку{' '}
            <a
              href="https://t.me/seplitza_support"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              @seplitza_support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarathonRegistrationModal;
