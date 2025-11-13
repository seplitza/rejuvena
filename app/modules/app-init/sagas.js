/**
 * App Init Sagas
 * @flow
 * @format
 */

import {call, takeLatest, select, put, all} from 'redux-saga/effects';
import type {Saga} from 'redux-saga';
import {request, endpoints} from '@app/api';
import Orientation from 'react-native-orientation-locker';
import {AuthToken, getTimezoneOffset} from '@app/utils';
import {AppSection, Routes} from '@app/common';
import {
  changeAppSection,
  selectAuthToken,
  selectGuestUser,
  setGeneralSettings,
} from '@app/modules/common';
import {getUserProfile} from '@app/modules/user-profile';
import {setCurrentMarathon} from '@app/modules/exercise';
import {getNotifications} from '@app/modules/notification';
import {initApp, markAppAsReady} from './slice';
try {
  Orientation?.lockToPortrait();
} catch (err) {
  console.log(err);
}
function* initAppSaga() {
  try {
    const [settings, authToken] = yield all([
      call(request.get, endpoints.get_general_settings),
      select(selectAuthToken),
    ]);

    const generalSettings = settings.items.reduce((acc, setting) => {
      acc[setting.settingName] = setting.settingValue;
      return acc;
    }, {});

    yield put(setGeneralSettings(generalSettings));
    // Set token in global scope to attach token with api requests
    AuthToken.set(authToken);

    if (!authToken) {
      yield put(changeAppSection({section: AppSection.AuthSection}));
    } else {
      yield call(decideAppSectionSaga);
    }
  } catch {
    yield put(changeAppSection({section: AppSection.AuthSection}));
  } finally {
    yield put(markAppAsReady());
  }
}

function* decideAppSectionSaga(payload = {}): Saga<void> {
  yield put(getUserProfile({fromAppStartup: true}));
  yield put(getNotifications());
  const isGuestUser = yield select(selectGuestUser);

  const currentMarathon = yield call(
    request.get,
    endpoints.get_current_marathon,
    {
      params: {timeZoneOffset: getTimezoneOffset()},
    },
  );
  yield put(setCurrentMarathon(currentMarathon));

  const {orderStatus} = currentMarathon;

  let initialRoute = isGuestUser
    ? Routes.GuestUserScreen
    : Routes.OrderListScreen;

  if (orderStatus === 'Approved') {
    initialRoute = Routes.ExerciseScreen;
  }
  yield put(changeAppSection({section: AppSection.MainSection, initialRoute}));

  setTimeout(() => {
    Orientation.unlockAllOrientations();
  }, 300);
}

function* appInitSagas(): Saga<void> {
  yield takeLatest(initApp, initAppSaga);
}

export {appInitSagas, decideAppSectionSaga};
