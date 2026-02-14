import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';

interface Marathon {
  _id: string;
  title: string;
  description?: string;
  numberOfDays: number;
  welcomeMessage?: string;
  courseDescription?: string;
  rules?: string;
  startDate: string;
  isPublic: boolean;
  userEnrolled?: boolean;
}

export default function MarathonStartPage() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [marathon, setMarathon] = useState<Marathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeUntilStart, setTimeUntilStart] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!id) return;

    const loadMarathon = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://37.252.20.170:9527'}/api/marathons/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setMarathon(data.marathon);
          }
        }
      } catch (error) {
        console.error('Failed to load marathon:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMarathon();
  }, [id, isAuthenticated, router]);

  // Countdown timer
  useEffect(() => {
    if (!marathon) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const startDate = new Date(marathon.startDate).getTime();
      const distance = startDate - now;

      if (distance < 0) {
        setHasStarted(true);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeUntilStart({ days, hours, minutes, seconds });
      setHasStarted(false);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [marathon]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!marathon) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Марафон не найден</p>
          <Link href="/marathons" className="mt-4 inline-block text-purple-600 hover:text-purple-700">
            ← Вернуться к марафонам
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/dashboard" className="text-purple-600 hover:text-purple-700 flex items-center">
            <span className="text-xl mr-2">←</span>
            Назад в кабинет
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Marathon Title */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">{marathon.title}</h1>
            <span className="text-6xl">🎯</span>
          </div>
          {marathon.description && (
            <p className="text-blue-100 text-lg">{marathon.description}</p>
          )}
          <div className="mt-6 flex items-center space-x-6">
            <div className="flex items-center">
              <span className="text-3xl mr-2">📅</span>
              <div>
                <p className="text-sm text-blue-200">Длительность</p>
                <p className="text-xl font-semibold">{marathon.numberOfDays} дней</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-3xl mr-2">✅</span>
              <div>
                <p className="text-sm text-blue-200">Статус</p>
                <p className="text-xl font-semibold">Оплачено</p>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        {marathon.welcomeMessage && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-3xl mr-3">👋</span>
              Добро пожаловать!
            </h2>
            <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: marathon.welcomeMessage }} />
          </div>
        )}

        {/* Course Description */}
        {marathon.courseDescription && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-3xl mr-3">📖</span>
              О марафоне
            </h2>
            <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: marathon.courseDescription }} />
          </div>
        )}

        {/* Rules */}
        {marathon.rules && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-3xl mr-3">📋</span>
              Правила марафона
            </h2>
            <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: marathon.rules }} />
          </div>
        )}

        {/* Countdown or Start Button */}
        {!hasStarted ? (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">⏰ Марафон начнется</h3>
            <p className="text-orange-100 mb-6 text-center">
              Старт: {new Date(marathon.startDate).toLocaleDateString('ru-RU', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-4xl font-bold text-white">{timeUntilStart.days}</div>
                <div className="text-sm text-orange-100 mt-1">дней</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-4xl font-bold text-white">{timeUntilStart.hours}</div>
                <div className="text-sm text-orange-100 mt-1">часов</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-4xl font-bold text-white">{timeUntilStart.minutes}</div>
                <div className="text-sm text-orange-100 mt-1">минут</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-4xl font-bold text-white">{timeUntilStart.seconds}</div>
                <div className="text-sm text-orange-100 mt-1">секунд</div>
              </div>
            </div>
            <p className="text-center text-white mt-6 text-sm">
              📧 Мы отправим вам напоминание когда марафон начнется
            </p>
          </div>
        ) : (
          <div 
            className="rounded-xl shadow-2xl p-8 text-center"
            style={{ backgroundImage: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">Готовы начать?</h3>
            <p className="text-purple-100 mb-6">Переходя на 1-й день обучения Вы соглашаетесь с правилами марафона!</p>
            <Link
              href={`/marathons/${id}/day/1`}
              className="inline-block bg-white text-purple-600 font-bold text-lg px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              🚀 Начать День 1
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
