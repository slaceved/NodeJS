'use strict';

var SignatureService = (function() {
  function SignatureService(key, hashFunction) {
    this.key = key;
    this.hashFunction = hashFunction;
  }

  SignatureService.prototype.sign = function(data) {
    return '' + (this.hashFunction(this.key, data)) + '|' + data;
  };

  return SignatureService;
})();

exports.SignatureService = SignatureService;
