/**
 * Rating Component
 * @flow
 * @format
 */

import React from 'react';
import {View, Image} from 'react-native';
import {ImageSource} from '@app/common';
import {EStyleSheet} from '@app/styles';

type Props = {
  rating: Number,
  style?: EStyleSheet,
  starStyle?: EStyleSheet,
};

const Rating = ({rating = 0, style, starStyle}: Props) => {
  const renderStar = [...Array(Math.ceil(rating))].map((e, i) => {
    if (i < 5) {
      return (
        <Image
          key={i}
          source={ImageSource.star}
          style={[styles.imageStyle, starStyle]}
        />
      );
    }
  });
  return <View style={[styles.container, style]}>{renderStar}</View>;
};

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: '4@ms',
    position: 'absolute',
  },
  imageStyle: {
    margin: 1,
    width: '18@ms',
    height: '18@ms',
  },
});

export {Rating};
