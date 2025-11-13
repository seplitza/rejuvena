/**
 * Scaling Utils
 * @format
 */

import { Dimensions } from 'react-native';
import { MS_FACTOR } from '@app/config';

const { width, height } = Dimensions.get('screen');
const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;

const vw = shortDimension / 100;
const vh = longDimension / 100;
const scale = (size: number) => (shortDimension / guidelineBaseWidth) * size;
const moderateScale = (size: number, factor: number = MS_FACTOR) =>
  size + (scale(size) - size) * factor;

const isLandscape = () => {
  const { width: w, height: h } = Dimensions.get('screen');
  return w > h;
};

export { scale, moderateScale, vw, vh, isLandscape };
