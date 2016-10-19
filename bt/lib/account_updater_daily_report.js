'use strict';

var  __hasProp = {}.hasOwnProperty;
var  __extends = function(child, parent) {
  for (var key in parent){
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

var AccountUpdaterDailyReport = (function(_super) {
  __extends(AccountUpdaterDailyReport, _super);
  function AccountUpdaterDailyReport(attributes) {
    AccountUpdaterDailyReport.__super__.constructor.call(this, attributes);
  }
  return AccountUpdaterDailyReport;
})(AttributeSetter);

exports.AccountUpdaterDailyReport = AccountUpdaterDailyReport;
