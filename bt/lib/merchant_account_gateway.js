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
var MerchantAccount = require('./merchant_account').MerchantAccount;
var exceptions = require('./exceptions');

var MerchantAccountGateway = (function(_super) {
  __extends(MerchantAccountGateway, _super);
  function MerchantAccountGateway(gateway) {
    this.gateway = gateway;
    this.config = this.gateway.config;
  }

  MerchantAccountGateway.prototype.create = function(attributes, callback) {
    return this.gateway.http.post('' + (this.config.baseMerchantPath()) + '/merchant_accounts/create_via_api', {
      merchantAccount: attributes
    }, this.responseHandler(callback));
  };

  MerchantAccountGateway.prototype.update = function(id, attributes, callback) {
    return this.gateway.http.put('' + (this.config.baseMerchantPath()) + '/merchant_accounts/' + id + '/update_via_api', {
      merchantAccount: attributes
    }, this.responseHandler(callback));
  };

  MerchantAccountGateway.prototype.find = function(id, callback) {
    if (id.trim() === '') {
      return callback(exceptions.NotFoundError('Not Found'), null);
    } else {
      return this.gateway.http.get('' + (this.config.baseMerchantPath()) + '/merchant_accounts/' + id, function(err, response) {
        if (err) {
          return callback(err, null);
        } else {
          return callback(null, new MerchantAccount(response.merchantAccount));
        }
      });
    }
  };

  MerchantAccountGateway.prototype.responseHandler = function(callback) {
    return this.createResponseHandler('merchantAccount', MerchantAccount, callback);
  };

  return MerchantAccountGateway;
})(Gateway);

exports.MerchantAccountGateway = MerchantAccountGateway;
