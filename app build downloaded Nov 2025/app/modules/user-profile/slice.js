/**
 * User Profile Slice
 * @flow
 * @format
 */

import {createSlice, createAction, PayloadAction} from '@reduxjs/toolkit';

type State = {
  profile: Object | null,
  gettingProfile: boolean,
};

const initialState: State = {
  profile: null,
  gettingProfile: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUserProfile(state) {
      state.gettingProfile = true;
    },
    setUserProfile(state, action: PayloadAction<Object>) {
      state.profile = action.payload;
    },
  },
});

// Reducer )-------------------------------------
export const userReducer = userSlice.reducer;

// Actions )-------------------------------------
export const {getUserProfile, setUserProfile} = userSlice.actions;

export const updateUserInfo = createAction('USER_PROFILE/UPDATE_USER_INFO');

export const changePassword = createAction('USER_PROFILE/CHANGE_PASSWORD');

export const deleteAccount = createAction('USER_PROFILE/DELETE_ACCOUNT');
