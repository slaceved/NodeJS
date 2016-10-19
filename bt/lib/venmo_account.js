
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

var VenmoAccount = (function(_super) {
  __extends(VenmoAccount, _super);
  function VenmoAccount(attributes) {
    VenmoAccount.__super__.constructor.call(this, attributes);
  }

  return VenmoAccount;
})(AttributeSetter);

exports.VenmoAccount = VenmoAccount;
