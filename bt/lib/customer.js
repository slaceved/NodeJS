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

var AttributeSetter = require('./attribute_setter').AttributeSetter;
var ApplePayCard = require('./apple_pay_card').ApplePayCard;
var AndroidPayCard = require('./android_pay_card').AndroidPayCard;
var AmexExpressCheckoutCard = require('./amex_express_checkout_card').AmexExpressCheckoutCard;
var CreditCard = require('./credit_card').CreditCard;
var PayPalAccount = require('./paypal_account').PayPalAccount;
var CoinbaseAccount = require('./coinbase_account').CoinbaseAccount;
var VenmoAccount = require('./venmo_account').VenmoAccount;

var Customer = (function(_super) {
  __extends(Customer, _super);
  function Customer(attributes) {
    var cardAttributes, coinbaseAccountAttributes, paypalAccountAttributes, venmoAccountAttributes;
    Customer.__super__.constructor.call(this, attributes);
    this.paymentMethods = [];
    if (attributes.creditCards) {
      this.creditCards = (function() {
        var _i, _len, _ref, _results;
        _ref = attributes.creditCards;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cardAttributes = _ref[_i];
          _results.push(new CreditCard(cardAttributes));
        }
        return _results;
      })();
      this._addPaymentMethods(this.creditCards);
    }
    if (attributes.applePayCards) {
      this.applePayCards = (function() {
        var _i, _len, _ref, _results;
        _ref = attributes.applePayCards;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cardAttributes = _ref[_i];
          _results.push(new ApplePayCard(cardAttributes));
        }
        return _results;
      })();
      this._addPaymentMethods(this.applePayCards);
    }
    if (attributes.androidPayCards) {
      this.androidPayCards = (function() {
        var _i, _len, _ref, _results;
        _ref = attributes.androidPayCards;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cardAttributes = _ref[_i];
          _results.push(new AndroidPayCard(cardAttributes));
        }
        return _results;
      })();
      this._addPaymentMethods(this.androidPayCards);
    }
    if (attributes.amexExpressCheckoutCards) {
      this.amexExpressCheckoutCards = (function() {
        var _i, _len, _ref, _results;
        _ref = attributes.amexExpressCheckoutCards;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cardAttributes = _ref[_i];
          _results.push(new AmexExpressCheckoutCard(cardAttributes));
        }
        return _results;
      })();
      this._addPaymentMethods(this.amexExpressCheckoutCards);
    }
    if (attributes.paypalAccounts) {
      this.paypalAccounts = (function() {
        var _i, _len, _ref, _results;
        _ref = attributes.paypalAccounts;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          paypalAccountAttributes = _ref[_i];
          _results.push(new PayPalAccount(paypalAccountAttributes));
        }
        return _results;
      })();
      this._addPaymentMethods(this.paypalAccounts);
    }
    if (attributes.coinbaseAccounts) {
      this.coinbaseAccounts = (function() {
        var _i, _len, _ref, _results;
        _ref = attributes.coinbaseAccounts;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          coinbaseAccountAttributes = _ref[_i];
          _results.push(new CoinbaseAccount(coinbaseAccountAttributes));
        }
        return _results;
      })();
      this._addPaymentMethods(this.coinbaseAccounts);
    }
    if (attributes.venmoAccounts) {
      this.venmoAccounts = (function() {
        var _i, _len, _ref, _results;
        _ref = attributes.venmoAccounts;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          venmoAccountAttributes = _ref[_i];
          _results.push(new VenmoAccount(venmoAccountAttributes));
        }
        return _results;
      })();
      this._addPaymentMethods(this.venmoAccounts);
    }
  }

  Customer.prototype._addPaymentMethods = function(paymentMethods) {
    var paymentMethod, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = paymentMethods.length; _i < _len; _i++) {
      paymentMethod = paymentMethods[_i];
      _results.push(this.paymentMethods.push(paymentMethod));
    }
    return _results;
  };

  return Customer;
})(AttributeSetter);

exports.Customer = Customer;
