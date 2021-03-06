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

var xml2js = require('xml2js');
var _ = require('underscore');
var Digest = require('./digest').Digest;
var Gateway = require('./gateway').Gateway;
var InvalidSignatureError = require('./exceptions').InvalidSignatureError;
var InvalidChallengeError = require('./exceptions').InvalidChallengeError;
var Util = require('./util').Util;
var WebhookNotification = require('./webhook_notification').WebhookNotification;

var WebhookNotificationGateway = (function(_super) {
  __extends(WebhookNotificationGateway, _super);
  function WebhookNotificationGateway(gateway) {
    this.gateway = gateway;
    this.config = this.gateway.config;
    this.parser = new xml2js.Parser({
      explicitRoot: true
    });
  }

  WebhookNotificationGateway.prototype.parse = function(signature, payload, callback) {
    var err, xmlPayload,
      _this = this;
    if (payload.match(/[^A-Za-z0-9+=\/\n]/)) {
      callback(new InvalidSignatureError('payload contains illegal characters'), null);
      return;
    }
    err = this.validateSignature(signature, payload);
    if (err) {
      return callback(err, null);
    }
    xmlPayload = new Buffer(payload, 'base64').toString('utf8');
    return this.parser.parseString(xmlPayload, function(err, result) {
      var attributes, handler;
      attributes = Util.convertNodeToObject(result);
      handler = _this.createResponseHandler('notification', WebhookNotification, function(err, result) {
        return callback(null, result.notification);
      });
      return handler(null, attributes);
    });
  };

  WebhookNotificationGateway.prototype.validateSignature = function(signatureString, payload) {
    var matches, pair, self, signature, signaturePairs;
    signaturePairs = (function() {
      var _i, _len, _ref, _results;
      _ref = signatureString.split('&');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pair = _ref[_i];
        if (pair.indexOf('|') !== -1) {
          _results.push(pair.split('|'));
        }
      }
      return _results;
    })();
    signature = this.matchingSignature(signaturePairs);
    if (!signature) {
      return new InvalidSignatureError('no matching public key');
    }
    self = this;
    matches = _.some([payload, payload + '\n'], function(payload) {
      return Digest.secureCompare(signature, Digest.Sha1hexdigest(self.gateway.config.privateKey, payload));
    });
    if (!matches) {
      return new InvalidSignatureError('signature does not match payload - one has been modified');
    }
    return null;
  };

  WebhookNotificationGateway.prototype.verify = function(challenge, callback) {
    var digest;
    if (!challenge.match(/^[a-f0-9]{20,32}$/)) {
      if (callback != null) {
        callback(new InvalidChallengeError('challenge contains non-hex characters'), null);
        return;
      } else {
        throw new InvalidChallengeError('challenge contains non-hex characters');
      }
    }
    digest = Digest.Sha1hexdigest(this.gateway.config.privateKey, challenge);
    return '' + this.gateway.config.publicKey + '|' + digest;
  };

  WebhookNotificationGateway.prototype.matchingSignature = function(signaturePairs) {
    var publicKey, signature, _i, _len, _ref;
    for (_i = 0, _len = signaturePairs.length; _i < _len; _i++) {
      _ref = signaturePairs[_i], publicKey = _ref[0], signature = _ref[1];
      if (this.gateway.config.publicKey === publicKey) {
        return signature;
      }
    }
    return null;
  };

  return WebhookNotificationGateway;
})(Gateway);

exports.WebhookNotificationGateway = WebhookNotificationGateway;
