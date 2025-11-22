/**
 * Course Description Slice
 * @flow
 * @format
 */

import {createSlice, PayloadAction, createAction} from '@reduxjs/toolkit';

type State = {
  courseDetail: Object | null,
  gettingCourse: boolean,
  loading: Boolean,
  plans: Array<Object>,
  showPaymentCancelPopup: Boolean,
};

const initialState: State = {
  courseDetail: null,
  gettingCourse: true,
  loading: true,
  plans: [],
  showPaymentCancelPopup: false,
};

const courseDescriptionSlice = createSlice({
  name: 'courseDescription',
  initialState,
  reducers: {
    getCourseDetail(state) {
      state.gettingCourse = true;
    },
    setCourseDetail(state, action: PayloadAction<Object>) {
      state.courseDetail = action.payload;
      state.gettingCourse = false;
    },
    getPlans(state) {
      state.loading = true;
      state.plans = [];
    },
    setPlans(state, action) {
      state.plans = action.payload;
      state.loading = false;
    },
    setPaymentCancelPopup(state, action: boolean) {
      state.showPaymentCancelPopup = action.payload;
    },
  },
});

// Reducer )--------------------------------------
export const courseDescriptionReducer = courseDescriptionSlice.reducer;

// Actions )-------------------------------------
export const {
  getCourseDetail,
  setCourseDetail,
  getPlans,
  setPlans,
  setPaymentCancelPopup,
} = courseDescriptionSlice.actions;

export const freeCourseUnsubscribe = createAction(
  'COURSE/FREE_COURSE_UNSUBSCRIBE',
);

export const subscribeToCourse = createAction('COURSE/SUBSCRIBE_TO_COURSE');
