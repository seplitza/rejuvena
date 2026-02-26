import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product } from '@/types/shop';

interface CartState {
  items: CartItem[];
  promoCode?: string;
  discount: number;
  freeShipping: boolean;
}

const initialState: CartState = {
  items: [],
  discount: 0,
  freeShipping: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const existingItem = state.items.find(
        (item) => item.product._id === action.payload.product._id
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push({
          product: action.payload.product,
          quantity: action.payload.quantity,
        });
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.product._id !== action.payload);
    },

    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find((item) => item.product._id === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.promoCode = undefined;
      state.discount = 0;
      state.freeShipping = false;
    },

    applyPromoCode: (
      state,
      action: PayloadAction<{ code: string; discount: number; freeShipping?: boolean }>
    ) => {
      state.promoCode = action.payload.code;
      state.discount = action.payload.discount;
      state.freeShipping = action.payload.freeShipping || false;
    },

    removePromoCode: (state) => {
      state.promoCode = undefined;
      state.discount = 0;
      state.freeShipping = false;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyPromoCode,
  removePromoCode,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
export const selectCartItemsCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectDiscount = (state: { cart: CartState }) => state.cart.discount;
export const selectFreeShipping = (state: { cart: CartState }) => state.cart.freeShipping;
export const selectPromoCode = (state: { cart: CartState }) => state.cart.promoCode;

export default cartSlice.reducer;
