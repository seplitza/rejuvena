import React, { useState } from 'react';

interface VideoBlock {
  title?: string;
  videoUrl: string;
  poster?: string;
  order: number;
}

interface VideoCarouselProps {
  videos: VideoBlock[];
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ videos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!videos || videos.length === 0) return null;
  
  // Сортируем по order
  const sortedVideos = [...videos].sort((a, b) => a.order - b.order);
  const currentVideo = sortedVideos[currentIndex];
  
  // Определяем тип видео
  const isYouTube = currentVideo.videoUrl.includes('youtube.com') || currentVideo.videoUrl.includes('youtu.be');
  const isVimeo = currentVideo.videoUrl.includes('vimeo.com');
  const isVK = currentVideo.videoUrl.includes('vk.com') || currentVideo.videoUrl.includes('vkvideo.ru');
  
  // Конвертируем URL в embed формат
  const getEmbedUrl = (url: string): string => {
    if (isYouTube) {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (isVimeo) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
    if (isVK) {
      // VK видео форматы:
      // https://vk.com/video-XXXX_YYYY
      // https://vk.com/video_ext.php?oid=-XXXX&id=YYYY (уже embed)
      // https://vkvideo.ru/video_ext.php?oid=-XXXX&id=YYYY (уже embed)
      
      if (url.includes('video_ext.php')) {
        // Уже в формате embed
        return url;
      }
      
      // Парсим video-XXXX_YYYY формат
      const match = url.match(/video(-?\d+)_(\d+)/);
      if (match) {
        const oid = match[1];
        const id = match[2];
        return `https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=2`;
      }
    }
    return url;
  };
  
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? sortedVideos.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === sortedVideos.length - 1 ? 0 : prev + 1));
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      {currentVideo.title && (
        <h3 className="text-2xl font-bold text-center mb-6">{currentVideo.title}</h3>
      )}
      
      <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl aspect-video">
        {isYouTube || isVimeo || isVK ? (
          <iframe
            src={getEmbedUrl(currentVideo.videoUrl)}
            title={currentVideo.title || `Видео ${currentIndex + 1}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            controls
            poster={currentVideo.poster}
            className="w-full h-full"
          >
            <source src={currentVideo.videoUrl} type="video/mp4" />
            Ваш браузер не поддерживает видео.
          </video>
        )}
        
        {/* Навигация (только если больше 1 видео) */}
        {sortedVideos.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition"
              aria-label="Предыдущее видео"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition"
              aria-label="Следующее видео"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Индикаторы */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {sortedVideos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition ${
                    index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                  aria-label={`Перейти к видео ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Счетчик (только если больше 1 видео) */}
      {sortedVideos.length > 1 && (
        <p className="text-center mt-4 text-gray-600">
          Видео {currentIndex + 1} из {sortedVideos.length}
        </p>
      )}
    </div>
  );
};

export default VideoCarousel;
