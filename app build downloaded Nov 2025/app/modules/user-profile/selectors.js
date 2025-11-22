/**
 * User Profile Selectors
 * @flow
 * @format
 */

import {createSelector} from '@reduxjs/toolkit';

const root = (state) => state.userReducer;

export const selectMyProfile = createSelector(root, (user) => user.profile);

export const selectUserId = createSelector(root, (user) => user.profile.id);
