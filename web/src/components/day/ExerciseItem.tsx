/**
 * Exercise Item Component
 * Displays individual exercise with checkbox and name
 * Clicking on the exercise opens a modal with details
 */

import type { Exercise } from '@/store/modules/day/slice';

interface ExerciseItemProps {
  exercise: Exercise;
  uniqueId: string;
  isDone: boolean;
  isChanging: boolean;
  onToggle: () => void;  // Opens modal with exercise details
  onCheck: () => void;   // Toggles exercise completion status
}

export default function ExerciseItem({
  exercise,
  uniqueId,
  isActive,
  isDone,
  isChanging,
  onToggle,
  onCheemProps) {
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

        {/
}
