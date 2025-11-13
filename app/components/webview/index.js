/**
 * Webview Wrapper
 * @flow
 * @format
 */

import React from 'react';
import {WebView as RNWebview} from 'react-native-webview';
import type {WebViewProps} from 'react-native-webview';
import {EStyleSheet} from '@app/styles';

const styles = EStyleSheet.create({
  webview: {
    /*
      opacity 0.99 workaround to fix crash of
      webview. When react native screens enabled
      and going back from webview (exit webview) then
      app crashing.
    */
    opacity: 0.99,
  },
});

const WebView = (props: WebViewProps) => {
  const {style, onRef, ...rest} = props;
  return <RNWebview ref={onRef} style={[styles.webview, style]} {...rest} />;
};

export {WebView};
