import React, { useState } from 'react';
import { IAboutSection } from '../../types/landing';

interface AboutSectionProps {
  section: IAboutSection;
}

const API_BASE_URL = 'https://api-rejuvena.duckdns.org';

const AboutSection: React.FC<AboutSectionProps> = ({ section }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Формируем полный URL для фото
  const photoUrl = section.photo
    ? section.photo.startsWith('http')
      ? section.photo
      : `${API_BASE_URL}${section.photo}`
    : null;

  // Автоматический сброс через 30 секунд
  React.useEffect(() => {
    if (selectedPhoto) {
      const timer = setTimeout(() => {
        setSelectedPhoto(null);
      }, 30000); // 30 секунд
      
      return () => clearTimeout(timer);
    }
  }, [selectedPhoto]);

  // Обработчик клика по миниатюре
  const handleThumbnailClick = (url: string) => {
    setSelectedPhoto(url);
  };

  // Формируем URLs для галереи
  const galleryUrls = section.gallery?.map(photo =>
    photo.startsWith('http') ? photo : `${API_BASE_URL}${photo}`
  ) || [];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          {section.sectionTitle}
        </h2>

        {/* Мобильная версия: стандартный grid (как было) */}
        <div className="md:hidden grid gap-8">
          <div>
            {photoUrl && (
              <img
                src={selectedPhoto || photoUrl}
                alt={section.name}
                className="w-full rounded-2xl shadow-xl"
              />
            )}
            
            {/* Галерея под основным фото (мобилка) */}
            {galleryUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {galleryUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full aspect-square object-cover rounded-lg shadow cursor-pointer hover:opacity-80 transition"
                    onClick={() => handleThumbnailClick(url)}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-3xl font-bold mb-4 text-gray-800">{section.name}</h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed whitespace-pre-line">
              {section.bio}
            </p>

            {section.achievements && section.achievements.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-6">
                {section.achievements.map((achievement, idx) => (
                  <div key={idx} className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h4 className="font-bold text-lg mb-2 text-gray-800">{achievement.title}</h4>
                    <p className="text-gray-600 text-sm">{achievement.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Десктопная версия: обтекание текстом (перевернутая Г) */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Фото слева с float */}
            {photoUrl && (
              <div className="float-left mr-8 mb-6" style={{ width: '420px' }}>
                <img
                  src={selectedPhoto || photoUrl}
                  alt={section.name}
                  className="w-full rounded-2xl shadow-xl"
                />
                
                {/* Галерея под основным фото (десктоп) */}
                {galleryUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {galleryUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full aspect-square object-cover rounded-lg shadow cursor-pointer hover:opacity-80 transition"
                        onClick={() => handleThumbnailClick(url)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Текст обтекает фото */}
            <div className="overflow-hidden">
              <h3 className="text-3xl font-bold mb-4 text-gray-800">{section.name}</h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed whitespace-pre-line">
                {section.bio}
              </p>

              {/* Достижения обтекают фото снизу */}
              {section.achievements && section.achievements.length > 0 && (
                <div className="grid grid-cols-2 gap-6">
                  {section.achievements.map((achievement, idx) => (
                    <div key={idx} className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h4 className="font-bold text-lg mb-2 text-gray-800">{achievement.title}</h4>
                      <p className="text-gray-600 text-sm">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Очищаем float */}
            <div className="clear-both"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
