'use strict';

require('dotenv').load();

var Environment = (function(){
  var DEVELOPMENT_PORT = process.env.GATEWAY_PORT || '3000';

  var DEVELOPMENT_URL;
  DEVELOPMENT_URL = process.env.GATEWAY_URL || 'localhost';

  Environment.Development = new Environment(DEVELOPMENT_URL, DEVELOPMENT_PORT, 'http://auth.venmo.dev:9292', false);
  Environment.Qa = new Environment('gateway.qa.braintreepayments.com', '443', 'https://auth.venmo.qa2.braintreegateway.com', true);
  Environment.Sandbox = new Environment('api.sandbox.braintreegateway.com', '443', 'https://auth.sandbox.venmo.com', true);
  Environment.Production = new Environment('api.braintreegateway.com', '443', 'https://auth.venmo.com', true);

  function Environment(server, port, authUrl, ssl) {
    this.server = server;
    this.port = port;
    this.authUrl = authUrl;
    this.ssl = ssl;
  }

  Environment.prototype.baseUrl = function() {
    var url;
    url = this.uriScheme() + this.server;
    if (this === Environment.Development) {
      url += ':' + this.port;
    }
    return url;
  };

  Environment.prototype.uriScheme = function() {
    if (this.ssl) {
      return 'https://';
    } else {
      return 'http://';
    }
  };

  return Environment;
})();

exports.Environment = Environment;
