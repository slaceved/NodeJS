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
var Util = require('./util').Util;
var SettlementBatchSummary = require('./settlement_batch_summary').SettlementBatchSummary;

var SettlementBatchSummaryGateway = (function(_super) {
  __extends(SettlementBatchSummaryGateway, _super);
  function SettlementBatchSummaryGateway(gateway) {
    this.gateway = gateway;
    this.config = this.gateway.config;
  }

  SettlementBatchSummaryGateway.prototype.generate = function(criteria, callback) {
    return this.gateway.http.post('' + (this.config.baseMerchantPath()) + '/settlement_batch_summary', {
      settlementBatchSummary: criteria
    }, this.responseHandler(criteria, callback));
  };

  SettlementBatchSummaryGateway.prototype.responseHandler = function(criteria, callback) {
    var _this = this;
    return this.createResponseHandler('settlementBatchSummary', SettlementBatchSummary, function(err, response) {
      return callback(null, _this.underscoreCustomField(criteria, response));
    });
  };

  SettlementBatchSummaryGateway.prototype.underscoreCustomField = function(criteria, response) {
    var camelCustomField, record, _i, _len, _ref;
    if (response.success && ('groupByCustomField' in criteria)) {
      camelCustomField = Util.toCamelCase(criteria.groupByCustomField);
      _ref = response.settlementBatchSummary.records;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        record = _ref[_i];
        record[criteria.groupByCustomField] = record[camelCustomField];
        record[camelCustomField] = null;
      }
    }
    return response;
  };

  return SettlementBatchSummaryGateway;
})(Gateway);

exports.SettlementBatchSummaryGateway = SettlementBatchSummaryGateway;
