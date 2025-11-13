/**
 * Auth Selectors
 * @flow
 * @format
 */

import {createSelector} from '@reduxjs/toolkit';

const root = (state) => state.authReducer;

export const selectIsGettingGuestUserCourses = createSelector(
  root,
  (auth) => auth.gettingGuestUserCourses,
);

export const selectGuestUserCourses = createSelector(
  root,
  (auth) => auth.guestUserCourses,
);
