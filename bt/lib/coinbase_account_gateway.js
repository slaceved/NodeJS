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
var CoinbaseAccount = require('./coinbase_account').CoinbaseAccount;
var exceptions = require('./exceptions');
var CoinbaseAccountGateway = (function(_super) {
  __extends(CoinbaseAccountGateway, _super);
  function CoinbaseAccountGateway(gateway) {
    this.gateway = gateway;
    this.config = this.gateway.config;
  }

  CoinbaseAccountGateway.prototype.find = function(token, callback) {
    if (token.trim() === '') {
      return callback(exceptions.NotFoundError('Not Found'), null);
    } else {
      return this.gateway.http.get('' + (this.config.baseMerchantPath()) + '/payment_methods/coinbase_account/' + token, function(err, response) {
        if (err) {
          return callback(err, null);
        } else {
          return callback(null, new CoinbaseAccount(response.coinbaseAccount));
        }
      });
    }
  };

  CoinbaseAccountGateway.prototype['delete'] = function(token, callback) {
    return this.gateway.http['delete']('' + (this.config.baseMerchantPath()) + '/payment_methods/coinbase_account/' + token, callback);
  };

  CoinbaseAccountGateway.prototype.responseHandler = function(callback) {
    return this.createResponseHandler('coinbaseAccount', CoinbaseAccount, callback);
  };

  return CoinbaseAccountGateway;
})(Gateway);

exports.CoinbaseAccountGateway = CoinbaseAccountGateway;
