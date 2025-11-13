/**
 * Common Sagas
 * @flow
 * @format
 */

import {takeLatest, put} from 'redux-saga/effects';
import type {Saga} from 'redux-saga';
import {Routes} from '@app/common';
import {setLanguage} from '@app/translations';
import {trackEvent} from '@app/utils';
import {changeLanguage, logout, setLogout} from './slice';

function* changeLanguageSaga({payload: language}) {
  try {
    setLanguage(language);
  } catch {}
}

function* logoutSaga({payload} = {}) {
  try {
    let initialRoute = Routes.LoginScreen;
    if (payload?.showSingUpScreen) {
      initialRoute = Routes.SignUpScreen;
    }
    yield put(setLogout({initialRoute}));
    trackEvent('LOGOUT');
  } catch {}
}

function* commonSagas(): Saga<void> {
  yield takeLatest(changeLanguage, changeLanguageSaga);
  yield takeLatest(logout, logoutSaga);
}

export {commonSagas};
