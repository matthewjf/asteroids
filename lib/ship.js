var util = require("./utils");
var mo = require("./movingObject");
var bullet = require('./bullet');

util.inherits(Ship, mo);


function Ship(argObj){
  mo.call(this, argObj);
  this.COLOR = '#ff69b4';
  this.RADIUS = 40;
  this.velocity = [0,0];
  //this.pos= [512, 360];
}

Ship.prototype.power = function (accel) {
  var x = this.velocity[0];
  var y = this.velocity[1];

  this.velocity = [x + accel[0], y + accel[1]];
};

Ship.prototype.fireBullet = function() {
  var bVel = [this.velocity[0] * 1.1, this.velocity[1] * 1.1];
  var b = new bullet({pos: this.pos, velocity: bVel});
  return b;
};

module.exports = Ship;
