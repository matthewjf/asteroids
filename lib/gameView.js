var game = require('./game');
var key = require('./keymaster');

var GameView = function() {
  this.game = new game();
};

GameView.prototype.start = function (canvasEl) {
  var ctx = canvasEl.getContext("2d");
  this.bindKeyHandlers();

  var animateCallback = function(){
    this.game.moveObjects(this.game.DIM_X, this.game.DIM_Y);
    this.game.checkCollisions();

    this.game.draw(ctx);
    requestAnimationFrame(animateCallback);
  }.bind(this);

  animateCallback();
};

GameView.prototype.bindKeyHandlers = function () {
  var gv = this;
  key('a', function(){ gv.game.ship.power([-1,0]);});
  key('s', function(){ gv.game.ship.power([0,1]);});
  key('w', function(){ gv.game.ship.power([0,-1]);});
  key('d', function(){ gv.game.ship.power([1,0]);});
  key('e', function(){ gv.game.fireBullet();});
};

module.exports = GameView;
