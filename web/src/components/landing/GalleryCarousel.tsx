import React, { useState } from 'react';

interface GalleryImage {
  url: string;
  caption?: string;
  order: number;
}

interface GalleryCarouselProps {
  images: GalleryImage[];
  apiBaseUrl?: string;
}

const GalleryCarousel: React.FC<GalleryCarouselProps> = ({ 
  images, 
  apiBaseUrl = 'https://api-rejuvena.duckdns.org' 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Сортируем изображения по order
  const sortedImages = [...images].sort((a, b) => a.order - b.order);
  
  // Функция для формирования полного URL
  const getImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${apiBaseUrl}${url}`;
  };
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sortedImages.length);
  };
  
  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
  };
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  if (!sortedImages || sortedImages.length === 0) {
    return null;
  }
  
  // Получаем 3 изображения для отображения (предыдущее, текущее, следующее)
  const getPrevIndex = () => (currentIndex - 1 + sortedImages.length) % sortedImages.length;
  const getNextIndex = () => (currentIndex + 1) % sortedImages.length;
  
  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-center gap-4">
        {/* Предыдущее изображение (миниатюра слева) */}
        <button
          onClick={goToPrev}
          className="hidden md:block w-32 h-48 flex-shrink-0 relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer opacity-60 hover:opacity-100"
        >
          <img
            src={getImageUrl(sortedImages[getPrevIndex()].url)}
            alt={sortedImages[getPrevIndex()].caption || `Фото ${getPrevIndex() + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </button>
        
        {/* Основное изображение (центр) */}
        <div className="relative flex-1 max-w-2xl">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={getImageUrl(sortedImages[currentIndex].url)}
              alt={sortedImages[currentIndex].caption || `Фото ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Подпись к фото */}
            {sortedImages[currentIndex].caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <p className="text-white text-lg text-center">
                  {sortedImages[currentIndex].caption}
                </p>
              </div>
            )}
          </div>
          
          {/* Кнопки навигации (стрелки) */}
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all hover:scale-110"
            aria-label="Предыдущее фото"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all hover:scale-110"
            aria-label="Следующее фото"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Индикаторы (точки) */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {sortedImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-purple-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Перейти к фото ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Следующее изображение (миниатюра справа) */}
        <button
          onClick={goToNext}
          className="hidden md:block w-32 h-48 flex-shrink-0 relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer opacity-60 hover:opacity-100"
        >
          <img
            src={getImageUrl(sortedImages[getNextIndex()].url)}
            alt={sortedImages[getNextIndex()].caption || `Фото ${getNextIndex() + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </button>
      </div>
      
      {/* Счетчик фотографий */}
      <div className="text-center mt-12 text-gray-600">
        {currentIndex + 1} / {sortedImages.length}
      </div>
    </div>
  );
};

export default GalleryCarousel;
