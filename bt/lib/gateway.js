'use strict';

var ErrorResponse = require('./error_response').ErrorResponse;
var SearchResponse = require('./search_response').SearchResponse;
var exceptions = require('./exceptions');
var _ = require('underscore');

var Gateway = (function() {
  function Gateway() {}

  Gateway.prototype.createResponseHandler = function(attributeKlassMap, klass, callback) {
    return function(err, response) {
      var attributeName, unknown;
      if (err) {
        return callback(err, response);
      }
      if (response.apiErrorResponse) {
        return callback(null, new ErrorResponse(response.apiErrorResponse));
      } else {
        response.success = true;
        if (attributeKlassMap === null) {
          return callback(null, response);
        } else if (typeof attributeKlassMap === 'string') {
          attributeName = attributeKlassMap;
          if (response[attributeName]) {
            if (klass != null) {
              response[attributeName] = new klass(response[attributeName]);
            }
          }
          return callback(null, response);
        } else {
          unknown = true;
          for (attributeName in attributeKlassMap) {
            klass = attributeKlassMap[attributeName];
            if (response[attributeName]) {
              unknown = false;
              if (klass != null) {
                response[attributeName] = new klass(response[attributeName]);
              }
              callback(null, response);
            }
          }
          if (unknown) {
            return callback(null, response);
          }
        }
      }
    };
  };

  Gateway.prototype.createSearchResponse = function(url, search, pagingFunction, callback) {
    var searchResponse;
    if (callback != null) {
      return this.gateway.http.post(url, {
        search: search.toHash()
      }, this.searchResponseHandler(pagingFunction, callback));
    } else {
      searchResponse = new SearchResponse;
      this.gateway.http.post(url, {
        search: search.toHash()
      }, function(err, response) {
        if (err != null) {
          searchResponse.setFatalError(err);
        } else if (response['searchResults']) {
          searchResponse.setResponse(response);
          searchResponse.setPagingFunction(pagingFunction);
        } else if (response.apiErrorResponse) {
          searchResponse.setFatalError(new ErrorResponse(response.apiErrorResponse));
        } else {
          searchResponse.setFatalError(exceptions.DownForMaintenanceError('Down for Maintenance'));
        }
        return searchResponse.ready();
      });
      return searchResponse.stream;
    }
  };

  Gateway.prototype.searchResponseHandler = function(pagingFunction, callback) {
    return function(err, response) {
      var container;
      if (err) {
        return callback(err, response);
      }
      if (response['searchResults']) {
        container = new SearchResponse(pagingFunction, response);
        return callback(null, container);
      } else if (response.apiErrorResponse) {
        return callback(null, new ErrorResponse(response.apiErrorResponse));
      } else {
        return callback(exceptions.DownForMaintenanceError('Down for Maintenance'), null);
      }
    };
  };

  Gateway.prototype.pagingFunctionGenerator = function(search, url, subjectType, getSubject) {
    var _this = this;
    return function(ids, callback) {
      search.ids()['in'](ids);
      return _this.gateway.http.post(('' + (_this.config.baseMerchantPath()) + '/') + url + '/advanced_search', {
        search: search.toHash()
      }, function(err, response) {
        var subject, _i, _len, _ref, _results;
        if (err) {
          return callback(err, null);
        } else {
          if (_.isArray(getSubject(response))) {
            _ref = getSubject(response);
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              subject = _ref[_i];
              _results.push(callback(null, new subjectType(subject)));
            }
            return _results;
          } else {
            return callback(null, new subjectType(getSubject(response)));
          }
        }
      });
    };
  };

  return Gateway;
})();

exports.Gateway = Gateway;
