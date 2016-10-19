'use strict';

require('./testHelper');
var ValidationErrorsCollection = require('../lib/validation_errors_collection').ValidationErrorsCollection;

describe('ValidationErrorsCollection', function() {
  return describe('on', function() {
    return it('allows accessing errors', function() {
      var result;
      result = new ValidationErrorsCollection({
        errors: [
          {
            attribute: 'foo',
            code: '1'
          }, {
            attribute: 'foo',
            code: '2'
          }
        ]
      });
      GLOBAL.assert.equal(result.on('foo').length, 2);
      GLOBAL.assert.equal(result.on('foo')[0].code, '1');
      return GLOBAL.assert.equal(result.on('foo')[1].code, '2');
    });
  });
});
