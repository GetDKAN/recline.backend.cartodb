'use strict';
import * as $ from './../lib/jquery-1.12.0.min.js';
import Es2Sql from 'es2sql';

const backend = {
  __type__: 'cartodb',
  fetch: (dataset) => {
    const query = dataset.query || {};
    query.table = dataset.table;
    const data ={ q: Es2Sql.translate(query) };
    const url = '//' + dataset.user + '.cartodb.com/api/v2/sql';
    $.get(url, data)
      .success((res) => {
        console.log('success', res);
      })
      .error((a,b,c) => {
        console.log('err',a,b,c);
      });
  }
};

export {backend as Backend};
