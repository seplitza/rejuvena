/**
 * Card Component
 * @flow
 * @format
 */

import React from 'react';
import { View } from 'react-native';
import { EStyleSheet } from '@app/styles';

type Props = {
  children: React$Node,
  style: EStyleSheet,
};

const Card = (props: Props) => {
  const { children, style } = props;
  return <View style={[styles.cardStyle, style]}>{children}</View>;
};

// Styles
const styles = EStyleSheet.create({
  cardStyle: {
    backgroundColor: '#f7f7f7',
    borderRadius: '10@ms',
    elevation: 5,
    shadowColor: 'rgba(0,0,0, 0.4)',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
  },
});

export { Card };
