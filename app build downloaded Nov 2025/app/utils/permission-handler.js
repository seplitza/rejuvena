/**
 * Permissions handler
 * @flow
 * @format
 */

import {Platform} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openLimitedPhotoLibraryPicker,
  openSettings,
  requestMultiple,
} from 'react-native-permissions';

const permissions = {
  camera:
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
  photo:
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
};

export function writeStorage() {
  const permission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;

  return {
    check: () => check(permission),
    request: () => request(permission),
  };
}

export function camera() {
  const permission =
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

  return {
    check: () => check(permission),
    request: () => request(permission),
  };
}

async function isPermissionBlocked(permission) {
  const result = await check(permission);
  if (result === RESULTS.BLOCKED) {
    return true;
  }
  return false;
}

export {
  RESULTS,
  isPermissionBlocked,
  permissions,
  request,
  check,
  openLimitedPhotoLibraryPicker,
  openSettings,
  requestMultiple,
};
