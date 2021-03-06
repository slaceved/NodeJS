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
var Customer = require('./customer').Customer;
var CustomerSearch = require('./customer_search').CustomerSearch;
var exceptions = require('./exceptions');

var CustomerGateway = (function(_super) {
  __extends(CustomerGateway, _super);
  function CustomerGateway(gateway) {
    this.gateway = gateway;
    this.config = this.gateway.config;
  }

  CustomerGateway.prototype.create = function(attributes, callback) {
    return this.gateway.http.post('' + (this.config.baseMerchantPath()) + '/customers', {
      customer: attributes
    }, this.responseHandler(callback));
  };

  CustomerGateway.prototype['delete'] = function(customerId, callback) {
    return this.gateway.http['delete']('' + (this.config.baseMerchantPath()) + '/customers/' + customerId, callback);
  };

  CustomerGateway.prototype.find = function(customerId, callback) {
    if (customerId.trim() === '') {
      return callback(exceptions.NotFoundError('Not Found'), null);
    } else {
      return this.gateway.http.get('' + (this.config.baseMerchantPath()) + '/customers/' + customerId, function(err, response) {
        if (err) {
          return callback(err, null);
        } else {
          return callback(null, new Customer(response.customer));
        }
      });
    }
  };

  CustomerGateway.prototype.update = function(customerId, attributes, callback) {
    return this.gateway.http.put('' + (this.config.baseMerchantPath()) + '/customers/' + customerId, {
      customer: attributes
    }, this.responseHandler(callback));
  };

  CustomerGateway.prototype.search = function(fn, callback) {
    var search;
    search = new CustomerSearch();
    fn(search);
    return this.createSearchResponse('' + (this.config.baseMerchantPath()) + '/customers/advanced_search_ids', search,
      this.pagingFunctionGenerator(search), callback);
  };

  CustomerGateway.prototype.responseHandler = function(callback) {
    return this.createResponseHandler('customer', Customer, callback);
  };

  CustomerGateway.prototype.pagingFunctionGenerator = function(search) {
    return CustomerGateway.__super__.pagingFunctionGenerator.call(this, search, 'customers', Customer, function(response) {
      return response.customers.customer;
    });
  };

  return CustomerGateway;
})(Gateway);

exports.CustomerGateway = CustomerGateway;
