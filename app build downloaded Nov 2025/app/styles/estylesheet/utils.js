/**
 * Utils
 * @flow
 * @format
 */

export default {
  excludeKeys,
  isObject,
};

/**
 * Returns new object with excluded keys
 * @param {Object} obj
 * @param {Array|Object} keys
 */
function excludeKeys(obj: Object, keys: Array<string> | Object | null) {
  const _keys = Array.isArray(keys) ? keys : keys ? Object.keys(keys) : [];
  return Object.keys(obj).reduce((res, key) => {
    if (_keys.indexOf(key) === -1) {
      res[key] = obj[key];
    }
    return res;
  }, {});
}

/**
 * Is object
 * @param {*} obj
 */
function isObject(obj: Object) {
  return typeof obj === 'object' && obj !== null;
}
