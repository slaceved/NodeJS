'use strict';

require('./testHelper');
var braintree = require('../lib/braintree');
var TransparentRedirectGateway = require('../lib/transparent_redirect_gateway').TransparentRedirectGateway;

describe('TransparentRedirectGateway', function() {
  return describe('url', function() {
    it('gives the correct url for sandbox', function() {
      var config, gateway;
      config = {
        environment: braintree.Environment.Sandbox,
        merchantId: 'integration_merchant_id'
      };
      gateway = new TransparentRedirectGateway(braintree.connect(config));
      return GLOBAL.assert.equal(gateway.url,
        'https://api.sandbox.braintreegateway.com/merchants/integration_merchant_id/transparent_redirect_requests');
    });
    it('gives the correct url for the production environment', function() {
      var config, gateway;
      config = {
        environment: braintree.Environment.Production,
        merchantId: 'integration_merchant_id'
      };
      gateway = new TransparentRedirectGateway(braintree.connect(config));
      return GLOBAL.assert.equal(gateway.url,
        'https://api.braintreegateway.com/merchants/integration_merchant_id/transparent_redirect_requests');
    });
    return it('gives the correct url for the development environment', function() {
      var config, gateway;
      config = {
        environment: braintree.Environment.Development,
        merchantId: 'integration_merchant_id'
      };
      gateway = new TransparentRedirectGateway(braintree.connect(config));
      return GLOBAL.assert.equal(gateway.url, 'http://localhost:' + gateway.gateway.config.environment.port +
        '/merchants/integration_merchant_id/transparent_redirect_requests');
    });
  });
});
