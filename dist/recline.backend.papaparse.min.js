var recline = recline || {};
var privates = {};
recline.Backend = recline.Backend || {};
recline.Backend.cartodb = recline.Backend.cartodb || {};
(function(my) {

  var Deferred = (typeof jQuery !== "undefined" && jQuery.Deferred) || _.Deferred;

  my._type = 'cartodb';
  my.fetch = function (dataset) {
    var dfd = new Deferred();
    var query = Es2sql.Es2Sql.translate(dataset.query || privates._defaultQuery(dataset));
    var sql = cartodb.SQL({ user: dataset.user });
    console.log('cdbf1', dataset, query, privates._defaultQuery(dataset));
    sql.execute("SELECT * FROM " + dataset.table + " LIMIT 10").done(function (data) {
      console.log(data);
      dfd.resolve({
        records: data.rows,
        fields: data.fields,
        useMemoryStore: true
      });
    });
    return dfd.promise();
  };

  my.query = function (dataset) {
    var dfd = new Deferred();
    var sql = cartodb.SQL({ user: dataset.user });
    var query = dataset.query;
    query.table = dataset.table;
  
    sql.execute(Es2sql.Es2Sql.translate(query)).done(function (data) {
      dfd.resolve({
        records: data.rows,
        fields: data.fields,
        useMemoryStore: true
      });
      return dfd.promise();
    });
  };

  privates._defaultQuery = function (dataset) {
    return {
      table: dataset.table,
      user: dataset.user,
      from: 0,
      size: 10
    }
  };

})(recline.Backend.cartodb);
