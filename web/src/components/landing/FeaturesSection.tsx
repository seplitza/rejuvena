import React from 'react';
import { IFeaturesSection } from '../../types/landing';

interface FeaturesSectionProps {
  section: IFeaturesSection;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ section }) => {
  if (!section.features || section.features.length === 0) return null;

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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {section.features.map((feature, idx) => (
            <div key={idx} className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
