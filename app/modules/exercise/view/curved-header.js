/**
 * POD and Rules Header
 * @flow
 * @format
 */

import React from 'react';
import {View, Image} from 'react-native';
import {ImageSource} from '@app/common';
import {Label} from '@app/components';
import {EStyleSheet} from '@app/styles';

type Props = {
  title: string,
  isVisible?: boolean,
  termsAccepted?: boolean,
};

const CurvedHeader = (props: Props) => {
  const {title, isVisible, termsAccepted} = props;
  return (
    <>
      <View style={styles.container}>
        <Label style={styles.titleStyle}>{title}</Label>
        <Image
          source={isVisible ? ImageSource.minusCircle : ImageSource.plusCircle}
          style={styles.iconStyle}
        />
        {!termsAccepted && (
          <Image source={ImageSource.attentionRules} style={styles.iconStyle} />
        )}

        <View
          style={[
            styles.innerTriangleStyle,
            isVisible && styles.outerTriangleStyle,
          ]}
        />
      </View>
      <View style={styles.whiteBottomBar} />
      <View style={isVisible && styles.outerVStripeStyle} />
    </>
  );
};

export {CurvedHeader};

const styles = EStyleSheet.create({
  container: {
    backgroundColor: '$colors.primary',
    height: '68@ms',
    justifyContent: 'center',
  },
  whiteBottomBar: {
    borderBottomWidth: '5@ms',
    borderColor: '$colors.textColor',
    zIndex: -1,
  },
  iconStyle: {
    width: '42@ms',
    height: '42@ms',
    right: '12@ms',
    position: 'absolute',
  },
  titleStyle: {
    fontSize: '30@ms',
    textAlign: 'center',
  },
  innerTriangleStyle: {
    width: 0,
    height: 0,
    borderLeftWidth: '22@ms',
    borderRightWidth: '22@ms',
    borderBottomWidth: '22@ms',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
    alignSelf: 'center',
    position: 'absolute',
    bottom: '-2@ms',
  },
  outerTriangleStyle: {
    borderBottomColor: '$colors.primary',
    transform: [{rotate: '180deg'}],
    bottom: '-21@ms',
  },
  outerVStripeStyle: {
    width: 0,
    height: 0,
    borderLeftWidth: '28@ms',
    borderRightWidth: '28@ms',
    borderBottomWidth: '28@ms',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
    transform: [{rotate: '180deg'}],
    alignSelf: 'center',
    position: 'absolute',
    bottom: '-23@ms',
    zIndex: -1,
  },
});
