'use strict';
console.log('>>>', __dirname);
import * as _ from 'lodash';

/**
 * Internal query methods
 **/
let privates = {
  // @TODO we need a way to get the table name - cartodb lib handles this i think
  _getTableName: function (opts) {
  
  },

  _filters: function (opts) {
    console.log('_f', opts);
    let sqlArr = [];
    _.each(opts, (filter, key) => {
      let filterMethod = '_add' + key + 'Filter';
      console.log('_k1', filter, key, filterMethod);
      sqlArr.push(privates[filterMethod]);
    });

    return privates._composeQuery({ q : sqlArr });
  },

  _addTermFilter: function (opts) {
    let sql = 'WHERE ';
    let and = false;
    _.each(opts, (key, val) => {
       sql += val + ' = ' + key;
       if (and) sql += ' AND ';
    });
    console.log('_aTF', sql);
    return sql;     
  },

  _addRangeFilter: function (opts) {
  
  },

  _sort: function (opts) {
    var sql = '';
    _.each(opts, (items))
  },

  _group: function (opts) {
  
  },

  _limit: function (opts) {
  
  },

  _composeQuery: function (opts) {
    console.log('_bQ', opts);
    var sql = '';
    _.each(opts.q, (bit) => {
       sql += bit + ' ';
    });
    return sql;
  },

  _urlEncode: function (str) {
    return encodeURIComponent(str)
  }
};

module.exports = {
  translate : function (opts) {
    console.log('es2sql 1', opts, privates);
    let q = opts.query;
    let size = q.size || 10;
    let tableName = privates._getTableName(q);
    let filters = privates._filters(q.filters);
    let sort = privates._sort(q.sort);
    let cartoQ = [];
    
    // build sql array
    cartoQ.push('SELECT');
    cartoQ.push(size);
    cartoQ.push('FROM');
    cartoQ.push(tableName);
    
    if (q.size) {    
      cartoQ.push('LIMIT =');
      cartoQ.push(q.size);
    }

    if (q.offset) {
      cartoQ.push('OFFSET =');
      cartoQ.push(q.from);
    }

    if (q.filters) {
      cartoQ.push(filters);
    }

    if (q.sort) {
      cartoQ.push(sort);
    }

    return _composeQuery({q:cartoQ});
  },

  privates : privates //include for unit testing
};
