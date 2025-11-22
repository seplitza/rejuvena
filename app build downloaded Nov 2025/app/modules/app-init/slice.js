/**
 * App Init Slice
 * @flow
 * @format
 */

import { createSlice, createAction } from '@reduxjs/toolkit';

type State = {
  ready: boolean,
};

const initialState: State = {
  ready: false,
};

const appInitSlice = createSlice({
  name: 'appInit',
  initialState,
  reducers: {
    markAppAsReady(state) {
      state.ready = true;
    },
  },
});

// Reducer )-------------------------------------
export const appInitReducer = appInitSlice.reducer;

// Actions )-------------------------------------
export const { markAppAsReady } = appInitSlice.actions;

export const initApp = createAction('APP_INIT/INIT_APP');