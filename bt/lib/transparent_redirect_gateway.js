'use strict';

var Digest = require('./digest').Digest;
var Util = require('./util').Util;
var querystring = require('../lib/vendor/querystring_node_js/querystring');
var dateFormat = require('dateformat');
var CreditCardGateway = require('./credit_card_gateway').CreditCardGateway;
var CustomerGateway = require('./customer_gateway').CustomerGateway;
var TransactionGateway = require('./transaction_gateway').TransactionGateway;
var SignatureService = require('./signature_service').SignatureService;
var exceptions = require('./exceptions');

var TransparentRedirectGateway = (function() {
  function TransparentRedirectGateway(gateway) {
    this.gateway = gateway;
    this.config = this.gateway.config;
    this.url = '' + (this.config.baseMerchantUrl()) + '/transparent_redirect_requests';
  }

  var KIND = {
    CREATE_CUSTOMER: 'create_customer',
    UPDATE_CUSTOMER: 'update_customer',
    CREATE_CREDIT_CARD: 'create_payment_method',
    UPDATE_CREDIT_CARD: 'update_payment_method',
    CREATE_TRANSACTION: 'create_transaction'
  };

  TransparentRedirectGateway.prototype.generateTrData = function(inputData) {
    var data, dataSegment;
    data = Util.convertObjectKeysToUnderscores(inputData);
    data.api_version = this.gateway.config.apiVersion;
    data.time = dateFormat(new Date(), 'yyyymmddHHMMss', true);
    data.public_key = this.gateway.config.publicKey;
    dataSegment = querystring.stringify(data);
    return new SignatureService(this.gateway.config.privateKey, Digest.Sha1hexdigest).sign(dataSegment);
  };

  TransparentRedirectGateway.prototype.createCreditCardData = function(data) {
    data.kind = KIND.CREATE_CREDIT_CARD;
    return this.generateTrData(data);
  };

  TransparentRedirectGateway.prototype.updateCreditCardData = function(data) {
    data.kind = KIND.UPDATE_CREDIT_CARD;
    return this.generateTrData(data);
  };

  TransparentRedirectGateway.prototype.createCustomerData = function(data) {
    data.kind = KIND.CREATE_CUSTOMER;
    return this.generateTrData(data);
  };

  TransparentRedirectGateway.prototype.updateCustomerData = function(data) {
    data.kind = KIND.UPDATE_CUSTOMER;
    return this.generateTrData(data);
  };

  TransparentRedirectGateway.prototype.transactionData = function(data) {
    data.kind = KIND.CREATE_TRANSACTION;
    return this.generateTrData(data);
  };

  TransparentRedirectGateway.prototype.validateQueryString = function(queryString) {
    var matches;
    matches = queryString.match(/^(.+)&hash=(.+?)$/);
    return Digest.Sha1hexdigest(this.gateway.config.privateKey, matches[1]) === matches[2];
  };

  TransparentRedirectGateway.prototype.confirm = function(queryString, callback) {
    var confirmCallback, error, params, statusMatch;
    statusMatch = queryString.match(/http_status=(\d+)/);
    if (statusMatch && statusMatch[1]) {
      error = this.gateway.http.checkHttpStatus(statusMatch[1]);
      if (error) {
        return callback(error, null);
      }
    }
    if (!this.validateQueryString(queryString)) {
      return callback(exceptions.InvalidTransparentRedirectHashError('The transparent redirect hash is invalid'), null);
    }
    params = querystring.parse(queryString);
    confirmCallback = null;
    switch (params.kind) {
      case KIND.CREATE_CUSTOMER:
      case KIND.UPDATE_CUSTOMER:
        confirmCallback = new CustomerGateway(this.gateway).responseHandler(callback);
        break;
      case KIND.CREATE_CREDIT_CARD:
      case KIND.UPDATE_CREDIT_CARD:
        confirmCallback = new CreditCardGateway(this.gateway).responseHandler(callback);
        break;
      case KIND.CREATE_TRANSACTION:
        confirmCallback = new TransactionGateway(this.gateway).responseHandler(callback);
    }
    return this.gateway.http.post(('' + (this.config.baseMerchantPath()) + '/transparent_redirect_requests/') + params.id + '/confirm',
      null, confirmCallback);
  };

  return TransparentRedirectGateway;
})();

exports.TransparentRedirectGateway = TransparentRedirectGateway;
