'use strict';
console.log('>>>', __dirname);
import * as _ from 'lodash';

/**
 * Internal query methods
 **/
let privates = {
  // @TODO we need a way to get the table name 
  // cartodb lib handles this i think
  _getTableName: (opts) => {
    console.log('gTn', opts);
  },

  /**
   * SELECTR fields
   * Format:
   *   [fieldName1, fieldName2, ...]
   * Returns:
   *  'fieldName1 , fieldName 2 [...]'
   **/
  _fields: (opts) => {
    if (!opts) return '*';
    let sql = [];
    let and = false;
    _.each(opts, (field) => {
      if (and) sql.push(',');
      sql.push(field);
      and = true;
    });
    return privates._composeQuery(sql);
  },

  /**
   * Add Filter to Query (range or term)
   * Format: 
   *   range:
   *     { range : {operator : { field : value } } }
   *   term:
   *     { term : { field : value } }
   * 
   * 
   **/
  _filters: (opts) => {
    console.log('_f', opts);
    let sqlArr = [];
    // @@TODO - we should also check for type property
    _.each(opts, (data, type) => {
      type = _.capitalize(type);
      let filterMethod = '_add' + type + 'Filter';
      console.log('_k1', data, type, filterMethod);
      sqlArr.push(privates[filterMethod](data));
    });

    return privates._composeQuery(sqlArr);
  },

  _addTermFilter: (opts) => {
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
  
  _addRangeFilter: (opts) => {
    let sql = ['WHERE'];
    let and = false;
    _.each(opts, (data, field) => {
      if (and) sql.push('AND');
      let op = _.keys(data)[0]; // get operator
      let filterVal = data[op]; // get value
      console.log('aRF 1', opts, op, filterVal);
      sql.push(field); // set field
      if (opts.from && opts.to) {
        sql.push([opts.field, '>=' , opts.from, 'AND <=', opts.to]);
      } else if (op) {
        sql.push(privates._rangeOperators[op], filterVal);
      }
      and = true;
    });
    return privates._composeQuery(sql);
  },

  // key elastic search operators to sql operators
  _rangeOperators : {
    gte : '>=',
    lte : '<=',
    gt : '>',
    lt : '<'
  },

  /**
   * Add sort paramters to query
   * Formats:
   * {foo : 'DESC'}
   * {field : 'foo', order : 'ASC'}
   * {field : 'foo' } // defaults to DESC
   * [{foo : 'DESC'}, {field : 'bar', order : 'ASC'}, {field : 'baz'}]
   **/
  _sort: (opts) => {
    let and = false;
    let sql = ['ORDER BY'];
    console.log(opts);
    // array of sort objects
    if (_.isArray(opts)) {
      _.each(opts, (sortObj) => {
        if (and) sql.push(',');
        if (sortObj.field) {
          sql = sql.concat(privates.__sortLabeled(sortObj));
        } else {
          sql = sql.concat(privates.__sortSimple(sortObj));
        }
        and = true;
      });
    // field syntax
    } else if (opts.field) {
      console.log('SSS-1-0', privates.__sortLabeled(opts));
      sql = sql.concat(privates.__sortLabeled(opts));
      console.log('SSS-1',sql);
    // simple syntax
    } else {
      sql = sql.concat(privates.__sortSimple(opts));
    }
    return privates._composeQuery(sql);
  },
  
  // called by _sort()
  // format:
  // {field : 'foo', order: 'DESC' format}
  // {field : 'foo'} // defaults to DESC
  __sortLabeled: (opts) => {
      console.log('__sl', opts);
      let sql = [];
      let dir = opts.order || 'DESC';
      sql.push(opts.field);
      sql.push(dir);
      console.log(sql);
      return sql;
  },

  // called by _sort()
  // format:
  // {foo : 'desc'};
  __sortSimple: (opts) => {
    console.log('__ss', opts);
    let sql = [];
    let field = _.keys(opts)[0];
    sql.push(field);
    sql.push(opts[field]);
    console.log(sql);
    return sql;
  },

  // @@TODO Implement GROUP BY
  _group: (opts) => {
    console.log('_g', opts); 
  },

  _composeQuery: (opts) => {
    var sql = '';
    _.each(opts, (bit, i) => {
      sql += bit;
      if (i < opts.length - 1) {
        sql += ' ';
      }
    });
    return sql;
  }
};

module.exports = {
  translate : (opts) => {
    console.log('es2sql 1', opts, privates);
    let q = opts.query;
    let size = q.size || 10;
    let tableName = q.table;
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

    return encodeURIComponent(privates._composeQuery(cartoQ));
  },

  privates : privates //include for unit testing
};
