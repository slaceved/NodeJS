'use strict';

var ValidationError = (function() {
  function ValidationError(error) {
    this.attribute = error.attribute;
    this.code = error.code;
    this.message = error.message;
  }

  return ValidationError;
})();

exports.ValidationError = ValidationError;
