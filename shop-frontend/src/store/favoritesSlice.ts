import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types/shop';
import { RootState } from './index';

interface FavoritesState {
  items: Product[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<Product>) => {
      const exists = state.items.find(item => item._id === action.payload._id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
    toggleFavorite: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(item => item._id === action.payload._id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { addToFavorites, removeFromFavorites, toggleFavorite, clearFavorites } = favoritesSlice.actions;

// Selectors
export const selectFavorites = (state: RootState) => state.favorites.items;
export const selectIsFavorite = (productId: string) => (state: RootState) =>
  state.favorites.items.some(item => item._id === productId);
export const selectFavoritesCount = (state: RootState) => state.favorites.items.length;

export default favoritesSlice.reducer;
