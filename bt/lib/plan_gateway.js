'use strict';

var __hasProp = {}.hasOwnProperty;
var  __extends = function(child, parent) {
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
var Plan = require('./plan').Plan;

var PlanGateway = (function(_super) {
  __extends(PlanGateway, _super);
  function PlanGateway(gateway) {
    this.gateway = gateway;
    this.config = this.gateway.config;
  }

  PlanGateway.prototype.all = function(callback) {
    return this.gateway.http.get('' + (this.config.baseMerchantPath()) + '/plans', this.createResponseHandler('plan', Plan, callback));
  };

  return PlanGateway;
})(Gateway);

exports.PlanGateway = PlanGateway;
