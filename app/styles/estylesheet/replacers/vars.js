/**
 * Variables
 * @flow
 * @format
 */

import resolvePath from 'object-resolve-path';

const PREFIX = '$';

export default {
  isVar,
  calc,
  extract,
  get,
};

/**
 * Is string equals to another variable: '$varName'
 * @param {String} str
 */
function isVar(str: string) {
  return typeof str === 'string' && str.charAt(0) === PREFIX;
}

/**
 * Replace var with value from vars arr.
 * @param {String} str variable name with $, e.g. '$color'
 * @param {Array<Object> | null} varsArr array of variable sets to search into.
 */
function calc(str: string, varsArr: Array<Object> | null) {
  let realValue = get(str, varsArr);
  if (realValue === undefined) {
    throw new Error(`Unresolved variable: ${str}`);
  }
  return realValue;
}

/**
 * Extract variables from mixed object
 * @param {Object} obj
 * @returns {null|Object}
 */
function extract(obj: Object) {
  return Object.keys(obj).reduce((res, key) => {
    if (isVar(key)) {
      res = res || {};
      res[key] = obj[key];
    }
    return res;
  }, null);
}

/**
 * Return variable value using provided array of variable sets
 * @param {String} name variable with $, e.g. '$myVar'
 * @param {Array | null} varsArr array of variable sets
 */
function get(name: string, varsArr: Array<any> | null) {
  if (!Array.isArray(varsArr)) {
    throw new Error('You should pass vars array to vars.get()');
  }

  const match = name.match(/[^.[]*/);
  if (!match) {
    throw Error('match not found');
  }
  const rootVar = match[0];
  const isSimpleVar = rootVar === name;

  // todo: use for.. of after https://github.com/facebook/react-native/issues/4676
  for (let i = 0; i < varsArr.length; i++) {
    let vars = varsArr[i];
    if (!vars || vars[rootVar] === undefined) {
      continue;
    }
    if (isSimpleVar) {
      return vars[name];
    }
    try {
      return resolvePath({ [rootVar]: vars[rootVar] }, name);
    } catch (error) {
      return undefined;
    }
  }
}
