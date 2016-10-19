'use srict';

var  __hasProp = {}.hasOwnProperty;
var  __extends = function(child, parent) {
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

var AddOn = (function(_super) {
  __extends(AddOn, _super);
  function AddOn() {
    return AddOn.__super__.constructor.apply(this, arguments);
  }
  return AddOn;
})(AttributeSetter);

exports.AddOn = AddOn;
