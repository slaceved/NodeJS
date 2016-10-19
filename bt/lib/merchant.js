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
var MerchantAccount = require('./merchant_account').MerchantAccount;

var Merchant = (function(_super) {
  __extends(Merchant, _super);
  function Merchant(attributes) {
    var merchantAccountAttributes;
    Merchant.__super__.constructor.call(this, attributes);
    if (attributes.merchantAccounts) {
      this.merchantAccounts = (function() {
        var _i, _len, _ref, _results;
        _ref = attributes.merchantAccounts;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          merchantAccountAttributes = _ref[_i];
          _results.push(new MerchantAccount(merchantAccountAttributes));
        }
        return _results;
      })();
    }
  }

  return Merchant;
})(AttributeSetter);

exports.Merchant = Merchant;
