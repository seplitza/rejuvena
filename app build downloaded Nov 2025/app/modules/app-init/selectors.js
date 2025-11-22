/**
 * App Init Selectors
 * @flow
 * @format
 */

import {createSelector} from '@reduxjs/toolkit';

const root = (state) => state.appInitReducer;

export const selectIsAppReady = createSelector(
  root,
  (appInit) => appInit.ready,
);
