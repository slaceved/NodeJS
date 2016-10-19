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

var AdvancedSearch = require('./advanced_search').AdvancedSearch;
var Subscription = require('./subscription').Subscription;

var SubscriptionSearch = (function(_super) {
  __extends(SubscriptionSearch, _super);
  function SubscriptionSearch() {
    return SubscriptionSearch.__super__.constructor.apply(this, arguments);
  }

  SubscriptionSearch.multipleValueField('inTrialPeriod');
  SubscriptionSearch.multipleValueField('ids');
  SubscriptionSearch.textFields('id', 'transactionId');
  SubscriptionSearch.multipleValueOrTextField('planId');
  SubscriptionSearch.multipleValueField('status', {
     'allows': Subscription.Status.All()
  });

  SubscriptionSearch.multipleValueField('merchantAccountId');
  SubscriptionSearch.rangeFields('price', 'daysPastDue', 'billingCyclesRemaining', 'nextBillingDate');

  return SubscriptionSearch;
})(AdvancedSearch);

exports.SubscriptionSearch = SubscriptionSearch;
