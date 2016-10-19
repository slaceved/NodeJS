'use strict';

require('./testHelper');
var ClientTokenGateway = require('../lib/client_token_gateway').ClientTokenGateway;
var braintree = GLOBAL.testHelper.braintree;

describe('ClientTokenGateway', function() {
  return describe('generate', function() {
    return it('returns an error when credit card options are supplied without a customer ID', function(done) {
      var clientToken;
      return clientToken = GLOBAL.testHelper.defaultGateway.clientToken.generate({
        options: {
          makeDefault: true,
          verifyCard: true
        }
      }, function(err, result) {
        GLOBAL.assert.equal(err.type, braintree.errorTypes.unexpectedError);
        GLOBAL.assert.equal(err.message, 'Invalid keys: makeDefault,verifyCard');
        return done();
      });
    });
  });
});
