import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/modules/auth/slice';
import { request } from '@/api/request';
import * as endpoints from '@/api/endpoints';

interface Payment {
  id: string;
  orderNumber: string;
  amount: number;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded' | 'cancelled';
  paymentMethod: 'card' | 'sbp' | 'unknown';
  description: string;
  createdAt: string;
  metadata?: {
    planType?: string;
    duration?: number;
  };
}

export default function ProfileSettings() {
  const router = useRouter();
  const dispatch = useAppDispatch();
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
  const [daysRemaining, setDaysRemaining] = useState<number | null>(0);

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
      access: 'Доступ',
      photoDiary: 'Фотодневник',
      diaryActive: 'Активен до',
      diaryExpired: 'Доступ истёк',
      daysLeft: 'Осталось дней',
      pending: 'Ожидание',
      processing: 'Обработка',
      succeeded: 'Успешно',
      failed: 'Ошибка',
      refunded: 'Возврат',
      cancelled: 'Отменено',
      premiumDays: (days: number) => `Премиум ${days} дн.`,
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
      access: 'Access',
      photoDiary: 'Photo Diary',
      diaryActive: 'Active until',
      diaryExpired: 'Access expired',
      daysLeft: 'Days remaining',
      pending: 'Pending',
      processing: 'Processing',
      succeeded: 'Success',
      failed: 'Failed',
      refunded: 'Refunded',
      cancelled: 'Cancelled',
      premiumDays: (days: number) => `Premium ${days}d`,
      backToDashboard: 'Back to Dashboard',
    }
  };

  const calculateDiaryExpiry = () => {
    // Если первая фотография еще не загружена
    if (!user?.firstPhotoDiaryUpload) {
      setDiaryExpiresAt(null);
      setDaysRemaining(null);
      return;
    }

    const firstUploadDate = new Date(user.firstPhotoDiaryUpload);
    let totalDays = 30; // Бесплатный период

    payments
      .filter(p => p.status === 'succeeded')
      .forEach(() => {
        totalDays += 30; // +30 дней за каждую покупку
      });

    const expiryDate = new Date(firstUploadDate);
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
      const response = await request.get(endpoints.payment_history) as any;
      if (response.payments) {
        setPayments(response.payments);
      }
    } catch (error) {
      console.error('Error loading payment history:', error);
    } finally {
      setIsLoadingPayments(false);
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
      case 'succeeded': return 'text-green-600';
      case 'processing': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      case 'refunded': return 'text-orange-600';
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

          {/* Photo Diary Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4"><Link href="/photo-diary" className="hover:text-purple-600 transition-colors cursor-pointer">{t[language].photoDiary}</Link></h2>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">
                    {t[language].diaryActive}
                  </p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">
                    {diaryExpiresAt ? new Date(diaryExpiresAt).toLocaleDateString('ru-RU') : 'Еще не началась'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-sm">{t[language].daysLeft}</p>
                  <p className="text-3xl font-bold text-purple-600">{daysRemaining !== null ? daysRemaining : "-"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Profile Edit Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Личные данные</h2>
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const firstName = formData.get('firstName') as string;
              const lastName = formData.get('lastName') as string;
              
              fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/update-profile`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({ firstName, lastName })
              })
              .then(res => res.json())
              .then(data => {
                // Update Redux state
                dispatch(setUser({
                  ...user,
                  firstName: data.firstName,
                  lastName: data.lastName
                }));
                alert('Профиль обновлен!');
              })
              .catch(err => alert('Ошибка при обновлении профиля'));
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    defaultValue={user?.firstName || ''}
                    placeholder="Введите имя"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Фамилия
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    defaultValue={user?.lastName || ''}
                    placeholder="Введите фамилию"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Сохранить изменения
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
                      <th className="text-left py-3 px-4 text-gray-600">{t[language].access}</th>
                      <th className="text-left py-3 px-4 text-gray-600">{t[language].status}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">{formatDate(payment.createdAt)}</td>
                        <td className="py-3 px-4 font-semibold">{payment.amount} ₽</td>
                        <td className="py-3 px-4 text-gray-600">
                          Альфа-банк
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {payment.metadata?.duration 
                            ? (typeof t[language].premiumDays === 'function' 
                                ? t[language].premiumDays(payment.metadata.duration)
                                : `Premium ${payment.metadata.duration}d`)
                            : payment.description}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-sm font-medium ${getStatusColor(payment.status)}`}>
                            {payment.status === 'succeeded' ? t[language].succeeded :
                             payment.status === 'processing' ? t[language].processing :
                             payment.status === 'pending' ? t[language].pending :
                             payment.status === 'failed' ? t[language].failed :
                             payment.status === 'refunded' ? t[language].refunded :
                             payment.status === 'cancelled' ? t[language].cancelled :
                             payment.status}
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
