/**
 * Notification Selectors
 * @flow
 * @format
 */

import {createSelector} from '@reduxjs/toolkit';

const root = (state) => state.notificationReducer;

export const selectIsGettingNotifications = createSelector(
  root,
  (notifications) => notifications.gettingNotifications,
);

export const selectNotifications = createSelector(root, (notifications) => {
  const removeDuplicateNotifications = [];
  notifications.notifications.reduce((acc, curr) => {
    if (acc.indexOf(curr.id) === -1) {
      acc.push(curr.id);
      removeDuplicateNotifications.push(curr);
    }
    return acc;
  }, []);
  return removeDuplicateNotifications;
});

export const selectNotificationsSettings = createSelector(
  root,
  (notifications) => notifications.notificationsSetting,
);
