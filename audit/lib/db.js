'use strict';

var _ = require('underscore');
var r = require('rethinkdb');
var config = require('config');
require('dotenv').load();

var dbConfig = config.get(process.env.AUDIT_DB_CONNECTION);

function ensureTable(tableName){

  function createTable(){
    return r.tableCreate(tableName);
  }

  return r.tableList()
    .contains(tableName)
    .do(function(contains){
      return r.branch(contains, null, r.do(createTable));
    });
}

function ensureIndex(indexName, tableName){

  function createIndex(){
    return r.table(tableName)
      .indexCreate(indexName);
  }

  return r.table(tableName)
    .indexList()
    .contains(indexName)
    .do(function(contains){
      return r.branch(contains, null, r.do(createIndex));
    });
}

function ready(err, connection){
  var queue = [];

  _.forEach(
    config.get('db.tables'),
    function(tableName){
      queue.push(
        ensureTable(tableName)
      );
    }
  );

  _.forEach(
    config.get('db.indexes'),
    function(indexes, tableName){
      _.forEach(indexes, function(indexName){
        queue.push(
          ensureIndex(indexName, tableName)
        );
      });
    }
  );

  return Promise.each(queue, function(query){
    return query.run(connection);
  });
};

var db = r.connect(dbConfig, ready);

_.forEach(dbConfig.tables, function(tableName){
  if (db[tableName] == null){
    db[tableName] = r.table(tableName);
  }
});


/// TBD add function to write to table


module.exports = db;
