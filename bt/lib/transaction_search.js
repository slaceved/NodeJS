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
var Transaction = require('./transaction').Transaction;
var CreditCard = require('./credit_card').CreditCard;

var TransactionSearch = (function(_super) {
  __extends(TransactionSearch, _super);
  function TransactionSearch() {
    return TransactionSearch.__super__.constructor.apply(this, arguments);
  }

  TransactionSearch.textFields('billingCompany', 'billingCountryName', 'billingExtendedAddress', 'billingFirstName', 'billingLastName',
  'billingLocality', 'billingPostalCode', 'billingRegion', 'billingStreetAddress', 'creditCardCardholderName', 'currency', 'customerCompany',
  'customerEmail', 'customerFax', 'customerFirstName', 'customerId', 'customerLastName', 'customerPhone', 'customerWebsite', 'id', 'orderId',
  'paymentMethodToken', 'paypalPayerEmail', 'paypalPaymentId', 'paypalAuthorizationId', 'processorAuthorizationCode', 'settlementBatchId',
  'shippingCompany', 'shippingCountryName', 'shippingExtendedAddress', 'shippingFirstName', 'shippingLastName', 'shippingLocality',
  'shippingPostalCode', 'shippingRegion', 'shippingStreetAddress', 'creditCardUniqueIdentifier');

  TransactionSearch.equalityFields('creditCardExpirationDate');
  TransactionSearch.partialMatchFields('creditCardNumber');

  TransactionSearch.multipleValueField('createdUsing', {
    'allows': [Transaction.CreatedUsing.FullInformation, Transaction.CreatedUsing.Token]
  });

  TransactionSearch.multipleValueField('creditCardCardType', {
    'allows': CreditCard.CardType.All()
  });

  TransactionSearch.multipleValueField('creditCardCustomerLocation', {
    'allows': [CreditCard.CustomerLocation.International, CreditCard.CustomerLocation.US]
  });

  TransactionSearch.multipleValueField('ids');
  TransactionSearch.multipleValueField('user');
  TransactionSearch.multipleValueField('paymentInstrumentType');
  TransactionSearch.multipleValueField('merchantAccountId');

  TransactionSearch.multipleValueField('status', {
    'allows': Transaction.Status.All()
  });

  TransactionSearch.multipleValueField('source');

  TransactionSearch.multipleValueField('type', {
    'allows': Transaction.Type.All()
  });

  TransactionSearch.keyValueFields('refund');

  TransactionSearch.rangeFields('amount', 'authorizationExpiredAt', 'authorizedAt', 'createdAt', 'disbursementDate', 'disputeDate', 'failedAt',
    'gatewayRejectedAt', 'processorDeclinedAt', 'settledAt', 'submittedForSettlementAt', 'voidedAt');

  return TransactionSearch;
})(AdvancedSearch);

exports.TransactionSearch = TransactionSearch;
