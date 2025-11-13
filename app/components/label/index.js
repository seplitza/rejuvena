/**
 * Label Component
 * @flow
 * @format
 */

import React from 'react';
import {Text} from 'react-native';
import {EStyleSheet} from '@app/styles';

type Props = React.ComponentProps<typeof Text>;

const Label = (props: Props) => {
  const {children, style, ...rest} = props;

  return (
    <Text allowFontScaling={false} style={[styles.labelStyle, style]} {...rest}>
      {children}
    </Text>
  );
};

// Label styles
const styles = EStyleSheet.create({
  labelStyle: {
    fontSize: '14@ms',
    fontFamily: '$fonts.default',
    color: '$colors.textColor',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export {Label};
