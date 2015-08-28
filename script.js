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
          if (!controller.gameStart) {
              controller.playGame();
              controller.gameStart = true;
            };
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
      }
      $('#' + randomGridId).addClass('food');
    }

  },

  // isSnakeDiv

  getRandomInt: function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
  }

};

var model = {
  score: 0
};

var controller = {

  snakeDivs: [],
  updateInterval: 500,
  snakeInterval: 1,
  gameStart: false,

  // snakeInterval: setInterval(function(){ controller.updatePosition(); }, this.updateInterval),
  // snakeInterval: setInterval(function(){ this.updatePosition();}, controller.updateInterval),

  headPosition: parseInt($('.head').attr("id")),

  init: function() {
    view.buildGrid();
    view.placeHead();
    view.keyListener();
  },

  vel: [0,0],

  playGame: function() {
    controller.snakeInterval = setInterval(function(){ controller.updatePosition();}, controller.updateInterval);

    console.log(this.updateInterval);

  },

  checkOutOfBounds: function(nextHeadPosition) {
    // Out of bounds if true

    switch(controller.vel.join()) {
      case "1,0":
        console.log("MOVING RIGHT");
        return (nextHeadPosition % 20 === 1 || isNaN(nextHeadPosition));
        break;

      case "-1,0":
        return (nextHeadPosition % 20 === 0 || isNaN(nextHeadPosition));
        break;

      // case "0,1":
      //   return isNaN(nextHeadPosition);
      //   break;

      // case "0,-1":
      //   return isNaN(nextHeadPosition);
      //   break;

      default:
        return isNaN(nextHeadPosition);
    }

  },

  checkIfGameOver: function(nextHeadPosition) {
    if (controller.snakeDivs.indexOf(nextHeadPosition) === -1 && !controller.checkOutOfBounds(nextHeadPosition)) {
      return false;
    }
    else {
      return true;
    }
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
    nextHeadPosition = controller.headPosition
    nextHeadPosition += controller.vel[0];
    nextHeadPosition += (controller.vel[1] * 20);

    if (controller.checkIfGameOver(nextHeadPosition)) {
      clearInterval(controller.snakeInterval);
      alert("Game Over");
    }
    else {
      $('#' + nextHeadPosition).addClass('head');
      // Remove tail from snakeDivs
      tail = controller.snakeDivs.pop();
      $('#' + tail).removeClass('snake-body');

      // Check if position is snake food
      controller.eatSnakeFood();

      // Spawn snake food
      view.buildSnakeFood();
      console.log(nextHeadPosition);
    }
  },

  eatSnakeFood: function() {
    if (controller.headPosition === parseInt($('.food').attr("id"))) {
      controller.snakeDivs.push($('food').attr('id'));
      model.score += 1;
      $('.food').removeClass('food');
      this.updateInterval *= 0.85;
      clearInterval(controller.snakeInterval);
      controller.snakeInterval = setInterval( controller.updatePosition, controller.updateInterval);
      }
    else {
      return false;
    }
      // clearInterval(controller.snakeInterval);
      // controller.snakeInterval = setInterval( controller.updatePosition, controller.updateInterval);
      // console.log(snakeInterval);
      // console.log(this.updateInterval);
  }

};


// Create head at center of grid
// Game begins on keypress
// Head moves in last direction of keypress every nth time
// If cell is food
//  Increase snake length
// If cell is snake
//  Game over
// If cell is wall
//  Game over