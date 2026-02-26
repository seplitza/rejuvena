import { useAppSelector } from '@/store';
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemsCount,
  selectDiscount,
  selectFreeShipping,
  selectPromoCode,
} from '@/store/cartSlice';

export const useCart = () => {
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const itemsCount = useAppSelector(selectCartItemsCount);
  const discount = useAppSelector(selectDiscount);
  const freeShipping = useAppSelector(selectFreeShipping);
  const promoCode = useAppSelector(selectPromoCode);

  const finalTotal = Math.max(0, total - discount);

  return {
    items,
    total,
    itemsCount,
    discount,
    freeShipping,
    promoCode,
    finalTotal,
  };
};
