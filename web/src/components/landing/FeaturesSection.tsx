import React from 'react';
import { IFeaturesSection } from '../../types/landing';
import Image from 'next/image';

interface FeaturesSectionProps {
  section: IFeaturesSection;
  onCardClick?: (modalId: number) => void;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ section, onCardClick }) => {
  if (!section.features || section.features.length === 0) return null;

  const renderIcon = (icon: string) => {
    // Если иконка начинается с /, это путь к изображению
    if (icon.startsWith('/')) {
      return (
        <div className="w-20 h-20 mx-auto mb-4 relative">
          <Image 
            src={icon} 
            alt="Feature icon" 
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      );
    }
    // Иначе это текстовое эмодзи
    return <div className="text-5xl mb-4">{icon}</div>;
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
          {section.sectionTitle}
        </h2>
        {section.subtitle && (
          <p className="text-xl text-center mb-12 text-gray-600 max-w-3xl mx-auto">
            {section.subtitle}
          </p>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {section.features.map((feature, index) => (
            <div 
              key={index} 
              className={`text-center p-6 rounded-lg transition-all ${
                feature.modalId !== undefined 
                  ? 'hover:shadow-xl hover:scale-105 cursor-pointer' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => feature.modalId !== undefined && onCardClick?.(feature.modalId)}
            >
              {feature.icon && renderIcon(feature.icon)}
              <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
              {feature.modalId !== undefined && (
                <p className="text-purple-600 text-sm mt-3 font-semibold">Подробнее →</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
