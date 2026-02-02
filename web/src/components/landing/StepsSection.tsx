import React from 'react';
import { IStepsSection } from '../../types/landing';

interface StepsSectionProps {
  section: IStepsSection;
}

const StepsSection: React.FC<StepsSectionProps> = ({ section }) => {
  if (!section.steps || section.steps.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-gray-50">
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
          {section.steps.map((step, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition">
              {step.image && (
                <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="text-sm font-bold text-purple-600 mb-2">СТУПЕНЬ {idx + 1}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
