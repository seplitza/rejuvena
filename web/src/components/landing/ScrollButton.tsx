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
  const handleClick = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const baseClasses = 'px-6 py-3 font-semibold rounded-lg transition cursor-pointer';
  const variantClasses = variant === 'primary'
    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
    : 'bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50';

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
