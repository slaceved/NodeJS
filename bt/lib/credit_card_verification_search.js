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
var CreditCard = require('./credit_card').CreditCard;
var CreditCardVerification = require('./credit_card_verification').CreditCardVerification;
var CreditCardVerificationSearch = (function(_super) {
  __extends(CreditCardVerificationSearch, _super);
  function CreditCardVerificationSearch() {
    return CreditCardVerificationSearch.__super__.constructor.apply(this, arguments);
  }

  CreditCardVerificationSearch.textFields('billingAddressDetailsPostalCode', 'creditCardCardholderName', 'customerEmail', 'customerId',
    'id', 'paymentMethodToken');
  CreditCardVerificationSearch.equalityFields('creditCardExpirationDate');
  CreditCardVerificationSearch.partialMatchFields('creditCardNumber');
  CreditCardVerificationSearch.multipleValueField('creditCardCardType', {
    'allows': CreditCard.CardType.All()
  });

  CreditCardVerificationSearch.multipleValueField('status', {
    'allows': CreditCardVerification.StatusType.All()
  });

  CreditCardVerificationSearch.multipleValueField('ids');
  CreditCardVerificationSearch.rangeFields('createdAt');

  return CreditCardVerificationSearch;
})(AdvancedSearch);

exports.CreditCardVerificationSearch = CreditCardVerificationSearch;
