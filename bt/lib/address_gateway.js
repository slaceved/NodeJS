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
var Address = require('./address').Address;
var exceptions = require('./exceptions');

var AddressGateway = (function(_super) {
  __extends(AddressGateway, _super);
  function AddressGateway(gateway) {
    this.gateway = gateway;
    this.config = this.gateway.config;
  }

  AddressGateway.prototype.create = function(attributes, callback) {
    var customerId;
    customerId = attributes.customerId;
    delete attributes.customerId;
    return this.gateway.http.post('' + (this.config.baseMerchantPath()) + '/customers/' + customerId + '/addresses', {
      address: attributes
    }, this.responseHandler(callback));
  };

  AddressGateway.prototype['delete'] = function(customerId, id, callback) {
    return this.gateway.http['delete']('' + (this.config.baseMerchantPath()) + '/customers/' + customerId + '/addresses/' + id, callback);
  };

  AddressGateway.prototype.find = function(customerId, id, callback) {
    if (customerId.trim() === '' || id.trim() === '') {
      return callback(exceptions.NotFoundError('Not Found'), null);
    } else {
      return this.gateway.http.get('' + (this.config.baseMerchantPath()) + '/customers/' + customerId + '/addresses/' + id, function(err, response) {
        if (err) {
          return callback(err, null);
        } else {
          return callback(null, response.address);
        }
      });
    }
  };

  AddressGateway.prototype.update = function(customerId, id, attributes, callback) {
    return this.gateway.http.put('' + (this.config.baseMerchantPath()) + '/customers/' + customerId + '/addresses/' + id, {
      address: attributes
    }, this.responseHandler(callback));
  };

  AddressGateway.prototype.responseHandler = function(callback) {
    return this.createResponseHandler('address', Address, callback);
  };

  return AddressGateway;
})(Gateway);

exports.AddressGateway = AddressGateway;
