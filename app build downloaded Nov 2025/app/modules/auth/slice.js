/**
 * Auth Slice
 * @flow
 * @format
 */

import {createSlice, createAction} from '@reduxjs/toolkit';

type State = {
  gettingGuestUserCourses: boolean,
  guestUserCourses: Array<Object>,
};

const initialState: State = {
  gettingGuestUserCourses: true,
  guestUserCourses: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    getGuestUserMarathon(state) {
      state.gettingGuestUserCourses = true;
    },
    setMarathonCourses(state, action) {
      state.guestUserCourses = action.payload;
      state.gettingGuestUserCourses = false;
    },
  },
});

// Reducer )-------------------------------------
export const authReducer = authSlice.reducer;

// Actions )------------------------------------

export const {getGuestUserMarathon, setMarathonCourses} = authSlice.actions;

export const loginWithEmail = createAction('AUTH/LOGIN_WITH_EMAIL');

export const signupWithEmail = createAction('AUTH/SIGNUP_WITH_EMAIL');

export const sendResetPasswordRequest = createAction('AUTH/RESET_PASSWORD');

export const signInWithGoogle = createAction('AUTH/SIGNIN_WITH_GOOGLE');

export const signInWithFacebook = createAction('AUTH/SIGNIN_WITH_FACEBOOK');

export const signInWithApple = createAction('AUTH/SIGNIN_WITH_APPLE');

export const guestUserLogin = createAction('AUTH/GUEST_USER_LOGIN');
