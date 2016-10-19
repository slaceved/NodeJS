'use strict';

require('./testHelper');
var Config = require('../lib/config').Config;
var Environment = require('../lib/environment').Environment;

describe('Config', function() {
  it('can be configured with merchant credentials', function() {
    var config;
    config = new Config({
      merchantId: 'merchantId',
      publicKey: 'publicKey',
      privateKey: 'privateKey'
    });
    GLOBAL.GLOBAL.assert.equal(config.merchantId, 'merchantId');
    GLOBAL.GLOBAL.assert.equal(config.publicKey, 'publicKey');
    return GLOBAL.GLOBAL.assert.equal(config.privateKey, 'privateKey');
  });
  it('can be configured with partner credentials', function() {
    var config;
    config = new Config({
      partnerId: 'partnerId',
      publicKey: 'publicKey',
      privateKey: 'privateKey'
    });
    GLOBAL.GLOBAL.assert.equal(config.merchantId, 'partnerId');
    GLOBAL.GLOBAL.assert.equal(config.publicKey, 'publicKey');
    return GLOBAL.GLOBAL.assert.equal(config.privateKey, 'privateKey');
  });
  describe('baseMerchantUrl', function() {
    return it('returns the url for a merchant', function() {
      var config;
      config = new Config({
        merchantId: 'merchantId',
        publicKey: 'publicKey',
        privateKey: 'privateKey',
        environment: new Environment('localhost', 3000, false)
      });
      return GLOBAL.GLOBAL.assert.equal(config.baseMerchantUrl(), 'http://localhost/merchants/merchantId');
    });
  });
  return describe('timeout', function() {
    return it('defaults to 60 seconds', function() {
      var config;
      config = new Config({
        merchantId: 'merchantId',
        publicKey: 'publicKey',
        privateKey: 'privateKey'
      });
      return GLOBAL.GLOBAL.assert.equal(config.timeout, 60000);
    });
  });
});
