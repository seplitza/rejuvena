/**
 * Common Slice
 * Global application state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CommonState {
  language: string;
  isLoading: boolean;
  notification: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null;
}

const initialState: CommonState = {
  language: 'en',
  isLoading: false,
  notification: null,
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    showNotification(state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' | 'warning' }>) {
      state.notification = action.payload;
    },
    hideNotification(state) {
      state.notification = null;
    },
  },
});

export const commonReducer = commonSlice.reducer;
export const { setLanguage, setLoading, showNotification, hideNotification } = commonSlice.actions;
