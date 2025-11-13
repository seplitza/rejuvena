/**
 * Button Component
 * @flow
 * @format
 */

import React from 'react';
import {ActivityIndicator, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Label} from '@app/components/label';
import {TouchableItem} from '@app/components/touchable-item';
import {EStyleSheet, gradients} from '@app/styles';
import {styles} from './styles';

type Props = {
  title: string,
  disabled?: boolean,
  loading?: boolean,
  containerStyle: EStyleSheet,
  titleStyle: EStyleSheet,
};

const Button = (props: Props) => {
  const {
    title,
    loading,
    containerStyle,
    titleStyle,
    disabled,
    children,
    source,
    gradientColors = gradients.button,
    enableGradient = false,
    ...rest
  } = props;

  return (
    <TouchableItem
      testID="testButton"
      {...rest}
      style={[
        styles.container,
        containerStyle,
        disabled && styles.disableStyle,
      ]}
      disabled={loading || disabled}>
      <>
        {enableGradient && (
          <LinearGradient
            colors={gradientColors}
            style={styles.gradientStyle}
          />
        )}
        {!!source && <Image source={source} style={styles.icon} />}
        {loading ? (
          <ActivityIndicator
            testID="testActivityIndicator"
            color={styles.loading?.color}
            size="small"
          />
        ) : (
          children || (
            <Label testID="testLabel" style={[styles.titleStyle, titleStyle]}>
              {title}
            </Label>
          )
        )}
      </>
    </TouchableItem>
  );
};

export {Button};
