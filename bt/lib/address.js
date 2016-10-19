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

var Address = (function(_super) {
  __extends(Address, _super);
  function Address() {
    return Address.__super__.constructor.apply(this, arguments);
  }
  return Address;
})(AttributeSetter);

exports.Address = Address;
