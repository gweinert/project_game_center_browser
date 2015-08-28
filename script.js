$(document).ready(function(){

  controller.init();

});

var view = {

  buildGrid: function(){

    for(var i = 1; i <= 20*20; i++ ){
      $('<div class="cell" id = "'+ i +'"></div>').appendTo('.game-grid')
    }

  },

  placeHead: function() {
    $('#190').addClass('head');
  },

  keyListener: function() {
    $(document).keydown(function(e) {
    switch(e.which) {
        case 37:
          controller.vel = [-1, 0];
          break;

        case 38:
          controller.vel = [0, -1]
          break;

        case 39:
          controller.vel = [1, 0]
        break;

        case 40:
          controller.vel = [0, 1]
        break;

        default: return; // exit this handler for other keys
    }
    console.log(controller.vel);
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

  }

}

var model = {}

var controller = {

  snakeDivs: [191, 192, 193],

  init: function() {
    view.buildGrid();
    view.placeHead();
    view.keyListener();
    this.playGame();
  },

  vel: [0,0],

  playGame: function() {
    console.log('play ball!');
    setInterval(function(){ controller.updatePosition(); }, 500);
  },

  updatePosition: function() {

    // Get position of head
    headPosition = parseInt($('.head').attr("id"));

    // Add old head position to front of snakeDivs
    controller.snakeDivs.unshift(headPosition);

    // Switch old head to snake body
    $('.head').addClass('snake-body').removeClass('head');

    // Update head position
    headPosition += controller.vel[0];
    headPosition += (controller.vel[1] * 20);
    $('#' + headPosition).addClass('head');

    // Remove tail from snakeDivs
    tail = controller.snakeDivs.pop();
    $('#' + tail).removeClass('snake-body');

    console.log("update!");
  }

}


// Create head at center of grid
// Game begins on keypress
// Head moves in last direction of keypress every nth time
// If cell is food
//  Increase snake length
// If cell is snake
//  Game over
// If cell is wall
//  Game over