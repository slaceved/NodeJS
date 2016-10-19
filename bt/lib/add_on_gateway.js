'use strict';

var __hasProp = {}.hasOwnProperty;
var __extends = function(child, parent) {
    for (var key in parent) {
      if (__hasProp.call(parent, key)){
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

var AddOn = require('./add_on').AddOn;
var Gateway = require('./gateway').Gateway;

var AddOnGateway = (function(_super) {
  __extends(AddOnGateway, _super);
  function AddOnGateway(gateway) {
    this.gateway = gateway;
    this.config = this.gateway.config;
  }
  AddOnGateway.prototype.all = function(callback) {
    return this.gateway.http.get('' + (this.config.baseMerchantPath()) + '/add_ons', this.createResponseHandler('add_on', AddOn, callback));
  };
  return AddOnGateway;
})(Gateway);

exports.AddOnGateway = AddOnGateway;
