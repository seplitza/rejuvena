/**
 * Loader, Error Slice
 * @flow
 * @format
 */

import {createSlice} from '@reduxjs/toolkit';

type State = {
  loaderCount: number,
};

const initialState: State = {
  loaderCount: 0,
};

const loaderAndErrorSlice = createSlice({
  name: 'loaderAndError',
  initialState,
  reducers: {
    presentLoader(state) {
      state.loaderCount = state.loaderCount + 1;
    },
    dismissLoader(state) {
      const {loaderCount} = state;
      state.loaderCount = loaderCount <= 0 ? loaderCount : loaderCount - 1;
    },
  },
});

// Reducer )--------------------------------------
export const loaderAndErrorReducer = loaderAndErrorSlice.reducer;

// Actions )-------------------------------------
export const {presentLoader, dismissLoader} = loaderAndErrorSlice.actions;
