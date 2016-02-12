'use strict';
console.log('>>>', __dirname);
import * as _ from 'lodash';
import * as Util from './util.js';
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
    _.each(opts, (data, type) => {
      type = _.capitalize(type);
      let filterMethod = '_add' + type + 'Filter';
      console.log('_k1', data, type, filterMethod);
      sqlArr.push(privates[filterMethod](data));
    });

    return privates._composeQuery({ q : sqlArr });
  },

  _addTermFilter: function (opts) {
    let sql = 'WHERE ';
    let and = false;
    _.each(opts, (key, val) => {
       if (and) sql += ' AND ';
       sql += val + ' = ' + key;
       and = true;
    });
    console.log('_aTF', sql);
    return sql;     
  },

  // key elastic search operators to sql operators
  _rangeOperators : {
    gte : '>=',
    lte : '<=',
    gt : '>',
    lt : '<'
  },

  _addRangeFilter: (opts) => {
    let sql = ['WHERE'];
    let and = false;
    _.each(opts, (data, field) => {
      if (and) sql.push('AND');
      let op = _.keys(data); // get operator
      let.data = data[op]; // get value
      sql.push(field); // set field
      if (opts.from && opts.to) {
        sql += opts.field ' >= ' + opts.from ' AND <= ' + opts.to;
      } else if (op) {
        sql.push(privates[op]);
      }
      and = true;
    });
    return _composeQuery(sql);
  },

  _sort: function (opts) {
    var sql = '';
    _.each(opts, (items));
  },

  _group: function (opts) {
  
  },

  _limit: function (opts) {
  
  },

  _composeQuery: function (opts) {
    console.log('_bQ', opts);
    var sql = '';
    _.each(opts.q, (bit, i) => {
      sql += bit;
      console.log('_bQ 1', i, bit);
      if (i < opts.q.length - 1) {
        sql += ' ';
      }
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
