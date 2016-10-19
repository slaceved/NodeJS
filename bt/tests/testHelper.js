'use strict';

var http = require('http');
var https = require('https');
var TransactionAmounts = require('../lib/test/transaction_amounts').TransactionAmounts;
var Util = require('../lib/util').Util;
var Config = require('../lib/config').Config;
var querystring = require('../lib/vendor/querystring_node_js/querystring');
var chai = require('chai');
var Buffer = require('buffer').Buffer;
var xml2js = require('xml2js');

chai.config.includeStack = true;
GLOBAL.assert = chai.assert;

GLOBAL.assert.isEmptyArray = function(array) {
  GLOBAL.assert.isArray(array);
  return GLOBAL.assert.equal(array.length, 0);
};

GLOBAL.inspect = function(object) {
  return console.dir(object);
};

var braintree = require('../lib/braintree.js');

require('dotenv').load();

var defaultConfig = {
  environment: braintree.Environment.Development,
  merchantId: process.env.BT_MERCHANT_ID || 'integration_merchant_id',
  publicKey: process.env.BT_PUBLIC_KEY || 'integration_public_key',
  privateKey: process.env.BT_PRIVATE_KEY || 'integration_private_key'
};

var defaultGateway = braintree.connect(defaultConfig);

var multiplyString = function(string, times) {
  return (new Array(times + 1)).join(string);
};

var plans = {
  trialless: {
    id: 'integration_trialless_plan',
    price: '12.34'
  },
  addonDiscountPlan: {
    id: 'integration_plan_with_add_ons_and_discounts',
    price: '9.99'
  }
};

var addOns = {
  increase10: 'increase_10',
  increase20: 'increase_20'
};

var escrowTransaction = function(transactionId, callback) {
  return defaultGateway.http.put((defaultGateway.config.baseMerchantPath()) + '/transactions/' + transactionId + '/escrow', null, callback);
};

var makePastDue = function(subscription, callback) {
  return defaultGateway.http.put((defaultGateway.config.baseMerchantPath()) + '/subscriptions/' + subscription.id + '/make_past_due?days_past_due=1',
    null, callback);
};

var settlePayPalTransaction = function(transactionId, callback) {
  return defaultGateway.http.put((defaultGateway.config.baseMerchantPath()) + '/transactions/' + transactionId + '/settle', null, callback);
};

var create3DSVerification = function(merchantAccountId, params, callback) {
  var responseCallback;
  responseCallback = function(err, response) {
    var threeDSecureToken;
    threeDSecureToken = response.threeDSecureVerification.threeDSecureToken;
    return callback(threeDSecureToken);
  };
  return defaultGateway.http.post((defaultGateway.config.baseMerchantPath()) + '/three_d_secure/create_verification/' + merchantAccountId, {
    three_d_secure_verification: params
  }, responseCallback);
};

var simulateTrFormPost = function(url, trData, inputFormData, callback) {
  var formData, headers, options, request, requestBody;
  headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Host': 'localhost'
  };
  formData = Util.convertObjectKeysToUnderscores(inputFormData);
  formData.tr_data = trData;
  requestBody = querystring.stringify(formData);
  headers['Content-Length'] = requestBody.length.toString();
  options = {
    port: GLOBAL.testHelper.defaultGateway.config.environment.port,
    host: GLOBAL.testHelper.defaultGateway.config.environment.server,
    method: 'POST',
    headers: headers,
    path: url
  };
  if (GLOBAL.testHelper.defaultGateway.config.environment.ssl) {
    request = https.request(options, function() {});
  } else {
    request = http.request(options, function() {});
  }
  request.on('response', function(response) {
    return callback(null, response.headers.location.split('?', 2)[1]);
  });
  request.write(requestBody);
  return request.end();
};

var dateToMdy = function(date) {
  var day, formattedDate, month, year;
  year = date.getFullYear().toString();
  month = (date.getMonth() + 1).toString();
  day = date.getDate().toString();
  if (month.length === 1) {
    month = '0' + month;
  }
  if (day.length === 1) {
    day = '0' + day;
  }
  formattedDate = year + '-' + month + '-' + day;
  return formattedDate;
};

var daylightSavings = function() {
  var jan, jul, stdTimezoneOffset, today;
  today = new Date();
  jan = new Date(today.getFullYear(), 0, 1);
  jul = new Date(today.getFullYear(), 6, 1);
  stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  return today.getTimezoneOffset() < stdTimezoneOffset;
};

var settlementDate = function(date) {
  if (daylightSavings()) {
    return new Date(date.getTime() - (4 * 60 * 60 * 1000));
  } else {
    return new Date(date.getTime() - (5 * 60 * 60 * 1000));
  }
};

var randomId = function() {
  return Math.floor(Math.random() * Math.pow(36, 8)).toString(36);
};

var doesNotInclude = function(array, value) {
  return GLOBAL.GLOBAL.assert.isTrue(array.indexOf(value) === -1);
};

var createTransactionToRefund = function(callback) {
  var transactionParams;
  transactionParams = {
    amount: '5.00',
    creditCard: {
      number: '5105105105105100',
      expirationDate: '05/2020'
    },
    options: {
      submitForSettlement: true
    }
  };
  return GLOBAL.testHelper.defaultGateway.transaction.sale(transactionParams, function(err, result) {
    return GLOBAL.testHelper.defaultGateway.testing.settle(result.transaction.id, function(err, settleResult) {
      return GLOBAL.testHelper.defaultGateway.transaction.find(result.transaction.id, function(err, transaction) {
        return callback(transaction);
      });
    });
  });
};

var generateNonceForNewPaymentMethod = function(paymentMethodParams, customerId, callback) {
  var clientTokenOptions, myHttp;
  myHttp = new ClientApiHttp(new Config(GLOBAL.testHelper.defaultConfig)); //eslint-disable-line no-use-before-define
  clientTokenOptions = {};
  if (customerId) {
    clientTokenOptions.customerId = customerId;
  }
  return GLOBAL.testHelper.defaultGateway.clientToken.generate(clientTokenOptions, function(err, result) {
    var clientToken, params;
    clientToken = JSON.parse(GLOBAL.testHelper.decodeClientToken(result.clientToken));
    params = {
      authorizationFingerprint: clientToken.authorizationFingerprint
    };
    if (paymentMethodParams['paypalAccount'] != null) {
      params['paypalAccount'] = paymentMethodParams['paypalAccount'];
      return myHttp.post('/client_api/v1/payment_methods/paypal_accounts.json', params, function(statusCode, body) {
        var nonce;
        nonce = JSON.parse(body).paypalAccounts[0].nonce;
        return callback(nonce);
      });
    } else {
      params['creditCard'] = paymentMethodParams['creditCard'];
      return myHttp.post('/client_api/v1/payment_methods/credit_cards.json', params, function(statusCode, body) {
        var nonce;
        nonce = JSON.parse(body).creditCards[0].nonce;
        return callback(nonce);
      });
    }
  });
};

var createPayPalTransactionToRefund = function(callback) {
  var nonceParams;
  nonceParams = {
    paypalAccount: {
      consentCode: 'PAYPAL_CONSENT_CODE',
      token: 'PAYPAL_ACCOUNT_' + (randomId())
    }
  };
  return generateNonceForNewPaymentMethod(nonceParams, null, function(nonce) {
    var transactionParams;
    transactionParams = {
      amount: TransactionAmounts.Authorize,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true
      }
    };
    return defaultGateway.transaction.sale(transactionParams, function(err, response) {
      var transactionId;
      transactionId = response.transaction.id;
      return GLOBAL.testHelper.settlePayPalTransaction(transactionId, function(err, settleResult) {
        return defaultGateway.transaction.find(transactionId, function(err, transaction) {
          return callback(transaction);
        });
      });
    });
  });
};

var createEscrowedTransaction = function(callback) {
  var transactionParams;
  transactionParams = {
    merchantAccountId: GLOBAL.testHelper.nonDefaultSubMerchantAccountId,
    amount: '5.00',
    serviceFeeAmount: '1.00',
    creditCard: {
      number: '5105105105105100',
      expirationDate: '05/2012'
    },
    options: {
      holdInEscrow: true
    }
  };
  return GLOBAL.testHelper.defaultGateway.transaction.sale(transactionParams, function(err, result) {
    return GLOBAL.testHelper.escrowTransaction(result.transaction.id, function(err, settleResult) {
      return GLOBAL.testHelper.defaultGateway.transaction.find(result.transaction.id, function(err, transaction) {
        return callback(transaction);
      });
    });
  });
};

var decodeClientToken = function(encodedClientToken) {
  var decodedClientToken, unescapedClientToken;
  decodedClientToken = new Buffer(encodedClientToken, 'base64').toString('utf8');
  unescapedClientToken = decodedClientToken.replace('\\u0026', '&');
  return unescapedClientToken;
};

var createPlanForTests = function(attributes, callback) {
  return GLOBAL.testHelper.defaultGateway.http.post((defaultGateway.config.baseMerchantPath()) + '/plans/create_plan_for_tests', {
    plan: attributes
  }, function(err, resp) {
    return callback(resp);
  });
};

var createModificationForTests = function(attributes, callback) {
  return GLOBAL.testHelper.defaultGateway.http.post((defaultGateway.config.baseMerchantPath()) + '/modifications/create_modification_for_tests', {
    modification: attributes
  }, function(err, resp) {
    return callback(resp);
  });
};

var createToken = function(gateway, attributes, callback) {
  return GLOBAL.testHelper.createGrant(gateway, attributes, function(err, code) {
    return gateway.oauth.createTokenFromCode({
      code: code
    }, callback);
  });
};

var createGrant = function(gateway, attributes, callback) {
  return gateway.http.post('/oauth_testing/grants', attributes, function(err, response) {
    if (err) {
      return callback(err, null);
    }
    return callback(null, response.grant.code);
  });
};

var ClientApiHttp = (function() {
  ClientApiHttp.prototype.timeout = 60000;

  function ClientApiHttp(config) {
    this.config = config;
    this.parser = new xml2js.Parser({
      explicitRoot: true
    });
  }

  ClientApiHttp.prototype.get = function(url, params, callback) {
    var key, value;
    if (params) {
      url += '?';
      for (key in params) {
        value = params[key];
        url += (encodeURIComponent(key)) + '=' + (encodeURIComponent(value)) + '&';
      }
      url = url.slice(0, -1);
    }
    return this.request('GET', url, null, callback);
  };

  ClientApiHttp.prototype.post = function(url, body, callback) {
    return this.request('POST', url, body, callback);
  };

  ClientApiHttp.prototype.checkHttpStatus = function(status) {
    switch (status.toString()) {
      case '200':
      case '201':
      case '422':
        return null;
      default:
        return status.toString();
    }
  };

  ClientApiHttp.prototype.request = function(method, url, body, callback) {
    var client, options, requestBody, theRequest;
    client = http;
    options = {
      host: this.config.environment.server,
      port: this.config.environment.port,
      method: method,
      path: '/merchants/' + this.config.merchantId + url,
      headers: {
        'X-ApiVersion': this.config.apiVersion,
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
        'User-Agent': 'Braintree Node ' + braintree.version
      }
    };
    if (body) {
      requestBody = JSON.stringify(Util.convertObjectKeysToUnderscores(body));
      options.headers['Content-Length'] = Buffer.byteLength(requestBody).toString();
    }
    theRequest = client.request(options, (function(_this) {
      return function(response) {
        body = '';
        response.on('data', function(responseBody) {
          return body += responseBody;
        });
        response.on('end', function() {
          return callback(response.statusCode, body);
        });
        return response.on('error', function(err) {
          return callback('Unexpected response error: ' + err);
        });
      };
    })(this));
    theRequest.setTimeout(this.timeout, function() {
      return callback('timeout');
    });
    theRequest.on('error', function(err) {
      return callback('Unexpected request error: ' + err);
    });
    if (body) {
      theRequest.write(requestBody);
    }
    return theRequest.end();
  };

  return ClientApiHttp;
})();

GLOBAL.testHelper = {
  addOns: addOns,
  braintree: braintree,
  create3DSVerification: create3DSVerification,
  dateToMdy: dateToMdy,
  settlementDate: settlementDate,
  defaultConfig: defaultConfig,
  defaultGateway: defaultGateway,
  doesNotInclude: doesNotInclude,
  escrowTransaction: escrowTransaction,
  makePastDue: makePastDue,
  multiplyString: multiplyString,
  plans: plans,
  randomId: randomId,
  settlePayPalTransaction: settlePayPalTransaction,
  simulateTrFormPost: simulateTrFormPost,
  defaultMerchantAccountId: 'sandbox_credit_card',
  nonDefaultMerchantAccountId: 'sandbox_credit_card_non_default',
  nonDefaultSubMerchantAccountId: 'sandbox_sub_merchant_account',
  threeDSecureMerchantAccountId: 'three_d_secure_merchant_account',
  fakeAmexDirectMerchantAccountId: 'fake_amex_direct_usd',
  fakeVenmoAccountMerchantAccountId: 'fake_first_data_venmo_account',
  clientApiHttp: ClientApiHttp,
  decodeClientToken: decodeClientToken,
  createTransactionToRefund: createTransactionToRefund,
  createPayPalTransactionToRefund: createPayPalTransactionToRefund,
  createEscrowedTransaction: createEscrowedTransaction,
  generateNonceForNewPaymentMethod: generateNonceForNewPaymentMethod,
  createPlanForTests: createPlanForTests,
  createModificationForTests: createModificationForTests,
  createGrant: createGrant,
  createToken: createToken
};
