/**
 * Auth Slice
 * State management for authentication
 */

import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
    },
  },
});

// Reducer
export const authReducer = authSlice.reducer;

// Sync Actions
export const { setAuthToken, setUser, setLoading, setError, logout } = authSlice.actions;

// Async Actions (for sagas)
export const loginWithEmail = createAction<{ email: string; password: string }>('AUTH/LOGIN_WITH_EMAIL');
export const signupWithEmail = createAction<{ email: string; firstName: string; lastName: string }>('AUTH/SIGNUP_WITH_EMAIL');
export const sendResetPasswordRequest = createAction<{ email: string }>('AUTH/RESET_PASSWORD');
export const signInWithGoogle = createAction('AUTH/SIGNIN_WITH_GOOGLE');
export const signInWithFacebook = createAction('AUTH/SIGNIN_WITH_FACEBOOK');
export const guestUserLogin = createAction('AUTH/GUEST_USER_LOGIN');
