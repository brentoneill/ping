var s = Snap("#gameCanvas");



///////////////////////////////////////
//Game object
///////////////////////////////////////
function game(ball, paddle1, paddle2){
  this.timer  = 5000;
  this.gameOn = true;
  this.timeRemaining = this.timer;

  //Display the time remaining
  $('p.time').text(this.timeRemaining);

  //Used to restart the game
  this.restartGame = function(){
    alert('click ok to restart the game')
    this.timeRemaining = this.timer;
    ball.dropBall();
    paddle1.score = 0;
    paddle2.score = 0;
    paddle1.initScore();
    paddle2.initScore();
  }

  //Counts down the time, runs gameOver() if time runs out
  this.subtractTime = function(){
    this.timeRemaining--;
    $('p.time').text(this.timeRemaining);
    if(this.timeRemaining <= 0 ){
      this.gameOver(paddle1, paddle2);
    }
  }

  //Alerts the player who wins then restarts the game
  this.gameOver = function(paddle1, paddle2){
    if(paddle1.score > paddle2.score){
      alert("player 1 wins!");
    }
    else if(paddle2.score > paddle1.score){
      alert('player 2 wins!');
    }
    else{
      alert('oh no! you tied!')
    }
    this.restartGame();
  }
}
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////






///////////////////////////////////////
//BALL
///////////////////////////////////////
function ball(spec){
  this.radius   = 10;
  this.xDir     = (Math.random() < 0.5 ? -1 : 1);
  this.yDir     = (Math.random() < 0.5 ? -1 : 1);
  this.speed    = 3;
  this.inertia  = .1;

  this.positionX = 500;
  this.positionY = 300;

  var ball = s.circle(40, 40, this.radius);
  ball.attr({
    fill: "#A1F235",
    cx: this.positionX,
    cy: this.positionY
  });

  //Drops the ball in the center of the court after score/game restart
  this.dropBall = function(){
    console.log('ball dropped');
    this.positionX = 500;
    this.positionY = 300;
    ball.attr({
      cx: this.positionX,
      cy: this.positionY
    });
    this.speed = 3;
    this.xDir = (Math.random() < 0.5 ? -1 : 1);
    this.yDir = (Math.random() < 0.5 ? -1 : 1);
  }

  //Handles collision with the paddle
  this.paddleCollide = function(paddle1, paddle2) {
    //RIGHT SIDE
    if((this.positionX + this.radius) >= paddle2.positionX) {
      //Now check if it hit between paddle
      if((this.positionY >= paddle2.positionY) && (this.positionY <= paddle2.positionY + paddle2.height)){
        this.xDir = -(this.xDir);
        this.speed += .4;
      }
    }
    //LEFT SIDE
    if((this.positionX - this.radius) <= paddle1.positionX + paddle2.width) {
      //Now check if it hit between paddle
      if((this.positionY >= paddle1.positionY) && (this.positionY <= paddle1.positionY + paddle1.height)){
        this.xDir = -(this.xDir);
        this.speed += .4;
      }
    }
  }


  this.move = function(paddle1, paddle2){
    //Handles Scoring
    ////Player 2 scoring
    if(this.positionX <= 0 + this.radius){
      paddle2.addScore();
      this.dropBall();
    }
    ////Player 1 scoring
    if(this.positionX + this.radius >= 1000){
      paddle1.addScore();
      this.dropBall();
    }

    //Keeps ball w/in canvas
    /////////////////////////
    if((this.positionY <= 0 + this.radius) || (this.positionY + this.radius >= 600)) {
      this.yDir = -this.yDir; //reverse direction
    }

    //Checks for paddle collision
    this.paddleCollide(paddle1, paddle2);

    //Sets ball positions
    /////////////////////////
    this.positionX += (this.xDir * this.speed);
    this.positionY += (this.yDir * this.speed);
    //Moves the ball on the screen
    ball.attr({
      cx: this.positionX,
      cy: this.positionY
    });
  }
}
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////






///////////////////////////////////////
//PADDLE
///////////////////////////////////////
function paddle(playerName){
  this.pname = playerName;
  if(playerName ==="Player 2") {
    this.positionX = 950;
  }
  else {
    this.positionX = 30;
  }
  this.positionY  = 250;
  this.height     = 100;
  this.width      = 20;
  this.color      = "black";
  this.speed      = 10;
  this.inertia    = .8;
  this.score      = 0;


  var paddle = s.rect(this.positionX, this.positionY, this.width, this.height) ;
  paddle.attr({
    fill: this.color,
    class: this.pname
  });

  //Initalize the score in the DOM. Called at page load and gameRestart
  this.initScore = function(){
    console.log('score init');
    var domClass = "";
    if(this.pname == "Player 1") {
      domClass = "h3.p1";
    }
    else if(this.pname == "Player 2"){
      domClass = "h3.p2"
    }
    $(domClass).text(this.score);
    $(domClass).css("transform", "scale(1)");
  }

  //Adds the score to the correct player and updates the DOM
  this.addScore = function(){
    this.score++;
    if(this.pname == "Player 1") {
      domClass = "h3.p1";
    }
    else if(this.pname == "Player 2"){
      domClass = "h3.p2"
    }
    $(domClass).text(this.score);
    var scale = this.score/2 + 1;
    $(domClass).css("transform", "scale("+scale+")");
  }

  //Handles the movement of the paddle
  this.move = function(dir){
    var lastDirect = "";

    //UP movement
    if(dir==="up"){
      // if(lastDirect == "down"){
      //   this.inertia = .5;
      // }
      if(this.positionY <= 0) {
        this.positionY = 0;
        this.inertia = .5;
      }
      else{
        this.positionY -= (10*this.inertia);
        this.inertia += .1;
      }
      paddle.attr({
        y: this.positionY
      });
      lastDirect = "up";
    }

    //DOWN movement
    else if(dir=="down"){
      // if(lastDirect == "up"){
      //   this.inertia = .5;
      // }
      if(this.positionY + this.height >= 600) {
        this.positionY = 600 - this.height;
        this.inertia = .5;
      }
      else{
        this.positionY += (10*this.inertia);
        this.inertia += .1;
      }
      paddle.attr({
        y: this.positionY
      });
      lastDirect = "down";
    }
  }
}
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////




///////////////////////////////////////
///////////////////////////////////////
//pIng Game initialization
///////////////////////////////////////
///////////////////////////////////////
var pong = {
  init:function(){
    pong.initStyling();
    pong.initEvents();
  },
  initStyling:function(){
    //Draws out paddle and ball
    pong.paddle1 = new paddle("Player 1");
    pong.paddle2 = new paddle("Player 2");
    pong.ball = new ball();
    pong.game = new game(pong.ball, pong.paddle1, pong.paddle2);
    pong.paddle1.initScore();
    pong.paddle2.initScore();
  },
  initEvents:function(){
    //Handles events for moving paddle
    $(document).keydown(function(e){
      if(e.keyCode==40){
        e.preventDefault();
        pong.paddle2.move("down", pong.paddle2.name);
      }
      else if(e.keyCode==38){
        e.preventDefault();
        pong.paddle2.move("up", pong.paddle2.name);
      }
      else if(e.keyCode==83){
        e.preventDefault();
        pong.paddle1.move("down", pong.paddle1.name)
      }
      else if(e.keyCode==87){
        e.preventDefault();
        pong.paddle1.move("up", pong.paddle1.name)
      }
    });

    //RUn the game 'LOOP'
    setInterval(function(){
      pong.ball.move(pong.paddle1, pong.paddle2);
      pong.game.subtractTime(pong.paddle1, pong.paddle2);
      }, 16);

  }
}
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////



$(document).ready(function (){
  pong.init();
});
