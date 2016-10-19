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
var RiskData = require('./risk_data').RiskData;

var CreditCardVerification = (function(_super) {
  __extends(CreditCardVerification, _super);
  CreditCardVerification.StatusType = {
    Failed: 'failed',
    GatewayRejected: 'gateway_rejected',
    ProcessorDeclined: 'processor_declined',
    Verified: 'verified',
    All: function() {
      var all, key, value;
      all = [];
      for (key in this) {
        value = this[key];
        if (key !== 'All') {
          all.push(value);
        }
      }
      return all;
    }
  };

  function CreditCardVerification(attributes) {
    CreditCardVerification.__super__.constructor.call(this, attributes);
    if (attributes.riskData) {
      this.riskData = new RiskData(attributes.riskData);
    }
  }

  return CreditCardVerification;
})(AttributeSetter);

exports.CreditCardVerification = CreditCardVerification;
