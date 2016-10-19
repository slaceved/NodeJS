'use strict';

require('./testHelper');
var SearchResponse = require('../lib/search_response').SearchResponse;

describe('SearchResponse', function() {
  describe('first', function() {
    it('calls gateway#find with results', function() {
      var fakeGateway, fakeResults, searchResponse;
      fakeGateway = {
        find: function(id, callback) {
          throw new Error('This exception SHOULD be thrown');
        }
      };
      fakeResults = {
        searchResults: {
          ids: [GLOBAL.testHelper.randomId()]
        }
      };
      searchResponse = new SearchResponse(fakeGateway, fakeResults);
      return GLOBAL.assert.throws(((function(_this) {
        return function() {
          return _this.searchResponse.first();
        };
      })(this)), Error);
    });
    return it('does not call gateway#find with zero results', function(done) {
      var fakeGateway, fakeResults, searchResponse;
      fakeGateway = {
        find: function(id, callback) {
          throw new Error('This exception should NOT be thrown');
        }
      };
      fakeResults = {
        searchResults: {
          ids: []
        }
      };
      searchResponse = new SearchResponse(fakeGateway, fakeResults);
      return searchResponse.first(function() {
        GLOBAL.assert.isTrue(true);
        return done();
      });
    });
  });
  describe('each', function() {
    return it('does not call pagingFunding with zero results', function() {
      var fakePagingFunction, fakeResults, searchResponse;
      fakePagingFunction = function(ids, callback) {
        throw new Error('This exception should NOT be thrown');
      };
      fakeResults = {
        searchResults: {
          ids: []
        }
      };
      searchResponse = new SearchResponse(fakePagingFunction, fakeResults);
      return GLOBAL.assert.doesNotThrow((function() {
        return searchResponse.each();
      }), Error);
    });
  });
  return describe('length', function() {
    return it('returns the correct length', function() {
      var fakeResults, searchResponse;
      fakeResults = {
        searchResults: {
          ids: [1, 2]
        }
      };
      searchResponse = new SearchResponse(null, fakeResults);
      return GLOBAL.assert.equal(searchResponse.length(), 2);
    });
  });
});
