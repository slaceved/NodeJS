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

var __slice = [].slice;
var Gateway = require('./gateway').Gateway;
var Transaction = require('./transaction').Transaction;
var TransactionSearch = require('./transaction_search').TransactionSearch;
var ErrorResponse = require('./error_response').ErrorResponse;
var Util = require('./util').Util;
var exceptions = require('./exceptions');
var deprecate = require('depd')('braintree/gateway.transaction');

var TransactionGateway = (function(_super) {
  __extends(TransactionGateway, _super);
  function TransactionGateway(gateway) {
    this.gateway = gateway;
    this.config = this.gateway.config;
  }

  TransactionGateway.prototype.SUBMIT_FOR_SETTLEMENT_SIGNATURE = ['orderId', 'descriptor[name]', 'descriptor[phone]', 'descriptor[url]'];

  TransactionGateway.prototype.UPDATE_DETAILS_SIGNATURE = ['amount', 'orderId', 'descriptor[name]', 'descriptor[phone]', 'descriptor[url]'];

  TransactionGateway.prototype.cancelRelease = function(transactionId, callback) {
    return this.gateway.http.put('' + (this.config.baseMerchantPath()) + '/transactions/' + transactionId + '/cancel_release', {},
      this.responseHandler(callback));
  };

  TransactionGateway.prototype.cloneTransaction = function(transactionId, attributes, callback) {
    return this.gateway.http.post('' + (this.config.baseMerchantPath()) + '/transactions/' + transactionId + '/clone', {
      transactionClone: attributes
    }, this.responseHandler(callback));
  };

  TransactionGateway.prototype.create = function(attributes, callback) {
    return this.gateway.http.post('' + (this.config.baseMerchantPath()) + '/transactions', {
      transaction: attributes
    }, this.responseHandler(callback));
  };

  TransactionGateway.prototype.credit = function(attributes, callback) {
    attributes.type = 'credit';
    return this.create(attributes, callback);
  };

  TransactionGateway.prototype.find = function(transactionId, callback) {
    if (transactionId.trim() === '') {
      return callback(exceptions.NotFoundError('Not Found'), null);
    } else {
      return this.gateway.http.get('' + (this.config.baseMerchantPath()) + '/transactions/' + transactionId, function(err, response) {
        if (err) {
          return callback(err, null);
        } else {
          return callback(null, new Transaction(response.transaction));
        }
      });
    }
  };

  TransactionGateway.prototype.holdInEscrow = function(transactionId, callback) {
    return this.gateway.http.put('' + (this.config.baseMerchantPath()) + '/transactions/' + transactionId + '/hold_in_escrow', {},
      this.responseHandler(callback));
  };

  TransactionGateway.prototype.refund = function() {
    var amount, callback, transactionId, _i;
    transactionId = arguments[0], amount = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []),
      callback = arguments[_i++];
    return this.gateway.http.post('' + (this.config.baseMerchantPath()) + '/transactions/' + transactionId + '/refund', {
      transaction: {
        amount: amount[0]
      }
    }, this.responseHandler(callback));
  };

  TransactionGateway.prototype.responseHandler = function(callback) {
    return this.createResponseHandler('transaction', Transaction, callback);
  };

  TransactionGateway.prototype.sale = function(attributes, callback) {
    attributes.type = 'sale';
    return this.create(attributes, callback);
  };

  TransactionGateway.prototype.search = function(fn, callback) {
    var search;
    search = new TransactionSearch();
    fn(search);
    return this.createSearchResponse('' + (this.config.baseMerchantPath()) + '/transactions/advanced_search_ids', search,
      this.pagingFunctionGenerator(search), callback);
  };

  TransactionGateway.prototype.releaseFromEscrow = function(transactionId, callback) {
    return this.gateway.http.put('' + (this.config.baseMerchantPath()) + '/transactions/' + transactionId + '/release_from_escrow', {},
      this.responseHandler(callback));
  };

  TransactionGateway.prototype.submitForSettlement = function() {
    var amount, attributes, callback, options, transactionId, _i;
    transactionId = arguments[0], attributes = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []),
      callback = arguments[_i++];
    amount = attributes[0];
    options = attributes[1] || {};
    if (arguments.length > 4) {
      deprecate('Received too many args for submitForSettlement (' + arguments.length + ' for 4)');
    }
    Util.verifyKeys(this.SUBMIT_FOR_SETTLEMENT_SIGNATURE, options, deprecate);
    return this.gateway.http.put('' + (this.config.baseMerchantPath()) + '/transactions/' + transactionId + '/submit_for_settlement', {
      transaction: {
        amount: amount,
        orderId: options['orderId'],
        descriptor: options['descriptor']
      }
    }, this.responseHandler(callback));
  };

  TransactionGateway.prototype.updateDetails = function(transactionId, options, callback) {
    Util.verifyKeys(this.UPDATE_DETAILS_SIGNATURE, options, deprecate);
    return this.gateway.http.put('' + (this.config.baseMerchantPath()) + '/transactions/' + transactionId + '/update_details', {
      transaction: options
    }, this.responseHandler(callback));
  };

  TransactionGateway.prototype.submitForPartialSettlement = function() {
    var amount, attributes, callback, options, transactionId, _i;
    transactionId = arguments[0], attributes = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []),
      callback = arguments[_i++];
    amount = attributes[0];
    options = attributes[1] || {};
    Util.verifyKeys(this.SUBMIT_FOR_SETTLEMENT_SIGNATURE, options, deprecate);
    return this.gateway.http.post('' + (this.config.baseMerchantPath()) + '/transactions/' + transactionId + '/submit_for_partial_settlement', {
      transaction: {
        amount: amount,
        orderId: options['orderId'],
        descriptor: options['descriptor']
      }
    }, this.responseHandler(callback));
  };

  TransactionGateway.prototype['void'] = function(transactionId, callback) {
    return this.gateway.http.put('' + (this.config.baseMerchantPath()) + '/transactions/' + transactionId + 'void', null,
      this.responseHandler(callback));
  };

  TransactionGateway.prototype.pagingFunctionGenerator = function(search) {
    return TransactionGateway.__super__.pagingFunctionGenerator.call(this, search, 'transactions', Transaction, function(response) {
      return response.creditCardTransactions.transaction;
    });
  };

  return TransactionGateway;
})(Gateway);

exports.TransactionGateway = TransactionGateway;
