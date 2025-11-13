/**
 * Calculation of vw, vh strings
 * @flow
 * @format
 */

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');
const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

const vw = shortDimension / 100;
const vh = longDimension / 100;

const SUFFIX_VW = '@vw';
const SUFFIX_VH = '@vh';

export default {
  isVw,
  isVh,
  calc,
};

/**
 * Is string contains vw
 * @param {String} str
 * @returns {Boolean}
 */
function isVw(str: string) {
  return str.includes(SUFFIX_VW);
}

/**
 * Is string contains vh
 * @param {String} str
 * @returns {Boolean}
 */
function isVh(str: string) {
  return str.includes(SUFFIX_VH);
}

/**
 * Calculate vw or vh
 * @param {String} str
 * @returns {number}
 */
function calc(str: string) {
  let _isVw = isVw(str);
  let valueStr = str.substr(0, str.indexOf(_isVw ? SUFFIX_VW : SUFFIX_VH));
  let value = valueStr === '' ? 1 : parseFloat(valueStr);
  if (isNaN(value)) {
    throw new Error('Invalid vw or vh value: ' + str);
  }
  return value * (_isVw ? vw : vh);
}
