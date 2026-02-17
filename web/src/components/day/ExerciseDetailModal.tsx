/**
 * Exercise Detail Modal Component
 * Shows full exercise details with video carousel and description
 * Features:
 * - Square video player (mobile-first)
 * - Multi-video carousel with navigation
 * - Error handling for unavailable videos
 * - Compact header
 * - Collapsible comments
 */

import { useEffect, useState, useRef } from 'react';
import type { Exercise } from '@/store/modules/day/slice';
import Image from 'next/image';

interface ExerciseDetailModalProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
  onCheckboxChange?: (newStatus: boolean) => void;
  isDone?: boolean;
}

interface ContentItem {
  id: string;
  type: 'video' | 'image';
  contentPath: string;
  embedUrl?: string;
  videoType?: 'iframe' | 'video';
  loadError?: boolean;
}

/**
 * Get video embed URL based on platform
 * Supports: YouTube, Vimeo, RuTube, VK Video, Dzen, direct video files
 */
function getVideoEmbedUrl(url: string): { embedUrl: string; type: 'iframe' | 'video' } {
  if (!url) return { embedUrl: '', type: 'iframe' };

  // Direct video file (mp4, webm, etc.)
  if (url.match(/\.(mp4|webm|ogg|mov)$/i)) {
    return { embedUrl: url, type: 'video' };
  }

  // Already embed URL - add privacy parameters if not present
  if (url.includes('player.vimeo.com/video/')) {
    const videoId = url.split('player.vimeo.com/video/')[1]?.split('?')[0];
    return { 
      embedUrl: `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&dnt=1&controls=1&transparent=0`, 
      type: 'iframe' 
    };
  }
  
  if (url.includes('youtube.com/embed/')) {
    const videoId = url.split('youtube.com/embed/')[1]?.split('?')[0];
    return { 
      embedUrl: `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&fs=1&controls=1&disablekb=0&iv_load_policy=3&cc_load_policy=0&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`, 
      type: 'iframe' 
    };
  }
  
  if (url.includes('rutube.ru/play/embed/') ||
      url.includes('vk.com/video_ext.php') ||
      url.includes('dzen.ru/embed/')) {
    return { embedUrl: url, type: 'iframe' };
  }

  // YouTube - hide branding and related videos
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be')
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : new URL(url).searchParams.get('v');
    return { 
      embedUrl: `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&fs=1&controls=1&disablekb=0&iv_load_policy=3&cc_load_policy=0&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`, 
      type: 'iframe' 
    };
  }

  // Vimeo - hide title, author, avatar
  if (url.includes('vimeo.com') && !url.includes('player.vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return { 
      embedUrl: `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&dnt=1&controls=1&transparent=0`, 
      type: 'iframe' 
    };
  }

  // RuTube
  if (url.includes('rutube.ru')) {
    let videoId = url.split('rutube.ru/video/')[1]?.split('?')[0];
    if (!videoId) {
      videoId = url.split('rutube.ru/play/embed/')[1]?.split('?')[0];
    }
    return { embedUrl: `https://rutube.ru/play/embed/${videoId}`, type: 'iframe' };
  }

  // VK Video
  if (url.includes('vk.com/video')) {
    const match = url.match(/video(-?\d+)_(\d+)/);
    if (match) {
      const [, oid, id] = match;
      return { embedUrl: `https://vk.com/video_ext.php?oid=${oid}&id=${id}`, type: 'iframe' };
    }
  }

  // Dzen (Яндекс.Дзен)
  if (url.includes('dzen.ru')) {
    const videoId = url.split('dzen.ru/video/watch/')[1]?.split('?')[0] || 
                    url.split('dzen.ru/embed/')[1]?.split('?')[0];
    if (videoId) {
      return { embedUrl: `https://dzen.ru/embed/${videoId}`, type: 'iframe' };
    }
  }

  // Telegram video
  if (url.includes('t.me')) {
    return { embedUrl: url, type: 'iframe' };
  }

  // Fallback - try as iframe
  return { embedUrl: url, type: 'iframe' };
}

export default function ExerciseDetailModal({ exercise, isOpen, onClose, onCheckboxChange, isDone }: ExerciseDetailModalProps) {
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  
  // Auto-completion tracking
  const [firstVideoWatched, setFirstVideoWatched] = useState(false);
  const [descriptionScrolled, setDescriptionScrolled] = useState(false);
  const [videoTimerSeconds, setVideoTimerSeconds] = useState(0);
  
  // Ref for scrollable content container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Check if content needs scrolling - auto-complete if not
  useEffect(() => {
    if (!isOpen || !scrollContainerRef.current) return;
    
    // Small delay to ensure content is rendered
    const timeoutId = setTimeout(() => {
      const container = scrollContainerRef.current;
      if (!container) return;
      
      const needsScroll = container.scrollHeight > container.clientHeight + 10; // 10px threshold
      
      if (!needsScroll && !descriptionScrolled) {
        console.log('📜 Content is short, no scroll needed - auto-completing description');
        setDescriptionScrolled(true);
      }
    }, 300); // Wait for content to render
    
    return () => clearTimeout(timeoutId);
  }, [isOpen, exercise, contentItems]); // Re-check when exercise or content changes

  // Build content items from exerciseContents
  useEffect(() => {
    if (!exercise) return;

    const exerciseData = exercise as any;
    const exerciseContents = [...(exerciseData.exerciseContents || [])].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    
    let items: ContentItem[] = exerciseContents
      .filter((c: any) => c.type === 'video' || c.type === 'image')
      .map((c: any) => {
        const item: ContentItem = {
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

    if (items.length === 0) {
      const fallbackImageUrl = exerciseData.imageUrl || exercise.imageUrl;
      const fallbackVideoUrl = exerciseData.videoUrl || exercise.videoUrl;

      if (fallbackImageUrl) {
        items.push({
          id: 'fallback-image',
          type: 'image',
          contentPath: fallbackImageUrl,
          loadError: false,
        });
      }

      if (fallbackVideoUrl) {
        const { embedUrl, type: videoType } = getVideoEmbedUrl(fallbackVideoUrl);
        items.push({
          id: 'fallback-video',
          type: 'video',
          contentPath: fallbackVideoUrl,
          embedUrl,
          videoType,
          loadError: false,
        });
      }
    }

    setContentItems(items);
    setCurrentContentIndex(0);
    
    // Reset auto-completion tracking when exercise changes
    setFirstVideoWatched(false);
    setDescriptionScrolled(false);
    setVideoTimerSeconds(0);
  }, [exercise]);

  // Auto-complete exercise when video watched and description scrolled
  useEffect(() => {
    // Only auto-complete if exercise is not done yet and callback exists
    if (isDone || !onCheckboxChange) return;

    const exerciseData = exercise as any;
    // Check all possible description sources (same logic as in render)
    const descriptionFromExercise = exerciseData.exerciseDescription || '';
    const descriptionFromLegacy = exercise.description || '';
    const descriptionFromContent = exerciseData.content || '';
    const descriptionFromMarathonExercise = exerciseData.marathonExerciseDescription || '';
    
    const hasDescription = !!(
      descriptionFromExercise || 
      descriptionFromLegacy || 
      descriptionFromContent || 
      descriptionFromMarathonExercise
    );
    
    const hasVideo = contentItems.length > 0 && contentItems[0].type === 'video';

    // Check completion conditions
    const videoConditionMet = !hasVideo || firstVideoWatched;
    const descriptionConditionMet = !hasDescription || descriptionScrolled;

    // Auto-complete if both conditions met
    if (videoConditionMet && descriptionConditionMet) {
      console.log('✅ Auto-completing exercise: video watched and description scrolled');
      onCheckboxChange(true);
    }
  }, [firstVideoWatched, descriptionScrolled, isDone, onCheckboxChange, exercise, contentItems]);

  // Timer-based video completion (15 seconds = video considered watched)
  useEffect(() => {
    if (!isOpen || firstVideoWatched) return;
    
    const hasVideo = contentItems.length > 0 && contentItems[0].type === 'video';
    if (!hasVideo) return;
    
    const timer = setInterval(() => {
      setVideoTimerSeconds(prev => {
        const next = prev + 1;
        if (next >= 15) {
          console.log('🎥 Video timer reached 15s - marking as watched');
          setFirstVideoWatched(true);
          clearInterval(timer);
        }
        return next;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isOpen, firstVideoWatched, contentItems]);

  // Listen for iframe video completion (YouTube/Vimeo/RuTube postMessage API)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // YouTube iframe API - sends {event: 'onStateChange', info: 0} when ended
      if (event.data && typeof event.data === 'string') {
        try {
          const data = JSON.parse(event.data);
          if (currentContentIndex === 0) {
            // YouTube: onStateChange with info=0 means ended
            if (data.event === 'onStateChange' && data.info === 0) {
              console.log('🎥 YouTube video ended (onStateChange=0)');
              setFirstVideoWatched(true);
            }
            // YouTube: also check for 'ended' event name
            if (data.event === 'ended') {
              console.log('🎥 Video ended (via postMessage)');
              setFirstVideoWatched(true);
            }
          }
        } catch (e) {
          // Not JSON, ignore
        }
      }
      
      // Vimeo iframe API
      if (event.data && typeof event.data === 'object') {
        if (currentContentIndex === 0) {
          if (event.data.event === 'ended' || event.data.event === 'finish') {
            console.log('🎥 Vimeo video ended (via postMessage)');
            setFirstVideoWatched(true);
          }
          // RuTube iframe API
          if (event.data.type === 'player:ended') {
            console.log('🎥 RuTube video ended (via postMessage)');
            setFirstVideoWatched(true);
          }
        }
      }
    };

    if (isOpen) {
      window.addEventListener('message', handleMessage);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isOpen, currentContentIndex]);

  // Handle first video completion
  const handleVideoEnded = () => {
    if (currentContentIndex === 0) {
      console.log('🎥 First video watched to end');
      setFirstVideoWatched(true);
    }
  };

  // Handle description scroll to check if user reached the end
  const handleDescriptionScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrolledToBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50; // 50px threshold
    
    if (scrolledToBottom && !descriptionScrolled) {
      console.log('📜 Description scrolled to end');
      setDescriptionScrolled(true);
    }
  };

  // Don't render if not open or no exercise data
  if (!isOpen || !exercise) {
    return null;
  }

  const exerciseData = exercise as any;
  const exerciseName = exercise.exerciseName || '';
  const marathonExerciseName = exercise.marathonExerciseName || '';
  const descriptionFromExercise = exerciseData.exerciseDescription || '';
  const descriptionFromLegacy = exercise.description || '';
  const descriptionFromContent = exerciseData.content || '';
  const descriptionFromMarathonExercise = exerciseData.marathonExerciseDescription || '';
  let description = descriptionFromLegacy.length > descriptionFromExercise.length
    ? descriptionFromLegacy
    : descriptionFromExercise;
  if (descriptionFromContent.length > description.length) {
    description = descriptionFromContent;
  }
  if (descriptionFromMarathonExercise.length > description.length) {
    description = descriptionFromMarathonExercise;
  }
  
  // Normalize emoji in description - fix multiple character emoji display bug
  if (description) {
    description = description.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}](?:\u{FE0F}|\u{200D}[\u{1F3FB}-\u{1F3FF}]?)?/gu, (match: string) => {
      // Remove variation selectors and zero-width joiners that cause duplication
      return match.replace(/[\uFE0F\u200D]/g, '');
    });
  }

  const hasHtmlDescription = /<\/?[a-z][\s\S]*>/i.test(description);
  
  const type = exercise.type || '';
  const duration = exercise.duration || 0;
  const isNewExercise = !!exercise.isNew;
  
  // Check completion requirements for new exercises
  const hasDescription = !!(
    descriptionFromExercise || 
    descriptionFromLegacy || 
    descriptionFromContent || 
    descriptionFromMarathonExercise
  );
  const hasVideo = contentItems.length > 0 && contentItems[0].type === 'video';
  const videoRequired = isNewExercise && hasVideo;
  const descriptionRequired = isNewExercise && hasDescription;
  const canCheck = !isNewExercise || ((!hasVideo || firstVideoWatched) && (!hasDescription || descriptionScrolled));

  const availableContent = contentItems.filter(item => !item.loadError);
  const currentContent = availableContent[currentContentIndex];

  const handlePrev = () => {
    setCurrentContentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentContentIndex((prev) => Math.min(availableContent.length - 1, prev + 1));
  };

  const handleContentError = (index: number) => {
    setContentItems(prev => prev.map((item, i) => 
      i === index ? { ...item, loadError: true } : item
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm md:p-4">
      <div className="relative w-full h-full md:max-w-3xl md:max-h-[90vh] md:h-auto bg-white md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Compact Header */}
        <div 
          className="text-white p-3 md:p-4 flex-shrink-0"
          style={{ backgroundImage: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-2">
              <h2 className="text-lg md:text-xl font-bold mb-0.5">{exerciseName}</h2>
              {marathonExerciseName && (
                <p className="text-sm opacity-90">{marathonExerciseName}</p>
              )}
              
              {/* Exercise Meta */}
              {(type || duration > 0) && (
                <div className="flex items-center space-x-2 mt-2 text-xs">
                  {type && (
                    <span className="flex items-center space-x-1 bg-white/20 px-2 py-0.5 rounded-full">
                      <span>{type === 'Video' ? 'Видео' : type === 'Reading' ? 'Теория' : 'Практика'}</span>
                    </span>
                  )}
                  
                  {duration > 0 && (
                    <span className="flex items-center space-x-1 bg-white/20 px-2 py-0.5 rounded-full">
                      <span>{Math.floor(duration / 60)} мин</span>
                    </span>
                  )}
                </div>
              )}
              
              {/* Progress indicator for new exercises */}
              {isNewExercise && !isDone && (videoRequired || descriptionRequired) && (
                <div className="mt-3 text-xs bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="font-semibold mb-1.5 flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Для завершения:
                  </div>
                  <div className="space-y-1.5">
                    {videoRequired && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          {firstVideoWatched ? (
                            <>
                              <svg className="w-3 h-3 text-green-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="line-through opacity-70">Видео просмотрено</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3 text-yellow-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                              </svg>
                              <span>Досмотрите видео{videoTimerSeconds > 0 ? ` (${15 - videoTimerSeconds}с)` : ''}</span>
                            </>
                          )}
                        </div>
                        {!firstVideoWatched && videoTimerSeconds >= 5 && (
                          <button 
                            onClick={() => setFirstVideoWatched(true)}
                            className="text-[10px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-full transition-colors"
                          >
                            Просмотрено ✓
                          </button>
                        )}
                      </div>
                    )}
                    {descriptionRequired && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          {descriptionScrolled ? (
                            <>
                              <svg className="w-3 h-3 text-green-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="line-through opacity-70">Текст прочитан</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3 text-yellow-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                              </svg>
                              <span>Дочитайте описание</span>
                            </>
                          )}
                        </div>
                        {!descriptionScrolled && (
                          <button 
                            onClick={() => setDescriptionScrolled(true)}
                            className="text-[10px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-full transition-colors"
                          >
                            Прочитано ✓
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Checkbox Button with Tooltip */}
            {onCheckboxChange && (
              <div className="flex-shrink-0 mr-2 relative group">
                <button
                  onClick={() => {
                    if (!canCheck) return;
                    onCheckboxChange(!isDone);
                  }}
                  disabled={!canCheck}
                  className={`w-6 h-6 rounded-md border-2 transition-colors flex items-center justify-center ${
                    canCheck 
                      ? 'border-white/50 hover:border-white cursor-pointer' 
                      : 'border-white/30 cursor-not-allowed opacity-50'
                  }`}
                  aria-label={isDone ? 'Отметить как невыполненное' : 'Отметить как выполненное'}
                >
                  {isDone && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                
                {/* Tooltip for disabled state */}
                {!canCheck && isNewExercise && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    <div className="font-semibold mb-2">📋 Для завершения упражнения:</div>
                    <div className="space-y-1.5">
                      {videoRequired && (
                        <div className="flex items-start space-x-2">
                          {firstVideoWatched ? (
                            <span className="text-green-400 flex-shrink-0">✓</span>
                          ) : (
                            <span className="text-yellow-400 flex-shrink-0">○</span>
                          )}
                          <span className={firstVideoWatched ? 'line-through opacity-60' : ''}>
                            Досмотрите видео до конца
                          </span>
                        </div>
                      )}
                      {descriptionRequired && (
                        <div className="flex items-start space-x-2">
                          {descriptionScrolled ? (
                            <span className="text-green-400 flex-shrink-0">✓</span>
                          ) : (
                            <span className="text-yellow-400 flex-shrink-0">○</span>
                          )}
                          <span className={descriptionScrolled ? 'line-through opacity-60' : ''}>
                            Дочитайте описание до конца
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                  </div>
                )}
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Закрыть"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto" 
          onScroll={handleDescriptionScroll}
        >
          {/* Video/Image Carousel */}
          {availableContent.length > 0 && (
            <div 
              className="flex flex-col items-center py-4"
              style={{ backgroundColor: 'var(--color-primary-light, rgba(147, 51, 234, 0.1))' }}
            >
              
              {/* Video/Image Container - Max 400px width, flexible height */}
              <div className="w-full max-w-[400px] px-4 md:px-0">
                <div className="relative w-full">
                  {/* Hint for images (GIFs) - overlaid on content */}
                  {currentContent?.type === 'image' && (
                    <div className="absolute top-4 left-4 right-4 z-10">
                      <div 
                        className="text-white text-sm px-4 py-2.5 rounded-lg text-center shadow-lg"
                        style={{ backgroundColor: 'var(--color-primary, #9333ea)', opacity: 0.95 }}
                      >
                        <p className="font-semibold mb-1">💡 Основное движение</p>
                        <p className="text-xs opacity-90">
                          Ознакомьтесь с видео инструкцией{availableContent.length > 1 && ', нажмите на стрелочку вправо'}
                        </p>
                      </div>
                    </div>
                  )}
                  {/* Current Content */}
                  {currentContent && (
                    <div key={currentContent.id} className="w-full">
                      {currentContent.type === 'video' ? (
                        currentContent.videoType === 'video' ? (
                          <video
                            src={currentContent.embedUrl}
                            controls
                            controlsList="nodownload nofullscreen noremoteplayback"
                            disablePictureInPicture
                            className="w-full aspect-square object-contain bg-white rounded-lg"
                            playsInline
                            onError={() => handleContentError(currentContentIndex)}
                            onEnded={handleVideoEnded}
                            onContextMenu={(e) => e.preventDefault()}
                          />
                        ) : (
                          <div className="w-full aspect-square bg-white rounded-lg overflow-hidden relative">
                            <iframe
                              src={currentContent.embedUrl}
                              className="w-full h-full"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              onError={() => handleContentError(currentContentIndex)}
                            />
                            {/* Targeted overlays to block only clickable branding elements */}
                            {/* Top bar overlay - blocks title/channel name (first 20% of height) */}
                            <div 
                              className="absolute top-0 left-0 right-0 pointer-events-auto bg-transparent"
                              style={{ 
                                height: '20%',
                                zIndex: 10
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            
                            {/* Provider-specific logo overlays */}
                            {currentContent.embedUrl?.includes('youtube.com') ? (
                              /* YouTube logo overlay - rectangular, offset from right edge to avoid fullscreen button */
                              <div 
                                className="absolute bottom-0 pointer-events-auto bg-transparent"
                                style={{ 
                                  right: '48px', // Leave space for fullscreen button (mobile: 48px, desktop: 48px)
                                  width: '100px', // Cover YouTube logo width
                                  height: '48px', // Cover logo height in control bar
                                  zIndex: 10
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : currentContent.embedUrl?.includes('vimeo.com') ? (
                              /* Vimeo logo overlay - square in bottom-right corner */
                              <div 
                                className="absolute bottom-0 right-0 pointer-events-auto bg-transparent"
                                style={{ 
                                  width: '80px',
                                  height: '80px',
                                  zIndex: 10
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : null}
                            <style jsx global>{`
                              /* Hide Vimeo overlay elements */
                              .vp-sidedock,
                              .vp-title,
                              .vp-byline,
                              .vp-portrait,
                              .vp-badge,
                              .vp-sidedock-button {
                                display: none !important;
                                opacity: 0 !important;
                                visibility: hidden !important;
                              }
                              
                              /* Hide YouTube overlay elements */
                              iframe[src*="youtube.com"] .ytp-title,
                              iframe[src*="youtube.com"] .ytp-chrome-top,
                              iframe[src*="youtube.com"] .ytp-show-cards-title,
                              iframe[src*="youtube.com"] .ytp-watermark {
                                display: none !important;
                                pointer-events: none !important;
                              }
                            `}</style>
                          </div>
                        )
                      ) : (
                        <div className="w-full aspect-square flex items-center justify-center bg-white rounded-lg p-4">
                          <div className="relative w-1/2 h-1/2">
                            <Image
                              src={currentContent.contentPath}
                              alt={exerciseName}
                              fill
                              className="object-contain"
                              onError={() => handleContentError(currentContentIndex)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {availableContent.length > 1 && (
                  <>
                    {currentContentIndex > 0 && (
                      <button
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
                        aria-label="Предыдущее"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                    
                    {currentContentIndex < availableContent.length - 1 && (
                      <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
                        aria-label="Следующее"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}

                    {/* Carousel Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                      {availableContent.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentContentIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentContentIndex 
                              ? 'bg-white w-6' 
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                          aria-label={`Перейти к ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="p-4 md:p-6">
              {hasHtmlDescription ? (
                <div 
                  className="prose prose-sm max-w-none
                    prose-headings:font-bold
                    prose-p:text-gray-700 prose-p:leading-relaxed
                    prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-semibold
                    prose-ul:list-disc prose-ol:list-decimal
                    prose-li:text-gray-700 prose-li:my-1
                    prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic"
                  style={{
                    '--tw-prose-headings': 'var(--color-text-primary, #581c87)',
                    '--tw-prose-links': 'var(--color-primary, #9333ea)',
                    '--tw-prose-quote-borders': 'var(--color-primary-border, rgba(147, 51, 234, 0.5))'
                  } as any}
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              ) : (
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {description}
                </div>
              )}
            </div>
          )}

          {/* Comments Section - Collapsible */}
          <div className="border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setCommentsExpanded(!commentsExpanded)}
              className="w-full px-4 md:px-6 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-base font-semibold text-gray-900">Комментарии</span>
                <span className="text-sm text-gray-500">(скоро)</span>
              </div>
              <svg 
                className={`w-5 h-5 text-gray-500 transition-transform ${commentsExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {commentsExpanded && (
              <div className="px-4 md:px-6 pb-6 pt-2">
                <div className="text-sm text-gray-500 text-center py-8 bg-white rounded-lg border border-gray-200">
                  📝 Раздел комментариев будет доступен в следующей версии
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 px-4 md:px-6 py-3 bg-white">
          <button
            onClick={onClose}
            className="w-full px-6 py-2.5 text-white font-medium rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--color-primary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
