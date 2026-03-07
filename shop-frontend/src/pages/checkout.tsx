import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { clearCart, applyPromoCode } from '@/store/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon, 
  TruckIcon, 
  CreditCardIcon,
  ShoppingBagIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CheckoutFormData {
  // Контактная информация
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  
  // Адрес доставки
  address: string;
  city: string;
  postalCode: string;
  country: string;
  
  // Способ доставки
  deliveryMethod: 'cdek' | 'pickup' | 'courier';
  
  // Способ оплаты
  paymentMethod: 'card' | 'cash' | 'online';
  
  // Комментарий
  comment?: string;
}

const DELIVERY_METHODS = [
  {
    id: 'cdek',
    name: 'СДЭК',
    description: 'Доставка в пункт выдачи',
    price: 350,
    days: '2-4 дня'
  },
  {
    id: 'courier',
    name: 'Курьер',
    description: 'Доставка курьером до двери',
    price: 500,
    days: '1-2 дня'
  },
  {
    id: 'pickup',
    name: 'Самовывоз',
    description: 'Забрать самостоятельно',
    price: 0,
    days: 'Сегодня'
  }
];

const PAYMENT_METHODS = [
  {
    id: 'card',
    name: 'Банковская карта',
    description: 'Visa, MasterCard, МИР'
  },
  {
    id: 'online',
    name: 'Онлайн-оплата',
    description: 'Alfabank, СБП'
  },
  {
    id: 'cash',
    name: 'При получении',
    description: 'Наличными или картой'
  }
];

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items, discount, promoCode } = useSelector((state: RootState) => state.cart);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Calculate total amount from items
  const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: user?.email || '',
    phone: user?.phone || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Россия',
    deliveryMethod: 'cdek',
    paymentMethod: 'card',
    comment: ''
  });

  // Проверка пустой корзины
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  // Расчет стоимости доставки
  const deliveryPrice = DELIVERY_METHODS.find(m => m.id === formData.deliveryMethod)?.price || 0;
  const finalAmount = totalAmount - discount + deliveryPrice;

  // Обработка изменения полей формы
  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Применение промокода
  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    
    try {
      const response = await axios.post(`${API_URL}/api/shop/promo/validate`, {
        code: promoInput,
        cartTotal: totalAmount
      });
      
      if (response.data.valid) {
        dispatch(applyPromoCode({
          code: promoInput,
          discount: response.data.discount
        }));
        toast.success(`Промокод применён! Скидка: ${response.data.discount}₽`);
        setPromoInput('');
      } else {
        toast.error(response.data.message || 'Промокод недействителен');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка применения промокода');
    }
  };

  // Переход к следующему шагу
  const handleNextStep = () => {
    // Валидация текущего шага
    if (currentStep === 1) {
      if (!formData.email || !formData.phone || !formData.firstName || !formData.lastName) {
        toast.error('Заполните все обязательные поля');
        return;
      }
      // Валидация email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Введите корректный email');
        return;
      }
    }
    
    if (currentStep === 2) {
      if (formData.deliveryMethod !== 'pickup') {
        if (!formData.address || !formData.city) {
          toast.error('Укажите адрес доставки');
          return;
        }
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  // Оформление заказа
  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        subtotal: totalAmount,
        shippingCost: deliveryPrice,
        discount: discount,
        totalAmount: finalAmount,
        paymentMethod: formData.paymentMethod,
        deliveryMethod: formData.deliveryMethod,
        promoCode: promoCode,
        comment: formData.comment
      };

      const response = await axios.post(`${API_URL}/api/shop/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        // Очистка корзины
        dispatch(clearCart());
        
        // Если онлайн-оплата - редирект на платёжную систему
        if (formData.paymentMethod === 'card' || formData.paymentMethod === 'online') {
          // TODO: Интеграция с Alfabank
          window.location.href = response.data.paymentUrl;
        } else {
          // Переход на страницу успеха
          router.push(`/order-success?orderId=${response.data.order._id}`);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка оформления заказа');
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { number: 1, title: 'Контакты', icon: ShoppingBagIcon },
    { number: 2, title: 'Доставка', icon: TruckIcon },
    { number: 3, title: 'Оплата', icon: CreditCardIcon },
    { number: 4, title: 'Подтверждение', icon: CheckCircleIcon }
  ];

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Оформление заказа | Seplitza Shop</title>
        <meta name="description" content="Оформите заказ в интернет-магазине Seplitza. Доставка СДЭК, оплата картой или при получении." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Шаги прогресса */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex-1">
                  <div className="flex items-center">
                    <div className={`flex flex-col items-center ${index !== 0 ? 'w-full' : ''}`}>
                      {/* Линия соединения */}
                      {index !== 0 && (
                        <div className="w-full h-1 bg-gray-200 mb-2 -ml-4">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              currentStep > step.number - 1 ? 'bg-pink-500' : 'bg-gray-200'
                            }`}
                            style={{ width: currentStep > step.number - 1 ? '100%' : '0%' }}
                          />
                        </div>
                      )}
                      
                      {/* Иконка шага */}
                      <motion.div
                        initial={false}
                        animate={{
                          scale: currentStep === step.number ? 1.1 : 1,
                          backgroundColor: currentStep >= step.number ? '#ec4899' : '#e5e7eb'
                        }}
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                      >
                        <step.icon className={`w-6 h-6 ${currentStep >= step.number ? 'text-white' : 'text-gray-400'}`} />
                      </motion.div>
                      
                      {/* Название шага */}
                      <span className={`text-sm font-medium ${currentStep >= step.number ? 'text-pink-600' : 'text-gray-400'}`}>
                        {step.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Форма оформления заказа */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
                >
                  {/* Step 1: Контактная информация */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Контактная информация</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Имя *
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="Анна"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Фамилия *
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="Иванова"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="anna@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Телефон *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="+7 (999) 123-45-67"
                        />
                      </div>

                      {!isAuthenticated && (
                        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                          <p className="text-sm text-pink-800">
                            💡 <button className="underline font-medium hover:text-pink-600" onClick={() => router.push('/login?redirect=/checkout')}>
                              Войдите в аккаунт
                            </button> чтобы сохранить заказ в истории
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 2: Доставка */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Способ доставки</h2>
                      
                      {/* Выбор способа доставки */}
                      <div className="space-y-3">
                        {DELIVERY_METHODS.map((method) => (
                          <label
                            key={method.id}
                            className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                              formData.deliveryMethod === method.id
                                ? 'border-pink-500 bg-pink-50'
                                : 'border-gray-200 hover:border-pink-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="delivery"
                              value={method.id}
                              checked={formData.deliveryMethod === method.id}
                              onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
                              className="sr-only"
                            />
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <TruckIcon className="w-6 h-6 text-pink-500" />
                                  <div>
                                    <p className="font-semibold text-gray-900">{method.name}</p>
                                    <p className="text-sm text-gray-600">{method.description}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <p className="font-bold text-gray-900">
                                  {method.price === 0 ? 'Бесплатно' : `${method.price}₽`}
                                </p>
                                <p className="text-sm text-gray-600">{method.days}</p>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>

                      {/* Адрес доставки */}
                      {formData.deliveryMethod !== 'pickup' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 pt-4 border-t"
                        >
                          <h3 className="font-semibold text-gray-900">Адрес доставки</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Город *
                              </label>
                              <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                placeholder="Москва"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Адрес *
                              </label>
                              <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                placeholder="ул. Пушкина, д. 10, кв. 5"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Индекс
                              </label>
                              <input
                                type="text"
                                value={formData.postalCode}
                                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                placeholder="123456"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Страна
                              </label>
                              <input
                                type="text"
                                value={formData.country}
                                onChange={(e) => handleInputChange('country', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                placeholder="Россия"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Step 3: Оплата */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Способ оплаты</h2>
                      
                      <div className="space-y-3">
                        {PAYMENT_METHODS.map((method) => (
                          <label
                            key={method.id}
                            className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                              formData.paymentMethod === method.id
                                ? 'border-pink-500 bg-pink-50'
                                : 'border-gray-200 hover:border-pink-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment"
                              value={method.id}
                              checked={formData.paymentMethod === method.id}
                              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                              className="sr-only"
                            />
                            <div className="flex items-center gap-3">
                              <CreditCardIcon className="w-6 h-6 text-pink-500" />
                              <div>
                                <p className="font-semibold text-gray-900">{method.name}</p>
                                <p className="text-sm text-gray-600">{method.description}</p>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Комментарий к заказу (необязательно)
                        </label>
                        <textarea
                          value={formData.comment}
                          onChange={(e) => handleInputChange('comment', e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Дополнительная информация для курьера..."
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 4: Подтверждение */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Проверьте заказ</h2>
                      
                      {/* Контакты */}
                      <div className="border-b pb-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Контакты</h3>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-gray-600">Имя:</span> <span className="font-medium">{formData.firstName} {formData.lastName}</span></p>
                          <p><span className="text-gray-600">Email:</span> <span className="font-medium">{formData.email}</span></p>
                          <p><span className="text-gray-600">Телефон:</span> <span className="font-medium">{formData.phone}</span></p>
                        </div>
                      </div>

                      {/* Доставка */}
                      <div className="border-b pb-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Доставка</h3>
                        <p className="font-medium mb-2">
                          {DELIVERY_METHODS.find(m => m.id === formData.deliveryMethod)?.name}
                        </p>
                        {formData.deliveryMethod !== 'pickup' && (
                          <p className="text-sm text-gray-600">
                            {formData.city}, {formData.address}
                            {formData.postalCode && `, ${formData.postalCode}`}
                          </p>
                        )}
                      </div>

                      {/* Оплата */}
                      <div className="border-b pb-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Оплата</h3>
                        <p className="font-medium">
                          {PAYMENT_METHODS.find(m => m.id === formData.paymentMethod)?.name}
                        </p>
                      </div>

                      {/* Товары */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Товары ({items.length})</h3>
                        <div className="space-y-3">
                          {items.map((item) => (
                            <div key={item.product._id} className="flex gap-4">
                              <img
                                src={item.product.images[0] || '/placeholder.png'}
                                alt={item.product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.product.name}</p>
                                <p className="text-sm text-gray-600">{item.quantity} × {item.product.price}₽</p>
                              </div>
                              <p className="font-semibold text-gray-900">
                                {item.quantity * item.product.price}₽
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {formData.comment && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Комментарий:</p>
                          <p className="text-sm text-gray-600">{formData.comment}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Кнопки навигации */}
                  <div className="flex gap-4 mt-8">
                    {currentStep > 1 && (
                      <button
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Назад
                      </button>
                    )}
                    
                    {currentStep < 4 ? (
                      <button
                        onClick={handleNextStep}
                        className="flex-1 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold transition-colors"
                      >
                        Продолжить
                      </button>
                    ) : (
                      <button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Оформление...' : `Оформить заказ на ${finalAmount}₽`}
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Сводка заказа */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Итого</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Товары ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                    <span className="font-medium">{totalAmount}₽</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Скидка</span>
                      <span className="font-medium">-{discount}₽</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Доставка</span>
                    <span className="font-medium">
                      {deliveryPrice === 0 ? 'Бесплатно' : `${deliveryPrice}₽`}
                    </span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>К оплате:</span>
                      <span className="text-pink-600">{finalAmount}₽</span>
                    </div>
                  </div>
                </div>

                {/* Промокод */}
                {!promoCode && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Промокод
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        placeholder="PROMO2024"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleApplyPromo}
                        disabled={!promoInput.trim()}
                        className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        Применить
                      </button>
                    </div>
                  </div>
                )}

                {promoCode && (
                  <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Промокод {promoCode}</span>
                      </div>
                      <button
                        onClick={() => dispatch(applyPromoCode({ code: '', discount: 0 }))}
                        className="text-green-600 hover:text-green-700"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Гарантии */}
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p>Безопасная оплата</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p>Отслеживание доставки</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p>Возврат в течение 14 дней</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
