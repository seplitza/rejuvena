/**
 * Contest Selectors
 * @flow
 * @format
 */

import {createSelector} from '@reduxjs/toolkit';

const root = (state) => state.photodiaryReducer;

export const selectContestImages = createSelector(root, (contest) => {
  return (
    contest.images?.reduce((acc, value) => {
      acc[value.imagePostion] = value;
      return acc;
    }, {}) || {}
  );
});

export const selectIsGettingImages = createSelector(root, (contest) => {
  return contest.gettingImages;
});

export const selectContest = createSelector(root, (contest) => {
  return contest.contest;
});

export const selectIsTermsAccepted = createSelector(root, (contest) => {
  return contest.contest.contestRulesAccepted;
});

export const selectCanShowCongratsScreen = (positionArray) =>
  createSelector(root, (contest) => {
    return positionArray.some((position) => {
      return !contest.images.some((record) => record.imagePostion === position);
    });
  });

export const selectUserRecord = createSelector(root, (contest) => {
  return contest.userRecord;
});

export const selectFinalist = createSelector(root, (contest) => {
  return contest.finalist;
});

export const selectWinners = createSelector(root, (contest) => {
  return contest.winners;
});
