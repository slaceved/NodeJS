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

var RiskData = (function(_super) {
  __extends(RiskData, _super);
  function RiskData(attributes) {
    RiskData.__super__.constructor.call(this, attributes);
  }

  return RiskData;
})(AttributeSetter);

exports.RiskData = RiskData;
