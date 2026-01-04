/**
 * Exercises Page - All Exercises from New Backend
 * Loads exercises from api-rejuvena.duckdns.org
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ExerciseItem from '@/components/day/ExerciseItem';
import ExerciseDetailModal from '@/components/day/ExerciseDetailModal';
import type { Exercise } from '@/store/modules/day/slice';

// Always use new API for exercises page
const NEW_API_URL = 'https://api-rejuvena.duckdns.org';

interface ExerciseFromAPI {
  _id: string;
  title: string;
  description: string;
  content?: string;
  duration?: string;
  carouselMedia: Array<{
    type: string;
    url: string;
    filename: string;
    order: number;
  }>;
  tags: Array<{
    _id: string;
    name: string;
    slug: string;
    color: string;
  }>;
  category?: string;
  order: number;
}

// Extend Exercise with missing fields
interface ExtendedExercise extends Omit<Exercise, 'marathonExerciseId' | 'description' | 'duration' | 'type' | 'status' | 'commentsCount' | 'isDone' | 'isNew'> {
  exerciseDescription?: string;
  exerciseContents?: Array<{
    id: string;
    type: string;
    contentPath: string;
    order: number;
    isActive: boolean;
    videoServer: string;
  }>;
  tags?: string[];
  category?: string;
}

export default function ExercisesPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<ExtendedExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedExercises, setExpandedExercises] = useState<Record<string, boolean>>({});
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [selectedExercise, setSelectedExercise] = useState<ExtendedExercise | null>(null);
  const [modalMounted, setModalMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mount modal after hydration
  useEffect(() => {
    setModalMounted(true);
  }, []);

  // Load exercises from API
  useEffect(() => {
    const loadExercises = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${NEW_API_URL}/api/exercises/public`);
        
        if (!response.ok) {
          throw new Error(`Failed to load exercises: ${response.statusText}`);
        }
        
        const data: ExerciseFromAPI[] = await response.json();
        
        // Transform API data to match Exercise interface
        const transformedExercises: ExtendedExercise[] = data.map((ex) => ({
          id: ex._id,
          exerciseName: ex.title,
          marathonExerciseName: ex.duration || '',
          exerciseDescription: ex.content || ex.description || '',
          blockExercise: false,
          order: ex.order,
          exerciseContents: ex.carouselMedia.map((media) => ({
            id: media.url,
            type: media.type,
            contentPath: media.url,
            order: media.order,
            isActive: true,
            videoServer: '',
          })),
          tags: ex.tags.map(tag => tag.name),
          category: ex.category || 'Общие',
        }));

        setExercises(transformedExercises);
        setError(null);
      } catch (err) {
        console.error('Error loading exercises:', err);
        setError(err instanceof Error ? err.message : 'Failed to load exercises');
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

  const handleExerciseCheck = (exercise: ExtendedExercise, uniqueId: string) => {
    setCompletedExercises(prev => ({
      ...prev,
      [uniqueId]: !prev[uniqueId],
    }));
  };

  const handleExerciseClick = (exercise: ExtendedExercise) => {
    setSelectedExercise(exercise);
  };

  const handleExerciseDetailClick = (exercise: ExtendedExercise) => {
    router.push(`/exercise/${exercise.id}`);
  };

  // Group exercises by category
  const exercisesByCategory = exercises.reduce((acc, exercise) => {
    const category = exercise.category || 'Общие';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(exercise);
    return acc;
  }, {} as Record<string, ExtendedExercise[]>);

  const categories = Object.keys(exercisesByCategory);
  const filteredExercises = selectedCategory === 'all' 
    ? exercises 
    : exercisesByCategory[selectedCategory] || [];

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
            
            <h1 className="text-xl font-bold flex-1 text-center">Все упражнения</h1>
            
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка упражнений...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ошибка загрузки</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        ) : (
          <>
            {/* Category Filter */}
            <div className="mb-6 bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Все ({exercises.length})
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category} ({exercisesByCategory[category].length})
                  </button>
                ))}
              </div>
            </div>

            {/* Exercises List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4">
                <h2 className="text-xl font-bold">
                  {selectedCategory === 'all' 
                    ? `Все упражнения (${exercises.length})`
                    : `${selectedCategory} (${filteredExercises.length})`
                  }
                </h2>
              </div>

              <div className="px-0 sm:px-6 pb-4 space-y-2">
                {filteredExercises.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Упражнения не найдены
                  </div>
                ) : (
                  filteredExercises.map((exercise, index) => {
                    const uniqueId = `exercise-${exercise.id || index}`;
                    const isExpanded = expandedExercises[uniqueId] || false;
                    const isDone = completedExercises[uniqueId] || false;
                    
                    return (
                      <ExerciseItem
                        key={exercise.id || index}
                        exercise={exercise as any}
                        uniqueId={uniqueId}
                        isActive={isExpanded}
                        isDone={isDone}
                        isChanging={false}
                        onToggle={() => handleExerciseToggle(uniqueId)}
                        onCheck={() => handleExerciseCheck(exercise, uniqueId)}
                        onDetailClick={() => handleExerciseClick(exercise)}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Exercise Detail Modal */}
      {modalMounted && selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise as any}
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onCheckboxChange={() => {
            const uniqueId = `exercise-${selectedExercise.id}`;
            handleExerciseCheck(selectedExercise, uniqueId);
          }}
          isDone={completedExercises[`exercise-${selectedExercise.id}`] || false}
        />
      )}
    </div>
  );
}
