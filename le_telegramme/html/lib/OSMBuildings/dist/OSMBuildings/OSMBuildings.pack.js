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

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(global) {
	var document = global.document;

	function clamp(value, min, max) {
	  return Math.min(max, Math.max(value, min));
	}

	var Basemap = function(container, options) {
	  this.container = typeof container === 'string' ? document.getElementById(container) : container;
	  options = options || {};

	  this.container.classList.add('osmb-container');
	  this.width = this.container.offsetWidth;
	  this.height = this.container.offsetHeight;

	  this.minZoom = parseFloat(options.minZoom) || 10;
	  this.maxZoom = parseFloat(options.maxZoom) || 20;

	  if (this.maxZoom < this.minZoom) {
	    this.maxZoom = this.minZoom;
	  }

	  this.bounds = options.bounds;

	  this.position = {};
	  this.zoom = 0;

	  this.listeners = {};

	  this.initState(options);

	  if (options.state) {
	    this.persistState();
	    this.on('change', function() {
	      this.persistState();
	    }.bind(this));
	  }

	  this.pointer = new Pointer(this, this.container);
	  this.layers  = new Layers(this);

	  if (options.disabled) {
	    this.setDisabled(true);
	  }

	  this.attribution = options.attribution;
	  this.attributionDiv = document.createElement('DIV');
	  this.attributionDiv.className = 'osmb-attribution';
	  this.container.appendChild(this.attributionDiv);
	  this.updateAttribution();
	};

	Basemap.TILE_SIZE = 256;

	Basemap.prototype = {

	  updateAttribution: function() {
	    var attribution = this.layers.getAttribution();
	    if (this.attribution) {
	      attribution.unshift(this.attribution);
	    }
	    this.attributionDiv.innerHTML = attribution.join(' · ');
	  },

	  initState: function(options) {
	    var
	      query = location.search,
	      state = {};
	    if (query) {
	      query.substring(1).replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function($0, $1, $2) {
	        if ($1) {
	          state[$1] = $2;
	        }
	      });
	    }

	    var position;
	    if (state.lat !== undefined && state.lon !== undefined) {
	      position = { latitude:parseFloat(state.lat), longitude:parseFloat(state.lon) };
	    }
	    if (!position && state.latitude !== undefined && state.longitude !== undefined) {
	      position = { latitude:state.latitude, longitude:state.longitude };
	    }

	    var zoom     = (state.zoom     !== undefined) ? state.zoom     : options.zoom;
	    var rotation = (state.rotation !== undefined) ? state.rotation : options.rotation;
	    var tilt     = (state.tilt     !== undefined) ? state.tilt     : options.tilt;
	    var bend     = (state.bend     !== undefined) ? state.bend     : options.bend;

	    this.setPosition(position || options.position || { latitude:52.520000, longitude:13.410000 });
	    this.setZoom(zoom || this.minZoom);
	    this.setRotation(rotation || 0);
	    this.setTilt(tilt || 0);
	    this.setBend(bend || 0);
	  },

	  persistState: function() {
	    if (!history.replaceState || this.stateDebounce) {
	      return;
	    }

	    this.stateDebounce = setTimeout(function() {
	      this.stateDebounce = null;
	      var params = [];
	      params.push('lat=' + this.position.latitude.toFixed(6));
	      params.push('lon=' + this.position.longitude.toFixed(6));
	      params.push('zoom=' + this.zoom.toFixed(1));
	      params.push('tilt=' + this.tilt.toFixed(1));
	      params.push('bend=' + this.bend.toFixed(1));
	      params.push('rotation=' + this.rotation.toFixed(1));
	      history.replaceState({}, '', '?'+ params.join('&'));
	    }.bind(this), 1000);
	  },

	  // TODO: switch to native events
	  emit: function(type, payload) {
	    if (!this.listeners[type]) {
	      return;
	    }

	    var listeners = this.listeners[type];

	    requestAnimationFrame(function() {
	      for (var i = 0, il = listeners.length; i < il; i++) {
	        listeners[i](payload);
	      }
	    });
	  },

	  //***************************************************************************

	  // TODO: switch to native events
	  on: function(type, fn) {
	    if (!this.listeners[type]) {
	      this.listeners[type] = [];
	    }
	    this.listeners[type].push(fn);
	    return this;
	  },

	  // TODO: switch to native events
	  off: function(type, fn) {
	    if (!this.listeners[type]) {
	      return;
	    }

	    this.listeners[type] = this.listeners[type].filter(function(listener) {
	      return (listener !== fn);
	    });
	  },

	  setDisabled: function(flag) {
	    this.pointer.disabled = !!flag;
	    return this;
	  },

	  isDisabled: function() {
	    return !!this.pointer.disabled;
	  },

	  getBounds: function() {
	    //FIXME: update method; the old code did only work for straight top-down
	    //       views, not for other cameras.
	    /*
	    var
	      W2 = this.width/2, H2 = this.height/2,
	      angle = this.rotation*Math.PI/180,
	      x = Math.cos(angle)*W2 - Math.sin(angle)*H2,
	      y = Math.sin(angle)*W2 + Math.cos(angle)*H2,
	      position = this.position,
	      worldSize = Basemap.TILE_SIZE*Math.pow(2, this.zoom),
	      nw = this.unproject(position.x - x, position.y - y, worldSize),
	      se = this.unproject(position.x + x, position.y + y, worldSize);
	    return {
	      n: nw.latitude,
	      w: nw.longitude,
	      s: se.latitude,
	      e: se.longitude
	    };*/
	    return null;
	  },

	  setZoom: function(zoom, e) {
	    zoom = clamp(parseFloat(zoom), this.minZoom, this.maxZoom);

	    if (this.zoom !== zoom) {
	      this.zoom = zoom;

	      /* if a screen position was given for which the geographic position displayed
	       * should not change under the zoom */
	      if (e) {  
	        //FIXME: add code; this needs to take the current camera (rotation and 
	        //       perspective) into account
	        //NOTE:  the old code (comment out below) only works for north-up 
	        //       non-perspective views
	        /*
	        var dx = this.container.offsetWidth/2  - e.clientX;
	        var dy = this.container.offsetHeight/2 - e.clientY;
	        this.center.x -= dx;
	        this.center.y -= dy;
	        this.center.x *= ratio;
	        this.center.y *= ratio;
	        this.center.x += dx;
	        this.center.y += dy;*/
	      }
	      this.emit('change');
	    }
	    return this;
	  },

	  getZoom: function() {
	    return this.zoom;
	  },

	  setPosition: function(pos) {
	    this.position = {
	      latitude:  clamp(parseFloat(pos.latitude), -90, 90),
	      longitude: clamp(parseFloat(pos.longitude), -180, 180)
	    };
	    this.emit('change');
	    return this;
	  },

	  getPosition: function() {
	    return this.position;
	  },

	  setSize: function(size) {
	    if (size.width !== this.width || size.height !== this.height) {
	      this.width = size.width;
	      this.height = size.height;
	      this.emit('resize');
	    }
	    return this;
	  },

	  getSize: function() {
	    return { width: this.width, height: this.height };
	  },

	  setRotation: function(rotation) {
	    rotation = parseFloat(rotation)%360;
	    if (this.rotation !== rotation) {
	      this.rotation = rotation;
	      this.emit('change');
	    }
	    return this;
	  },

	  getRotation: function() {
	    return this.rotation;
	  },

	  setTilt: function(tilt) {
	    tilt = clamp(parseFloat(tilt), 0, 60);
	    if (this.tilt !== tilt) {
	      this.tilt = tilt;
	      this.emit('change');
	    }
	    return this;
	  },

	  getTilt: function() {
	    return this.tilt;
	  },

	  setBend: function(bend) {
	    bend = clamp(parseFloat(bend), 0, 90);
	    if (this.bend !== bend) {
	      this.bend = bend;
	      this.emit('change');
	    }
	    return this;
	  },

	  getBend: function() {
	    return this.bend;
	  },

	  addLayer: function(layer) {
	    this.layers.add(layer);
	    this.updateAttribution();
	    return this;
	  },

	  removeLayer: function(layer) {
	    this.layers.remove(layer);
	    this.updateAttribution();
	  },

	  destroy: function() {
	    this.listeners = [];
	    this.pointer.destroy();
	    this.layers.destroy();
	    this.container.innerHTML = '';
	  }
	};

	//*****************************************************************************

	global.GLMap = Basemap;


	function cancelEvent(e) {
	  if (e.preventDefault) {
	    e.preventDefault();
	  }
	  if (e.stopPropagation) {
	    e.stopPropagation();
	  }
	  e.returnValue = false;
	}

	var Pointer = function(map, container) {
	  this.map = map;

	  if ('ontouchstart' in global) {
	    this._addListener(container, 'touchstart', this.onTouchStart);
	    this._addListener(document, 'touchmove', this.onTouchMove);
	    this._addListener(document, 'touchend', this.onTouchEnd);
	    this._addListener(container, 'gesturechange', this.onGestureChange);
	  } else {
	    this._addListener(container, 'mousedown', this.onMouseDown);
	    this._addListener(document, 'mousemove', this.onMouseMove);
	    this._addListener(document, 'mouseup', this.onMouseUp);
	    this._addListener(container, 'dblclick', this.onDoubleClick);
	    this._addListener(container, 'mousewheel', this.onMouseWheel);
	    this._addListener(container, 'DOMMouseScroll', this.onMouseWheel);
	  }

	  var resizeDebounce;
	  this._addListener(global, 'resize', function() {
	    if (resizeDebounce) {
	      return;
	    }
	    resizeDebounce = setTimeout(function() {
	      resizeDebounce = null;
	      map.setSize({ width:container.offsetWidth, height:container.offsetHeight });
	    }, 250);
	  });
	};

	Pointer.prototype = {

	  prevX: 0,
	  prevY: 0,
	  startX: 0,
	  startY: 0,
	  startZoom: 0,
	  prevRotation: 0,
	  prevTilt: 0,
	  disabled: false,
	  pointerIsDown: false,

	  _listeners: [],

	  _addListener: function(target, type, fn) {
	    var boundFn = fn.bind(this);
	    target.addEventListener(type, boundFn, false);
	    this._listeners.push({ target:target, type:type, fn:boundFn });
	  },

	  onDoubleClick: function(e) {
	    cancelEvent(e);
	    if (!this.disabled) {
	      this.map.setZoom(this.map.zoom + 1, e);
	    }
	    this.map.emit('doubleclick', { x: e.clientX, y: e.clientY });
	  },

	  onMouseDown: function(e) {
	    if (e.button > 1) {
	      return;
	    }

	    cancelEvent(e);

	    this.startZoom = this.map.zoom;
	    this.prevRotation = this.map.rotation;
	    this.prevTilt = this.map.tilt;

	    this.startX = this.prevX = e.clientX;
	    this.startY = this.prevY = e.clientY;

	    this.pointerIsDown = true;

	    this.map.emit('pointerdown', { x: e.clientX, y: e.clientY });
	  },

	  onMouseMove: function(e) {
	    if (this.pointerIsDown) {
	      if (e.button === 0 && !e.altKey) {
	        this.moveMap(e);
	      } else {
	        this.rotateMap(e);
	      }

	      this.prevX = e.clientX;
	      this.prevY = e.clientY;
	    }

	    this.map.emit('pointermove', { x: e.clientX, y: e.clientY });
	  },

	  onMouseUp: function(e) {
	    // prevents clicks on other page elements
	    if (!this.pointerIsDown) {
	      return;
	    }

	    if (e.button === 0 && !e.altKey) {
	      if (Math.abs(e.clientX - this.startX)>5 || Math.abs(e.clientY - this.startY)>5) {
	        this.moveMap(e);
	      }
	    } else {
	      this.rotateMap(e);
	    }

	    this.pointerIsDown = false;

	    this.map.emit('pointerup', { x: e.clientX, y: e.clientY });
	  },

	  onMouseWheel: function(e) {
	    cancelEvent(e);
	    var delta = 0;
	    if (e.wheelDeltaY) {
	      delta = e.wheelDeltaY;
	    } else if (e.wheelDelta) {
	      delta = e.wheelDelta;
	    } else if (e.detail) {
	      delta = -e.detail;
	    }

	    if (!this.disabled) {
	      var adjust = 0.2*(delta>0 ? 1 : delta<0 ? -1 : 0);
	      this.map.setZoom(this.map.zoom + adjust, e);
	    }

	    this.map.emit('mousewheel', { delta: delta });
	  },

	  moveMap: function(e) {
	    if (this.disabled) {
	      return;
	    }

	    /*FIXME: make movement exact, i.e. make the position that 
	     *       appeared at (this.prevX, this.prevY) before appear at 
	     *       (e.clientX, e.clientY) now.
	     */
	    // the constant 0.86 was chosen experimentally for the map movement to be 
	    // "pinned" to the cursor movement when the map is shown top-down
	    var scale = 0.86 * Math.pow( 2, -this.map.zoom);    
	    var lngScale = 1/Math.cos( this.map.position.latitude/ 180 * Math.PI);
	    var dx = e.clientX - this.prevX;
	    var dy = e.clientY - this.prevY;
	    var angle = this.map.rotation * Math.PI/180;
	    
	    var vRight = [ Math.cos(angle),             Math.sin(angle)];
	    var vForward=[ Math.cos(angle - Math.PI/2), Math.sin(angle - Math.PI/2)]
	    
	    var dir = add2(  mul2scalar(vRight,    dx), 
	                     mul2scalar(vForward, -dy));

	    this.map.setPosition({ 
	      longitude: this.map.position.longitude - dir[0] * scale*lngScale, 
	      latitude:  this.map.position.latitude  + dir[1] * scale });
	  },

	  rotateMap: function(e) {
	    if (this.disabled) {
	      return;
	    }
	    this.prevRotation += (e.clientX - this.prevX)*(360/innerWidth);
	    this.prevTilt -= (e.clientY - this.prevY)*(360/innerHeight);
	    this.map.setRotation(this.prevRotation);
	    this.map.setTilt(this.prevTilt);
	  },

	  //***************************************************************************

	  onTouchStart: function(e) {
	    cancelEvent(e);

	    this.startZoom = this.map.zoom;
	    this.prevRotation = this.map.rotation;
	    this.prevTilt = this.map.tilt;

	    if (e.touches.length) {
	      e = e.touches[0];
	    }

	    this.startX = this.prevX = e.clientX;
	    this.startY = this.prevY = e.clientY;

	    this.map.emit('pointerdown', { x: e.clientX, y: e.clientY });
	  },

	  onTouchMove: function(e) {
	    if (e.touches.length) {
	      e = e.touches[0];
	    }

	    this.moveMap(e);

	    this.prevX = e.clientX;
	    this.prevY = e.clientY;

	    this.map.emit('pointermove', { x: e.clientX, y: e.clientY });
	  },

	  onTouchEnd: function(e) {
	    if (e.touches.length) {
	      e = e.touches[0];
	    }

	    if (Math.abs(e.clientX - this.startX)>5 || Math.abs(e.clientY - this.startY)>5) {
	      this.moveMap(e);
	    }

	    this.map.emit('pointerup', { x: e.clientX, y: e.clientY });
	  },

	  onGestureChange: function(e) {
	    cancelEvent(e);
	    if (!this.disabled) {
	      this.map.setZoom(this.startZoom + (e.scale - 1));
	      this.map.setRotation(this.prevRotation - e.rotation);
	  //  this.map.setTilt(prevTilt ...);
	    }
	    this.map.emit('gesture', e.touches);
	  },

	  destroy: function() {
	    this.disabled = true;
	    var listener;
	    for (var i = 0; i < this._listeners.length; i++) {
	      listener = this._listeners[i];
	      listener.target.removeEventListener(listener.type, listener.fn, false);
	    }
	    this._listeners = [];
	  }
	};


	var Layers = function(map) {
	  this.map = map;
	  this.items = [];
	};

	Layers.prototype = {

	  add: function(layer) {
	    this.items.push(layer);
	  },

	  remove: function(layer) {
	    this.items = this.items.filter(function(item) {
	      return (item !== layer);
	    });
	  },

	  getAttribution: function() {
	    var attribution = [];
	    for (var i = 0; i < this.items.length; i++) {
	      if (this.items[i].attribution) {
	        attribution.push(this.items[i].attribution);
	      }
	    }
	    return attribution;
	  },

	  destroy: function() {
	    this.items = [];
	  }
	};



	var earcut = (function() {

	  function earcut(data, holeIndices, dim) {

	    dim = dim || 2;

	    var hasHoles = holeIndices && holeIndices.length,
	      outerLen = hasHoles ? holeIndices[0]*dim : data.length,
	      outerNode = linkedList(data, 0, outerLen, dim, true),
	      triangles = [];

	    if (!outerNode) return triangles;

	    var minX, minY, maxX, maxY, x, y, size;

	    if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

	    // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
	    if (data.length>80*dim) {
	      minX = maxX = data[0];
	      minY = maxY = data[1];

	      for (var i = dim; i<outerLen; i += dim) {
	        x = data[i];
	        y = data[i + 1];
	        if (x<minX) minX = x;
	        if (y<minY) minY = y;
	        if (x>maxX) maxX = x;
	        if (y>maxY) maxY = y;
	      }

	      // minX, minY and size are later used to transform coords into integers for z-order calculation
	      size = Math.max(maxX - minX, maxY - minY);
	    }

	    earcutLinked(outerNode, triangles, dim, minX, minY, size);

	    return triangles;
	  }

	// create a circular doubly linked list from polygon points in the specified winding order
	  function linkedList(data, start, end, dim, clockwise) {
	    var sum = 0,
	      i, j, last;

	    // calculate original winding order of a polygon ring
	    for (i = start, j = end - dim; i<end; i += dim) {
	      sum += (data[j] - data[i])*(data[i + 1] + data[j + 1]);
	      j = i;
	    }

	    // link points into circular doubly-linked list in the specified winding order
	    if (clockwise === (sum>0)) {
	      for (i = start; i<end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
	    } else {
	      for (i = end - dim; i>=start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
	    }

	    return last;
	  }

	// eliminate colinear or duplicate points
	  function filterPoints(start, end) {
	    if (!start) return start;
	    if (!end) end = start;

	    var p = start,
	      again;
	    do {
	      again = false;

	      if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
	        removeNode(p);
	        p = end = p.prev;
	        if (p === p.next) return null;
	        again = true;

	      } else {
	        p = p.next;
	      }
	    } while (again || p !== end);

	    return end;
	  }

	// main ear slicing loop which triangulates a polygon (given as a linked list)
	  function earcutLinked(ear, triangles, dim, minX, minY, size, pass) {
	    if (!ear) return;

	    // interlink polygon nodes in z-order
	    if (!pass && size) indexCurve(ear, minX, minY, size);

	    var stop = ear,
	      prev, next;

	    // iterate through ears, slicing them one by one
	    while (ear.prev !== ear.next) {
	      prev = ear.prev;
	      next = ear.next;

	      if (size ? isEarHashed(ear, minX, minY, size) : isEar(ear)) {
	        // cut off the triangle
	        triangles.push(prev.i/dim);
	        triangles.push(ear.i/dim);
	        triangles.push(next.i/dim);

	        removeNode(ear);

	        // skipping the next vertice leads to less sliver triangles
	        ear = next.next;
	        stop = next.next;

	        continue;
	      }

	      ear = next;

	      // if we looped through the whole remaining polygon and can't find any more ears
	      if (ear === stop) {
	        // try filtering points and slicing again
	        if (!pass) {
	          earcutLinked(filterPoints(ear), triangles, dim, minX, minY, size, 1);

	          // if this didn't work, try curing all small self-intersections locally
	        } else if (pass === 1) {
	          ear = cureLocalIntersections(ear, triangles, dim);
	          earcutLinked(ear, triangles, dim, minX, minY, size, 2);

	          // as a last resort, try splitting the remaining polygon into two
	        } else if (pass === 2) {
	          splitEarcut(ear, triangles, dim, minX, minY, size);
	        }

	        break;
	      }
	    }
	  }

	// check whether a polygon node forms a valid ear with adjacent nodes
	  function isEar(ear) {
	    var a = ear.prev,
	      b = ear,
	      c = ear.next;

	    if (area(a, b, c)>=0) return false; // reflex, can't be an ear

	    // now make sure we don't have other points inside the potential ear
	    var p = ear.next.next;

	    while (p !== ear.prev) {
	      if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
	        area(p.prev, p, p.next)>=0) return false;
	      p = p.next;
	    }

	    return true;
	  }

	  function isEarHashed(ear, minX, minY, size) {
	    var a = ear.prev,
	      b = ear,
	      c = ear.next;

	    if (area(a, b, c)>=0) return false; // reflex, can't be an ear

	    // triangle bbox; min & max are calculated like this for speed
	    var minTX = a.x<b.x ? (a.x<c.x ? a.x : c.x) : (b.x<c.x ? b.x : c.x),
	      minTY = a.y<b.y ? (a.y<c.y ? a.y : c.y) : (b.y<c.y ? b.y : c.y),
	      maxTX = a.x>b.x ? (a.x>c.x ? a.x : c.x) : (b.x>c.x ? b.x : c.x),
	      maxTY = a.y>b.y ? (a.y>c.y ? a.y : c.y) : (b.y>c.y ? b.y : c.y);

	    // z-order range for the current triangle bbox;
	    var minZ = zOrder(minTX, minTY, minX, minY, size),
	      maxZ = zOrder(maxTX, maxTY, minX, minY, size);

	    // first look for points inside the triangle in increasing z-order
	    var p = ear.nextZ;

	    while (p && p.z<=maxZ) {
	      if (p !== ear.prev && p !== ear.next &&
	        pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
	        area(p.prev, p, p.next)>=0) return false;
	      p = p.nextZ;
	    }

	    // then look for points in decreasing z-order
	    p = ear.prevZ;

	    while (p && p.z>=minZ) {
	      if (p !== ear.prev && p !== ear.next &&
	        pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
	        area(p.prev, p, p.next)>=0) return false;
	      p = p.prevZ;
	    }

	    return true;
	  }

	// go through all polygon nodes and cure small local self-intersections
	  function cureLocalIntersections(start, triangles, dim) {
	    var p = start;
	    do {
	      var a = p.prev,
	        b = p.next.next;

	      // a self-intersection where edge (v[i-1],v[i]) intersects (v[i+1],v[i+2])
	      if (intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

	        triangles.push(a.i/dim);
	        triangles.push(p.i/dim);
	        triangles.push(b.i/dim);

	        // remove two nodes involved
	        removeNode(p);
	        removeNode(p.next);

	        p = start = b;
	      }
	      p = p.next;
	    } while (p !== start);

	    return p;
	  }

	// try splitting polygon into two and triangulate them independently
	  function splitEarcut(start, triangles, dim, minX, minY, size) {
	    // look for a valid diagonal that divides the polygon into two
	    var a = start;
	    do {
	      var b = a.next.next;
	      while (b !== a.prev) {
	        if (a.i !== b.i && isValidDiagonal(a, b)) {
	          // split the polygon in two by the diagonal
	          var c = splitPolygon(a, b);

	          // filter colinear points around the cuts
	          a = filterPoints(a, a.next);
	          c = filterPoints(c, c.next);

	          // run earcut on each half
	          earcutLinked(a, triangles, dim, minX, minY, size);
	          earcutLinked(c, triangles, dim, minX, minY, size);
	          return;
	        }
	        b = b.next;
	      }
	      a = a.next;
	    } while (a !== start);
	  }

	// link every hole into the outer loop, producing a single-ring polygon without holes
	  function eliminateHoles(data, holeIndices, outerNode, dim) {
	    var queue = [],
	      i, len, start, end, list;

	    for (i = 0, len = holeIndices.length; i<len; i++) {
	      start = holeIndices[i]*dim;
	      end = i<len - 1 ? holeIndices[i + 1]*dim : data.length;
	      list = linkedList(data, start, end, dim, false);
	      if (list === list.next) list.steiner = true;
	      queue.push(getLeftmost(list));
	    }

	    queue.sort(compareX);

	    // process holes from left to right
	    for (i = 0; i<queue.length; i++) {
	      eliminateHole(queue[i], outerNode);
	      outerNode = filterPoints(outerNode, outerNode.next);
	    }

	    return outerNode;
	  }

	  function compareX(a, b) {
	    return a.x - b.x;
	  }

	// find a bridge between vertices that connects hole with an outer ring and and link it
	  function eliminateHole(hole, outerNode) {
	    outerNode = findHoleBridge(hole, outerNode);
	    if (outerNode) {
	      var b = splitPolygon(outerNode, hole);
	      filterPoints(b, b.next);
	    }
	  }

	// David Eberly's algorithm for finding a bridge between hole and outer polygon
	  function findHoleBridge(hole, outerNode) {
	    var p = outerNode,
	      hx = hole.x,
	      hy = hole.y,
	      qx = -Infinity,
	      m;

	    // find a segment intersected by a ray from the hole's leftmost point to the left;
	    // segment's endpoint with lesser x will be potential connection point
	    do {
	      if (hy<=p.y && hy>=p.next.y) {
	        var x = p.x + (hy - p.y)*(p.next.x - p.x)/(p.next.y - p.y);
	        if (x<=hx && x>qx) {
	          qx = x;
	          m = p.x<p.next.x ? p : p.next;
	        }
	      }
	      p = p.next;
	    } while (p !== outerNode);

	    if (!m) return null;

	    // look for points inside the triangle of hole point, segment intersection and endpoint;
	    // if there are no points found, we have a valid connection;
	    // otherwise choose the point of the minimum angle with the ray as connection point

	    var stop = m,
	      tanMin = Infinity,
	      tan;

	    p = m.next;

	    while (p !== stop) {
	      if (hx>=p.x && p.x>=m.x &&
	        pointInTriangle(hy<m.y ? hx : qx, hy, m.x, m.y, hy<m.y ? qx : hx, hy, p.x, p.y)) {

	        tan = Math.abs(hy - p.y)/(hx - p.x); // tangential

	        if ((tan<tanMin || (tan === tanMin && p.x>m.x)) && locallyInside(p, hole)) {
	          m = p;
	          tanMin = tan;
	        }
	      }

	      p = p.next;
	    }

	    return m;
	  }

	// interlink polygon nodes in z-order
	  function indexCurve(start, minX, minY, size) {
	    var p = start;
	    do {
	      if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, size);
	      p.prevZ = p.prev;
	      p.nextZ = p.next;
	      p = p.next;
	    } while (p !== start);

	    p.prevZ.nextZ = null;
	    p.prevZ = null;

	    sortLinked(p);
	  }

	// Simon Tatham's linked list merge sort algorithm
	// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
	  function sortLinked(list) {
	    var i, p, q, e, tail, numMerges, pSize, qSize,
	      inSize = 1;

	    do {
	      p = list;
	      list = null;
	      tail = null;
	      numMerges = 0;

	      while (p) {
	        numMerges++;
	        q = p;
	        pSize = 0;
	        for (i = 0; i<inSize; i++) {
	          pSize++;
	          q = q.nextZ;
	          if (!q) break;
	        }

	        qSize = inSize;

	        while (pSize>0 || (qSize>0 && q)) {

	          if (pSize === 0) {
	            e = q;
	            q = q.nextZ;
	            qSize--;
	          } else if (qSize === 0 || !q) {
	            e = p;
	            p = p.nextZ;
	            pSize--;
	          } else if (p.z<=q.z) {
	            e = p;
	            p = p.nextZ;
	            pSize--;
	          } else {
	            e = q;
	            q = q.nextZ;
	            qSize--;
	          }

	          if (tail) tail.nextZ = e;
	          else list = e;

	          e.prevZ = tail;
	          tail = e;
	        }

	        p = q;
	      }

	      tail.nextZ = null;
	      inSize *= 2;

	    } while (numMerges>1);

	    return list;
	  }

	// z-order of a point given coords and size of the data bounding box
	  function zOrder(x, y, minX, minY, size) {
	    // coords are transformed into non-negative 15-bit integer range
	    x = 32767*(x - minX)/size;
	    y = 32767*(y - minY)/size;

	    x = (x | (x<<8)) & 0x00FF00FF;
	    x = (x | (x<<4)) & 0x0F0F0F0F;
	    x = (x | (x<<2)) & 0x33333333;
	    x = (x | (x<<1)) & 0x55555555;

	    y = (y | (y<<8)) & 0x00FF00FF;
	    y = (y | (y<<4)) & 0x0F0F0F0F;
	    y = (y | (y<<2)) & 0x33333333;
	    y = (y | (y<<1)) & 0x55555555;

	    return x | (y<<1);
	  }

	// find the leftmost node of a polygon ring
	  function getLeftmost(start) {
	    var p = start,
	      leftmost = start;
	    do {
	      if (p.x<leftmost.x) leftmost = p;
	      p = p.next;
	    } while (p !== start);

	    return leftmost;
	  }

	// check if a point lies within a convex triangle
	  function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
	    return (cx - px)*(ay - py) - (ax - px)*(cy - py)>=0 &&
	      (ax - px)*(by - py) - (bx - px)*(ay - py)>=0 &&
	      (bx - px)*(cy - py) - (cx - px)*(by - py)>=0;
	  }

	// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
	  function isValidDiagonal(a, b) {
	    return equals(a, b) || a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) &&
	      locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b);
	  }

	// signed area of a triangle
	  function area(p, q, r) {
	    return (q.y - p.y)*(r.x - q.x) - (q.x - p.x)*(r.y - q.y);
	  }

	// check if two points are equal
	  function equals(p1, p2) {
	    return p1.x === p2.x && p1.y === p2.y;
	  }

	// check if two segments intersect
	  function intersects(p1, q1, p2, q2) {
	    return area(p1, q1, p2)>0 !== area(p1, q1, q2)>0 &&
	      area(p2, q2, p1)>0 !== area(p2, q2, q1)>0;
	  }

	// check if a polygon diagonal intersects any polygon segments
	  function intersectsPolygon(a, b) {
	    var p = a;
	    do {
	      if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
	        intersects(p, p.next, a, b)) return true;
	      p = p.next;
	    } while (p !== a);

	    return false;
	  }

	// check if a polygon diagonal is locally inside the polygon
	  function locallyInside(a, b) {
	    return area(a.prev, a, a.next)<0 ?
	    area(a, b, a.next)>=0 && area(a, a.prev, b)>=0 :
	    area(a, b, a.prev)<0 || area(a, a.next, b)<0;
	  }

	// check if the middle point of a polygon diagonal is inside the polygon
	  function middleInside(a, b) {
	    var p = a,
	      inside = false,
	      px = (a.x + b.x)/2,
	      py = (a.y + b.y)/2;
	    do {
	      if (((p.y>py) !== (p.next.y>py)) && (px<(p.next.x - p.x)*(py - p.y)/(p.next.y - p.y) + p.x))
	        inside = !inside;
	      p = p.next;
	    } while (p !== a);

	    return inside;
	  }

	// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
	// if one belongs to the outer ring and another to a hole, it merges it into a single ring
	  function splitPolygon(a, b) {
	    var a2 = new Node(a.i, a.x, a.y),
	      b2 = new Node(b.i, b.x, b.y),
	      an = a.next,
	      bp = b.prev;

	    a.next = b;
	    b.prev = a;

	    a2.next = an;
	    an.prev = a2;

	    b2.next = a2;
	    a2.prev = b2;

	    bp.next = b2;
	    b2.prev = bp;

	    return b2;
	  }

	// create a node and optionally link it with previous one (in a circular doubly linked list)
	  function insertNode(i, x, y, last) {
	    var p = new Node(i, x, y);

	    if (!last) {
	      p.prev = p;
	      p.next = p;

	    } else {
	      p.next = last.next;
	      p.prev = last;
	      last.next.prev = p;
	      last.next = p;
	    }
	    return p;
	  }

	  function removeNode(p) {
	    p.next.prev = p.prev;
	    p.prev.next = p.next;

	    if (p.prevZ) p.prevZ.nextZ = p.nextZ;
	    if (p.nextZ) p.nextZ.prevZ = p.prevZ;
	  }

	  function Node(i, x, y) {
	    // vertice index in coordinates array
	    this.i = i;

	    // vertex coordinates
	    this.x = x;
	    this.y = y;

	    // previous and next vertice nodes in a polygon ring
	    this.prev = null;
	    this.next = null;

	    // z-order curve value
	    this.z = null;

	    // previous and next nodes in z-order
	    this.prevZ = null;
	    this.nextZ = null;

	    // indicates whether this is a steiner point
	    this.steiner = false;
	  }

	  return earcut;

	}());

	var Color = (function(window) {


	var w3cColors = {
	aliceblue: '#f0f8ff',
	antiquewhite: '#faebd7',
	aqua: '#00ffff',
	aquamarine: '#7fffd4',
	azure: '#f0ffff',
	beige: '#f5f5dc',
	bisque: '#ffe4c4',
	black: '#000000',
	blanchedalmond: '#ffebcd',
	blue: '#0000ff',
	blueviolet: '#8a2be2',
	brown: '#a52a2a',
	burlywood: '#deb887',
	cadetblue: '#5f9ea0',
	chartreuse: '#7fff00',
	chocolate: '#d2691e',
	coral: '#ff7f50',
	cornflowerblue: '#6495ed',
	cornsilk: '#fff8dc',
	crimson: '#dc143c',
	cyan: '#00ffff',
	darkblue: '#00008b',
	darkcyan: '#008b8b',
	darkgoldenrod: '#b8860b',
	darkgray: '#a9a9a9',
	darkgrey: '#a9a9a9',
	darkgreen: '#006400',
	darkkhaki: '#bdb76b',
	darkmagenta: '#8b008b',
	darkolivegreen: '#556b2f',
	darkorange: '#ff8c00',
	darkorchid: '#9932cc',
	darkred: '#8b0000',
	darksalmon: '#e9967a',
	darkseagreen: '#8fbc8f',
	darkslateblue: '#483d8b',
	darkslategray: '#2f4f4f',
	darkslategrey: '#2f4f4f',
	darkturquoise: '#00ced1',
	darkviolet: '#9400d3',
	deeppink: '#ff1493',
	deepskyblue: '#00bfff',
	dimgray: '#696969',
	dimgrey: '#696969',
	dodgerblue: '#1e90ff',
	firebrick: '#b22222',
	floralwhite: '#fffaf0',
	forestgreen: '#228b22',
	fuchsia: '#ff00ff',
	gainsboro: '#dcdcdc',
	ghostwhite: '#f8f8ff',
	gold: '#ffd700',
	goldenrod: '#daa520',
	gray: '#808080',
	grey: '#808080',
	green: '#008000',
	greenyellow: '#adff2f',
	honeydew: '#f0fff0',
	hotpink: '#ff69b4',
	indianred : '#cd5c5c',
	indigo : '#4b0082',
	ivory: '#fffff0',
	khaki: '#f0e68c',
	lavender: '#e6e6fa',
	lavenderblush: '#fff0f5',
	lawngreen: '#7cfc00',
	lemonchiffon: '#fffacd',
	lightblue: '#add8e6',
	lightcoral: '#f08080',
	lightcyan: '#e0ffff',
	lightgoldenrodyellow: '#fafad2',
	lightgray: '#d3d3d3',
	lightgrey: '#d3d3d3',
	lightgreen: '#90ee90',
	lightpink: '#ffb6c1',
	lightsalmon: '#ffa07a',
	lightseagreen: '#20b2aa',
	lightskyblue: '#87cefa',
	lightslategray: '#778899',
	lightslategrey: '#778899',
	lightsteelblue: '#b0c4de',
	lightyellow: '#ffffe0',
	lime: '#00ff00',
	limegreen: '#32cd32',
	linen: '#faf0e6',
	magenta: '#ff00ff',
	maroon: '#800000',
	mediumaquamarine: '#66cdaa',
	mediumblue: '#0000cd',
	mediumorchid: '#ba55d3',
	mediumpurple: '#9370db',
	mediumseagreen: '#3cb371',
	mediumslateblue: '#7b68ee',
	mediumspringgreen: '#00fa9a',
	mediumturquoise: '#48d1cc',
	mediumvioletred: '#c71585',
	midnightblue: '#191970',
	mintcream: '#f5fffa',
	mistyrose: '#ffe4e1',
	moccasin: '#ffe4b5',
	navajowhite: '#ffdead',
	navy: '#000080',
	oldlace: '#fdf5e6',
	olive: '#808000',
	olivedrab: '#6b8e23',
	orange: '#ffa500',
	orangered: '#ff4500',
	orchid: '#da70d6',
	palegoldenrod: '#eee8aa',
	palegreen: '#98fb98',
	paleturquoise: '#afeeee',
	palevioletred: '#db7093',
	papayawhip: '#ffefd5',
	peachpuff: '#ffdab9',
	peru: '#cd853f',
	pink: '#ffc0cb',
	plum: '#dda0dd',
	powderblue: '#b0e0e6',
	purple: '#800080',
	rebeccapurple: '#663399',
	red: '#ff0000',
	rosybrown: '#bc8f8f',
	royalblue: '#4169e1',
	saddlebrown: '#8b4513',
	salmon: '#fa8072',
	sandybrown: '#f4a460',
	seagreen: '#2e8b57',
	seashell: '#fff5ee',
	sienna: '#a0522d',
	silver: '#c0c0c0',
	skyblue: '#87ceeb',
	slateblue: '#6a5acd',
	slategray: '#708090',
	slategrey: '#708090',
	snow: '#fffafa',
	springgreen: '#00ff7f',
	steelblue: '#4682b4',
	tan: '#d2b48c',
	teal: '#008080',
	thistle: '#d8bfd8',
	tomato: '#ff6347',
	turquoise: '#40e0d0',
	violet: '#ee82ee',
	wheat: '#f5deb3',
	white: '#ffffff',
	whitesmoke: '#f5f5f5',
	yellow: '#ffff00',
	yellowgreen: '#9acd32'
	};

	function hue2rgb(p, q, t) {
	  if (t < 0) t += 1;
	  if (t > 1) t -= 1;
	  if (t < 1/6) return p + (q-p) * 6 * t;
	  if (t < 1/2) return q;
	  if (t < 2/3) return p + (q-p) * (2/3 - t) * 6;
	  return p;
	}

	function clamp(v, max) {
	  return Math.min(max, Math.max(0, v || 0));
	}

	/**
	 * @param str, object can be in any of these: 'red', '#0099ff', 'rgb(64, 128, 255)', 'rgba(64, 128, 255, 0.5)', { r:0.2, g:0.3, b:0.9, a:1 }
	 */
	var Color = function(str) {
	  str = str || '';

	  if (typeof str === 'object') {
	    var rgba = str;
	    this.R = clamp(rgba.r, max);
	    this.G = clamp(rgba.g, max);
	    this.B = clamp(rgba.b, max);
	    this.A = (rgba.a !== undefined ? clamp(rgba.a, 1) : 1);
	    this.isValid = true;
	  } else if (typeof str === 'string') {
	    str = str.toLowerCase();
	    str = w3cColors[str] || str;
	    var m;
	    if ((m = str.match(/^#?(\w{2})(\w{2})(\w{2})$/))) {
	      this.R = parseInt(m[1], 16) / 255;
	      this.G = parseInt(m[2], 16) / 255;
	      this.B = parseInt(m[3], 16) / 255;
	      this.A = 1;
	      this.isValid = true;
	    } else if ((m = str.match(/rgba?\((\d+)\D+(\d+)\D+(\d+)(\D+([\d.]+))?\)/))) {
	      this.R = parseInt(m[1], 10) / 255;
	      this.G = parseInt(m[2], 10) / 255;
	      this.B = parseInt(m[3], 10) / 255;
	      this.A = m[4] ? parseFloat(m[5]) : 1;
	      this.isValid = true;
	    }
	  }
	};

	Color.prototype = {

	  toHSL: function() {
	    var
	      max = Math.max(this.R, this.G, this.B),
	      min = Math.min(this.R, this.G, this.B),
	      h, s, l = (max+min) / 2,
	      d = max-min;

	    if (!d) {
	      h = s = 0; // achromatic
	    } else {
	      s = l > 0.5 ? d / (2-max-min) : d / (max+min);
	      switch (max) {
	        case this.R: h = (this.G-this.B) / d + (this.G < this.B ? 6 : 0); break;
	        case this.G: h = (this.B-this.R) / d + 2; break;
	        case this.B: h = (this.R-this.G) / d + 4; break;
	      }
	      h *= 60;
	    }

	    return { h:h, s:s, l:l };
	  },

	  fromHSL: function(hsl) {
	  // h = clamp(hsl.h, 360),
	  // s = clamp(hsl.s, 1),
	  // l = clamp(hsl.l, 1),

	    // achromatic
	    if (hsl.s === 0) {
	      this.R = hsl.l;
	      this.G = hsl.l;
	      this.B = hsl.l;
	    } else {
	      var
	        q = hsl.l < 0.5 ? hsl.l * (1+hsl.s) : hsl.l + hsl.s - hsl.l*hsl.s,
	        p = 2 * hsl.l-q;
	      hsl.h /= 360;
	      this.R = hue2rgb(p, q, hsl.h + 1/3);
	      this.G = hue2rgb(p, q, hsl.h);
	      this.B = hue2rgb(p, q, hsl.h - 1/3);
	    }

	    return this;
	  },

	  toString: function() {
	    if (this.A === 1) {
	      return '#' + ((1 <<24) + (Math.round(this.R*255) <<16) + (Math.round(this.G*255) <<8) + Math.round(this.B*255)).toString(16).slice(1, 7);
	    }
	    return 'rgba(' + [Math.round(this.R*255), Math.round(this.G*255), Math.round(this.B*255), this.A.toFixed(2)].join(',') + ')';
	  },

	  toArray: function() {
	    return [this.R, this.G, this.B];
	  },

	  hue: function(h) {
	    var hsl = this.toHSL();
	    hsl.h *= h;
	    this.fromHSL(hsl);
	    return this;
	  },

	  saturation: function(s) {
	    debugger
	    var hsl = this.toHSL();
	    hsl.s *= s;
	    this.fromHSL(hsl);
	    return this;
	  },

	  lightness: function(l) {
	    var hsl = this.toHSL();
	    hsl.l *= l;
	    this.fromHSL(hsl);
	    return this;
	  },

	  alpha: function(a) {
	    this.A *= a;
	    return this;
	  }
	};
	return Color; }(this));
	(function(global) {
	//var ext = GL.getExtension('WEBGL_lose_context');
	//ext.loseContext();

	var GLX = function(container, width, height, highQuality) {
	  var canvas = document.createElement('CANVAS');
	  canvas.style.position = 'absolute';
	  canvas.width = width;
	  canvas.height = height;
	  container.appendChild(canvas);

	  var options = {
	    antialias: highQuality,
	    depth: true,
	    premultipliedAlpha: false
	  };

	  var context;

	  try {
	    context = canvas.getContext('webgl', options);
	  } catch (ex) {}
	  if (!context) {
	    try {
	      context = canvas.getContext('experimental-webgl', options);
	    } catch (ex) {}
	  }
	  if (!context) {
	    throw new Error('WebGL not supported');
	  }

	  canvas.addEventListener('webglcontextlost', function(e) {
	    console.warn('context lost');
	  });

	  canvas.addEventListener('webglcontextrestored', function(e) {
	    console.warn('context restored');
	  });

	  context.viewport(0, 0, width, height);
	  context.cullFace(context.BACK);
	  context.enable(context.CULL_FACE);
	  context.enable(context.DEPTH_TEST);
	  context.clearColor(0.5, 0.5, 0.5, 1);

	  if (highQuality) {
	    context.anisotropyExtension = context.getExtension('EXT_texture_filter_anisotropic');
	    if (context.anisotropyExtension) {
	      context.anisotropyExtension.maxAnisotropyLevel = context.getParameter(
	        context.anisotropyExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT
	      );
	    }
	  }

	  return GLX.use(context);
	};

	GLX.use = function(context) {

	  return (function(GL) {

	    var glx = {};

	    glx.context = context;

	    glx.start = function(render) {
	      return setInterval(function() {
	        requestAnimationFrame(render);
	      }, 17);
	    };

	    glx.stop = function(loop) {
	      clearInterval(loop);
	    };

	    glx.destroy = function() {
	      context.canvas.parentNode.removeChild(context.canvas);
	      context = null;
	    };


	glx.util = {};

	glx.util.nextPowerOf2 = function(n) {
	  n--;
	  n |= n >> 1;  // handle  2 bit numbers
	  n |= n >> 2;  // handle  4 bit numbers
	  n |= n >> 4;  // handle  8 bit numbers
	  n |= n >> 8;  // handle 16 bit numbers
	  n |= n >> 16; // handle 32 bit numbers
	  n++;
	  return n;
	};

	glx.util.calcNormal = function(ax, ay, az, bx, by, bz, cx, cy, cz) {
	  var d1x = ax-bx;
	  var d1y = ay-by;
	  var d1z = az-bz;

	  var d2x = bx-cx;
	  var d2y = by-cy;
	  var d2z = bz-cz;

	  var nx = d1y*d2z - d1z*d2y;
	  var ny = d1z*d2x - d1x*d2z;
	  var nz = d1x*d2y - d1y*d2x;

	  return this.calcUnit(nx, ny, nz);
	};

	glx.util.calcUnit = function(x, y, z) {
	  var m = Math.sqrt(x*x + y*y + z*z);

	  if (m === 0) {
	    m = 0.00001;
	  }

	  return [x/m, y/m, z/m];
	};


	glx.Buffer = function(itemSize, data) {
	  this.id = GL.createBuffer();
	  this.itemSize = itemSize;
	  this.numItems = data.length/itemSize;
	  GL.bindBuffer(GL.ARRAY_BUFFER, this.id);
	  GL.bufferData(GL.ARRAY_BUFFER, data, GL.STATIC_DRAW);
	  data = null;
	};

	glx.Buffer.prototype = {
	  enable: function() {
	    GL.bindBuffer(GL.ARRAY_BUFFER, this.id);
	  },

	  destroy: function() {
	    GL.deleteBuffer(this.id);
	    this.id = null;
	  }
	};


	glx.Framebuffer = function(width, height) {
	  this.setSize(width, height);
	};

	glx.Framebuffer.prototype = {

	  setSize: function(width, height) {
	    this.frameBuffer = GL.createFramebuffer();
	    GL.bindFramebuffer(GL.FRAMEBUFFER, this.frameBuffer);

	    width = glx.util.nextPowerOf2(width);
	    height= glx.util.nextPowerOf2(height);
	    
	    // already has the right size
	    if (width === this.width && height === this.height) {
	      return;
	    }

	    this.width  = width;
	    this.height = height;

	    this.renderBuffer = GL.createRenderbuffer();
	    GL.bindRenderbuffer(GL.RENDERBUFFER, this.renderBuffer);
	    GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, width, height);

	    if (this.renderTexture) {
	      this.renderTexture.destroy();
	    }

	    this.renderTexture = new glx.texture.Data(width, height);

	    GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, this.renderBuffer);
	    GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, this.renderTexture.id, 0);

	    if (GL.checkFramebufferStatus(GL.FRAMEBUFFER) !== GL.FRAMEBUFFER_COMPLETE) {
	      throw new Error('This combination of framebuffer attachments does not work');
	    }

	    GL.bindRenderbuffer(GL.RENDERBUFFER, null);
	    GL.bindFramebuffer(GL.FRAMEBUFFER, null);
	  },

	  enable: function() {
	    GL.bindFramebuffer(GL.FRAMEBUFFER, this.frameBuffer);
	    GL.bindRenderbuffer(GL.RENDERBUFFER, this.renderBuffer);
	  },

	  disable: function() {
	    GL.bindFramebuffer(GL.FRAMEBUFFER, null);
	    GL.bindRenderbuffer(GL.RENDERBUFFER, null);
	  },

	  getPixel: function(x, y) {
	    var imageData = new Uint8Array(4);
	    GL.readPixels(x,y,1,1,GL.RGBA, GL.UNSIGNED_BYTE, imageData);
	    return imageData;
	  },

	  getData: function() {
	    var imageData = new Uint8Array(this.width*this.height*4);
	    GL.readPixels(0, 0, this.width, this.height, GL.RGBA, GL.UNSIGNED_BYTE, imageData);
	    return imageData;
	  },

	  destroy: function() {
	    if (this.renderTexture) {
	      this.renderTexture.destroy();
	    }
	  }
	};


	glx.Shader = function(config) {
	  var i;

	  this.id = GL.createProgram();

	  this.attach(GL.VERTEX_SHADER,   config.vertexShader);
	  this.attach(GL.FRAGMENT_SHADER, config.fragmentShader);

	  GL.linkProgram(this.id);

	  if (!GL.getProgramParameter(this.id, GL.LINK_STATUS)) {
	    throw new Error(GL.getProgramParameter(this.id, GL.VALIDATE_STATUS) +'\n'+ GL.getError());
	  }

	  this.attributeNames = config.attributes || [];
	  this.uniformNames   = config.uniforms || [];
	  GL.useProgram(this.id);

	  this.attributes = {};
	  for (i = 0; i < this.attributeNames.length; i++) {
	    this.locateAttribute(this.attributeNames[i]);
	  }
	  
	  this.uniforms = {};
	  for (i = 0; i < this.uniformNames.length; i++) {
	    this.locateUniform(this.uniformNames[i]);
	  }
	};

	glx.Shader.prototype = {

	  locateAttribute: function(name) {
	    var loc = GL.getAttribLocation(this.id, name);
	    if (loc < 0) {
	      console.error('unable to locate attribute "'+ name +'" in shader');
	      return;
	    }
	    this.attributes[name] = loc;
	  },

	  locateUniform: function(name) {
	    var loc = GL.getUniformLocation(this.id, name);
	    if (loc < 0) {
	      console.error('unable to locate uniform "'+ name +'" in shader');
	      return;
	    }
	    this.uniforms[name] = loc;
	  },

	  attach: function(type, src) {
	    var shader = GL.createShader(type);
	    GL.shaderSource(shader, src);
	    GL.compileShader(shader);

	    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
	      throw new Error(GL.getShaderInfoLog(shader));
	    }

	    GL.attachShader(this.id, shader);
	  },

	  enable: function() {
	    GL.useProgram(this.id);

	    for (var name in this.attributes) {
	      GL.enableVertexAttribArray(this.attributes[name]);
	    }
	    
	    return this;
	  },

	  disable: function() {
	    if (this.attributes) {
	      for (var name in this.attributes) {
	        GL.disableVertexAttribArray(this.attributes[name]);
	      }
	    }
	  },
	  
	  bindBuffer: function(buffer, attribute) {
	    if (this.attributes[attribute] === undefined) {
	      //console.log("[WARN] attempt to bind VBO to non-existent attribute '%s'", attribute);
	      return;
	    }
	    
	    buffer.enable();
	    GL.vertexAttribPointer(this.attributes[attribute], buffer.itemSize, gl.FLOAT, false, 0, 0);
	  },
	  
	  setUniform: function(uniform, type, value) {
	    if (this.uniforms[uniform] === undefined) {
	      return;
	    }
	    
	    GL['uniform'+ type]( this.uniforms[uniform], value);
	  },

	  destroy: function() {
	    this.disable();
	    this.id = null;
	  }
	};


	glx.Matrix = function(data) {
	  if (data) {
	    this.data = new Float32Array(data);
	  } else {
	    this.identity();
	  }
	};

	(function() {

	  function rad(a) {
	    return a * Math.PI/180;
	  }

	  function multiply(res, a, b) {
	    var
	      a00 = a[0],
	      a01 = a[1],
	      a02 = a[2],
	      a03 = a[3],
	      a10 = a[4],
	      a11 = a[5],
	      a12 = a[6],
	      a13 = a[7],
	      a20 = a[8],
	      a21 = a[9],
	      a22 = a[10],
	      a23 = a[11],
	      a30 = a[12],
	      a31 = a[13],
	      a32 = a[14],
	      a33 = a[15],

	      b00 = b[0],
	      b01 = b[1],
	      b02 = b[2],
	      b03 = b[3],
	      b10 = b[4],
	      b11 = b[5],
	      b12 = b[6],
	      b13 = b[7],
	      b20 = b[8],
	      b21 = b[9],
	      b22 = b[10],
	      b23 = b[11],
	      b30 = b[12],
	      b31 = b[13],
	      b32 = b[14],
	      b33 = b[15];

	    res[ 0] = a00*b00 + a01*b10 + a02*b20 + a03*b30;
	    res[ 1] = a00*b01 + a01*b11 + a02*b21 + a03*b31;
	    res[ 2] = a00*b02 + a01*b12 + a02*b22 + a03*b32;
	    res[ 3] = a00*b03 + a01*b13 + a02*b23 + a03*b33;

	    res[ 4] = a10*b00 + a11*b10 + a12*b20 + a13*b30;
	    res[ 5] = a10*b01 + a11*b11 + a12*b21 + a13*b31;
	    res[ 6] = a10*b02 + a11*b12 + a12*b22 + a13*b32;
	    res[ 7] = a10*b03 + a11*b13 + a12*b23 + a13*b33;

	    res[ 8] = a20*b00 + a21*b10 + a22*b20 + a23*b30;
	    res[ 9] = a20*b01 + a21*b11 + a22*b21 + a23*b31;
	    res[10] = a20*b02 + a21*b12 + a22*b22 + a23*b32;
	    res[11] = a20*b03 + a21*b13 + a22*b23 + a23*b33;

	    res[12] = a30*b00 + a31*b10 + a32*b20 + a33*b30;
	    res[13] = a30*b01 + a31*b11 + a32*b21 + a33*b31;
	    res[14] = a30*b02 + a31*b12 + a32*b22 + a33*b32;
	    res[15] = a30*b03 + a31*b13 + a32*b23 + a33*b33;
	  }

	  glx.Matrix.prototype = {

	    identity: function() {
	      this.data = new Float32Array([
	        1, 0, 0, 0,
	        0, 1, 0, 0,
	        0, 0, 1, 0,
	        0, 0, 0, 1
	      ]);
	      return this;
	    },

	    multiply: function(m) {
	      multiply(this.data, this.data, m.data);
	      return this;
	    },

	    translate: function(x, y, z) {
	      multiply(this.data, this.data, [
	        1, 0, 0, 0,
	        0, 1, 0, 0,
	        0, 0, 1, 0,
	        x, y, z, 1
	      ]);
	      return this;
	    },

	    rotateX: function(angle) {
	      var a = rad(angle), c = Math.cos(a), s = Math.sin(a);
	      multiply(this.data, this.data, [
	        1, 0, 0, 0,
	        0, c, s, 0,
	        0, -s, c, 0,
	        0, 0, 0, 1
	      ]);
	      return this;
	    },

	    rotateY: function(angle) {
	      var a = rad(angle), c = Math.cos(a), s = Math.sin(a);
	      multiply(this.data, this.data, [
	        c, 0, -s, 0,
	        0, 1, 0, 0,
	        s, 0, c, 0,
	        0, 0, 0, 1
	      ]);
	      return this;
	    },

	    rotateZ: function(angle) {
	      var a = rad(angle), c = Math.cos(a), s = Math.sin(a);
	      multiply(this.data, this.data, [
	        c, -s, 0, 0,
	        s, c, 0, 0,
	        0, 0, 1, 0,
	        0, 0, 0, 1
	      ]);
	      return this;
	    },

	    scale: function(x, y, z) {
	      multiply(this.data, this.data, [
	        x, 0, 0, 0,
	        0, y, 0, 0,
	        0, 0, z, 0,
	        0, 0, 0, 1
	      ]);
	      return this;
	    }
	  };

	  glx.Matrix.multiply = function(a, b) {
	    var res = new Float32Array(16);
	    multiply(res, a.data, b.data);
	    return res;
	  };

	  glx.Matrix.Perspective = function(fov, aspect, near, far) {
	    var f = 1/Math.tan(fov*(Math.PI/180)/2), nf = 1/(near - far);
	    return new glx.Matrix([
	      f/aspect, 0,               0, 0,
	      0,        f,               0, 0,
	      0,        0, (far + near)*nf,-1,
	      0,        0, (2*far*near)*nf, 0
	    ]);
	  };
	  
	  // based on http://www.songho.ca/opengl/gl_projectionmatrix.html
	  glx.Matrix.Ortho = function(left, right, top, bottom, near, far) {
	    return new glx.Matrix([
	                   2/(right-left),                          0,                       0, 0,
	                                0,           2/(top - bottom),                       0, 0,
	                                0,                          0,         -2/(far - near), 0,
	      - (right+left)/(right-left), -(top+bottom)/(top-bottom), - (far+near)/(far-near), 1
	    ]);
	  }


	  glx.Matrix.invert3 = function(a) {
	    var
	      a00 = a[0], a01 = a[1], a02 = a[2],
	      a04 = a[4], a05 = a[5], a06 = a[6],
	      a08 = a[8], a09 = a[9], a10 = a[10],

	      l =  a10 * a05 - a06 * a09,
	      o = -a10 * a04 + a06 * a08,
	      m =  a09 * a04 - a05 * a08,

	      det = a00*l + a01*o + a02*m;

	    if (!det) {
	      return null;
	    }

	    det = 1.0/det;

	    return [
	      l                    * det,
	      (-a10*a01 + a02*a09) * det,
	      ( a06*a01 - a02*a05) * det,
	      o                    * det,
	      ( a10*a00 - a02*a08) * det,
	      (-a06*a00 + a02*a04) * det,
	      m                    * det,
	      (-a09*a00 + a01*a08) * det,
	      ( a05*a00 - a01*a04) * det
	    ];
	  };

	  glx.Matrix.transpose = function(a) {
	    return new Float32Array([
	      a[0],
	      a[3],
	      a[6],
	      a[1],
	      a[4],
	      a[7],
	      a[2],
	      a[5],
	      a[8]
	    ]);
	  };

	  // glx.Matrix.transform = function(x, y, z, m) {
	  //   var X = x*m[0] + y*m[4] + z*m[8]  + m[12];
	  //   var Y = x*m[1] + y*m[5] + z*m[9]  + m[13];
	  //   var Z = x*m[2] + y*m[6] + z*m[10] + m[14];
	  //   var W = x*m[3] + y*m[7] + z*m[11] + m[15];
	  //   return {
	  //     x: (X/W +1) / 2,
	  //     y: (Y/W +1) / 2
	  //   };
	  // };

	  glx.Matrix.transform = function(m) {
	    var X = m[12];
	    var Y = m[13];
	    var Z = m[14];
	    var W = m[15];
	    return {
	      x: (X/W + 1) / 2,
	      y: (Y/W + 1) / 2,
	      z: (Z/W + 1) / 2
	    };
	  };

	  glx.Matrix.invert = function(a) {
	    var
	      res = new Float32Array(16),

	      a00 = a[ 0], a01 = a[ 1], a02 = a[ 2], a03 = a[ 3],
	      a10 = a[ 4], a11 = a[ 5], a12 = a[ 6], a13 = a[ 7],
	      a20 = a[ 8], a21 = a[ 9], a22 = a[10], a23 = a[11],
	      a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

	      b00 = a00 * a11 - a01 * a10,
	      b01 = a00 * a12 - a02 * a10,
	      b02 = a00 * a13 - a03 * a10,
	      b03 = a01 * a12 - a02 * a11,
	      b04 = a01 * a13 - a03 * a11,
	      b05 = a02 * a13 - a03 * a12,
	      b06 = a20 * a31 - a21 * a30,
	      b07 = a20 * a32 - a22 * a30,
	      b08 = a20 * a33 - a23 * a30,
	      b09 = a21 * a32 - a22 * a31,
	      b10 = a21 * a33 - a23 * a31,
	      b11 = a22 * a33 - a23 * a32,

	      // Calculate the determinant
	      det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

	    if (!det) {
	      return;
	    }

	    det = 1 / det;

	    res[ 0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
	    res[ 1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
	    res[ 2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
	    res[ 3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;

	    res[ 4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
	    res[ 5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
	    res[ 6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
	    res[ 7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;

	    res[ 8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
	    res[ 9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
	    res[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
	    res[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;

	    res[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
	    res[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
	    res[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
	    res[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

	    return res;
	  };

	}());


	glx.texture = {};


	glx.texture.Image = function() {
	  this.id = GL.createTexture();
	  GL.bindTexture(GL.TEXTURE_2D, this.id);

	  GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);

	//GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
	//GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

	  GL.bindTexture(GL.TEXTURE_2D, null);
	};

	glx.texture.Image.prototype = {

	  clamp: function(image, maxSize) {
	    if (image.width <= maxSize && image.height <= maxSize) {
	      return image;
	    }

	    var w = maxSize, h = maxSize;
	    var ratio = image.width/image.height;
	    // TODO: if other dimension doesn't fit to POT after resize, there is still trouble
	    if (ratio < 1) {
	      w = Math.round(h*ratio);
	    } else {
	      h = Math.round(w/ratio);
	    }

	    var canvas = document.createElement('CANVAS');
	    canvas.width  = w;
	    canvas.height = h;

	    var context = canvas.getContext('2d');
	    context.drawImage(image, 0, 0, canvas.width, canvas.height);
	    return canvas;
	  },

	  load: function(url, callback) {
	    var image = new Image();
	    image.crossOrigin = '*';
	    image.onload = function() {
	      this.set(image);
	      if (callback) {
	        callback(image);
	      }
	    }.bind(this);
	    image.onerror = function() {
	      if (callback) {
	        callback();
	      }
	    };
	    image.src = url;
	    return this;
	  },

	  color: function(color) {
	    GL.bindTexture(GL.TEXTURE_2D, this.id);
	    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
	    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
	    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array([color[0]*255, color[1]*255, color[2]*255, (color[3] === undefined ? 1 : color[3])*255]));
	    GL.bindTexture(GL.TEXTURE_2D, null);
	    return this;
	  },

	  set: function(image) {
	    if (!this.id) {
	      // texture has been destroyed
	      return;
	    }

	    image = this.clamp(image, GL.getParameter(GL.MAX_TEXTURE_SIZE));

	    GL.bindTexture(GL.TEXTURE_2D, this.id);
	    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST);
	    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);

	    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
	    GL.generateMipmap(GL.TEXTURE_2D);

	    if (GL.anisotropyExtension) {
	      GL.texParameterf(GL.TEXTURE_2D, GL.anisotropyExtension.TEXTURE_MAX_ANISOTROPY_EXT, GL.anisotropyExtension.maxAnisotropyLevel);
	    }

	    GL.bindTexture(GL.TEXTURE_2D, null);
	    return this;
	  },

	  enable: function(index) {
	    if (!this.id) {
	      return;
	    }
	    GL.activeTexture(GL.TEXTURE0 + (index || 0));
	    GL.bindTexture(GL.TEXTURE_2D, this.id);
	    return this;
	  },

	  destroy: function() {
	    GL.bindTexture(GL.TEXTURE_2D, null);
	    GL.deleteTexture(this.id);
	    this.id = null;
	  }
	};


	glx.texture.Data = function(width, height, data, options) {
	  //options = options || {};

	  this.id = GL.createTexture();
	  GL.bindTexture(GL.TEXTURE_2D, this.id);

	  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
	  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);

	  //if (options.flipY) {
	  //  GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
	  //}

	  var bytes = null;

	  if (data) {
	    var length = width*height*4;
	    bytes = new Uint8Array(length);
	    bytes.set(data.subarray(0, length));
	  }

	  GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, width, height, 0, GL.RGBA, GL.UNSIGNED_BYTE, bytes);
	  GL.bindTexture(GL.TEXTURE_2D, null);
	};

	glx.texture.Data.prototype = {

	  enable: function(index) {
	    GL.activeTexture(GL.TEXTURE0 + (index || 0));
	    GL.bindTexture(GL.TEXTURE_2D, this.id);
	    return this;
	  },

	  destroy: function() {
	    GL.bindTexture(GL.TEXTURE_2D, null);
	    GL.deleteTexture(this.id);
	    this.id = null;
	  }
	};


	glx.mesh = {};

	glx.mesh.addQuad = function(data, a, b, c, d, color) {
	  this.addTriangle(data, a, b, c, color);
	  this.addTriangle(data, c, d, a, color);
	};

	glx.mesh.addTriangle = function(data, a, b, c, color) {
	  data.vertices.push(
	    a[0], a[1], a[2],
	    b[0], b[1], b[2],
	    c[0], c[1], c[2]
	  );

	  var n = glx.util.calcNormal(
	    a[0], a[1], a[2],
	    b[0], b[1], b[2],
	    c[0], c[1], c[2]
	  );

	  data.normals.push(
	    n[0], n[1], n[2],
	    n[0], n[1], n[2],
	    n[0], n[1], n[2]
	  );

	  data.colors.push(
	    color[0], color[1], color[2], color[3],
	    color[0], color[1], color[2], color[3],
	    color[0], color[1], color[2], color[3]
	  );
	};


	glx.mesh.Triangle = function(size, color) {

	  var data = {
	    vertices: [],
	    normals: [],
	    colors: []
	  };

	  var a = [-size/2, -size/2, 0];
	  var b = [ size/2, -size/2, 0];
	  var c = [ size/2,  size/2, 0];

	  glx.mesh.addTriangle(data, a, b, c, color);

	  this.vertexBuffer = new glx.Buffer(3, new Float32Array(data.vertices));
	  this.normalBuffer = new glx.Buffer(3, new Float32Array(data.normals));
	  this.colorBuffer  = new glx.Buffer(4, new Float32Array(data.colors));

	 	this.transform = new glx.Matrix();
	};


	glx.mesh.Plane = function(size, color) {

	  var data = {
	    vertices: [],
	    normals: [],
	    colors: []
	  };

	  var a = [-size/2, -size/2, 0];
	  var b = [ size/2, -size/2, 0];
	  var c = [ size/2,  size/2, 0];
	  var d = [-size/2,  size/2, 0];

	  glx.mesh.addQuad(data, a, b, c, d, color);

	  this.vertexBuffer = new glx.Buffer(3, new Float32Array(data.vertices));
	  this.normalBuffer = new glx.Buffer(3, new Float32Array(data.normals));
	  this.colorBuffer  = new glx.Buffer(4, new Float32Array(data.colors));

	 	this.transform = new glx.Matrix();
	};


	glx.mesh.Cube = function(size, color) {

	  var data = {
	    vertices: [],
	    normals: [],
	    colors: []
	  };

	  var a = [-size/2, -size/2, -size/2];
	  var b = [ size/2, -size/2, -size/2];
	  var c = [ size/2,  size/2, -size/2];
	  var d = [-size/2,  size/2, -size/2];

	  var A = [-size/2, -size/2, size/2];
	  var B = [ size/2, -size/2, size/2];
	  var C = [ size/2,  size/2, size/2];
	  var D = [-size/2,  size/2, size/2];

	  glx.mesh.addQuad(data, a, b, c, d, color);
	  glx.mesh.addQuad(data, A, B, C, D, color);
	  glx.mesh.addQuad(data, a, b, B, A, color);
	  glx.mesh.addQuad(data, b, c, C, B, color);
	  glx.mesh.addQuad(data, c, d, D, C, color);
	  glx.mesh.addQuad(data, d, a, A, D, color);

	  this.vertexBuffer = new glx.Buffer(3, new Float32Array(data.vertices));
	  this.normalBuffer = new glx.Buffer(3, new Float32Array(data.normals));
	  this.colorBuffer  = new glx.Buffer(4, new Float32Array(data.colors));

	  this.transform = new glx.Matrix();
	};


	    return glx;

	  }(context));
	};

	if (true) {
	  !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (GLX), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof exports === 'object') {
	  module.exports = GLX;
	} else {
	  global.GLX = GLX;
	}
	}(this));
	//
	/*
	 (c) 2011-2015, Vladimir Agafonkin
	 SunCalc is a JavaScript library for calculating sun position and light phases.
	 https://github.com/mourner/suncalc
	*/

	var suncalc = (function () {
	  'use strict';

	// shortcuts for easier to read formulas

	  var PI = Math.PI,
	    sin = Math.sin,
	    cos = Math.cos,
	    tan = Math.tan,
	    asin = Math.asin,
	    atan = Math.atan2,
	    rad = PI/180;

	// sun calculations are based on http://aa.quae.nl/en/reken/zonpositie.html formulas


	// date/time constants and conversions

	  var dayMs = 1000*60*60*24,
	    J1970 = 2440588,
	    J2000 = 2451545;

	  function toJulian(date) {
	    return date.valueOf()/dayMs - 0.5 + J1970;
	  }

	  function toDays(date) {
	    return toJulian(date) - J2000;
	  }


	// general calculations for position

	  var e = rad*23.4397; // obliquity of the Earth

	  function rightAscension(l, b) {
	    return atan(sin(l)*cos(e) - tan(b)*sin(e), cos(l));
	  }

	  function declination(l, b) {
	    return asin(sin(b)*cos(e) + cos(b)*sin(e)*sin(l));
	  }

	  function azimuth(H, phi, dec) {
	    return atan(sin(H), cos(H)*sin(phi) - tan(dec)*cos(phi));
	  }

	  function altitude(H, phi, dec) {
	    return asin(sin(phi)*sin(dec) + cos(phi)*cos(dec)*cos(H));
	  }

	  function siderealTime(d, lw) {
	    return rad*(280.16 + 360.9856235*d) - lw;
	  }


	// general sun calculations

	  function solarMeanAnomaly(d) {
	    return rad*(357.5291 + 0.98560028*d);
	  }

	  function eclipticLongitude(M) {

	    var C = rad*(1.9148*sin(M) + 0.02*sin(2*M) + 0.0003*sin(3*M)), // equation of center
	      P = rad*102.9372; // perihelion of the Earth

	    return M + C + P + PI;
	  }

	  function sunCoords(d) {

	    var M = solarMeanAnomaly(d),
	      L = eclipticLongitude(M);

	    return {
	      dec: declination(L, 0),
	      ra: rightAscension(L, 0)
	    };
	  }

	// calculates sun position for a given date and latitude/longitude

	  return function(date, lat, lng) {

	    var lw = rad* -lng,
	      phi = rad*lat,
	      d = toDays(date),

	      c = sunCoords(d),
	      H = siderealTime(d, lw) - c.ra;

	    return {
	      azimuth: azimuth(H, phi, c.dec),
	      altitude: altitude(H, phi, c.dec)
	    };
	  };

	}());



	if (CustomEvent === undefined) {
	  var CustomEvent = function(type, params) {
	    params = params || { bubbles: false, cancelable: false, detail: undefined };
	    var e = document.createEvent( 'CustomEvent' );
	    e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail );
	    return e;
	  };

	  CustomEvent.prototype = window.Event.prototype;
	}

	var APP;
	var MAP, glx, gl;
	/*
	 * Note: OSMBuildings cannot use a single global world coordinate system.
	 *       The numerical accuracy required for such a system would be about
	 *       32bits to represent world-wide geometry faithfully within a few 
	 *       centimeters of accuracy. Most computations in OSMBuildings, however, 
	 *       are performed on a GPU where only IEEE floats with 23bits of accuracy
	 *       (plus 8 bits of range) are available.
	 *       Instead, OSMBuildings' coordinate system has a reference point
	 *       (MAP.position) at the viewport center, and all world positions are
	 *       expressed as distances in meters from that reference point. The 
	 *       reference point itself shifts with map panning so that all world 
	 *       positions relevant to the part of the world curently rendered on-screen 
	 *       can accurately be represented within the limited accuracy of IEEE floats.*/

	var OSMBuildings = function(options) {
	  APP = this; // references to this. Should make other globals obsolete.

	  options = options || {};

	  if (options.style) {
	    this.setStyle(options.style);
	  }

	  APP.baseURL = options.baseURL || '.';

	  render.bendRadius = 500;
	  render.bendDistance = 500;

	  render.backgroundColor = new Color(options.backgroundColor || BACKGROUND_COLOR).toArray();
	  render.fogColor        = new Color(options.fogColor        || FOG_COLOR).toArray();
	  render.highlightColor  = new Color(options.highlightColor  || HIGHLIGHT_COLOR).toArray();

	  render.Buildings.showBackfaces = options.showBackfaces;

	  APP.highQuality = !options.lowQuality;

	  render.effects = {};
	  var effects = options.effects || [];
	  for (var i = 0; i < effects.length; i++) {
	    render.effects[ effects[i] ] = true;
	  }

	  this.attribution = options.attribution || OSMBuildings.ATTRIBUTION;

	  APP.minZoom = parseFloat(options.minZoom) || 15;
	  APP.maxZoom = parseFloat(options.maxZoom) || 22;
	  if (APP.maxZoom < APP.minZoom) {
	    APP.maxZoom = APP.minZoom;
	  }
	};

	OSMBuildings.VERSION = '2.2.1';
	OSMBuildings.ATTRIBUTION = '© OSM Buildings <a href="http://osmbuildings.org">http://osmbuildings.org</a>';

	OSMBuildings.prototype = {

	  on: function(type, fn) {
	    gl.canvas.addEventListener(type, fn);
	    return this;
	  },

	  off: function(type, fn) {
	    gl.canvas.removeEventListener(type, fn);
	  },

	  emit: function(type, detail) {
	    var event = new CustomEvent(type, { detail:detail });
	    gl.canvas.dispatchEvent(event);
	  },

	  addTo: function(map) {
	    MAP = map;
	    glx = new GLX(MAP.container, MAP.width, MAP.height, APP.highQuality);
	    gl = glx.context;

	    MAP.addLayer(this);

	    this.setDate(new Date());

	    render.start();

	    return this;
	  },

	  remove: function() {
	    render.stop();
	    MAP.removeLayer(this);
	    MAP = null;
	  },

	  setStyle: function(style) {
	    //render.backgroundColor = new Color(options.backgroundColor || BACKGROUND_COLOR).toArray();
	    //render.fogColor        = new Color(options.fogColor        || FOG_COLOR).toArray();
	    //render.highlightColor  = new Color(options.highlightColor  || HIGHLIGHT_COLOR).toArray();

	    DEFAULT_COLOR = style.color || style.wallColor || DEFAULT_COLOR;
	    //if (color.isValid) {
	    //  DEFAULT_COLOR = color.toArray();
	    //}
	    return this;
	  },

	  setDate: function(date) {
	    Sun.setDate(typeof date === 'string' ? new Date(date) : date);
	    return this;
	  },

	  // TODO: this should be part of the underlying map engine
	  /* Returns the screen position of the point at 'latitude'/'longitude' with
	    'elevation'.
	   */
	  project: function(latitude, longitude, elevation) {
	    var
	      metersPerDegreeLongitude = METERS_PER_DEGREE_LATITUDE * 
	                                 Math.cos(MAP.position.latitude / 180 * Math.PI),
	      worldPos = [ (longitude- MAP.position.longitude) * metersPerDegreeLongitude,
	                  -(latitude - MAP.position.latitude)  * METERS_PER_DEGREE_LATITUDE,
	                    elevation                          * HEIGHT_SCALE ];
	    // takes current cam pos into account.
	    var posNDC = transformVec3( render.viewProjMatrix.data, worldPos);
	    posNDC = mul3scalar( add3(posNDC, [1, 1, 1]), 1/2); // from [-1..1] to [0..1]
	    
	    return { x:    posNDC[0]  * MAP.width,
	             y: (1-posNDC[1]) * MAP.height,
	             z:    posNDC[2]
	    };
	  },

	  // TODO: this should be part of the underlying map engine
	  /* returns the geographic position (latitude/longitude) of the map layer 
	   * (elevation==0) at viewport position (x,y), or 'undefined' if no part of the
	   * map plane would be rendered at (x,y) - e.g. if (x,y) lies above the horizon.
	   */
	  unproject: function(x, y) {
	    var inverse = glx.Matrix.invert(render.viewProjMatrix.data);
	    /* convert window/viewport coordinates to NDC [0..1]. Note that the browser 
	     * screen coordinates are y-down, while the WebGL NDC coordinates are y-up, 
	     * so we have to invert the y value here */
	    var posNDC = [x/MAP.width, 1-y/MAP.height]; 
	    posNDC = add2( mul2scalar(posNDC, 2.0), [-1, -1, -1]); // [0..1] to [-1..1];
	    var worldPos = getIntersectionWithXYPlane(posNDC[0], posNDC[1], inverse);
	    if (worldPos === undefined) {
	      return;
	    }
	    metersPerDegreeLongitude = METERS_PER_DEGREE_LATITUDE *
	                               Math.cos(MAP.position.latitude / 180 * Math.PI);

	    return {
	      latitude:  MAP.position.latitude - worldPos[1]/ METERS_PER_DEGREE_LATITUDE,
	      longitude: MAP.position.longitude+ worldPos[0]/ metersPerDegreeLongitude
	    };
	  },

	  //// TODO: this should be part of the underlying map engine
	  //getBounds: function(latitude, longitude, elevation) {},

	  addOBJ: function(url, position, options) {
	    return new mesh.OBJ(url, position, options);
	  },

	  addGeoJSON: function(url, options) {
	    return new mesh.GeoJSON(url, options);
	  },

	  // TODO: allow more data layers later on
	  addGeoJSONTiles: function(url, options) {
	    options = options || {};
	    options.fixedZoom = options.fixedZoom || 15;
	    APP.dataGrid = new Grid(url, data.Tile, options);
	    return APP.dataGrid;
	  },

	  addMapTiles: function(url, options) {
	    APP.basemapGrid = new Grid(url, basemap.Tile, options);
	    return APP.basemapGrid;
	  },

	  highlight: function(id) {
	    render.Buildings.highlightID = id ? render.Picking.idToColor(id) : null;
	    return this;
	  },

	  // TODO: check naming. show() suggests it affects the layer rather than objects on it
	  show: function(selector, duration) {
	    Filter.remove('hidden', selector, duration);
	    return this;
	  },

	  // TODO: check naming. hide() suggests it affects the layer rather than objects on it
	  hide: function(selector, duration) {
	    Filter.add('hidden', selector, duration);
	    return this;
	  },

	  getTarget: function(x, y, callback) {
	    // TODO: use promises here
	    render.Picking.getTarget(x, y, callback);
	    return this;
	  },

	  screenshot: function(callback) {
	    // TODO: use promises here
	    render.screenshotCallback = callback;
	    return this;
	  },

	  destroy: function() {
	    render.destroy();
	    if (APP.basemapGrid) APP.basemapGrid.destroy();
	    if (APP.dataGrid)    APP.dataGrid.destroy();

	    // TODO: when taking over an existing canvas, don't destroy it here
	    glx.destroy();
	  }
	};

	//*****************************************************************************

	if (typeof global.define === 'function') {
	  global.define([], OSMBuildings);
	} else if (typeof global.exports === 'object') {
	  global.module.exports = OSMBuildings;
	} else {
	  global.OSMBuildings = OSMBuildings;
	}


	var Activity = {};

	// TODO: could turn into a public loading handler
	// OSMB.loader - stop(), start(), isBusy(), events..

	(function() {

	  var count = 0;
	  var debounce;

	  Activity.setBusy = function() {
	    //console.log('setBusy', count);

	    if (!count) {
	      if (debounce) {
	        clearTimeout(debounce);
	        debounce = null;
	      } else {
	        APP.emit('busy');
	      }
	    }
	    count++;
	  };

	  Activity.setIdle = function() {
	    if (!count) {
	      return;
	    }

	    count--;
	    if (!count) {
	      debounce = setTimeout(function() {
	        debounce = null;
	        APP.emit('idle');
	      }, 33);
	    }

	    //console.log('setIdle', count);
	  };

	  Activity.isBusy = function() {
	    return !!count;
	  };

	}());


	var TILE_SIZE = 256;

	var DEFAULT_HEIGHT = 10;
	var HEIGHT_SCALE = 1.0;

	var MAX_USED_ZOOM_LEVEL = 25;
	var DEFAULT_COLOR = 'rgb(220, 210, 200)';
	var HIGHLIGHT_COLOR = '#f08000';
	var FOG_COLOR = '#f0f8ff';
	var BACKGROUND_COLOR = '#efe8e0';

	var document = global.document;

	var EARTH_RADIUS_IN_METERS = 6378137;
	var EARTH_CIRCUMFERENCE_IN_METERS = EARTH_RADIUS_IN_METERS * Math.PI * 2;
	var METERS_PER_DEGREE_LATITUDE = EARTH_CIRCUMFERENCE_IN_METERS / 360;

	/* For shadow mapping, the camera rendering the scene as seen by the sun has
	 * to cover everything that's also visible to the user. For this to work 
	 * reliably, we have to make assumptions on how high (in [m]) the buildings 
	 * can become.
	 * Note: using a lower-than-accurate value will lead to buildings parts at the
	 * edge of the viewport to have incorrect shadows. Using a higher-than-necessary
	 * value will lead to an unnecessarily large view area and thus to poor shadow
	 * resolution. */
	var SHADOW_MAP_MAX_BUILDING_HEIGHT = 100;

	/* for shadow mapping, the scene needs to be rendered into a depth map as seen
	 * by the light source. This rendering can have arbitrary dimensions -
	 * they need not be related to the visible viewport size in any way. The higher
	 * the resolution (width and height) for this depth map the smaller are
	 * the visual artifacts introduced by shadow mapping. But increasing the
	 * shadow depth map size impacts rendering performance */
	var SHADOW_DEPTH_MAP_SIZE = 2048;


	var Request = {};

	(function() {

	  var queue = {};

	  function load(url, callback) {
	    if (queue[url]) {
	      return queue[url];
	    }

	    var req = new XMLHttpRequest();

	    req.onreadystatechange = function() {
	      if (req.readyState !== 4) {
	        return;
	      }

	      delete queue[url];

	      if (!req.status || req.status<200 || req.status>299) {
	        return;
	      }

	      callback(req);
	    };

	    queue[url] = req;
	    req.open('GET', url);
	    req.send(null);

	    return {
	      abort: function() {
	        if (queue[url]) {
	          req.abort();
	          delete queue[url];
	        }
	      }
	    };
	  }

	  //***************************************************************************

	  Request.getText = function(url, callback) {
	    return load(url, function(res) {
	      if (res.responseText !== undefined) {
	        callback(res.responseText);
	      }
	    });
	  };

	  Request.getXML = function(url, callback) {
	    return load(url, function(res) {
	      if (res.responseXML !== undefined) {
	        callback(res.responseXML);
	      }
	    });
	  };

	  Request.getJSON = function(url, callback) {
	    return load(url, function(res) {
	      if (res.responseText) {
	        var json;
	        try {
	          json = JSON.parse(res.responseText);
	        } catch(ex) {
	          console.warn('Could not parse JSON from '+ url +'\n'+ ex.message);
	        }
	        callback(json);
	      }
	    });
	  };

	  Request.abortAll = function() {
	    for (var url in queue) {
	      queue[url].abort();
	    }
	    queue = {};
	  };

	  Request.destroy = function() {
	    this.abortAll();
	  };

	}());

	/*function project(latitude, longitude, worldSize) {
	  var
	    x = longitude/360 + 0.5,
	    y = Math.min(1, Math.max(0, 0.5 - (Math.log(Math.tan((Math.PI/4) + (Math.PI/2)*latitude/180)) / Math.PI) / 2));
	  return { x: x*worldSize, y: y*worldSize };
	}

	function unproject(x, y, worldSize) {
	  x /= worldSize;
	  y /= worldSize;
	  return {
	    latitude: (2 * Math.atan(Math.exp(Math.PI * (1 - 2*y))) - Math.PI/2) * (180/Math.PI),
	    longitude: x*360 - 180
	  };
	}*/

	function pattern(str, param) {
	  return str.replace(/\{(\w+)\}/g, function(tag, key) {
	    return param[key] || tag;
	  });
	}

	function assert(condition, message) {
	  if (!condition) {
	    throw message;
	  }
	}

	/* returns a new list of points based on 'points' where the 3rd coordinate in
	 * each entry is set to 'zValue'
	 */
	function substituteZCoordinate(points, zValue) {
	  var res = [];
	  for (var i in points) {
	    res.push( [points[i][0], points[i][1], zValue] );
	  }
	  
	  return res;
	}


	var Shaders = {"interaction":{"vertex":"#ifdef GL_ES\n  precision mediump float;\n#endif\n#define halfPi 1.57079632679\nattribute vec4 aPosition;\nattribute vec3 aID;\nattribute vec4 aFilter;\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjMatrix;\nuniform mat4 uMatrix;\nuniform float uFogRadius;\nuniform float uTime;\nvarying vec4 vColor;\nuniform float uBendRadius;\nuniform float uBendDistance;\nvoid main() {\n  float t = clamp((uTime-aFilter.r) / (aFilter.g-aFilter.r), 0.0, 1.0);\n  float f = aFilter.b + (aFilter.a-aFilter.b) * t;\n  if (f == 0.0) {\n    gl_Position = vec4(0.0, 0.0, 0.0, 0.0);\n    vColor = vec4(0.0, 0.0, 0.0, 0.0);\n  } else {\n    vec4 pos = vec4(aPosition.x, aPosition.y, aPosition.z*f, aPosition.w);\n    //*** bending ***************************************************************\n  //  vec4 mwPosition = uViewMatrix * uModelMatrix * aPosition;\n  //\n  //  float innerRadius = uBendRadius + mwPosition.y;\n  //  float depth = abs(mwPosition.z);\n  //  float s = depth-uBendDistance;\n  //  float theta = min(max(s, 0.0)/uBendRadius, halfPi);\n  //\n  //  // halfPi*uBendRadius, not halfPi*innerRadius, because the \"base\" of a building\n  //  // travels the full uBendRadius path\n  //  float newY = cos(theta)*innerRadius - uBendRadius - max(s-halfPi*uBendRadius, 0.0);\n  //  float newZ = normalize(mwPosition.z) * (min(depth, uBendDistance) + sin(theta)*innerRadius);\n  //\n  //  vec4 newPosition = vec4(mwPosition.x, newY, newZ, 1.0);\n  //  gl_Position = uProjMatrix * newPosition;\n    gl_Position = uMatrix * pos;\n    vec4 mPosition = vec4(uModelMatrix * pos);\n    float distance = length(mPosition);\n    if (distance > uFogRadius) {\n      vColor = vec4(0.0, 0.0, 0.0, 0.0);\n    } else {\n      vColor = vec4(aID, 1.0);\n    }\n  }\n}\n","fragment":"#ifdef GL_ES\n  precision mediump float;\n#endif\nvarying vec4 vColor;\nvoid main() {\n  gl_FragColor = vColor;\n}\n"},"buildings":{"vertex":"#ifdef GL_ES\n  precision mediump float;\n#endif\n#define halfPi 1.57079632679\nattribute vec4 aPosition;\nattribute vec3 aNormal;\nattribute vec3 aColor;\nattribute vec4 aFilter;\nattribute vec3 aID;\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjMatrix;\nuniform mat4 uMatrix;\nuniform mat3 uNormalTransform;\nuniform vec3 uLightDirection;\nuniform vec3 uLightColor;\nuniform vec3 uHighlightColor;\nuniform vec3 uHighlightID;\nuniform vec2 uViewDirOnMap;\nuniform vec2 uLowerEdgePoint;\nuniform float uTime;\nvarying vec3 vColor;\nvarying float verticalDistanceToLowerEdge;\nfloat gradientHeight = 90.0;\nfloat gradientStrength = 0.4;\nuniform float uBendRadius;\nuniform float uBendDistance;\nvoid main() {\n  float t = clamp((uTime-aFilter.r) / (aFilter.g-aFilter.r), 0.0, 1.0);\n  float f = aFilter.b + (aFilter.a-aFilter.b) * t;\n  if (f == 0.0) {\n    gl_Position = vec4(0.0, 0.0, 0.0, 0.0);\n    vColor = vec3(0.0, 0.0, 0.0);\n  } else {\n    vec4 pos = vec4(aPosition.x, aPosition.y, aPosition.z*f, aPosition.w);\n    //*** bending ***************************************************************\n  //  vec4 mwPosition = uViewMatrix * uModelMatrix * aPosition;\n  //\n  //  float innerRadius = uBendRadius + mwPosition.y;\n  //  float depth = abs(mwPosition.z);\n  //  float s = depth-uBendDistance;\n  //  float theta = min(max(s, 0.0)/uBendRadius, halfPi);\n  //\n  //  // halfPi*uBendRadius, not halfPi*innerRadius, because the \"base\" of a building\n  //  // travels the full uBendRadius path\n  //  float newY = cos(theta)*innerRadius - uBendRadius - max(s-halfPi*uBendRadius, 0.0);\n  //  float newZ = normalize(mwPosition.z) * (min(depth, uBendDistance) + sin(theta)*innerRadius);\n  //\n  //  vec4 newPosition = vec4(mwPosition.x, newY, newZ, 1.0);\n  //  gl_Position = uProjMatrix * newPosition;\n    gl_Position = uMatrix * pos;\n    //*** highlight object ******************************************************\n    vec3 color = aColor;\n    if (uHighlightID.r == aID.r && uHighlightID.g == aID.g && uHighlightID.b == aID.b) {\n      color = mix(aColor, uHighlightColor, 0.5);\n    }\n    //*** light intensity, defined by light direction on surface ****************\n    vec3 transformedNormal = aNormal * uNormalTransform;\n    float lightIntensity = max( dot(transformedNormal, uLightDirection), 0.0) / 1.5;\n    color = color + uLightColor * lightIntensity;\n    //*** vertical shading ******************************************************\n    float verticalShading = clamp((gradientHeight-pos.z) / (gradientHeight/gradientStrength), 0.0, gradientStrength);\n    //***************************************************************************\n    vColor = color-verticalShading;\n    vec4 worldPos = uModelMatrix * pos;\n    vec2 dirFromLowerEdge = worldPos.xy / worldPos.w - uLowerEdgePoint;\n    verticalDistanceToLowerEdge = dot(dirFromLowerEdge, uViewDirOnMap);\n  }\n}\n","fragment":"#ifdef GL_ES\n  precision mediump float;\n#endif\nvarying vec3 vColor;\nvarying float verticalDistanceToLowerEdge;\nuniform vec3 uFogColor;\nuniform float uFogDistance;\nuniform float uFogBlurDistance;\nvoid main() {\n    \n  float fogIntensity = (verticalDistanceToLowerEdge - uFogDistance) / uFogBlurDistance;\n  fogIntensity = clamp(fogIntensity, 0.0, 1.0);\n  gl_FragColor = vec4( mix(vColor, uFogColor, fogIntensity), 1.0);\n}\n"},"buildings.shadows":{"vertex":"#ifdef GL_ES\n  precision mediump float;\n#endif\n#define halfPi 1.57079632679\nattribute vec4 aPosition;\nattribute vec3 aNormal;\nattribute vec3 aColor;\nattribute vec4 aFilter;\nattribute vec3 aID;\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjMatrix;\nuniform mat4 uMatrix;\nuniform mat4 uSunMatrix;\nuniform mat3 uNormalTransform;\nuniform vec3 uHighlightColor;\nuniform vec3 uHighlightID;\nuniform vec2 uViewDirOnMap;\nuniform vec2 uLowerEdgePoint;\nuniform float uTime;\nvarying vec3 vColor;\nvarying vec3 vNormal;\nvarying vec3 vSunRelPosition;\nvarying float verticalDistanceToLowerEdge;\nfloat gradientHeight = 90.0;\nfloat gradientStrength = 0.4;\nuniform float uBendRadius;\nuniform float uBendDistance;\nvoid main() {\n  float t = clamp((uTime-aFilter.r) / (aFilter.g-aFilter.r), 0.0, 1.0);\n  float f = aFilter.b + (aFilter.a-aFilter.b) * t;\n  if (f == 0.0) {\n    gl_Position = vec4(0.0, 0.0, 0.0, 0.0);\n    vColor = vec3(0.0, 0.0, 0.0);\n  } else {\n    vec4 pos = vec4(aPosition.x, aPosition.y, aPosition.z*f, aPosition.w);\n    //*** bending ***************************************************************\n  //  vec4 mwPosition = uViewMatrix * uModelMatrix * aPosition;\n  //\n  //  float innerRadius = uBendRadius + mwPosition.y;\n  //  float depth = abs(mwPosition.z);\n  //  float s = depth-uBendDistance;\n  //  float theta = min(max(s, 0.0)/uBendRadius, halfPi);\n  //\n  //  // halfPi*uBendRadius, not halfPi*innerRadius, because the \"base\" of a building\n  //  // travels the full uBendRadius path\n  //  float newY = cos(theta)*innerRadius - uBendRadius - max(s-halfPi*uBendRadius, 0.0);\n  //  float newZ = normalize(mwPosition.z) * (min(depth, uBendDistance) + sin(theta)*innerRadius);\n  //\n  //  vec4 newPosition = vec4(mwPosition.x, newY, newZ, 1.0);\n  //  gl_Position = uProjMatrix * newPosition;\n    gl_Position = uMatrix * pos;\n    //*** highlight object ******************************************************\n    vec3 color = aColor;\n    if (uHighlightID.r == aID.r && uHighlightID.g == aID.g && uHighlightID.b == aID.b) {\n      color = mix(aColor, uHighlightColor, 0.5);\n    }\n    //*** light intensity, defined by light direction on surface ****************\n    vNormal = aNormal;\n    //vec3 transformedNormal = aNormal * uNormalTransform;\n    //float lightIntensity = max( dot(aNormal, uLightDirection), 0.0) / 1.5;\n    //color = color + uLightColor * lightIntensity;\n    //*** vertical shading ******************************************************\n    float verticalShading = clamp((gradientHeight-pos.z) / (gradientHeight/gradientStrength), 0.0, gradientStrength);\n    //***************************************************************************\n    vColor = color-verticalShading;\n    vec4 worldPos = uModelMatrix * pos;\n    vec2 dirFromLowerEdge = worldPos.xy / worldPos.w - uLowerEdgePoint;\n    verticalDistanceToLowerEdge = dot(dirFromLowerEdge, uViewDirOnMap);\n    \n    // *** shadow mapping ********\n    vec4 sunRelPosition = uSunMatrix * pos;\n    vSunRelPosition = (sunRelPosition.xyz / sunRelPosition.w + 1.0) / 2.0;\n  }\n}\n","fragment":"#ifdef GL_ES\n  precision mediump float;\n#endif\nvarying vec3 vColor;\nvarying vec3 vNormal;\nvarying vec3 vSunRelPosition;\nvarying float verticalDistanceToLowerEdge;\nuniform vec3 uFogColor;\nuniform vec2 uShadowTexDimensions;\nuniform sampler2D uShadowTexIndex;\nuniform float uFogDistance;\nuniform float uFogBlurDistance;\nuniform float uShadowStrength;\nuniform vec3 uLightDirection;\nuniform vec3 uLightColor;\nfloat isSeenBySun(const vec2 sunViewNDC, const float depth, const float bias) {\n  if (clamp( sunViewNDC, 0.0, 1.0) != sunViewNDC)  // not inside sun's viewport\n    return 1.0;\n  \n  vec4 depthTexel = texture2D( uShadowTexIndex, sunViewNDC.xy);\n  \n  float depthFromTexture = depthTexel.x + \n                          (depthTexel.y / 255.0) + \n                          (depthTexel.z / (255.0 * 255.0));\n  //compare depth values not in reciprocal but in linear depth\n  return step(1.0/depthFromTexture, 1.0/depth + bias);\n}\nvoid main() {\n  vec3 normal = normalize(vNormal); //may degenerate during per-pixel interpolation\n  float diffuse = dot(uLightDirection, normalize(vNormal));\n  diffuse = max(diffuse, 0.0);\n  float shadowStrength = 1.0 - pow(diffuse, 1.5);\n  if (diffuse > 0.0) {\n    // note: the diffuse term is also the cosine between the surface normal and the\n    // light direction\n    float bias = clamp(0.0007*tan(acos(diffuse)), 0.0, 0.01);\n    vec2 pos = fract( vSunRelPosition.xy * uShadowTexDimensions);\n    \n    vec2 tl = floor(vSunRelPosition.xy * uShadowTexDimensions) / uShadowTexDimensions;\n    float tlVal = isSeenBySun( tl,                           vSunRelPosition.z, bias);\n    float trVal = isSeenBySun( tl + vec2(1.0, 0.0) / uShadowTexDimensions, vSunRelPosition.z, bias);\n    float blVal = isSeenBySun( tl + vec2(0.0, 1.0) / uShadowTexDimensions, vSunRelPosition.z, bias);\n    float brVal = isSeenBySun( tl + vec2(1.0, 1.0) / uShadowTexDimensions, vSunRelPosition.z, bias);\n    diffuse *= mix( mix(tlVal, trVal, pos.x), \n                   mix(blVal, brVal, pos.x),\n                   pos.y);\n  }\n  diffuse = mix(1.0, diffuse, shadowStrength);\n  vec3 color = vColor + (diffuse/1.5) * uLightColor;\n    \n  float fogIntensity = (verticalDistanceToLowerEdge - uFogDistance) / uFogBlurDistance;\n  fogIntensity = clamp(fogIntensity, 0.0, 1.0);\n  gl_FragColor = vec4( mix(color, uFogColor, fogIntensity), 1.0);\n}\n"},"skydome":{"vertex":"#ifdef GL_ES\n  precision mediump float;\n#endif\n#define halfPi 1.57079632679\nattribute vec4 aPosition;\nattribute vec2 aTexCoord;\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjMatrix;\nuniform mat4 uMatrix;\nvarying vec2 vTexCoord;\nvarying float vFogIntensity;\nfloat gradientHeight = 10.0;\nfloat gradientStrength = 1.0;\nuniform float uBendRadius;\nuniform float uBendDistance;\nvoid main() {\n  //*** bending ***************************************************************\n//  vec4 mwPosition = uViewMatrix * uModelMatrix * aPosition;\n//\n//  float innerRadius = uBendRadius + mwPosition.y;\n//  float depth = abs(mwPosition.z);\n//  float s = depth-uBendDistance;\n//  float theta = min(max(s, 0.0)/uBendRadius, halfPi);\n//\n//  // halfPi*uBendRadius, not halfPi*innerRadius, because the \"base\" of a building\n//  // travels the full uBendRadius path\n//  float newY = cos(theta)*innerRadius - uBendRadius - max(s-halfPi*uBendRadius, 0.0);\n//  float newZ = normalize(mwPosition.z) * (min(depth, uBendDistance) + sin(theta)*innerRadius);\n//\n//  vec4 newPosition = vec4(mwPosition.x, newY, newZ, 1.0);\n//  gl_Position = uProjMatrix * newPosition;\n  gl_Position = uMatrix * aPosition;\n  vTexCoord = aTexCoord;\n  vFogIntensity = clamp((gradientHeight-aPosition.z) / (gradientHeight/gradientStrength), 0.0, gradientStrength);\n}\n","fragment":"#ifdef GL_ES\n  precision mediump float;\n#endif\nuniform sampler2D uTexIndex;\nuniform vec3 uFogColor;\nvarying vec2 vTexCoord;\nvarying float vFogIntensity;\nvoid main() {\n  vec3 color = vec3(texture2D(uTexIndex, vec2(vTexCoord.x, -vTexCoord.y)));\n  gl_FragColor = vec4(mix(color, uFogColor, vFogIntensity), 1.0);\n}\n"},"basemap":{"vertex":"#ifdef GL_ES\n  precision mediump float;\n#endif\n#define halfPi 1.57079632679\nattribute vec4 aPosition;\nattribute vec2 aTexCoord;\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjMatrix;\nuniform mat4 uMatrix;\nuniform vec2 uViewDirOnMap;\nuniform vec2 uLowerEdgePoint;\nvarying vec2 vTexCoord;\nvarying float verticalDistanceToLowerEdge;\nuniform float uBendRadius;\nuniform float uBendDistance;\nvoid main() {\n  //*** bending ***************************************************************\n//  vec4 mwPosition = uViewMatrix * uModelMatrix * aPosition;\n//\n//  float innerRadius = uBendRadius + mwPosition.y;\n//  float depth = abs(mwPosition.z);\n//  float s = depth-uBendDistance;\n//  float theta = min(max(s, 0.0)/uBendRadius, halfPi);\n//\n//  // halfPi*uBendRadius, not halfPi*innerRadius, because the \"base\" of a building\n//  // travels the full uBendRadius path\n//  float newY = cos(theta)*innerRadius - uBendRadius - max(s-halfPi*uBendRadius, 0.0);\n//  float newZ = normalize(mwPosition.z) * (min(depth, uBendDistance) + sin(theta)*innerRadius);\n//\n//  vec4 newPosition = vec4(mwPosition.x, newY, newZ, 1.0);\n//  vec4 glPosition = uProjMatrix * newPosition;\n  gl_Position = uMatrix * aPosition;\n  vTexCoord = aTexCoord;\n  vec4 worldPos = uModelMatrix * aPosition;\n  vec2 dirFromLowerEdge = worldPos.xy / worldPos.w - uLowerEdgePoint;\n  verticalDistanceToLowerEdge = dot(dirFromLowerEdge, uViewDirOnMap);\n}\n","fragment":"#ifdef GL_ES\n  precision mediump float;\n#endif\nuniform sampler2D uTexIndex;\nuniform vec3 uFogColor;\nvarying vec2 vTexCoord;\nvarying float verticalDistanceToLowerEdge;\nuniform float uFogDistance;\nuniform float uFogBlurDistance;\nvoid main() {\n  float fogIntensity = (verticalDistanceToLowerEdge - uFogDistance) / uFogBlurDistance;\n  fogIntensity = clamp(fogIntensity, 0.0, 1.0);\n  vec3 color = vec3(texture2D(uTexIndex, vec2(vTexCoord.x, 1.0-vTexCoord.y)));\n  gl_FragColor = vec4(mix(color, uFogColor, fogIntensity), 1.0);\n}\n"},"texture":{"vertex":"#ifdef GL_ES\n  precision mediump float;\n#endif\nattribute vec4 aPosition;\nattribute vec2 aTexCoord;\nuniform mat4 uMatrix;\nvarying vec2 vTexCoord;\nvoid main() {\n  gl_Position = uMatrix * aPosition;\n  vTexCoord = aTexCoord;\n}\n","fragment":"#ifdef GL_ES\n  precision mediump float;\n#endif\nuniform sampler2D uTexIndex;\nvarying vec2 vTexCoord;\nvoid main() {\n  gl_FragColor = vec4(texture2D(uTexIndex, vTexCoord.st).rgb, 1.0);\n}\n"},"normalmap":{"vertex":"#ifdef GL_ES\n  precision mediump float;\n#endif\nattribute vec4 aPosition;\nattribute vec3 aNormal;\nattribute vec4 aFilter;\nuniform mat4 uMatrix;\nuniform float uTime;\nvarying vec3 vNormal;\nvoid main() {\n  float t = clamp((uTime-aFilter.r) / (aFilter.g-aFilter.r), 0.0, 1.0);\n  float f = aFilter.b + (aFilter.a-aFilter.b) * t;\n  if (f == 0.0) {\n    gl_Position = vec4(0.0, 0.0, 0.0, 0.0);\n    vNormal = vec3(0.0, 0.0, 0.0);\n  } else {\n    gl_Position = uMatrix * vec4(aPosition.x, aPosition.y, aPosition.z*f, aPosition.w);\n    vNormal = aNormal;\n  }\n}","fragment":"#ifdef GL_ES\n  precision mediump float;\n#endif\n//uniform sampler2D uTexIndex;\nvarying vec2 vTexCoord;\nvarying vec3 vNormal;\nvoid main() {\n  gl_FragColor = vec4( (vNormal + 1.0)/2.0, 1.0);\n}\n"},"depth":{"vertex":"#ifdef GL_ES\n  precision mediump float;\n#endif\nattribute vec4 aPosition;\nattribute vec4 aFilter;\nuniform mat4 uMatrix;\nuniform mat4 uModelMatrix;\nuniform vec2 uViewDirOnMap;\nuniform vec2 uLowerEdgePoint;\nvarying float verticalDistanceToLowerEdge;\nuniform float uTime;\nvoid main() {\n  float t = clamp((uTime-aFilter.r) / (aFilter.g-aFilter.r), 0.0, 1.0);\n  float f = aFilter.b + (aFilter.a-aFilter.b) * t;\n  if (f == 0.0) {\n    gl_Position = vec4(0.0, 0.0, 0.0, 0.0);\n    verticalDistanceToLowerEdge = 0.0;\n  } else {\n    vec4 pos = vec4(aPosition.x, aPosition.y, aPosition.z*f, aPosition.w);\n    gl_Position = uMatrix * pos;\n    /* in order for the SSAO (which is based on this depth shader) to work\n     * correctly in conjunction with the fog shading, we need to replicate\n     * the fog computation here. This way, the ambient occlusion shader can\n     * later attenuate the ambient occlusion effect in the foggy areas.*/\n    vec4 worldPos = uModelMatrix * pos;\n    vec2 dirFromLowerEdge = worldPos.xy / worldPos.w - uLowerEdgePoint;\n    verticalDistanceToLowerEdge = dot(dirFromLowerEdge, uViewDirOnMap);\n  }\n}\n","fragment":"\n#ifdef GL_ES\n  precision mediump float;\n#endif\nuniform float uFogDistance;\nuniform float uFogBlurDistance;\nuniform int   uIsPerspectiveProjection;\nvarying float verticalDistanceToLowerEdge;\n/* Note: the depth shader needs to not only store depth information, but\n *       also the fog intensity as well.\n * Rationale: In the current infrastructure, ambient occlusion does not \n * directly affect the building and map shading, but rather is later blended \n * onto the whole scene as a screen-space effect. This, however, is not\n * compatible with fogging: buildings in the fog gradually blend into the \n * background, but the ambient occlusion applied in screen space does not.\n * In the foggy area, this yields barely visible buildings with fully visible\n * ambient occlusion - an irritating effect.\n * To fix this, the depth shader stores not only depth values per pixel, but\n * also computes the fog intensity and stores it in the depth texture along\n * with the color-encoded depth values.\n * This way, the ambient occlusion shader can later not only compute the\n * actual ambient occlusion based on the depth values, but can attenuate\n * the effect in the foggy areas based on the fog intensity.\n */\nvoid main() {\n  /* for an orthographic projection, the value in gl_FragCoord.z is proportional \n   * to the fragment's 'physical' depth value. It's just scaled down so that the\n   * whole depth range can be compressed into [0..1]. This is quite suitable for\n   * processing in subsequent shaders.\n   * For perspective projections, however, the relationship between 'physical'\n   * depth values and gl_FragCoord.z is distorted by the perspective division.\n   * So we attempt correct that distortion when the fragment was created\n   * through a perspective projection.\n   **/\n  float z = uIsPerspectiveProjection == 0 ?  gl_FragCoord.z : \n                                            (gl_FragCoord.z / gl_FragCoord.w)/7500.0;\n  float z1 = fract(z*255.0);\n  float z2 = fract(z1*255.0);\n  //this biasing is necessary for shadow mapping to work correctly\n  //source: http://forum.devmaster.net/t/shader-effects-shadow-mapping/3002\n  // this might be due to the GPU *rounding* the float values to the nearest uint8_t instead of the expeected *truncating*\n  z  -= 1.0/255.0*z1;\n  z1 -= 1.0/255.0*z2;\n  float fogIntensity = (verticalDistanceToLowerEdge - uFogDistance) / uFogBlurDistance;\n  fogIntensity = clamp(fogIntensity, 0.0, 1.0);\n  // option 1: this line outputs high-precision (24bit) depth values\n  gl_FragColor = vec4(z, z1, z2, fogIntensity);\n  \n  // option 2: this line outputs human-interpretable depth values, but with low precision\n  //gl_FragColor = vec4(z, z, z, 1.0); \n}\n"},"ambientFromDepth":{"vertex":"#ifdef GL_ES\n  precision mediump float;\n#endif\nattribute vec4 aPosition;\nattribute vec2 aTexCoord;\nuniform mat4 uMatrix;\nvarying vec2 vTexCoord;\nvoid main() {\n  gl_Position = uMatrix * aPosition;\n  vTexCoord = aTexCoord;\n}\n","fragment":"#ifdef GL_FRAGMENT_PRECISION_HIGH\n  // we need high precision for the depth values\n  precision highp float;\n#else\n  precision mediump float;\n#endif\nuniform sampler2D uTexIndex;\nuniform float uInverseTexWidth;   //in 1/pixels, e.g. 1/512 if the texture is 512px wide\nuniform float uInverseTexHeight;  //in 1/pixels\nuniform float uEffectStrength;\nvarying vec2 vTexCoord;\n/* Retrieves the depth value (dx, dy) pixels away from 'pos' from texture 'uTexIndex'. */\nfloat getDepth(vec2 pos, int dx, int dy)\n{\n  //retrieve the color-coded depth\n  vec4 codedDepth = texture2D(uTexIndex, vec2(pos.s + float(dx) * uInverseTexWidth, \n                                              pos.t + float(dy) * uInverseTexHeight));\n  //convert back to depth value\n  return (codedDepth.x + \n         codedDepth.y/ 255.0 +\n         codedDepth.z/(255.0*255.0)) / 256.0 * 255.0;\n}\n/* getOcclusionFactor() determines a heuristic factor (from [0..1]) for how \n * much the fragment at 'pos' with depth 'depthHere'is occluded by the \n * fragment that is (dx, dy) texels away from it.\n */\nfloat getOcclusionFactor(float depthHere, vec2 pos, int dx, int dy)\n{\n    float depthThere = getDepth(pos, dx, dy);\n    /* if the fragment at (dx, dy) has no depth (i.e. there was nothing rendered there), \n     * then 'here' is not occluded (result 1.0) */\n    if (depthThere == 0.0)\n      return 1.0;\n    /* if the fragment at (dx, dy) is further away from the viewer than 'here', then\n     * 'here is not occluded' */\n    if (depthHere < depthThere )\n      return 1.0;\n      \n    float relDepthDiff = depthThere / depthHere;\n    /* if the fragment at (dx, dy) is closer to the viewer than 'here', then it occludes\n     * 'here'. The occlusion is the higher the bigger the depth difference between the two\n     * locations is.\n     * However, if the depth difference is too high, we assume that 'there' lies in a\n     * completely different depth region of the scene than 'here' and thus cannot occlude\n     * 'here'. This last assumption gets rid of very dark artifacts around tall buildings.\n     */\n    return relDepthDiff > 0.95 ? relDepthDiff : 1.0;\n}\n/* This shader approximates the ambient occlusion in screen space (SSAO). \n * It is based on the assumption that a pixel will be occluded by neighboring \n * pixels iff. those have a depth value closer to the camera than the original\n * pixel itself (the function getOcclusionFactor() computes this occlusion \n * by a single other pixel).\n *\n * A naive approach would sample all pixels within a given distance. For an\n * interesting-looking effect, the sampling area needs to be at least 9 pixels \n * wide (-/+ 4), requiring 81 texture lookups per pixel for ambient occlusion.\n * This overburdens many GPUs.\n * To make the ambient occlusion computation faster, we employ the following \n * tricks:\n * 1. We do not consider all texels in the sampling area, but only a select few \n *    (at most 16). This causes some sampling artifacts, which are later\n *    removed by blurring the ambient occlusion texture (this is done in a\n *    separate shader).\n * 2. The further away an object is the fewer samples are considered and the\n *    closer are these samples to the texel for which the ambient occlusion is\n *    being computed. The rationale is that ambient occlusion attempts to de-\n *    determine occlusion by *nearby* other objects. Due to the perspective \n *    projection, the further away objects are, the smaller they become. \n *    So the further away objects are, the closer are those nearby other objects\n *    in screen-space, and thus texels further away no longer need to be \n *    considered.\n *    As a positive side-effect, this also reduces the total number of texels \n *    that need to be sampled.\n */\nvoid main() {\n  float depthHere = getDepth(vTexCoord.st, 0, 0);\n  float fogIntensity = texture2D(uTexIndex, vTexCoord.st).w;\n  if (depthHere == 0.0)\n  {\n\t//there was nothing rendered 'here' --> it can't be occluded\n    gl_FragColor = vec4(1.0);\n    return;\n  }\n  \n  float occlusionFactor = 1.0;\n  \n  //always consider the direct horizontal and vertical neighbors for the ambient map \n  occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord.st,  -1,   0);\n  occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord.st,  +1,   0);\n  occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord.st,   0,  -1);\n  occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord.st,   0,  +1);\n  /* note: exponents are hand-tuned to give about the same brightness no matter\n   *       how many samples are considered (4, 8 or 16) */\n  float exponent = 60.0;  \n  \n  if (depthHere < 0.4)\n  {\n    /* for closer objects, also consider the texels that are two pixels \n     * away diagonally. */\n    occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord.st,  -2,  -2);\n    occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord.st,  +2,  +2);\n    occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord.st,  +2,  -2);\n    occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord.st,  -2,  +2);\n    exponent = 12.0;\n  }\n    \n  if (depthHere < 0.3)\n  {\n    /* for the closest objects, also consider the texels that are four pixels \n     * away horizontally, vertically and diagonally */\n    occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord.st,  -4,   0);\n    occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord.st,  +4,   0);\n    occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord.st,   0,  -4);\n    occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord.st,   0,  +4);\n    occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord.st,  -4,  -4);\n    occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord.st,  +4,  +4);\n    occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord.st,  +4,  -4);\n    occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord.st,  -4,  +4);\n    exponent = 4.0;\n  }\n  occlusionFactor = pow(occlusionFactor, exponent);\n  occlusionFactor = 1.0 - ((1.0 - occlusionFactor) * uEffectStrength);\n  \n  occlusionFactor = 1.0 - ((1.0- occlusionFactor) * (1.0-fogIntensity));\n  gl_FragColor = vec4( vec3(occlusionFactor) , 1.0);\n}\n"},"blur":{"vertex":"#ifdef GL_ES\n  precision mediump float;\n#endif\nattribute vec4 aPosition;\nattribute vec2 aTexCoord;\nuniform mat4 uMatrix;\nvarying vec2 vTexCoord;\nvoid main() {\n  gl_Position = uMatrix * aPosition;\n  vTexCoord = aTexCoord;\n}\n","fragment":"#ifdef GL_ES\n  precision mediump float;\n#endif\nuniform sampler2D uTexIndex;\nuniform float uInverseTexWidth;   //in 1/pixels, e.g. 1/512 if the texture is 512px wide\nuniform float uInverseTexHeight;  //in 1/pixels\nvarying vec2 vTexCoord;\n/* Retrieves the texel color at (dx, dy) pixels away from 'pos' from texture 'uTexIndex'. */\nvec4 getTexel(vec2 pos, int dx, int dy)\n{\n  //retrieve the color-coded depth\n  return texture2D(uTexIndex, vec2(pos.s + float(dx) * uInverseTexWidth, \n                                   pos.t + float(dy) * uInverseTexHeight));\n}\nvoid main() {\n  vec4 center = texture2D(uTexIndex, vTexCoord);\n  vec4 nonDiagonalNeighbors = getTexel(vTexCoord, -1, 0) +\n                              getTexel(vTexCoord, +1, 0) +\n                              getTexel(vTexCoord,  0,-1) +\n                              getTexel(vTexCoord,  0,+1);\n  vec4 diagonalNeighbors =    getTexel(vTexCoord, -1,-1) +\n                              getTexel(vTexCoord, +1,+1) +\n                              getTexel(vTexCoord, -1,+1) +\n                              getTexel(vTexCoord, +1,-1);  \n  \n  //approximate Gaussian blur (mean 0.0, stdev 1.0)\n  gl_FragColor = 0.2/1.0 * center + \n                 0.5/4.0 * nonDiagonalNeighbors + \n                 0.3/4.0 * diagonalNeighbors;\n}\n"},"basemap.shadows":{"vertex":"#ifdef GL_ES\n  precision mediump float;\n#endif\nattribute vec3 aPosition;\nattribute vec3 aNormal;\nuniform mat4 uModelMatrix;\nuniform mat4 uMatrix;\nuniform mat4 uSunMatrix;\nuniform vec2 uViewDirOnMap;\nuniform vec2 uLowerEdgePoint;\n//varying vec2 vTexCoord;\nvarying vec3 vSunRelPosition;\nvarying vec3 vNormal;\nvarying float verticalDistanceToLowerEdge;\nvoid main() {\n  vec4 pos = vec4(aPosition.xyz, 1.0);\n  gl_Position = uMatrix * pos;\n  vec4 sunRelPosition = uSunMatrix * pos;\n  vSunRelPosition = (sunRelPosition.xyz / sunRelPosition.w + 1.0) / 2.0;\n  vNormal = aNormal;\n  vec4 worldPos = uModelMatrix * pos;\n  vec2 dirFromLowerEdge = worldPos.xy / worldPos.w - uLowerEdgePoint;\n  verticalDistanceToLowerEdge = dot(dirFromLowerEdge, uViewDirOnMap);\n}\n","fragment":"#ifdef GL_ES\n  precision mediump float;\n#endif\n/* This shader computes the diffuse brightness of the map layer. It does *not* \n * render the map texture itself, but is instead intended to be blended on top\n * of an already rendered map.\n * Note: this shader is not (and does not attempt to) be physically correct.\n *       It is intented to be a blend between a useful illustration of cast\n *       shadows and a mitigation of shadow casting artifacts occuring at\n *       low angles on incidence.\n *       Map brightness is only affected by shadows, not by light direction.\n *       Shadows are darkest when light comes from straight above (and thus\n *       shadows can be computed reliably) and become less and less visible\n *       with the light source close to the horizont (where moirC) and offset\n *       artifacts would otherwise be visible).\n */\n//uniform sampler2D uTexIndex;\nuniform sampler2D uShadowTexIndex;\nuniform vec3 uFogColor;\nuniform vec3 uDirToSun;\nuniform vec2 uShadowTexDimensions;\nuniform float uShadowStrength;\nvarying vec2 vTexCoord;\nvarying vec3 vSunRelPosition;\nvarying vec3 vNormal;\nvarying float verticalDistanceToLowerEdge;\nuniform float uFogDistance;\nuniform float uFogBlurDistance;\nfloat isSeenBySun( const vec2 sunViewNDC, const float depth, const float bias) {\n  if ( clamp( sunViewNDC, 0.0, 1.0) != sunViewNDC)  //not inside sun's viewport\n    return 1.0;\n  \n  vec4 depthTexel = texture2D(uShadowTexIndex, sunViewNDC.xy);\n  \n  float depthFromTexture = depthTexel.x + \n                          (depthTexel.y / 255.0) + \n                          (depthTexel.z / (255.0 * 255.0));\n  //compare depth values not in reciprocal but in linear depth\n  return step( 1.0/depthFromTexture, 1.0/depth + bias);\n}\nvoid main() {\n  float diffuse = dot(uDirToSun, normalize(vNormal));\n  diffuse = max(diffuse, 0.0);\n  \n  float shadowStrength = uShadowStrength * (1.0 - pow(diffuse, 1.5));\n  if (diffuse > 0.0) {\n    // note: the diffuse term is also the cosine between the surface normal and the\n    // light direction\n    float bias = clamp(0.0007*tan(acos(diffuse)), 0.0, 0.01);\n    \n    vec2 pos = fract( vSunRelPosition.xy * uShadowTexDimensions);\n    \n    vec2 tl = floor(vSunRelPosition.xy * uShadowTexDimensions) / uShadowTexDimensions;\n    float tlVal = isSeenBySun( tl,                           vSunRelPosition.z, bias);\n    float trVal = isSeenBySun( tl + vec2(1.0, 0.0) / uShadowTexDimensions, vSunRelPosition.z, bias);\n    float blVal = isSeenBySun( tl + vec2(0.0, 1.0) / uShadowTexDimensions, vSunRelPosition.z, bias);\n    float brVal = isSeenBySun( tl + vec2(1.0, 1.0) / uShadowTexDimensions, vSunRelPosition.z, bias);\n    diffuse = mix( mix(tlVal, trVal, pos.x), \n                   mix(blVal, brVal, pos.x),\n                   pos.y);\n  }\n  diffuse = mix(1.0, diffuse, shadowStrength);\n  \n  float fogIntensity = (verticalDistanceToLowerEdge - uFogDistance) / uFogBlurDistance;\n  fogIntensity = clamp(fogIntensity, 0.0, 1.0);\n  float darkness = (1.0 - diffuse);\n  darkness *=  (1.0 - fogIntensity);\n  gl_FragColor = vec4(vec3(1.0 - darkness), 1.0);\n}\n"}};


	var Grid = function(source, tileClass, options) {
	  this.tiles = {};
	  this.buffer = 1;

	  this.source = source;
	  this.tileClass = tileClass;
	  options = options || {};

	  this.bounds = options.bounds;
	  this.fixedZoom = options.fixedZoom;

	  this.tileOptions = { color:options.color };

	  this.minZoom = parseFloat(options.minZoom) || APP.minZoom;
	  this.maxZoom = parseFloat(options.maxZoom) || APP.maxZoom;
	  if (this.maxZoom < this.minZoom) {
	    this.maxZoom = this.minZoom;
	  }

	  MAP.on('change', this._onChange = function() {
	    this.update(500);
	  }.bind(this));

	  MAP.on('resize', this._onResize = this.update.bind(this));

	  this.update();
	};

	Grid.prototype = {

	  // strategy: start loading after {delay}ms, skip any attempts until then
	  // effectively loads in intervals during movement
	  update: function(delay) {
	    if (MAP.zoom < this.minZoom || MAP.zoom > this.maxZoom) {
	      return;
	    }

	    if (!delay) {
	      this.loadTiles();
	      return;
	    }

	    if (!this.debounce) {
	      this.debounce = setTimeout(function() {
	        this.debounce = null;
	        this.loadTiles();
	      }.bind(this), delay);
	    }
	  },

	  getURL: function(x, y, z) {
	    var s = 'abcd'[(x+y) % 4];
	    return pattern(this.source, { s:s, x:x, y:y, z:z });
	  },
	  
	  getClosestTiles: function(tileList, referencePoint) {
	    tileList.sort(function(a, b) {
	      // tile coordinates correspond to the tile's upper left corner, but for
	      // the distance computation we should rather use their center; hence the 0.5 offsets
	      var distA = Math.pow(a[0] + 0.5 - referencePoint[0], 2.0) +
	                  Math.pow(a[1] + 0.5 - referencePoint[1], 2.0);

	      var distB = Math.pow(b[0] + 0.5 - referencePoint[0], 2.0) +
	                  Math.pow(b[1] + 0.5 - referencePoint[1], 2.0);
	      
	      return distA > distB;
	    });

	    var prevX, prevY;

	    // removes duplicates
	    return tileList.filter(function(tile) {
	      if (tile[0] === prevX && tile[1] === prevY) {
	        return false;
	      }
	      prevX = tile[0];
	      prevY = tile[1];
	      return true;
	    });
	  },
	  
	  /* Returns a set of tiles based on 'tiles' (at zoom level 'zoom'),
	   * but with those tiles recursively replaced by their respective parent tile
	   * (tile from zoom level 'zoom'-1 that contains 'tile') for which said parent
	   * tile covers less than 'pixelAreaThreshold' pixels on screen based on the 
	   * current view-projection matrix.
	   *
	   * The returned tile set is duplicate-free even if there were duplicates in
	   * 'tiles' and even if multiple tiles from 'tiles' got replaced by the same parent.
	   */
	  mergeTiles: function(tiles, zoom, pixelAreaThreshold) {
	    var parentTiles = {};
	    var tileSet = {};
	    var tileList = [];
	    var key;
	    
	    //if there is no parent zoom level
	    if (zoom === 0 || zoom <= this.minZoom) {
	      for (key in tiles) {
	        tiles[key][2] = zoom;
	      }
	      return tiles;
	    }
	    
	    for (key in tiles) {
	      var tile = tiles[key];

	      var parentX = (tile[0] <<0) / 2;
	      var parentY = (tile[1] <<0) / 2;
	      
	      if (parentTiles[ [parentX, parentY] ] === undefined) { //parent tile screen size unknown
	        var numParentScreenPixels = getTileSizeOnScreen(parentX, parentY, zoom-1, render.viewProjMatrix);
	        parentTiles[ [parentX, parentY] ] = (numParentScreenPixels < pixelAreaThreshold);
	      }
	      
	      if (! parentTiles[ [parentX, parentY] ]) { //won't be replaced by a parent tile -->keep
	        if (tileSet[ [tile[0], tile[1]] ] === undefined) {  //remove duplicates
	          tileSet[ [tile[0], tile[1]]] = true;
	          tileList.push( [tile[0], tile[1], zoom]);
	        }
	      }
	    }
	    
	    var parentTileList = [];
	    
	    for (key in parentTiles) {
	      if (parentTiles[key]) {
	        var parentTile = key.split(',');
	        parentTileList.push( [parseInt(parentTile[0]), parseInt(parentTile[1]), zoom-1]);
	      }
	    }
	    
	    if (parentTileList.length > 0) {
	      parentTileList = this.mergeTiles(parentTileList, zoom - 1, pixelAreaThreshold);
	    }
	      
	    return tileList.concat(parentTileList);
	  },

	  loadTiles: function() {
	    var zoom = Math.round(this.fixedZoom || MAP.zoom);

	    // TODO: if there are user defined bounds for this layer, respect these too
	    //  if (this.fixedBounds) {
	    //    var
	    //      min = project(this.bounds.s, this.bounds.w, 1<<zoom),
	    //      max = project(this.bounds.n, this.bounds.e, 1<<zoom);
	    //
	    //    var bounds = {
	    //      zoom: zoom,
	    //      minX: (min.x <<0) - this.buffer,
	    //      minY: (min.y <<0) - this.buffer,
	    //      maxX: (max.x <<0) + this.buffer,
	    //      maxY: (max.y <<0) + this.buffer
	    //    };
	    //  }

	    var
	      tile, tileX, tileY, tileZoom,
	      queue = [],
	      i,
	      viewQuad = render.getViewQuad(render.viewProjMatrix.data),
	      mapCenterTile = [ long2tile(MAP.position.longitude, zoom),
	                        lat2tile (MAP.position.latitude,  zoom)];

	    for (i = 0; i < 4; i++) {
	      viewQuad[i] = getTilePositionFromLocal(viewQuad[i], zoom);
	    }

	    var tiles = rasterConvexQuad(viewQuad);
	    tiles = ( this.fixedZoom ) ?
	      this.getClosestTiles(tiles, mapCenterTile) :
	      this.mergeTiles(tiles, zoom, 0.5 * TILE_SIZE * TILE_SIZE);
	    
	    this.visibleTiles = {};
	    for (i = 0; i < tiles.length; i++) {
	      if (tiles[i][2] === undefined) {
	        tiles[i][2] = zoom;
	      }
	      this.visibleTiles[ tiles[i] ] = true;
	    }

	    for (var key in this.visibleTiles) {
	      tile = key.split(',');
	      tileX = parseInt(tile[0]);
	      tileY = parseInt(tile[1]);
	      tileZoom = parseInt(tile[2]);

	      if (this.tiles[key]) {
	        continue;
	      }

	      this.tiles[key] = new this.tileClass(tileX, tileY, tileZoom, this.tileOptions, this.tiles);

	      queue.push({ tile:this.tiles[key], dist:distance2([tileX, tileY], mapCenterTile) });
	    }

	    this.purge();

	    queue.sort(function(a, b) {
	      return a.dist-b.dist;
	    });

	    for (i = 0; i < queue.length; i++) {
	      tile = queue[i].tile;
	      tile.load(this.getURL(tile.x, tile.y, tile.zoom));
	    }
	  },

	  purge: function() {
	    var
	      zoom = Math.round(MAP.zoom),
	      tile, parent;

	    for (var key in this.tiles) {
	      tile = this.tiles[key];
	      // tile is visible: keep
	      if (this.visibleTiles[key]) {
	        continue;
	      }

	      // tile is not visible and due to fixedZoom there are no alternate zoom levels: drop
	      if (this.fixedZoom) {
	        this.tiles[key].destroy();
	        delete this.tiles[key];
	        continue;
	      }

	      // tile's parent would be visible: keep
	      if (tile.zoom === zoom+1) {
	        parent = [tile.x/2<<0, tile.y/2<<0, zoom].join(',');
	        if (this.visibleTiles[parent]) {
	          continue;
	        }
	      }

	      // any of tile's children would be visible: keep
	      if (tile.zoom === zoom-1) {
	        if (this.visibleTiles[[tile.x*2, tile.y*2, zoom].join(',')] ||
	          this.visibleTiles[[tile.x*2 + 1, tile.y*2, zoom].join(',')] ||
	          this.visibleTiles[[tile.x*2, tile.y*2 + 1, zoom].join(',')] ||
	          this.visibleTiles[[tile.x*2 + 1, tile.y*2 + 1, zoom].join(',')]) {
	          continue;
	        }
	      }

	      // drop anything else
	      delete this.tiles[key];
	      continue;
	    }
	  },

	  destroy: function() {
	    MAP.off('change', this._onChange);
	    MAP.off('resize', this._onResize);

	    clearTimeout(this.debounce);
	    for (var key in this.tiles) {
	      this.tiles[key].destroy();
	    }
	    this.tiles = [];
	  }
	};


	var Filter = {

	  start: Date.now(),
	  now: 0,
	  items: [],

	  add: function(type, selector, duration) {
	    duration = duration || 0;

	    var filters = this.items;
	    // if filter already exists, do nothing
	    for (i = 0, il = filters.length; i < il; i++) {
	      if (filters[i].type === type && filters[i].selector === selector) {
	        return;
	      }
	    }

	    filters.push({ type:type, selector:selector, duration:duration });

	    // applies a single filter to all items
	    // currently only suitable for 'hidden'
	    var indexItem;
	    var item;
	    var j, jl;

	    var start = this.time();
	    var end = start+duration;

	    for (var i = 0, il = data.Index.items.length; i<il; i++) {
	      indexItem = data.Index.items[i];

	      if (!indexItem.applyFilter) {
	        continue;
	      }

	      for (j = 0, jl = indexItem.items.length; j < jl; j++) {
	        item = indexItem.items[j];
	        if (selector(item.id, item.data)) {
	          item.filter = [start, end, item.filter ? item.filter[3] : 1, 0];
	        }
	      }

	      indexItem.applyFilter();
	    }
	  },

	  remove: function(type, selector, duration) {
	    duration = duration || 0;

	    var i, il;

	    this.items = this.items.filter(function(item) {
	      return (item.type !== type || item.selector !== selector);
	    });

	    // removes a single filter from all items
	    // currently only suitable for 'hidden'
	    var indexItem;
	    var item;
	    var j, jl;

	    var start = this.time();
	    var end = start+duration;

	    for (i = 0, il = data.Index.items.length; i<il; i++) {
	      indexItem = data.Index.items[i];

	      if (!indexItem.applyFilter) {
	        continue;
	      }

	      for (j = 0, jl = indexItem.items.length; j < jl; j++) {
	        item = indexItem.items[j];
	        if (selector(item.id, item.data)) {
	          item.filter = [start, end, item.filter ? item.filter[3] : 0, 1];
	        }
	      }

	      indexItem.applyFilter();
	    }
	  },

	  // applies all existing filters to an item
	  // currently only suitable for 'hidden'
	  apply: function(indexItem) {
	    var filters = this.items;
	    var type, selector;
	    var item;
	    var j, jl;

	    if (!indexItem.applyFilter) {
	      return;
	    }

	    for (var i = 0, il = filters.length; i < il; i++) {
	      type = filters[i].type;
	      selector = filters[i].selector;

	      for (j = 0, jl = indexItem.items.length; j < jl; j++) {
	        item = indexItem.items[j];
	        if (selector(item.id, item.data)) {
	          item.filter = [0, 0, 0, 0];
	        }
	      }
	    }

	    indexItem.applyFilter();
	  },

	  getTime: function() {
	    return this.now;
	  },

	  nextTick: function() {
	    this.now = Date.now()-this.start;
	  },

	  destroy: function() {
	    this.items = [];
	  }
	};


	// TODO: collision check with bounding cylinders

	var data = {
	  Index: {
	    items: [],

	    add: function(item) {
	      this.items.push(item);
	    },

	    remove: function(item) {
	      this.items = this.items.filter(function(i) {
	        return (i !== item);
	      });
	    },

	    destroy: function() {
	      // items are destroyed by grid
	      this.items = [];
	    }
	  }
	};


	data.Tile = function(x, y, zoom, options) {
	  this.x = x;
	  this.y = y;
	  this.zoom = zoom;
	  this.key = [x, y, zoom].join(',');

	  this.options = options;
	};

	data.Tile.prototype = {
	  load: function(url) {
	    this.mesh = new mesh.GeoJSON(url, this.options);
	  },

	  destroy: function() {
	    if (this.mesh) {
	      this.mesh.destroy();
	    }
	  }
	};


	var mesh = {};

	(function() {

	  var LAT_SEGMENTS = 24, LON_SEGMENTS = 32;

	  //function isVertical(a, b, c) {
	  //  return Math.abs(normal(a, b, c)[2]) < 1/5000;
	  //}

	  //*****************************************************************************

	  mesh.create = function() {
	    return { vertices: [], normals: [] };
	  };

	  mesh.addQuad = function(tris, a, b, c, d) {
	    this.addTriangle(tris, a, b, c);
	    this.addTriangle(tris, c, d, a);
	  };

	  mesh.addTriangle = function(tris, a, b, c) {
	    var n = normal(a, b, c);
	    [].push.apply(tris.vertices, [].concat(a, c, b));
	    [].push.apply(tris.normals,  [].concat(n, n, n));
	  };

	  mesh.addCircle = function(tris, center, radius, Z) {
	    Z = Z || 0;
	    var u, v;
	    for (var i = 0; i < LON_SEGMENTS; i++) {
	      u = i/LON_SEGMENTS;
	      v = (i+1)/LON_SEGMENTS;
	      this.addTriangle(
	        tris,
	        [ center[0] + radius * Math.sin(u*Math.PI*2), center[1] + radius * Math.cos(u*Math.PI*2), Z ],
	        [ center[0],                                  center[1],                                  Z ],
	        [ center[0] + radius * Math.sin(v*Math.PI*2), center[1] + radius * Math.cos(v*Math.PI*2), Z ]
	      );
	    }
	  };

	  mesh.addPolygon = function(tris, polygon, Z) {
	    Z = Z || 0;
	    // flatten data
	    var
	      inVertices = [], inHoleIndex = [],
	      index = 0,
	      i, il;
	    for (i = 0, il = polygon.length; i < il; i++) {
	      for (var j = 0; j < polygon[i].length; j++) {
	        inVertices.push(polygon[i][j][0], polygon[i][j][1]);
	      }
	      if (i) {
	        index += polygon[i - 1].length;
	        inHoleIndex.push(index);
	      }
	    }

	    var vertices = earcut(inVertices, inHoleIndex, 2);

	    for (i = 0, il = vertices.length-2; i < il; i+=3) {
	      this.addTriangle(
	        tris,
	        [ inVertices[ vertices[i  ]*2 ], inVertices[ vertices[i  ]*2+1 ], Z ],
	        [ inVertices[ vertices[i+1]*2 ], inVertices[ vertices[i+1]*2+1 ], Z ],
	        [ inVertices[ vertices[i+2]*2 ], inVertices[ vertices[i+2]*2+1 ], Z ]
	      );
	    }
	  };

	  //mesh.polygon3d = function(tris, polygon) {
	  //  var ring = polygon[0];
	  //  var ringLength = ring.length;
	  //  var vertices, t, tl;
	  //
	////  { r:255, g:0, b:0 }
	//
	  //  if (ringLength <= 4) { // 3: a triangle
	  //    this.addTriangle(
	  //      tris,
	  //      ring[0],
	  //      ring[2],
	  //      ring[1]
	  //    );
	  //
	  //    if (ringLength === 4) { // 4: a quad (2 triangles)
	  //      this.addTriangle(
	  //        tris,
	  //        ring[0],
	  //        ring[3],
	  //        ring[2]
	  //      );
	  //    }
	//      return;
	  //  }
	  //
	  //  if (isVertical(ring[0], ring[1], ring[2])) {
	  //    for (var i = 0, il = polygon[0].length; i < il; i++) {
	  //      polygon[0][i] = [
	  //        polygon[0][i][2],
	  //        polygon[0][i][1],
	  //        polygon[0][i][0]
	  //      ];
	  //    }
	  //
	  //    vertices = earcut(polygon);
	  //    for (t = 0, tl = vertices.length-2; t < tl; t+=3) {
	  //      this.addTriangle(
	  //        tris,
	  //        [ vertices[t  ][2], vertices[t  ][1], vertices[t  ][0] ],
	  //        [ vertices[t+1][2], vertices[t+1][1], vertices[t+1][0] ],
	  //        [ vertices[t+2][2], vertices[t+2][1], vertices[t+2][0] ]
	  //      );
	  //    }
	//      return;
	  //  }
	  //
	  //  vertices = earcut(polygon);
	  //  for (t = 0, tl = vertices.length-2; t < tl; t+=3) {
	  //    this.addTriangle(
	  //      tris,
	  //      [ vertices[t  ][0], vertices[t  ][1], vertices[t  ][2] ],
	  //      [ vertices[t+1][0], vertices[t+1][1], vertices[t+1][2] ],
	  //      [ vertices[t+2][0], vertices[t+2][1], vertices[t+2][2] ]
	  //    );
	  //  }
	  //};

	  mesh.addCube = function(tris, sizeX, sizeY, sizeZ, X, Y, Z) {
	    X = X || 0;
	    Y = Y || 0;
	    Z = Z || 0;

	    var a = [X,       Y,       Z];
	    var b = [X+sizeX, Y,       Z];
	    var c = [X+sizeX, Y+sizeY, Z];
	    var d = [X,       Y+sizeY, Z];

	    var A = [X,       Y,       Z+sizeZ];
	    var B = [X+sizeX, Y,       Z+sizeZ];
	    var C = [X+sizeX, Y+sizeY, Z+sizeZ];
	    var D = [X,       Y+sizeY, Z+sizeZ];

	    this.addQuad(tris, b, a, d, c);
	    this.addQuad(tris, A, B, C, D);
	    this.addQuad(tris, a, b, B, A);
	    this.addQuad(tris, b, c, C, B);
	    this.addQuad(tris, c, d, D, C);
	    this.addQuad(tris, d, a, A, D);
	  };

	  //*****************************************************************************

	  mesh.addCylinder = function(tris, center, radius1, radius2, height, Z) {
	    Z = Z || 0;
	    var
	      currAngle, nextAngle,
	      currSin, currCos,
	      nextSin, nextCos,
	      num = LON_SEGMENTS,
	      doublePI = Math.PI*2;

	    for (var i = 0; i < num; i++) {
	      currAngle = ( i   /num) * doublePI;
	      nextAngle = ((i+1)/num) * doublePI;

	      currSin = Math.sin(currAngle);
	      currCos = Math.cos(currAngle);

	      nextSin = Math.sin(nextAngle);
	      nextCos = Math.cos(nextAngle);

	      this.addTriangle(
	        tris,
	        [ center[0] + radius1*currSin, center[1] + radius1*currCos, Z ],
	        [ center[0] + radius2*nextSin, center[1] + radius2*nextCos, Z+height ],
	        [ center[0] + radius1*nextSin, center[1] + radius1*nextCos, Z ]
	      );

	      if (radius2 !== 0) {
	        this.addTriangle(
	          tris,
	          [ center[0] + radius2*currSin, center[1] + radius2*currCos, Z+height ],
	          [ center[0] + radius2*nextSin, center[1] + radius2*nextCos, Z+height ],
	          [ center[0] + radius1*currSin, center[1] + radius1*currCos, Z ]
	        );
	      }
	    }
	  };

	  mesh.addDome = function(tris, center, radius, height, Z) {
	    Z = Z || 0;
	    var
	      currAngle, nextAngle,
	      currSin, currCos,
	      nextSin, nextCos,
	      currRadius, nextRadius,
	      nextHeight, nextZ,
	      num = LAT_SEGMENTS/2,
	      halfPI = Math.PI/2;

	    for (var i = 0; i < num; i++) {
	      currAngle = ( i   /num) * halfPI - halfPI;
	      nextAngle = ((i+1)/num) * halfPI - halfPI;

	      currSin = Math.sin(currAngle);
	      currCos = Math.cos(currAngle);

	      nextSin = Math.sin(nextAngle);
	      nextCos = Math.cos(nextAngle);

	      currRadius = currCos*radius;
	      nextRadius = nextCos*radius;

	      nextHeight = (nextSin-currSin)*height;
	      nextZ = Z - nextSin*height;

	      this.addCylinder(tris, center, nextRadius, currRadius, nextHeight, nextZ);
	    }
	  };

	  // TODO
	  mesh.addSphere = function(tris, center, radius, height, Z) {
	    Z = Z || 0;
	    return this.addCylinder(tris, center, radius, radius, height, Z);
	  };

	  mesh.addPyramid = function(tris, polygon, center, height, Z) {
	    Z = Z || 0;
	    polygon = polygon[0];
	    for (var i = 0, il = polygon.length-1; i < il; i++) {
	      this.addTriangle(
	        tris,
	        [ polygon[i  ][0], polygon[i  ][1], Z ],
	        [ polygon[i+1][0], polygon[i+1][1], Z ],
	        [ center[0], center[1], Z+height ]
	      );
	    }
	  };

	  mesh.addExtrusion = function(tris, polygon, height, Z) {
	    Z = Z || 0;
	    var ring, last, a, b;
	    for (var i = 0, il = polygon.length; i < il; i++) {
	      ring = polygon[i];
	      last = ring.length-1;

	      if (ring[0][0] !== ring[last][0] || ring[0][1] !== ring[last][1]) {
	        ring.push(ring[0]);
	        last++;
	      }

	      for (var r = 0; r < last; r++) {
	        a = ring[r];
	        b = ring[r+1];
	        this.addQuad(
	          tris,
	          [ a[0], a[1], Z ],
	          [ b[0], b[1], Z ],
	          [ b[0], b[1], Z+height ],
	          [ a[0], a[1], Z+height ]
	        );
	      }
	    }
	  };

	}());


	mesh.GeoJSON = (function() {

	  var METERS_PER_LEVEL = 3;

	  var materialColors = {
	    brick:'#cc7755',
	    bronze:'#ffeecc',
	    canvas:'#fff8f0',
	    concrete:'#999999',
	    copper:'#a0e0d0',
	    glass:'#e8f8f8',
	    gold:'#ffcc00',
	    plants:'#009933',
	    metal:'#aaaaaa',
	    panel:'#fff8f0',
	    plaster:'#999999',
	    roof_tiles:'#f08060',
	    silver:'#cccccc',
	    slate:'#666666',
	    stone:'#996666',
	    tar_paper:'#333333',
	    wood:'#deb887'
	  };

	  var baseMaterials = {
	    asphalt:'tar_paper',
	    bitumen:'tar_paper',
	    block:'stone',
	    bricks:'brick',
	    glas:'glass',
	    glassfront:'glass',
	    grass:'plants',
	    masonry:'stone',
	    granite:'stone',
	    panels:'panel',
	    paving_stones:'stone',
	    plastered:'plaster',
	    rooftiles:'roof_tiles',
	    roofingfelt:'tar_paper',
	    sandstone:'stone',
	    sheet:'canvas',
	    sheets:'canvas',
	    shingle:'tar_paper',
	    shingles:'tar_paper',
	    slates:'slate',
	    steel:'metal',
	    tar:'tar_paper',
	    tent:'canvas',
	    thatch:'plants',
	    tile:'roof_tiles',
	    tiles:'roof_tiles'
	    // cardboard
	    // eternit
	    // limestone
	    // straw
	  };

	  var
	    featuresPerChunk = 100,
	    delayPerChunk = 66;

	  function getMaterialColor(str) {
	    if (typeof str !== 'string') {
	      return null;
	    }
	    str = str.toLowerCase();
	    if (str[0] === '#') {
	      return str;
	    }
	    return materialColors[baseMaterials[str] || str] || null;
	  }



	  /* Converts a geometry of arbitrary type (GeometryCollection, MultiPolygon or Polygon)
	   * to an array of Polygons.
	   */
	  function flattenGeometryHierarchy(geometry, origin) {
	    switch (geometry.type) {
	      case 'GeometryCollection':
	        return geometry.geometries.map(function(geometry) {
	          return flattenGeometryHierarchy(geometry.geometries[i]);
	        });

	      case 'MultiPolygon':
	        return geometry.coordinates.map(function(polygon) {
	          return flattenGeometryHierarchy({ type: 'Polygon', coordinates: polygon });
	        });

	      case 'Polygon':
	        return transformPolygon(geometry.coordinates, origin);

	      default:
	        return [];
	    }
	  }

	  // converts all coordinates of all rings in 'polygonRings' from lat/lng pairs
	  // to meters-from-origin.
	  function transformPolygon(polygonRings, origin) {
	    var res = polygonRings.map(function(ring, ringIndex) {
	      // outer rings (== the first ring) need to be clockwise, inner rings
	      // counter-clockwise. If they are not, make them by reversing them.
	      if ((ringIndex === 0) !== isClockWise(ring)) {
	        ring.reverse();
	      }
	      return transform(ring, origin);
	    });
	    return [res];
	  }

	  // converts all coordinates of 'ring' from lat/lng to 'meters from reference point'
	  function transform(ring, origin) {
	    var metersPerDegreeLongitude = METERS_PER_DEGREE_LATITUDE * Math.cos(origin.latitude / 180 * Math.PI);

	    var p, res = [];
	    for (var i = 0, len = ring.length; i < len; i++) {
	      res[i] = [
	         (ring[i][0]-origin.longitude) * metersPerDegreeLongitude,
	        -(ring[i][1]-origin.latitude)  * METERS_PER_DEGREE_LATITUDE
	      ];
	    }

	    return res;
	  }

	  //***************************************************************************

	  function constructor(url, options) {
	    options = options || {};

	    this.id = options.id;
	    this.color = options.color;

	    this.replace   = !!options.replace;
	    this.scale     = options.scale     || 1;
	    this.rotation  = options.rotation  || 0;
	    this.elevation = options.elevation || 0;
	    this.position  = {};

	    this.minZoom = parseFloat(options.minZoom) || APP.minZoom;
	    this.maxZoom = parseFloat(options.maxZoom) || APP.maxZoom;
	    if (this.maxZoom < this.minZoom) {
	      this.maxZoom = this.minZoom;
	    }

	    this.data = {
	      vertices: [],
	      normals: [],
	      colors: [],
	      ids: []
	    };

	    Activity.setBusy();
	    if (typeof url === 'object') {
	      var json = url;
	      this.onLoad(json);
	    } else {
	      this.request = Request.getJSON(url, function(json) {
	        this.request = null;
	        this.onLoad(json);
	      }.bind(this));
	    }
	  }

	  constructor.prototype = {

	    onLoad: function(json) {
	      if (!json || !json.features.length) {
	        return;
	      }

	      var coordinates0 = json.features[0].geometry.coordinates[0][0];
	      this.position = { latitude: coordinates0[1], longitude: coordinates0[0] };
	      this.items = [];

	      var
	        startIndex = 0,
	        dataLength = json.features.length,
	        endIndex = startIndex + Math.min(dataLength, featuresPerChunk);

	      var process = function() {
	        var feature, geometries;
	        for (var i = startIndex; i < endIndex; i++) {
	          feature = json.features[i];
	          geometries = flattenGeometryHierarchy(feature.geometry, this.position)
	            .filter(function(ring) {
	              return ring.length > 0;
	            });

	          for (var j = 0, jl = geometries.length; j < jl; j++) {
	            this.addItem(feature.id, feature.properties, geometries[j]);
	          }
	        }

	        if (endIndex === dataLength) {
	          this.onReady();
	          return;
	        }

	        startIndex = endIndex;
	        endIndex = startIndex + Math.min((dataLength-startIndex), featuresPerChunk);

	        this.relaxedProcessing = setTimeout(process, delayPerChunk);
	      }.bind(this);

	      process();
	    },

	    addItem: function(id, properties, geometry) {
	      id = this.id || properties.relationId || id || properties.id;

	      var
	        height    = properties.height    || (properties.levels   ? properties.levels  *METERS_PER_LEVEL : DEFAULT_HEIGHT),
	        minHeight = properties.minHeight || (properties.minLevel ? properties.minLevel*METERS_PER_LEVEL : 0),
	        roofHeight = properties.roofHeight ||  3,

	        wallColor = properties.wallColor || properties.color || getMaterialColor(properties.material),
	        roofColor = properties.roofColor || properties.color || getMaterialColor(properties.roofMaterial),

	        i,
	        skipRoof,
	        vertexCount, vertexCountBefore, color,
	        idColor = render.Picking.idToColor(id),
	        colorVariance = (id/2 % 2 ? -1 : +1) * (id % 2 ? 0.03 : 0.06),
	        bbox = getBBox(geometry[0]),
	        radius = (bbox.maxX - bbox.minX)/2,
	        center = [bbox.minX + (bbox.maxX - bbox.minX)/2, bbox.minY + (bbox.maxY - bbox.minY)/2],
	        H, Z;

	      // flat roofs or roofs we can't handle should not affect building's height
	      switch (properties.roofShape) {
	        case 'cone':
	        case 'dome':
	        case 'onion':
	        case 'pyramid':
	        case 'pyramidal':
	          height = Math.max(0, height-roofHeight);
	        break;
	        default:
	          roofHeight = 0;
	      }

	      //****** walls ******

	      H = height-minHeight;
	      Z = minHeight;

	      vertexCountBefore = this.data.vertices.length;
	      switch (properties.shape) {
	        case 'cylinder':
	          mesh.addCylinder(this.data, center, radius, radius, H, Z);
	        break;

	        case 'cone':
	          mesh.addCylinder(this.data, center, radius, 0, H, Z);
	          skipRoof = true;
	        break;

	        case 'dome':
	          mesh.addDome(this.data, center, radius, (H || radius), Z);
	        break;

	        case 'sphere':
	          mesh.addSphere(this.data, center, radius, (H || 2*radius), Z);
	        break;

	        case 'pyramid':
	        case 'pyramidal':
	          mesh.addPyramid(this.data, geometry, center, H, Z);
	          skipRoof = true;
	        break;

	        default:
	          mesh.addExtrusion(this.data, geometry, H, Z);
	      }

	      vertexCount = (this.data.vertices.length-vertexCountBefore)/3;
	      color = new Color(this.color || wallColor || DEFAULT_COLOR).toArray();
	      for (i = 0; i < vertexCount; i++) {
	        this.data.colors.push(color[0]+colorVariance, color[1]+colorVariance, color[2]+colorVariance);
	        this.data.ids.push(idColor[0], idColor[1], idColor[2]);
	      }

	      this.items.push({ id:id, vertexCount:vertexCount, data:properties.data });

	      //****** roof ******

	      if (skipRoof) {
	        return;
	      }

	      H = roofHeight;
	      Z = height;

	      vertexCountBefore = this.data.vertices.length;
	      switch (properties.roofShape) {
	        case 'cone':
	          mesh.addCylinder(this.data, center, radius, 0, H, Z);
	        break;

	        case 'dome':
	        case 'onion':
	          mesh.addDome(this.data, center, radius, (H || radius), Z);
	        break;

	        case 'pyramid':
	        case 'pyramidal':
	          if (properties.shape === 'cylinder') {
	            mesh.addCylinder(this.data, center, radius, 0, H, Z);
	          } else {
	            mesh.addPyramid(this.data, geometry, center, H, Z);
	          }
	          break;

	        //case 'skillion':
	        //  // TODO: skillion
	        //  mesh.addPolygon(this.data, geometry, Z);
	        //break;
	        //
	        //case 'gabled':
	        //case 'hipped':
	        //case 'half-hipped':
	        //case 'gambrel':
	        //case 'mansard':
	        //case 'round':
	        //case 'saltbox':
	        //  // TODO: gabled
	        //  mesh.addPyramid(this.data, geometry, center, H, Z);
	        //break;

	//      case 'flat':
	        default:
	          if (properties.shape === 'cylinder') {
	            mesh.addCircle(this.data, center, radius, Z);
	          } else {
	            mesh.addPolygon(this.data, geometry, Z);
	          }
	      }

	      vertexCount = (this.data.vertices.length-vertexCountBefore)/3;
	      color = new Color(this.color || roofColor || DEFAULT_COLOR).toArray();
	      for (i = 0; i<vertexCount; i++) {
	        this.data.colors.push(color[0] + colorVariance, color[1] + colorVariance, color[2] + colorVariance);
	        this.data.ids.push(idColor[0], idColor[1], idColor[2]);
	      }

	      this.items.push({ id: id, vertexCount: vertexCount, data: properties.data });
	    },

	    fadeIn: function() {
	      var item, filters = [];
	      var start = Filter.getTime() + 250, end = start + 500;
	      for (var i = 0, il = this.items.length; i < il; i++) {
	        item = this.items[i];
	        item.filter = [start, end, 0, 1];
	        for (var j = 0, jl = item.vertexCount; j < jl; j++) {
	          filters.push.apply(filters, item.filter);
	        }
	      }
	      this.filterBuffer = new glx.Buffer(4, new Float32Array(filters));
	    },

	    applyFilter: function() {
	      var item, filters = [];
	      for (var i = 0, il = this.items.length; i < il; i++) {
	        item = this.items[i];
	        for (var j = 0, jl = item.vertexCount; j < jl; j++) {
	          filters.push.apply(filters, item.filter);
	        }
	      }
	      this.filterBuffer = new glx.Buffer(4, new Float32Array(filters));
	    },

	    onReady: function() {
	      this.vertexBuffer = new glx.Buffer(3, new Float32Array(this.data.vertices));
	      this.normalBuffer = new glx.Buffer(3, new Float32Array(this.data.normals));
	      this.colorBuffer  = new glx.Buffer(3, new Float32Array(this.data.colors));
	      this.idBuffer     = new glx.Buffer(3, new Float32Array(this.data.ids));
	      this.fadeIn();
	      this.data = null;

	      Filter.apply(this);
	      data.Index.add(this);

	      this.isReady = true;
	      Activity.setIdle();
	    },

	    // TODO: switch to a notation like mesh.transform
	    getMatrix: function() {
	      var matrix = new glx.Matrix();

	      if (this.elevation) {
	        matrix.translate(0, 0, this.elevation);
	      }

	      matrix.scale(this.scale, this.scale, this.scale*HEIGHT_SCALE);

	      if (this.rotation) {
	        matrix.rotateZ(-this.rotation);
	      }

	      var dLat = this.position.latitude - MAP.position.latitude;
	      var dLon = this.position.longitude - MAP.position.longitude;
	      
	      var metersPerDegreeLongitude = METERS_PER_DEGREE_LATITUDE * Math.cos(MAP.position.latitude / 180 * Math.PI);

	      matrix.translate( dLon*metersPerDegreeLongitude, -dLat*METERS_PER_DEGREE_LATITUDE, 0);
	      
	      return matrix;
	    },

	    destroy: function() {
	      this.isReady = false;

	      clearTimeout(this.relaxedProcessing);

	      data.Index.remove(this);

	      if (this.request) {
	        this.request.abort();
	      }

	      this.items = [];

	      if (this.isReady) {
	        this.vertexBuffer.destroy();
	        this.normalBuffer.destroy();
	        this.colorBuffer.destroy();
	        this.idBuffer.destroy();
	      }
	    }
	  };

	  return constructor;

	}());


	/* A 'MapPlane' object is a rectangular mesh in the X/Y plane (Z=0) that is
	 * guaranteed to cover all of the area of that plane that is inside the skydome.
	 *
	 * A 'MapPlane' is untextured and featureless. Its intended use is as a stand-in
	 * for a 'BaseMap' in situations where either using the actual BaseMap would be
	 * inefficient (e.g. when the BaseMap would be rendered without a texture) or 
	 * no BaseMap is present (e.g. if OSMBuildings is used as an overlay to Leaflet
	 * or MapBoxGL). This mostly applies to creating depth and normal textures of the
	 * scene, not to the actual shaded scene rendering.

	*/

	mesh.MapPlane = (function() {

	  function constructor(options) {
	    options = options || {};

	    this.id = options.id;
	    /*if (options.color) {
	      this.color = new Color(options.color).toArray(true);
	    }*/

	    this.radius = options.radius || 2000;
	    this.createGlGeometry();

	    this.minZoom = APP.minZoom;
	    this.maxZoom = APP.maxZoom;
	  }

	  constructor.prototype = {

	    createGlGeometry: function() {
	      /* This method creates front and back faces, in case rendering 
	       * effect requires both. */
	      var NUM_SEGMENTS = 50;
	      var segmentSize = 2*this.radius / NUM_SEGMENTS;
	      this.vertexBuffer = [];
	      this.normalBuffer = [];
	      this.filterBuffer = [];

	      var normal = [0,0,1];
	      var normals = [].concat(normal, normal, normal, normal, normal, normal);

	      var filterEntry = [0, 1, 1, 1];
	      var filterEntries = [].concat(filterEntry, filterEntry, filterEntry,
	                                    filterEntry, filterEntry, filterEntry);
	      
	      for (var x = 0; x < NUM_SEGMENTS; x++)
	        for (var y = 0; y < NUM_SEGMENTS; y++) {
	          
	          
	          var baseX = -this.radius + x*segmentSize;
	          var baseY = -this.radius + y*segmentSize;
	          this.vertexBuffer.push( baseX,               baseY, 0,
	                                  baseX + segmentSize, baseY + segmentSize, 0,
	                                  baseX + segmentSize, baseY, 0,
	                                  
	                                  baseX,               baseY, 0,
	                                  baseX,               baseY + segmentSize, 0,
	                                  baseX + segmentSize, baseY + segmentSize, 0);

	          this.vertexBuffer.push( baseX,               baseY, 0,
	                                  baseX + segmentSize, baseY, 0,
	                                  baseX + segmentSize, baseY + segmentSize, 0,

	                                  baseX,               baseY, 0,
	                                  baseX + segmentSize, baseY + segmentSize, 0,
	                                  baseX,               baseY + segmentSize, 0);

	          [].push.apply(this.normalBuffer, normals);
	          [].push.apply(this.normalBuffer, normals);

	          [].push.apply(this.filterBuffer, filterEntries);
	          [].push.apply(this.filterBuffer, filterEntries);
	      }
	       
	      this.vertexBuffer = new glx.Buffer(3, new Float32Array(this.vertexBuffer));
	      this.normalBuffer = new glx.Buffer(3, new Float32Array(this.normalBuffer));
	      this.filterBuffer = new glx.Buffer(4, new Float32Array(this.filterBuffer));
	       
	    },

	    // TODO: switch to a notation like mesh.transform
	    getMatrix: function() {
	      //var scale = Math.pow(2, MAP.zoom - 16);

	      var modelMatrix = new glx.Matrix();
	      //modelMatrix.scale(scale, scale, scale);
	    
	      return modelMatrix;
	    },

	    destroy: function() {
	      this.vertexBuffer.destroy();
	      this.normalBuffer.destroy();
	      this.colorBuffer.destroy();
	      this.idBuffer.destroy();
	    }
	  };

	  return constructor;

	}());


	mesh.DebugQuad = (function() {

	  function constructor(options) {
	    options = options || {};

	    this.id = options.id;
	    /*if (options.color) {
	      this.color = new Color(options.color).toArray();
	    }*/

	    this.v1 = this.v2 = this.v3 = this.v4 = [false, false, false];
	    this.updateGeometry( [0,0,0], [0,0,0], [0,0,0], [0,0,0]);

	    this.minZoom = APP.minZoom;
	    this.maxZoom = APP.maxZoom;
	  }

	  function areEqual(a, b) {
	    return a[0] === b[0] &&
	           a[1] === b[1] &&
	           a[2] === b[2];
	  }

	  constructor.prototype = {

	    updateGeometry: function(v1, v2, v3, v4) {
	      if ( areEqual(v1, this.v1) &&
	           areEqual(v2, this.v2) &&
	           areEqual(v3, this.v3) &&
	           areEqual(v4, this.v4))
	         return; //still up-to-date

	      this.v1 = v1;
	      this.v2 = v2;
	      this.v3 = v3;
	      this.v4 = v4;
	      
	      if (this.vertexBuffer)
	        this.vertexBuffer.destroy();

	      var vertices = [].concat(v1, v2, v3, v1, v3, v4);
	      this.vertexBuffer = new glx.Buffer(3, new Float32Array(vertices));

	      /*
	      this.dummyMapPlaneTexCoords = new glx.Buffer(2, new Float32Array([
	        0.0, 0.0,
	          1, 0.0,
	          1,   1,
	        
	        0.0, 0.0,
	          1,   1,
	        0.0,   1]));*/

	      if (this.normalBuffer)
	        this.normalBuffer.destroy();
	        
	      this.normalBuffer = new glx.Buffer(3, new Float32Array([
	        0, 0, 1,
	        0, 0, 1,
	        0, 0, 1,
	        
	        0, 0, 1,
	        0, 0, 1,
	        0, 0, 1]));
	      
	      var color = [1, 0.5, 0.25];
	      if (this.colorBuffer)
	        this.colorBuffer.destroy();
	        
	      this.colorBuffer = new glx.Buffer(3, new Float32Array(
	        [].concat(color, color, color, color, color, color)));


	      if (this.idBuffer)
	        this.idBuffer.destroy();

	      this.idBuffer = new glx.Buffer(3, new Float32Array(
	        [].concat(color, color, color, color, color, color)));
	        
	      //this.numDummyVertices = 6;
	    },

	    // TODO: switch to a notation like mesh.transform
	    getMatrix: function() {
	      //var scale = render.fogRadius/this.radius;
	      var modelMatrix = new glx.Matrix();
	      //modelMatrix.scale(scale, scale, scale);
	    
	      return modelMatrix;
	    },

	    destroy: function() {
	      this.vertexBuffer.destroy();
	      this.normalBuffer.destroy();
	      this.colorBuffer.destroy();
	      this.idBuffer.destroy();
	    }
	  };

	  return constructor;

	}());

	mesh.OBJ = (function() {

	  var vertexIndex = [];

	  function parseMTL(str) {
	    var
	      lines = str.split(/[\r\n]/g),
	      cols,
	      materials = {},
	      data = null;

	    for (var i = 0, il = lines.length; i < il; i++) {
	      cols = lines[i].trim().split(/\s+/);

	      switch (cols[0]) {
	        case 'newmtl':
	          storeMaterial(materials, data);
	          data = { id:cols[1], color:{} };
	          break;

	        case 'Kd':
	          data.color = [
	            parseFloat(cols[1]),
	            parseFloat(cols[2]),
	            parseFloat(cols[3])
	          ];
	          break;

	        case 'd':
	          data.color[3] = parseFloat(cols[1]);
	          break;
	      }
	    }

	    storeMaterial(materials, data);
	    str = null;

	    return materials;
	  }

	  function storeMaterial(materials, data) {
	    if (data !== null) {
	      materials[ data.id ] = data.color;
	    }
	  }

	  function parseOBJ(str, materials) {
	    var
	      lines = str.split(/[\r\n]/g), cols,
	      meshes = [],
	      id,
	      color,
	      faces = [];

	    for (var i = 0, il = lines.length; i < il; i++) {
	      cols = lines[i].trim().split(/\s+/);

	      switch (cols[0]) {
	        case 'g':
	        case 'o':
	          storeOBJ(meshes, id, color, faces);
	          id = cols[1];
	          faces = [];
	          break;

	        case 'usemtl':
	          storeOBJ(meshes, id, color, faces);
	          if (materials[ cols[1] ]) {
	            color = materials[ cols[1] ];
	          }
	          faces = [];
	          break;

	        case 'v':
	          vertexIndex.push([parseFloat(cols[1]), parseFloat(cols[2]), parseFloat(cols[3])]);
	          break;

	        case 'f':
	          faces.push([ parseFloat(cols[1])-1, parseFloat(cols[2])-1, parseFloat(cols[3])-1 ]);
	          break;
	      }
	    }

	    storeOBJ(meshes, id, color, faces);
	    str = null;

	    return meshes;
	  }

	  function storeOBJ(meshes, id, color, faces) {
	    if (faces.length) {
	      var geometry = createGeometry(faces);
	      meshes.push({
	        id: id,
	        color: color,
	        vertices: geometry.vertices,
	        normals: geometry.normals
	      });
	    }
	  }

	  function createGeometry(faces) {
	    var
	      v0, v1, v2,
	      e1, e2,
	      nor, len,
	      geometry = { vertices:[], normals:[] };

	    for (var i = 0, il = faces.length; i < il; i++) {
	      v0 = vertexIndex[ faces[i][0] ];
	      v1 = vertexIndex[ faces[i][1] ];
	      v2 = vertexIndex[ faces[i][2] ];

	      e1 = [ v1[0]-v0[0], v1[1]-v0[1], v1[2]-v0[2] ];
	      e2 = [ v2[0]-v0[0], v2[1]-v0[1], v2[2]-v0[2] ];

	      nor = [ e1[1]*e2[2] - e1[2]*e2[1], e1[2]*e2[0] - e1[0]*e2[2], e1[0]*e2[1] - e1[1]*e2[0] ];
	      len = Math.sqrt(nor[0]*nor[0] + nor[1]*nor[1] + nor[2]*nor[2]);

	      nor[0] /= len;
	      nor[1] /= len;
	      nor[2] /= len;

	      geometry.vertices.push(
	        v0[0], v0[2], v0[1],
	        v1[0], v1[2], v1[1],
	        v2[0], v2[2], v2[1]
	      );

	      geometry.normals.push(
	        nor[0], nor[1], nor[2],
	        nor[0], nor[1], nor[2],
	        nor[0], nor[1], nor[2]
	      );
	    }

	    return geometry;
	  }

	  //***************************************************************************

	  function constructor(url, position, options) {
	    options = options || {};

	    this.id = options.id;
	    if (options.color) {
	      this.color = new Color(options.color).toArray();
	    }

	    this.replace   = !!options.replace;
	    this.scale     = options.scale     || 1;
	    this.rotation  = options.rotation  || 0;
	    this.elevation = options.elevation || 0;
	    this.position  = position;

	    this.minZoom = parseFloat(options.minZoom) || APP.minZoom;
	    this.maxZoom = parseFloat(options.maxZoom) || APP.maxZoom;
	    if (this.maxZoom < this.minZoom) {
	      this.maxZoom = this.minZoom;
	    }

	    this.data = {
	      vertices: [],
	      normals: [],
	      colors: [],
	      ids: []
	    };

	    Activity.setBusy();
	    this.request = Request.getText(url, function(obj) {
	      this.request = null;
	      var match;
	      if ((match = obj.match(/^mtllib\s+(.*)$/m))) {
	        this.request = Request.getText(url.replace(/[^\/]+$/, '') + match[1], function(mtl) {
	          this.request = null;
	          this.onLoad(obj, parseMTL(mtl));
	        }.bind(this));
	      } else {
	        this.onLoad(obj, null);
	      }
	    }.bind(this));
	  }

	  constructor.prototype = {
	    onLoad: function(obj, mtl) {
	      this.items = [];
	      // TODO: add single parsed items directly and save intermediate data storage
	      this.addItems(parseOBJ(obj, mtl));
	      this.onReady();
	    },

	    addItems: function(items) {
	      var
	        item, color, idColor, j, jl,
	        id, colorVariance,
	        defaultColor = new Color(DEFAULT_COLOR).toArray();

	      for (var i = 0, il = items.length; i < il; i++) {
	        item = items[i];

	        this.data.vertices = this.data.vertices.concat(item.vertices);
	        this.data.normals  = this.data.normals.concat(item.normals);

	        id = this.id || item.id;
	        idColor = render.Picking.idToColor(id);

	        colorVariance = (id/2 % 2 ? -1 : +1) * (id % 2 ? 0.03 : 0.06);
	        color = this.color || item.color || defaultColor;
	        for (j = 0, jl = item.vertices.length - 2; j<jl; j += 3) {
	          this.data.colors.push(color[0]+colorVariance, color[1]+colorVariance, color[2]+colorVariance);
	          this.data.ids.push(idColor[0], idColor[1], idColor[2], 1);
	        }

	        this.items.push({ id:id, vertexCount:item.vertices.length/3, data:item.data });
	      }
	    },

	    fadeIn: function() {
	      var item, filters = [];
	      var start = Filter.getTime() + 250, end = start + 500;
	      for (var i = 0, il = this.items.length; i < il; i++) {
	        item = this.items[i];
	        item.filter = [start, end, 0, 1];
	        for (var j = 0, jl = item.vertexCount; j < jl; j++) {
	          filters.push.apply(filters, item.filter);
	        }
	      }
	      this.filterBuffer = new glx.Buffer(4, new Float32Array(filters));
	    },

	    applyFilter: function() {
	      var item, filters = [];
	      for (var i = 0, il = this.items.length; i < il; i++) {
	        item = this.items[i];
	        for (var j = 0, jl = item.vertexCount; j < jl; j++) {
	          filters.push.apply(filters, item.filter);
	        }
	      }
	      this.filterBuffer = new glx.Buffer(4, new Float32Array(filters));
	    },

	    onReady: function() {
	      this.vertexBuffer = new glx.Buffer(3, new Float32Array(this.data.vertices));
	      this.normalBuffer = new glx.Buffer(3, new Float32Array(this.data.normals));
	      this.colorBuffer  = new glx.Buffer(3, new Float32Array(this.data.colors));
	      this.idBuffer     = new glx.Buffer(3, new Float32Array(this.data.ids));
	      this.fadeIn();
	      this.data = null;

	      Filter.apply(this);
	      data.Index.add(this);

	      this.isReady = true;
	      Activity.setIdle();
	    },

	    // TODO: switch to a notation like mesh.transform
	    getMatrix: function() {
	      var matrix = new glx.Matrix();

	      if (this.elevation) {
	        matrix.translate(0, 0, this.elevation);
	      }

	      matrix.scale(this.scale, this.scale, this.scale);

	      if (this.rotation) {
	        matrix.rotateZ(-this.rotation);
	      }

	      var metersPerDegreeLongitude = METERS_PER_DEGREE_LATITUDE * 
	                                     Math.cos(MAP.position.latitude / 180 * Math.PI);

	      var dLat = this.position.latitude - MAP.position.latitude;
	      var dLon = this.position.longitude- MAP.position.longitude;
	      
	      matrix.translate( dLon * metersPerDegreeLongitude,
	                       -dLat * METERS_PER_DEGREE_LATITUDE, 0);
	      
	      return matrix;
	    },

	    destroy: function() {
	      data.Index.remove(this);

	      if (this.request) {
	        this.request.abort();
	      }

	      this.items = [];

	      if (this.isReady) {
	        this.vertexBuffer.destroy();
	        this.normalBuffer.destroy();
	        this.colorBuffer.destroy();
	        this.idBuffer.destroy();
	      }
	    }
	  };

	  return constructor;

	}());


	function distance2(a, b) {
	  var
	    dx = a[0]-b[0],
	    dy = a[1]-b[1];
	  return dx*dx + dy*dy;
	}

	function isClockWise(polygon) {
	  return 0 < polygon.reduce(function(a, b, c, d) {
	    return a + ((c < d.length - 1) ? (d[c+1][0] - b[0]) * (d[c+1][1] + b[1]) : 0);
	  }, 0);
	}

	function getBBox(polygon) {
	  var
	    x =  Infinity, y =  Infinity,
	    X = -Infinity, Y = -Infinity;

	  for (var i = 0; i < polygon.length; i++) {
	    x = Math.min(x, polygon[i][0]);
	    y = Math.min(y, polygon[i][1]);

	    X = Math.max(X, polygon[i][0]);
	    Y = Math.max(Y, polygon[i][1]);
	  }

	  return { minX:x, minY:y, maxX:X, maxY:Y };
	}

	function assert(condition, message) {
	  if (!condition) {
	    throw message;
	  }
	}

	/* Returns the distance of point 'p' from line 'line1'->'line2'.
	 * based on http://mathworld.wolfram.com/Point-LineDistance2-Dimensional.html
	 */
	 /*
	function getDistancePointLine2( line1, line2, p) {

	  //v: a unit-length vector perpendicular to the line;
	  var v = norm2( [ line2[1] - line1[1], line1[0] - line2[0] ] );
	  var r = sub2( line1, p);
	  return Math.abs(dot2(v, r));
	} */

	/*  given a pixel's (integer) position through which the line 'segmentStart' ->
	 *  'segmentEnd' passes, this method returns the one neighboring pixel of 
	 *  'currentPixel' that would be traversed next if the line is followed in 
	 *  the direction from 'segmentStart' to 'segmentEnd' (even if the next point
	 *  would lie beyond 'segmentEnd'. )
	 */
	function getNextPixel(segmentStart, segmentEnd, currentPixel) {

	  var vInc = [segmentStart[0] < segmentEnd[0] ? 1 : -1, 
	              segmentStart[1] < segmentEnd[1] ? 1 : -1];
	         
	  var nextX = currentPixel[0] + (segmentStart[0] < segmentEnd[0] ?  +1 : 0);
	  var nextY = currentPixel[1] + (segmentStart[1] < segmentEnd[1] ?  +1 : 0);
	  
	  // position of the edge to the next pixel on the line 'segmentStart'->'segmentEnd'
	  var alphaX = (nextX - segmentStart[0])/ (segmentEnd[0] - segmentStart[0]);
	  var alphaY = (nextY - segmentStart[1])/ (segmentEnd[1] - segmentStart[1]);
	  
	  // neither value is valid
	  if ((alphaX <= 0.0 || alphaX > 1.0) && (alphaY <= 0.0 || alphaY > 1.0)) {
	    return [undefined, undefined];
	  }
	    
	  if (alphaX <= 0.0 || alphaX > 1.0) { // only alphaY is valid
	    return [currentPixel[0], currentPixel[1] + vInc[1]];
	  }

	  if (alphaY <= 0.0 || alphaY > 1.0) { // only alphaX is valid
	    return [currentPixel[0] + vInc[0], currentPixel[1]];
	  }
	    
	  return alphaX < alphaY ? [currentPixel[0]+vInc[0], currentPixel[1]] :
	                           [currentPixel[0],         currentPixel[1] + vInc[1]];
	}

	/* returns all pixels that are at least partially covered by the triangle
	 * p1-p2-p3. 
	 * Note: the returned array of pixels *will* contain duplicates that may need 
	 * to be removed.
	 */
	function rasterTriangle(p1, p2, p3) {
	  var points = [p1, p2, p3];
	  points.sort(function(p, q) {
	    return p[1] < q[1];
	  });
	  p1 = points[0];
	  p2 = points[1];
	  p3 = points[2];
	  
	  if (p1[1] == p2[1])
	    return rasterFlatTriangle( p1, p2, p3);
	    
	  if (p2[1] == p3[1])
	    return rasterFlatTriangle( p2, p3, p1);

	  var alpha = (p2[1] - p1[1]) / (p3[1] - p1[1]);
	  //point on the line p1->p3 with the same y-value as p2
	  var p4 = [p1[0] + alpha*(p3[0]-p1[0]), p2[1]];
	  
	  /*  P3
	   *   |\
	   *   | \
	   *  P4--P2
	   *   | /
	   *   |/
	   *   P1
	   * */
	  return rasterFlatTriangle(p4, p2, p1).concat(rasterFlatTriangle(p4, p2, p3));
	}

	/* Returns all pixels that are at least partially covered by the triangle
	 * flat0-flat1-other, where the points flat0 and flat1 need to have the
	 * same y-value. This method is used internally for rasterTriangle(), which
	 * splits a general triangle into two flat triangles, and calls this method
	 * for both parts.
	 * Note: the returned array of pixels will contain duplicates.
	 *
	 * other
	 *  | \_
	 *  |   \_
	 *  |     \_
	 * f0/f1--f1/f0  
	 */
	function rasterFlatTriangle( flat0, flat1, other ) {

	  //console.log("RFT:\n%s\n%s\n%s", String(flat0), String(flat1), String(other));
	  var points = [];
	  assert(flat0[1] === flat1[1], 'not a flat triangle');
	  assert(other[1] !== flat0[1], 'not a triangle');
	  assert(flat0[0] !== flat1[0], 'not a triangle');

	  if (flat0[0] > flat1[0]) //guarantees that flat0 is always left of flat1
	  {
	    var tmp = flat0;
	    flat0 = flat1;
	    flat1 = tmp;
	  }
	  
	  var leftRasterPos = [other[0] <<0, other[1] <<0];
	  var rightRasterPos = leftRasterPos.slice(0);
	  points.push(leftRasterPos.slice(0));
	  var yDir = other[1] < flat0[1] ? +1 : -1;
	  var yStart = leftRasterPos[1];
	  var yBeyond= (flat0[1] <<0) + yDir;
	  var prevLeftRasterPos;
	  var prevRightRasterPos;

	  for (var y = yStart; (y*yDir) < (yBeyond*yDir); y+= yDir) {
	    do {
	      points.push( leftRasterPos.slice(0));
	      prevLeftRasterPos = leftRasterPos;
	      leftRasterPos = getNextPixel(other, flat0, leftRasterPos);
	    } while (leftRasterPos[1]*yDir <= y*yDir);
	    leftRasterPos = prevLeftRasterPos;
	    
	    do {
	      points.push( rightRasterPos.slice(0));
	      prevRightRasterPos = rightRasterPos;
	      rightRasterPos = getNextPixel(other, flat1, rightRasterPos);
	    } while (rightRasterPos[1]*yDir <= y*yDir);
	    rightRasterPos = prevRightRasterPos;
	    
	    for (var x = leftRasterPos[0]; x <= rightRasterPos[0]; x++) {
	      points.push([x, y]);
	    }
	  }
	  
	  return points;
	}

	/* Returns an array of all pixels that are at least partially covered by the
	 * convex quadrilateral 'quad'. If the passed quadrilateral is not convex,
	 * then the return value of this method is undefined.
	 */
	function rasterConvexQuad(quad) {
	  assert(quad.length == 4, 'Error: Quadrilateral with more or less than four vertices');
	  var res1  = rasterTriangle(quad[0], quad[1], quad[2]);
	  var res2 =  rasterTriangle(quad[0], quad[2], quad[3]);
	  return res1.concat(res2);
	}

	// computes the normal vector of the triangle a-b-c
	function normal(a, b, c) {
	  var d1 = sub3(a, b);
	  var d2 = sub3(b, c);
	  // normalized cross product of d1 and d2.
	  return norm3([ d1[1]*d2[2] - d1[2]*d2[1],
	                 d1[2]*d2[0] - d1[0]*d2[2],
	                 d1[0]*d2[1] - d1[1]*d2[0] ]);
	}

	/* returns the quadrilateral part of the XY plane that is currently visible on
	 * screen. The quad is returned in tile coordinates for tile zoom level
	 * 'tileZoomLevel', and thus can directly be used to determine which basemap
	 * and geometry tiles need to be loaded.
	 * Note: if the horizon is level (as should usually be the case for 
	 * OSMBuildings) then said quad is also a trapezoid. */
	function getViewQuad(viewProjectionMatrix, maxFarEdgeDistance, viewDirOnMap) {
	  /* maximum distance from the map center at which
	   * geometry is still visible */
	  //console.log("FMED:", MAX_FAR_EDGE_DISTANCE);

	  var inverse = glx.Matrix.invert(viewProjectionMatrix);

	  var vBottomLeft  = getIntersectionWithXYPlane(-1, -1, inverse);
	  var vBottomRight = getIntersectionWithXYPlane( 1, -1, inverse);
	  var vTopRight    = getIntersectionWithXYPlane( 1,  1, inverse);
	  var vTopLeft     = getIntersectionWithXYPlane(-1,  1, inverse);

	  /* If even the lower edge of the screen does not intersect with the map plane,
	   * then the map plane is not visible at all.
	   * (Or somebody screwed up the projection matrix, putting the view upside-down 
	   *  or something. But in any case we won't attempt to create a view rectangle).
	   */
	  if (!vBottomLeft || !vBottomRight) {
	    return;
	  }

	  var vLeftDir, vRightDir, vLeftPoint, vRightPoint;
	  var f;

	  /* The lower screen edge shows the map layer, but the upper one does not.
	   * This usually happens when the camera is close to parallel to the ground
	   * so that the upper screen edge lies above the horizon. This is not a bug
	   * and can legitimately happen. But from a theoretical standpoint, this means 
	   * that the view 'trapezoid' stretches infinitely toward the horizon. Since this
	   * is not a practically useful result - though formally correct - we instead
	   * manually bound that area.*/
	  if (!vTopLeft || !vTopRight) {
	    /* point on the left screen edge with the same y-value as the map center*/
	    vLeftPoint = getIntersectionWithXYPlane(-1, -0.9, inverse);
	    vLeftDir = norm2(sub2( vLeftPoint, vBottomLeft));
	    f = dot2(vLeftDir, viewDirOnMap);
	    vTopLeft = add2( vBottomLeft, mul2scalar(vLeftDir, maxFarEdgeDistance/f));
	    
	    vRightPoint = getIntersectionWithXYPlane( 1, -0.9, inverse);
	    vRightDir = norm2(sub2(vRightPoint, vBottomRight));
	    f = dot2(vRightDir, viewDirOnMap);
	    vTopRight = add2( vBottomRight, mul2scalar(vRightDir, maxFarEdgeDistance/f));
	  }

	  /* if vTopLeft is further than maxFarEdgeDistance away vertically from the map center,
	   * move it closer. */
	 if (dot2( viewDirOnMap, vTopLeft) > maxFarEdgeDistance) {
	    vLeftDir = norm2(sub2( vTopLeft, vBottomLeft));
	    f = dot2(vLeftDir, viewDirOnMap);
	    vTopLeft = add2( vBottomLeft, mul2scalar(vLeftDir, maxFarEdgeDistance/f));
	 }

	 /* dito for vTopRight*/
	 if (dot2( viewDirOnMap, vTopRight) > maxFarEdgeDistance) {
	    vRightDir = norm2(sub2( vTopRight, vBottomRight));
	    f = dot2(vRightDir, viewDirOnMap);
	    vTopRight = add2( vBottomRight, mul2scalar(vRightDir, maxFarEdgeDistance/f));
	 }
	 
	  return [vBottomLeft, vBottomRight, vTopRight, vTopLeft];
	}


	/* Returns an orthographic projection matrix whose view rectangle contains all
	 * points of 'points' when watched from the position given by targetViewMatrix.
	 * The depth range of the returned matrix is [near, far].
	 * The 'points' are given as euclidean coordinates in [m] distance to the 
	 * current reference point (MAP.position). 
	 */
	function getCoveringOrthoProjection(points, targetViewMatrix, near, far, height) {
	  var p0 = transformVec3(targetViewMatrix.data, points[0]);
	  var left = p0[0];
	  var right= p0[0];
	  var top  = p0[1];
	  var bottom=p0[1];

	  for (var i = 0; i < points.length; i++) {
	    var p =  transformVec3(targetViewMatrix.data, points[i]);
	    left = Math.min( left,  p[0]);
	    right= Math.max( right, p[0]);
	    top  = Math.max( top,   p[1]);
	    bottom=Math.min( bottom,p[1]);
	  }
	  
	  return new glx.Matrix.Ortho(left, right, top, bottom, near, far);
	}

	/* transforms the 3D vector 'v' according to the transformation matrix 'm'.
	 * Internally, the vector 'v' is interpreted as a 4D vector
	 * (v[0], v[1], v[2], 1.0) in homogenous coordinates. The transformation is
	 * performed on that vector, yielding a 4D homogenous result vector. That
	 * vector is then converted back to a 3D Euler coordinates by dividing
	 * its first three components each by its fourth component */
	function transformVec3(m, v) {
	  var x = v[0]*m[0] + v[1]*m[4] + v[2]*m[8]  + m[12];
	  var y = v[0]*m[1] + v[1]*m[5] + v[2]*m[9]  + m[13];
	  var z = v[0]*m[2] + v[1]*m[6] + v[2]*m[10] + m[14];
	  var w = v[0]*m[3] + v[1]*m[7] + v[2]*m[11] + m[15];
	  return [x/w, y/w, z/w]; //convert homogenous to Euler coordinates
	}

	/* returns the point (in OSMBuildings' local coordinates) on the XY plane (z==0)
	 * that would be drawn at viewport position (screenNdcX, screenNdcY).
	 * That viewport position is given in normalized device coordinates, i.e.
	 * x==-1.0 is the left screen edge, x==+1.0 is the right one, y==-1.0 is the lower
	 * screen edge and y==+1.0 is the upper one.
	 */
	function getIntersectionWithXYPlane(screenNdcX, screenNdcY, inverseTransform) {
	  var v1 = transformVec3(inverseTransform, [screenNdcX, screenNdcY, 0]);
	  var v2 = transformVec3(inverseTransform, [screenNdcX, screenNdcY, 1]);

	  // direction vector from v1 to v2
	  var vDir = sub3(v2, v1);

	  if (vDir[2] >= 0) // ray would not intersect with the plane
	  {
	    return;
	  }
	  /* ray equation for all world-space points 'p' lying on the screen-space NDC position
	   * (screenNdcX, screenNdcY) is:  p = v1 + λ*vDirNorm
	   * For the intersection with the xy-plane (-> z=0) holds: v1[2] + λ*vDirNorm[2] = p[2] = 0.0.
	   * Rearranged, this reads:   */
	  var lambda = -v1[2]/vDir[2];
	  var pos = add3( v1, mul3scalar(vDir, lambda));

	  return [pos[0], pos[1]];  // z==0 
	}

	/* Returns: the number of screen pixels that would be covered by the tile 
	 *          tileZoom/tileX/tileY *if* the screen would not end at the viewport
	 *          edges. The intended use of this method is to return a measure of 
	 *          how detailed the tile should be rendered.
	 * Note: This method does not clip the tile to the viewport. So the number
	 *       returned will be larger than the number of screen pixels covered iff.
	 *       the tile intersects with a viewport edge. 
	 */
	function getTileSizeOnScreen(tileX, tileY, tileZoom, viewProjMatrix) {
	  var metersPerDegreeLongitude = METERS_PER_DEGREE_LATITUDE * 
	                                 Math.cos(MAP.position.latitude / 180 * Math.PI);
	  var tileLon = tile2lon(tileX, tileZoom);
	  var tileLat = tile2lat(tileY, tileZoom);
	  
	  var modelMatrix = new glx.Matrix();
	  modelMatrix.translate( (tileLon - MAP.position.longitude)* metersPerDegreeLongitude,
	                        -(tileLat - MAP.position.latitude) * METERS_PER_DEGREE_LATITUDE, 0);

	  var size = getTileSizeInMeters( MAP.position.latitude, tileZoom);
	  
	  var mvpMatrix = glx.Matrix.multiply(modelMatrix, viewProjMatrix);
	  var tl = transformVec3(mvpMatrix, [0   , 0   , 0]);
	  var tr = transformVec3(mvpMatrix, [size, 0   , 0]);
	  var bl = transformVec3(mvpMatrix, [0   , size, 0]);
	  var br = transformVec3(mvpMatrix, [size, size, 0]);
	  var verts = [tl, tr, bl, br];
	  for (var i in verts) { 
	    // transformation from NDC [-1..1] to viewport [0.. width/height] coordinates
	    verts[i][0] = (verts[i][0] + 1.0) / 2.0 * MAP.width;
	    verts[i][1] = (verts[i][1] + 1.0) / 2.0 * MAP.height;
	  }
	  
	  return getConvexQuadArea( [tl, tr, br, bl]);
	}

	function getTriangleArea(p1, p2, p3) {
	  //triangle edge lengths
	  var a = len2(sub2( p1, p2));
	  var b = len2(sub2( p1, p3));
	  var c = len2(sub2( p2, p3));
	  
	  //Heron's formula
	  var s = 0.5 * (a+b+c);
	  return Math.sqrt( s * (s-a) * (s-b) * (s-c));
	}

	function getConvexQuadArea(quad) {
	  return getTriangleArea( quad[0], quad[1], quad[2]) + 
	         getTriangleArea( quad[0], quad[2], quad[3]);
	}

	function getTileSizeInMeters( latitude, zoom) {
	  return EARTH_CIRCUMFERENCE_IN_METERS * Math.cos(latitude / 180 * Math.PI) / 
	         Math.pow(2, zoom);
	}

	function getTilePositionFromLocal(localXY, zoom) {
	  
	  var metersPerDegreeLongitude = METERS_PER_DEGREE_LATITUDE * 
	                                 Math.cos(MAP.position.latitude / 180 * Math.PI);

	  var longitude= MAP.position.longitude + localXY[0] / metersPerDegreeLongitude;
	  var latitude = MAP.position.latitude -  localXY[1] / METERS_PER_DEGREE_LATITUDE;
	  
	  return [long2tile(longitude, zoom), lat2tile(latitude, zoom)];
	}

	//all four were taken from http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
	function long2tile(lon,zoom) { return (lon+180)/360*Math.pow(2,zoom); }
	function lat2tile(lat,zoom)  { return (1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom); }
	function tile2lon(x,z) { return (x/Math.pow(2,z)*360-180); }
	function tile2lat(y,z) { 
	  var n = Math.PI-2*Math.PI*y/Math.pow(2,z);
	  return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
	}

	function len2(a)   { return Math.sqrt( a[0]*a[0] + a[1]*a[1]);}
	function dot2(a,b) { return a[0]*b[0] + a[1]*b[1];}
	function sub2(a,b) { return [a[0]-b[0], a[1]-b[1]];}
	function add2(a,b) { return [a[0]+b[0], a[1]+b[1]];}
	function mul2scalar(a,f) { return [a[0]*f, a[1]*f];}
	function norm2(a)  { var l = len2(a); return [a[0]/l, a[1]/l]; }

	function dot3(a,b) { return a[0]*b[0] + a[1]*b[1] + a[2]+b[2];}
	function sub3(a,b) { return [a[0]-b[0], a[1]-b[1], a[2]-b[2]];}
	function add3(a,b) { return [a[0]+b[0], a[1]+b[1], a[2]+b[2]];}
	function mul3scalar(a,f) { return [a[0]*f, a[1]*f, a[2]*f];}
	function len3(a)   { return Math.sqrt( a[0]*a[0] + a[1]*a[1] + a[2]*a[2]);}
	function squaredLength(a) { return a[0]*a[0] + a[1]*a[1] + a[2]*a[2];}
	function norm3(a)  { var l = len3(a); return [a[0]/l, a[1]/l, a[2]/l]; }
	function dist3(a,b){ return len3(sub3(a,b));}


	var render = {

	  getFramebufferConfig: function(width, height, maxTexSize) {
	    var config = {};

	    config.width = Math.min(glx.util.nextPowerOf2(width),  maxTexSize );
	    config.height= Math.min(glx.util.nextPowerOf2(height), maxTexSize );

	    config.usedWidth = Math.min(width, config.width);
	    config.usedHeight= Math.min(height,config.height);

	    config.tcLeft  = 0.5 / config.width;
	    config.tcTop   = 0.5 / config.height;
	    config.tcRight = (config.usedWidth  - 0.5) / config.width;
	    config.tcBottom= (config.usedHeight - 0.5) / config.height;

	    return config;
	  },

	  getViewQuad: function() {
	    return getViewQuad( this.viewProjMatrix.data,
	                       (this.fogDistance + this.fogBlurDistance),
	                        this.viewDirOnMap);
	  },

	  start: function() {
	    this.viewMatrix = new glx.Matrix();
	    this.projMatrix = new glx.Matrix();
	    this.viewProjMatrix = new glx.Matrix();
	    this.viewDirOnMap = [0.0, -1.0];

	    MAP.on('change', this._onChange = this.onChange.bind(this));
	    this.onChange();

	    MAP.on('resize', this._onResize = this.onResize.bind(this));
	    this.onResize();  //initialize projection matrix
	    this.onChange();  //initialize view matrix

	    gl.cullFace(gl.BACK);
	    gl.enable(gl.CULL_FACE);
	    gl.enable(gl.DEPTH_TEST);

	    render.Picking.init(); // renders only on demand
	    render.SkyDome.init();
	    render.Buildings.init();
	    render.Basemap.init();
	    render.Overlay.init();
	    render.AmbientMap.init();
	    render.Blur.init();
	    //render.HudRect.init();
	    //render.NormalMap.init();
	    render.MapShadows.init();
	    render.CameraViewDepthMap = new render.DepthMap();
	    render.SunViewDepthMap    = new render.DepthMap();
	    
	    render.SunViewDepthMap.framebufferConfig = {
	      width:      SHADOW_DEPTH_MAP_SIZE,
	      height:     SHADOW_DEPTH_MAP_SIZE,
	      usedWidth:  SHADOW_DEPTH_MAP_SIZE,
	      usedHeight: SHADOW_DEPTH_MAP_SIZE,
	      tcLeft:     0.0,
	      tcTop:      0.0,
	      tcRight:    1.0,
	      tcBottom:   1.0 
	    };

	    //var quad = new mesh.DebugQuad();
	    //quad.updateGeometry( [-100, -100, 1], [100, -100, 1], [100, 100, 1], [-100, 100, 1]);
	    //data.Index.add(quad);

	    requestAnimationFrame( this.renderFrame.bind(this));
	  },
	  
	  renderFrame: function() {
	    Filter.nextTick();

	    requestAnimationFrame( this.renderFrame.bind(this));
	    
	    gl.clearColor(this.fogColor[0], this.fogColor[1], this.fogColor[2], 1);
	    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	    if (MAP.zoom < APP.minZoom || MAP.zoom > APP.maxZoom) {
	      return;
	    }
	    /*
	    var viewTrapezoid = this.getViewQuad( this.viewProjMatrix.data);
	    quad.updateGeometry([viewTrapezoid[0][0], viewTrapezoid[0][1], 1.0],
	                        [viewTrapezoid[1][0], viewTrapezoid[1][1], 1.0],
	                        [viewTrapezoid[2][0], viewTrapezoid[2][1], 1.0],
	                        [viewTrapezoid[3][0], viewTrapezoid[3][1], 1.0]);*/

	    Sun.updateView(this.getViewQuad());
	    render.SkyDome.render();
	    gl.clear(gl.DEPTH_BUFFER_BIT);	//ensure everything is drawn in front of the sky dome

	    if (!render.effects.shadows) {
	      render.Buildings.render();
	      render.Basemap.render();
	    } else {
	      var config = this.getFramebufferConfig(MAP.width, MAP.height, gl.getParameter(gl.MAX_TEXTURE_SIZE));

	      render.CameraViewDepthMap.render(this.viewProjMatrix, config, true);
	      render.SunViewDepthMap.render(Sun.viewProjMatrix);
	      render.AmbientMap.render(render.CameraViewDepthMap, config, 0.5);
	      render.Blur.render(render.AmbientMap.framebuffer, config);
	      render.Buildings.render(render.SunViewDepthMap.framebuffer, 0.5);
	      render.Basemap.render();

	      gl.blendFunc(gl.ZERO, gl.SRC_COLOR); //multiply DEST_COLOR by SRC_COLOR
	      gl.enable(gl.BLEND);
	      {
	        render.MapShadows.render(render.SunViewDepthMap.framebuffer, 0.5);
	        render.Overlay.render(render.Blur.framebuffer.renderTexture.id, config);
	      }
	      gl.disable(gl.BLEND);

	      // render.HudRect.render(render.SunViewDepthMap.framebuffer.renderTexture.id, config);
	    }

	    if (this.screenshotCallback) {
	      this.screenshotCallback(gl.canvas.toDataURL());
	      this.screenshotCallback = null;
	    }  
	  },

	  stop: function() {
	    clearInterval(this.loop);
	  },

	  updateFogDistance: function() {
	    var inverse = glx.Matrix.invert(this.viewProjMatrix.data);
	    
	    //need to store this as a reference point to determine fog distance
	    this.lowerLeftOnMap = getIntersectionWithXYPlane(-1, -1, inverse);
	    if (this.lowerLeftOnMap === undefined) {
	      return;
	    }

	    var lowerLeftDistanceToCenter = len2(this.lowerLeftOnMap);

	    /* fogDistance: closest distance at which the fog affects the geometry */
	    this.fogDistance = Math.max(1500, lowerLeftDistanceToCenter);
	    /* fogBlurDistance: closest distance *beyond* fogDistance at which everything is
	     *                  completely enclosed in fog. */
	    this.fogBlurDistance = 300;
	  },

	  onChange: function() {
	    var scale = 1.38*Math.pow(2, MAP.zoom-17);

	    this.viewMatrix = new glx.Matrix()
	      .rotateZ(MAP.rotation)
	      .rotateX(MAP.tilt)
	      .scale(scale, scale, scale);


	    this.viewDirOnMap = [ Math.sin(MAP.rotation / 180* Math.PI),
	                         -Math.cos(MAP.rotation / 180* Math.PI)];

	    this.viewProjMatrix = new glx.Matrix(glx.Matrix.multiply(this.viewMatrix, this.projMatrix));
	    this.updateFogDistance();
	  },

	  onResize: function() {
	    var
	      width = MAP.width,
	      height = MAP.height,
	      refHeight = 1024,
	      refVFOV = 45;

	    this.projMatrix = new glx.Matrix()
	      .translate(0, -height/2, -1220) // 0, MAP y offset to neutralize camera y offset, MAP z -1220 scales MAP tiles to ~256px
	      .scale(1, -1, 1) // flip Y
	      .multiply(new glx.Matrix.Perspective(refVFOV * height / refHeight, width/height, 1, 7500))
	      .translate(0, -1, 0); // camera y offset

	    glx.context.canvas.width  = width;
	    glx.context.canvas.height = height;
	    glx.context.viewport(0, 0, width, height);

	    this.viewProjMatrix = new glx.Matrix(glx.Matrix.multiply(this.viewMatrix, this.projMatrix));
	    this.updateFogDistance();
	  },

	  destroy: function() {
	    MAP.off('change', this._onChange);
	    MAP.off('resize', this._onResize);

	    this.stop();
	    render.Picking.destroy();
	    render.SkyDome.destroy();
	    render.Buildings.destroy();
	    render.Basemap.destroy();

	    render.NormalMap.destroy();
	    render.CameraViewDepthMap.destroy();
	    render.SunViewDepthMap.destroy();
	    render.AmbientMap.destroy();
	    render.Blur.destroy();
	  }
	};


	// TODO: perhaps render only clicked area

	render.Picking = {

	  idMapping: [null],
	  viewportSize: 512,

	  init: function() {
	    this.shader = new glx.Shader({
	      vertexShader: Shaders.interaction.vertex,
	      fragmentShader: Shaders.interaction.fragment,
	      attributes: ['aPosition', 'aID', 'aFilter'],
	      uniforms: [
	        'uModelMatrix',
	        'uViewMatrix',
	        'uProjMatrix',
	        'uMatrix',
	        'uFogRadius',
	        'uBendRadius',
	        'uBendDistance',
	        'uTime'
	      ]
	    });

	    this.framebuffer = new glx.Framebuffer(this.viewportSize, this.viewportSize);
	  },

	  // TODO: throttle calls
	  getTarget: function(x, y, callback) {
	    requestAnimationFrame(function() {
	      var
	        shader = this.shader,
	        framebuffer = this.framebuffer;

	      gl.viewport(0, 0, this.viewportSize, this.viewportSize);
	      shader.enable();
	      framebuffer.enable();

	      gl.clearColor(0, 0, 0, 1);
	      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	      gl.uniform1f(shader.uniforms.uFogRadius, render.fogRadius);

	      gl.uniform1f(shader.uniforms.uBendRadius, render.bendRadius);
	      gl.uniform1f(shader.uniforms.uBendDistance, render.bendDistance);

	      gl.uniform1f(shader.uniforms.uTime, Filter.getTime());

	      gl.uniformMatrix4fv(shader.uniforms.uViewMatrix,  false, render.viewMatrix.data);
	      gl.uniformMatrix4fv(shader.uniforms.uProjMatrix,  false, render.projMatrix.data);

	      var
	        dataItems = data.Index.items,
	        item,
	        modelMatrix;

	      for (var i = 0, il = dataItems.length; i<il; i++) {
	        item = dataItems[i];

	        if (MAP.zoom<item.minZoom || MAP.zoom>item.maxZoom) {
	          continue;
	        }

	        if (!(modelMatrix = item.getMatrix())) {
	          continue;
	        }

	        gl.uniformMatrix4fv(shader.uniforms.uModelMatrix, false, modelMatrix.data);
	        gl.uniformMatrix4fv(shader.uniforms.uMatrix, false, glx.Matrix.multiply(modelMatrix, render.viewProjMatrix));

	        item.vertexBuffer.enable();
	        gl.vertexAttribPointer(shader.attributes.aPosition, item.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	        item.idBuffer.enable();
	        gl.vertexAttribPointer(shader.attributes.aID, item.idBuffer.itemSize, gl.FLOAT, false, 0, 0);

	        item.filterBuffer.enable();
	        gl.vertexAttribPointer(shader.attributes.aFilter, item.filterBuffer.itemSize, gl.FLOAT, false, 0, 0);

	        gl.drawArrays(gl.TRIANGLES, 0, item.vertexBuffer.numItems);
	      }

	      x = x/MAP.width *this.viewportSize <<0;
	      y = y/MAP.height*this.viewportSize <<0;

	      var imageData = framebuffer.getPixel(x, this.viewportSize-y);
	      var color = imageData[0] | (imageData[1]<<8) | (imageData[2]<<16);

	      shader.disable();
	      framebuffer.disable();
	      gl.viewport(0, 0, MAP.width, MAP.height);

	      callback(this.idMapping[color]);
	    }.bind(this));
	  },

	  idToColor: function(id) {
	    var index = this.idMapping.indexOf(id);
	    if (index === -1) {
	      this.idMapping.push(id);
	      index = this.idMapping.length-1;
	    }
	    return [
	      ( index        & 0xff) / 255,
	      ((index >>  8) & 0xff) / 255,
	      ((index >> 16) & 0xff) / 255
	    ];
	  },

	  destroy: function() {}
	};


	function getDirection(rotationInDeg, tiltInDeg) {
	  var azimuth = rotationInDeg * Math.PI / 180;
	  var inclination = tiltInDeg * Math.PI / 180;

	  var x = -Math.sin(azimuth) * Math.cos(inclination);
	  var y =  Math.cos(azimuth) * Math.cos(inclination);
	  var z =                      Math.sin(inclination);
	  return [x, y, z];
	}

	var Sun = {

	  setDate: function(date) {
	    var pos = suncalc(date, MAP.position.latitude, MAP.position.longitude);
	    var rotationInDeg = pos.azimuth / (Math.PI/180);
	    var tiltInDeg     = 90 - pos.altitude / (Math.PI/180);

	    this.direction = getDirection(rotationInDeg, tiltInDeg);

	    this.viewMatrix = new glx.Matrix()
	      .rotateZ(rotationInDeg)
	      .rotateX(tiltInDeg)
	      .translate(0, 0, -5000)
	      .scale(1, -1, 1); // flip Y
	  },

	  updateView: function(coveredGroundVertices) {
	    // TODO: could parts be pre-calculated?
	    this.projMatrix = getCoveringOrthoProjection(
	      substituteZCoordinate(coveredGroundVertices, 0.0).concat(substituteZCoordinate(coveredGroundVertices,SHADOW_MAP_MAX_BUILDING_HEIGHT)),
	      this.viewMatrix,
	      1000,
	      7500
	    );

	    this.viewProjMatrix = new glx.Matrix(glx.Matrix.multiply(this.viewMatrix, this.projMatrix));
	  }
	};


	render.SkyDome = {

	  init: function() {
	    var geometry = this.createGeometry(this.baseRadius);
	    this.vertexBuffer   = new glx.Buffer(3, new Float32Array(geometry.vertices));
	    this.texCoordBuffer = new glx.Buffer(2, new Float32Array(geometry.texCoords));

	    this.shader = new glx.Shader({
	      vertexShader: Shaders.skydome.vertex,
	      fragmentShader: Shaders.skydome.fragment,
	      attributes: ['aPosition', 'aTexCoord'],
	      uniforms: ['uModelMatrix', 'uViewMatrix', 'uProjMatrix', 'uMatrix', 'uTexIndex', 'uFogColor', 'uBendRadius', 'uBendDistance']
	    });

	    Activity.setBusy();
	    var url = APP.baseURL + '/skydome.jpg';
	    this.texture = new glx.texture.Image().load(url, function(image) {
	      Activity.setIdle();
	      if (image) {
	        this.isReady = true;
	      }
	    }.bind(this));
	  },

	  baseRadius: 100,

	  createGeometry: function(radius) {
	    var
	      latSegments = 8,
	      lonSegments = 24,
	      vertices = [],
	      texCoords = [],
	      sin = Math.sin,
	      cos = Math.cos,
	      PI = Math.PI,
	      azimuth1, x1, y1,
	      azimuth2, x2, y2,
	      polar1,
	      polar2,
	      A, B, C, D,
	      tcLeft,
	      tcRight,
	      tcTop,
	      tcBottom;

	    for (var i = 0, j; i < lonSegments; i++) {
	      tcLeft = i/lonSegments;
	      azimuth1 = tcLeft*2*PI; // convert to radiants [0...2*PI]
	      x1 = cos(azimuth1)*radius;
	      y1 = sin(azimuth1)*radius;

	      tcRight = (i+1)/lonSegments;
	      azimuth2 = tcRight*2*PI;
	      x2 = cos(azimuth2)*radius;
	      y2 = sin(azimuth2)*radius;

	      for (j = 0; j < latSegments; j++) {
	        polar1 = j*PI/(latSegments*2); //convert to radiants in [0..1/2*PI]
	        polar2 = (j+1)*PI/(latSegments*2);

	        A = [x1*cos(polar1), y1*cos(polar1), radius*sin(polar1)];
	        B = [x2*cos(polar1), y2*cos(polar1), radius*sin(polar1)];
	        C = [x2*cos(polar2), y2*cos(polar2), radius*sin(polar2)];
	        D = [x1*cos(polar2), y1*cos(polar2), radius*sin(polar2)];

	        vertices.push.apply(vertices, A);
	        vertices.push.apply(vertices, B);
	        vertices.push.apply(vertices, C);
	        vertices.push.apply(vertices, A);
	        vertices.push.apply(vertices, C);
	        vertices.push.apply(vertices, D);

	        tcTop    = 1 - (j+1)/latSegments;
	        tcBottom = 1 - j/latSegments;

	        texCoords.push(tcLeft, tcBottom, tcRight, tcBottom, tcRight, tcTop, tcLeft, tcBottom, tcRight, tcTop, tcLeft, tcTop);
	      }
	    }

	    return { vertices: vertices, texCoords: texCoords };
	  },

	  render: function() {
	    if (!this.isReady) {
	      return;
	    }

	    var
	      fogColor = render.fogColor,
	      shader = this.shader;

	    shader.enable();

	    gl.uniform3fv(shader.uniforms.uFogColor, fogColor);

	    gl.uniform1f(shader.uniforms.uBendRadius, render.bendRadius);
	    gl.uniform1f(shader.uniforms.uBendDistance, render.bendDistance);

	    var modelMatrix = new glx.Matrix();
	    /* Make the skydome start right after the fog limit, but ensure that 
	     * it is not pushed farther away than the camera's far plane.
	     * (scale 73 with baseRadius 100 --> distance of 7400 units; far plane is at
	     * 7500;
	     */
	    var scale = Math.min((render.fogDistance + render.fogBlurDistance)/100.0, 73);

	    modelMatrix.scale(scale, scale, scale);

	    gl.uniformMatrix4fv(shader.uniforms.uModelMatrix, false, modelMatrix.data);
	    gl.uniformMatrix4fv(shader.uniforms.uViewMatrix,  false, render.viewMatrix.data);
	    gl.uniformMatrix4fv(shader.uniforms.uProjMatrix,  false, render.projMatrix.data);
	    gl.uniformMatrix4fv(shader.uniforms.uMatrix, false, glx.Matrix.multiply(modelMatrix, render.viewProjMatrix));

	    this.vertexBuffer.enable();
	    gl.vertexAttribPointer(shader.attributes.aPosition, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	    this.texCoordBuffer.enable();
	    gl.vertexAttribPointer(shader.attributes.aTexCoord, this.texCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	    gl.uniform1i(shader.uniforms.uTexIndex, 0);

	    this.texture.enable(0);

	    gl.drawArrays(gl.TRIANGLES, 0, this.vertexBuffer.numItems);

	    shader.disable();
	  },

	  destroy: function() {
	    this.texture.destroy();
	  }
	};


	render.Buildings = {

	  init: function() {
	  
	    this.shader = !render.effects.shadows ?
	      new glx.Shader({
	        vertexShader: Shaders.buildings.vertex,
	        fragmentShader: Shaders.buildings.fragment,
	        attributes: ['aPosition', 'aColor', 'aFilter', 'aNormal', 'aID'],
	        uniforms: [
	          'uModelMatrix',
	          'uViewMatrix',
	          'uProjMatrix',
	          'uViewDirOnMap',
	          'uMatrix',
	          'uNormalTransform',
	          'uAlpha',
	          'uLightColor',
	          'uLightDirection',
	          'uLowerEdgePoint',
	          'uFogDistance',
	          'uFogBlurDistance',
	          'uFogColor',
	          'uBendRadius',
	          'uBendDistance',
	          'uHighlightColor',
	          'uHighlightID',
	          'uTime'
	        ]
	      }) : new glx.Shader({
	        vertexShader: Shaders['buildings.shadows'].vertex,
	        fragmentShader: Shaders['buildings.shadows'].fragment,
	        attributes: ['aPosition', 'aColor', 'aFilter', 'aNormal', 'aID'],
	        uniforms: [
	          'uModelMatrix',
	          'uViewMatrix',
	          'uProjMatrix',
	          'uViewDirOnMap',
	          'uMatrix',
	          'uNormalTransform',
	          'uAlpha',
	          'uLightColor',
	          'uLightDirection',
	          'uShadowStrength',
	          'uLowerEdgePoint',
	          'uFogDistance',
	          'uFogBlurDistance',
	          'uFogColor',
	          'uBendRadius',
	          'uBendDistance',
	          'uHighlightColor',
	          'uHighlightID',
	          'uTime',
	          'uSunMatrix',
	          'uShadowTexIndex',
	          'uShadowTexDimensions'
	        ]
	    });
	  },

	  render: function(depthFramebuffer, shadowStrength) {

	    var shader = this.shader;
	    shader.enable();

	    if (this.showBackfaces) {
	      gl.disable(gl.CULL_FACE);
	    }

	    gl.uniform3fv(shader.uniforms.uLightColor, [0.5, 0.5, 0.5]);
	    gl.uniform3fv(shader.uniforms.uLightDirection, Sun.direction);
	    gl.uniform1f(shader.uniforms.uShadowStrength, shadowStrength);

	    var normalMatrix = glx.Matrix.invert3(new glx.Matrix().data);
	    gl.uniformMatrix3fv(shader.uniforms.uNormalTransform, false, glx.Matrix.transpose(normalMatrix));

	    gl.uniform2fv(shader.uniforms.uViewDirOnMap,   render.viewDirOnMap);
	    gl.uniform2fv(shader.uniforms.uLowerEdgePoint, render.lowerLeftOnMap);

	    gl.uniform1f(shader.uniforms.uFogDistance, render.fogDistance);
	    gl.uniform1f(shader.uniforms.uFogBlurDistance, render.fogBlurDistance);
	    gl.uniform3fv(shader.uniforms.uFogColor, render.fogColor);

	    gl.uniform1f(shader.uniforms.uBendRadius, render.bendRadius);
	    gl.uniform1f(shader.uniforms.uBendDistance, render.bendDistance);

	    gl.uniform3fv(shader.uniforms.uHighlightColor, render.highlightColor);

	    gl.uniform1f(shader.uniforms.uTime, Filter.getTime());

	    if (!this.highlightID) {
	      this.highlightID = [0, 0, 0];
	    }
	    gl.uniform3fv(shader.uniforms.uHighlightID, this.highlightID);

	    gl.uniformMatrix4fv(shader.uniforms.uViewMatrix,  false, render.viewMatrix.data);
	    gl.uniformMatrix4fv(shader.uniforms.uProjMatrix,  false, render.projMatrix.data);

	    gl.uniform1f(shader.uniforms.uShadowStrength,  shadowStrength);
	    
	    if (depthFramebuffer) {
	      gl.uniform2f(shader.uniforms.uShadowTexDimensions, depthFramebuffer.width, depthFramebuffer.height);
	      depthFramebuffer.renderTexture.enable(0);
	      gl.uniform1i(shader.uniforms.uShadowTexIndex, 0);
	    }

	    var
	      dataItems = data.Index.items,
	      item,
	      modelMatrix;

	    for (var i = 0, il = dataItems.length; i < il; i++) {
	      // no visibility check needed, Grid.purge() is taking care

	      item = dataItems[i];

	      if (MAP.zoom < item.minZoom || MAP.zoom > item.maxZoom) {
	        continue;
	      }

	      if (!(modelMatrix = item.getMatrix())) {
	        continue;
	      }

	      gl.uniformMatrix4fv(shader.uniforms.uModelMatrix, false, modelMatrix.data);
	      gl.uniformMatrix4fv(shader.uniforms.uMatrix, false, glx.Matrix.multiply(modelMatrix, render.viewProjMatrix));
	      gl.uniformMatrix4fv(shader.uniforms.uSunMatrix, false, glx.Matrix.multiply(modelMatrix, Sun.viewProjMatrix));

	      shader.bindBuffer(item.vertexBuffer, 'aPosition');
	      shader.bindBuffer(item.normalBuffer, 'aNormal');
	      shader.bindBuffer(item.colorBuffer,  'aColor');
	      shader.bindBuffer(item.filterBuffer, 'aFilter');
	      shader.bindBuffer(item.idBuffer,     'aID');

	      gl.drawArrays(gl.TRIANGLES, 0, item.vertexBuffer.numItems);
	    }

	    if (this.showBackfaces) {
	      gl.enable(gl.CULL_FACE);
	    }

	    shader.disable();
	  },

	  destroy: function() {}
	};


	/* This object renders the shadow for the map layer. It only renders the shadow,
	 * not the map itself. The intended use for this class is as a blended overlay
	 * so that the map can be rendered independently from the shadows cast on it.
	 */

	render.MapShadows = {

	  init: function() {
	    this.shader = new glx.Shader({
	      vertexShader: Shaders['basemap.shadows'].vertex,
	      fragmentShader: Shaders['basemap.shadows'].fragment,
	      attributes: ['aPosition', 'aNormal'],
	      uniforms: [
	        'uModelMatrix',
	        'uViewMatrix',
	        'uProjMatrix',
	        'uViewDirOnMap',
	        'uMatrix',
	        'uDirToSun',
	        'uNormalTransform',
	        'uLightColor',
	        'uLowerEdgePoint',
	        'uFogDistance',
	        'uFogBlurDistance',
	        'uShadowTexDimensions', 
	        'uShadowStrength',
	        'uSunMatrix',
	      ]
	    });
	    
	    this.mapPlane = new mesh.MapPlane();
	  },

	  render: function(depthFramebuffer, shadowStrength) {
	    var shader = this.shader;
	    shader.enable();

	    if (this.showBackfaces) {
	      gl.disable(gl.CULL_FACE);
	    }

	    gl.uniform3fv(shader.uniforms.uLightColor, [0.5, 0.5, 0.5]);
	    gl.uniform3fv(shader.uniforms.uDirToSun, Sun.direction);

	    gl.uniform2fv(shader.uniforms.uViewDirOnMap,   render.viewDirOnMap);
	    gl.uniform2fv(shader.uniforms.uLowerEdgePoint, render.lowerLeftOnMap);

	    gl.uniform1f(shader.uniforms.uFogDistance, render.fogDistance);
	    gl.uniform1f(shader.uniforms.uFogBlurDistance, render.fogBlurDistance);
	    gl.uniform3fv(shader.uniforms.uFogColor, render.fogColor);

	    gl.uniform2f(shader.uniforms.uShadowTexDimensions, depthFramebuffer.width, depthFramebuffer.height);
	    gl.uniform1f(shader.uniforms.uShadowStrength, shadowStrength);
	    depthFramebuffer.renderTexture.enable(0);
	    gl.uniform1i(shader.uniforms.uShadowTexIndex, 0);

	    var item = this.mapPlane;
	    if (MAP.zoom < item.minZoom || MAP.zoom > item.maxZoom) {
	      return;
	    }

	    var modelMatrix;
	    if (!(modelMatrix = item.getMatrix())) {
	      return;
	    }

	    gl.uniformMatrix4fv(shader.uniforms.uModelMatrix, false, modelMatrix.data);
	    gl.uniformMatrix4fv(shader.uniforms.uMatrix, false, glx.Matrix.multiply(modelMatrix, render.viewProjMatrix));
	    gl.uniformMatrix4fv(shader.uniforms.uSunMatrix, false, glx.Matrix.multiply(modelMatrix, Sun.viewProjMatrix));

	    shader.bindBuffer(item.vertexBuffer, 'aPosition');
	    shader.bindBuffer(item.normalBuffer, 'aNormal');

	    gl.drawArrays(gl.TRIANGLES, 0, item.vertexBuffer.numItems);

	    if (this.showBackfaces) {
	      gl.enable(gl.CULL_FACE);
	    }

	    shader.disable();
	  },

	  destroy: function() {}
	};


	render.Basemap = {

	  init: function() {
	    this.shader = new glx.Shader({
	      vertexShader: Shaders.basemap.vertex,
	      fragmentShader: Shaders.basemap.fragment,
	      attributes: ['aPosition', 'aTexCoord'],
	      uniforms: ['uModelMatrix', 'uViewMatrix', 'uProjMatrix', 'uMatrix', 'uTexIndex', 'uFogDistance', 'uFogBlurDistance', 'uFogColor', 'uLowerEdgePoint', 'uBendRadius', 'uBendDistance', 'uViewDirOnMap']
	    });
	  },

	  render: function() {
	    var layer = APP.basemapGrid;

	    if (!layer) {
	      return;
	    }

	    if (MAP.zoom < layer.minZoom || MAP.zoom > layer.maxZoom) {
	      return;
	    }

	    var
	      shader = this.shader,
	      tile,
	      zoom = Math.round(MAP.zoom);

	    shader.enable();

	    gl.uniform1f(shader.uniforms.uFogDistance, render.fogDistance);
	    gl.uniform1f(shader.uniforms.uFogBlurDistance, render.fogBlurDistance);
	    gl.uniform3fv(shader.uniforms.uFogColor, render.fogColor);

	//    gl.uniform1f(shader.uniforms.uBendRadius, render.bendRadius);
	//    gl.uniform1f(shader.uniforms.uBendDistance, render.bendDistance);

	    gl.uniform2fv(shader.uniforms.uViewDirOnMap,   render.viewDirOnMap);
	    gl.uniform2fv(shader.uniforms.uLowerEdgePoint, render.lowerLeftOnMap);

	    for (var key in layer.visibleTiles) {
	      tile = layer.tiles[key];

	      if (tile && tile.isReady) {
	        this.renderTile(tile, shader);
	        continue;
	      }

	      var parent = [tile.x/2<<0, tile.y/2<<0, zoom-1].join(',');
	      if (layer.tiles[parent] && layer.tiles[parent].isReady) {
	        // TODO: there will be overlap with adjacent tiles or parents of adjacent tiles!
	        this.renderTile(layer.tiles[ parent ], shader);
	        continue;
	      }

	      var children = [
	        [tile.x*2,   tile.y*2,   tile.zoom+1].join(','),
	        [tile.x*2+1, tile.y*2,   tile.zoom+1].join(','),
	        [tile.x*2,   tile.y*2+1, tile.zoom+1].join(','),
	        [tile.x*2+1, tile.y*2+1, tile.zoom+1].join(',')
	      ];

	      for (var i = 0; i < 4; i++) {
	        if (layer.tiles[ children[i] ] && layer.tiles[ children[i] ].isReady) {
	          this.renderTile(layer.tiles[ children[i] ], shader);
	        }
	      }
	    }

	    shader.disable();
	  },

	  renderTile: function(tile, shader) {
	    var metersPerDegreeLongitude = METERS_PER_DEGREE_LATITUDE * 
	                                   Math.cos(MAP.position.latitude / 180 * Math.PI);

	    var modelMatrix = new glx.Matrix();
	    modelMatrix.translate( (tile.longitude- MAP.position.longitude)* metersPerDegreeLongitude,
	                          -(tile.latitude - MAP.position.latitude) * METERS_PER_DEGREE_LATITUDE, 0);

	    gl.enable(gl.POLYGON_OFFSET_FILL);
	    gl.polygonOffset(MAX_USED_ZOOM_LEVEL - tile.zoom, 
	                     MAX_USED_ZOOM_LEVEL - tile.zoom);
	    gl.uniform2fv(shader.uniforms.uViewDirOnMap,   render.viewDirOnMap);
	    gl.uniform2fv(shader.uniforms.uLowerEdgePoint, render.lowerLeftOnMap);
	    gl.uniformMatrix4fv(shader.uniforms.uModelMatrix, false, modelMatrix.data);
	    gl.uniformMatrix4fv(shader.uniforms.uViewMatrix, false, render.viewMatrix.data);
	    gl.uniformMatrix4fv(shader.uniforms.uProjMatrix, false, render.projMatrix.data);
	    gl.uniformMatrix4fv(shader.uniforms.uMatrix, false, glx.Matrix.multiply(modelMatrix, render.viewProjMatrix));

	    tile.vertexBuffer.enable();
	    gl.vertexAttribPointer(shader.attributes.aPosition, tile.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	    tile.texCoordBuffer.enable();
	    gl.vertexAttribPointer(shader.attributes.aTexCoord, tile.texCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	    gl.uniform1i(shader.uniforms.uTexIndex, 0);

	    tile.texture.enable(0);

	    gl.drawArrays(gl.TRIANGLE_STRIP, 0, tile.vertexBuffer.numItems);
	    gl.disable(gl.POLYGON_OFFSET_FILL);
	  },

	  destroy: function() {}
	};


	/* 'HudRect' renders a textured rectangle to the top-right quarter of the viewport.
	   The intended use is visualize render-to-texture effects during development.
	 */
	render.HudRect = {

	  init: function() {
	  
	    var geometry = this.createGeometry();
	    this.vertexBuffer   = new glx.Buffer(3, new Float32Array(geometry.vertices));
	    this.texCoordBuffer = new glx.Buffer(2, new Float32Array(geometry.texCoords));

	    this.shader = new glx.Shader({
	      vertexShader: Shaders.texture.vertex,
	      fragmentShader: Shaders.texture.fragment,
	      attributes: ['aPosition', 'aTexCoord'],
	      uniforms: [ 'uMatrix', 'uTexIndex', 'uColor']
	    });
	  },

	  createGeometry: function() {
	    var vertices = [],
	        texCoords= [];
	    vertices.push(0, 0, 1E-5,
	                  1, 0, 1E-5,
	                  1, 1, 1E-5);
	    
	    vertices.push(0, 0, 1E-5,
	                  1, 1, 1E-5,
	                  0, 1, 1E-5);

	    texCoords.push(0.5,0.5,
	                   1.0,0.5,
	                   1.0,1.0);

	    texCoords.push(0.5,0.5,
	                   1.0,1.0,
	                   0.5,1.0);

	    return { vertices: vertices , texCoords: texCoords };
	  },

	  render: function(texture) {
	    var shader = this.shader;

	    shader.enable();
	    
	    var identity = new glx.Matrix();
	    gl.uniformMatrix4fv(shader.uniforms.uMatrix, false, identity.data);
	    this.vertexBuffer.enable();

	    gl.vertexAttribPointer(shader.attributes.aPosition, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	    this.texCoordBuffer.enable();
	    gl.vertexAttribPointer(shader.attributes.aTexCoord, this.texCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	    gl.bindTexture(gl.TEXTURE_2D, texture);
	    gl.activeTexture(gl.TEXTURE0);
	    gl.uniform1i(shader.uniforms.uTexIndex, 0);

	    gl.drawArrays(gl.TRIANGLES, 0, this.vertexBuffer.numItems);

	    shader.disable();
	  },

	  destroy: function() {}
	};


	/* 'NormalMap' renders the surface normals of the current view into a texture.
	   This normal texture can then be used for screen-space effects such as outline rendering
	   and screen-space ambient occlusion (SSAO).
	   
	   TODO: convert normals from world-space to screen-space?

	*/
	render.NormalMap = {

	  viewportSize: 512,

	  init: function() {
	    this.shader = new glx.Shader({
	      vertexShader: Shaders.normalmap.vertex,
	      fragmentShader: Shaders.normalmap.fragment,
	      attributes: ['aPosition', 'aNormal', 'aFilter'],
	      uniforms: ['uMatrix', 'uTime']
	    });

	    this.framebuffer = new glx.Framebuffer(this.viewportSize, this.viewportSize);
	    // enable texture filtering for framebuffer texture
	    gl.bindTexture(gl.TEXTURE_2D, this.framebuffer.renderTexture.id);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

	    this.mapPlane = new mesh.MapPlane();
	  },

	  render: function() {

	    var
	      shader = this.shader,
	      framebuffer = this.framebuffer;

	    gl.viewport(0, 0, this.viewportSize, this.viewportSize);
	    shader.enable();
	    framebuffer.enable();

	    //the color (0.5, 0.5, 1) corresponds to the normal (0, 0, 1), i.e. 'up'.
	    gl.clearColor(0.5, 0.5, 1, 1);
	    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	    gl.uniform1f(shader.uniforms.uTime, Filter.getTime());

	    var
	      dataItems = data.Index.items.concat([this.mapPlane]),
	      item,
	      modelMatrix;

	    for (var i = 0, il = dataItems.length; i < il; i++) {
	      item = dataItems[i];

	      if (MAP.zoom < item.minZoom || MAP.zoom > item.maxZoom) {
	        continue;
	      }

	      if (!(modelMatrix = item.getMatrix())) {
	        continue;
	      }

	      gl.uniformMatrix4fv(shader.uniforms.uMatrix, false, glx.Matrix.multiply(modelMatrix, render.viewProjMatrix));

	      item.vertexBuffer.enable();
	      gl.vertexAttribPointer(shader.attributes.aPosition, item.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	      item.normalBuffer.enable();
	      gl.vertexAttribPointer(shader.attributes.aNormal, item.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	      item.filterBuffer.enable();
	      gl.vertexAttribPointer(shader.attributes.aFilter, item.filterBuffer.itemSize, gl.FLOAT, false, 0, 0);

	      gl.drawArrays(gl.TRIANGLES, 0, item.vertexBuffer.numItems);
	    }

	    shader.disable();
	    framebuffer.disable();

	    gl.bindTexture(gl.TEXTURE_2D, this.framebuffer.renderTexture.id);
	    gl.generateMipmap(gl.TEXTURE_2D);
	    
	    gl.viewport(0, 0, MAP.width, MAP.height);

	  },

	  destroy: function() {}
	};


	/* 'DepthMap' renders depth buffer of the current view into a texture. To be compatible with as
	   many devices as possible, this code does not use the WEBGL_depth_texture extension, but
	   instead color-codes the depth value into an ordinary RGB8 texture.

	   This depth texture can then be used for effects such as outline rendering, screen-space
	   ambient occlusion (SSAO) and shadow mapping.
	*/

	render.DepthMap = function() {
	  this.shader = new glx.Shader({
	    vertexShader: Shaders.depth.vertex,
	    fragmentShader: Shaders.depth.fragment,
	    attributes: ['aPosition', 'aFilter'],
	    uniforms: ['uMatrix', 'uModelMatrix', 'uTime', 'uFogDistance', 'uFogBlurDistance', 'uViewDirOnMap', 'uLowerEdgePoint', 'uIsPerspectiveProjection']
	  });
	  
	  this.framebuffer = new glx.Framebuffer(128, 128); //dummy values, will be resized dynamically

	  this.mapPlane = new mesh.MapPlane();
	};

	render.DepthMap.prototype.render = function(viewProjMatrix, framebufferConfig, isPerspective) {

	  var
	    shader = this.shader,
	    framebuffer = this.framebuffer;

	  if (!framebufferConfig && this.framebufferConfig)
	    framebufferConfig = this.framebufferConfig;


	  if (framebuffer.width != framebufferConfig.width || 
	      framebuffer.height!= framebufferConfig.height) {
	    framebuffer.setSize( framebufferConfig.width, framebufferConfig.height );

	    /* We will be sampling neighboring pixels of the depth texture to create an ambient
	     * occlusion map. With the default texture wrap mode 'gl.REPEAT', sampling the neighbors
	     * of edge texels would return texels on the opposite edge of the texture, which is not
	     * what we want. Setting the wrap mode to 'gl.CLAMP_TO_EDGE' instead returns 
	     * the texels themselves, which is far more useful for ambient occlusion maps */
	    gl.bindTexture(gl.TEXTURE_2D, this.framebuffer.renderTexture.id);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	    
	    /* We will explicitly access (neighbor) texels in the depth texture to 
	     * compute the ambient map. So linear interpolation or mip-mapping of 
	     * texels is neither necessary nor desirable.
	     * Disabling it can also noticably improve render performance, as it leads to fewer
	     * texture lookups (1 for "NEAREST" vs. 4 for "LINEAR" vs. 8 for "LINEAR_MIPMAP_LINEAR");
	     */
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	  }
	    
	  shader.enable();
	  framebuffer.enable();
	  gl.viewport(0, 0, framebufferConfig.usedWidth, framebufferConfig.usedHeight);

	  gl.clearColor(0.0, 0.0, 0.0, 1);
	  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	  var item, modelMatrix;

	  gl.uniform1f(shader.uniforms.uTime, Filter.getTime());
	  gl.uniform1f(shader.uniforms.uFogRadius, render.fogRadius);
	  gl.uniform1i(shader.uniforms.uIsPerspectiveProjection, isPerspective ? 1 : 0);

	  // render all actual data items, but also a dummy map plane
	  // Note: SSAO on the map plane has been disabled temporarily
	  var dataItems = data.Index.items.concat([this.mapPlane]);

	  for (var i = 0; i < dataItems.length; i++) {
	    item = dataItems[i];

	    if (MAP.zoom < item.minZoom || MAP.zoom > item.maxZoom) {
	      continue;
	    }

	    if (!(modelMatrix = item.getMatrix())) {
	      continue;
	    }

	    gl.uniform2fv(shader.uniforms.uViewDirOnMap, render.viewDirOnMap);
	    gl.uniform2fv(shader.uniforms.uLowerEdgePoint, render.lowerLeftOnMap);
	    gl.uniformMatrix4fv(shader.uniforms.uMatrix, false, glx.Matrix.multiply(modelMatrix, viewProjMatrix));
	    gl.uniformMatrix4fv(shader.uniforms.uModelMatrix, false, modelMatrix.data);
	    gl.uniform1f(shader.uniforms.uFogDistance, render.fogDistance);
	    gl.uniform1f(shader.uniforms.uFogBlurDistance, render.fogBlurDistance);
	    
	    item.vertexBuffer.enable();
	    gl.vertexAttribPointer(shader.attributes.aPosition, item.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	    item.filterBuffer.enable();
	    gl.vertexAttribPointer(shader.attributes.aFilter, item.filterBuffer.itemSize, gl.FLOAT, false, 0, 0);

	    gl.drawArrays(gl.TRIANGLES, 0, item.vertexBuffer.numItems);
	  }

	  shader.disable();
	  framebuffer.disable();

	  gl.viewport(0, 0, MAP.width, MAP.height);
	};

	render.DepthMap.prototype.destroy = function() {};



	render.AmbientMap = {

	  init: function() {
	    this.shader = new glx.Shader({
	      vertexShader:   Shaders.ambientFromDepth.vertex,
	      fragmentShader: Shaders.ambientFromDepth.fragment,
	      attributes: ['aPosition', 'aTexCoord'],
	      uniforms: ['uMatrix', 'uInverseTexWidth', 'uInverseTexHeight', 'uTexIndex', 'uEffectStrength']
	    });

	    this.framebuffer = new glx.Framebuffer(128, 128); //dummy value, size will be set dynamically
	    
	    this.vertexBuffer = new glx.Buffer(3, new Float32Array([
	      -1, -1, 1E-5,
	       1, -1, 1E-5,
	       1,  1, 1E-5,
	      -1, -1, 1E-5,
	       1,  1, 1E-5,
	      -1,  1, 1E-5
	    ]));
	       
	    this.texCoordBuffer = new glx.Buffer(2, new Float32Array([
	      0,0,
	      1,0,
	      1,1,
	      0,0,
	      1,1,
	      0,1
	    ]));
	  },

	  render: function(depthMap, framebufferConfig, effectStrength) {

	    var
	      shader = this.shader,
	      framebuffer = this.framebuffer;

	    if (effectStrength === undefined) {
	      effectStrength = 1.0;
	    }

	    if (framebuffer.width != framebufferConfig.width || 
	        framebuffer.height!= framebufferConfig.height)
	    {
	      framebuffer.setSize( framebufferConfig.width, framebufferConfig.height );
	      gl.bindTexture(gl.TEXTURE_2D, this.framebuffer.renderTexture.id);
	      // we'll render the blurred image 1:1 to the screen pixels,
	      // so no interpolation is necessary
	      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	    }


	    if (framebufferConfig.tcRight  != this.tcRight || 
	        framebufferConfig.tcTop    != this.tcTop   || 
	        framebufferConfig.tcLeft   != this.tcLeft  ||
	        framebufferConfig.tcBottom != this.tcBottom )
	    {
	      this.texCoordBuffer.destroy();
	      this.texCoordBuffer = new glx.Buffer(2, new Float32Array(
	        [framebufferConfig.tcLeft,  framebufferConfig.tcTop,
	         framebufferConfig.tcRight, framebufferConfig.tcTop,
	         framebufferConfig.tcRight, framebufferConfig.tcBottom,
	         framebufferConfig.tcLeft,  framebufferConfig.tcTop,
	         framebufferConfig.tcRight, framebufferConfig.tcBottom,
	         framebufferConfig.tcLeft,  framebufferConfig.tcBottom
	        ]));      
	    
	      this.tcRight = framebufferConfig.tcRight;
	      this.tcBottom= framebufferConfig.tcBottom;
	      this.tcLeft =  framebufferConfig.tcLeft;
	      this.tcTop =   framebufferConfig.tcTop;
	    }
	    gl.viewport(0, 0, framebufferConfig.usedWidth, framebufferConfig.usedHeight);
	    shader.enable();
	    framebuffer.enable();

	    gl.clearColor(1.0, 0.0, 0, 1);
	    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


	    var identity = new glx.Matrix();
	    gl.uniformMatrix4fv(shader.uniforms.uMatrix, false, identity.data);

	    gl.uniform1f(shader.uniforms.uInverseTexWidth,  1/framebufferConfig.width);
	    gl.uniform1f(shader.uniforms.uInverseTexHeight, 1/framebufferConfig.height);
	    gl.uniform1f(shader.uniforms.uEffectStrength,  effectStrength);

	    this.vertexBuffer.enable();
	    gl.vertexAttribPointer(shader.attributes.aPosition, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	    this.texCoordBuffer.enable();
	    gl.vertexAttribPointer(shader.attributes.aTexCoord, this.texCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	    gl.bindTexture(gl.TEXTURE_2D, depthMap.framebuffer.renderTexture.id);
	    gl.activeTexture(gl.TEXTURE0);
	    gl.uniform1i(shader.uniforms.uTexIndex, 0);

	    gl.drawArrays(gl.TRIANGLES, 0, this.vertexBuffer.numItems);

	    shader.disable();
	    framebuffer.disable();

	    gl.bindTexture(gl.TEXTURE_2D, this.framebuffer.renderTexture.id);
	    //gl.generateMipmap(gl.TEXTURE_2D); //no interpolation --> don't need a mipmap
	    
	    gl.viewport(0, 0, MAP.width, MAP.height);

	  },

	  destroy: function() {}
	};


	/* 'Overlay' renders part of a texture over the whole viewport.
	   The intended use is for compositing of screen-space effects.
	 */
	render.Overlay = {

	  init: function() {
	  
	    var geometry = this.createGeometry();
	    this.vertexBuffer   = new glx.Buffer(3, new Float32Array(geometry.vertices));
	    this.texCoordBuffer = new glx.Buffer(2, new Float32Array(geometry.texCoords));

	    this.shader = new glx.Shader({
	      vertexShader: Shaders.texture.vertex,
	      fragmentShader: Shaders.texture.fragment,
	      attributes: ['aPosition', 'aTexCoord'],
	      uniforms: [ 'uMatrix', 'uTexIndex', 'uColor']
	    });
	  },

	  createGeometry: function() {
	    var vertices = [],
	        texCoords= [];
	    vertices.push(-1,-1, 1E-5,
	                   1,-1, 1E-5,
	                   1, 1, 1E-5);
	    
	    vertices.push(-1,-1, 1E-5,
	                   1, 1, 1E-5,
	                  -1, 1, 1E-5);

	    texCoords.push(0.0,0.0,
	                   1.0,0.0,
	                   1.0,1.0);

	    texCoords.push(0.0,0.0,
	                   1.0,1.0,
	                   0.0,1.0);

	    return { vertices: vertices , texCoords: texCoords };
	  },

	  render: function(texture, framebufferConfig) {
	    var tcHorizMin, tcVertMin, tcHorizMax, tcVertMax;
	    
	    if (framebufferConfig !== undefined)
	    {
	      tcHorizMin = 0                            / framebufferConfig.width;
	      tcHorizMax = framebufferConfig.usedWidth  / framebufferConfig.width;
	      tcVertMin  = 0                            / framebufferConfig.height;
	      tcVertMax  = framebufferConfig.usedHeight / framebufferConfig.height;
	    } else
	    {
	      tcHorizMin = tcVertMin = 0.0;
	      tcHorizMax = tcVertMax = 1.0;
	    }

	    if (tcHorizMin != this.tcHorizMin ||
	        tcHorizMax != this.tcHorizMax ||
	        tcVertMin != this.tcVertMin ||
	        tcVertMax != this.tcVertMax)
	    {
	      //console.log("resetting texCoord buffer to", tcHorizMin, tcHorizMax, tcVertMin, tcVertMax);
	      this.texCoordBuffer.destroy();
	      this.texCoordBuffer = new glx.Buffer(2, new Float32Array([
	        tcHorizMin, tcVertMin,
	        tcHorizMax, tcVertMin,
	        tcHorizMax, tcVertMax,

	        tcHorizMin, tcVertMin,
	        tcHorizMax, tcVertMax,
	        tcHorizMin, tcVertMax]));
	      
	      this.tcHorizMin = tcHorizMin;
	      this.tcHorizMax = tcHorizMax;
	      this.tcVertMin  = tcVertMin;
	      this.tcVertMax  = tcVertMax;
	    }

	    var shader = this.shader;

	    shader.enable();
	    /* we are rendering an *overlay* that is supposed to be rendered on top of the
	     * scene no matter what its actual depth is. */
	    gl.disable(gl.DEPTH_TEST);    
	    
	    var identity = new glx.Matrix();
	    gl.uniformMatrix4fv(shader.uniforms.uMatrix, false, identity.data);
	    this.vertexBuffer.enable();

	    gl.vertexAttribPointer(shader.attributes.aPosition, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	    this.texCoordBuffer.enable();
	    gl.vertexAttribPointer(shader.attributes.aTexCoord, this.texCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	    gl.bindTexture(gl.TEXTURE_2D, texture);
	    gl.activeTexture(gl.TEXTURE0);
	    gl.uniform1i(shader.uniforms.uTexIndex, 0);

	    gl.drawArrays(gl.TRIANGLES, 0, this.vertexBuffer.numItems);

	    gl.enable(gl.DEPTH_TEST);
	    shader.disable();
	  },

	  destroy: function() {}
	};


	render.Blur = {

	  init: function() {
	    this.shader = new glx.Shader({
	      vertexShader:   Shaders.blur.vertex,
	      fragmentShader: Shaders.blur.fragment,
	      attributes: ['aPosition', 'aTexCoord'],
	      uniforms: ['uMatrix', 'uInverseTexWidth', 'uInverseTexHeight', 'uTexIndex']
	    });

	    this.framebuffer = new glx.Framebuffer(128, 128); //dummy value, size will be set dynamically
	    
	    this.vertexBuffer = new glx.Buffer(3, new Float32Array([
	      -1, -1, 1E-5,
	       1, -1, 1E-5,
	       1,  1, 1E-5,
	      -1, -1, 1E-5,
	       1,  1, 1E-5,
	      -1,  1, 1E-5
	    ]));
	       
	    this.texCoordBuffer = new glx.Buffer(2, new Float32Array([
	      0,0,
	      1,0,
	      1,1,
	      0,0,
	      1,1,
	      0,1
	    ]));
	  },

	  render: function(inputFramebuffer, framebufferConfig) {

	    var
	      shader = this.shader,
	      framebuffer = this.framebuffer;


	    if (framebuffer.width != framebufferConfig.width || 
	        framebuffer.height!= framebufferConfig.height)
	    {
	      framebuffer.setSize( framebufferConfig.width, framebufferConfig.height );
	      gl.bindTexture(gl.TEXTURE_2D, this.framebuffer.renderTexture.id);
	      // we'll render the blurred image 1:1 to the screen pixels,
	      // so no interpolation is necessary
	      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	    }


	    if (framebufferConfig.tcRight  != this.tcRight || 
	        framebufferConfig.tcTop    != this.tcTop   || 
	        framebufferConfig.tcLeft   != this.tcLeft  ||
	        framebufferConfig.tcBottom != this.tcBottom )
	    {
	      this.texCoordBuffer.destroy();
	      this.texCoordBuffer = new glx.Buffer(2, new Float32Array(
	        [framebufferConfig.tcLeft,  framebufferConfig.tcTop,
	         framebufferConfig.tcRight, framebufferConfig.tcTop,
	         framebufferConfig.tcRight, framebufferConfig.tcBottom,
	         framebufferConfig.tcLeft,  framebufferConfig.tcTop,
	         framebufferConfig.tcRight, framebufferConfig.tcBottom,
	         framebufferConfig.tcLeft,  framebufferConfig.tcBottom
	        ]));      
	    
	      this.tcRight = framebufferConfig.tcRight;
	      this.tcBottom= framebufferConfig.tcBottom;
	      this.tcLeft =  framebufferConfig.tcLeft;
	      this.tcTop =   framebufferConfig.tcTop;
	    }

	    gl.viewport(0, 0, framebufferConfig.usedWidth, framebufferConfig.usedHeight);
	    shader.enable();
	    framebuffer.enable();

	    gl.clearColor(1.0, 0.0, 0, 1);
	    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


	    var identity = new glx.Matrix();
	    gl.uniformMatrix4fv(shader.uniforms.uMatrix, false, identity.data);

	    gl.uniform1f(shader.uniforms.uInverseTexWidth,  1/framebuffer.width);
	    gl.uniform1f(shader.uniforms.uInverseTexHeight, 1/framebuffer.height);

	    this.vertexBuffer.enable();
	    gl.vertexAttribPointer(shader.attributes.aPosition, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	    this.texCoordBuffer.enable();
	    gl.vertexAttribPointer(shader.attributes.aTexCoord, this.texCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	    gl.bindTexture(gl.TEXTURE_2D, inputFramebuffer.renderTexture.id);
	    gl.activeTexture(gl.TEXTURE0);
	    gl.uniform1i(shader.uniforms.uTexIndex, 0);

	    gl.drawArrays(gl.TRIANGLES, 0, this.vertexBuffer.numItems);

	    shader.disable();
	    framebuffer.disable();

	    gl.bindTexture(gl.TEXTURE_2D, this.framebuffer.renderTexture.id);
	    //gl.generateMipmap(gl.TEXTURE_2D); //no interpolation --> don't need a mipmap
	    
	    gl.viewport(0, 0, MAP.width, MAP.height);

	  },

	  destroy: function() {}
	};


	var basemap = {};


	basemap.Tile = function(x, y, zoom) {
	  this.x = x;
	  this.y = y;
	  this.latitude = tile2lat(y, zoom);
	  this.longitude= tile2lon(x, zoom);
	  this.zoom = zoom;
	  this.key = [x, y, zoom].join(',');

	  // note: due to the Mercator projection the tile width in meters is equal
	  //       to the tile height in meters.
	  var size = getTileSizeInMeters( this.latitude, zoom);
	  
	  var vertices = [
	    size, size, 0,
	    size,    0, 0,
	       0, size, 0,
	       0,    0, 0
	  ];

	  var texCoords = [
	    1, 1,
	    1, 0,
	    0, 1,
	    0, 0
	  ];

	  this.vertexBuffer = new glx.Buffer(3, new Float32Array(vertices));
	  this.texCoordBuffer = new glx.Buffer(2, new Float32Array(texCoords));
	};

	basemap.Tile.prototype = {
	  load: function(url) {
	    Activity.setBusy();
	    this.texture = new glx.texture.Image().load(url, function(image) {
	      Activity.setIdle();
	      if (image) {
	        this.isReady = true;
	        /* The whole texture will be mapped to fit the whole tile exactly. So
	         * don't attempt to wrap around the texture coordinates. */
	        gl.bindTexture(gl.TEXTURE_2D, this.texture.id);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	      }
	    }.bind(this));
	  },

	  destroy: function() {
	    this.vertexBuffer.destroy();
	    this.texCoordBuffer.destroy();
	    if (this.texture) {
	      this.texture.destroy();
	    }
	  }
	};
	}(this));
	//# sourceMappingURL=OSMBuildings.debug.js.map

/***/ }
/******/ ]);