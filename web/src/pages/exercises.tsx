/**
 * Demo Exercises Page - Комплекс на шею
 * Demonstrates exercise functionality with free and locked exercises
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import ExerciseItem from '@/components/day/ExerciseItem';
import ExerciseDetailModal from '@/components/day/ExerciseDetailModal';

// Demo exercises data - use any to bypass type checking for demo
const demoExercises: any[] = [
  {
    id: 'demo-1',
    marathonExerciseId: 'demo-1',
    exerciseName: 'На заднюю поверхность шеи',
    marathonExerciseName: 'На заднюю поверхность шеи',
    description: 'Упражнение для укрепления задней поверхности шеи. Помогает улучшить осанку и снять напряжение.',
    duration: 300,
    type: 'Practice' as const,
    status: 'NotStarted' as const,
    order: 1,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: false,
    exerciseContents: [
      {
        id: 'content-1-1',
        type: 'video',
        contentPath: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        hint: 'Основное движение',
        orderBy: 1,
      },
    ],
  },
  {
    id: 'demo-2',
    marathonExerciseId: 'demo-2',
    exerciseName: 'На мышцы трапеции',
    marathonExerciseName: 'На мышцы трапеции',
    description: 'Упражнение для расслабления и укрепления трапециевидных мышц.',
    duration: 300,
    type: 'Practice' as const,
    status: 'NotStarted' as const,
    order: 2,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: false,
    exerciseContents: [
      {
        id: 'content-2-1',
        type: 'video',
        contentPath: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        hint: 'Основное движение',
        orderBy: 1,
      },
    ],
  },
  {
    id: 'demo-3',
    marathonExerciseId: 'demo-3',
    exerciseName: 'На переднюю поверхность шеи',
    marathonExerciseName: 'На переднюю поверхность шеи',
    description: 'Упражнение для передней части шеи и подъязычных мышц.',
    duration: 300,
    type: 'Practice' as const,
    status: 'NotStarted' as const,
    order: 3,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: false,
    exerciseContents: [
      {
        id: 'content-3-1',
        type: 'video',
        contentPath: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        hint: 'Основное движение',
        orderBy: 1,
      },
    ],
  },
  {
    id: 'demo-4',
    marathonExerciseId: 'demo-4',
    exerciseName: 'Повороты головы',
    marathonExerciseName: 'Повороты головы',
    description: 'Упражнение на улучшение подвижности шейного отдела позвоночника.',
    duration: 300,
    type: 'Practice' as const,
    status: 'NotStarted' as const,
    order: 4,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: false,
    exerciseContents: [
      {
        id: 'content-4-1',
        type: 'video',
        contentPath: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        hint: 'Основное движение',
        orderBy: 1,
      },
    ],
  },
  {
    id: 'demo-5',
    marathonExerciseId: 'demo-5',
    exerciseName: 'Наклоны головы',
    marathonExerciseName: 'Наклоны головы',
    description: 'Боковые наклоны для растяжки боковых мышц шеи.',
    duration: 300,
    type: 'Practice' as const,
    status: 'NotStarted' as const,
    order: 5,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: false,
    exerciseContents: [
      {
        id: 'content-5-1',
        type: 'video',
        contentPath: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        hint: 'Основное движение',
        orderBy: 1,
      },
    ],
  },
  // Locked exercises
  {
    id: 'demo-6',
    marathonExerciseId: 'demo-6',
    exerciseName: 'Раскрытие плечевых 1',
    marathonExerciseName: 'Раскрытие плечевых 1',
    description: 'Упражнение для раскрытия грудной клетки и плечевого пояса. Улучшает осанку.',
    duration: 300,
    type: 'Practice' as const,
    status: 'NotStarted' as const,
    order: 6,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: true,
    exerciseContents: [
      {
        id: 'content-6-1',
        type: 'video',
        contentPath: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        hint: 'Основное движение',
        orderBy: 1,
      },
    ],
  },
  {
    id: 'demo-7',
    marathonExerciseId: 'demo-7',
    exerciseName: 'Раскрытие плечевых 2',
    marathonExerciseName: 'Раскрытие плечевых 2',
    description: 'Продолжение раскрытия плечевого пояса с углублением растяжки.',
    duration: 300,
    type: 'Practice' as const,
    status: 'NotStarted' as const,
    order: 7,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: true,
    exerciseContents: [
      {
        id: 'content-7-1',
        type: 'video',
        contentPath: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        hint: 'Основное движение',
        orderBy: 1,
      },
    ],
  },
  {
    id: 'demo-8',
    marathonExerciseId: 'demo-8',
    exerciseName: 'Стоечка',
    marathonExerciseName: 'Стоечка',
    description: 'Поза для укрепления мышц спины и улучшения баланса.',
    duration: 300,
    type: 'Practice' as const,
    status: 'NotStarted' as const,
    order: 8,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: true,
    exerciseContents: [
      {
        id: 'content-8-1',
        type: 'video',
        contentPath: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        hint: 'Основное движение',
        orderBy: 1,
      },
    ],
  },
  {
    id: 'demo-9',
    marathonExerciseId: 'demo-9',
    exerciseName: 'На валике',
    marathonExerciseName: 'На валике',
    description: 'Расслабляющее упражнение на массажном валике для спины и шеи.',
    duration: 600,
    type: 'Practice' as const,
    status: 'NotStarted' as const,
    order: 9,
    commentsCount: 0,
    isDone: false,
    isNew: false,
    blockExercise: true,
    exerciseContents: [
      {
        id: 'content-9-1',
        type: 'video',
        contentPath: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        hint: 'Основное движение',
        orderBy: 1,
      },
    ],
  },
];

export default function ExercisesPage() {
  const router = useRouter();
  const [expandedExercises, setExpandedExercises] = useState<Record<string, boolean>>({});
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
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
    setSelectedExercise(exercise);
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
            
            <h1 className="text-xl font-bold flex-1 text-center">Демо: Комплекс на шею</h1>
            
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 bg-purple-100 rounded-full p-3">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Демонстрационный комплекс</h2>
              <p className="text-gray-600 text-sm">
                Упражнения для улучшения осанки и укрепления шейного отдела. 
                Первые 5 упражнений доступны бесплатно. Для доступа к полному комплексу 
                требуется оплата <strong>100 рублей</strong>, которая также продлит ваш 
                доступ к фотодневнику на <strong>1 месяц</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Exercises List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4">
            <h2 className="text-xl font-bold">План упражнений</h2>
          </div>

          {/* Category: Осанка */}
          <div className="bg-white">
            {/* Category Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">🧘</div>
                <h3 className="text-lg font-semibold text-gray-900">Осанка</h3>
              </div>
            </div>

            {/* Exercises */}
            <div className="px-0 sm:px-6 pb-4 space-y-2">
              {demoExercises.map((exercise, index) => {
                const uniqueId = `demo-${exercise.id}`;
                const isExpanded = expandedExercises[uniqueId] || false;
                const isDone = completedExercises[uniqueId] || false;
                
                return (
                  <ExerciseItem
                    key={exercise.id}
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
            const uniqueId = `demo-${selectedExercise.id}`;
            handleExerciseCheck(selectedExercise, uniqueId);
          }}
          isDone={completedExercises[`demo-${selectedExercise.id}`] || false}
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
