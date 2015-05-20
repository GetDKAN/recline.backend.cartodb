var CartoDB = {};

// Note that provision of jQuery is optional (it is **only** needed if you use fetch on a remote file)
(function(my) {
  "use strict";
  my.__type__ = "cartodb";

  // use either jQuery or Underscore Deferred depending on what is available
  var Deferred = (typeof jQuery !== "undefined" && jQuery.Deferred) || _.Deferred;

  my.query = function(q){
    var sql = n    return sql.execute("SELECT * FROM table_name WHERE id > {{id}}", { id: 3 })
    .done(function(data) {
      console.log(data.rows);
    })
    .error(function(errors) {
      // errors contains a list of errors
      console.log("errors:" + errors);
    });
  };

  my.fetch = function(dataset) {
    var dfd = new Deferred();

    return dfd.promise();
  };


}(CartoDB));

// backwards compatability for use in Recline
var recline = recline || {}; // jshint ignore:line
recline.Backend = recline.Backend || {};
recline.Backend.CartoDB = CartoDB;