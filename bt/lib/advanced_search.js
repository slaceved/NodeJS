'use strict';

var __slice = [].slice;
var __hasProp = {}.hasOwnProperty;
var __extends = function(child, parent) {
  for (var key in parent) {
    if (__hasProp.call(parent, key)){
        child[key] = parent[key];
    }
  } function Ctor() {
      this.constructor = child;
  }
  Ctor.prototype = parent.prototype;
  child.prototype = new Ctor();
  child.__super__ = parent.prototype;
  return child;
};

var Util = require('./util').Util;
var _ = require('underscore');

var SearchNode = (function() {
  SearchNode.operators = function() {
    var operator, operatorTemplate, operators, _i, _len, _results,
      _this = this;
    operators = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    operatorTemplate = function(operator) {
      return function(value) {
        var criterion;
        criterion = {};
        criterion[operator] = '' + value;
        return this.parent.addCriteria(this.nodeName, criterion);
      };
    };
    _results = [];
    for (_i = 0, _len = operators.length; _i < _len; _i++) {
      operator = operators[_i];
      _results.push(this.prototype[operator] = operatorTemplate(operator));
    }
    return _results;
  };

  function SearchNode(nodeName, parent) {
    this.nodeName = nodeName;
    this.parent = parent;
  }

  return SearchNode;
})();


var EqualityNode = (function(_super) {
  __extends(EqualityNode, _super);

  function EqualityNode() {
    return EqualityNode.__super__.constructor.apply(this, arguments);
  }

  EqualityNode.operators('is', 'isNot');

  return EqualityNode;
})(SearchNode);

var PartialMatchNode = (function(_super) {
  __extends(PartialMatchNode, _super);
  function PartialMatchNode() {
    return PartialMatchNode.__super__.constructor.apply(this, arguments);
  }

  PartialMatchNode.operators('endsWith', 'startsWith');

  return PartialMatchNode;
})(EqualityNode);

var TextNode = (function(_super) {
  __extends(TextNode, _super);
  function TextNode() {
    return TextNode.__super__.constructor.apply(this, arguments);
  }

  TextNode.operators('contains');

  return TextNode;
})(PartialMatchNode);

var KeyValueNode = (function(_super) {
  __extends(KeyValueNode, _super);
  function KeyValueNode() {
    return KeyValueNode.__super__.constructor.apply(this, arguments);
  }

  KeyValueNode.prototype.is = function(value) {
    return this.parent.addCriteria(this.nodeName, value);
  };

  return KeyValueNode;
})(SearchNode);

var MultipleValueNode = (function(_super) {
  __extends(MultipleValueNode, _super);
  function MultipleValueNode(nodeName, parent, options) {
    MultipleValueNode.__super__.constructor.call(this, nodeName, parent);
    this.options = options;
  }

  MultipleValueNode.prototype.allowedValues = function() {
    return this.options['allows'];
  };

  MultipleValueNode.prototype['in'] = function() {
    var allowedValues, badValues, values;
    values = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    values = Util.flatten(values);
    if (typeof this.allowedValues === 'function' ? this.allowedValues() : void 0) {
      allowedValues = this.allowedValues();
      badValues = Util.without(values, allowedValues);
      if (!Util.arrayIsEmpty(badValues)) {
        throw new Error('Invalid argument(s) for ' + this.nodeName);
      }
    }
    return this.parent.addCriteria(this.nodeName, values);
  };

  MultipleValueNode.prototype.is = function(value) {
    return this['in'](value);
  };

  return MultipleValueNode;
})(SearchNode);

var MultipleValueOrTextNode = (function(_super) {
  __extends(MultipleValueOrTextNode, _super);
  MultipleValueOrTextNode.delegators = function() {
    var delegatedMethods, delegatorTemplate, methodName, _i, _len, _results,
      _this = this;
    delegatedMethods = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    delegatorTemplate = function(methodName) {
      return function(value) {
        return this.textNode[methodName](value);
      };
    };
    _results = [];
    for (_i = 0, _len = delegatedMethods.length; _i < _len; _i++) {
      methodName = delegatedMethods[_i];
      _results.push(this.prototype[methodName] = delegatorTemplate(methodName));
    }
    return _results;
  };

  MultipleValueOrTextNode.delegators('contains', 'endsWith', 'is', 'isNot', 'startsWith');

  function MultipleValueOrTextNode(nodeName, parent, options) {
    MultipleValueOrTextNode.__super__.constructor.apply(this, arguments);
    this.textNode = new TextNode(nodeName, parent);
  }

  return MultipleValueOrTextNode;
})(MultipleValueNode);


var RangeNode = (function(_super) {
  __extends(RangeNode, _super);
  function RangeNode() {
    return RangeNode.__super__.constructor.apply(this, arguments);
  }

  RangeNode.operators('is');

  RangeNode.prototype.between = function(min, max) {
    this.min(min);
    return this.max(max);
  };

  RangeNode.prototype.max = function(value) {
    return this.parent.addCriteria(this.nodeName, {
      max: value
    });
  };

  RangeNode.prototype.min = function(value) {
    return this.parent.addCriteria(this.nodeName, {
      min: value
    });
  };

  return RangeNode;
})(SearchNode);

var AdvancedSearch = (function() {
  function AdvancedSearch() {
    this.criteria = {};
  }

  AdvancedSearch.prototype.addCriteria = function(key, value) {
    if (this.criteria[key] === Object(this.criteria[key]) && !_.isArray(this.criteria[key])) {
      return Util.merge(this.criteria[key], value);
    } else {
      return this.criteria[key] = value;
    }
  };

  AdvancedSearch.equalityFields = function() {
    var fields;
    fields = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this._createFieldAccessors(fields, EqualityNode);
  };

  AdvancedSearch.partialMatchFields = function() {
    var fields;
    fields = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this._createFieldAccessors(fields, PartialMatchNode);
  };

  AdvancedSearch.textFields = function() {
    var fields;
    fields = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this._createFieldAccessors(fields, TextNode);
  };

  AdvancedSearch.keyValueFields = function() {
    var fields;
    fields = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this._createFieldAccessors(fields, KeyValueNode);
  };

  AdvancedSearch.multipleValueField = function(field, options) {
    if (options == null) {
      options = {};
    }
    return this._createFieldAccessors([field], MultipleValueNode, options);
  };

  AdvancedSearch.multipleValueOrTextField = function(field, options) {
    if (options == null) {
      options = {};
    }
    return this._createFieldAccessors([field], MultipleValueOrTextNode, options);
  };

  AdvancedSearch.rangeFields = function() {
    var fields;
    fields = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this._createFieldAccessors(fields, RangeNode);
  };

  AdvancedSearch._createFieldAccessors = function(fields, klass, options) {
    var field, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = fields.length; _i < _len; _i++) {
      field = fields[_i];
      _results.push(this.prototype[field] = this._fieldTemplate(field, klass, options));
    }
    return _results;
  };

  AdvancedSearch._fieldTemplate = function(field, klass, options) {
    return function() {
      return new klass(field, this, options);
    };
  };

  AdvancedSearch.prototype.toHash = function() {
    return this.criteria;
  };

  return AdvancedSearch;
})();

exports.AdvancedSearch = AdvancedSearch;
