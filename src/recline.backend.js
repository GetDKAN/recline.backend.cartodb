'use strict';
import * as $ from './../lib/jquery-1.12.0.min.js';
//import * as CartoDB from './../lib/cartodb.3.15.js';
//import * as Es2Sql from './modules/es2sql.js';
console.log('bbba');
module.exports = {
  __type__: 'cartodb',

  query: () => {
    return 'query';  
  },

  fetch: () => {
    return 'fetch';
  },

  // Export libraries for unit testing
//  cartoDB: cartoDB,
  //es2Sql: Es2Sql,
  $ : $
};
