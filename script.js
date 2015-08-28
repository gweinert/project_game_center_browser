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
        //if/elses disallow 180 degree turnarounds

        //right
        case 37:
          if ( controller.vel[0] == 1 && controller.snakeDivs.length > 0){
            controller.vel = [1, 0];
          }
          else {
            controller.vel = [-1, 0];
          }
          break;

        //down
        case 38:
          if ( controller.vel[1] == 1 && controller.snakeDivs.length > 0){
            controller.vel = [0, 1];
          }
          else{
            controller.vel = [0, -1];
          }
          break;

        //left
        case 39:
          if ( controller.vel[0] == -1 && controller.snakeDivs.length > 0){
            controller.vel = [-1, 0];
          }
          else{
            controller.vel = [1, 0];
          }
        break;

        //up
        case 40:
          if ( controller.vel[1] == -1 && controller.snakeDivs.length > 0){
            controller.vel = [0, -1];
          }
          else{
            controller.vel = [0, 1];
          }
        break;

        default: return; // exit this handler for other keys
    }
    console.log(controller.vel);
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

  },

  buildSnakeFood: function(){
    if ($('.food').length === 0) {
      randomGridId = this.getRandomInt(1, 400);
      while( randomGridId != controller.headPosition && controller.snakeDivs.indexOf(randomGridId) != -1){
        randomGridId = this.getRandomInt(1, 400);
      };
      $('#' + randomGridId).addClass('food')
    };

  },

  // isSnakeDiv

  getRandomInt: function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
  }

};

var model = {};

var controller = {

  snakeDivs: [],
  updateInterval: 5000,
  snakeInterval: setInterval(function(){ controller.updatePosition(); }, this.updateInterval),

  headPosition: parseInt($('.head').attr("id")),

  init: function() {
    view.buildGrid();
    view.placeHead();
    view.keyListener();
    this.playGame();
  },

  vel: [0,0],

  playGame: function() {
    console.log('play ball!');
    this.snakeInterval;

  },

  updatePosition: function() {

    // Get position of head
    // headPosition = parseInt($('.head').attr("id"));
    controller.headPosition = parseInt($('.head').attr("id"));

    // Add old head position to front of snakeDivs
    controller.snakeDivs.unshift(controller.headPosition);

    // Switch old head to snake body
    $('.head').addClass('snake-body').removeClass('head');

    // Update head position
    controller.headPosition += controller.vel[0];
    controller.headPosition += (controller.vel[1] * 20);
    $('#' + controller.headPosition).addClass('head');

    // Remove tail from snakeDivs
    tail = controller.snakeDivs.pop();
    $('#' + tail).removeClass('snake-body');

    // Check if position is snake food
    this.eatSnakeFood();

    // Spawn snake food
    view.buildSnakeFood();
  },

  eatSnakeFood: function() {
    if (controller.headPosition === parseInt($('.food').attr("id"))) {
      controller.snakeDivs.push($('food').attr('id'))
      $('.food').removeClass('food')
      this.updateInterval *= 0.95;
      clearInterval(snakeInterval);
      snakeInterval;
    };
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