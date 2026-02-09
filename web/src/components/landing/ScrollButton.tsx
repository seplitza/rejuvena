import React from 'react';

interface ScrollButtonProps {
  text: string;
  targetId: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const ScrollButton: React.FC<ScrollButtonProps> = ({
  text,
  targetId,
  variant = 'primary',
  className = ''
}) => {
  const baseClasses = 'px-6 py-3 font-semibold rounded-lg transition cursor-pointer';
  const variantClasses = variant === 'primary'
    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
    : 'bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50';

  // Если targetId это URL - делаем внешнюю ссылку
  const isExternalLink = targetId.startsWith('http://') || targetId.startsWith('https://') || targetId.startsWith('mailto:') || targetId.startsWith('tel:');
  
  if (isExternalLink) {
    return (
      <a
        href={targetId}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${variantClasses} ${className} inline-block`}
      >
        {text}
      </a>
    );
  }

  // Иначе скроллим к секции
  const handleClick = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {text}
    </button>
  );
};

export default ScrollButton;
