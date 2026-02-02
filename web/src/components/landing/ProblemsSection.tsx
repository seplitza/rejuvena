import React from 'react';
import { IProblemsSection } from '../../types/landing';

interface ProblemsSectionProps {
  section: IProblemsSection;
}

const ProblemsSection: React.FC<ProblemsSectionProps> = ({ section }) => {
  if (!section.problems || section.problems.length === 0) return null;

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

        <div className="grid md:grid-cols-2 gap-8">
          {section.problems.map((problem, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {problem.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">{problem.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{problem.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;
