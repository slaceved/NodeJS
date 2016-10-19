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
var CreditCardVerification = require('./credit_card_verification').CreditCardVerification;

var CreditCard = (function(_super) {
  __extends(CreditCard, _super);
  CreditCard.CardType = {
    AmEx: 'American Express',
    CarteBlanche: 'Carte Blanche',
    ChinaUnionPay: 'China UnionPay',
    DinersClubInternational: 'Diners Club',
    Discover: 'Discover',
    JCB: 'JCB',
    Laser: 'Laser',
    Maestro: 'Maestro',
    MasterCard: 'MasterCard',
    Solo: 'Solo',
    Switch: 'Switch',
    Visa: 'Visa',
    Unknown: 'Unknown',
    All: function() {
      var all, key, value;
      all = [];
      for (key in this) {
        value = this[key];
        if (key !== 'All') {
          all.push(value);
        }
      }
      return all;
    }
  };

  CreditCard.CustomerLocation = {
    International: 'international',
    US: 'us'
  };

  CreditCard.CardTypeIndicator = {
    Yes: 'Yes',
    No: 'No',
    Unknown: 'Unknown'
  };

  CreditCard.Prepaid = CreditCard.Commercial = CreditCard.Payroll = CreditCard.Healthcare = CreditCard.DurbinRegulated =
    CreditCard.Debit = CreditCard.CountryOfIssuance = CreditCard.IssuingBank = CreditCard.CardTypeIndicator;

  function CreditCard(attributes) {
    var sortedVerifications;
    CreditCard.__super__.constructor.call(this, attributes);
    this.maskedNumber = '' + this.bin + '******' + this.last4;
    this.expirationDate = '' + this.expirationMonth + '/' + this.expirationYear;
    if (attributes) {
      sortedVerifications = (attributes.verifications || []).sort(function(a, b) {
        return b.created_at - a.created_at;
      });
      if (sortedVerifications[0]) {
        this.verification = new CreditCardVerification(sortedVerifications[0]);
      }
    }
  }

  return CreditCard;
})(AttributeSetter);

exports.CreditCard = CreditCard;
