var recline = recline || {};
var privates = {};
recline.Backend = recline.Backend || {};
recline.Backend.cartodb = recline.Backend.cartodb || {};
(function(my) {

  var Deferred = (typeof jQuery !== "undefined" && jQuery.Deferred) || _.Deferred;

  my._type = 'cartodb';
  my.fetch = function (dataset) {
    var query, sql;
    var dfd = new Deferred();
    // if we're provided a url, just grab that
    if (dataset.url) {
      dataset.user = privates._parseDatasetUrl(dataset.url);
      query = dataset.url.match(/q=(.*)/g);
      query = decodeURIComponent(query[0].replace('q=',''));
      console.log('cdbF0', query);
    // otherwise create a default query
    } else {
      query = dataset.query || privates._defaultQuery(dataset);
      query.table = dataset.table;
      query = Es2sql.translate(query);
    }
    sql = cartodb.SQL({ user: dataset.user });
    sql.execute(query).done(function (data) {
      console.log('cdf0.6', data);
      var fields = _.keys(data.fields).map(function(val, i) {
        return {id: val};
      });
      console.log('cdbf1', fields, dataset);
      dfd.resolve({
        fields: fields,
        rows:  data.rows,
        useMemoryStore: false
      });
    });
    dataset.isFetch = true;
    return dfd.promise();
  };

  my.query = function (queryObj, dataset) {
    if (dataset.isFetch)  {
      console.log('isFetchg');
      dataset.isFetch = false;
      return;
    }
    if (dataset.url) {
      dataset.user = privates._parseDatasetUrl(dataset.url);
      dataset.table = privates._parseTableName(dataset.url);
    }
    console.log('cdbQ0', queryObj, dataset);
    var dfd = new Deferred();
    var sql = cartodb.SQL({ user: dataset.user });
    var query = queryObj || privates._defaultQuery(dataset);
    query.table = dataset.table;
    console.log('cdbQ1', query);
    sql.execute(Es2sql.translate(query)).done(function (data) {
      var fields = _.keys(data.fields).map(function(val, i) {
        return {id: val};
      });
      console.log('cdbQ3', data, fields);
      dfd.resolve({
        total: data.total_rows,
        hits: data.rows,
        fields: fields
      });
    });
    return dfd.promise();
  };

  privates._defaultQuery = function (dataset) {
    return {
      table: dataset.table,
      user: dataset.user,
      from: 0,
      size: 100
    }
  };

  privates._parseDatasetUrl = function (url) {
    var s = url.replace(/http(s*):\/\//g, '');
    s = s.split('.')[0];
    console.log('>>',s);
    return s;
  }

  privates._parseTableName = function (url) {
    var s = url.match(/q=(.*)/g);
    console.log(s);
    s[0].replace('q=','');
    var reg = /(FROM )([^\s]+)/g;
    var t = reg.exec(decodeURIComponent(url));
    console.log('t',t[2]);
    return t[2];
  }

})(recline.Backend.cartodb);
