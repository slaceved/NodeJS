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
var Transaction = require('./transaction').Transaction;

var Subscription = (function(_super) {
  __extends(Subscription, _super);
  Subscription.Source = {
    Api: 'api',
    ControlPanel: 'control_panel',
    Recurring: 'recurring'
  };

  Subscription.Status = {
    Active: 'Active',
    Canceled: 'Canceled',
    Expired: 'Expired',
    PastDue: 'Past Due',
    Pending: 'Pending',
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

  function Subscription(attributes) {
    var transactionAttributes;
    Subscription.__super__.constructor.call(this, attributes);
    this.transactions = (function() {
      var _i, _len, _ref, _results;
      _ref = attributes.transactions;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        transactionAttributes = _ref[_i];
        _results.push(new Transaction(transactionAttributes));
      }
      return _results;
    })();
  }

  return Subscription;
})(AttributeSetter);

exports.Subscription = Subscription;
