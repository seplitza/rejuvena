/**
 * Payment Modal Component
 * Shows payment options for premium exercises
 */

import { useState } from 'react';
import { API_URL } from '@/config/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  price: number;
  exerciseName: string;
  exerciseId: string;
  isPro?: boolean;
  onSuccess?: () => void;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  price, 
  exerciseName, 
  exerciseId,
  isPro = false,
  onSuccess
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Get auth token
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Не авторизован');
      }

      // Call backend API to create payment order in Alfa-Bank
      const response = await fetch(`${API_URL}/api/payment/create-exercise`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          exerciseId,
          exerciseName,
          price
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Переводим ошибки на русский
        let errorMessage = "Ошибка создания платежа";
        if (data.error) {
          if (data.error.includes("Internal server error")) {
            errorMessage = "Ошибка сервера. Попробуйте позже или обратитесь в поддержку";
          } else if (data.error.includes("already purchased")) {
            errorMessage = "Упражнение уже куплено";
          } else {
            errorMessage = data.error;
          }
        }
        throw new Error(errorMessage);
      }

      if (data.success && data.payment?.paymentUrl) {
        // Redirect to Alfa-Bank payment page
        // Purchase will be recorded on server after successful payment via callback
        window.location.href = data.payment.paymentUrl;
      } else {
        throw new Error('Не получен URL для оплаты');
      }
    } catch (err: any) {
      console.error('Purchase error:', err);
      const errorMsg = err.message || 'Произошла ошибка при создании платежа';
      setError(errorMsg);
      
      // If already purchased, just close
      if (errorMsg.includes('already purchased')) {
        alert('Упражнение уже куплено!');
        onClose();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4">
          <h2 className="text-2xl font-bold">
            Полный доступ
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🔓</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Разблокировать упражнение?
            </h3>
            <p className="text-gray-600">
              "{exerciseName}"
            </p>
          </div>

          {/* Features */}
          <div className="bg-purple-50 rounded-xl p-4 mb-6 space-y-2">
            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Полное видео-инструкция
            </div>
            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Детальное описание техники
            </div>
            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Доступ на 1 месяц!
            </div>
          </div>

          {/* Price */}
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full">
              <span className="text-3xl font-bold">{price} ₽</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Обработка...
                </span>
              ) : (
                `Купить за ${price} ₽`
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
