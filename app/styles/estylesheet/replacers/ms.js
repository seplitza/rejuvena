/**
 * Calculation of ms strings
 * @flow
 * @format
 */

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');
const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

const SUFFIX = '@ms';
const SUFFIX_S = '@s';
const SUFFIX_VS = '@vs';
const DEFAULT_FACTOR = 0.4;

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

export default {
  isMs,
  isS,
  isVs,
  calc,
  calcS,
  calcVs,
};

const scale = (size) => (shortDimension / guidelineBaseWidth) * size;
const verticalScale = (size) => (longDimension / guidelineBaseHeight) * size;

/**
 * Is string contains ms
 * @param {String} str
 * @returns {Boolean}
 */
function isMs(str: string) {
  return str.includes(SUFFIX);
}

/**
 * Is string contains s
 * @param {String} str
 * @returns {Boolean}
 */
function isS(str: string) {
  return str.includes(SUFFIX_S);
}

/**
 * Is string contains vs
 * @param {String} str
 * @returns {Boolean}
 */
function isVs(str: string) {
  return str.includes(SUFFIX_VS);
}

/**
 * Calculate ms
 * @param {String} str
 * @param {Number} factor
 * @returns {number}
 */
function calc(str: string, factor: number = DEFAULT_FACTOR) {
  let valueStr = str.substr(0, str.indexOf(SUFFIX));
  let factorStr = str.substr(str.indexOf(SUFFIX) + SUFFIX.length);
  let value = valueStr === '' ? 1 : parseFloat(valueStr);
  let msFactor = factorStr === '' ? factor : parseFloat(factorStr);
  if (isNaN(value) || isNaN(msFactor)) {
    throw new Error('Invalid ms value: ' + str);
  }
  return value + (scale(value) - value) * msFactor;
}

/**
 * Calculate s
 * @param {String} str
 * @returns {number}
 */
function calcS(str: string) {
  let valueStr = str.substr(0, str.indexOf(SUFFIX_S));
  let value = valueStr === '' ? 1 : parseFloat(valueStr);
  if (isNaN(value)) {
    throw new Error('Invalid s value: ' + str);
  }
  return scale(value);
}

/**
 * Calculate vs
 * @param {String} str
 * @returns {number}
 */
function calcVs(str: string) {
  let valueStr = str.substr(0, str.indexOf(SUFFIX_VS));
  let value = valueStr === '' ? 1 : parseFloat(valueStr);
  if (isNaN(value)) {
    throw new Error('Invalid vs value: ' + str);
  }
  return verticalScale(value);
}
