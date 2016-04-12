function MovingObject(argObj){
  this.pos = argObj['pos'];
  this.velocity = argObj['velocity'];
  this.RADIUS = argObj['radius'];
  this.COLOR = argObj['color'];
}

MovingObject.prototype.draw = function(ctx){
  ctx.fillStyle = this.COLOR;
  ctx.beginPath();

  ctx.arc(
    this.pos[0],
    this.pos[1],
    this.RADIUS,
    0,
    2 * Math.PI,
    false
  );

  ctx.fill();
};

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

MovingObject.prototype.move = function(maxX, maxY){
  var dx = this.velocity[0];
  var dy = this.velocity[1];
  this.pos[0] = ((this.pos[0] + dx).mod(maxX));
  this.pos[1] = ((this.pos[1] + dy).mod(maxY));
};

MovingObject.prototype.isCollidedWith = function (otherObject) {
  if (this.distance(otherObject) < this.RADIUS + otherObject.RADIUS)
    return true;
  else {
    return false;
  }
};

MovingObject.prototype.distance = function (otherObject) {
  var x1 = this.pos[0];
  var x2 = otherObject.pos[0];
  var y1 = this.pos[1];
  var y2 = otherObject.pos[1];
  return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2),2));
};

module.exports = MovingObject;
