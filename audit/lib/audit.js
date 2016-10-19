'use strict';

var _ = require('underscore');
var datetime = require('datetime');
var db = require('./db');

function Audit (options, callback) {
  var self = this;

  this.options = _.merge({
    tableName: 'event_log',
    hashKeyField: 'hostname',
    batchSize: 25,
    periodicSendInterval: 250,
  }, options);

  this.buffer = [];

  callback = callback || function (err) {
    if (err) {
      console.error('Audit:', err);
    }
  };

  var missingOptions = [];
  _.each(['region', 'accessKeyId', 'secretAccessKey', 'readCapacityUnits', 'writeCapacityUnits', 'tableName', 'hashKeyField', 'batchSize',
      'periodicSendInterval'], function (parameter) {
    if (!self.options[parameter]) {
      missingOptions.push(parameter);
    }
  });

  if (missingOptions.length) {
    return callback(new Error('missing required options: ' + missingOptions.join(', ')));
  }

  if (this.options.batchSize < 1 || this.options.batchSize > 25) {
    return callback(new Error('batchSize must be between 1 and 25'));
  }

  (function sendPeriodically () {
    setTimeout(sendPeriodically, self.options.periodicSendInterval);
    self._processBuffer(true, function (err, items) {});
  })();

  this._initialize(callback);
}

Audit.prototype.write = function (record, encoding, callback) {

  callback = callback || function (err, data) {};

  if (typeof record === 'string') {
    record = JSON.parse(record);
  }

  if (!(record && record[this.options.hashKeyField] && record.time)) {
    return callback(new Error('Audit: missing required record fields.'));
  }

  var keyValue = record[this.options.hashKeyField].toString();
  var timestamp = datetime(record.time).utcOffset(0).format('YYYYMMDDHHmmssSSS') + '.' + process.hrtime()[1] + '-' + record.hostname;

  var item = {
    timestamp: {S: timestamp},
    event: {S: JSON.stringify(record)},
  };

  // set the key field
  item[this.options.hashKeyField] = {S: keyValue};

  if (record.msg) {
    item.message = {S: record.msg.toString()};
  }

  if (record.level && !item.level) {
    item.level = {N: record.level.toString()};
  }

  if (record.hostname && !item.hostname) {
    item.hostname = {S: record.hostname.toString()};
  }

  // queue it up
  this.buffer.push({
    PutRequest: {
      Item: item
    }
  });

  // send if buffer full
  this._processBuffer(false, callback);
};

Audit.prototype._processBuffer = function (force, callback) {
  var self = this;

  // wait for initialization
  if (!this.initialized) {
    return callback(null, null);
  }

  // empty buffer
  if (!this.buffer.length) {
    return callback(null, null);
  }

  // check if it's time to send
  if (!(force || this.buffer.length >= this.options.batchSize)) {
    return callback(null, null);
  }

  // take some items from the buffer
  var requestItems = this.buffer.slice(0, this.options.batchSize);

  // build request
  var batchRequest = {
    RequestItems: {}
  };

  batchRequest.RequestItems[this.options.tableName] = requestItems;

  // remove batched items from buffer
  this.buffer = this.buffer.slice(this.options.batchSize);

  // write items to db
  return db.batchWriteItem(batchRequest, function (err, response) {

    if (err) {
      // return items to buffer
      self.buffer = requestItems.concat(self.buffer);
    } else {
      // return unprocessed items to buffer
      if (response && response.UnprocessedItems && response.UnprocessedItems[self.options.tableName]) {
        self.buffer = response.UnprocessedItems[self.options.tableName].concat(self.buffer);
      }
    }

    // done
    return callback(err, response);
  });
};

Audit.prototype._initialize = function (callback) {
  var self = this;

  db.listTables(function (err, result) {
    if (err) {
      return callback(err);
    }

    self.initialized = result.TableNames.indexOf(self.options.tableName) !== -1;

    if (self.initialized) {
      return callback();
    }

    self._createTable(db, function (err) {
      // ignore this error since it just indicates table is currently being created
      self.initialized = !(err && err.code !== 'ResourceInUseException');

      callback(self.initialized ? null : err);
    });
  });

};

Audit.prototype._createTable = function (db, callback) {

  db.createTable({
    TableName: this.options.tableName,
    KeySchema: [
      {
        AttributeName: this.options.hashKeyField,
        KeyType: 'HASH'
      },
      {
        AttributeName: 'timestamp',
        KeyType: 'RANGE'
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: this.options.hashKeyField,
        AttributeType: 'S'
      },
      {
        AttributeName: 'timestamp',
        AttributeType: 'S'
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: this.options.readCapacityUnits,
      WriteCapacityUnits: this.options.writeCapacityUnits,
    },
  }, function (err, result) {
    callback(err);
  });

};

module.exports = Audit;
