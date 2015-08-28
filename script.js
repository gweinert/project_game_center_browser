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
          if ( controller.vel[1] == 1&& controller.snakeDivs.length > 0){
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
    randomGridId = getRandomInt(1, 400);
    while( randomGridId != getRandomInt){
      randomGridId = getRandomInt(1, 400);
    }

  },

  // isSnakeDiv

  getRandomInt: function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
  }

};

var model = {};

var controller = {

  snakeDivs: [],

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
    setInterval(function(){ controller.updatePosition(); }, 500);
  },

  updatePosition: function() {

    // Get position of head
    // headPosition = parseInt($('.head').attr("id"));
    headPosition = controller.headPosition;

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