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
var Disbursement = require('./disbursement').Disbursement;

var DisbursementGateway = (function(_super) {
  __extends(DisbursementGateway, _super);
  function DisbursementGateway(gateway) {
    this.gateway = gateway;
    this.config = this.gateway.config;
  }

  DisbursementGateway.prototype.transactions = function(disbursement, callback) {
    var transactionIds;
    transactionIds = disbursement.transactionIds;
    return this.gateway.transaction.search((function(search) {
      return search.ids()['in'](transactionIds);
    }), callback(null, new Disbursement(disbursement)));
  };

  return DisbursementGateway;
})(Gateway);

exports.DisbursementGateway = DisbursementGateway;
