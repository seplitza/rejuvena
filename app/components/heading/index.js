/**
 * Heading Component
 * @flow
 * @format
 */

import React from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Label} from '@app/components/label';
import {gradients} from '@app/styles';
import {styles} from './styles';

// Types
type Props = {
  title: string,
  containerStyle?: any,
  tittleStyle?: any,
};

const Heading = (props: Props) => {
  const {title, containerStyle, tittleStyle} = props;

  return (
    <View style={[styles.container, containerStyle]}>
      <LinearGradient
        locations={[0, 0.06, 0.94, 1]}
        colors={gradients.heading}
        style={styles.gradientStyle}
      />
      <Label style={[styles.titleStyle, tittleStyle]}>{title}</Label>
    </View>
  );
};

export {Heading};
