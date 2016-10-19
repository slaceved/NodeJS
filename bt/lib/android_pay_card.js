'use strict';

var __hasProp = {}.hasOwnProperty;
var __extends = function(child, parent) {
  for (var key in parent) {
    if (__hasProp.call(parent, key)){
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

var AndroidPayCard = (function(_super) {
  __extends(AndroidPayCard, _super);
  function AndroidPayCard(attributes) {
    AndroidPayCard.__super__.constructor.call(this, attributes);
    if (attributes) {
      this.cardType = attributes.virtualCardType;
      this.last4 = attributes.virtualCardLast4;
    }
  }

  return AndroidPayCard;
})(AttributeSetter);

exports.AndroidPayCard = AndroidPayCard;
