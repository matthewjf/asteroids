var util = require("./utils");
var mo = require("./movingObject");

util.inherits(Bullet, mo);


function Bullet(argObj){
  mo.call(this, argObj);
  this.COLOR = '#ffffff';
  this.RADIUS = 4;
}

module.exports = Bullet;
