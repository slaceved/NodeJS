'use strict';

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

require('./testHelper');
var AdvancedSearch = require('../lib/advanced_search').AdvancedSearch;
var value = 'mail@example.com';

var TestSearch = (function(superClass) {
  __extends(TestSearch, superClass);

  function TestSearch() {
    return TestSearch.__super__.constructor.apply(this, arguments);
  }

  TestSearch.equalityFields('equality');
  TestSearch.partialMatchFields('partialMatch');
  TestSearch.textFields('text');
  TestSearch.keyValueFields('key');
  TestSearch.multipleValueField('multiple');
  TestSearch.multipleValueField('multipleWithAllows', {
    'allows': ['Hello', 'World']
  });

  TestSearch.multipleValueOrTextField('multipleValueOrText');
  TestSearch.rangeFields('range');

  return TestSearch;

})(AdvancedSearch);

var newSearch = function() {
  return new TestSearch();
};

describe('AdvancedSearch', function() {
  describe('equality field', function() {
    it('supports is', function() {
      var search;
      search = newSearch();
      search.equality().is(value);
      return GLOBAL.assert.deepEqual(search.toHash(), {
        equality: {
          is: value
        }
      });
    });
    return it('supports isNot', function() {
      var search;
      search = newSearch();
      search.equality().isNot(value);
      return GLOBAL.assert.deepEqual(search.toHash(), {
        equality: {
          isNot: value
        }
      });
    });
  });
  describe('partial match field', function() {
    it('inherits operators', function() {
      var search;
      search = newSearch();
      GLOBAL.assert.isFunction(search.partialMatch().is);
      return GLOBAL.assert.isFunction(search.partialMatch().isNot);
    });
    it('supports endsWith', function() {
      var search;
      search = newSearch();
      search.partialMatch().endsWith('example.com');
      return GLOBAL.assert.deepEqual(search.toHash(), {
        partialMatch: {
          endsWith: 'example.com'
        }
      });
    });
    return it('supports startsWith', function() {
      var search;
      search = newSearch();
      search.partialMatch().startsWith('mail');
      return GLOBAL.assert.deepEqual(search.toHash(), {
        partialMatch: {
          startsWith: 'mail'
        }
      });
    });
  });
  describe('text field', function() {
    it('inherits operators', function() {
      var search;
      search = newSearch();
      GLOBAL.assert.isFunction(search.text().is);
      GLOBAL.assert.isFunction(search.text().isNot);
      GLOBAL.assert.isFunction(search.text().endsWith);
      return GLOBAL.assert.isFunction(search.text().startsWith);
    });
    return it('supports contains', function() {
      var search;
      search = newSearch();
      search.text().contains('ample');
      return GLOBAL.assert.deepEqual(search.toHash(), {
        text: {
          contains: 'ample'
        }
      });
    });
  });
  describe('key value field', function() {
    return it('supports is', function() {
      var search;
      search = newSearch();
      search.key().is(100);
      return GLOBAL.assert.deepEqual(search.toHash(), {
        key: 100
      });
    });
  });
  describe('multiple value field', function() {
    it('supports in', function() {
      var search;
      search = newSearch();
      search.multiple()['in']([1, 2, 3]);
      return GLOBAL.assert.deepEqual(search.toHash(), {
        multiple: [1, 2, 3]
      });
    });
    it('supports in with an allowed value', function() {
      var search;
      search = newSearch();
      return GLOBAL.assert.doesNotThrow((function() {
        return search.multipleWithAllows()['in'](['Hello']);
      }), Error);
    });
    it('supports in with an unallowed value', function() {
      var search;
      search = newSearch();
      return GLOBAL.assert.throws((function() {
        return search.multipleWithAllows()['in'](['Hello', 'Bah']);
      }), Error);
    });
    return it('supports is', function() {
      var search;
      search = newSearch();
      search.multiple().is(value);
      return GLOBAL.assert.deepEqual(search.toHash(), {
        multiple: [value]
      });
    });
  });
  describe('multiple value or text field', function() {
    it('inherits operators', function() {
      var search;
      search = newSearch();
      GLOBAL.assert.isFunction(search.multipleValueOrText().is);
      GLOBAL.assert.isFunction(search.multipleValueOrText().isNot);
      GLOBAL.assert.isFunction(search.multipleValueOrText().endsWith);
      GLOBAL.assert.isFunction(search.multipleValueOrText().startsWith);
      GLOBAL.assert.isFunction(search.multipleValueOrText().contains);
      return GLOBAL.assert.isFunction(search.multipleValueOrText()['in']);
    });
    return it('delegates is to TextNode', function() {
      var search;
      search = newSearch();
      search.multipleValueOrText().is(value);
      return GLOBAL.assert.deepEqual(search.toHash(), {
        multipleValueOrText: {
          is: value
        }
      });
    });
  });
  describe('range field', function() {
    it('supports is', function() {
      var search;
      search = newSearch();
      search.range().is(value);
      return GLOBAL.assert.deepEqual(search.toHash(), {
        range: {
          is: value
        }
      });
    });
    it('supports min', function() {
      var search;
      search = newSearch();
      search.range().min(50);
      return GLOBAL.assert.deepEqual(search.toHash(), {
        range: {
          min: 50
        }
      });
    });
    it('supports max', function() {
      var search;
      search = newSearch();
      search.range().max(100);
      return GLOBAL.assert.deepEqual(search.toHash(), {
        range: {
          max: 100
        }
      });
    });
    return it('supports between', function() {
      var search;
      search = newSearch();
      search.range().between(50, 100);
      return GLOBAL.assert.deepEqual(search.toHash(), {
        range: {
          min: 50,
          max: 100
        }
      });
    });
  });
  return describe('addCriteria', function() {
    it('adds a numeric criteria', function() {
      var search;
      search = newSearch();
      search.addCriteria('numero', 2);
      return GLOBAL.assert.deepEqual(search.toHash(), {
        numero: 2
      });
    });
    it('merges in an object criteria', function() {
      var search;
      search = newSearch();
      search.addCriteria('object', {
        foo: 'bar',
        key1: 1
      });
      search.addCriteria('object', {
        foo: 'baz',
        key2: 2
      });
      return GLOBAL.assert.deepEqual(search.toHash(), {
        object: {
          foo: 'baz',
          key1: 1,
          key2: 2
        }
      });
    });
    return it('replaces an array criteria', function() {
      var search;
      search = newSearch();
      search.addCriteria('array', [0, 1, 2]);
      search.addCriteria('array', [3, 4]);
      return GLOBAL.assert.deepEqual(search.toHash(), {
        array: [3, 4]
      });
    });
  });
});
