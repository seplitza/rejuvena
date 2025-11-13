/**
 * App Initializing
 * Initialize redux store, routes, configs and theme
    ██████╗░███╗░░░███╗
    ██╔══██╗████╗░████║
    ██████╦╝██╔████╔██║
    ██╔══██╗██║╚██╔╝██║
    ██████╦╝██║░╚═╝░██║
 * @flow
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import crashes from 'appcenter-crashes';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import branch from 'react-native-branch';
import {MS_FACTOR, IN_PROD, AMPLITUDE_API_KEY} from '@app/config';
import {Amplitude} from '@amplitude/react-native';
import {EStyleSheet, colors, fonts} from '@app/styles';
import {Navigator} from '@app/navigator';
import {store, persistor} from '@app/redux';
import {AppInitGate} from '@app/modules/app-init';
import {Alert, Toast, Loader} from '@app/global';
import Notification from '@app/init-notification';
import Iap from './iap';

try {
  crashes.setEnabled(IN_PROD);
  Amplitude.getInstance().init(AMPLITUDE_API_KEY);
  branch.subscribe(({error}) => {
    if (error) {
      console.error('Error from Branch: ' + error);
      return;
    }
  });
} catch {}

/*
 * Get relative time from dayjs like
 * from now
 */
dayjs.extend(relativeTime);

/*
 * Init stylesheet with app default
 * theme and other global vars
 */
EStyleSheet.build({
  $factor: MS_FACTOR, // moderate scale factor
  $colors: colors,
  $fonts: fonts,
});

const Main = () => {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {(rehydrate) => (
            <AppInitGate rehydrate={rehydrate}>
              <Alert />
              <Toast />
              <Loader />
              <Navigator />
              <Notification />
              <Iap />
            </AppInitGate>
          )}
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

export default Main;
