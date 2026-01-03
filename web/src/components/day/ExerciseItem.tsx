/**
 * Exercise Item Component
 * Displays individual exercise with checkbox, name, and expand/collapse functionality
 */

import type { Exercise } from '@/store/modules/day/slice';

interface ExerciseItemProps {
  exercise: Exercise;
  uniqueId: string;
  isActive: boolean;
  isDone: boolean;
  isChanging: boolean;
  onToggle: () => void;
  onCheck: () => void;
  onDetailClick: () => void;
}

export default function ExerciseItem({
  exercise,
  uniqueId,
  isActive,
  isDone,
  isChanging,
  onToggle,
  onCheck,
  onDetailClick,
}: ExerciseItemProps) {
  const { exerciseName, marathonExerciseName, isNew, blockExercise } = exercise;

  // Determine background color
  const getBgColor = () => {
    if (blockExercise) {
      return 'bg-gray-100 border-gray-300';
    }
    if (isNew) {
      return 'bg-green-50 border-green-300';
    }
    if (isDone) {
      return 'bg-purple-50 border-purple-300';
    }
    return 'bg-white border-gray-200';
  };

  const getTextColor = () => {
    if (blockExercise) {
      return 'text-gray-400';
    }
    if (isDone) {
      return 'text-gray-500';
    }
    return 'text-gray-900';
  };

  return (
    <div
      className={`border-2 rounded-lg transition-all ${getBgColor()} ${
        blockExercise ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md'
      }`}
    >
      {/* Exercise Header */}
      <div className="flex items-center p-3 space-x-3">
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCheck();
          }}
          disabled={blockExercise || isChanging}
          className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
            blockExercise
              ? 'border-gray-300 cursor-not-allowed'
              : isDone
              ? 'bg-purple-600 border-purple-600'
              : 'border-gray-400 hover:border-purple-600'
          }`}
        >
          {isChanging ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
          ) : isDone ? (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : null}
        </button>

        {/* Exercise Name */}
        <button
          onClick={onToggle}
          disabled={blockExercise}
          className={`flex-1 text-left min-w-0 ${blockExercise ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <p className={`text-sm font-medium ${getTextColor()} truncate`}>
            <span className="font-bold">{exerciseName}</span> {marathonExerciseName}
          </p>
        </button>

        {/* "New" Badge */}
        {isNew && !blockExercise && (
          <span className="flex-shrink-0 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
            Новое
          </span>
        )}

        {/* Expand/Collapse Icon */}
        <button
          onClick={onToggle}
          disabled={blockExercise}
          className={`flex-shrink-0 text-gray-400 transition-transform ${
            isActive ? 'rotate-180' : ''
          } ${blockExercise ? 'cursor-not-allowed' : 'hover:text-gray-600'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Expanded Details */}
      {isActive && !blockExercise && (
        <div className="px-3 pb-3 border-t border-gray-200">
          <div className="pt-3 space-y-3">
            {/* Short Description */}
            {exercise.description && (
              <p className="text-sm text-gray-600 line-clamp-3">
                {exercise.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim()}
              </p>
            )}

            {/* Exercise Info */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {exercise.type && (
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                    />
                  </svg>
                  <span>{exercise.type === 'Video' ? 'Видео' : exercise.type === 'Reading' ? 'Теория' : 'Практика'}</span>
                </span>
              )}

              {exercise.duration > 0 && (
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{Math.floor(exercise.duration / 60)} мин</span>
                </span>
              )}

              {exercise.commentsCount > 0 && (
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  <span>{exercise.commentsCount} комментариев</span>
                </span>
              )}
            </div>

            {/* View Details Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDetailClick();
              }}
              className="w-full px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              Посмотреть детали
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
