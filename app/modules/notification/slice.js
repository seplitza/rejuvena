/**
 * Notification Slice
 * @flow
 * @format
 */

import {createSlice, createAction, PayloadAction} from '@reduxjs/toolkit';

type State = {};

// Initial state
const initialState: State = {
  gettingNotifications: true,
  notifications: [],
  notificationsSetting: {},
};

// Slice
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    getNotifications(state) {
      state.gettingNotifications = true;
    },
    setNotifications(state, action: PayloadAction<Object>) {
      state.notifications = action.payload;
      state.gettingNotifications = false;
    },
    setNotificationSettings(state, action: PayloadAction<Object>) {
      state.notificationsSetting = action.payload;
    },
  },
});

// Reducer )-------------------------------------
export const notificationReducer = notificationSlice.reducer;

// Actions )-------------------------------------
export const {
  getNotifications,
  setNotifications,
  setNotificationSettings,
} = notificationSlice.actions;

export const markAsRead = createAction('NOTIFICATION/MARK_AS_READ');
export const deleteNotification = createAction(
  'NOTIFICATION/DELETE_NOTIFICATION',
);
export const setNotificationsSettings = createAction(
  'NOTIFICATION/SET_NOTIFICATION_SETTING',
);
export const getNotificationsSettings = createAction(
  'NOTIFICATION/GET_NOTIFICATION_SETTING',
);
