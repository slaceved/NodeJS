'use strict';

var version = require('../package.json').version;
var Config = require('./config').Config;
var Environment = require('./environment').Environment;
var BraintreeGateway = require('./braintree_gateway').BraintreeGateway;
var errorTypes = require('./error_types');
var Transaction = require('./transaction').Transaction;
var CreditCard = require('./credit_card').CreditCard;
var PayPalAccount = require('./paypal_account').PayPalAccount;
var AndroidPayCard = require('./android_pay_card').AndroidPayCard;
var ApplePayCard = require('./apple_pay_card').ApplePayCard;
var VenmoAccount = require('./venmo_account').VenmoAccount;
var CoinbaseAccount = require('./coinbase_account').CoinbaseAccount;
var AmexExpressCheckoutCard = require('./amex_express_checkout_card').AmexExpressCheckoutCard;
var CreditCardVerification = require('./credit_card_verification').CreditCardVerification;
var Subscription = require('./subscription').Subscription;
var MerchantAccount = require('./merchant_account').MerchantAccount;
var PaymentInstrumentTypes = require('./payment_instrument_types').PaymentInstrumentTypes;
var WebhookNotification = require('./webhook_notification').WebhookNotification;
var TestingGateway = require('./testing_gateway').TestingGateway;
var ValidationErrorCodes = require('./validation_error_codes').ValidationErrorCodes;
var CreditCardDefaults = require('./test/credit_card_defaults').CreditCardDefaults;
var CreditCardNumbers = require('./test/credit_card_numbers').CreditCardNumbers;
var MerchantAccountTest = require('./test/merchant_account').MerchantAccountTest;
var Nonces = require('./test/nonces').Nonces;
var TransactionAmounts = require('./test/transaction_amounts').TransactionAmounts;
var VenmoSdk = require('./test/venmo_sdk').VenmoSdk;

var connect = function(config) {
  return new BraintreeGateway(new Config(config));
};

exports.connect = connect;
exports.version = version;
exports.Environment = Environment;
exports.errorTypes = errorTypes;
exports.Transaction = Transaction;
exports.CreditCard = CreditCard;
exports.PayPalAccount = PayPalAccount;
exports.AndroidPayCard = AndroidPayCard;
exports.ApplePayCard = ApplePayCard;
exports.VenmoAccount = VenmoAccount;
exports.CoinbaseAccount = CoinbaseAccount;
exports.AmexExpressCheckoutCard = AmexExpressCheckoutCard;
exports.CreditCardVerification = CreditCardVerification;
exports.Subscription = Subscription;
exports.MerchantAccount = MerchantAccount;
exports.WebhookNotification = WebhookNotification;
exports.TestingGateway = TestingGateway;
exports.ValidationErrorCodes = ValidationErrorCodes;
exports.PaymentInstrumentTypes = PaymentInstrumentTypes;

exports.Test = {
  CreditCardDefaults: CreditCardDefaults,
  CreditCardNumbers: CreditCardNumbers,
  MerchantAccountTest: MerchantAccountTest,
  Nonces: Nonces,
  TransactionAmounts: TransactionAmounts,
  VenmoSdk: VenmoSdk
};
