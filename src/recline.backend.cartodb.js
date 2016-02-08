"use strict";
import * as Es2Sql from './es2sql.js';
import * as $ from '../vendor/jquery/dist/jquery.min.js';

module.exports = {
  __type__ : "cartodb",
  
  fetch : function (dataset) {
    console.log(dataset);
    var dfd = new $.Deferred();
    if (dataset.file) {
      // get it
    } else if (dataset.url) {
      $.get(dataset.url).done(function (data) {
        console.log(data);
        // normalize here
        dfd.resolve(data);
      });
    }
  },

  query : function  (q, dataset) {
    console.log('Query:', q, dataset, Es2Sql);
  }
};
