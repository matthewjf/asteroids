var asteroid = require('./asteroid');
var ship = require('./ship');

var Game = function() {
  this.DIM_X = 1024;
  this.DIM_Y = 720;
  this.NUM_ASTEROIDS = 10;
  this.asteroids = [];
  this.addAsteroids();
  this.ship = new ship({pos: [512, 360]});
  this.bullets = [];
};

Game.prototype.addAsteroids = function () {
  for (var i = 0; i < this.NUM_ASTEROIDS; i++) {
    this.asteroids.push(new asteroid({pos: this.randomPosition()}));
  }
};

Game.prototype.randomPosition = function () {
  var x = Math.random() * this.DIM_X;
  var y = Math.random() * this.DIM_Y;
  return [x,y];
};

Game.prototype.moveObjects = function (maxX, maxY) {
  this.allObjs().forEach(function (obj) {
    obj.move(maxX, maxY);
  });
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  this.allObjs().forEach(function (ast) {
    ast.draw(ctx);
  });
};

Game.prototype.allObjs = function(){
  return [this.ship].concat(this.asteroids).concat(this.bullets);
};

Game.prototype.checkCollisions = function(){

  var game = this;
  var result = [];
  for (var i1 = 0; i1 < game.asteroids.length -1; i1++){
    for (var i2 = i1 +1; i2 < game.asteroids.length; i2++){
      if (game.asteroids[i1].isCollidedWith(game.asteroids[i2])){
        result.push(game.asteroids[i1]);
        result.push(game.asteroids[i2]);
      }
    }
  }

  result.forEach(function(el){
    var x = el.velocity[0];
    var y = el.velocity[1];
    el.velocity = [-x, -y];
  });
};

Game.prototype.fireBullet = function() {
  this.bullets.push(this.ship.fireBullet());
};


module.exports = Game;
