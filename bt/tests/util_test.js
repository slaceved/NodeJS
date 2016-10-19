'use strict';

require('./testHelper');
var Util = require('../lib/util').Util;
var capture = require('capture-stream');

describe('Util', function() {
  describe('convertObjectKeysToUnderscores', function() {
    it('works with camel case keys', function() {
      var result;
      result = Util.convertObjectKeysToUnderscores({
        topLevel: {
          nestedOne: {
            nestedTwo: 'aValue'
          }
        }
      });
      return GLOBAL.assert.equal(result.top_level.nested_one.nested_two, 'aValue');
    });
    it('does not affect date values', function() {
      var result;
      result = Util.convertObjectKeysToUnderscores({
        someDate: new Date()
      });
      return assert.instanceOf(result.some_date, Date);
    });
    it('does not affect null', function() {
      var result;
      result = Util.convertObjectKeysToUnderscores({
        somethingNull: null
      });
      return assert.strictEqual(result.something_null, null);
    });
    return it('works on array values', function() {
      var result;
      result = Util.convertObjectKeysToUnderscores({
        topLevel: {
          things: [
            {
              camelOne: 'value1',
              camelTwo: 'value2'
            }, {
              camelOne: 'value3',
              camelTwo: 'value4'
            }
          ]
        }
      });
      GLOBAL.assert.isArray(result.top_level.things);
      GLOBAL.assert.equal(result.top_level.things[0].camel_one, 'value1');
      GLOBAL.assert.equal(result.top_level.things[0].camel_two, 'value2');
      GLOBAL.assert.equal(result.top_level.things[1].camel_one, 'value3');
      return GLOBAL.assert.equal(result.top_level.things[1].camel_two, 'value4');
    });
  });
  describe('convertNodeToObject', function() {
    it('converts a single value', function() {
      var result;
      result = Util.convertNodeToObject('foobar');
      return GLOBAL.assert.equal(result, 'foobar');
    });
    it('converts a hash of values', function() {
      var result;
      result = Util.convertNodeToObject({
        'foo-bar': 'baz',
        'ping': 'pong'
      });
      return assert.deepEqual(result, {
        'fooBar': 'baz',
        'ping': 'pong'
      });
    });
    it('converts a hash of hashes', function() {
      var result;
      result = Util.convertNodeToObject({
        'foo-bar': 'baz',
        'hash': {
          'ping-pong': 'paddle'
        }
      });
      return assert.deepEqual(result, {
        'fooBar': 'baz',
        'hash': {
          'pingPong': 'paddle'
        }
      });
    });
    it('converts a collection with one item', function() {
      var result;
      result = Util.convertNodeToObject({
        'credit-card-transactions': {
          '@': {
            type: 'collection'
          },
          'current-page-number': {
            '#': '1',
            '@': {
              type: 'integer'
            }
          },
          'page-size': {
            '#': '50',
            '@': {
              type: 'integer'
            }
          },
          'total-items': {
            '#': '1',
            '@': {
              type: 'integer'
            }
          },
          'transaction': {
            id: '22vwrm',
            status: 'settled'
          }
        }
      });
      return assert.deepEqual(result, {
        'creditCardTransactions': {
          'currentPageNumber': 1,
          'pageSize': 50,
          'totalItems': 1,
          'transaction': {
            id: '22vwrm',
            status: 'settled'
          }
        }
      });
    });
    it('coverts a collection with multiple items', function() {
      var result;
      result = Util.convertNodeToObject({
        'credit-card-transactions': {
          '@': {
            type: 'collection'
          },
          'current-page-number': {
            '#': '1',
            '@': {
              type: 'integer'
            }
          },
          'page-size': {
            '#': '50',
            '@': {
              type: 'integer'
            }
          },
          'total-items': {
            '#': '1',
            '@': {
              type: 'integer'
            }
          },
          'transaction': [
            {
              id: '22yyyy'
            }, {
              id: '22xxxx'
            }
          ]
        }
      });
      return assert.deepEqual(result, {
        'creditCardTransactions': {
          'currentPageNumber': 1,
          'pageSize': 50,
          'totalItems': 1,
          'transaction': [
            {
              id: '22yyyy'
            }, {
              id: '22xxxx'
            }
          ]
        }
      });
    });
    it('converts an array with no items', function() {
      var result;
      result = Util.convertNodeToObject({
        '@': {
          'type': 'array'
        }
      });
      return assert.deepEqual(result, []);
    });
    it('converts an array with one item', function() {
      var result;
      result = Util.convertNodeToObject({
        '@': {
          'type': 'array'
        },
        'item': {
          'foo': 'bar'
        }
      });
      return assert.deepEqual(result, [
        {
          'foo': 'bar'
        }
      ]);
    });
    it('converts an array with multiple items', function() {
      var result;
      result = Util.convertNodeToObject({
        '@': {
          'type': 'array'
        },
        'item': [
          {
            'prop': 'value'
          }, {
            'prop': 'value'
          }
        ]
      });
      return assert.deepEqual(result, [
        {
          'prop': 'value'
        }, {
          'prop': 'value'
        }
      ]);
    });
    it('converts an array with a root element', function() {
      var result;
      result = Util.convertNodeToObject({
        'items': {
          '@': {
            'type': 'array'
          },
          'item': [
            {
              'prop': 'value'
            }, {
              'prop': 'value'
            }
          ]
        }
      });
      return assert.deepEqual(result, {
        'items': [
          {
            'prop': 'value'
          }, {
            'prop': 'value'
          }
        ]
      });
    });
    it('converts nil object', function() {
      var result;
      result = Util.convertNodeToObject({
        '@': {
          nil: 'true'
        }
      });
      return assert.isNull(result);
    });
    it('converts symbols to strings', function() {
      var result;
      result = Util.convertNodeToObject({
        attribute: {
          '#': 'country_name',
          '@': {
            type: 'symbol'
          }
        }
      });
      return assert.deepEqual(result, {
        'attribute': 'country_name'
      });
    });
    it('converts integers', function() {
      var result;
      result = Util.convertNodeToObject({
        attribute: {
          '#': '1234',
          '@': {
            type: 'integer'
          }
        }
      });
      return assert.deepEqual(result, {
        'attribute': 1234
      });
    });
    it('converts booleans', function() {
      var result;
      result = Util.convertNodeToObject({
        'a1': {
          '#': 'true',
          '@': {
            'type': 'boolean'
          }
        },
        'a2': {
          '#': 'false',
          '@': {
            'type': 'boolean'
          }
        }
      });
      GLOBAL.assert.isTrue(result.a1);
      return assert.isFalse(result.a2);
    });
    return it('converts an empty object to an empty string', function() {
      var result;
      result = Util.convertNodeToObject({
        attribute: {}
      });
      return assert.deepEqual(result, {
        'attribute': ''
      });
    });
  });
  describe('objectIsEmpty', function() {
    it('returns true for empty objects', function() {
      var result;
      result = Util.objectIsEmpty({});
      return GLOBAL.assert.isTrue(result);
    });
    return it('returns false for non-empty objects', function() {
      var result;
      result = Util.objectIsEmpty({
        key: 'value'
      });
      return assert.isFalse(result);
    });
  });
  describe('arrayIsEmpty', function() {
    it('returns true for empty arrays', function() {
      var result;
      result = Util.arrayIsEmpty([]);
      return GLOBAL.assert.isTrue(result);
    });
    it('returns false for non-empty arrays', function() {
      var result;
      result = Util.arrayIsEmpty([1, 2, 3]);
      return assert.isFalse(result);
    });
    return it('returns false if not given an array', function() {
      var result;
      result = Util.arrayIsEmpty({});
      return assert.isFalse(result);
    });
  });
  describe('toCamelCase', function() {
    it('converts a string with underscores', function() {
      var result;
      result = Util.toCamelCase('one_two_three');
      return GLOBAL.assert.equal(result, 'oneTwoThree');
    });
    it('converts a string with hyphens', function() {
      var result;
      result = Util.toCamelCase('one-two-three');
      return GLOBAL.assert.equal(result, 'oneTwoThree');
    });
    return it('converts a string with a hyphen followed by a number', function() {
      var result;
      result = Util.toCamelCase('last-4');
      return GLOBAL.assert.equal(result, 'last4');
    });
  });
  describe('toUnderscore', function() {
    it('converts a camel cased string', function() {
      var result;
      result = Util.toUnderscore('oneTwoThree');
      return GLOBAL.assert.equal(result, 'one_two_three');
    });
    return it('handles words with contiguous uppercase letters', function() {
      var result;
      result = Util.toUnderscore('headlineCNNNews');
      return GLOBAL.assert.equal(result, 'headline_cnn_news');
    });
  });
  describe('flatten', function() {
    it('flattens a deeply nested array', function() {
      var result;
      result = Util.flatten([[1], [2, [3, [4, [5, [6, [7, [8, [9]]]]]]]]]);
      return assert.deepEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
    it('flattens an array with varying levels of nesting', function() {
      var result;
      result = Util.flatten([[1, 2], [3, 4], [5], [6, [7, [8, [9]]]]]);
      return assert.deepEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
    return it('flattens a deeply nested single element array', function() {
      var result;
      result = Util.flatten([[[[[[[[[[[[[[[[[[[[1]]]]]]]]]]]]]]]]]]]]);
      return assert.deepEqual(result, [1]);
    });
  });
  describe('merge', function() {
    it('concats two objects', function() {
      var result;
      result = Util.merge({
        key: 'value',
        key2: 'value2'
      });
      return assert.deepEqual(result, {
        key: 'value',
        key2: 'value2'
      });
    });
    return it('overrides existing values', function() {
      var result;
      result = Util.merge({
        key: 'value',
        key2: 'value2'
      });
      return assert.deepEqual(result, {
        key: 'value',
        key2: 'value2'
      });
    });
  });
  describe('without', function() {
    it('returns the difference between two arrays', function() {
      var result;
      result = Util.without([1, 2, 3, 4, 5], [1, 4]);
      return assert.deepEqual(result, [2, 3, 5]);
    });
    return it('returns the initial array if there are no differences', function() {
      var result;
      result = Util.without([1, 2, 3], [4, 5]);
      return assert.deepEqual(result, [1, 2, 3]);
    });
  });
  describe('flattenKeys', function() {
    return it('flattens an objects keys into a flat array', function() {
      var result, transactionParams;
      transactionParams = {
        amount: '5.00',
        creditCard: {
          number: '5105105105105100',
          expirationDate: '05/12'
        }
      };
      result = Util.flattenKeys(transactionParams);
      return assert.deepEqual(result, ['amount', 'creditCard[number]', 'creditCard[expirationDate]']);
    });
  });
  return describe('verifyKeys', function() {
    it('does not log deprecation warning if params are equal to the signature', function() {
      var deprecate, signature, stderr, transactionParams;
      deprecate = require('depd')('test');
      signature = ['amount', 'creditCard[number]', 'creditCard[expirationDate]'];
      transactionParams = {
        amount: '5.00',
        creditCard: {
          number: '5105105105105100',
          expirationDate: '05/12'
        }
      };
      stderr = capture(process.stderr);
      Util.verifyKeys(signature, transactionParams, deprecate);
      return GLOBAL.assert.equal(stderr(true), '');
    });
    it('does not log deprecation warning if params are a subset of signature', function() {
      var deprecate, signature, stderr, transactionParams;
      deprecate = require('depd')('test');
      signature = ['validKey1', 'validKey2', 'amount', 'creditCard[number]', 'creditCard[expirationDate]'];
      transactionParams = {
        amount: '5.00',
        creditCard: {
          number: '5105105105105100',
          expirationDate: '05/12'
        }
      };
      stderr = capture(process.stderr);
      Util.verifyKeys(signature, transactionParams, deprecate);
      return GLOBAL.assert.equal(stderr(true), '');
    });
    return it('logs deprecation warning if params are a superset of signature', function() {
      var deprecate, signature, stderr, transactionParams;
      deprecate = require('depd')('test');
      signature = ['amount', 'creditCard[number]'];
      transactionParams = {
        amount: '5.00',
        invalidKey: 'bar',
        creditCard: {
          number: '5105105105105100',
          nestedInvalidKey: '05/12'
        }
      };
      stderr = capture(process.stderr);
      Util.verifyKeys(signature, transactionParams, deprecate);
      return assert.include(stderr(true), 'invalid keys: invalidKey, creditCard[nestedInvalidKey]');
    });
  });
});
