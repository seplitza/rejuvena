import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  linkText?: string;
  linkUrl?: string;
}

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  linkText,
  linkUrl
}) => {
  const [loadedContent, setLoadedContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка контента через API если linkUrl начинается с api://marathon/
  useEffect(() => {
    if (!isOpen || !linkUrl || !linkUrl.startsWith('api://marathon/')) {
      setLoadedContent('');
      setLoading(false);
      setError(null);
      return;
    }

    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        // Формат: api://marathon/{marathonId}/welcome
        const match = linkUrl.match(/^api:\/\/marathon\/([^/]+)\/welcome$/);
        if (!match) {
          setError('Неверный формат API URL');
          return;
        }
        
        const marathonId = match[1];
        const response = await axios.get<{ success: boolean; welcomeMessage: string }>(
          `${API_BASE_URL}/api/marathons/${marathonId}/welcome`
        );
        
        if (response.data.success) {
          setLoadedContent(response.data.welcomeMessage);
        }
      } catch (err: any) {
        console.error('Error loading content:', err);
        setError('Не удалось загрузить контент');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [isOpen, linkUrl]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="Закрыть"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="px-6 py-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">Загрузка...</p>
            </div>
          ) : error ? (
            <p className="text-red-500 italic">{error}</p>
          ) : loadedContent ? (
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: loadedContent }}
            />
          ) : content && content.replace(/<[^>]*>/g, '').trim() ? (
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : linkText && linkUrl && !linkUrl.startsWith('api://') ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-6">Перейдите по ссылке для получения подробной информации:</p>
              <a
                href={linkUrl.startsWith('/') || linkUrl.startsWith('#') ? linkUrl : `/${linkUrl}`}
                target={linkUrl.startsWith('http') ? '_blank' : undefined}
                rel={linkUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-lg hover:shadow-lg transition"
              >
                {linkText}
              </a>
            </div>
          ) : (
            <p className="text-gray-500 italic">Контент отсутствует</p>
          )}
          
          {!loading && !loadedContent && content && content.replace(/<[^>]*>/g, '').trim() && linkText && linkUrl && !linkUrl.startsWith('api://') && (
            <div className="mt-6">
              <a
                href={linkUrl.startsWith('/') || linkUrl.startsWith('#') ? linkUrl : `/${linkUrl}`}
                target={linkUrl.startsWith('http') ? '_blank' : undefined}
                rel={linkUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
              >
                {linkText}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
