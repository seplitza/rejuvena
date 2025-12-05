/**
 * Root Reducer
 * Combines all feature reducers
 */

import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from './modules/auth/slice';
import { commonReducer } from './modules/common/slice';
import { coursesReducer } from './modules/courses/slice';

export const rootReducer = combineReducers({
  auth: authReducer,
  common: commonReducer,
  courses: coursesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
