/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var gv = __webpack_require__(1);
	var canvasEl = document.getElementsByTagName("canvas")[0];
	new gv().start(canvasEl);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var game = __webpack_require__(2);
	var key = __webpack_require__(7);

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var asteroid = __webpack_require__(3);
	var ship = __webpack_require__(6);

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(4);
	var mo = __webpack_require__(5);


	function Asteroid(argObj){
	  mo.call(this, argObj);
	  this.COLOR = this.COLOR || "#999999";
	  this.RADIUS = this.RADIUS || 15;
	  this.velocity = util.randomVec(4);
	}

	util.inherits(Asteroid, mo);

	module.exports = Asteroid;


/***/ },
/* 4 */
/***/ function(module, exports) {

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


/***/ },
/* 5 */
/***/ function(module, exports) {

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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(4);
	var mo = __webpack_require__(5);
	var bullet = __webpack_require__(8);

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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	//     keymaster.js
	//     (c) 2011-2013 Thomas Fuchs
	//     keymaster.js may be freely distributed under the MIT license.

	;(function(global){
	  var k,
	    _handlers = {},
	    _mods = { 16: false, 18: false, 17: false, 91: false },
	    _scope = 'all',
	    // modifier keys
	    _MODIFIERS = {
	      '⇧': 16, shift: 16,
	      '⌥': 18, alt: 18, option: 18,
	      '⌃': 17, ctrl: 17, control: 17,
	      '⌘': 91, command: 91
	    },
	    // special keys
	    _MAP = {
	      backspace: 8, tab: 9, clear: 12,
	      enter: 13, 'return': 13,
	      esc: 27, escape: 27, space: 32,
	      left: 37, up: 38,
	      right: 39, down: 40,
	      del: 46, 'delete': 46,
	      home: 36, end: 35,
	      pageup: 33, pagedown: 34,
	      ',': 188, '.': 190, '/': 191,
	      '`': 192, '-': 189, '=': 187,
	      ';': 186, '\'': 222,
	      '[': 219, ']': 221, '\\': 220
	    },
	    code = function(x){
	      return _MAP[x] || x.toUpperCase().charCodeAt(0);
	    },
	    _downKeys = [];

	  for(k=1;k<20;k++) _MAP['f'+k] = 111+k;

	  // IE doesn't support Array#indexOf, so have a simple replacement
	  function index(array, item){
	    var i = array.length;
	    while(i--) if(array[i]===item) return i;
	    return -1;
	  }

	  // for comparing mods before unassignment
	  function compareArray(a1, a2) {
	    if (a1.length != a2.length) return false;
	    for (var i = 0; i < a1.length; i++) {
	        if (a1[i] !== a2[i]) return false;
	    }
	    return true;
	  }

	  var modifierMap = {
	      16:'shiftKey',
	      18:'altKey',
	      17:'ctrlKey',
	      91:'metaKey'
	  };
	  function updateModifierKey(event) {
	      for(k in _mods) _mods[k] = event[modifierMap[k]];
	  };

	  // handle keydown event
	  function dispatch(event) {
	    var key, handler, k, i, modifiersMatch, scope;
	    key = event.keyCode;

	    if (index(_downKeys, key) == -1) {
	        _downKeys.push(key);
	    }

	    // if a modifier key, set the key.<modifierkeyname> property to true and return
	    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
	    if(key in _mods) {
	      _mods[key] = true;
	      // 'assignKey' from inside this closure is exported to window.key
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
	      return;
	    }
	    updateModifierKey(event);

	    // see if we need to ignore the keypress (filter() can can be overridden)
	    // by default ignore key presses if a select, textarea, or input is focused
	    if(!assignKey.filter.call(this, event)) return;

	    // abort if no potentially matching shortcuts found
	    if (!(key in _handlers)) return;

	    scope = getScope();

	    // for each potential shortcut
	    for (i = 0; i < _handlers[key].length; i++) {
	      handler = _handlers[key][i];

	      // see if it's in the current scope
	      if(handler.scope == scope || handler.scope == 'all'){
	        // check if modifiers match if any
	        modifiersMatch = handler.mods.length > 0;
	        for(k in _mods)
	          if((!_mods[k] && index(handler.mods, +k) > -1) ||
	            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
	        // call the handler and stop the event if neccessary
	        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
	          if(handler.method(event, handler)===false){
	            if(event.preventDefault) event.preventDefault();
	              else event.returnValue = false;
	            if(event.stopPropagation) event.stopPropagation();
	            if(event.cancelBubble) event.cancelBubble = true;
	          }
	        }
	      }
	    }
	  };

	  // unset modifier keys on keyup
	  function clearModifier(event){
	    var key = event.keyCode, k,
	        i = index(_downKeys, key);

	    // remove key from _downKeys
	    if (i >= 0) {
	        _downKeys.splice(i, 1);
	    }

	    if(key == 93 || key == 224) key = 91;
	    if(key in _mods) {
	      _mods[key] = false;
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
	    }
	  };

	  function resetModifiers() {
	    for(k in _mods) _mods[k] = false;
	    for(k in _MODIFIERS) assignKey[k] = false;
	  };

	  // parse and assign shortcut
	  function assignKey(key, scope, method){
	    var keys, mods;
	    keys = getKeys(key);
	    if (method === undefined) {
	      method = scope;
	      scope = 'all';
	    }

	    // for each shortcut
	    for (var i = 0; i < keys.length; i++) {
	      // set modifier keys if any
	      mods = [];
	      key = keys[i].split('+');
	      if (key.length > 1){
	        mods = getMods(key);
	        key = [key[key.length-1]];
	      }
	      // convert to keycode and...
	      key = key[0]
	      key = code(key);
	      // ...store handler
	      if (!(key in _handlers)) _handlers[key] = [];
	      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
	    }
	  };

	  // unbind all handlers for given key in current scope
	  function unbindKey(key, scope) {
	    var multipleKeys, keys,
	      mods = [],
	      i, j, obj;

	    multipleKeys = getKeys(key);

	    for (j = 0; j < multipleKeys.length; j++) {
	      keys = multipleKeys[j].split('+');

	      if (keys.length > 1) {
	        mods = getMods(keys);
	      }

	      key = keys[keys.length - 1];
	      key = code(key);

	      if (scope === undefined) {
	        scope = getScope();
	      }
	      if (!_handlers[key]) {
	        return;
	      }
	      for (i = 0; i < _handlers[key].length; i++) {
	        obj = _handlers[key][i];
	        // only clear handlers if correct scope and mods match
	        if (obj.scope === scope && compareArray(obj.mods, mods)) {
	          _handlers[key][i] = {};
	        }
	      }
	    }
	  };

	  // Returns true if the key with code 'keyCode' is currently down
	  // Converts strings into key codes.
	  function isPressed(keyCode) {
	      if (typeof(keyCode)=='string') {
	        keyCode = code(keyCode);
	      }
	      return index(_downKeys, keyCode) != -1;
	  }

	  function getPressedKeyCodes() {
	      return _downKeys.slice(0);
	  }

	  function filter(event){
	    var tagName = (event.target || event.srcElement).tagName;
	    // ignore keypressed in any elements that support keyboard data input
	    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
	  }

	  // initialize key.<modifier> to false
	  for(k in _MODIFIERS) assignKey[k] = false;

	  // set current scope (default 'all')
	  function setScope(scope){ _scope = scope || 'all' };
	  function getScope(){ return _scope || 'all' };

	  // delete all handlers for a given scope
	  function deleteScope(scope){
	    var key, handlers, i;

	    for (key in _handlers) {
	      handlers = _handlers[key];
	      for (i = 0; i < handlers.length; ) {
	        if (handlers[i].scope === scope) handlers.splice(i, 1);
	        else i++;
	      }
	    }
	  };

	  // abstract key logic for assign and unassign
	  function getKeys(key) {
	    var keys;
	    key = key.replace(/\s/g, '');
	    keys = key.split(',');
	    if ((keys[keys.length - 1]) == '') {
	      keys[keys.length - 2] += ',';
	    }
	    return keys;
	  }

	  // abstract mods logic for assign and unassign
	  function getMods(key) {
	    var mods = key.slice(0, key.length - 1);
	    for (var mi = 0; mi < mods.length; mi++)
	    mods[mi] = _MODIFIERS[mods[mi]];
	    return mods;
	  }

	  // cross-browser events
	  function addEvent(object, event, method) {
	    if (object.addEventListener)
	      object.addEventListener(event, method, false);
	    else if(object.attachEvent)
	      object.attachEvent('on'+event, function(){ method(window.event) });
	  };

	  // set the handlers globally on document
	  addEvent(document, 'keydown', function(event) { dispatch(event) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
	  addEvent(document, 'keyup', clearModifier);

	  // reset modifiers to false whenever the window is (re)focused.
	  addEvent(window, 'focus', resetModifiers);

	  // store previously defined key
	  var previousKey = global.key;

	  // restore previously defined key and return reference to our key object
	  function noConflict() {
	    var k = global.key;
	    global.key = previousKey;
	    return k;
	  }

	  // set window.key and window.key.set/get/deleteScope, and the default filter
	  global.key = assignKey;
	  global.key.setScope = setScope;
	  global.key.getScope = getScope;
	  global.key.deleteScope = deleteScope;
	  global.key.filter = filter;
	  global.key.isPressed = isPressed;
	  global.key.getPressedKeyCodes = getPressedKeyCodes;
	  global.key.noConflict = noConflict;
	  global.key.unbind = unbindKey;

	  if(true) module.exports = assignKey;

	})(this);


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(4);
	var mo = __webpack_require__(5);

	util.inherits(Bullet, mo);


	function Bullet(argObj){
	  mo.call(this, argObj);
	  this.COLOR = '#ffffff';
	  this.RADIUS = 4;
	}

	module.exports = Bullet;


/***/ }
/******/ ]);