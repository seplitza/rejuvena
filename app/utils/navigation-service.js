/**
 * Navigation Service
 * @flow
 * @format
 */

import React from 'react';
import {
  CommonActions,
  DrawerActions,
  StackActions,
} from '@react-navigation/native';

// Navigation container reference
const navigationRef = React.createRef();

/**
 * Navigate to a route
 * @param {string} name
 * @param {Object} params
 */
function navigate(name: string, params: Object) {
  navigationRef.current?.dispatch(CommonActions.navigate({name, params}));
}

// Go back from current screen to previous
function goBack() {
  navigationRef.current?.dispatch(CommonActions.goBack());
}

// Open drawer
function openDrawer() {
  navigationRef.current?.dispatch(DrawerActions.openDrawer());
}

// Open drawer
function closeDrawer() {
  navigationRef.current?.dispatch(DrawerActions.closeDrawer());
}

function reset(name: string, params?: Object) {
  navigationRef.current?.reset({
    routes: [{name, params}],
  });
}

function replace(name: String, params?: Object) {
  navigationRef.current?.dispatch(StackActions.replace(name, params));
}

function replaceAndPreserveParams(name: string) {
  navigationRef.current?.dispatch((state) => {
    const route = state.routes.find((r) => r.name === name);
    const params = route?.params;
    return StackActions.replace(name, params);
  });
}

function onStateChange(callBack) {
  const unsubscribe = navigationRef.current?.addListener('state', (e) => {
    // Node style callback (err, data)
    callBack(null, navigationRef.current.getRootState());
  });
  return unsubscribe;
}

function onStateChangeOnce(callBack) {
  const unsubscribe = navigationRef.current?.addListener('state', (e) => {
    callBack(null, navigationRef.current.getRootState());
    unsubscribe();
  });
}

export const NavigationService = {
  navigationRef,
  navigate,
  goBack,
  openDrawer,
  closeDrawer,
  reset,
  replace,
  replaceAndPreserveParams,
  onStateChange,
  onStateChangeOnce,
};
