/**
 * Root Saga
 * Combines all feature sagas
 */

import { all, fork } from 'redux-saga/effects';
import { authSagas } from './modules/auth/sagas';
import { coursesSaga } from './modules/courses/sagas';

export function* rootSaga() {
  yield all([
    fork(authSagas),
    fork(coursesSaga),
  ]);
}
