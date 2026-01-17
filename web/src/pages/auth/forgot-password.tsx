import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { sendResetPasswordRequest } from '@/store/modules/auth/slice';

export default function ForgotPassword() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  
  const [email, setEmail] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');

  const t = {
    ru: {
      title: 'Восстановление пароля',
      subtitle: 'Введите email для получения нового пароля',
      emailLabel: 'Email адрес',
      emailPlaceholder: 'your@email.com',
      sendButton: 'Отправить',
      sending: 'Отправка...',
      rememberPassword: 'Вспомнили пароль?',
      signIn: 'Войти',
      // Success modal
      successTitle: 'Пароль отправлен!',
      successMessage: 'Новый временный пароль отправлен на ваш email.',
      successNote: 'Проверьте почту и используйте новый пароль для входа. Не забудьте изменить его в настройках профиля.',
      goToLogin: 'Перейти на страницу входа',
    },
    en: {
      title: 'Reset Password',
      subtitle: 'Enter your email to receive a new password',
      emailLabel: 'Email Address',
      emailPlaceholder: 'your@email.com',
      sendButton: 'Send',
      sending: 'Sending...',
      rememberPassword: 'Remember your password?',
      signIn: 'Sign in',
      // Success modal
      successTitle: 'Password Sent!',
      successMessage: 'A new temporary password has been sent to your email.',
      successNote: 'Check your inbox and use the new password to log in. Don\'t forget to change it in your profile settings.',
      goToLogin: 'Go to Login',
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ru' ? 'en' : 'ru');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(sendResetPasswordRequest({ email }));
    // Показываем модал успеха
    setShowSuccessModal(true);
  };

  const handleGoToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <>
      <Head>
        <title>{t[language].title} - Rejuvena</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="fixed top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow z-50"
        >
          <span>{language === 'ru' ? '🇷🇺' : '🇺🇸'}</span>
          <span className="text-sm font-medium">{language === 'ru' ? 'Русский' : 'English'}</span>
        </button>

        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t[language].title}</h1>
            <p className="text-gray-600">{t[language].subtitle}</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t[language].emailLabel}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder={t[language].emailPlaceholder}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {loading ? t[language].sending : t[language].sendButton}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            {t[language].rememberPassword}{' '}
            <Link href="/auth/login" className="text-purple-600 font-semibold hover:text-purple-700">
              {t[language].signIn}
            </Link>
          </p>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
              <div className="text-center">
                {/* Success Icon */}
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {t[language].successTitle}
                </h2>
                
                <p className="text-gray-600 mb-2">
                  {t[language].successMessage}
                </p>
                
                <p className="text-sm text-gray-500 mb-6">
                  {t[language].successNote}
                </p>

                <button
                  onClick={handleGoToLogin}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  {t[language].goToLogin}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
