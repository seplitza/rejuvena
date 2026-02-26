import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/hooks/useCart';
import { useAppDispatch } from '@/store';
import { removeFromCart, updateQuantity, clearCart, applyPromoCode, removePromoCode } from '@/store/cartSlice';
import { TrashIcon, MinusIcon, PlusIcon, TagIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { validatePromoCode } from '@/api/shop';

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, total, discount, freeShipping, promoCode, finalTotal } = useCart();
  const [promoInput, setPromoInput] = useState('');
  const [applyingPromo, setApplyingPromo] = useState(false);

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    const item = items.find(i => i.product._id === productId);
    if (!item) return;

    if (newQuantity > item.product.stock) {
      toast.warning(`Доступно только ${item.product.stock} шт.`);
      return;
    }

    if (newQuantity < 1) {
      return;
    }

    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart(productId));
    toast.success('Товар удален из корзины');
  };

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;

    setApplyingPromo(true);
    try {
      const result = await validatePromoCode({
        code: promoInput,
        cartTotal: total,
        productIds: items.map(item => item.product._id),
      });

      if (result.valid) {
        dispatch(
          applyPromoCode({
            code: promoInput,
            discount: result.discount || 0,
            freeShipping: result.freeShipping || false,
          })
        );
        toast.success('Промокод применен');
        setPromoInput('');
      } else {
        toast.error(result.message || 'Промокод недействителен');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Не удалось применить промокод');
    } finally {
      setApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    dispatch(removePromoCode());
    toast.info('Промокод удален');
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <Layout title="Корзина">
        <div className="container-custom py-12 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold mb-4">Корзина пуста</h1>
          <p className="text-gray-600 mb-8">
            Добавьте товары из каталога, чтобы оформить заказ
          </p>
          <Link href="/catalog" className="btn-primary inline-block">
            Перейти в каталог
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Корзина">
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Корзина</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.product._id} className="bg-white rounded-xl p-4 md:p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="flex-shrink-0"
                    >
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-gray-100">
                        {item.product.images && item.product.images.length > 0 ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-primary text-white text-2xl font-bold">
                            {item.product.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.product.slug}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-primary-600 mb-1">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-lg font-bold text-primary-600">
                        {item.product.price.toLocaleString('ru-RU')} ₽
                      </p>
                      {item.product.oldPrice && item.product.oldPrice > item.product.price && (
                        <p className="text-sm text-gray-400 line-through">
                          {item.product.oldPrice.toLocaleString('ru-RU')} ₽
                        </p>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="px-4 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item.product._id)}
                          className="text-error-500 hover:text-error-600 p-2"
                          title="Удалить"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="hidden md:block text-right">
                      <p className="text-xl font-bold text-gray-900">
                        {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Итого</h2>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Промокод
                  </label>
                  {promoCode ? (
                    <div className="flex items-center justify-between bg-success-50 border border-success-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <TagIcon className="w-5 h-5 text-success-600" />
                        <span className="font-medium text-success-700">{promoCode}</span>
                      </div>
                      <button
                        onClick={handleRemovePromo}
                        className="text-error-500 hover:text-error-600"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        placeholder="Введите код"
                        className="input-field text-sm flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
                      />
                      <button
                        onClick={handleApplyPromo}
                        disabled={!promoInput.trim() || applyingPromo}
                        className="btn-primary text-sm px-4 disabled:opacity-50"
                      >
                        {applyingPromo ? '...' : 'OK'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Товары ({items.length}):</span>
                    <span>{total.toLocaleString('ru-RU')} ₽</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-success-600">
                      <span>Скидка:</span>
                      <span>-{discount.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  )}

                  {freeShipping && (
                    <div className="flex justify-between text-success-600">
                      <span>Доставка:</span>
                      <span>Бесплатно 🎉</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-semibold">Итого:</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {finalTotal.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>

                <button onClick={handleCheckout} className="btn-primary w-full">
                  Оформить заказ
                </button>

                <button
                  onClick={() => dispatch(clearCart())}
                  className="btn-outline w-full mt-2"
                >
                  Очистить корзину
                </button>

                <Link
                  href="/catalog"
                  className="block text-center text-primary-600 hover:text-primary-700 mt-4"
                >
                  ← Продолжить покупки
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
