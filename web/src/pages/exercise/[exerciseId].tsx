/**
 * Exercise Page - Individual Exercise by ID
 * Dynamic route for /exercise/[exerciseId]
 */

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

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

// Static exercise data - will be replaced with API call
const EXERCISE_DATA: Record<string, any> = {
  'a8d8a1f3-6765-4031-bbb8-cf0baf47f7af': {
    id: 'a8d8a1f3-6765-4031-bbb8-cf0baf47f7af',
    marathonExerciseId: 'a8d8a1f3-6765-4031-bbb8-cf0baf47f7af',
    exerciseName: 'Стоечка',
    marathonExerciseName: 'у стены',
    description: `
      <h3>Стоечка у стены</h3>
      <p>Это упражнение - царь упражнений для осанки!</p>
      <p>Это незаменимый прием для возвращения головы в здоровое положение. Упражнение статическое, качается тягой, однако лучше сначала попробовать, прежде, чем высчитать такие суждения.😁</p>
      <p>Первый раз попробуй выдержать минуту, затем ты можешь постепенно увеличивать продолжительность, в идеале до 10 минут в день. 💪</p>
      <p><strong>Что дает нам стоечка у стены:</strong></p>
      <ul>
        <li>Улучшается статика шеи.</li>
        <li>Шея становится длинной и сильной.</li>
        <li>Позвоночник вспоминает свое выпрямленное естественное положение.</li>
        <li>Потребление кислорода увеличивается, поскольку в этой позе ваши легкие могут поглощать больше воздуха.</li>
        <li>Нервная система укрепляется.</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 300,
    type: 'Practice' as const,
    isDone: false,
    isNew: false,
    blockExercise: false,
    commentsCount: 0,
  },
};

export default function ExercisePage() {
  const router = useRouter();
  const { exerciseId } = router.query;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDone, setIsDone] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  // Get exercise data
  const exercise = exerciseId && typeof exerciseId === 'string' 
    ? EXERCISE_DATA[exerciseId] 
    : null;

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

  const { embedUrl, type: videoType } = getVideoEmbedUrl(exercise.videoUrl);

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
        {/* Video Section */}
        {embedUrl && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            <div className="aspect-square max-w-[400px] mx-auto bg-black">
              {videoType === 'video' ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  controls
                  playsInline
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                >
                  <source src={embedUrl} type="video/mp4" />
                  Ваш браузер не поддерживает видео.
                </video>
              ) : (
                <iframe
                  className="w-full h-full"
                  src={embedUrl}
                  title={`${exercise.exerciseName} ${exercise.marathonExerciseName || ''}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
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
