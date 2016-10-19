'use strict';

require('./testHelper');
var CreditCardGateway = require('../lib/credit_card_gateway').CreditCardGateway;

describe('CreditCardGateway', function() {
  return describe('dateFormat', function() {
    return it('works with a month boundary', function() {
      var date, gateway;
      gateway = new CreditCardGateway(testHelper.defaultGateway);
      date = new Date('2016-10-1');
      return GLOBAL.assert.equal(gateway.dateFormat(date), '102016');
    });
  });
});
