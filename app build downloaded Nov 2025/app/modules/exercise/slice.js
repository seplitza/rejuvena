/**
 * Marathon Exercise Slice
 * @flow
 * @format
 */

import {createSlice, createAction, PayloadAction} from '@reduxjs/toolkit';

// Types )--------------------------------------
type initialStateTypes = {
  currentMarathon: Object | null,
  marathon: Object | null,
  dayExercise: Object,
  gettingMarathon: boolean,
  selectedDay: Object,
  pendingStatusRequest: Object,
  updatedExercisesStatus: Object,
  gettingCommentRequests: Array<string>,
  comments: Object,
  activeExercise: String,
  dayStar: Number,
};

// Initial state
const initialState: initialStateTypes = {
  currentMarathon: null,
  marathon: null,
  dayExercise: null,
  gettingMarathon: true,
  selectedDay: {},
  pendingStatusRequest: {},
  updatedExercisesStatus: {},
  gettingCommentRequests: [],
  comments: {},
  activeExercise: null,
  dayStar: null,
};

// Slice
const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    setCurrentMarathon(state, action: PayloadAction<Object>) {
      state.currentMarathon = action.payload;
    },
    getMarathon(state) {
      state.selectedDay = {};
      state.gettingMarathon = true;
    },
    setMarathon(state, action: PayloadAction<Object>) {
      state.marathon = action.payload;
      state.gettingMarathon = false;
    },
    setDayExercise(state, action: PayloadAction<Object>) {
      state.pendingStatusRequest = {};
      state.updatedExercisesStatus = {};
      state.dayExercise = action.payload;
    },
    updateTermAndConditionFlag(state, action: boolean) {
      state.marathon.isAcceptCourseTerm = action.payload;
    },
    setSelectedDay(state, action: PayloadAction<Object>) {
      state.dayExercise = null;
      state.dayStar = null;
      state.selectedDay = action.payload;
    },
    addChangingStatusRequest(state, action: PayloadAction<string>) {
      state.pendingStatusRequest[action.payload] = true;
    },
    removeChangingStatusRequest(state, action: PayloadAction<string>) {
      state.pendingStatusRequest[action.payload] = false;
    },
    addUpdatedExerciseStatus(state, action: PayloadAction<string>) {
      state.updatedExercisesStatus[action.payload.id] = action.payload.status;
    },
    getComments(state, action: PayloadAction<string>) {
      state.gettingCommentRequests.push(action.payload);
    },
    setComments(state, action: PayloadAction<Object>) {
      const {exerciseId, comments} = action.payload;
      state.gettingCommentRequests = state.gettingCommentRequests.filter(
        (id) => id === exerciseId,
      );
      state.comments[exerciseId] = comments;
    },
    getChildComments(state, action: PayloadAction<Object>) {
      state.gettingCommentRequests.push(action.payload.commentId);
    },
    setChildComments(state, action: PayloadAction<Object>) {
      const {commentId, comments} = action.payload;
      state.gettingCommentRequests = state.gettingCommentRequests.filter(
        (id) => id !== commentId,
      );
      state.comments[commentId] = comments;
    },
    addNewComment(state, action: PayloadAction<Object>) {
      const {id, comment, exerciseId} = action.payload;
      state.comments[id]?.push(comment);
      const commentIndex = state.comments[exerciseId]?.findIndex(
        (c) => c.id === id,
      );
      if (commentIndex !== -1) {
        state.comments[exerciseId][commentIndex].childCommentCount += 1;
      }
    },
    setActiveExerciseId(state, action: String) {
      state.activeExercise = action.payload;
    },
    setDayStar(state, action: Number) {
      state.dayStar = action.payload;
    },
  },
});

// Reducer )--------------------------------------
export const exerciseReducer = exerciseSlice.reducer;

// Actions )-------------------------------------
export const {
  setCurrentMarathon,
  getMarathon,
  setMarathon,
  setDayExercise,
  setSelectedDay,
  updateTermAndConditionFlag,
  addChangingStatusRequest,
  removeChangingStatusRequest,
  addUpdatedExerciseStatus,
  getComments,
  setComments,
  getChildComments,
  setChildComments,
  addNewComment,
  setActiveExerciseId,
  setDayStar,
} = exerciseSlice.actions;

export const getDayExercise = createAction(
  'MARATHON_EXERCISE/GET_DAY_EXERCISE',
);
export const changeExerciseStatus = createAction(
  'MARATHON_EXERCISE/CHANGE_EXERCISE_STATUS',
);

export const acceptMarathonTerms = createAction(
  'MARATHON_EXERCISE/ACCEPT_TERMS',
);

export const postComment = createAction('MARATHON_EXERCISE/POST_COMMENT');

export const activeExerciseId = createAction(
  'MARATHON_EXERCISE/ACTIVE_EXERCISE_ID',
);

export const updateDayStarValue = createAction(
  'MARATHON_EXERCISE/UPDATE_DAY_STAR_VALUE',
);
