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
var CreditCard = require('./credit_card').CreditCard;
var exceptions = require('./exceptions');
var CreditCardGateway = (function(_super) {
  __extends(CreditCardGateway, _super);
  function CreditCardGateway(gateway) {
    this.gateway = gateway;
    this.config = this.gateway.config;
  }

  CreditCardGateway.prototype.create = function(attributes, callback) {
    return this.gateway.http.post('' + (this.config.baseMerchantPath()) + '/payment_methods', {
      creditCard: attributes
    }, this.responseHandler(callback));
  };

  CreditCardGateway.prototype['delete'] = function(token, callback) {
    return this.gateway.http['delete']('' + (this.config.baseMerchantPath()) + '/payment_methods/credit_card/' + token, callback);
  };

  CreditCardGateway.prototype.find = function(token, callback) {
    if (token.trim() === '') {
      return callback(exceptions.NotFoundError('Not Found'), null);
    } else {
      return this.gateway.http.get('' + (this.config.baseMerchantPath()) + '/payment_methods/credit_card/' + token, function(err, response) {
        if (err) {
          return callback(err, null);
        } else {
          return callback(null, new CreditCard(response.creditCard));
        }
      });
    }
  };

  CreditCardGateway.prototype.fromNonce = function(nonce, callback) {
    if (nonce.trim() === '') {
      return callback(exceptions.NotFoundError('Not Found'), null);
    } else {
      return this.gateway.http.get('' + (this.config.baseMerchantPath()) + '/payment_methods/from_nonce/' + nonce, function(err, response) {
        if (err) {
          err.message = 'Payment method with nonce ' + nonce + ' locked, consumed or not found';
          return callback(err, null);
        } else {
          return callback(null, new CreditCard(response.creditCard));
        }
      });
    }
  };

  CreditCardGateway.prototype.update = function(token, attributes, callback) {
    return this.gateway.http.put('' + (this.config.baseMerchantPath()) + '/payment_methods/credit_card/' + token, {
      creditCard: attributes
    }, this.responseHandler(callback));
  };

  CreditCardGateway.prototype.responseHandler = function(callback) {
    return this.createResponseHandler('creditCard', CreditCard, callback);
  };

  CreditCardGateway.prototype.expired = function(callback) {
    return this.gateway.http.post('' + (this.config.baseMerchantPath()) + '/payment_methods/all/expired_ids', {},
      this.searchResponseHandler(this, callback));
  };

  CreditCardGateway.prototype.expiringBetween = function(after, before, callback) {
    var url;
    url = '' + (this.config.baseMerchantPath()) + '/payment_methods/all/expiring_ids?start=' + (this.dateFormat(after)) + '&end=' +
      (this.dateFormat(before));
    return this.gateway.http.post(url, {}, this.searchResponseHandler(this, callback));
  };

  CreditCardGateway.prototype.dateFormat = function(date) {
    var month;
    month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    } else {
      month = '' + month;
    }
    return month + date.getFullYear();
  };

  return CreditCardGateway;
})(Gateway);

exports.CreditCardGateway = CreditCardGateway;
