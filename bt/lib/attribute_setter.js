'use strict';

var AttributeSetter;

AttributeSetter = (function() {
  function AttributeSetter(attributes) {
    var key, value;
    for (key in attributes) {
      value = attributes[key];
      this[key] = value;
    }
  }

  return AttributeSetter;
})();

exports.AttributeSetter = AttributeSetter;
