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
var ApplePayCard = require('./apple_pay_card').ApplePayCard;
var AndroidPayCard = require('./android_pay_card').AndroidPayCard;
var CreditCard = require('./credit_card').CreditCard;
var PayPalAccount = require('./paypal_account').PayPalAccount;
var CoinbaseAccount = require('./coinbase_account').CoinbaseAccount;
var UnknownPaymentMethod = require('./unknown_payment_method').UnknownPaymentMethod;
var PaymentMethodNonce = require('./payment_method_nonce').PaymentMethodNonce;
var VenmoAccount = require('./venmo_account').VenmoAccount;
var exceptions = require('./exceptions');

var PaymentMethodGateway = (function(_super) {
  __extends(PaymentMethodGateway, _super);
  function PaymentMethodGateway(gateway) {
    this.gateway = gateway;
    this.config = this.gateway.config;
  }

  PaymentMethodGateway.prototype.responseHandler = function(callback) {
    var responseMapping;
    responseMapping = {
      paypalAccount: PayPalAccount,
      coinbaseAccount: CoinbaseAccount,
      creditCard: CreditCard,
      applePayCard: ApplePayCard,
      androidPayCard: AndroidPayCard,
      paymentMethodNonce: PaymentMethodNonce
    };
    return this.createResponseHandler(responseMapping, null, function(err, response) {
      var parsedResponse;
      if (!err) {
        parsedResponse = PaymentMethodGateway.parsePaymentMethod(response);
        if (parsedResponse instanceof PaymentMethodNonce) {
          response.paymentMethodNonce = parsedResponse;
        } else {
          response.paymentMethod = parsedResponse;
        }
      }
      return callback(err, response);
    });
  };

  PaymentMethodGateway.prototype.create = function(attributes, callback) {
    return this.gateway.http.post('' + (this.config.baseMerchantPath()) + '/payment_methods', {
      paymentMethod: attributes
    }, this.responseHandler(callback));
  };

  PaymentMethodGateway.prototype.find = function(token, callback) {
    if (token.trim() === '') {
      return callback(exceptions.NotFoundError('Not Found'), null);
    } else {
      return this.gateway.http.get('' + (this.config.baseMerchantPath()) + '/payment_methods/any/' + token, function(err, response) {
        if (err) {
          return callback(err, null);
        } else {
          return callback(null, PaymentMethodGateway.parsePaymentMethod(response));
        }
      });
    }
  };

  PaymentMethodGateway.prototype.update = function(token, attributes, callback) {
    if (token.trim() === '') {
      return callback(exceptions.NotFoundError('Not Found'), null);
    } else {
      return this.gateway.http.put('' + (this.config.baseMerchantPath()) + '/payment_methods/any/' + token, {
        paymentMethod: attributes
      }, this.responseHandler(callback));
    }
  };

  PaymentMethodGateway.prototype.grant = function(token, allow_vaulting, callback) {
    if (token.trim() === '') {
      return callback(exceptions.NotFoundError('Not Found'), null);
    } else {
      return this.gateway.http.post('' + (this.config.baseMerchantPath()) + '/payment_methods/grant', {
        payment_method: {
          shared_payment_method_token: token,
          allow_vaulting: allow_vaulting
        }
      }, this.responseHandler(callback));
    }
  };

  PaymentMethodGateway.prototype.revoke = function(token, callback) {
    if (token.trim() === '') {
      return callback(exceptions.NotFoundError('Not Found'), null);
    } else {
      return this.gateway.http.post('' + (this.config.baseMerchantPath()) + '/payment_methods/revoke', {
        payment_method: {
          shared_payment_method_token: token
        }
      }, this.responseHandler(callback));
    }
  };

  PaymentMethodGateway.parsePaymentMethod = function(response) {
    if (response.creditCard) {
      return new CreditCard(response.creditCard);
    } else if (response.paypalAccount) {
      return new PayPalAccount(response.paypalAccount);
    } else if (response.applePayCard) {
      return new ApplePayCard(response.applePayCard);
    } else if (response.androidPayCard) {
      return new AndroidPayCard(response.androidPayCard);
    } else if (response.coinbaseAccount) {
      return new CoinbaseAccount(response.coinbaseAccount);
    } else if (response.paymentMethodNonce) {
      return new PaymentMethodNonce(response.paymentMethodNonce);
    } else if (response.venmoAccount) {
      return new VenmoAccount(response.venmoAccount);
    } else {
      return new UnknownPaymentMethod(response);
    }
  };

  PaymentMethodGateway.prototype['delete'] = function(token, callback) {
    return this.gateway.http['delete']('' + (this.config.baseMerchantPath()) + '/payment_methods/any/' + token, callback);
  };

  return PaymentMethodGateway;
})(Gateway);

exports.PaymentMethodGateway = PaymentMethodGateway;
