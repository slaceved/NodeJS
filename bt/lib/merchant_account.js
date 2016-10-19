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

var MerchantAccount = (function(_super) {
  __extends(MerchantAccount, _super);
  MerchantAccount.Status = {
    Pending: 'pending',
    Active: 'active',
    Suspended: 'suspended'
  };

  MerchantAccount.FundingDestination = {
    Bank: 'bank',
    Email: 'email',
    MobilePhone: 'mobile_phone'
  };

  function MerchantAccount(attributes) {
    MerchantAccount.__super__.constructor.call(this, attributes);
    if (attributes.masterMerchantAccount) {
      this.masterMerchantAccount = new MerchantAccount(attributes.masterMerchantAccount);
    }
  }

  return MerchantAccount;
})(AttributeSetter);

exports.MerchantAccount = MerchantAccount;
