'use strict';

var semver = require('semver');

var Util = (function() {
  function Util() {}

  Util.convertObjectKeysToUnderscores = function(obj) {
    var item, key, newKey, newObj, value;
    newObj = {};
    for (key in obj) {
      value = obj[key];
      newKey = Util.toUnderscore(key);
      if (value instanceof Array) {
        newObj[newKey] = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = value.length; _i < _len; _i++) {
            item = value[_i];
            _results.push(typeof item === 'object' ? Util.convertObjectKeysToUnderscores(item) : item);
          }
          return _results;
        })();
      } else if (typeof value === 'object') {
        if (value instanceof Date || value === null) {
          newObj[newKey] = value;
        } else {
          newObj[newKey] = Util.convertObjectKeysToUnderscores(value);
        }
      } else {
        newObj[newKey] = value;
      }
    }
    return newObj;
  };

  Util.convertNodeToObject = function(obj) {
    var item, key, newArray, newObj, value, _i, _j, _len, _len1, _results;
    if (typeof obj === 'object' && obj['@']) {
      if (obj['@'].type === 'array') {
        newArray = [];
        for (key in obj) {
          value = obj[key];
          if (key !== '@') {
            if (value instanceof Array) {
              for (_i = 0, _len = value.length; _i < _len; _i++) {
                item = value[_i];
                newArray.push(this.convertNodeToObject(item));
              }
            } else {
              newArray.push(this.convertNodeToObject(value));
            }
          }
        }
        return newArray;
      } else if (obj['@'].type === 'collection') {
        newObj = {};
        for (key in obj) {
          value = obj[key];
          if (key !== '@') {
            newObj[this.toCamelCase(key)] = this.convertNodeToObject(value);
          }
        }
        return newObj;
      } else if (obj['@'].nil === 'true') {
        return null;
      } else if (obj['@'].type === 'integer') {
        return parseInt(obj['#']);
      } else if (obj['@'].type === 'boolean') {
        return obj['#'] === 'true';
      } else {
        return obj['#'];
      }
    } else if (obj instanceof Array) {
      _results = [];
      for (_j = 0, _len1 = obj.length; _j < _len1; _j++) {
        item = obj[_j];
        _results.push(this.convertNodeToObject(item));
      }
      return _results;
    } else if (typeof obj === 'object' && this.objectIsEmpty(obj)) {
      return '';
    } else if (typeof obj === 'object') {
      newObj = {};
      for (key in obj) {
        value = obj[key];
        newObj[this.toCamelCase(key)] = this.convertNodeToObject(value);
      }
      return newObj;
    } else {
      return obj;
    }
  };

  Util.objectIsEmpty = function(obj) {
    var key, value;
    for (key in obj) {
      value = obj[key];
      return false;
    }
    return true;
  };

  Util.arrayIsEmpty = function(array) {
    if (!(array instanceof Array)) {
      return false;
    }
    if (array.length > 0) {
      return false;
    }
    return true;
  };

  Util.toCamelCase = function(string) {
    return string.replace(/([\-\_][a-z0-9])/g, function(match) {
      return match.toUpperCase().replace('-', '').replace('_', '');
    });
  };

  Util.toUnderscore = function(string) {
    return string.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  };

  Util.flatten = function(array) {
    var _this = this;
    while (this._containsArray(array)) {
      array = array.reduce(function(first, rest) {
        first = first instanceof Array ? first : [first];
        rest = rest instanceof Array ? _this.flatten(rest) : rest;
        return first.concat(rest);
      });
    }
    return array;
  };

  Util.merge = function(obj1, obj2) {
    var key, value;
    for (key in obj2) {
      value = obj2[key];
      obj1[key] = value;
    }
    return obj1;
  };

  Util.without = function(array1, array2) {
    var newArray, value, _i, _len;
    newArray = [];
    for (_i = 0, _len = array1.length; _i < _len; _i++) {
      value = array1[_i];
      if (!this._containsValue(array2, value)) {
        newArray.push(value);
      }
    }
    return newArray;
  };

  Util.supportsStreams2 = function() {
    return semver.satisfies(process.version, '>=0.10');
  };

  Util.flattenKeys = function(obj, prefix) {
    var key, keys, value;
    if (prefix == null) {
      prefix = null;
    }
    keys = [];
    for (key in obj) {
      value = obj[key];
      if (typeof value === 'object') {
        keys.push(Util.flattenKeys(value, key));
      } else {
        if (prefix) {
          keys.push(prefix + '[' + key + ']');
        } else {
          keys.push(key);
        }
      }
    }
    return this.flatten(keys);
  };

  Util.verifyKeys = function(validKeys, obj, deprecate) {
    var invalidKeys;
    invalidKeys = this.without(this.flattenKeys(obj), validKeys);
    if (invalidKeys.length > 0) {
      return deprecate('invalid keys: ' + invalidKeys.join(', ') + '.');
    }
  };

  Util._containsValue = function(array, element) {
    return array.indexOf(element) !== -1;
  };

  Util._containsArray = function(array) {
    var element, _i, _len;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      element = array[_i];
      if (element instanceof Array) {
        return true;
      }
    }
  };

  return Util;
})();

exports.Util = Util;
