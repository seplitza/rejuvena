import React from 'react';
import { IProcessSection } from '../../types/landing';

interface ProcessSectionProps {
  section: IProcessSection;
}

const ProcessSection: React.FC<ProcessSectionProps> = ({ section }) => {
  if (!section.steps || section.steps.length === 0) return null;

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

        <div className="space-y-8">
          {section.steps.map((step, idx) => (
            <div key={idx} className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {step.number}
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-3">
                  <h3 className="text-2xl font-bold text-gray-800">{step.title}</h3>
                  {step.duration && (
                    <span className="px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {step.duration}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
