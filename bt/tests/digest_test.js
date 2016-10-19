'use strict';

require('./testHelper');
var Digest = require('../lib/digest').Digest;

describe('Util', function() {
  describe('Sha1hexdigest', function() {
    it('passes test case 6 from RFC 2202', function() {
      var digest;
      digest = Digest.Sha1hexdigest(GLOBAL.testHelper.multiplyString('\xaa', 80), 'Test Using Larger Than Block-Size Key - Hash Key First');
      return GLOBAL.assert.equal(digest, 'aa4ae5e15272d00e95705637ce8a3b55ed402112');
    });
    return it('passes test case 7 from RFC 2202', function() {
      var digest;
      digest = Digest.Sha1hexdigest(GLOBAL.testHelper.multiplyString('\xaa', 80),
        'Test Using Larger Than Block-Size Key and Larger Than One Block-Size Data');
      return GLOBAL.assert.equal(digest, 'e8e99d0f45237d786d6bbaa7965c7808bbff1a91');
    });
  });
  describe('hmacSha256', function() {
    return it('is the HMAC SHA256', function() {
      var hmac;
      hmac = Digest.Sha256hexdigest('my-secret-key', 'my-secret-message');
      return GLOBAL.assert.equal(hmac, 'c6d0dfae32b8ed2d02b236e9ee2be05478e69b8d72ff82d64ce1f25e2c6d4066');
    });
  });
  return describe('secureCompare', function() {
    it('returns true if strings are the same', function() {
      return GLOBAL.assert(new Digest().secureCompare('a_string', 'a_string'));
    });
    it('returns false if strings are different lengths', function() {
      return GLOBAL.assert.strictEqual(false, new Digest().secureCompare('a_string', 'a_string_that_is_longer'));
    });
    return it('returns false if strings are different', function() {
      return GLOBAL.assert.strictEqual(false, new Digest().secureCompare('a_string', 'a_strong'));
    });
  });
});
