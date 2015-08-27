$(document).ready(function(){

  view.init();

});

var view = {

  init: function() {
    this.buildGrid();
  },

  buildGrid: function(){

    for(var i = 0; i < 20*20; i++ ){
      $('<div class="cell" id = "'+ i +'"></div>').appendTo('.game-grid');
    }
    
  }
};