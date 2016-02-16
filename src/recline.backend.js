'use strict';
import * as jQuery from './../lib/jquery-1.12.0.min.js';
import * as Es2Sql from './modules/es2sql.js';

module.exports = {
  __type__: 'cartodb',
  
  query: () => {
    return 'query';  
  },
  
  fetch: (dataset) => {
    const url = dataset.url;
    const q = dataset.query || {};
    q.table = dataset.table;
    const mappedQ = _mapQuery(mappedQ);
    console.log('fetch 1', mappedQ);
    const uriQ = encodeURIComponent(mappedQ);
    const data = {q: uriQ};
    if (dataset.apiKey) data.api_key=dataset.apiKey;
    $.get(url, data)
      .success((data) => { console.log('success!!', data); return data });
      .error((a,b,c) => console.log('ERROR fetching data', a, b, c));
  },

  _mapQuery: (q) => {
    const mappedQ = Es2Sql.translate(q);
    console.log('_mapQ', mappedQ);
    return mappedQ;
  },

  defaultQuery: {}

  // Export libraries for unit testing
  es2Sql: Es2Sql,
  $ : jQuery
};
