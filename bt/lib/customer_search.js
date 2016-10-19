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

var AdvancedSearch = require('./advanced_search').AdvancedSearch;
var CustomerSearch = (function(_super) {
  __extends(CustomerSearch, _super);
  function CustomerSearch() {
    return CustomerSearch.__super__.constructor.apply(this, arguments);
  }

  CustomerSearch.textFields('addressCountryName', 'addressExtendedAddress', 'addressFirstName', 'addressLastName', 'addressLocality',
  'addressPostalCode', 'addressRegion', 'addressStreetAddress', 'cardholderName', 'company', 'email', 'fax', 'firstName', 'id',
  'lastName', 'paymentMethodToken', 'paypalAccountEmail', 'phone', 'website', 'paymentMethodTokenWithDuplicates');

  CustomerSearch.equalityFields('creditCardExpirationDate');
  CustomerSearch.partialMatchFields('creditCardNumber');
  CustomerSearch.multipleValueField('ids');
  CustomerSearch.rangeFields('createdAt');

  return CustomerSearch;
})(AdvancedSearch);

exports.CustomerSearch = CustomerSearch;
