/**
 * User Feedback Slice
 * @flow
 * @format
 */

import {createSlice, createAction} from '@reduxjs/toolkit';

type State = {};

const initialState: State = {};

const userFeedbackSlice = createSlice({
  name: 'userFeedback',
  initialState,
  reducers: {},
});

// Reducer )-------------------------------------
export const userFeedbackReducer = userFeedbackSlice.reducer;

// Actions )------------------------------------
export const setUserFeedback = createAction('USER_FEEDBACK/SET_USER_FEEDBACK');
