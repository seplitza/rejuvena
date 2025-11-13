/**
 * Exercise Sagas
 * @flow
 * @format
 */

import {
  call,
  takeLatest,
  put,
  takeEvery,
  all,
  select,
  fork,
} from 'redux-saga/effects';
import {request, endpoints} from '@app/api';
import {showAlert} from '@app/global';
import {getTimezoneOffset, trackEvent, ratingChecker} from '@app/utils';
import {presentLoader, dismissLoader} from '@app/modules/common';
import {selectMarathonId} from './selectors';
import * as actions from './slice';

function* getMarathonSaga({payload} = {}) {
  try {
    const id = yield select(selectMarathonId);
    const marathonId = payload || id;
    const response = yield call(request.get, endpoints.get_start_marathon, {
      params: {
        marathonId,
        timeZoneOffset: getTimezoneOffset(),
      },
    });
    yield put(actions.setMarathon(response));
  } catch (e) {
    showAlert('', e.message);
  }
}

function* acceptMarathonTermsSaga({payload}) {
  try {
    yield put(presentLoader());
    const status = payload;
    const marathonId = yield select(selectMarathonId);
    const response = yield call(request.get, endpoints.accept_marathon_terms, {
      params: {status, courseId: marathonId},
    });
    trackEvent('ACCEPT_COURSE_RULES', {status});
    yield put(actions.updateTermAndConditionFlag(response));
  } catch (e) {
    showAlert('', e.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* getDayExerciseSaga({payload}) {
  try {
    yield put(presentLoader());
    const {dayId, marathonId, productTitle} = payload;
    const response = yield call(request.get, endpoints.get_day_exercises, {
      params: {
        marathonId,
        dayId,
        timeZoneOffset: getTimezoneOffset(),
      },
    });
    const {
      id,
      day,
      description,
      dayDate,
      isShowThreeStarPopup,
      isShowFiveStarPopup,
    } = response.marathonDay;

    yield put(
      actions.setSelectedDay({
        id,
        day,
        description,
        productTitle,
        date: dayDate,
        isShowThreeStarPopup,
        isShowFiveStarPopup,
      }),
    );
    yield put(actions.setDayExercise(response));
    trackEvent('Exercise', {day, productTitle, title: response?.title});
  } catch (e) {
    showAlert('', e.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* changeExerciseStatusSaga({payload}) {
  const {dayId, marathonExerciseId, status, uniqueId} = payload;
  try {
    yield put(actions.addChangingStatusRequest(uniqueId));
    const response = yield call(
      request.post,
      endpoints.change_exercise_status,
      {
        dayId,
        marathonExerciseId,
        status,
      },
    );
    yield put(
      actions.addUpdatedExerciseStatus({
        id: uniqueId,
        status,
      }),
    );
    yield fork(getMarathonSaga);
    const {day, isPracticeDay, progress} = response;
    trackEvent('Star', {
      day: day,
      star: ratingChecker(progress),
      productTitle: isPracticeDay ? 'Practice' : 'Study',
    });
    yield put(actions.setDayStar(ratingChecker(progress)));
  } catch {
  } finally {
    yield put(actions.removeChangingStatusRequest(uniqueId));
  }
}

function* getCommentsSaga({payload}) {
  try {
    yield put(presentLoader());
    const {exerciseId} = payload;
    const marathonId = yield select(selectMarathonId);

    const {items} = yield call(request.get, endpoints.get_comments, {
      params: {
        exerciseId,
        marathonId,
        timeZoneOffset: getTimezoneOffset(),
      },
    });
    yield put(actions.setComments({exerciseId, comments: items}));
  } catch {
    // Log error
  } finally {
    yield put(dismissLoader());
  }
}

function* getChildCommentsSaga({payload}) {
  try {
    const {commentId, exerciseId} = payload;
    const marathonId = yield select(selectMarathonId);

    const {items} = yield call(request.get, endpoints.get_child_comments, {
      params: {
        commentId,
        exerciseId,
        marathonId,
        timeZoneOffset: getTimezoneOffset(),
      },
    });
    yield put(
      actions.setChildComments({
        commentId,
        comments: items.map((comment) => ({
          ...comment,
          parentCommentId: commentId,
        })),
      }),
    );
  } catch {
    // Log error
  }
}

function* postCommentSaga({payload}) {
  try {
    yield put(presentLoader());
    const {comment, commentId, exerciseId, parentCommentId} = payload;
    const marathonId = yield select(selectMarathonId);
    const newComment = yield call(request.post, endpoints.post_comment, {
      comment,
      commentId,
      exerciseId,
      marathonId,
      parentCommentId,
      timeZoneOffset: getTimezoneOffset(),
    });
    yield put(
      actions.addNewComment({
        id: commentId || exerciseId,
        comment: newComment,
        exerciseId,
      }),
    );
  } catch (e) {
    showAlert('', e.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* activeExerciseIdSaga({payload}) {
  const {exerciseId} = payload;
  yield put(actions.setActiveExerciseId(exerciseId));
}

function* updateDayStarValueSaga({payload}) {
  try {
    yield put(presentLoader());
    const marathonId = yield select(selectMarathonId);
    const {dayId, value, popup, productTitle} = payload;
    yield call(request.get, endpoints.updateDayStarValue, {
      params: {
        dayId,
        value,
        popup,
        timeZoneOffset: getTimezoneOffset(),
      },
    });
    yield put(
      actions.getDayExercise({
        dayId,
        marathonId,
        productTitle,
      }),
    );
  } catch (e) {
    showAlert('', e.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* exerciseSagas() {
  yield all([
    takeLatest(actions.getMarathon, getMarathonSaga),
    takeLatest(actions.acceptMarathonTerms, acceptMarathonTermsSaga),
    takeLatest(actions.getDayExercise, getDayExerciseSaga),
    takeEvery(actions.changeExerciseStatus, changeExerciseStatusSaga),
    takeLatest(actions.getComments, getCommentsSaga),
    takeLatest(actions.getChildComments, getChildCommentsSaga),
    takeLatest(actions.postComment, postCommentSaga),
    takeLatest(actions.activeExerciseId, activeExerciseIdSaga),
    takeLatest(actions.updateDayStarValue, updateDayStarValueSaga),
  ]);
}

export {exerciseSagas};
