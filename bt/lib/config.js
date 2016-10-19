'use strict';
require('dotenv').load();

var CredentialsParser = require('./credentials_parser').CredentialsParser;

var Config;
Config = (function() {
  function Config(rawConfig) {
    var parser;
    this.timeout = process.env.BT_TIME_OUT || 60000;
    this.apiVersion = process.env.BT_API_VERSION || '4';
    parser = new CredentialsParser();
    if (rawConfig.clientId || rawConfig.clientSecret) {
      parser.parseClientCredentials(rawConfig.clientId, rawConfig.clientSecret);
      this.clientId = parser.clientId;
      this.clientSecret = parser.clientSecret;
      this.environment = parser.environment;
    } else if (rawConfig.accessToken) {
      parser.parseAccessToken(rawConfig.accessToken);
      this.accessToken = parser.accessToken;
      this.environment = parser.environment;
      this.merchantId = parser.merchantId;
    } else {
      this.publicKey = rawConfig.publicKey;
      this.privateKey = rawConfig.privateKey;
      this.merchantId = rawConfig.merchantId || rawConfig.partnerId;
      this.environment = rawConfig.environment;
    }
  }

  Config.prototype.baseMerchantPath = function() {
    return '/merchants/' + this.merchantId;
  };

  Config.prototype.baseUrl = function() {
    return this.environment.baseUrl();
  };

  Config.prototype.baseMerchantUrl = function() {
    return this.baseUrl() + this.baseMerchantPath();
  };

  return Config;
})();

exports.Config = Config;
