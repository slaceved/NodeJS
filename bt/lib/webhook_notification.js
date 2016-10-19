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
var Transaction = require('./transaction').Transaction;
var Disbursement = require('./disbursement').Disbursement;
var Dispute = require('./dispute').Dispute;
var PartnerMerchant = require('./partner_merchant').PartnerMerchant;
var Subscription = require('./subscription').Subscription;
var AccountUpdaterDailyReport = require('./account_updater_daily_report').AccountUpdaterDailyReport;
var ValidationErrorsCollection = require('./validation_errors_collection').ValidationErrorsCollection;

var WebhookNotification = (function(_super) {
  __extends(WebhookNotification, _super);
function WebhookNotification(attributes) {
    var wrapperNode;
    WebhookNotification.__super__.constructor.call(this, attributes);
    if (attributes.subject.apiErrorResponse != null) {
      wrapperNode = attributes.subject.apiErrorResponse;
    } else {
      wrapperNode = attributes.subject;
    }
    if (wrapperNode.subscription != null) {
      this.subscription = new Subscription(wrapperNode.subscription);
    }
    if (wrapperNode.merchantAccount != null) {
      this.merchantAccount = new MerchantAccount(wrapperNode.merchantAccount);
    }
    if (wrapperNode.disbursement != null) {
      this.disbursement = new Disbursement(wrapperNode.disbursement);
    }
    if (wrapperNode.transaction != null) {
      this.transaction = new Transaction(wrapperNode.transaction);
    }
    if (wrapperNode.partnerMerchant != null) {
      this.partnerMerchant = new PartnerMerchant(wrapperNode.partnerMerchant);
    }
    if (wrapperNode.dispute != null) {
      this.dispute = new Dispute(wrapperNode.dispute);
    }
    if (wrapperNode.accountUpdaterDailyReport != null) {
      this.accountUpdaterDailyReport = new AccountUpdaterDailyReport(wrapperNode.accountUpdaterDailyReport);
    }
    if (wrapperNode.errors != null) {
      this.errors = new ValidationErrorsCollection(wrapperNode.errors);
      this.message = wrapperNode.message;
    }
  }


  WebhookNotification.Kind = {
    AccountUpdaterDailyReport: 'account_updater_daily_report',
    Check: 'check',
    Disbursement: 'disbursement',
    DisbursementException: 'disbursement_exception',
    DisputeOpened: 'dispute_opened',
    DisputeLost: 'dispute_lost',
    DisputeWon: 'dispute_won',
    PartnerMerchantConnected: 'partner_merchant_connected',
    PartnerMerchantDisconnected: 'partner_merchant_disconnected',
    PartnerMerchantDeclined: 'partner_merchant_declined',
    SubscriptionCanceled: 'subscription_canceled',
    SubscriptionChargedSuccessfully: 'subscription_charged_successfully',
    SubscriptionChargedUnsuccessfully: 'subscription_charged_unsuccessfully',
    SubscriptionExpired: 'subscription_expired',
    SubscriptionTrialEnded: 'subscription_trial_ended',
    SubscriptionWentActive: 'subscription_went_active',
    SubscriptionWentPastDue: 'subscription_went_past_due',
    SubMerchantAccountApproved: 'sub_merchant_account_approved',
    SubMerchantAccountDeclined: 'sub_merchant_account_declined',
    TransactionDisbursed: 'transaction_disbursed'
  };

  return WebhookNotification;
})(AttributeSetter);

exports.WebhookNotification = WebhookNotification;
