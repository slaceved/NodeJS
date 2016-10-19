'use strict';

require('./testHelper');
var UnknownPaymentMethod = require('../lib/unknown_payment_method').UnknownPaymentMethod;

describe('UnknownPaymentMethod', function() {
  return describe('imageUrl', function() {
    return it('returns the correct image url', function() {
      var response, unknownPaymentMethod;
      response = {
        unknownPaymentMethod: {
          token: 1234,
          'default': true,
          key: 'value',
          imageUrl: 'http://www.some.other.image.com'
        }
      };
      unknownPaymentMethod = new UnknownPaymentMethod(response);
      GLOBAL.assert.equal(unknownPaymentMethod.token, 1234);
      GLOBAL.assert.isTrue(unknownPaymentMethod['default']);
      return GLOBAL.assert.equal(unknownPaymentMethod.imageUrl, 'https://assets.braintreegateway.com/payment_method_logo/unknown.png');
    });
  });
});
