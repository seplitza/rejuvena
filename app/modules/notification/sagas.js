/**
 * Notification Sagas
 * @flow
 * @format
 */

import {call, takeLatest, takeEvery, put, all} from 'redux-saga/effects';
import {request, endpoints} from '@app/api';
import {dismissLoader, presentLoader} from '@app/modules/common';
import {
  getNotifications,
  setNotifications,
  markAsRead,
  deleteNotification,
  setNotificationsSettings,
  getNotificationsSettings,
  setNotificationSettings,
} from './slice';
import {getTimezoneOffset} from '@app/utils';
import {showToast, showAlert} from '@app/global';

function* getNotificationsSaga() {
  try {
    const {newNotification, oldNotification} = yield call(
      request.get,
      endpoints.get_notifications,
      {
        params: {
          timeZone: getTimezoneOffset(),
        },
      },
    );
    yield put(
      setNotifications([
        ...newNotification?.map((notification) => ({
          ...notification,
          isNew: true,
        })),
        ...oldNotification,
      ]),
    );
  } catch (error) {
    showAlert('', error.message);
  }
}

function* markAsReadSaga({payload: notificationId}) {
  try {
    yield call(request.post, endpoints.mark_notifications_read, [
      notificationId,
    ]);
  } catch (error) {
    showAlert('', error.message);
  }
}

function* deleteNotificationSaga({payload}) {
  try {
    yield put(presentLoader());
    yield call(request.post, endpoints.delete_notification, {
      notificationId: payload,
    });
    yield call(getNotificationsSaga);
  } catch (error) {
    showToast({message: error.message, position: 'top', type: 'error'});
  } finally {
    yield put(dismissLoader());
  }
}

function* setNotificationsSettingsSaga({payload}) {
  try {
    yield put(presentLoader());
    const {
      dailyReminder,
      morningReminder,
      massageReminder,
      morningReminderTime,
      massageReminderTime,
      morningReminderDays,
      massageReminderDays,
    } = payload;

    const form: any = new FormData();
    form.append(
      'model',
      JSON.stringify({
        DailyReminder: dailyReminder,
        MassageReminder: massageReminder,
        MorningReminder: morningReminder,
        MorningReminderDays: morningReminderDays,
        MassageReminderDays: massageReminderDays,
        MassageReminderTime: massageReminderTime,
        MorningReminderTime: morningReminderTime,
      }),
    );
    yield call(request.post, endpoints.set_notification_setting, form);
    showToast({
      message: 'notification.settingSavedSuccess',
      duration: 3000,
      position: 'top',
    });
    yield call(getNotificationsSettingsSaga);
  } catch (error) {
    showAlert('', error.message);
  } finally {
    yield put(dismissLoader());
  }
}
function* getNotificationsSettingsSaga() {
  try {
    const settings = yield call(
      request.get,
      endpoints.get_notification_setting,
    );
    yield put(setNotificationSettings(settings));
  } catch (error) {
    console.log(error.message);
  }
}

function* notificationSagas() {
  yield all([
    takeLatest(getNotifications, getNotificationsSaga),
    takeEvery(markAsRead, markAsReadSaga),
    takeLatest(deleteNotification, deleteNotificationSaga),
    takeLatest(setNotificationsSettings, setNotificationsSettingsSaga),
    takeLatest(getNotificationsSettings, getNotificationsSettingsSaga),
  ]);
}

export {notificationSagas};
