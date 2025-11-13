/**
 * App Configurations
 * base url, libraries keys, env
 * @flow
 * @format
 */

import Config from 'react-native-config';

export const MS_FACTOR = 0.4; // moderate scale factor for scaling
export const ENV = Config.ENV;
export const API_URL = Config.API_URL;
export const WEB_CLIENT_ID =
  '157778744017-ud49u1rjupdn68ctg0tco7f2bgchc2tj.apps.googleusercontent.com';
export const ONE_SIGNAL_APP_ID = Config.ONE_SIGNAL_APP_ID;
export const TERMS_AND_CONDITION_URL = 'https://faceliftnaturally.me/terms_en';
export const PRIVACY_POLICY_URL = 'https://faceliftnaturally.me/privacy_en';
export const DEFAULT_LANGUAGE = 'en';
export const IN_PROD = Config.ENV === 'production';
export const AMPLITUDE_API_KEY = Config.AMPLITUDE_API_KEY;
