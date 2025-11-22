/**
 * Root Saga
 * Combines all feature sagas
 */

import { all, fork } from 'redux-saga/effects';
import { authSagas } from './modules/auth/sagas';

export function* rootSaga() {
  yield all([
    fork(authSagas),
  ]);
}
