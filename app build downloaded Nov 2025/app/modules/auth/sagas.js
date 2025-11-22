/**
 * Auth Sagas
 * @flow
 * @format
 */

import {call, takeLatest, put, all, select} from 'redux-saga/effects';
import type {Saga} from 'redux-saga';
import {
  GoogleSignin as GoogleSignIn,
  statusCodes,
} from '@react-native-community/google-signin';
import {AccessToken, LoginManager} from 'react-native-fbsdk';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {getUniqueId} from 'react-native-device-info';
import * as Config from '@app/config';
import {request, endpoints} from '@app/api';
import {NavigationService, AuthToken, trackEvent} from '@app/utils';
import {showAlert} from '@app/global';
import {Routes} from '@app/common';
import {
  setAuthToken,
  presentLoader,
  dismissLoader,
  selectPlayerId,
  setGuestUser,
} from '@app/modules/common';
import {decideAppSectionSaga} from '@app/modules/app-init';
import branch from 'react-native-branch';
import {
  loginWithEmail,
  signupWithEmail,
  sendResetPasswordRequest,
  signInWithGoogle,
  signInWithFacebook,
  guestUserLogin,
  signInWithApple,
  getGuestUserMarathon,
  setMarathonCourses,
} from './slice';

try {
  GoogleSignIn?.configure({webClientId: Config.WEB_CLIENT_ID});
} catch (err) {
  console.log(err);
}
function* loginWithEmailSaga({payload}) {
  try {
    yield put(presentLoader());
    trackEvent('Try Login');
    const playerId = yield select(selectPlayerId);
    const {email, password} = payload;
    const response = yield call(request.post, endpoints.login, {
      username: email,
      password,
      playerId,
      grant_type: 'password',
    });
    yield put(setAuthToken(response.access_token));
    AuthToken.set(response.access_token);
    yield call(decideAppSectionSaga);
  } catch (error) {
    showAlert('authPage.loginFailed', error.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* signupWithEmailSaga({payload}) {
  try {
    yield put(presentLoader());
    trackEvent('Try SignUp');
    let lastParams = yield branch.getLatestReferringParams();
    const playerId = yield select(selectPlayerId);
    const {email, firstName, lastName} = payload;
    yield call(request.post, endpoints.register, {
      email,
      firstName,
      lastName,
      playerId,
      termCondtion: true,
      referralCode: lastParams?.referral_code,
    });
    showAlert('authPage.accountCreated', 'authPage.accountCreatedMessage');
    yield call(NavigationService.navigate, Routes.LoginScreen, {email});
  } catch (error) {
    showAlert('authPage.signInFailed', error.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* getGuestUserMarathonSaga() {
  try {
    const courses = yield call(request.get, endpoints.get_marathon_guest_user);
    yield put(setMarathonCourses(courses));
  } catch (error) {
    showAlert('', error.message);
  }
}

function* guestUserLoginSaga() {
  try {
    yield put(presentLoader());
    const deviceId = yield getUniqueId();
    let lastParams = yield branch.getLatestReferringParams();
    const response = yield call(request.get, endpoints.guest_user_login, {
      params: {deviceId, referralCode: lastParams?.referral_code},
    });
    yield put(setAuthToken(response.access_token));
    yield put(setGuestUser(response.IsGuestUser));
    AuthToken.set(response.access_token);
    yield call(decideAppSectionSaga);
  } catch (error) {
    showAlert('', error.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* sendResetPasswordRequestSaga({payload}) {
  try {
    yield put(presentLoader());
    const {email} = payload;
    yield call(request.get, endpoints.reset_password, {
      params: {Email: email},
    });
    showAlert('', 'authPage.resetSuccess');
    yield call(NavigationService.goBack);
  } catch (error) {
    showAlert('', error.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* signInWithGoogleSaga() {
  try {
    yield put(presentLoader());
    yield call(GoogleSignIn.signOut);
    trackEvent('Try Signin with Google');
    let lastParams = yield branch.getLatestReferringParams();
    const {idToken} = yield call(GoogleSignIn.signIn);
    const playerId = yield select(selectPlayerId);
    const response = yield call(request.get, endpoints.login_google, {
      params: {
        providerToken: idToken,
        playerId,
        referralCode: lastParams?.referral_code,
      },
    });
    yield put(setAuthToken(response.access_token));
    AuthToken.set(response.access_token);
    yield call(decideAppSectionSaga);
  } catch (error) {
    if (error.code === statusCodes?.SIGN_IN_CANCELLED) {
      showAlert('', 'authPage.signInCancel');
    } else {
      showAlert('', error.message);
    }
  } finally {
    yield put(dismissLoader());
  }
}

function* signInWithFacebookSaga() {
  try {
    yield LoginManager.logOut();
    trackEvent('Try Signin with Facebook');
    let lastParams = yield branch.getLatestReferringParams();
    const result = yield LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    if (result.isCancelled) {
      throw Error('authPage.signInCancel');
    }
    yield put(presentLoader());
    const playerId = yield select(selectPlayerId);
    const {accessToken} = yield AccessToken.getCurrentAccessToken();
    const response = yield call(request.get, endpoints.login_facebook, {
      params: {
        providerToken: accessToken,
        playerId,
        referralCode: lastParams?.referral_code,
      },
    });
    yield put(setAuthToken(response.access_token));
    AuthToken.set(response.access_token);
    yield call(decideAppSectionSaga);
  } catch (error) {
    showAlert('', error.message);
  } finally {
    yield put(dismissLoader());
  }
}

function* signInWithAppleSaga() {
  try {
    yield put(presentLoader());
    trackEvent('Try Signin with Apple');
    let lastParams = yield branch.getLatestReferringParams();
    // performs login request
    const appleAuthRequestResponse = yield appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = yield appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      const {
        identityToken,
        user,
        email,
        fullName: {familyName, givenName},
      } = appleAuthRequestResponse;
      // user is authenticated
      const playerId = yield select(selectPlayerId);
      const response = yield call(request.get, endpoints.login_apple, {
        params: {
          id: user,
          firstName: givenName || '',
          lastName: familyName || '',
          email: email || '',
          providerToken: identityToken,
          playerId,
          referralCode: lastParams?.referral_code,
        },
      });
      yield put(setAuthToken(response.access_token));
      AuthToken.set(response.access_token);
      yield call(decideAppSectionSaga);
    }
  } catch (error) {
    if (error.code === appleAuth.Error.CANCELED) {
      showAlert('', 'authPage.signInCancel');
    } else {
      showAlert('', error.message);
    }
  } finally {
    yield put(dismissLoader());
  }
}

function* authSagas(): Saga<void> {
  yield all([
    takeLatest(loginWithEmail, loginWithEmailSaga),
    takeLatest(signupWithEmail, signupWithEmailSaga),
    takeLatest(sendResetPasswordRequest, sendResetPasswordRequestSaga),
    takeLatest(signInWithGoogle, signInWithGoogleSaga),
    takeLatest(signInWithFacebook, signInWithFacebookSaga),
    takeLatest(signInWithApple, signInWithAppleSaga),
    takeLatest(guestUserLogin, guestUserLoginSaga),
    takeLatest(getGuestUserMarathon, getGuestUserMarathonSaga),
  ]);
}

export {authSagas};
