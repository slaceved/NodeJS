'use strict';

var _ = require('underscore');
var SearchResponseStream = require('./search_response_stream').SearchResponseStream;

var SearchResponse = (function() {
  function SearchResponse(pagingFunction, results) {
    if (pagingFunction != null) {
      this.setPagingFunction(pagingFunction);
    }
    if (results != null) {
      this.setResponse(results);
    }
    this.stream = new SearchResponseStream(this);
    this.success = true;
  }

  SearchResponse.prototype.each = function(callback) {
    var _this = this;
    return _.each(_.range(0, this.ids.length, this.pageSize), function(offset) {
      return _this.pagingFunction(_this.ids.slice(offset, offset + _this.pageSize), callback);
    });
  };

  SearchResponse.prototype.first = function(callback) {
    if (this.ids.length === 0) {
      return callback(null, null);
    } else {
      return this.pagingFunction([this.ids[0]], callback);
    }
  };

  SearchResponse.prototype.length = function() {
    return this.ids.length;
  };

  SearchResponse.prototype.ready = function() {
    return this.stream.ready();
  };

  SearchResponse.prototype.setFatalError = function(error) {
    return this.fatalError = error;
  };

  SearchResponse.prototype.setResponse = function(results) {
    this.ids = results.searchResults.ids;
    return this.pageSize = parseInt(results.searchResults.pageSize);
  };

  SearchResponse.prototype.setPagingFunction = function(pagingFunction) {
    return this.pagingFunction = pagingFunction;
  };

  return SearchResponse;
})();

exports.SearchResponse = SearchResponse;
