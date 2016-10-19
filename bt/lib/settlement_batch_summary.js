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

var SettlementBatchSummary = (function(_super) {
  __extends(SettlementBatchSummary, _super);
  function SettlementBatchSummary() {
    return SettlementBatchSummary.__super__.constructor.apply(this, arguments);
  }

  return SettlementBatchSummary;
})(AttributeSetter);

exports.SettlementBatchSummary = SettlementBatchSummary;
