'use strict';

var Transaction = require('./transaction').Transaction;
var ValidationErrorsCollection = require('./validation_errors_collection').ValidationErrorsCollection;

var ErrorResponse = (function() {
  function ErrorResponse(attributes) {
    var key, value;
    for (key in attributes) {
      value = attributes[key];
      this[key] = value;
    }
    this.success = false;
    this.errors = new ValidationErrorsCollection(attributes.errors);
    if (attributes.transaction) {
      this.transaction = new Transaction(attributes.transaction);
    }
  }

  return ErrorResponse;
})();

exports.ErrorResponse = ErrorResponse;
