/**
 * Demo Exercises Page - Комплекс на шею
 * Static demo exercises for neck and posture
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ExerciseItem from '@/components/day/ExerciseItem';
import ExerciseDetailModal from '@/components/day/ExerciseDetailModal';
import { POSTURE_EXERCISES } from '@/data/exercisesData.generated';
import type { Exercise } from '@/store/modules/day/slice';

export default function ExercisesPage() {
  const router = useRouter();
  const [expandedExercises, setExpandedExercises] = useState<Record<string, boolean>>({});
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [modalMounted, setModalMounted] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Mount modal after hydration
  useEffect(() => {
    setModalMounted(true);
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
    // Navigate to exercise detail page
    router.push(`/exercise/${exercise.id}`);
  };

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
              {POSTURE_EXERCISES.map((exercise, index) => {
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

              <h3 className="text-2xl font-bold text-gray-900 mb-2">Доступ к упражнению</h3>
              
              <p className="text-gray-600 mb-6">
                Оплатите, пожалуйста, <strong>100 рублей</strong> для открытия этого упражнения на <strong>1 месяц (30 дней)</strong>.
              </p>

              <div className="bg-purple-50 rounded-xl p-4 mb-6 text-left">
                <div className="text-3xl font-bold text-purple-600 mb-3 text-center">100 ₽</div>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>✓ Доступ к упражнению на 30 дней</p>
                  <p>✓ Дополнительный месяц (30 дней) пользования <a href="/photo-diary" className="text-purple-600 hover:text-purple-700 underline">Фотодневником</a></p>
                  <p>✓ Сравнение фотографий</p>
                  <p>✓ Хранение фотографий</p>
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
