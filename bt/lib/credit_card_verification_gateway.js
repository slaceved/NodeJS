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

var Gateway = require('./gateway').Gateway;
var CreditCardVerification = require('./credit_card_verification').CreditCardVerification;
var CreditCardVerificationSearch = require('./credit_card_verification_search').CreditCardVerificationSearch;
var _ = require('underscore');
var exceptions = require('./exceptions');

var CreditCardVerificationGateway = (function(_super) {
  __extends(CreditCardVerificationGateway, _super);
  function CreditCardVerificationGateway(gateway) {
    this.gateway = gateway;
    this.config = this.gateway.config;
  }

  CreditCardVerificationGateway.prototype.find = function(creditCardVerificationId, callback) {
    if (creditCardVerificationId.trim() === '') {
      return callback(exceptions.NotFoundError('Not Found'), null);
    } else {
      return this.gateway.http.get('' + (this.config.baseMerchantPath()) + '/verifications/' + creditCardVerificationId, function(err, response) {
        if (err) {
          return callback(err, null);
        } else {
          return callback(null, new CreditCardVerification(response.verification));
        }
      });
    }
  };

  CreditCardVerificationGateway.prototype.search = function(fn, callback) {
    var search;
    search = new CreditCardVerificationSearch();
    fn(search);
    return this.createSearchResponse('' + (this.config.baseMerchantPath()) + '/verifications/advanced_search_ids', search,
      this.pagingFunctionGenerator(search), callback);
  };

  CreditCardVerificationGateway.prototype.create = function(params, callback) {
    return this.gateway.http.post('' + (this.config.baseMerchantPath()) + '/verifications', {
      'verification': params
    }, this.createResponseHandler('verification', CreditCardVerification, callback));
  };

  CreditCardVerificationGateway.prototype.responseHandler = function(callback) {
    return this.createResponseHandler('creditCardVerification', CreditCardVerification, callback);
  };

  CreditCardVerificationGateway.prototype.pagingFunctionGenerator = function(search) {
    var _this = this;
    return function(ids, callback) {
      var searchCriteria;
      searchCriteria = search.toHash();
      searchCriteria['ids'] = ids;
      return _this.gateway.http.post('' + (_this.config.baseMerchantPath()) + '/verifications/advanced_search', {
        search: searchCriteria
      }, function(err, response) {
        var creditCardVerification, _i, _len, _ref, _results;
        if (err) {
          return callback(err, null);
        } else {
          if (_.isArray(response.creditCardVerifications.verification)) {
            _ref = response.creditCardVerifications.verification;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              creditCardVerification = _ref[_i];
              _results.push(callback(null, new CreditCardVerification(creditCardVerification)));
            }
            return _results;
          } else {
            return callback(null, new CreditCardVerification(response.creditCardVerifications.verification));
          }
        }
      });
    };
  };

  return CreditCardVerificationGateway;
})(Gateway);

exports.CreditCardVerificationGateway = CreditCardVerificationGateway;
