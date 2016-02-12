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

  _select: function (opts) {
  
  },

  _where: function (opts) {
  
  },

  _group: function (opts) {
  
  },

  _limit: function (opts) {
  
  },

  _buildQuery: function (opts) {
    console.log('_bQ', opts);
    var sql = '';
    _.each(opts.q, function (bit) {
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
    
    if (q.limit) {    
      cartoQ.push('LIMIT');
      cartoQ.push(q.limit);
    }

    if (q.filters) {
      cartoQ.push('WHERE');
      cartoQ.push(filters);
    }

    if (q.sort) {
      cartoQ.push('SORT');
      cartoQ.push(sort);
    }
    console.log('es2sql 2', cartoQ);
    return _buildQuery({q:cartoQ});
  },

  privates : privates //include for unit testing
};
