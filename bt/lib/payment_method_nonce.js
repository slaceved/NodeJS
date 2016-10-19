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
var ThreeDSecureInfo = require('./three_d_secure_info').ThreeDSecureInfo;

var PaymentMethodNonce = (function(_super) {
  __extends(PaymentMethodNonce, _super);
  function PaymentMethodNonce(attributes) {
    PaymentMethodNonce.__super__.constructor.call(this, attributes);
    if (attributes.threeDSecureInfo) {
      this.threeDSecureInfo = new ThreeDSecureInfo(attributes.threeDSecureInfo);
    }
  }

  return PaymentMethodNonce;
})(AttributeSetter);

exports.PaymentMethodNonce = PaymentMethodNonce;
