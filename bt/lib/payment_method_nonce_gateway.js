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
var PaymentMethodNonce = require('./payment_method_nonce').PaymentMethodNonce;
var exceptions = require('./exceptions');

var PaymentMethodNonceGateway = (function(_super) {
  __extends(PaymentMethodNonceGateway, _super);
  function PaymentMethodNonceGateway(gateway) {
    this.gateway = gateway;
    this.config = this.gateway.config;
  }

  PaymentMethodNonceGateway.prototype.responseHandler = function(callback) {
    return this.createResponseHandler('payment_method_nonce', PaymentMethodNonce, function(err, response) {
      if (!err) {
        response.paymentMethodNonce = new PaymentMethodNonce(response.paymentMethodNonce);
      }
      return callback(err, response);
    });
  };

  PaymentMethodNonceGateway.prototype.create = function(payment_method_token, callback) {
    return this.gateway.http.post('' + (this.config.baseMerchantPath()) + '/payment_methods/' + payment_method_token + '/nonces', {},
      this.responseHandler(callback));
  };

  PaymentMethodNonceGateway.prototype.find = function(payment_method_nonce, callback) {
    return this.gateway.http.get('' + (this.config.baseMerchantPath()) + '/payment_method_nonces/' + payment_method_nonce, function(err, response) {
      if (err) {
        return callback(err, null);
      } else {
        return callback(null, new PaymentMethodNonce(response.paymentMethodNonce));
      }
    });
  };

  return PaymentMethodNonceGateway;
})(Gateway);

exports.PaymentMethodNonceGateway = PaymentMethodNonceGateway;
