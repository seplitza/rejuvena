/**
 * Terms & Condition Screen
 * @flow
 * @format
 */

import React from 'react';
import {TERMS_AND_CONDITION_URL} from '@app/config';
import {Loader, WebView} from '@app/components';
import {EStyleSheet, moderateScale} from '@app/styles';

const TermAndConditionScreen = (props: Props) => {
  return (
    <WebView
      source={{
        uri: TERMS_AND_CONDITION_URL,
      }}
      textZoom={100}
      style={{marginTop: moderateScale(-40)}}
      startInLoadingState
      renderLoading={() => <Loader visible style={EStyleSheet.absoluteFill} />}
    />
  );
};

export default TermAndConditionScreen;
