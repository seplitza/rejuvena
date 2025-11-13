/**
 * Course Description Selectors
 * @flow
 * @format
 */

import {createSelector} from '@reduxjs/toolkit';

const root = (state) => state.courseDescriptionReducer;

export const selectIsGettingCourse = createSelector(
  root,
  (course) => course.gettingCourse,
);

export const selectCourseDetail = createSelector(
  root,
  (course) => course.courseDetail,
);

export const selectIsGettingPlans = createSelector(
  root,
  (plan) => plan.loading,
);

export const selectPlans = createSelector(root, (plan) => plan.plans);

export const selectShowPaymentCancelPopup = createSelector(
  root,
  (plan) => plan.showPaymentCancelPopup,
);
