import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ShoppingBagIcon, 
  TruckIcon,
  EnvelopeIcon 
} from '@heroicons/react/24/outline';
import axios from 'axios';
import Confetti from 'react-confetti';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrderSuccessPage() {
  const router = useRouter();
  const { orderId } = router.query;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  useEffect(() => {
    // Скрыть конфетти через 5 секунд
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/shop/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setOrder(response.data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Заказ не найден</h1>
          <Link href="/" className="text-pink-500 hover:text-pink-600">
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Заказ оформлен! | Seplitza Shop</title>
        <meta name="description" content="Спасибо за заказ! Мы уже начали его обработку." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 300}
          height={typeof window !== 'undefined' ? window.innerHeight : 200}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          >
            {/* Иконка успеха */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircleIcon className="w-16 h-16 text-green-500" />
            </motion.div>

            {/* Заголовок */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Спасибо за заказ!
              </h1>
              <p className="text-lg text-gray-600">
                Ваш заказ <span className="font-semibold text-pink-600">#{order.orderNumber}</span> успешно оформлен
              </p>
            </motion.div>

            {/* Информация о заказе */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6 mb-8"
            >
              {/* Статус */}
              <div className="bg-pink-50 border border-pink-200 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-pink-500 text-white p-3 rounded-lg">
                    <ShoppingBagIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Что дальше?</h3>
                    <p className="text-sm text-gray-600">Мы уже начали обрабатывать ваш заказ</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Подтверждение отправлено</p>
                      <p className="text-xs text-gray-600">Проверьте вашу почту для деталей</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <TruckIcon className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Подготовка к отправке</p>
                      <p className="text-xs text-gray-600">Обычно занимает 1-2 рабочих дня</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <EnvelopeIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Уведомления о доставке</p>
                      <p className="text-xs text-gray-600">Вы получите трек-номер на почту</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Товары */}
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">Ваши товары</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-600">{item.quantity} × {item.price}₽</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {item.quantity * item.price}₽
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Итого:</span>
                    <span className="text-2xl font-bold text-pink-600">{order.totalAmount}₽</span>
                  </div>
                </div>
              </div>

              {/* Дата заказа */}
              <div className="text-center text-sm text-gray-600">
                Заказ оформлен {new Date(order.createdAt).toLocaleString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </motion.div>

            {/* Кнопки действий */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/profile/orders"
                className="flex-1 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold text-center transition-colors"
              >
                Мои заказы
              </Link>
              
              <Link
                href="/catalog"
                className="flex-1 px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold text-center transition-colors"
              >
                Продолжить покупки
              </Link>
            </motion.div>

            {/* Бонусы */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200"
            >
              <h3 className="font-bold text-gray-900 mb-2">🎁 Получите бонусы!</h3>
              <p className="text-sm text-gray-600 mb-3">
                Напишите отзыв о покупке и получите скидку 10% на следующий заказ
              </p>
              <Link
                href={`/products/review?orderId=${order._id}`}
                className="inline-flex items-center text-sm font-medium text-pink-600 hover:text-pink-700"
              >
                Написать отзыв →
              </Link>
            </motion.div>
          </motion.div>

          {/* Дополнительная информация */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-center text-sm text-gray-600"
          >
            <p>Возникли вопросы? Свяжитесь с нами:</p>
            <p className="mt-2">
              <a href="mailto:support@seplitza.ru" className="text-pink-600 hover:text-pink-700 font-medium">
                support@seplitza.ru
              </a>
              {' · '}
              <a href="tel:+79999999999" className="text-pink-600 hover:text-pink-700 font-medium">
                +7 (999) 999-99-99
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
