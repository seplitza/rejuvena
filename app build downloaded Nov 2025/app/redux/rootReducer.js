/**
 * Root Reducer
 * combine all reducers for create root reducer
 * @flow
 * @format
 */

import {combineReducers} from '@reduxjs/toolkit';

// Reducers
import {
  commonReducer,
  loaderAndErrorReducer,
  logout,
} from '@app/modules/common';
import {appInitReducer} from '@app/modules/app-init';
import {authReducer} from '@app/modules/auth';
import {orderReducer} from '@app/modules/order-list';
import {userReducer} from '@app/modules/user-profile';
import {photodiaryReducer} from '@app/modules/photo-diary';
import {exerciseReducer} from '@app/modules/exercise';
import {userFeedbackReducer} from '@app/modules/user-feedback';
import {notificationReducer} from '@app/modules/notification';
import {courseDescriptionReducer} from '@app/modules/course-description';

const appReducer = combineReducers({
  commonReducer,
  loaderAndErrorReducer,
  appInitReducer,
  authReducer,
  orderReducer,
  userReducer,
  photodiaryReducer,
  exerciseReducer,
  userFeedbackReducer,
  notificationReducer,
  courseDescriptionReducer,
});

const rootReducer = (state, action) => {
  if (action.type === logout.type) {
    const initialState = appReducer({}, {});
    const newState = {
      ...initialState,
      commonReducer: state?.commonReducer || {},
      appInitReducer: state?.appInitReducer || {},
    };
    return appReducer(newState, action);
  }
  return appReducer(state, action);
};

export {rootReducer};
