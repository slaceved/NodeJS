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
var Merchant = require('./merchant').Merchant;
var OAuthCredentials = require('./oauth_credentials').OAuthCredentials;

var MerchantGateway = (function(_super) {
  __extends(MerchantGateway, _super);
  function MerchantGateway(gateway) {
    this.gateway = gateway;
    this.config = this.gateway.config;
  }

  MerchantGateway.prototype.create = function(attributes, callback) {
    return this.gateway.http.post('/merchants/create_via_api', {
      merchant: attributes
    }, this.responseHandler(callback));
  };

  MerchantGateway.prototype.responseHandler = function(callback) {
    return this.createResponseHandler(null, null, function(err, response) {
      if (!err && response.success) {
        response.merchant = new Merchant(response.response.merchant);
        response.credentials = new OAuthCredentials(response.response.credentials);
        delete response.response;
      }
      return callback(err, response);
    });
  };

  return MerchantGateway;
})(Gateway);

exports.MerchantGateway = MerchantGateway;
