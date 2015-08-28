$(document).ready(function(){

  controller.init();

});

var view = {

  buildGrid: function(){

    for(var i = 1; i <= 20*20; i++ ){
      $('<div class="cell" id = "'+ i +'"></div>').appendTo('.game-grid');
    }

  },

  placeHead: function() {
    $('#190').addClass('head');
  },

  updateScore: function(){
    $('#score').html(model.score);
  },


  keyListener: function() {
    $(document).keydown(function(e) {
      
    switch(e.which) {
        //if/elses inside cases disallow 180 degree turnarounds if //snake has body

        //right
        case 37:
          controller.hasGameStarted();
          if ( controller.vel[0] == 1 && controller.snakeDivs.length > 0){
            controller.vel = [1, 0];
          }
          else {
            controller.vel = [-1, 0];
          }
          break;

        //down
        case 38:
          controller.hasGameStarted();
          if ( controller.vel[1] == 1 && controller.snakeDivs.length > 0){
            controller.vel = [0, 1];
          }
          else{
            controller.vel = [0, -1];
          }
          break;

        //left
        case 39:
          controller.hasGameStarted();
          if ( controller.vel[0] == -1 && controller.snakeDivs.length > 0){
            controller.vel = [-1, 0];
          }
          else{
            controller.vel = [1, 0];
          }
        break;

        //up
        case 40:
          controller.hasGameStarted();
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
    
    //if no food on grid already create random grid coord
    if ($('.food').length === 0) {
      randomGridId = this.getRandomInt(1, 400);
      
      //creates new grid coord if food is placed on snake body
      while( randomGridId != controller.headPosition && controller.snakeDivs.indexOf(randomGridId) != -1){
        randomGridId = this.getRandomInt(1, 400);
      }
      //adds food to game grid
      $('#' + randomGridId).addClass('food');
    }

  },

  getRandomInt: function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
  }

};

var model = {
  score: 0
};

var controller = {

  //array of snake body parts
  snakeDivs: [],

  //current interval speed
  updateInterval: 400,

  //var for interval functions in order to reset later
  snakeInterval: 1,

  //sets gamestate to false until arrow key is pressed
  gameStart: false,

  //gets coord of div with class head
  headPosition: parseInt($('.head').attr("id")),

  //sets direction of snake
  vel: [0,0],

  init: function() {

    view.buildGrid();
    view.placeHead();

    //starts browser listener for arrow keypresses
    view.keyListener();
  },

  hasGameStarted: function(){
    if (!controller.gameStart) {
      controller.playGame();
      controller.gameStart = true;
      console.log("startgin");
    }
  },

  playGame: function() {
    controller.snakeInterval = setInterval(function(){ controller.updatePosition();}, controller.updateInterval);

  },

  checkOutOfBounds: function(nextHeadPosition) {
    // Out of bounds if true

    switch(controller.vel.join()) {
      case "1,0":
        return (nextHeadPosition % 20 === 1 || isNaN(nextHeadPosition));
        break;

      case "-1,0":
        return (nextHeadPosition % 20 === 0 || isNaN(nextHeadPosition));
        break;

      default:
        return isNaN(nextHeadPosition);
    }

  },

  //if next head position is not included in snakebody array
  // or if next head position is not a boundary 
  //game is not over
  checkIfGameOver: function(nextHeadPosition) {

    if (controller.snakeDivs.indexOf(nextHeadPosition) === -1 && !controller.checkOutOfBounds(nextHeadPosition)) {
      return false;
    }
    else {
      return true;
    }
  },

  resetGame: function(){
    
    clearInterval(controller.snakeInterval);
    controller.updateInterval = 400;

    //sets gamestate to false so player can start with keypress
    controller.gameStart = false;
    
    //removes all snake body parts from game grid and game
    $('div').removeClass('snake-body');
    controller.snakeDivs = [];

    //resets snake head to middle
    view.placeHead();
    
    //resets score to zero
    model.score = 0;
    view.updateScore();
  },

  updatePosition: function() {

    // Get position of head
    // headPosition = parseInt($('.head').attr("id"));
    controller.headPosition = parseInt($('.head').attr("id"));

    // Add old head position to front of snakeDivs
    controller.snakeDivs.unshift(controller.headPosition);

    // Switch old head to snake body
    $('.head').addClass('snake-body').removeClass('head');

    // Update head position depending on last direction
    nextHeadPosition = controller.headPosition;
    nextHeadPosition += controller.vel[0];
    nextHeadPosition += (controller.vel[1] * 20);

    //checks if snake hits self or boundary
    if (controller.checkIfGameOver(nextHeadPosition)) {
      lastScore = model.score;
      
      controller.resetGame();

      alert("Game Over with score " + lastScore);
    }
    else {

      //moves head to the next position
      $('#' + nextHeadPosition).addClass('head');

      // Remove tail from snakeDivs to move snake forward
      tail = controller.snakeDivs.pop();
      $('#' + tail).removeClass('snake-body');

      // Check if position is snake food
      controller.eatSnakeFood();

      // Spawn snake food
      view.buildSnakeFood();

    }
  },

  resetInterval: function(){
    
    controller.updateInterval *= 0.95;

    clearInterval(controller.snakeInterval);
    
    controller.snakeInterval = setInterval( controller.updatePosition, controller.updateInterval);
  },


  eatSnakeFood: function() {

      //if head position is at same spot as food position
    if (controller.headPosition === parseInt($('.food').attr("id"))) {

      //updates snake body to be longer
      controller.snakeDivs.push($('food').attr('id'));

      //removes food from game grid
      $('.food').removeClass('food');

      //increases snake speed
      controller.resetInterval();

      //updates score in view
      model.score += 1;
      view.updateScore();
      }

    else {
      // return false;
    }

  }

};

