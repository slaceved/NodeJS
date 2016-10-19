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

var Buffer = require('buffer').Buffer;
var Digest = require('./digest').Digest;
var Gateway = require('./gateway').Gateway;
var WebhookNotification = require('./webhook_notification').WebhookNotification;
var dateFormat = require('dateformat');

var WebhookTestingGateway = (function(_super) {
  __extends(WebhookTestingGateway, _super);
  function WebhookTestingGateway(gateway) {
    this.gateway = gateway;
    this.config = this.gateway.config;
  }

  WebhookTestingGateway.prototype.sampleNotification = function(kind, id) {
    var payload, signature;
    payload = new Buffer(this.sampleXml(kind, id)).toString('base64') + '\n';
    signature = '' + this.gateway.config.publicKey + '|' + (Digest.Sha1hexdigest(this.gateway.config.privateKey, payload));
    return {
      bt_signature: signature,
      bt_payload: payload
    };
  };

  WebhookTestingGateway.prototype.sampleXml = function(kind, id) {
    var str = '<notification>\n <timestamp type=\'datetime\'>' + (dateFormat(new Date(), dateFormat.masks.isoUtcDateTime, true));
    str += '</timestamp>\n <kind>' + kind + '</kind>\n <subject>' + (this.subjectXmlFor(kind, id)) + '</subject>\n</notification>';
    return  str;
  };

  WebhookTestingGateway.prototype.subjectXmlFor = function(kind, id) {
    switch (kind) {
      case WebhookNotification.Kind.AccountUpdaterDailyReport:
        return this.subjectXmlForAccountUpdaterDailyReport();
      case WebhookNotification.Kind.Check:
        return this.subjectXmlForCheck();
      case WebhookNotification.Kind.TransactionDisbursed:
        return this.subjectXmlForTransactionDisbursed(id);
      case WebhookNotification.Kind.DisbursementException:
        return this.subjectXmlForDisbursementException(id);
      case WebhookNotification.Kind.Disbursement:
        return this.subjectXmlForDisbursement(id);
      case WebhookNotification.Kind.DisputeOpened:
        return this.subjectXmlForDisputeOpened(id);
      case WebhookNotification.Kind.DisputeLost:
        return this.subjectXmlForDisputeLost(id);
      case WebhookNotification.Kind.DisputeWon:
        return this.subjectXmlForDisputeWon(id);
      case WebhookNotification.Kind.SubMerchantAccountApproved:
        return this.subjectXmlForSubMerchantAccountApproved(id);
      case WebhookNotification.Kind.SubMerchantAccountDeclined:
        return this.subjectXmlForSubMerchantAccountDeclined(id);
      case WebhookNotification.Kind.PartnerMerchantConnected:
        return this.subjectXmlForPartnerMerchantConnected();
      case WebhookNotification.Kind.PartnerMerchantDisconnected:
        return this.subjectXmlForPartnerMerchantDisconnected();
      case WebhookNotification.Kind.PartnerMerchantDeclined:
        return this.subjectXmlForPartnerMerchantDeclined();
      case WebhookNotification.Kind.SubscriptionChargedSuccessfully:
        return this.subjectXmlForSubscriptionChargedSuccessfully(id);
      default:
        return this.subjectXmlForSubscription(id);
    }
  };

  WebhookTestingGateway.prototype.subjectXmlForAccountUpdaterDailyReport = function() {
    var str = '<account-updater-daily-report>\n <report-date type=\'date\'>2016-01-14</report-date>\n <report-url>';
    str += 'link-to-csv-report</report-url>\n</account-updater-daily-report>';
    return str;
  };

  WebhookTestingGateway.prototype.subjectXmlForCheck = function() {
    return '<check type=\'boolean\'>true</check>';
  };

  WebhookTestingGateway.prototype.subjectXmlForTransactionDisbursed = function(id) {
    var str = '<transaction>\n <id>' + id + '</id>\n <amount>100</amount>\n <disbursement-details>\n <disbursement-date type=\'datetime\'>';
    str += '2013-07-09T18:23:29Z</disbursement-date>\n  </disbursement-details>\n</transaction>';
    return str;
  };

  WebhookTestingGateway.prototype.subjectXmlForDisputeOpened = function(id) {
    var str = '<dispute>\n <amount>250.00</amount>\n <currency-iso-code>USD</currency-iso-code>\n <received-date type=\'date\'>';
    str += '2014-03-01</received-date>\n <reply-by-date type=\'date\'>2014-03-21</reply-by-date>\n <kind>chargeback</kind>\n <status>open</status>\n';
    str += '<reason>fraud</reason>\n <id>' + id + '</id>\n <transaction>\n <id>' + id + '</id>\n <amount>250.00</amount>\n </transaction>\n';
    str += '<date-opened type=\'date\'>2014-03-28</date-opened>\n</dispute>';
    return str;
  };

  WebhookTestingGateway.prototype.subjectXmlForDisputeLost = function(id) {
    var str = '<dispute>\n <amount>250.00</amount>\n <currency-iso-code>USD</currency-iso-code>\n <received-date type=\'date\'>';
    str += '2014-03-01</received-date>\n <reply-by-date type=\'date\'>2014-03-21</reply-by-date>\n <kind>chargeback</kind>\n <status>lost</status>\n';
    str += '<reason>fraud</reason>\n <id>' + id + '</id>\n <transaction>\n <id>' + id + '</id>\n <amount>250.00</amount>\n </transaction>\n';
    str += ' <date-opened type=\'date\'>2014-03-28</date-opened>\n</dispute>';
    return str;
  };

  WebhookTestingGateway.prototype.subjectXmlForDisputeWon = function(id) {
    var str = '<dispute>\n <amount>250.00</amount>\n <currency-iso-code>USD</currency-iso-code>\n <received-date type=\'date\'>2014-03-01';
    str += '</received-date>\n <reply-by-date type=\'date\'>2014-03-21</reply-by-date>\n <kind>chargeback</kind>\n <status>won</status>\n <reason>';
    str += 'fraud</reason>\n <id>' + id + '</id>\n <transaction>\n <id>' + id + '</id>\n <amount>250.00</amount>\n </transaction>\n';
    str += '<date-opened type=\'date\'>2014-03-28</date-opened>\n  <date-won type=\'date\'>2014-09-01</date-won>\n</dispute>';
    return str;
  };

  WebhookTestingGateway.prototype.subjectXmlForDisbursementException = function(id) {
    var str = '<disbursement>\n <id>' + id + '</id>\n <transaction-ids type=\'array\'>\n <item>afv56j</item>\n <item>kj8hjk</item>\n ';
    str += '</transaction-ids>\n <success type=\'boolean\'>false</success>\n <retry type=\'boolean\'>false</retry>\n <merchant-account>\n <id>';
    str += 'merchant_account_token</id>\n <currency-iso-code>USD</currency-iso-code>\n <sub-merchant-account type=\'boolean\'>';
    str += 'false</sub-merchant-account>\n <status>active</status>\n </merchant-account>\n <amount>100.00</amount>\n ';
    str += '<disbursement-date type=\'date\'>2014-02-10</disbursement-date>\n <exception-message>bank_rejected</exception-message>\n';
    str += ' <follow-up-action>update_funding_information</follow-up-action>\n</disbursement>';
    return str;
  };

  WebhookTestingGateway.prototype.subjectXmlForDisbursement = function(id) {
    var str = '<disbursement>\n <id>' + id + '</id>\n <transaction-ids type=\'array\'>\n <item>afv56j</item>\n <item>kj8hjk</item>\n';
    str += ' </transaction-ids>\n <success type=\'boolean\'>true</success>\n <retry type=\'boolean\'>false</retry>\n <merchant-account>\n <id>';
    str += 'merchant_account_token</id>\n <currency-iso-code>USD</currency-iso-code>\n <sub-merchant-account type=\'boolean\'>false';
    str += '</sub-merchant-account>\n <status>active</status>\n </merchant-account>\n <amount>100.00</amount>\n <disbursement-date type=\'date\'>';
    str += '2014-02-10</disbursement-date>\n  <exception-message nil=\'true\'/>\n <follow-up-action nil=\'true\'/>\n</disbursement>';
    return str;
  };

  WebhookTestingGateway.prototype.subjectXmlForSubMerchantAccountApproved = function(id) {
    return '<merchant_account>\n  <id>' + id + '</id>\n</merchant_account>';
  };

  WebhookTestingGateway.prototype.errorSampleXml = function(error) {
    return '<error>\n <code>82621</code>\n <message>Credit score is too low</message>\n <attribute type=\'symbol\'>base</attribute>\n</error>';
  };

  WebhookTestingGateway.prototype.subjectXmlForSubMerchantAccountDeclined = function(id) {
    var str = '<api-error-response>\n <message>Credit score is too low</message>\n <errors>\n <merchant-account>\n <errors type=\'array\'>\n ';
    str += (this.errorSampleXml()) + '\n </errors>\n </merchant-account>\n </errors>\n ' + (this.merchantAccountSampleXml(id));
    str += '\n</api-error-response>';
    return  str;
  };

  WebhookTestingGateway.prototype.merchantAccountSampleXml = function(id) {
    var str = '<merchant_account>\n <id>' + id + '</id>\n <master_merchant_account>\n <id>master_ma_for_' + id + '</id>\n <status>suspended';
    str += '</status>\n </master_merchant_account>\n <status>suspended</status>\n</merchant_account>';
    return str;
  };

  WebhookTestingGateway.prototype.subjectXmlForSubscription = function(id) {
    var str = '<subscription>\n <id>' + id + '</id>\n <transactions type=\'array\'></transactions>\n <add_ons type=\'array\'></add_ons>\n ';
    str += '<discounts type=\'array\'></discounts>\n</subscription>';
    return str;
  };

  WebhookTestingGateway.prototype.subjectXmlForSubscriptionChargedSuccessfully = function(id) {
    var str = '<subscription>\n <id>' + id + '</id>\n <transactions type=\'array\'>\n <transaction>\n <status>submitted_for_settlement</status>\n ';
    str += '<amount>49.99</amount>\n </transaction>\n </transactions>\n <add_ons type=\'array\'></add_ons>\n <discounts type=\'array\'></discounts>';
    str += '\n</subscription>';
    return str;
  };

  WebhookTestingGateway.prototype.subjectXmlForPartnerMerchantConnected = function() {
    var str = '<partner-merchant>\n <merchant-public-id>public_id</merchant-public-id>\n <public-key>public_key</public-key>\n ';
    str += '<private-key>private_key</private-key>\n <partner-merchant-id>abc123</partner-merchant-id>\n <client-side-encryption-key>cse_key';
    str += '</client-side-encryption-key>\n</partner-merchant>';
    return str;
  };

  WebhookTestingGateway.prototype.subjectXmlForPartnerMerchantDisconnected = function() {
    return '<partner-merchant>\n <partner-merchant-id>abc123</partner-merchant-id>\n</partner-merchant>';
  };

  WebhookTestingGateway.prototype.subjectXmlForPartnerMerchantDeclined = function() {
    return '<partner-merchant>\n <partner-merchant-id>abc123</partner-merchant-id>\n</partner-merchant>';
  };

  return WebhookTestingGateway;
})(Gateway);

exports.WebhookTestingGateway = WebhookTestingGateway;
