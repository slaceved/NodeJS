'use strict';

var crypto = require('crypto');
var _ = require('underscore');

var Digest = (function() {
  function Digest() {}

  Digest.Sha1hexdigest = function(privateKey, string) {
    return new Digest().hmacSha1(privateKey, string);
  };

  Digest.Sha256hexdigest = function(privateKey, string) {
    return new Digest().hmacSha256(privateKey, string);
  };

  Digest.secureCompare = function(left, right) {
    return new Digest().secureCompare(left, right);
  };

  Digest.prototype.hmacSha256 = function(key, data) {
    var hmac;
    hmac = crypto.createHmac('sha256', this.sha256(key));
    hmac.update(data);
    return hmac.digest('hex');
  };

  Digest.prototype.hmacSha1 = function(key, data) {
    var hmac;
    hmac = crypto.createHmac('sha1', this.sha1(key));
    hmac.update(data);
    return hmac.digest('hex');
  };

  Digest.prototype.secureCompare = function(left, right) {
    var leftByte, leftBytes, result, rightByte, rightBytes, _i, _len, _ref, _ref1;
    if (!((left != null) && (right != null))) {
      return false;
    }
    leftBytes = this.unpack(left);
    rightBytes = this.unpack(right);
    result = 0;
    _ref = _.zip(leftBytes, rightBytes);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      _ref1 = _ref[_i], leftByte = _ref1[0], rightByte = _ref1[1];
      result |= leftByte ^ rightByte;
    }
    return result === 0;
  };

  Digest.prototype.sha1 = function(data) {
    var hash;
    hash = crypto.createHash('sha1');
    hash.update(data);
    return hash.digest();
  };

  Digest.prototype.sha256 = function(data) {
    var hash;
    hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest();
  };

  Digest.prototype.unpack = function(string) {
    var bytes, character, index, _i, _len;
    bytes = [];
    for (index = _i = 0, _len = string.length; _i < _len; index = ++_i) {
      character = string[index];
      bytes.push(string.charCodeAt(index));
    }
    return bytes;
  };

  return Digest;
})();

exports.Digest = Digest;
