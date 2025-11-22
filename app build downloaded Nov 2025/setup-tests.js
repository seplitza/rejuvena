import 'react-native';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import 'react-native-gesture-handler/jestSetup';
import mock from 'react-native-permissions/mock';
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
jest.mock('react-native-permissions', () => {
  return mock;
});
jest.mock('react-native-device-info', () => mockRNDeviceInfo);
jest.mock('@invertase/react-native-apple-authentication', () => {});
jest.mock('@react-native-community/google-signin', () => {});
jest.mock('rn-fetch-blob', () => {});
jest.mock('appcenter-crashes', () => {});
jest.mock('react-native-orientation-locker', () => {});
jest.mock('react-native-onesignal', () => {});
