var CartoDB = {};

(function(my) {
  "use strict";
  my.__type__ = "cartodb";
  console.log(my);

  // use either jQuery or Underscore Deferred depending on what is available
  var Deferred = (typeof jQuery !== "undefined" && jQuery.Deferred) || _.Deferred;

  my.query = function(queryObj,dataset) {
    var dfd = new Deferred();
    var sql = cartodb.SQL({ user: dataset.user });
    //var query = this._normalizeQuery(query,dataset); 
    //sql.execute(query).done(function(data) {
    // dfd.resolve({
    //  records: data.rows,
    // fields: data.fields,
    // useMemoryStore: true
    //});
    return dfd.promise();
  };

  my.fetch = function(dataset) {
    var dfd = new Deferred();
    var sql = cartodb.SQL({ user: dataset.user });
    sql.execute("SELECT * FROM " + dataset.table + " LIMIT 10").done(function(data) {
      console.log(data);
      dfd.resolve({
        records: data.rows,
        fields: data.fields,
        useMemoryStore: true
      });
    });
    return dfd.promise();
  };
  
   my._normalizeQuery = function(queryObj, dataset) { 
     // SELECT queryObj.fields
     // FROM dataset.table
     // WHERE queryObj.filter.term.key = queryObj.filter.term.key
     // LIMIT query.size 
     // PAGE queryObj.from
     // ORDER BY 
   }


}(CartoDB));

// backwards compatability for use in Recline
var recline = recline || {}; // jshint ignore:line
recline.Backend = recline.Backend || {};
recline.Backend.CartoDB = CartoDB;
