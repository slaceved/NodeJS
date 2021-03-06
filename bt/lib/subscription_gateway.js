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

var  __slice = [].slice;
var Gateway = require('./gateway').Gateway;
var Subscription = require('./subscription').Subscription;
var SubscriptionSearch = require('./subscription_search').SubscriptionSearch;
var TransactionGateway = require('./transaction_gateway').TransactionGateway;
var exceptions = require('./exceptions');

var SubscriptionGateway = (function(_super) {
  __extends(SubscriptionGateway, _super);
  function SubscriptionGateway(gateway) {
    this.gateway = gateway;
    this.config = this.gateway.config;
  }

  SubscriptionGateway.prototype.create = function(attributes, callback) {
    return this.gateway.http.post('' + (this.config.baseMerchantPath()) + '/subscriptions', {
      subscription: attributes
    }, this.responseHandler(callback));
  };

  SubscriptionGateway.prototype.cancel = function(subscriptionId, callback) {
    return this.gateway.http.put('' + (this.config.baseMerchantPath()) + '/subscriptions/' + subscriptionId + '/cancel', null,
      this.responseHandler(callback));
  };

  SubscriptionGateway.prototype.find = function(subscriptionId, callback) {
    if (subscriptionId.trim() === '') {
      return callback(exceptions.NotFoundError('Not Found'), null);
    } else {
      return this.gateway.http.get('' + (this.config.baseMerchantPath()) + '/subscriptions/' + subscriptionId, function(err, response) {
        if (err) {
          return callback(err, null);
        } else {
          return callback(null, new Subscription(response.subscription));
        }
      });
    }
  };

  SubscriptionGateway.prototype.responseHandler = function(callback) {
    return this.createResponseHandler('subscription', Subscription, callback);
  };

  SubscriptionGateway.prototype.retryCharge = function() {
    var amount, callback, subscriptionId, _i;
    subscriptionId = arguments[0],
      amount = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), callback = arguments[_i++];
    return new TransactionGateway(this.gateway).sale({
      amount: amount[0],
      subscriptionId: subscriptionId
    }, callback);
  };

  SubscriptionGateway.prototype.search = function(fn, callback) {
    var search;
    search = new SubscriptionSearch();
    fn(search);
    return this.createSearchResponse('' + (this.config.baseMerchantPath()) + '/subscriptions/advanced_search_ids',
      search, this.pagingFunctionGenerator(search), callback);
  };

  SubscriptionGateway.prototype.update = function(subscriptionId, attributes, callback) {
    return this.gateway.http.put('' + (this.config.baseMerchantPath()) + '/subscriptions/' + subscriptionId, {
      subscription: attributes
    }, this.responseHandler(callback));
  };

  SubscriptionGateway.prototype.pagingFunctionGenerator = function(search) {
    return SubscriptionGateway.__super__.pagingFunctionGenerator.call(this, search, 'subscriptions', Subscription, function(response) {
      return response.subscriptions.subscription;
    });
  };

  return SubscriptionGateway;
})(Gateway);

exports.SubscriptionGateway = SubscriptionGateway;
