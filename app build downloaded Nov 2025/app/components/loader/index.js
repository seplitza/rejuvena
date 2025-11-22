/**
 * Loader
 * @flow
 * @format
 */

import React from 'react';
import {View, Text} from 'react-native';
import LottieView from 'lottie-react-native';
import {styles} from './styles';

// Loader Model
type Props = {
  visible: boolean,
  message?: string,
  style?: any,
};

const Loader = (props: Props) => {
  const {style, visible, message = ''} = props;

  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <LottieView
        source={require('@app/assets/animation/new-loading.json')}
        autoPlay
        style={styles.lottieViewStyle}
      />
      <Text allowFontScaling={false} style={styles.messageStyle}>
        {message}
      </Text>
    </View>
  );
};

export {Loader};
