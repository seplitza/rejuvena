/**
 * Day Description Component
 * Displays day description with embedded videos, images, and rich HTML content
 * Fixed height with internal scrolling
 */

import { useAppSelector } from '@/store/hooks';
import { selectMarathonDay } from '@/store/modules/day/selectors';
import { useMemo } from 'react';

// Video URL patterns
const YOUTUBE_REGEX = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
const VIMEO_REGEX = /vimeo\.com\/(\d+)/;
const VK_VIDEO_REGEX = /vk\.com\/video(-?\d+_\d+)/;

interface VideoEmbed {
  type: 'youtube' | 'vimeo' | 'vk' | 'mp4' | 'telegram';
  url: string;
  id?: string;
}

function extractVideos(html: string): VideoEmbed[] {
  const videos: VideoEmbed[] = [];
  
  // Extract YouTube videos
  const youtubeMatches = html.matchAll(new RegExp(YOUTUBE_REGEX, 'g'));
  for (const match of youtubeMatches) {
    const origin = typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : 'https://seplitza.github.io';
    videos.push({
      type: 'youtube',
      url: `https://www.youtube.com/embed/${match[1]}?modestbranding=1&rel=0&showinfo=0&fs=1&controls=1&disablekb=0&iv_load_policy=3&cc_load_policy=0&playsinline=1&origin=${origin}`,
      id: match[1],
    });
  }
  
  // Extract Vimeo videos
  const vimeoMatches = html.matchAll(new RegExp(VIMEO_REGEX, 'g'));
  for (const match of vimeoMatches) {
    videos.push({
      type: 'vimeo',
      url: `https://player.vimeo.com/video/${match[1]}?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&dnt=1&controls=1&transparent=0`,
      id: match[1],
    });
  }
  
  // Extract VK videos
  const vkMatches = html.matchAll(new RegExp(VK_VIDEO_REGEX, 'g'));
  for (const match of vkMatches) {
    videos.push({
      type: 'vk',
      url: `https://vk.com/video_ext.php?oid=${match[1].split('_')[0]}&id=${match[1].split('_')[1]}`,
      id: match[1],
    });
  }
  
  // Extract direct MP4 links
  const mp4Matches = html.matchAll(/(?:src|href)=["']([^"']+\.mp4)["']/g);
  for (const match of mp4Matches) {
    videos.push({
      type: 'mp4',
      url: match[1],
    });
  }
  
  // Extract Telegram videos (t.me links)
  const telegramMatches = html.matchAll(/(?:src|href)=["'](https?:\/\/t\.me\/[^"']+)["']/g);
  for (const match of telegramMatches) {
    videos.push({
      type: 'telegram',
      url: match[1],
    });
  }
  
  return videos;
}

function VideoPlayer({ video }: { video: VideoEmbed }) {
  switch (video.type) {
    case 'youtube':
    case 'vimeo':
    case 'vk':
      return (
        <div className="w-full mb-4">
          <div className="w-full aspect-video relative overflow-hidden rounded-none md:rounded-lg">
            <iframe
              src={video.url}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {/* Targeted overlays to block only clickable branding elements */}
            {/* Top bar overlay - blocks title/channel name */}
            <div 
              className="absolute top-0 left-0 right-0 pointer-events-auto bg-transparent"
              style={{ 
                height: '20%',
                zIndex: 10
              }}
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Provider-specific logo overlays */}
            {video.type === 'youtube' ? (
              /* YouTube logo overlay - rectangular, offset from right */
              <div 
                className="absolute bottom-0 pointer-events-auto bg-transparent"
                style={{ 
                  right: '48px',
                  width: '100px',
                  height: '48px',
                  zIndex: 10
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : video.type === 'vimeo' ? (
              /* Vimeo logo overlay - square in corner */
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
            <style jsx>{`
              iframe {
                pointer-events: auto;
              }
              /* Hide Vimeo overlays */
              :global(.vp-sidedock),
              :global(.vp-title),
              :global(.vp-byline),
              :global(.vp-portrait),
              :global(.vp-badge) {
                display: none !important;
              }
              /* Block YouTube overlay clicks */
              :global(iframe[src*="youtube.com"]) {
                position: relative;
              }
            `}</style>
          </div>
        </div>
      );
    
    case 'mp4':
      return (
        <div className="w-full mb-4">
          <video
            src={video.url}
            controls
            className="w-full aspect-video object-contain rounded-none md:rounded-lg"
          />
        </div>
      );
    
    case 'telegram':
      return (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-600 mb-2">Видео из Telegram:</p>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F79700] hover:underline break-all"
          >
            {video.url}
          </a>
        </div>
      );
    
    default:
      return null;
  }
}

export default function DayDescription() {
  const marathonDay = useAppSelector(selectMarathonDay);

  const { videos, cleanedHtml } = useMemo(() => {
    if (!marathonDay?.description) {
      return { videos: [], cleanedHtml: '' };
    }

    const extractedVideos = extractVideos(marathonDay.description);
    
    // Remove Froala watermark and clean HTML
    let cleaned = marathonDay.description
      .replace(/<a[^>]*href=".*?froala.*?"[^>]*>.*?<\/a>/gi, '')
      .replace(/<div[^>]*data-f-id[^>]*>.*?<\/div>/gi, '')
      .replace(/Powered by Froala Editor/gi, '');

    return {
      videos: extractedVideos,
      cleanedHtml: cleaned,
    };
  }, [marathonDay?.description]);

  if (!marathonDay) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Fixed height container with scroll */}
      <div 
        className="overflow-y-auto pr-2"
        style={{ 
          height: '400px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E0 #F7FAFC'
        }}
      >
        {/* Videos */}
        {videos.length > 0 && (
          <div className="mb-6 space-y-4">
            {videos.map((video, index) => (
              <VideoPlayer key={`${video.type}-${video.id || index}`} video={video} />
            ))}
          </div>
        )}

        {/* HTML Content */}
        <div 
          className="day-content-prose"
          dangerouslySetInnerHTML={{ __html: cleanedHtml }}
        />
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: #F7FAFC;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb {
          background: #CBD5E0;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #A0AEC0;
        }
        
        /* Explicit styles for day content */
        .day-content-prose :global(h1) {
          font-size: 1.875rem !important; /* 30px */
          font-weight: 700 !important;
          color: #581c87 !important;
          margin-bottom: 1rem !important;
          margin-top: 1.5rem !important;
          line-height: 1.25 !important;
        }
        
        .day-content-prose :global(h2) {
          font-size: 1.5rem !important; /* 24px */
          font-weight: 700 !important;
          color: #6b21a8 !important;
          margin-bottom: 0.75rem !important;
          margin-top: 1.25rem !important;
          line-height: 1.3 !important;
        }
        
        .day-content-prose :global(h3) {
          font-size: 1.25rem !important; /* 20px */
          font-weight: 600 !important;
          color: #7c3aed !important;
          margin-bottom: 0.5rem !important;
          margin-top: 1rem !important;
          line-height: 1.4 !important;
        }
        
        .day-content-prose :global(p) {
          font-size: 1rem !important; /* 16px */
          color: #374151 !important;
          line-height: 1.625 !important;
          margin-bottom: 0.75rem !important;
        }
        
        .day-content-prose :global(strong) {
          font-weight: 600 !important;
          color: #111827 !important;
        }
        
        .day-content-prose :global(em) {
          font-style: italic !important;
        }
        
        .day-content-prose :global(a) {
          color: #7c3aed !important;
          text-decoration: none !important;
        }
        
        .day-content-prose :global(a:hover) {
          text-decoration: underline !important;
        }
        
        .day-content-prose :global(ul) {
          list-style-type: disc !important;
          margin-left: 1.25rem !important;
          margin-bottom: 0.75rem !important;
        }
        
        .day-content-prose :global(ol) {
          list-style-type: decimal !important;
          margin-left: 1.25rem !important;
          margin-bottom: 0.75rem !important;
        }
        
        .day-content-prose :global(li) {
          font-size: 1rem !important;
          color: #374151 !important;
          margin-top: 0.25rem !important;
          margin-bottom: 0.25rem !important;
        }
        
        .day-content-prose :global(img) {
          border-radius: 0.5rem !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          margin: 1rem 0 !important;
          max-width: 100% !important;
          height: auto !important;
        }
        
        .day-content-prose :global(iframe) {
          border-radius: 0.5rem !important;
          margin: 1rem 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          aspect-ratio: 16 / 9 !important;
          border: none !important;
        }
        
        .day-content-prose :global(blockquote) {
          border-left: 4px solid #a78bfa !important;
          padding-left: 1rem !important;
          font-style: italic !important;
          margin: 1rem 0 !important;
        }
      `}</style>
    </div>
  );
}
