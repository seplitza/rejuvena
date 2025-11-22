/**
 * User Profile Sagas
 * @flow
 * @format
 */

import {call, fork, takeLatest, put, all} from 'redux-saga/effects';
import OneSignal from 'react-native-onesignal';
import {Amplitude} from '@amplitude/react-native';
import {request, endpoints} from '@app/api';
import {showToast, showAlert} from '@app/global';
import {NavigationService, getDeviceLanguage, trackEvent} from '@app/utils';
import {Routes} from '@app/common';
import {presentLoader, dismissLoader, logout} from '@app/modules/common';
import {
  getUserProfile,
  setUserProfile,
  updateUserInfo,
  changePassword,
  deleteAccount,
} from './slice';

function* getUserProfileSaga({payload} = {}) {
  try {
    const user = yield call(request.get, endpoints.get_user_profile);
    yield put(setUserProfile(user));
    if (payload?.fromAppStartup) {
      OneSignal.setExternalUserId(user.id);
      Amplitude.getInstance().setUserId(user.email);
      yield call(request.get, endpoints.set_user_language, {
        params: {
          Email: user.email,
          LanguageCulture: getDeviceLanguage(),
        },
      });
    }
  } catch (error) {
    showAlert('', error.message);
  }
}

function* updateUserInfoSaga({payload}) {
  const {pickedImage, ...otherInfo} = payload;
  const form: any = new FormData();

  try {
    yield put(presentLoader());
    if (pickedImage) {
      form.append('file', {
        name: pickedImage.filename || pickedImage.path.split('/').pop(),
        type: pickedImage.mime,
        uri: pickedImage.path,
      });
    }
    form.append('model', JSON.stringify(otherInfo));

    yield call(request.post, endpoints.update_user_profile, form);

    yield fork(getUserProfileSaga);

    showToast({
      message: 'editProfilePage.updateProfileSuccess',
      duration: 3000,
      position: 'top',
    });
  } catch (error) {
    showAlert('', error.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* changePasswordSaga({payload}) {
  try {
    yield put(presentLoader());
    const {oldPassword, newPassword, confirmPassword} = payload;
    yield call(request.post, endpoints.change_password, {
      password: oldPassword,
      newPassword,
      confirmPassword,
    });
    // Reset screen
    yield call(NavigationService.replace, Routes.UserProfileScreen);
    trackEvent('PASSWORD_CHANGED');
    showToast({
      message: 'editProfilePage.passwordUpdateSuccess',
      duration: 3000,
      position: 'top',
    });
  } catch (error) {
    showAlert('', error.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* deleteAccountSaga() {
  try {
    yield put(presentLoader());
    yield call(request.get, endpoints.delete_account);
    yield put(logout());
    trackEvent('ACCOUNT_DELETED');
    showToast({
      message: 'editProfilePage.accountDeleted',
      duration: 3000,
      position: 'top',
    });
  } catch (error) {
    showAlert('', error.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* userSagas() {
  yield all([
    takeLatest(getUserProfile, getUserProfileSaga),
    takeLatest(updateUserInfo, updateUserInfoSaga),
    takeLatest(changePassword, changePasswordSaga),
    takeLatest(deleteAccount, deleteAccountSaga),
  ]);
}

export {userSagas};
