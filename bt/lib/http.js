'use strict';

var http = require('http');
var https = require('https');
var Buffer = require('buffer').Buffer;
var braintree = require('./braintree');
var xml2js = require('xml2js');
var exceptions = require('./exceptions');
var Util = require('./util').Util;

var Http = (function() {
  function Http(config) {
    this.config = config;
    this.parser = new xml2js.Parser({
      explicitRoot: true
    });
  }

  Http.prototype.checkHttpStatus = function(status) {
    switch (status.toString()) {
      case '200':
      case '201':
      case '422':
        return null;
      case '401':
        return exceptions.AuthenticationError('Authentication Error');
      case '403':
        return exceptions.AuthorizationError('Authorization Error');
      case '404':
        return exceptions.NotFoundError('Not Found');
      case '426':
        return exceptions.UpgradeRequired('Upgrade Required');
      case '429':
        return exceptions.TooManyRequestsError('Too Many Requests');
      case '500':
        return exceptions.ServerError('Server Error');
      case '503':
        return exceptions.DownForMaintenanceError('Down for Maintenance');
      default:
        return exceptions.UnexpectedError('Unexpected HTTP response: ' + status);
    }
  };

  Http.prototype['delete'] = function(url, callback) {
    return this.request('DELETE', url, null, callback);
  };

  Http.prototype.get = function(url, callback) {
    return this.request('GET', url, null, callback);
  };

  Http.prototype.post = function(url, body, callback) {
    return this.request('POST', url, body, callback);
  };

  Http.prototype.put = function(url, body, callback) {
    return this.request('PUT', url, body, callback);
  };

  Http.prototype.request = function(method, url, body, callback) {
    var client, options, requestBody, requestSocket, theRequest, timeoutHandler;
    client = this.config.environment.ssl ? https : http;
    options = {
      host: this.config.environment.server,
      port: this.config.environment.port,
      method: method,
      path: url,
      headers: {
        'Authorization': this.authorizationHeader(),
        'X-ApiVersion': this.config.apiVersion,
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
        'User-Agent': 'Braintree Node ' + braintree.version
      }
    };
    if (body) {
      requestBody = JSON.stringify(Util.convertObjectKeysToUnderscores(body));
      options.headers['Content-Length'] = Buffer.byteLength(requestBody).toString();
    }
    theRequest = client.request(options, (function(_this) {
      return function(response) {
        body = '';
        response.on('data', function(responseBody) {
          return body += responseBody;
        });
        response.on('end', function() {
          var error;
          error = _this.checkHttpStatus(response.statusCode);
          if (error) {
            return callback(error, null);
          }
          if (body !== ' ') {
            return _this.parser.parseString(body, function(err, result) {
              return callback(null, Util.convertNodeToObject(result));
            });
          } else {
            return callback(null, null);
          }
        });
        return response.on('error', function(err) {
          var error;
          error = exceptions.UnexpectedError('Unexpected response error: ' + err);
          return callback(error, null);
        });
      };
    })(this));
    timeoutHandler = (function(_this) {
      return function() {
        var error;
        theRequest.abort();
        _this._aborted = true;
        error = exceptions.UnexpectedError('Request timed out');
        return callback(error, null);
      };
    })(this);
    theRequest.setTimeout(this.config.timeout, timeoutHandler);
    requestSocket = null;
    theRequest.on('socket', function(socket) {
      return requestSocket = socket;
    });
    theRequest.on('error', (function(_this) {
      return function(err) {
        var error;
        if (_this._aborted) {
          return;
        }
        if (_this.config.timeout > 0) {
          requestSocket.removeListener('timeout', timeoutHandler);
        }
        error = exceptions.UnexpectedError('Unexpected request error: ' + err);
        return callback(error, null);
      };
    })(this));
    if (body) {
      theRequest.write(requestBody);
    }
    return theRequest.end();
  };

  Http.prototype.authorizationHeader = function() {
    if (this.config.accessToken) {
      return 'Bearer ' + this.config.accessToken;
    } else if (this.config.clientId) {
      return 'Basic ' + (new Buffer(this.config.clientId + ':' + this.config.clientSecret)).toString('base64');
    } else {
      return 'Basic ' + (new Buffer(this.config.publicKey + ':' + this.config.privateKey)).toString('base64');
    }
  };

  return Http;
})();

exports.Http = Http;
