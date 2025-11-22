/**
 * Order List Slice
 * @flow
 * @format
 */

import {createSlice, createAction, PayloadAction} from '@reduxjs/toolkit';

type State = {
  orders: Object | null,
  gettingOrders: boolean,
  screenParams: Object | null,
};

const initialState: State = {
  orders: null,
  gettingOrders: true,
  screenParams: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    getOrders(state) {
      state.gettingOrders = true;
    },
    setOrders(state, action: PayloadAction<Array<Object>>) {
      state.orders = action.payload;
      state.gettingOrders = false;
    },
    setScreenParams(state, action: PayloadAction<string>) {
      state.screenParams = action.payload;
    },
  },
});

// Reducer )--------------------------------------
export const orderReducer = orderSlice.reducer;

// Actions )-------------------------------------
export const {getOrders, setOrders, setScreenParams} = orderSlice.actions;

export const purchaseCourse = createAction('ORDER/PURCHASE_COURSE');
