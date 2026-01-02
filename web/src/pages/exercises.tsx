/**
 * Demo Exercises Page - Комплекс на шею (real data from API)
 * Loads exercises from marathon API
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { request } from '@/api/request';
import * as endpoints from '@/api/endpoints';
import ExerciseItem from '@/components/day/ExerciseItem';
import ExerciseDetailModal from '@/components/day/ExerciseDetailModal';

// Marathon ID for demo - "Селп курс: база" from mobile app
const DEMO_MARATHON_ID = '3842e63f-b125-447d-94a1-b1c93be38b4e';
// Day with "На осанку" category - Day 10 typically has posture exercises
const DEMO_DAY_ID = '10de5eeb-8612-4e33-b6c0-df656fce9e0f';

export default function ExercisesPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedExercises, setExpandedExercises] = useState<Record<string, boolean>>({});
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [modalMounted, setModalMounted] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Mount modal after hydration
  useEffect(() => {
    setModalMounted(true);
  }, []);

  // Load exercises from API
  useEffect(() => {
    const loadExercises = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Start marathon to initialize
        const marathonData = await request.get(endpoints.get_start_marathon, {
          params: {
            marathonId: DEMO_MARATHON_ID,
            timeZoneOffset: new Date().getTimezoneOffset(),
          },
        });

        // 2. Get day exercises
        const dayData: any = await request.get(endpoints.get_day_exercises, {
          params: {
            dayId: DEMO_DAY_ID,
            timeZoneOffset: new Date().getTimezoneOffset(),
          },
        });

        console.log('Day data:', dayData);

        // Find "На осанку" category
        const categoryName = 'На осанку';
        const postureCategory = dayData.marathonDay?.dayCategories?.find(
          (cat: any) => cat.categoryName === categoryName || cat.categoryName.includes('осанку')
        );

        if (postureCategory && postureCategory.exercises) {
          // Get all exercises and mark last 4 as locked
          const allExercises = postureCategory.exercises;
          const exercisesCount = allExercises.length;
          
          const processedExercises = allExercises.map((ex: any, index: number) => ({
            ...ex,
            // Lock last 4 exercises (or last 4 if less than 9 total)
            blockExercise: index >= Math.max(0, exercisesCount - 4),
          }));

          setExercises(processedExercises);
        } else {
          setError('Категория "На осанку" не найдена');
        }
      } catch (err: any) {
        console.error('Failed to load exercises:', err);
        setError(err.message || 'Не удалось загрузить упражнения');
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, []);

  const handleExerciseToggle = (exerciseId: string) => {
    setExpandedExercises(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const handleExerciseCheck = (exercise: any, uniqueId: string) => {
    if (exercise.blockExercise) {
      setShowPaymentModal(true);
      return;
    }
    
    setCompletedExercises(prev => ({
      ...prev,
      [uniqueId]: !prev[uniqueId],
    }));
  };

  const handleExerciseClick = (exercise: any, uniqueId: string) => {
    if (exercise.blockExercise) {
      setShowPaymentModal(true);
      return;
    }
    setSelectedExercise(exercise);
  };

  const handleExerciseDetailClick = (exercise: any) => {
    if (exercise.blockExercise) {
      setShowPaymentModal(true);
      return;
    }
    setSelectedExercise(exercise);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка упражнений...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ошибка загрузки</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Вернуться
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-3 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              aria-label="Назад"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h1 className="text-xl font-bold flex-1 text-center">Комплекс на шею</h1>
            
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Exercises List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4">
            <h2 className="text-xl font-bold">План упражнений</h2>
          </div>

          {/* Category: На осанку */}
          <div className="bg-white">
            {/* Category Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">🧘</div>
                <h3 className="text-lg font-semibold text-gray-900">На осанку</h3>
              </div>
            </div>

            {/* Exercises */}
            <div className="px-0 sm:px-6 pb-4 space-y-2">
              {exercises.map((exercise, index) => {
                const uniqueId = `exercise-${exercise.id || index}`;
                const isExpanded = expandedExercises[uniqueId] || false;
                const isDone = completedExercises[uniqueId] || false;
                
                return (
                  <ExerciseItem
                    key={exercise.id || index}
                    exercise={exercise}
                    uniqueId={uniqueId}
                    isActive={isExpanded}
                    isDone={isDone}
                    isChanging={false}
                    onToggle={() => handleExerciseToggle(uniqueId)}
                    onCheck={() => handleExerciseCheck(exercise, uniqueId)}
                    onDetailClick={() => handleExerciseDetailClick(exercise)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Detail Modal */}
      {modalMounted && selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onCheckboxChange={() => {
            const uniqueId = `exercise-${selectedExercise.id}`;
            handleExerciseCheck(selectedExercise, uniqueId);
          }}
          isDone={completedExercises[`exercise-${selectedExercise.id}`] || false}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowPaymentModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Закрыть"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">Премиум доступ</h3>
              
              <p className="text-gray-600 mb-6">
                Для доступа к этому упражнению необходимо приобрести полный комплекс
              </p>

              <div className="bg-purple-50 rounded-xl p-4 mb-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">100 ₽</div>
                <div className="text-sm text-gray-600">
                  • Доступ к 4 премиум упражнениям<br/>
                  • Продление фотодневника на 1 месяц
                </div>
              </div>

              <button
                onClick={() => {
                  alert('Интеграция с платежной системой в разработке');
                  setShowPaymentModal(false);
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                Оплатить 100 ₽
              </button>

              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full mt-3 text-gray-600 hover:text-gray-800 font-medium py-2"
              >
                Позже
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
