import React from 'react';
import { translations, type LanguageCode } from '../../utils/i18n';

interface MyCourseCardProps {
  course: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    callToAction?: string;
    imageUrl: string;
    progress: number;
    totalDays: number;
    completedDays: number;
    status: string;
    isFree: boolean;
    isDemo?: boolean;
    cost?: number;
    productType?: string;
    currency?: string;
  };
  language: LanguageCode;
  onStart: () => void;
  onLearnMore: () => void;
  isLoading?: boolean;
}

const MyCourseCard: React.FC<MyCourseCardProps> = ({ course, language, onStart, onLearnMore, isLoading = false }) => {
  const t = translations[language];
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100">
      {/* Header с иконкой */}
      <div className="relative h-48 bg-gradient-to-br from-[#7B8CDE]/20 to-[#9999C3]/20 flex items-center justify-center">
        {/* Изображение курса: круглое для Marathon, квадратное для Course */}
        <div className={`w-32 h-32 bg-white flex items-center justify-center shadow-lg overflow-hidden ${
          course.productType?.toLowerCase().includes('marathon') ? 'rounded-full' : 'rounded-[20px]'
        }`}>
          {course.imageUrl ? (
            <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-6xl">🧘‍♀️</div>
          )}
        </div>
        {course.isDemo && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            DEMO COURSE
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Subtitle Badge */}
        {course.subtitle && (
          <div className="inline-block mb-3">
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              {course.subtitle}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">
          {course.title}
        </h3>

        {/* Cost */}
        {!course.isFree && course.cost && (
          <p className="text-sm text-gray-700 font-medium mb-4">
            {t.subscriptionsFrom} <span className="font-bold text-[#1e3a8a]">{course.cost} {course.currency || '₽'}</span>
          </p>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-600 font-medium">
              {t.progress}: {course.completedDays} {t.of} {course.totalDays} {t.days}
            </span>
            <span className="text-xs font-bold text-[#1e3a8a]">
              {course.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#7B8CDE] to-[#9999C3] h-2 rounded-full transition-all duration-500"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onStart}
            disabled={isLoading}
            className={`flex-1 bg-gradient-to-r from-[#7B8CDE] to-[#9999C3] text-white font-bold py-3 px-4 rounded-full shadow-lg transition-all duration-300 text-sm uppercase flex items-center justify-center ${
              isLoading 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:from-[#6a7acc] hover:to-[#8888b2] hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Загрузка...
              </>
            ) : (
              t.start
            )}
          </button>
          <button
            onClick={onLearnMore}
            disabled={isLoading}
            className={`flex-1 bg-white border-2 border-[#7B8CDE] text-[#7B8CDE] font-bold py-3 px-4 rounded-full transition-all duration-300 text-sm uppercase ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#7B8CDE]/5'
            }`}
          >
            {t.learnMore}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyCourseCard;
