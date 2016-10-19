'use strict';

require('./testHelper');
require('dotenv').load();
var Environment = require('../lib/environment').Environment;

describe('Environment', function() {
  return describe('baseUrl', function() {
    it('generates a base url with proper scheme and port', function() {
      var env;
      env = new Environment('test.domain', '3001', 'http://auth.venmo.dev', false);
      return GLOBAL.assert.equal('http://test.domain', env.baseUrl());
    });
    it('uses https if ssl is true', function() {
      var env;
      env = new Environment('test.domain', '3001', 'http://auth.venmo.dev', true);
      return GLOBAL.assert.equal('https://test.domain', env.baseUrl());
    });
    return it('includes the port for the Development environment', function() {
      var baseUrl;
      baseUrl = 'http://localhost:' + (process.env.GATEWAY_PORT || '3001');
      return GLOBAL.assert.equal(baseUrl, Environment.Development.baseUrl());
    });
  });
});
