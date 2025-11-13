/**
 * Amplitude Analytics
 * @flow
 */

import {Amplitude} from '@amplitude/react-native';

export const trackEvent = (...params) => {
  try {
    Amplitude.getInstance().logEvent(...params);
  } catch {}
};
