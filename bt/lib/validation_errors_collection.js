'use strict';

var Util = require('./util').Util;
var ValidationError = require('./validation_error').ValidationError;

var ValidationErrorsCollection = (function() {
  function ValidationErrorsCollection(errorAttributes) {
    var key, val;
    this.validationErrors = {};
    this.errorCollections = {};
    for (key in errorAttributes) {
      val = errorAttributes[key];
      if (key === 'errors') {
        this.buildErrors(val);
      } else {
        this.errorCollections[key] = new ValidationErrorsCollection(val);
      }
    }
  }

  ValidationErrorsCollection.prototype.buildErrors = function(errors) {
    var item, key, _base, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = errors.length; _i < _len; _i++) {
      item = errors[_i];
      key = Util.toCamelCase(item.attribute);
      (_base = this.validationErrors)[key] || (_base[key] = []);
      _results.push(this.validationErrors[key].push(new ValidationError(item)));
    }
    return _results;
  };

  ValidationErrorsCollection.prototype.deepErrors = function() {
    var errors, key, val, _ref, _ref1;
    errors = [];
    _ref = this.validationErrors;
    for (key in _ref) {
      val = _ref[key];
      errors = errors.concat(val);
    }
    _ref1 = this.errorCollections;
    for (key in _ref1) {
      val = _ref1[key];
      errors = errors.concat(val.deepErrors());
    }
    return errors;
  };

  ValidationErrorsCollection.prototype['for'] = function(name) {
    return this.errorCollections[name];
  };

  ValidationErrorsCollection.prototype.forIndex = function(index) {
    return this.errorCollections['index' + index];
  };

  ValidationErrorsCollection.prototype.on = function(name) {
    return this.validationErrors[name];
  };

  return ValidationErrorsCollection;
})();

exports.ValidationErrorsCollection = ValidationErrorsCollection;
