/**
 * Order List Selectors
 * @flow
 * @format
 */

import {createSelector} from '@reduxjs/toolkit';

const root = (state) => state.orderReducer;

export const selectIsGettingOrders = createSelector(
  root,
  (order) => order.gettingOrders,
);

export const selectOrders = createSelector(root, (order) => order.orders);

export const selectScreenParams = createSelector(
  root,
  (order) => order.screenParams,
);
