/**
 * App Global Loader
 * @flow
 * @format
 */

import React from 'react';
import {View, Modal} from 'react-native';
import LottieView from 'lottie-react-native';
import {connectStructuredSelector} from '@app/utils';
import {selectLoaderVisible} from '@app/modules/common';
import {styles} from './styles';

type Props = {
  visible: number,
};

const GlobalLoader = (props: Props) => {
  const {visible} = props;

  return (
    <Modal
      statusBarTranslucent
      transparent
      animationType="fade"
      visible={visible}>
      <View style={styles.container}>
        <LottieView
          autoPlay
          loop
          source={require('@app/assets/animation/new-loading.json')}
          style={styles.lottieStyle}
          hardwareAccelerationAndroid
        />
      </View>
    </Modal>
  );
};

const mapStateToProps = {
  visible: selectLoaderVisible,
};

export const Loader = connectStructuredSelector(mapStateToProps)(GlobalLoader);
