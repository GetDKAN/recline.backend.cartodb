;(function($) {
  'use strict';

  $(document).on('ready', function(){

    var remoteDataset = new recline.Model.Dataset({
      backend: 'cartodb',
      user: 'dkan-admin',
      table: 'dummy',
    });
    remoteDataset
    .fetch()
    .done(function(data){
      console.log(data);
    });

  });
})(jQuery);
