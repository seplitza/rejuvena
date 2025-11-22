/**
 * Image With Title
 * @flow
 * @format
 */

import React from 'react';
import {View} from 'react-native';
import {Label, TouchableItem, CacheImage} from '@app/components';
import {EStyleSheet, shadow} from '@app/styles';

type Props = {
  source: number | Object,
  title: string,
  onPress: Function,
};

const ImageWithTitle = (props: Props) => {
  const {
    source,
    title,
    onPress,
    textToImage,
    shouldShowTextToImage,
    age,
  } = props;
  return (
    <View style={styles.container}>
      <TouchableItem
        style={[styles.imageContainer, !onPress && styles.padding]}
        onPress={onPress}
        disabled={!onPress}>
        <>
          <CacheImage source={source} loaderShown style={styles.imageStyle} />
          {shouldShowTextToImage && (
            <View style={styles.textToImageContainer}>
              <Label style={styles.anyProblematicPlaceTextStyle}>
                {textToImage}
              </Label>
            </View>
          )}
          {age && <Label style={styles.ageStyle}>{age}</Label>}
        </>
      </TouchableItem>
      <View style={styles.titleButton}>
        <Label numberOfLines={1} style={styles.titleStyle} onPress={onPress}>
          {title}
        </Label>
      </View>
    </View>
  );
};

// Styles
const styles = EStyleSheet.create({
  container: {
    flex: 1,
    minHeight: '145@ms',
    aspectRatio: 0.9,
    backgroundColor: '#fff',
    alignItems: 'center',
    ...shadow,
    shadowOffset: {height: 4, width: 0},
  },
  imageContainer: {
    width: '90%',
    flex: 1,
    borderRadius: '8@ms',
    borderWidth: 2,
    borderColor: '$colors.darkTextColor',
    overflow: 'hidden',
  },
  padding: {
    padding: '2@ms',
    paddingBottom: 0,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  titleButton: {
    marginTop: '-2@ms',
    marginBottom: '2@ms',
  },
  titleStyle: {
    fontSize: '18@ms',
    color: '$colors.primary',
    textAlign: 'center',
  },
  textToImageContainer: {
    position: 'absolute',
    ...EStyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  anyProblematicPlaceTextStyle: {
    color: '$colors.primary',
    fontSize: '22@ms',
    textAlign: 'center',
    lineHeight: '32@ms',
  },
  ageStyle: {
    color: '$colors.textColor',
    fontSize: '40@ms',
    position: 'absolute',
    bottom: 0,
    right: '4@ms',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
});

export {ImageWithTitle};
