/**
 * Exercise Page - Individual Exercise by ID
 * Dynamic route for /exercise/[exerciseId]
 */

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { EXERCISES_MAP, POSTURE_EXERCISES } from '@/data/exercisesData.generated';

/**
 * Get video embed URL based on platform
 */
function getVideoEmbedUrl(url: string): { embedUrl: string; type: 'iframe' | 'video' } {
  if (!url) return { embedUrl: '', type: 'iframe' };

  // Direct video file
  if (url.match(/\.(mp4|webm|ogg|mov)$/i)) {
    return { embedUrl: url, type: 'video' };
  }

  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be')
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : new URL(url).searchParams.get('v');
    return { embedUrl: `https://www.youtube.com/embed/${videoId}`, type: 'iframe' };
  }

  // Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return { embedUrl: `https://player.vimeo.com/video/${videoId}`, type: 'iframe' };
  }

  // RuTube
  if (url.includes('rutube.ru')) {
    const videoId = url.split('/video/')[1]?.split('/')[0] || url.split('/play/embed/')[1]?.split('?')[0];
    return { embedUrl: `https://rutube.ru/play/embed/${videoId}`, type: 'iframe' };
  }

  // VK Video
  if (url.includes('vk.com/video')) {
    const match = url.match(/video(-?\d+)_(\d+)/);
    if (match) {
      return { embedUrl: `https://vk.com/video_ext.php?oid=${match[1]}&id=${match[2]}`, type: 'iframe' };
    }
  }

  // Dzen (Яндекс Дзен)
  if (url.includes('dzen.ru')) {
    return { embedUrl: url, type: 'iframe' };
  }

  return { embedUrl: url, type: 'iframe' };
}

// Required for static export
export async function getStaticPaths() {
  // Generate paths for all exercises
  const paths = POSTURE_EXERCISES.map((exercise) => ({
    params: { exerciseId: exercise.id },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { exerciseId: string } }) {
  const exercise = EXERCISES_MAP[params.exerciseId];

  if (!exercise) {
    return { notFound: true };
  }

  return {
    props: {
      exercise,
    },
  };
}

export default function ExercisePage({ exercise: initialExercise }: { exercise: any }) {
  const router = useRouter();
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [contentItems, setContentItems] = useState<any[]>([]);
  const exercise = initialExercise; // Use static data directly

  // Build content items from exerciseContents
  useEffect(() => {
    if (!exercise) return;

    const exerciseContents = exercise.exerciseContents || [];
    
    const items = exerciseContents
      .filter((c: any) => c.type === 'video' || c.type === 'image')
      .map((c: any) => {
        const item: any = {
          id: c.id || Math.random().toString(),
          type: c.type,
          contentPath: c.contentPath,
          loadError: false
        };

        if (c.type === 'video') {
          const { embedUrl, type: videoType } = getVideoEmbedUrl(c.contentPath);
          item.embedUrl = embedUrl;
          item.videoType = videoType;
        }

        return item;
      });

    setContentItems(items);
    setCurrentContentIndex(0);
  }, [exercise]);


  // Get exercise data
  useEffect(() => {
    if (exercise) {
      setIsDone(exercise.isDone || false);
      // Mock comments
      setComments([
        {
          id: '1',
          userName: 'Ирина М.',
          userAvatar: 'https://ui-avatars.com/api/?name=Irina+M&background=ec4899&color=fff',
          text: 'Делаю это упражнение каждое утро. Главное не торопиться и делать все плавно.',
          date: '27 декабря 2025',
        },
      ]);
    }
  }, [exercise]);

  const handleToggleCompletion = () => {
    setIsDone(!isDone);
  };

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now().toString(),
      userName: 'Вы',
      userAvatar: 'https://ui-avatars.com/api/?name=User&background=8b5cf6&color=fff',
      text: newComment,
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;

    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch((err) => {
        console.error('Error entering fullscreen:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Упражнение не найдено</h2>
          <button
            onClick={() => router.push('/exercises')}
            className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-3 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              aria-label="Назад"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex-1 text-center px-4">
              <h1 className="text-xl font-bold">
                <span className="font-bold">{exercise.exerciseName}</span>
                {exercise.marathonExerciseName && (
                  <span className="font-normal"> {exercise.marathonExerciseName}</span>
                )}
              </h1>
            </div>

            <button
              onClick={handleToggleCompletion}
              className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                isDone 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              aria-label={isDone ? 'Отметить как невыполненное' : 'Отметить как выполненное'}
            >
              <svg className="w-6 h-6" fill={isDone ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Video/Image Carousel */}
        {contentItems.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <div className="w-full max-w-[400px] mx-auto">
              <div className="relative w-full">
                {/* Hint for images (GIFs) - overlaid on content */}
                {contentItems[currentContentIndex]?.type === 'image' && (
                  <div className="absolute top-4 left-4 right-4 z-10">
                    <div className="bg-purple-600/95 text-white text-sm px-4 py-2.5 rounded-lg text-center shadow-lg">
                      <p className="font-semibold mb-1">💡 Основное движение</p>
                      <p className="text-xs opacity-90">
                        Ознакомьтесь с видео инструкцией{contentItems.length > 1 && ', нажмите на стрелочку вправо'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Current Content */}
                {contentItems[currentContentIndex] && (
                  <div key={contentItems[currentContentIndex].id} className="w-full">
                    {contentItems[currentContentIndex].type === 'video' ? (
                      contentItems[currentContentIndex].videoType === 'video' ? (
                        <video
                          src={contentItems[currentContentIndex].embedUrl}
                          controls
                          controlsList="nodownload nofullscreen noremoteplayback"
                          disablePictureInPicture
                          className="w-full aspect-square object-contain bg-gray-100 rounded-lg"
                          playsInline
                          onContextMenu={(e) => e.preventDefault()}
                        />
                      ) : (
                        <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                          <iframe
                            src={contentItems[currentContentIndex].embedUrl}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )
                    ) : (
                      <img
                        src={contentItems[currentContentIndex].contentPath}
                        alt={exercise.exerciseName}
                        className="w-full aspect-square object-contain bg-gray-100 rounded-lg"
                      />
                    )}
                  </div>
                )}

                {/* Navigation Arrows */}
                {contentItems.length > 1 && (
                  <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex justify-between px-2 pointer-events-none">
                    <button
                      onClick={() => setCurrentContentIndex(Math.max(0, currentContentIndex - 1))}
                      disabled={currentContentIndex === 0}
                      className={`w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-all pointer-events-auto ${
                        currentContentIndex === 0 
                          ? 'opacity-30 cursor-not-allowed' 
                          : 'hover:bg-white hover:scale-110'
                      }`}
                      aria-label="Предыдущее"
                    >
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <button
                      onClick={() => setCurrentContentIndex(Math.min(contentItems.length - 1, currentContentIndex + 1))}
                      disabled={currentContentIndex === contentItems.length - 1}
                      className={`w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-all pointer-events-auto ${
                        currentContentIndex === contentItems.length - 1
                          ? 'opacity-30 cursor-not-allowed'
                          : 'hover:bg-white hover:scale-110'
                      }`}
                      aria-label="Следующее"
                    >
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Pagination Dots */}
                {contentItems.length > 1 && (
                  <div className="flex justify-center space-x-2 mt-4">
                    {contentItems.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentContentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentContentIndex
                            ? 'bg-purple-600 w-6'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Перейти к ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Description Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Описание</h2>
          <div 
            className="prose prose-purple max-w-none"
            dangerouslySetInnerHTML={{ __html: exercise.description }}
          />
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Комментарии ({comments.length})
          </h2>

          {/* Add Comment */}
          <div className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Напишите комментарий..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
            />
            <button
              onClick={handlePostComment}
              disabled={!newComment.trim()}
              className="mt-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Отправить
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Комментариев пока нет. Будьте первым!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={comment.userAvatar}
                    alt={comment.userName}
                    className="w-12 h-12 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{comment.userName}</h3>
                      <span className="text-sm text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
