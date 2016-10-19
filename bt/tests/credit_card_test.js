'use strict';

require('./testHelper');
var _ = require('underscore')._;
var braintree = testHelper.braintree;
var CreditCard = require('../lib/credit_card').CreditCard;

describe('CreditCard', function() {
  return describe('constructor', function() {
    return it('initializes verification with the newest verification', function() {
      var credit_card, verification1, verification2, verification3;
      verification1 = {
        id: '123',
        created_at: 123
      };
      verification2 = {
        id: '987',
        created_at: 987
      };
      verification3 = {
        id: '456',
        created_at: 456
      };
      credit_card = new CreditCard({
        verifications: [verification1, verification2, verification3]
      });
      return GLOBAL.assert.equal(verification2.id, credit_card.verification.id);
    });
  });
});
