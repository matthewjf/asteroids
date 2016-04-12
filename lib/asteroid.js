var util = require('./utils');
var mo = require('./movingObject');


function Asteroid(argObj){
  mo.call(this, argObj);
  this.COLOR = this.COLOR || "#999999";
  this.RADIUS = this.RADIUS || 15;
  this.velocity = util.randomVec(4);
}

util.inherits(Asteroid, mo);

module.exports = Asteroid;
