/**
 * Contest Sagas
 * @flow
 * @format
 */

import {
  all,
  call,
  takeLatest,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects';
import {request, endpoints} from '@app/api';
import {showAlert, showToast} from '@app/global';
import {NavigationService, trackEvent} from '@app/utils';
import {Routes} from '@app/common';
import {presentLoader, dismissLoader} from '@app/modules/common';
import {getTimezoneOffset} from '@app/utils';
import {selectMarathonId} from '@app/modules/exercise';
import {beforePositions, afterPositions} from './view/photo-diary';
import {
  selectCanShowCongratsScreen,
  selectContest,
  selectContestImages,
  selectUserRecord,
} from './selectors';
import {
  getContestImages,
  setContest,
  setContestImages,
  takePartInContest,
  updateIsParticipating,
  acceptOrRejectTerms,
  updateContestRuleAccepted,
  confirmImage,
  setRecordForBeforePhotoUpload,
  getRecordForBeforePhotoUpload,
  setUserRecord,
  setUploadedPhotodiary,
  getContestFinalist,
  setContestFinalist,
  voteFinalist,
  updateContestFinalist,
  getContestWinners,
  setContestWinners,
  getContest,
} from './slice';

function* getContestImagesSaga() {
  try {
    const marathonId = yield select(selectMarathonId);
    yield call(getContestSaga);
    const contestImages = yield call(
      request.get,
      endpoints.get_contest_images,
      {
        params: {
          contestId: undefined,
          marathonId,
          timeZoneOffset: getTimezoneOffset(),
        },
      },
    );

    yield put(setContestImages(contestImages));
    yield call(getRecordForBeforePhotoUploadSaga);
  } catch (e) {
    showAlert('', e.message);
  }
}

function* getContestSaga() {
  try {
    const marathonId = yield select(selectMarathonId);
    const contest = yield call(request.get, endpoints.get_contest, {
      params: {marathonId},
    });

    yield put(setContest(contest));
  } catch (e) {
    showAlert('', e.message);
  }
}

function* takePartInContestSaga({payload}) {
  try {
    yield put(presentLoader());
    const marathonId = yield select(selectMarathonId);
    yield call(request.get, endpoints.take_part_in_contest, {
      params: {marathonId, isContestParticipated: payload},
    });
    yield put(updateIsParticipating(payload));
    if (payload) {
      trackEvent("'Yes' To Share Images");
    } else {
      trackEvent("'No' To Share Images");
    }
  } catch (e) {
    showAlert('', e.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* acceptOrRejectTermsSaga({payload}) {
  try {
    yield put(presentLoader());
    const marathonId = yield select(selectMarathonId);
    yield call(request.get, endpoints.accept_contest_rules, {
      params: {marathonId, contestRulesAccepted: payload},
    });
    yield put(updateContestRuleAccepted(payload));
    payload && trackEvent('Agree Photo-diary Rules');
  } catch (e) {
    showAlert('', e.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* confirmImageSaga({payload}) {
  try {
    yield put(presentLoader());
    const userRecord = yield select(selectUserRecord);
    const {details, fileName, imgPath} = payload;
    const {contestId, marathonId, imagePosition, maskType} = details;
    const form: any = new FormData();
    form.append(
      'model',
      JSON.stringify({
        ContestId: contestId,
        ImagePostion: imagePosition,
        MarathonId: marathonId,
        masktype: maskType,
      }),
    );
    form.append('fileName', fileName);
    form.append('ImgPath', imgPath);

    const canShowCongratsForBefore = yield select(
      selectCanShowCongratsScreen(beforePositions),
    );
    const canShowCongratsForAfter = yield select(
      selectCanShowCongratsScreen(afterPositions),
    );

    yield call(request.post, endpoints.confirm_contest_image, form);
    yield call(getContestImagesSaga);

    const shouldShowCongratsForBefore =
      canShowCongratsForBefore &&
      !(yield select(selectCanShowCongratsScreen(beforePositions)));
    const shouldShowCongratsForAfter =
      canShowCongratsForAfter &&
      !(yield select(selectCanShowCongratsScreen(afterPositions)));

    if (shouldShowCongratsForBefore || shouldShowCongratsForAfter) {
      yield call(NavigationService.navigate, Routes.CongratsScreen, {
        forAfter: shouldShowCongratsForAfter,
        userRecord,
      });
      trackEvent('VIEW_CONGRATULATIONS_SCREEN');
    }
    trackEvent('Photo-diary Uploaded', {imagePosition, maskType});
  } catch (e) {
    showAlert('', e.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* setRecordForBeforePhotoUploadSaga({payload}) {
  try {
    yield put(presentLoader());
    const marathonId = yield select(selectMarathonId);
    const contest = yield select(selectContest);
    const {isItForAfter, comment, age, weight, height, like} = payload;
    const form: any = new FormData();
    form.append(
      'model',
      JSON.stringify({
        contestId: contest.id,
        marathonId,
        isItForAfter,
        comment,
        age,
        weight,
        height,
        Like: like,
      }),
    );
    yield call(request.post, endpoints.set_record_before_photo_upload, form);
    yield call(getRecordForBeforePhotoUploadSaga);
    showToast({
      message: 'photoDiaryPage.dataUpdatedSuccessfully',
      duration: 4000,
    });
  } catch (e) {
    showAlert('', e.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* getRecordForBeforePhotoUploadSaga() {
  try {
    const marathonId = yield select(selectMarathonId);
    const contest = yield select(selectContest);
    const userRecord = yield call(
      request.get,
      endpoints.get_record_before_photo_upload,
      {
        params: {marathonId, contestId: contest.id},
      },
    );

    yield put(setUserRecord(userRecord));
  } catch (e) {
    showAlert('', e.message);
  }
}

function* setUploadedPhotodiarySaga({payload}) {
  try {
    yield put(presentLoader());
    const marathonId = yield select(selectMarathonId);
    const isItForAfter = payload;
    const form: any = new FormData();
    form.append(
      'model',
      JSON.stringify({
        marathonId,
        isItForAfter,
        Photodiary: true,
        isForPhotodiary: true,
      }),
    );
    yield call(request.post, endpoints.set_record_before_photo_upload, form);
  } catch (e) {
    showAlert('', e.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* getContestFinalistSaga() {
  try {
    yield put(presentLoader());
    const marathonId = yield select(selectMarathonId);
    const contest = yield call(request.get, endpoints.get_voting_contest);
    const response = yield call(request.get, endpoints.get_contest_finalist, {
      params: {marathonId, pageSize: 100, pageIndex: 0},
    });
    yield put(setContest(contest));
    yield put(setContestFinalist(response.items));
  } catch (e) {
    showAlert('', e.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* getContestWinnersSaga() {
  try {
    yield put(presentLoader());
    yield call(getContestSaga);
    const {rejuvenationChallengeId} = yield select(selectContest);
    const response = yield call(request.get, endpoints.get_challenge_winners, {
      params: {rejuvenationChallengeId: rejuvenationChallengeId},
    });
    yield put(setContestWinners(response));
  } catch (e) {
    showAlert('', e.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* voteFinalistSaga({payload}) {
  try {
    const {id, isVoted, totalVote} = payload;
    const marathonId = yield select(selectMarathonId);
    const contest = yield select(selectContest);
    const voted = isVoted ? totalVote + 1 : totalVote - 1;
    yield put(updateContestFinalist({id, isVoted, totalVote: voted}));
    yield call(request.post, endpoints.vote_finalist, {
      contestId: contest?.id,
      marathonId: '8AE4DB8B-B256-462A-8918-7E7811243D64',
      finalistId: id,
      isActive: isVoted,
      timeZoneOffset: getTimezoneOffset(),
    });
    isVoted
      ? trackEvent('Increment Vote For RC')
      : trackEvent('Decrement Vote For RC');
  } catch (e) {
    showAlert('', e.message);
  }
}

function* photodiarySagas() {
  yield all([
    takeEvery(getContest, getContestSaga),
    takeLatest(getContestImages, getContestImagesSaga),
    takeLatest(takePartInContest, takePartInContestSaga),
    takeLatest(acceptOrRejectTerms, acceptOrRejectTermsSaga),
    takeLatest(confirmImage, confirmImageSaga),
    takeLatest(
      setRecordForBeforePhotoUpload,
      setRecordForBeforePhotoUploadSaga,
    ),
    takeLatest(
      getRecordForBeforePhotoUpload,
      getRecordForBeforePhotoUploadSaga,
    ),
    takeLatest(setUploadedPhotodiary, setUploadedPhotodiarySaga),
    takeLatest(getContestFinalist, getContestFinalistSaga),
    takeLatest(getContestWinners, getContestWinnersSaga),
    takeEvery(voteFinalist, voteFinalistSaga),
  ]);
}

export {photodiarySagas};
