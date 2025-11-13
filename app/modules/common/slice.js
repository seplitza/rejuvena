/**
 * Common Slice
 * @flow
 * @format
 */

import {createSlice, PayloadAction, createAction} from '@reduxjs/toolkit';

type State = {
  activeSection: string | null,
  sectionInitialRoute: string | null,
  authToken: string | null,
  playerId: string | null,
  isNewUser: boolean,
  language: string | null,
  isGuestUser: boolean,
  shouldShowTooltip: boolean,
};

const initialState: State = {
  activeSection: null,
  sectionInitialRoute: null,
  authToken: null,
  playerId: null,
  isNewUser: true,
  generalSettings: null,
  language: null,
  isGuestUser: false,
  shouldShowTooltip: true,
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    changeAppSection(state, action: PayloadAction<Object>) {
      state.activeSection = action.payload.section;
      state.sectionInitialRoute = action.payload.initialRoute;
    },
    setAuthToken(state, action: PayloadAction<string>) {
      state.authToken = action.payload;
    },
    setPlayerId(state, action: PayloadAction<string>) {
      state.playerId = action.payload;
    },
    setNewUser(state, action: boolean) {
      state.isNewUser = action.payload;
    },
    setGuestUser(state, action: boolean) {
      state.isGuestUser = action.payload;
    },
    setGeneralSettings(state, action: PayloadAction<Object>) {
      state.generalSettings = action.payload;
    },
    changeLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
    setTooltip(state, action: boolean) {
      state.shouldShowTooltip = action.payload;
    },
    setLogout(state, action: PayloadAction<string>) {
      Object.entries(initialState).forEach(([key, value]) => {
        // Language preference & general settings shouldn't clear
        if (key !== 'generalSettings') {
          state[key] = value;
        }
        state.sectionInitialRoute = action.payload.initialRoute;
      });
    },
  },
});

// Reducer )--------------------------------------
export const commonReducer = commonSlice.reducer;

// Actions )-------------------------------------
export const {
  changeAppSection,
  setAuthToken,
  setGeneralSettings,
  setPlayerId,
  setLogout,
  setNewUser,
  changeLanguage,
  setGuestUser,
  setTooltip,
} = commonSlice.actions;

export const logout = createAction('COMMON/LOGOUT');
