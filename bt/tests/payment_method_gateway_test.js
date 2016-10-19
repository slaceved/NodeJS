'use strict';

require('./testHelper');
var PaymentMethodGateway = require('../lib/payment_method_gateway').PaymentMethodGateway;

describe('PaymentMethodGateway', function() {
  return describe('find', function() {
    return it('handles unknown payment methods', function(done) {
      var paymentMethod, response;
      response = {
        unknownPaymentMethod: {
          token: 1234,
          'default': true,
          key: 'value'
        }
      };
      paymentMethod = PaymentMethodGateway.parsePaymentMethod(response);
      GLOBAL.assert.equal(paymentMethod.token, 1234);
      GLOBAL.assert.isTrue(paymentMethod['default']);
      return done();
    });
  });
});
