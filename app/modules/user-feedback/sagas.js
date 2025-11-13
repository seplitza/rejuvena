/**
 * User Feedback Sagas
 * @flow
 * @format
 */

import {call, takeLatest, put} from 'redux-saga/effects';
import VersionCheck from 'react-native-version-check';
import {request, endpoints} from '@app/api';
import {showToast, showAlert} from '@app/global';
import {presentLoader, dismissLoader} from '@app/modules/common';
import {setUserFeedback} from './slice';

function* setUserFeedbackSaga({payload}) {
  try {
    yield put(presentLoader());
    const {rating, feedback, platform} = payload;
    yield call(request.post, endpoints.post_user_feedback, {
      Ratings: rating,
      Feedback: feedback,
      Platform: platform,
      AppVersion: VersionCheck.getCurrentVersion(),
    });
    showToast({
      message: 'userFeedback.feedbackSavedSuccess',
      duration: 3000,
      position: 'top',
    });
  } catch (error) {
    showAlert('', error.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* userFeedbackSagas(): Saga<void> {
  yield takeLatest(setUserFeedback, setUserFeedbackSaga);
}

export {userFeedbackSagas};
