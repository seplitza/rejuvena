import React from 'react';

interface MarathonDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  marathonTitle: string;
  description: string;
  price: number;
  oldPrice?: number;
  tenure: number;
  features: string[];
  onPayment: () => void;
}

const MarathonDetailsModal: React.FC<MarathonDetailsModalProps> = ({
  isOpen,
  onClose,
  title,
  marathonTitle,
  description,
  price,
  oldPrice,
  tenure,
  features,
  onPayment
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Описание марафона</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Название марафона */}
          <h3 className="text-xl font-semibold mb-4 text-gray-800">{title} "{marathonTitle}"</h3>
          
          {/* Продолжительность */}
          <div className="mb-4">
            <p className="text-gray-600">
              <span className="font-semibold">Продолжительность:</span> {tenure} {tenure === 1 ? 'день' : tenure < 5 ? 'дня' : 'дней'} полного доступа
            </p>
          </div>

          {/* Цена */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              {oldPrice && (
                <span className="text-2xl text-gray-400 line-through">
                  {oldPrice}₽
                </span>
              )}
              <span className="text-3xl font-bold text-purple-600">
                {price}₽
              </span>
            </div>
          </div>

          {/* Что включено - описание марафона */}
          {description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Что включено:</h3>
              <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          )}

          {/* Кнопка оплаты */}
          <button
            onClick={() => {
              onPayment();
              onClose();
            }}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition text-lg"
          >
            Оплатить {price}₽
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarathonDetailsModal;
