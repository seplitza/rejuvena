/**
 * Privacy Policy Screen
 * @flow
 * @format
 */

import React from 'react';
import {PRIVACY_POLICY_URL} from '@app/config';
import {Loader, WebView} from '@app/components';
import {EStyleSheet, moderateScale} from '@app/styles';

const PrivacyPolicyScreen = () => {
  return (
    <WebView
      source={{
        uri: PRIVACY_POLICY_URL,
      }}
      textZoom={100}
      style={{marginTop: moderateScale(-40)}}
      startInLoadingState
      renderLoading={() => <Loader visible style={EStyleSheet.absoluteFill} />}
    />
  );
};

export default PrivacyPolicyScreen;
