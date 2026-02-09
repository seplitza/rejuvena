import React from 'react';
import ScrollButton from './ScrollButton';
import VideoCarousel from './VideoCarousel';

interface InteractiveElement {
  position: string;
}

interface DetailModal extends InteractiveElement {
  title: string;
  content: string;
  linkText?: string;
  linkUrl?: string;
}

interface EnrollButton extends InteractiveElement {
  text: string;
  targetId: string;
}

interface PaymentButton extends InteractiveElement {
  text: string;
  targetId: string;
}

interface VideoBlock extends InteractiveElement {
  title?: string;
  videoUrl: string;
  poster?: string;
  order: number;
}

interface InteractiveElementsProps {
  position: string;
  detailModals?: DetailModal[];
  enrollButtons?: EnrollButton[];
  paymentButtons?: PaymentButton[];
  videoBlocks?: VideoBlock[];
  onDetailModalClick?: (index: number) => void;
}

const InteractiveElements: React.FC<InteractiveElementsProps> = ({
  position,
  detailModals = [],
  enrollButtons = [],
  paymentButtons = [],
  videoBlocks = [],
  onDetailModalClick
}) => {
  // Фильтруем элементы для данной позиции (если position не указан - по умолчанию 'hero')
  const modalsHere = detailModals.filter(m => (m.position || 'hero') === position);
  const enrollsHere = enrollButtons.filter(b => (b.position || 'hero') === position);
  const paymentsHere = paymentButtons.filter(b => (b.position || 'hero') === position);
  const videosHere = videoBlocks.filter(v => (v.position || 'hero') === position);

  // Если ничего нет - не рендерим
  if (modalsHere.length === 0 && enrollsHere.length === 0 && paymentsHere.length === 0 && videosHere.length === 0) {
    return null;
  }

  return (
    <>
      {/* Модальные окна "Подробнее" */}
      {modalsHere.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-6">
              {modalsHere.map((modal, idx) => {
                // Находим оригинальный индекс в полном массиве
                const originalIndex = detailModals.findIndex(m => m === modal);
                return (
                  <button
                    key={idx}
                    onClick={() => onDetailModalClick && onDetailModalClick(originalIndex)}
                    className="px-6 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition font-semibold shadow-sm hover:shadow-md"
                  >
                    {modal.title}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Кнопки записи на марафон */}
      {enrollsHere.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-6">
              {enrollsHere.map((button, idx) => (
                <ScrollButton
                  key={idx}
                  text={button.text}
                  targetId={button.targetId}
                  variant="primary"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Кнопки оплаты */}
      {paymentsHere.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-6">
              {paymentsHere.map((button, idx) => (
                <ScrollButton
                  key={idx}
                  text={button.text}
                  targetId={button.targetId}
                  variant="secondary"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Видео блоки */}
      {videosHere.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <VideoCarousel videos={videosHere} />
          </div>
        </section>
      )}
    </>
  );
};

export default InteractiveElements;
