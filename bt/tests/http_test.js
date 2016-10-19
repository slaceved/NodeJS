'use strict';

require('./testHelper');
var braintree = GLOBAL.testHelper.braintree;
var Config = require('../lib/config').Config;
var Http = require('../lib/http').Http;

describe('Http', function() {
  return describe('checkHttpStatus', function() {
    it('returns a null for non-error codes => ', function() {
      var http, i, len, ref, response, results;
      http = new Http(new Config(GLOBAL.testHelper.defaultConfig));
      ref = [200, 201, 422];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        response = ref[i];
        results.push(GLOBAL.assert.equal(http.checkHttpStatus(response), null));
      }
      return results;
    });
    it('returns an authentication error for 401  => ', function() {
      var http;
      http = new Http(new Config(GLOBAL.testHelper.defaultConfig));
      return GLOBAL.assert.equal(http.checkHttpStatus(401).type, braintree.errorTypes.authenticationError);
    });
    it('returns an authorization error for 403  => ', function() {
      var http;
      http = new Http(new Config(GLOBAL.testHelper.defaultConfig));
      return GLOBAL.assert.equal(http.checkHttpStatus(403).type, braintree.errorTypes.authorizationError);
    });
    it('returns an not found error for 404  => ', function() {
      var http;
      http = new Http(new Config(GLOBAL.testHelper.defaultConfig));
      return GLOBAL.assert.equal(http.checkHttpStatus(404).type, braintree.errorTypes.notFoundError);
    });
    it('returns an upgrade required error for 426  => ', function() {
      var http;
      http = new Http(new Config(GLOBAL.testHelper.defaultConfig));
      return GLOBAL.assert.equal(http.checkHttpStatus(426).type, braintree.errorTypes.upgradeRequired);
    });
    it('returns an not found error for 429  => ', function() {
      var http;
      http = new Http(new Config(GLOBAL.testHelper.defaultConfig));
      return GLOBAL.assert.equal(http.checkHttpStatus(429).type, braintree.errorTypes.tooManyRequestsError);
    });
    it('returns a down for maintenance error for 500 =>', function() {
      var http;
      http = new Http(new Config(GLOBAL.testHelper.defaultConfig));
      return GLOBAL.assert.equal(http.checkHttpStatus(500).type, braintree.errorTypes.serverError);
    });
    return it('returns a down for maintenance error for 503 =>', function() {
      var http;
      http = new Http(new Config(GLOBAL.testHelper.defaultConfig));
      return GLOBAL.assert.equal(http.checkHttpStatus(503).type, braintree.errorTypes.downForMaintenanceError);
    });
  });
});
