;(function($) {
  'use strict';

  $(document).on('ready', function(){

    var remoteDataset = new recline.Model.Dataset({
      backend: 'cartodb'
    });
    remoteDataset
    .fetch()
    .done(function(data){
      console.log(data);
    });

  });
})(jQuery);
