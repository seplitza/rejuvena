import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { request } from '@/api/request';
import * as endpoints from '@/api/endpoints';

interface Payment {
  _id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfileSettings() {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');

  // Password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Payment history
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);

  // Photo diary info
  const [diaryExpiresAt, setDiaryExpiresAt] = useState<Date | null>(null);
  const [daysRemaining, setDaysRemaining] = useState(0);

  const t = {
    ru: {
      title: 'Настройки профиля',
      changePassword: 'Изменить пароль',
      currentPassword: 'Текущий пароль',
      newPassword: 'Новый пароль',
      confirmPassword: 'Подтвердите пароль',
      savePassword: 'Сохранить пароль',
      passwordChanged: 'Пароль успешно изменён',
      passwordMismatch: 'Пароли не совпадают',
      passwordTooShort: 'Пароль должен быть минимум 4 символа',
      wrongPassword: 'Неверный текущий пароль',
      paymentHistory: 'История покупок',
      noPurchases: 'У вас пока нет покупок',
      status: 'Статус',
      amount: 'Сумма',
      date: 'Дата',
      method: 'Метод оплаты',
      photoDiary: 'Фотодневник',
      diaryActive: 'Активен до',
      diaryExpired: 'Доступ истёк',
      daysLeft: 'Осталось дней',
      pending: 'Ожидание',
      completed: 'Завершено',
      failed: 'Ошибка',
      cancelled: 'Отменено',
      backToDashboard: 'Назад к панели',
    },
    en: {
      title: 'Profile Settings',
      changePassword: 'Change Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      savePassword: 'Save Password',
      passwordChanged: 'Password changed successfully',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 4 characters',
      wrongPassword: 'Current password is incorrect',
      paymentHistory: 'Purchase History',
      noPurchases: 'You have no purchases yet',
      status: 'Status',
      amount: 'Amount',
      date: 'Date',
      method: 'Payment Method',
      photoDiary: 'Photo Diary',
      diaryActive: 'Active until',
      diaryExpired: 'Access expired',
      daysLeft: 'Days remaining',
      pending: 'Pending',
      completed: 'Completed',
      failed: 'Failed',
      cancelled: 'Cancelled',
      backToDashboard: 'Back to Dashboard',
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    // Загружаем историю платежей только если пользователь залогинен
    if (user) {
      loadPaymentHistory();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (user?.createdAt) {
      calculateDiaryExpiry();
    }
  }, [user, payments]);

  const calculateDiaryExpiry = () => {
    if (!user?.createdAt) return;

    // Начальная дата - дата регистрации + 30 дней бесплатно
    const registrationDate = new Date(user.createdAt);
    let totalDays = 30;

    // Добавляем 30 дней за каждую успешную покупку
    payments
      .filter(p => p.status === 'completed')
      .forEach(payment => {
        // Если в покупке указан конкретный срок (например, курс на год), используем его
        // Пока по умолчанию +30 дней за каждую покупку
        totalDays += 30;
      });

    const expiryDate = new Date(registrationDate);
    expiryDate.setDate(expiryDate.getDate() + totalDays);
    
    setDiaryExpiresAt(expiryDate);

    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysRemaining(diffDays > 0 ? diffDays : 0);
  };

  const loadPaymentHistory = async () => {
    try {
      setIsLoadingPayments(true);
      const response = await request.get(endpoints.payment_history);
      // Backend returns {success: true, payments: [...]}
      // Axios interceptor already unwraps response.data, so response = {success, payments}
      setPayments(Array.isArray(response.payments) ? response.payments : []);
    } catch (error: any) {
      console.error('Failed to load payment history:', error);
      if (error?.response?.status === 401) {
        // Если 401 - перенаправляем на логин
        router.push('/auth/login');
      }
      setPayments([]);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (newPassword.length < 4) {
      setPasswordError(t[language].passwordTooShort);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t[language].passwordMismatch);
      return;
    }

    try {
      setIsChangingPassword(true);
      await request.post(endpoints.change_password, {
        currentPassword,
        newPassword,
      });
      setPasswordMessage(t[language].passwordChanged);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      if (error?.response?.status === 401 || error?.status === 401) {
        // Проверяем, это ошибка авторизации или неверный пароль
        if (error?.response?.data?.message?.includes('incorrect') || error?.message?.includes('incorrect')) {
          setPasswordError(t[language].wrongPassword);
        } else {
          // Если токен истёк - перенаправляем на логин
          router.push('/auth/login');
        }
      } else {
        setPasswordError(error?.response?.data?.message || error?.message || 'Error changing password');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ru' ? 'en' : 'ru');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      case 'cancelled': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <>
      <Head>
        <title>{t[language].title} - Rejuvena</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        {/* Language Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <span>{language === 'ru' ? '🇷🇺 RU' : '🇺🇸 EN'}</span>
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link href="/dashboard" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
              ← {t[language].backToDashboard}
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">{t[language].title}</h1>
            {user && (
              <p className="text-gray-600 mt-2">
                {user.firstName} {user.lastName} • {user.email}
              </p>
            )}
          </div>

          {/* Photo Diary Status */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t[language].photoDiary}</h2>
            {diaryExpiresAt && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t[language].diaryActive}:</span>
                  <span className={`font-semibold ${daysRemaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatDate(diaryExpiresAt.toISOString())}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t[language].daysLeft}:</span>
                  <span className="font-bold text-2xl text-purple-600">{daysRemaining}</span>
                </div>
              </div>
            )}
          </div>

          {/* Change Password Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t[language].changePassword}</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t[language].currentPassword}
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t[language].newPassword}
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t[language].confirmPassword}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {passwordMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  {passwordMessage}
                </div>
              )}

              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {passwordError}
                </div>
              )}

              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChangingPassword ? '...' : t[language].savePassword}
              </button>
            </form>
          </div>

          {/* Payment History Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t[language].paymentHistory}</h2>
            
            {isLoadingPayments ? (
              <div className="text-center py-8 text-gray-500">Загрузка...</div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">{t[language].noPurchases}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600">{t[language].date}</th>
                      <th className="text-left py-3 px-4 text-gray-600">{t[language].amount}</th>
                      <th className="text-left py-3 px-4 text-gray-600">{t[language].method}</th>
                      <th className="text-left py-3 px-4 text-gray-600">{t[language].status}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{formatDate(payment.createdAt)}</td>
                        <td className="py-3 px-4 font-semibold">{payment.amount} ₽</td>
                        <td className="py-3 px-4 text-gray-600">{payment.paymentMethod}</td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${getStatusColor(payment.status)}`}>
                            {t[language][payment.status as keyof typeof t.ru]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
