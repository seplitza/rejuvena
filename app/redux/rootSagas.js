/**
 * Root Sagas
 * @flow
 * @format
 */

// Sagas
import {commonSagas} from '@app/modules/common';
import {appInitSagas} from '@app/modules/app-init';
import {authSagas} from '@app/modules/auth';
import {orderSagas} from '@app/modules/order-list';
import {userSagas} from '@app/modules/user-profile';
import {photodiarySagas} from '@app/modules/photo-diary';
import {exerciseSagas} from '@app/modules/exercise';
import {userFeedbackSagas} from '@app/modules/user-feedback';
import {notificationSagas} from '@app/modules/notification';
import {courseDescriptionSagas} from '@app/modules/course-description';

const rootSagas = [
  commonSagas,
  appInitSagas,
  authSagas,
  orderSagas,
  userSagas,
  photodiarySagas,
  exerciseSagas,
  userFeedbackSagas,
  notificationSagas,
  courseDescriptionSagas,
];

export {rootSagas};
