function Util(){}

Util.inherits = function (childClass, parentClass) {
  function Surrogate() {}
  Surrogate.prototype = parentClass.prototype;
  childClass.prototype = new Surrogate();
  childClass.prototype.constructor = childClass;
};

Util.randomVec = function(length){
  var x = (2*Math.random() -1) * length;

  var oper = (2 * Math.random() -1);
  oper = oper / Math.abs(oper);

  var y = oper*(Math.sqrt(Math.pow(length, 2) - Math.pow(x, 2)));

  return [x, y];
};

module.exports = Util;
