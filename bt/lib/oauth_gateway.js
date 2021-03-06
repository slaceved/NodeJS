'use strict';

var __hasProp = {}.hasOwnProperty;
var __extends = function(child, parent) {
  for (var key in parent) {
    if (__hasProp.call(parent, key)) {
      child[key] = parent[key];
    }
  } function Ctor() {
    this.constructor = child;
  }
  Ctor.prototype = parent.prototype;
  child.prototype = new Ctor();
  child.__super__ = parent.prototype;
  return child;
};

var Gateway = require('./gateway').Gateway;
var OAuthCredentials = require('./oauth_credentials').OAuthCredentials;
var AttributeSetter = require('./attribute_setter').AttributeSetter;
var Util = require('./util').Util;
var Digest = require('./digest').Digest;
var exceptions = require('./exceptions');

var OAuthGateway = (function(_super) {
  __extends(OAuthGateway, _super);
  function OAuthGateway(gateway) {
    this.gateway = gateway;
    this.config = this.gateway.config;
  }

  OAuthGateway.prototype.createTokenFromCode = function(attributes, callback) {
    attributes.grantType = 'authorization_code';
    return this.gateway.http.post('/oauth/access_tokens', attributes, this.responseHandler(callback));
  };

  OAuthGateway.prototype.createTokenFromRefreshToken = function(attributes, callback) {
    attributes.grantType = 'refresh_token';
    return this.gateway.http.post('/oauth/access_tokens', attributes, this.responseHandler(callback));
  };

  OAuthGateway.prototype.revokeAccessToken = function(accessToken, callback) {
    return this.gateway.http.post('/oauth/revoke_access_token', {
      token: accessToken
    }, this.createResponseHandler('result', AttributeSetter, callback));
  };

  OAuthGateway.prototype.responseHandler = function(callback) {
    return this.createResponseHandler('credentials', OAuthCredentials, callback);
  };

  OAuthGateway.prototype.connectUrl = function(params) {
    var signature, url;
    params.clientId = this.config.clientId;
    url = this.config.baseUrl() + '/oauth/connect?' + this.buildQuery(params);
    signature = Digest.Sha256hexdigest(this.config.clientSecret, url);
    return url + ('&signature=' + signature + '&algorithm=SHA256');
  };

  OAuthGateway.prototype.buildQuery = function(params) {
    var key, paramsArray, queryStringParts, val;
    params = Util.convertObjectKeysToUnderscores(params);
    paramsArray = this.buildSubQuery('user', params.user);
    paramsArray.push.apply(paramsArray, this.buildSubQuery('business', params.business));
    paramsArray.push.apply(paramsArray, this.buildSubArrayQuery('payment_methods', params.payment_methods));
    delete params.user;
    delete params.business;
    delete params.payment_methods;
    paramsArray.push.apply(paramsArray, (function() {
      var _results;
      _results = [];
      for (key in params) {
        val = params[key];
        _results.push([key, val]);
      }
      return _results;
    })());
    queryStringParts = paramsArray.map(function(_arg) {
      var key, value;
      key = _arg[0], value = _arg[1];
      return '' + (encodeURIComponent(key)) + '=' + (encodeURIComponent(value));
    });
    return queryStringParts.join('&');
  };

  OAuthGateway.prototype.buildSubQuery = function(key, subParams) {
    var arr, subKey, value;
    arr = [];
    for (subKey in subParams) {
      value = subParams[subKey];
      arr.push(['' + key + '[' + subKey + ']', value]);
    }
    return arr;
  };

  OAuthGateway.prototype.buildSubArrayQuery = function(key, values) {
    return (values || []).map(function(value) {
      return ['' + key + '[]', value];
    });
  };

  return OAuthGateway;
})(Gateway);

exports.OAuthGateway = OAuthGateway;
