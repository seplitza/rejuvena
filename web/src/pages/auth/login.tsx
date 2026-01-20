import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginWithEmail } from '@/store/modules/auth/slice';

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');

  const t = {
    ru: {
      title: 'Войти в аккаунт',
      subtitle: 'Или',
      createAccount: 'создать новый аккаунт',
      emailLabel: 'Email адрес',
      emailPlaceholder: 'Email адрес',
      passwordLabel: 'Пароль',
      passwordPlaceholder: 'Пароль',
      rememberMe: 'Запомнить меня',
      forgotPassword: 'Забыли пароль?',
      signInButton: 'Войти',
      signingIn: 'Вход...',
      orContinue: 'Или продолжить с',
      google: 'Google',
      // Переводы ошибок
      errorUserExists: 'Пользователь уже существует',
      errorLoginFailed: 'Ошибка входа',
      errorSignupFailed: 'Ошибка регистрации',
      errorInvalidCredentials: 'Неверный email или пароль',
      errorNetworkError: 'Ошибка сети. Проверьте интернет-соединение или отправьте скриншот в поддержку: https://t.me/seplitza_support',
      errorCorsIssue: 'Не удалось подключиться к серверу. Попробуйте обновить страницу или отправьте скриншот в поддержку: https://t.me/seplitza_support',
      errorServerError: 'Ошибка сервера. Попробуйте позже или отправьте скриншот в поддержку: https://t.me/seplitza_support',
    },
    en: {
      title: 'Sign in to your account',
      subtitle: 'Or',
      createAccount: 'create a new account',
      emailLabel: 'Email address',
      emailPlaceholder: 'Email address',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot your password?',
      signInButton: 'Sign in',
      signingIn: 'Signing in...',
      orContinue: 'Or continue with',
      google: 'Google',
      // Error translations
      errorUserExists: 'User already exists',
      errorLoginFailed: 'Login failed',
      errorSignupFailed: 'Signup failed',
      errorInvalidCredentials: 'Invalid email or password',
      errorNetworkError: 'Network error',
    },
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ru' ? 'en' : 'ru');
  };

  // Переводим ошибки с английского на текущий язык
  const translateError = (errorMsg: string | null) => {
    if (!errorMsg) return null;
    
    const errorMap: { [key: string]: keyof typeof t.ru } = {
      'User already exists': 'errorUserExists',
      'Login failed': 'errorLoginFailed',
      'Signup failed': 'errorSignupFailed',
      'Invalid credentials': 'errorInvalidCredentials',
      'Network Error': 'errorNetworkError',
    };

    for (const [enError, key] of Object.entries(errorMap)) {
      if (errorMsg.includes(enError)) {
        return t[language][key];
      }
    }

    return errorMsg; // Если перевод не найден, показываем как есть
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(loginWithEmail({ email, password }));
  };

  // Redirect to dashboard if authenticated
  if (isAuthenticated) {
    router.push('/dashboard');
  }

  return (
    <>
      <Head>
        <title>Sign In - FaceLift Naturally</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        {/* Переключатель языка */}
        <button
          onClick={toggleLanguage}
          className="fixed top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow z-50"
        >
          <span>{language === 'ru' ? '🇷🇺' : '🇺🇸'}</span>
          <span className="text-sm font-medium">{language === 'ru' ? 'Русский' : 'English'}</span>
        </button>

        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {t[language].title}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {t[language].subtitle}{' '}
              <Link href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                {t[language].createAccount}
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{translateError(error)}</h3>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  {t[language].emailLabel}
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder={t[language].emailPlaceholder}
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  {t[language].passwordLabel}
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder={t[language].passwordPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  {t[language].rememberMe}
                </label>
              </div>

              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                  {t[language].forgotPassword}
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? t[language].signingIn : t[language].signInButton}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">{t[language].orContinue}</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                {t[language].google}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
