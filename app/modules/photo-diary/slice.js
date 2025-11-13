/**
 * Contest Slice
 * @flow
 * @format
 */

import {createSlice, PayloadAction, createAction} from '@reduxjs/toolkit';

// Types )--------------------------------------
type initialStateTypes = {
  contest: Object,
  images: Array<Object>,
  gettingImages: boolean,
  finalist: Array<Object>,
  winners: Array<Object>,
};

// Initial state
const initialState: initialStateTypes = {
  contest: {},
  images: [],
  gettingImages: true,
  userRecord: [],
  finalist: [],
  winners: [],
};

// Slice
const contestSlice = createSlice({
  name: 'contest',
  initialState,
  reducers: {
    getContestImages(state) {
      state.gettingImages = true;
    },
    setContest(state, action: PayloadAction<Object>) {
      state.contest = action.payload;
    },
    setContestImages(state, action: PayloadAction<Array<Object>>) {
      state.images = action.payload;
      state.gettingImages = false;
    },
    updateIsParticipating(state, action: PayloadAction<Boolean>) {
      state.contest.isContestParticipated = action.payload;
    },
    updateContestRuleAccepted(state, action: PayloadAction<Boolean>) {
      state.contest.contestRulesAccepted = action.payload;
    },
    setUserRecord(state, action: PayloadAction<Boolean>) {
      state.userRecord = action.payload;
    },
    setContestFinalist(state, action: PayloadAction<Array<Object>>) {
      state.finalist = action.payload;
    },
    setContestWinners(state, action: PayloadAction<Array<Object>>) {
      state.winners = action.payload;
    },
    updateContestFinalist(state, action: PayloadAction<Array<Object>>) {
      const finalistIndex = state.finalist.findIndex(
        (finalist) => finalist.id === action.payload.id,
      );
      state.finalist[finalistIndex].isVoted = action.payload.isVoted;
      state.finalist[finalistIndex].totalVote = action.payload.totalVote;
    },
  },
});

// Reducer )--------------------------------------
export const photodiaryReducer = contestSlice.reducer;

// Actions )-------------------------------------
export const {
  getContestImages,
  setContest,
  setContestImages,
  updateIsParticipating,
  updateContestRuleAccepted,
  setUserRecord,
  setContestFinalist,
  updateContestFinalist,
  setContestWinners,
} = contestSlice.actions;

export const uploadImage = createAction('CONTEST/UPLOAD_IMAGE');

export const takePartInContest = createAction('CONTEST/TAKE_PART_IN_CONTEST');

export const acceptOrRejectTerms = createAction('CONTEST/ACCEPT_REJECT_RULES');

export const confirmImage = createAction('CONTEST/CONFIRM_IMAGE');

export const setRecordForBeforePhotoUpload = createAction(
  'CONTEST/SET_RECORD_FOR_BEFORE_PHOTO_UPLOAD',
);

export const getRecordForBeforePhotoUpload = createAction(
  'CONTEST/GET_RECORD_FOR_BEFORE_PHOTO_UPLOAD',
);

export const setUploadedPhotodiary = createAction(
  'CONTEST/SET_UPLOADED_PHOTO_DAIRY',
);

export const voteFinalist = createAction('CONTEST/VOTE_FINALIST');

export const getContest = createAction('CONTEST/GET_CONTEST');

export const getContestWinners = createAction('CONTEST/GET_CONTEST_WINNERS');

export const getContestFinalist = createAction('CONTEST/GET_CONTEST_FINALIST');
