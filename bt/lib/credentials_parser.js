'use strict';

var Environment = require('./environment').Environment;

var CredentialsParser = (function() {
  function CredentialsParser() {}

  CredentialsParser.prototype.parseClientCredentials = function(clientId, clientSecret) {
    var clientIdEnvironment, clientSecretEnvironment;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    if (!this.clientId) {
      throw new Error('Missing clientId');
    }
    if (!this.clientSecret) {
      throw new Error('Missing clientSecret');
    }
    if (this.clientId.indexOf('client_id') !== 0) {
      throw new Error('Value passed for clientId is not a client id');
    }
    if (this.clientSecret.indexOf('client_secret') !== 0) {
      throw new Error('Value passed for clientSecret is not a client secret');
    }
    clientIdEnvironment = this.parseEnvironment(this.clientId);
    clientSecretEnvironment = this.parseEnvironment(this.clientSecret);
    if (clientIdEnvironment !== clientSecretEnvironment) {
      var str = 'Mismatched credential environments: clientId environment is ';
      str += clientIdEnvironment + ' and clientSecret environment is ' + clientSecretEnvironment;
      throw new Error(str);
    } else {
      return this.environment = clientIdEnvironment;
    }
  };

  CredentialsParser.prototype.parseAccessToken = function(accessToken) {
    this.accessToken = accessToken;
    if (!this.accessToken) {
      throw new Error('Missing access token');
    }
    if (this.accessToken.indexOf('access_token') !== 0) {
      throw new Error('Value passed for accessToken is not a valid access token');
    }
    this.merchantId = this.accessToken.split('$')[2];
    return this.environment = this.parseEnvironment(this.accessToken);
  };

  CredentialsParser.prototype.parseEnvironment = function(credential) {
    var env;
    env = credential.split('$')[1];
    switch (env) {
      case 'development':
      case 'integration':
        return Environment.Development;
      case 'qa':
        return Environment.Qa;
      case 'sandbox':
        return Environment.Sandbox;
      case 'production':
        return Environment.Production;
      default:
        throw new Error('Unknown environment: ' + env);
    }
  };

  return CredentialsParser;
})();

exports.CredentialsParser = CredentialsParser;
