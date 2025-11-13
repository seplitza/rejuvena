/* eslint-disable no-bitwise */
/**
 * Utility functions
 * @flow
 * @format
 */

import validator from 'validate.js';
import url from 'url';
import {NativeModules, Platform} from 'react-native';
import * as Config from '@app/config';
/**
 * Delay
 * @param {number} ms
 */
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Get current timeZoneOffset
export function getTimezoneOffset() {
  return new Date().getTimezoneOffset();
}

/**
 * Custom formatter
 * Note: It must be not remove or modify
 * it is using everywhere in app for
 * display error messages.
 * By default grouped formatter returning
 * errors array with attr like:
 * { attr: [error, error], attr: [error, ...]}
 * but we not want array of errors output should be
 * { attr: first_error, attr: first_error }
 */
validator.formatters.grouped_first_error = function (errors) {
  return errors.reduce((acc, error) => {
    if (!acc[error.attribute]) {
      acc[error.attribute] = error.error;
    }
    return acc;
  }, {});
};

/**
 * Fix url, if there are backward slashes,
 * or anything else which are not in standard
 * format
 */
export function fixUrl(targetUrl) {
  return url.format(url.parse(targetUrl || ''));
}

/**
 * Add leading zero (if require) in time digit
 * like 5 => 05, 11 => 11, 1 => 01
 * @param {number} digit
 */
export function addLeadingZero(digit) {
  return digit < 10 ? `0${digit}` : digit;
}

/**
 * Compares two string version values.
 * Returns:
 * -1 = left is LOWER than right
 *  0 = they are equal
 *  1 = left is GREATER = right is LOWER
 *  And FALSE if one of input versions are not valid
 *
 * @param {String} left  Version #1
 * @param {String} right Version #2
 * @return {Integer|Boolean}
 */
export function versionCompare(left, right) {
  if (typeof left + typeof right !== 'stringstring') {
    return false;
  }

  const a = left.split('.').map(Number),
    b = right.split('.').map(Number),
    len = Math.max(a.length, b.length);

  for (let i = 0; i < len; i++) {
    if (a[i] > b[i] || (b[i] === undefined && a[i] !== 0)) {
      return 1;
    } else if (b[i] > a[i] || (a[i] === undefined && b[i] !== 0)) {
      return -1;
    }
  }

  return 0;
}

/**
 * Capitalize first letter of string
 */
export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Get device language
 */
export function getDeviceLanguage() {
  const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager?.settings?.AppleLocale ||
        NativeModules.SettingsManager?.settings?.AppleLanguages[0] // iOS 13
      : NativeModules.I18nManager?.localeIdentifier;

  return deviceLanguage?.startsWith('ru') ? 'ru' : Config.DEFAULT_LANGUAGE;
}

/**
 * Check course is russian
 */
export function russianCourse(title: string) {
  return /[а-яА-ЯЁё]/.test(title);
}

/**
 * Get number with ordinal suffix
 */
export function addDaySuffix(n: number) {
  let ordinal = ['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th';
  return n + ordinal;
}
function decodeHtmlCharCodes(str) {
  return str?.replace(/(&#(\d+);)/g, function (match, capture, charCode) {
    return String.fromCharCode(charCode);
  });
}
export function removeHtmlTags(html) {
  const label = html
    ?.replace(/(<([^>]+)>)/gi, '')
    ?.replace(/&nbsp;/g, '')
    ?.replace('Powered by Froala Editor', '');

  return decodeHtmlCharCodes(label);
}

export function ratingChecker(progress) {
  let rating;
  switch (true) {
    case progress >= 200:
      rating = 5;
      break;
    case progress >= 150:
      rating = 4;
      break;
    case progress >= 100:
      rating = 3;
      break;
    case progress >= 50:
      rating = 2;
      break;
    case progress >= 1:
      rating = 1;
      break;
    default:
      rating = 0;
      break;
  }
  return rating;
}

export function getWeekDays(week) {
  let weekDays;
  switch (week) {
    case 1:
      weekDays = [1, 7];
      break;
    case 2:
      weekDays = [8, 14];
      break;
    case 3:
      weekDays = [15, 21];
      break;
    case 4:
      weekDays = [22, 28];
      break;
    case 5:
      weekDays = [29, 30];
      break;
  }
  return weekDays;
}

export function countWeekRating(days = [], weekNumber) {
  if (typeof days === 'object') {
    const weekDays = getWeekDays(weekNumber);
    const dayOfWeeks = days?.filter(
      ({day}) => day >= weekDays[0] && day <= weekDays[1],
    );
    const validateDayRating = dayOfWeeks?.filter(
      ({progress}) => ratingChecker(progress) < 2,
    );
    if (validateDayRating?.length) {
      return false;
    }
    const totalRatingCount =
      dayOfWeeks ||
      []
        ?.map(({progress}) => ratingChecker(progress))
        ?.reduce((prev, next) => prev + next);
    return totalRatingCount >= 21 && totalRatingCount <= 25;
  }
  return false;
}
