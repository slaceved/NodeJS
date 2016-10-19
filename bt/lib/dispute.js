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
var TransactionDetails = require('./transaction_details').TransactionDetails;

var Dispute = (function(_super) {
  __extends(Dispute, _super);
  Dispute.Status = {
    Open: 'open',
    Lost: 'lost',
    Won: 'won'
  };

  Dispute.Reason = {
    CancelledRecurringTransaction: 'cancelled_recurring_transaction',
    CreditNotProcessed: 'credit_not_processed',
    Duplicate: 'duplicate',
    Fraud: 'fraud',
    General: 'general',
    InvalidAccount: 'invalid_account',
    NotRecognized: 'not_recognized',
    ProductNotReceived: 'product_not_received',
    ProductUnsatisfactory: 'product_unsatisfactory',
    Retrieval: 'retrieval',
    TransactionAmountDiffers: 'transaction_amount_differs'
  };

  Dispute.Kind = {
    Chargeback: 'chargeback',
    PreArbitration: 'pre_arbitration',
    Retrieval: 'retrieval'
  };

  function Dispute(attributes) {
    Dispute.__super__.constructor.call(this, attributes);
    this.transactionDetails = new TransactionDetails(attributes.transaction);
  }

  return Dispute;
})(AttributeSetter);

exports.Dispute = Dispute;
