import React from 'react';
import GalleryCarousel from './GalleryCarousel';

interface ITestimonialsGallerySection {
  sectionTitle: string;
  description?: string;
  images: Array<{
    url: string;
    caption?: string;
    order: number;
  }>;
}

interface TestimonialsGallerySectionProps {
  section: ITestimonialsGallerySection;
}

const TestimonialsGallerySection: React.FC<TestimonialsGallerySectionProps> = ({ section }) => {
  if (!section.images || section.images.length === 0) {
    return null;
  }
  
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-pink-50">
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

export default TestimonialsGallerySection;
