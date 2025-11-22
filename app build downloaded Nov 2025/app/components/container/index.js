/**
 * Container Component
 * @flow
 * @format
 */

import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {gradients} from '@app/styles';
import {EStyleSheet} from '@app/styles';

type Props = {
  children: React$Node,
  style: EStyleSheet,
};

const Container = (props: Props) => {
  const {children, style} = props;
  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.containerStyle, style]}>
      <LinearGradient
        colors={gradients.background}
        style={styles.absoluteFill}
      />
      {children}
    </SafeAreaView>
  );
};

// Styles
const styles = EStyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
  },
});

export {Container};
