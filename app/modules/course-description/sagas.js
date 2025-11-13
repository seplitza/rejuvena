/**
 * Course Description Sagas
 * @flow
 * @format
 */

import {Platform} from 'react-native';
import {call, takeLatest, put, all} from 'redux-saga/effects';
import * as RNIap from 'react-native-iap';
import branch from 'react-native-branch';
import {Routes} from '@app/common';
import {NavigationService, trackEvent} from '@app/utils';
import {setScreenParams} from '@app/modules/order-list';
import {request, endpoints} from '@app/api';
import {presentLoader, dismissLoader} from '@app/modules/common';
import {showAlert} from '@app/global';
import {getOrders} from '@app/modules/order-list';
import {setMarathon} from '@app/modules/exercise';
import {
  getCourseDetail,
  setCourseDetail,
  freeCourseUnsubscribe,
  setPaymentCancelPopup,
} from './slice';
import {getPlans, setPlans, subscribeToCourse} from './slice';

function* getCourseDetailSaga({payload}) {
  try {
    const course = yield call(request.get, endpoints.get_course_detail, {
      params: {marathonid: payload},
    });
    yield put(setCourseDetail(course));
  } catch {}
}

function* freeCourseUnsubscribeSaga({payload}) {
  try {
    yield put(presentLoader());
    yield call(request.get, endpoints.freeCourseUnsubscribe, {
      params: {marathonId: payload},
    });
    yield put(getOrders());
    yield put(setMarathon(null));
    yield call(NavigationService.reset, 'tabs', {
      screen: Routes.OrderListScreen,
    });
    trackEvent('Free Course Unsubscribed');
  } catch (e) {
    showAlert('', e.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* getPlansSaga({payload}) {
  try {
    const lastParams = yield branch.getLatestReferringParams();
    const plans = yield call(request.get, endpoints.get_course_plans, {
      params: {courseId: payload},
    });
    let subscriptions = yield call(
      RNIap.getSubscriptions,
      Platform.select({
        android: plans.map(({androidProductId}) => androidProductId),
        ios: plans.map(({iosProductId}) => iosProductId),
      }),
    );
    // Sort by price
    subscriptions = subscriptions.sort((a, b) => {
      return Number(a.price) - Number(b.price);
    });
    let mergedPlanAndSubscription = subscriptions.map((subscription) => {
      const plan =
        plans.find(
          ({androidProductId, iosProductId}) =>
            androidProductId === subscription.productId ||
            iosProductId === subscription.productId,
        ) || {};

      return {...plan, subscription};
    });
    if (lastParams?.referral_code == null) {
      mergedPlanAndSubscription = mergedPlanAndSubscription?.filter(
        (e) => e.isSpacial === false,
      );
    }
    yield put(setPlans(mergedPlanAndSubscription));
  } catch (err) {
    console.log(err);
  }
}

function* subscribeToCourseSaga({payload}) {
  try {
    yield put(presentLoader());
    const {productId, courseId, planId} = payload;
    let lastParams = yield branch.getLatestReferringParams();
    const orderId = yield call(request.get, endpoints.init_order, {
      params: {
        marathonId: courseId,
        referralCode: lastParams?.referral_code,
        planId,
      },
    });
    if (Platform.OS === 'ios') {
      yield call(RNIap.requestPurchase, productId);
    } else {
      const response = yield call(RNIap.requestSubscription, productId);
      const data: any = new FormData();
      data.append('orderid', orderId);
      data.append('receipt', response.transactionReceipt);

      yield call(request.post, endpoints.googleSubscribe, data, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });

      yield call(RNIap.finishTransaction, response);
      trackEvent('Subscribed Course', {productId});
      const params = {
        marathonId: courseId,
        shouldShowStartPage: true,
        isTrail: true,
      };
      yield put(setScreenParams(params));

      yield call(NavigationService.reset, 'tabs', {
        screen: Routes.ExerciseScreen,
      });
    }
  } catch (err) {
    if (err.code === 'E_USER_CANCELLED') {
      yield put(setPaymentCancelPopup(true));
    } else {
      showAlert('', err.message);
    }
  } finally {
    yield put(dismissLoader());
  }
}

function* courseDescriptionSagas() {
  yield all([
    takeLatest(getCourseDetail, getCourseDetailSaga),
    takeLatest(freeCourseUnsubscribe, freeCourseUnsubscribeSaga),
    takeLatest(getPlans, getPlansSaga),
    takeLatest(subscribeToCourse, subscribeToCourseSaga),
  ]);
}

export {courseDescriptionSagas};
