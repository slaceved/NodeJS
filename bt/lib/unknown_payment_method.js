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

var UnknownPaymentMethod = (function(_super) {
  __extends(UnknownPaymentMethod, _super);
  function UnknownPaymentMethod(attributes) {
    var keys, name;
    name = ((function() {
      var _results;
      _results = [];
      for (keys in attributes) {
        if (!__hasProp.call(attributes, keys)) {
          continue;
        }
        _results.push(keys);
      }
      return _results;
    })())[0];
    attributes[name].imageUrl = 'https://assets.braintreegateway.com/payment_method_logo/unknown.png';
    UnknownPaymentMethod.__super__.constructor.call(this, attributes[name]);
  }

  return UnknownPaymentMethod;

})(AttributeSetter);

exports.UnknownPaymentMethod = UnknownPaymentMethod;
