import React from 'react';
import { IAboutSection } from '../../types/landing';

interface AboutSectionProps {
  section: IAboutSection;
}

const AboutSection: React.FC<AboutSectionProps> = ({ section }) => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          {section.sectionTitle}
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            {section.photo && (
              <img
                src={section.photo}
                alt={section.name}
                className="w-full rounded-2xl shadow-xl"
              />
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
      </div>
    </section>
  );
};

export default AboutSection;
