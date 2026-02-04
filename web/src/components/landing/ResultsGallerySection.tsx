import React from 'react';
import GalleryCarousel from './GalleryCarousel';

interface IResultsGallerySection {
  sectionTitle: string;
  description?: string;
  images: Array<{
    url: string;
    caption?: string;
    order: number;
  }>;
}

interface ResultsGallerySectionProps {
  section: IResultsGallerySection;
}

const ResultsGallerySection: React.FC<ResultsGallerySectionProps> = ({ section }) => {
  if (!section.images || section.images.length === 0) {
    return null;
  }
  
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок секции */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {section.sectionTitle}
          </h2>
          {section.description && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {section.description}
            </p>
          )}
        </div>
        
        {/* Галерея */}
        <GalleryCarousel images={section.images} />
      </div>
    </section>
  );
};

export default ResultsGallerySection;
