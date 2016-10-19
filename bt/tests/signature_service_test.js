'use strict';

require('./testHelper');
var SignatureService = require('../lib/signature_service').SignatureService;

describe('SignatureService', function() {
  return it('signs the data with the given key and hash', function() {
    var hashFunction, signatureService, signed;
    hashFunction = function(key, data) {
      return data + '-hashed-with-' + key;
    };
    signatureService = new SignatureService('my-key', hashFunction);
    signed = signatureService.sign('my-data');
    return GLOBAL.assert.equal(signed, 'my-data-hashed-with-my-key|my-data');
  });
});

