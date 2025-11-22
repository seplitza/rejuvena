/**
 * Order Sagas
 * @flow
 * @format
 */

import {call, takeLatest, put, all, select} from 'redux-saga/effects';
import {request, endpoints} from '@app/api';
import {getTimezoneOffset, NavigationService, trackEvent} from '@app/utils';
import {
  presentLoader,
  dismissLoader,
  selectGuestUser,
} from '@app/modules/common';
import {showAlert} from '@app/global';
import {Routes} from '@app/common';
import {getOrders, setOrders, purchaseCourse, setScreenParams} from './slice';

function* getMyOrdersSaga() {
  try {
    const orders = yield call(request.get, endpoints.get_order_list, {
      params: {timeZoneOffSet: getTimezoneOffset()},
    });
    yield put(setOrders(orders));
  } catch {}
}

function* purchaseCourseSaga({payload}) {
  try {
    yield put(presentLoader());
    const {marathonId} = payload;
    const isGuestUser = yield select(selectGuestUser);
    const orderId = yield call(request.get, endpoints.init_order, {
      params: {marathonId},
    });
    yield call(request.get, endpoints.purchase_marathon_by_coupon, {
      params: {
        orderNumber: orderId,
        couponCode: null,
        timeZoneOffset: getTimezoneOffset(),
      },
    });
    if (isGuestUser) {
      trackEvent('Subscribed Demo Course');
    } else {
      trackEvent('Subscribed Free Course');
    }
    const params = {
      marathonId,
      shouldShowStartPage: true,
      showDemoCourseMessage: true,
    };
    yield put(setScreenParams(params));

    yield call(NavigationService.reset, 'tabs', {
      screen: Routes.ExerciseScreen,
    });
  } catch (error) {
    showAlert('', error.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* orderSagas() {
  yield all([
    takeLatest(getOrders, getMyOrdersSaga),
    takeLatest(purchaseCourse, purchaseCourseSaga),
  ]);
}

export {orderSagas};
