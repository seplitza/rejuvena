/**
 * Marathon Exercise Selectors
 * @flow
 * @format
 */

import {createSelector} from '@reduxjs/toolkit';

const root = (state) => state.exerciseReducer;

export const selectIsGettingMarathon = createSelector(
  root,
  (marathon) => marathon.gettingMarathon,
);

export const selectMarathon = createSelector(
  root,
  (marathon) => marathon.marathon,
);

export const selectMarathonRegulation = createSelector(
  root,
  (marathon) => marathon.marathon?.rule?.rule,
);

export const selectIsTermsAccepted = createSelector(
  root,
  (marathon) =>
    marathon.marathon?.isAcceptCourseTerm ||
    marathon.marathon?.productType === 'Extension',
);

export const selectDayExercise = createSelector(root, (marathon) => {
  return marathon.dayExercise;
});

export const selectDayCategories = createSelector(root, (marathon) => {
  return marathon.dayExercise?.marathonDay?.dayCategories;
});

export const selectNewExercise = createSelector(root, (marathon) => {
  return marathon.dayExercise?.marathonDay.exercises;
});

export const selectCurrentMarathonId = createSelector(root, (marathon) => {
  return marathon.currentMarathon?.id;
});

export const selectMarathonId = createSelector(root, (marathon) => {
  return marathon.marathon?.marathonId;
});

export const selectIsContestAvailable = createSelector(root, (marathon) => {
  return marathon.marathon?.marathonId;
});

export const selectSelectedDay = createSelector(root, (marathon) => {
  return marathon.selectedDay;
});

export const selectChangingStatusRequests = createSelector(root, (marathon) => {
  return marathon.pendingStatusRequest;
});

export const selectUpdatedExercisesStatus = createSelector(root, (marathon) => {
  return marathon.updatedExercisesStatus;
});

export const selectComments = (state, exerciseId) =>
  createSelector(root, (marathon) => {
    return marathon.comments?.[exerciseId];
  });

export const selectCommentRequests = () =>
  createSelector(root, (marathon) => {
    return marathon.gettingCommentRequests;
  });

export const selectAllComments = () =>
  createSelector(root, (marathon) => {
    return marathon.comments;
  });

export const selectIsStartSelected = createSelector(root, (marathon) => {
  return marathon.selectedDay?.start;
});

export const selectIsSSC = createSelector(root, (marathon) => {
  return marathon.marathon?.productType === 'Course';
});

export const selectActiveExercise = createSelector(
  root,
  (marathon) => marathon.activeExercise,
);

export const selectCourseLanguage = createSelector(
  root,
  (marathon) => marathon.marathon?.languageCulture,
);

export const selectDemoCourse = createSelector(
  root,
  (marathon) => marathon.marathon?.isDemoCourse,
);

export const selectIsTabBarVisible = createSelector(root, (marathon) => {
  return !!marathon.marathon?.marathonId;
});

export const selectDayStar = createSelector(root, (marathon) => {
  return marathon.dayStar;
});
