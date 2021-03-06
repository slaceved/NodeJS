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

var AttributeSetter = require('./attribute_setter').AttributeSetter;
var ApplePayCard = require('./apple_pay_card').ApplePayCard;
var AndroidPayCard = require('./android_pay_card').AndroidPayCard;
var CreditCard = require('./credit_card').CreditCard;
var PayPalAccount = require('./paypal_account').PayPalAccount;
var CoinbaseAccount = require('./coinbase_account').CoinbaseAccount;
var DisbursementDetails = require('./disbursement_details').DisbursementDetails;
var Dispute = require('./dispute').Dispute;
var FacilitatorDetails = require('./facilitator_details').FacilitatorDetails;
var RiskData = require('./risk_data').RiskData;
var ThreeDSecureInfo = require('./three_d_secure_info').ThreeDSecureInfo;

var Transaction = (function(_super) {
  __extends(Transaction, _super);
  function Transaction(attributes) {
    var disputeAttributes;
    Transaction.__super__.constructor.call(this, attributes);
    this.creditCard = new CreditCard(attributes.creditCard);
    this.paypalAccount = new PayPalAccount(attributes.paypal);
    this.coinbaseAccount = new CoinbaseAccount(attributes.coinbaseAccount);
    this.applePayCard = new ApplePayCard(attributes.applePay);
    this.androidPayCard = new AndroidPayCard(attributes.androidPayCard);
    this.disbursementDetails = new DisbursementDetails(attributes.disbursementDetails);
    if (attributes.disputes != null) {
      this.disputes = (function() {
        var _i, _len, _ref, _results;
        _ref = attributes.disputes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          disputeAttributes = _ref[_i];
          _results.push(new Dispute(disputeAttributes));
        }
        return _results;
      })();
    }
    if (attributes.facilitatorDetails) {
      this.facilitatorDetails = new FacilitatorDetails(attributes.facilitatorDetails);
    }
    if (attributes.riskData) {
      this.riskData = new RiskData(attributes.riskData);
    }
    if (attributes.threeDSecureInfo) {
      this.threeDSecureInfo = new ThreeDSecureInfo(attributes.threeDSecureInfo);
    }
  }

  Transaction.CreatedUsing = {
    FullInformation: 'full_information',
    Token: 'token'
  };

  Transaction.EscrowStatus = {
    HoldPending: 'hold_pending',
    Held: 'held',
    ReleasePending: 'release_pending',
    Released: 'released',
    Refunded: 'refunded'
  };

  Transaction.Source = {
    Api: 'api',
    ControlPanel: 'control_panel',
    Recurring: 'recurring'
  };

  Transaction.Type = {
    Credit: 'credit',
    Sale: 'sale',
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

  Transaction.GatewayRejectionReason = {
    ApplicationIncomplete: 'application_incomplete',
    Avs: 'avs',
    Cvv: 'cvv',
    AvsAndCvv: 'avs_and_cvv',
    Duplicate: 'duplicate',
    Fraud: 'fraud',
    ThreeDSecure: 'three_d_secure'
  };

  Transaction.IndustryData = {
    Lodging: 'lodging',
    TravelAndCruise: 'travel_cruise'
  };

  Transaction.Status = {
    AuthorizationExpired: 'authorization_expired',
    Authorizing: 'authorizing',
    Authorized: 'authorized',
    GatewayRejected: 'gateway_rejected',
    Failed: 'failed',
    ProcessorDeclined: 'processor_declined',
    Settled: 'settled',
    Settling: 'settling',
    SettlementConfirmed: 'settlement_confirmed',
    SettlementDeclined: 'settlement_declined',
    SettlementPending: 'settlement_pending',
    SubmittedForSettlement: 'submitted_for_settlement',
    Voided: 'voided',
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

  Transaction.prototype.isDisbursed = function() {
    return this.disbursementDetails.isValid();
  };

  return Transaction;
})(AttributeSetter);

exports.Transaction = Transaction;
