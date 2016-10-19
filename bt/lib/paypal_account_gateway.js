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
var PayPalAccount = require('./paypal_account').PayPalAccount;
var exceptions = require('./exceptions');

var PayPalAccountGateway = (function(_super) {
  __extends(PayPalAccountGateway, _super);
  function PayPalAccountGateway(gateway) {
    this.gateway = gateway;
    this.config = this.gateway.config;
  }

  PayPalAccountGateway.prototype.find = function(token, callback) {
    if (token.trim() === '') {
      return callback(exceptions.NotFoundError('Not Found'), null);
    } else {
      return this.gateway.http.get('' + (this.config.baseMerchantPath()) + '/payment_methods/paypal_account/' + token, function(err, response) {
        if (err) {
          return callback(err, null);
        } else {
          return callback(null, new PayPalAccount(response.paypalAccount));
        }
      });
    }
  };

  PayPalAccountGateway.prototype.update = function(token, attributes, callback) {
    return this.gateway.http.put('' + (this.config.baseMerchantPath()) + '/payment_methods/paypal_account/' + token, {
      paypalAccount: attributes
    }, this.responseHandler(callback));
  };

  PayPalAccountGateway.prototype['delete'] = function(token, callback) {
    return this.gateway.http['delete']('' + (this.config.baseMerchantPath()) + '/payment_methods/paypal_account/' + token, callback);
  };

  PayPalAccountGateway.prototype.responseHandler = function(callback) {
    return this.createResponseHandler('paypalAccount', PayPalAccount, callback);
  };

  return PayPalAccountGateway;

})(Gateway);

exports.PayPalAccountGateway = PayPalAccountGateway;
