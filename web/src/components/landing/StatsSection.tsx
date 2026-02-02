import React from 'react';
import { IStatsSection } from '../../types/landing';

interface StatsSectionProps {
  section: IStatsSection;
}

const StatsSection: React.FC<StatsSectionProps> = ({ section }) => {
  if (!section.stats || section.stats.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          {section.sectionTitle}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {section.stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-5xl md:text-6xl font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-xl font-semibold mb-2 opacity-90">
                {stat.label}
              </div>
              <p className="text-sm opacity-80">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
