/**
 * Marathon Day Page
 * Displays detailed view of a single marathon day with exercises  
 * Based on courses/[courseId]/day/[dayId].tsx from old app
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectCurrentDay,
  selectDayLoading,
  selectDayError,
  selectMarathonDay,
} from '@/store/modules/day/selectors';
import { getDayExercise, clearDayData } from '@/store/modules/day/slice';
import DayHeader from '@/components/day/DayHeader';
import DayDescription from '@/components/day/DayDescription';
import DayPlan from '@/components/day/DayPlan';
import DaysList from '@/components/day/DaysList';
import CommentSection from '@/components/comments/CommentSection';

export default function MarathonDayPage() {
  const router = useRouter();
  const { id, dayNumber } = router.query;
  const dispatch = useAppDispatch();

  const currentDay = useAppSelector(selectCurrentDay);
  const loading = useAppSelector(selectDayLoading);
  const error = useAppSelector(selectDayError);
  const marathonDay = useAppSelector(selectMarathonDay);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Authentication guard - redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // Save current path to redirect back after login
      const currentPath = router.asPath;
      router.push(`/auth/login?returnUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, router]);

  // Fetch day data
  useEffect(() => {
    if (id && dayNumber && typeof id === 'string' && typeof dayNumber === 'string' && isAuthenticated) {
      dispatch(getDayExercise({
        marathonId: id,
        dayId: dayNumber,
      }));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearDayData());
    };
  }, [id, dayNumber, dispatch, isAuthenticated]);

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка дня...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    // Check if error is enrollment not found - means user doesn't own this marathon
    const isNotEnrolled = error.includes('Not enrolled') || error.includes('403') || error.includes('enrollment');
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">{isNotEnrolled ? '🔒' : '😞'}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isNotEnrolled ? 'Марафон недоступен' : 'Ошибка загрузки'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isNotEnrolled
              ? 'Вы не записаны на этот марафон. Вернитесь на страницу марафонов и запишитесь, чтобы получить доступ к содержимому.'
              : error}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/marathons')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {isNotEnrolled ? 'К марафонам' : 'Вернуться'}
            </button>
            {isNotEnrolled && (
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Назад
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!currentDay || !marathonDay) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <DayHeader />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Day Description with Video/Images */}
        <DayDescription />

        {/* Day Plan with Exercises */}
        <DayPlan />

        {/* Days List - показываем все пройденные дни со звездами */}
        {id && typeof id === 'string' && marathonDay?.day && (
          <DaysList 
            marathonId={id} 
            currentDayNumber={marathonDay.day}
          />
        )}

        {/* Comments Section */}
        {id && typeof id === 'string' && marathonDay?.day && (
          <CommentSection 
            marathonId={id}
            marathonDayNumber={marathonDay.day}
            context="marathon-day"
          />
        )}
      </div>
    </div>
  );
}
