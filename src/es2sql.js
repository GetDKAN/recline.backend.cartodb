'use strict';
/**
 * Internal query methods
 **/
var privates = {
  // @TODO we need a way to get the table name - cartodb lib handles this i think
  _getTableName: function () {
  
  },
  _select : function () {
  
  },

  _where: function () {
  
  },

  _group : function () {
  
  }
};

module.exports = {
  /**
   * @param q {object} a recline query object
   * @returns cartoQuery - a urlencoded string suitable for 
   * querying a cartodb database
   **/
  translate : function (q) {
    console.log('es2sql 1', q, privates);
    // 
    // urlencode it
    return '';
  }
};

