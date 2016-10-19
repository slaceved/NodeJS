'use strict';

var Http = require('./http').Http;
var AddOnGateway = require('./add_on_gateway').AddOnGateway;
var AddressGateway = require('./address_gateway').AddressGateway;
var ClientTokenGateway = require('./client_token_gateway').ClientTokenGateway;
var CreditCardGateway = require('./credit_card_gateway').CreditCardGateway;
var CreditCardVerificationGateway = require('./credit_card_verification_gateway').CreditCardVerificationGateway;
var CustomerGateway = require('./customer_gateway').CustomerGateway;
var DisbursementGateway = require('./disbursement_gateway').DisbursementGateway;
var MerchantAccountGateway = require('./merchant_account_gateway').MerchantAccountGateway;
var MerchantGateway = require('./merchant_gateway').MerchantGateway;
var OAuthGateway = require('./oauth_gateway').OAuthGateway;
var PaymentMethodGateway = require('./payment_method_gateway').PaymentMethodGateway;
var PaymentMethodNonceGateway = require('./payment_method_nonce_gateway').PaymentMethodNonceGateway;
var PayPalAccountGateway = require('./paypal_account_gateway').PayPalAccountGateway;
var PlanGateway = require('./plan_gateway').PlanGateway;
var SettlementBatchSummaryGateway = require('./settlement_batch_summary_gateway').SettlementBatchSummaryGateway;
var SubscriptionGateway = require('./subscription_gateway').SubscriptionGateway;
var TestingGateway = require('./testing_gateway').TestingGateway;
var TransactionGateway = require('./transaction_gateway').TransactionGateway;
var TransparentRedirectGateway = require('./transparent_redirect_gateway').TransparentRedirectGateway;
var WebhookNotificationGateway = require('./webhook_notification_gateway').WebhookNotificationGateway;
var WebhookTestingGateway = require('./webhook_testing_gateway').WebhookTestingGateway;

var BraintreeGateway = (function() {
  function BraintreeGateway(config) {
    this.config = config;
    this.http = new Http(this.config);
    this.addOn = new AddOnGateway(this);
    this.address = new AddressGateway(this);
    this.clientToken = new ClientTokenGateway(this);
    this.creditCard = new CreditCardGateway(this);
    this.creditCardVerification = new CreditCardVerificationGateway(this);
    this.customer = new CustomerGateway(this);
    this.disbursement = new DisbursementGateway(this);
    this.merchantAccount = new MerchantAccountGateway(this);
    this.merchant = new MerchantGateway(this);
    this.oauth = new OAuthGateway(this);
    this.paymentMethod = new PaymentMethodGateway(this);
    this.paymentMethodNonce = new PaymentMethodNonceGateway(this);
    this.paypalAccount = new PayPalAccountGateway(this);
    this.plan = new PlanGateway(this);
    this.settlementBatchSummary = new SettlementBatchSummaryGateway(this);
    this.subscription = new SubscriptionGateway(this);
    this.testing = new TestingGateway(this);
    this.transaction = new TransactionGateway(this);
    this.transparentRedirect = new TransparentRedirectGateway(this);
    this.webhookNotification = new WebhookNotificationGateway(this);
    this.webhookTesting = new WebhookTestingGateway(this);
  }

  return BraintreeGateway;
})();

exports.BraintreeGateway = BraintreeGateway;
