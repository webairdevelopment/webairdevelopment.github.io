// Hi! This 3D model was built using the <canvas> 2D drawing API.
// I'm working on a library to make these sort of 3D illustrations,
// But it's not ready for prime-time. Stay tuned! *~ dd ~*

// -------------------------- utils -------------------------- //

var TAU = Math.PI * 2;

function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

function lerp( a, b, t ) {
  return ( b - a ) * t + a;
}

function modulo( num, div ) {
  return ( ( num % div ) + div ) % div;
}

function getDistance1( x, y ) {
  return Math.sqrt( x * x + y * y );
}

function shapeSorter( a, b ) {
  return a.sortValue - b.sortValue;
}

var powerMultipliers = {
  2: function( i ) {
    return i * i;
  },
  3: function( i ) {
    return i * i * i;
  },
  4: function( i ) {
    return i * i * i * i;
  },
  5: function( i ) {
    return i * i * i * i * i;
  }
};

function easeInOut( i, power ) {
  if ( power == 1 ) {
    return i;
  }
  var powerMultiplier = powerMultipliers[ power ] || powerMultipliers[2];

  i = i % 1;
  var isFirstHalf = i < 0.5;
  var slope = isFirstHalf ? i : 1 - i;
  slope = slope / 0.5;
  // make easing steeper with more multiples
  var curve = powerMultiplier( slope );
  curve = curve / 2;
  return isFirstHalf ? curve : 1 - curve;
}

// -------------------------- Vector3 -------------------------- //

function Vector3( position ) {
  this.set( position );
}

Vector3.prototype.set = function( pos ) {
  pos = Vector3.sanitize( pos );
  this.x = pos.x;
  this.y = pos.y;
  this.z = pos.z;
  return this;
};

Vector3.prototype.rotate = function( rotation ) {
  if ( !rotation ) {
    return;
  }
  rotation = Vector3.sanitize( rotation );
  this.rotateZ( rotation.z );
  this.rotateY( rotation.y );
  this.rotateX( rotation.x );
  return this;
};

Vector3.prototype.rotateZ = function( angle ) {
  rotateProperty( this, angle, 'x', 'y' );
};

Vector3.prototype.rotateX = function( angle ) {
  rotateProperty( this, angle, 'y', 'z' );
};

Vector3.prototype.rotateY = function( angle ) {
  rotateProperty( this, angle, 'x', 'z' );
};

function rotateProperty( vec, angle, propA, propB ) {
  if ( angle % TAU === 0 ) {
    return;
  }
  var cos = Math.cos( angle );
  var sin = Math.sin( angle );
  var a = vec[ propA ];
  var b = vec[ propB ];
  vec[ propA ] = a*cos - b*sin;
  vec[ propB ] = b*cos + a*sin;
}

Vector3.prototype.add = function( vec ) {
  if ( !vec ) {
    return;
  }
  vec = Vector3.sanitize( vec );
  this.x += vec.x;
  this.y += vec.y;
  this.z += vec.z;
  return this;
};

Vector3.prototype.subtract = function( vec ) {
  if ( !vec ) {
    return;
  }
  vec = Vector3.sanitize( vec );
  this.x -= vec.x;
  this.y -= vec.y;
  this.z -= vec.z;
  return this;
};

Vector3.prototype.multiply = function( value ) {
  if ( value === undefined ) {
    return;
  }
  // multiple all values by same number
  if ( typeof value == 'number' ) {
    this.x *= value;
    this.y *= value;
    this.z *= value;
    return;
  }
  // multiply object
  var vec = Vector3.sanitize( value, 1 );
  this.x *= vec.x;
  this.y *= vec.y;
  this.z *= vec.z;
  return this;
};

Vector3.prototype.transform = function( translation, rotation, scale ) {
  this.multiply( scale );
  this.rotate( rotation );
  this.add( translation );
};

Vector3.prototype.lerp = function( vec, t ) {
  vec = Vector3.sanitize( vec );
  this.x = lerp( this.x, vec.x, t );
  this.y = lerp( this.y, vec.y, t );
  this.z = lerp( this.z, vec.z, t );
  return this;
};

Vector3.prototype.magnitude = function() {
  var sum = this.x*this.x + this.y*this.y + this.z*this.z;
  // PERF: check if sum ~= 1 and skip sqrt
  if ( Math.abs( sum - 1 ) < 0.00000001 ) {
    return 1;
  }
  return Math.sqrt( sum );
};

Vector3.prototype.copy = function() {
  return new Vector3( this );
};

// ----- utils ----- //

// add missing properties
Vector3.sanitize = function( vec, value ) {
  vec = vec || {};
  value = value || 0;
  vec.x = vec.x === undefined ? value : vec.x;
  vec.y = vec.y === undefined ? value : vec.y;
  vec.z = vec.z === undefined ? value : vec.z;
  return vec;
};

// -------------------------- Anchor -------------------------- //

function Anchor( options ) {
  this.create( options );
}

Anchor.prototype.create = function( options ) {
  // set defaults & options
  extend( this, this.constructor.defaults );
  options = options || {};
  this.setOptions( this, options );

  // transform
  this.translate = new Vector3( options.translate );
  this.rotate = new Vector3( options.rotate );
  // scale
  if ( typeof options.scale == 'number' ) {
    this.scale = Vector3.sanitize( {}, options.scale );
  } else {
    this.scale = Vector3.sanitize( options.scale, 1 );
  }

  // origin
  this.origin = new Vector3();
  this.renderOrigin = new Vector3();
  // children
  this.children = [];
  if ( this.addTo ) {
    this.addTo.addChild( this );
  }
};

Anchor.defaults = {};

Anchor.optionKeys = Object.keys( Anchor.defaults ).concat([
  'rotate',
  'translate',
  'scale',
  'addTo',
]);

Anchor.prototype.setOptions = function( item, options ) {
  var optionKeys = this.constructor.optionKeys;

  for ( var key in options ) {
    if ( optionKeys.includes( key ) ) {
      item[ key ] = options[ key ];
    }
  }
};

Anchor.prototype.addChild = function( shape ) {
  this.children.push( shape );
};

// ----- update ----- //

Anchor.prototype.update = function() {
  // update self
  this.reset();
  // update children
  this.children.forEach( function( child ) {
    child.update();
  });
  this.transform( this.translate, this.rotate, this.scale );
};

Anchor.prototype.reset = function() {
  this.renderOrigin.set( this.origin );
};

Anchor.prototype.transform = function( translation, rotation, scale ) {
  this.renderOrigin.transform( translation, rotation, scale );
  // transform children
  this.children.forEach( function( child ) {
    child.transform( translation, rotation, scale );
  });
};


Anchor.prototype.updateGraph = function() {
  this.update();
  this.checkFlatGraph();
  this.flatGraph.forEach( function( item ) {
    item.updateSortValue();
  });
  // z-sort
  this.flatGraph.sort( shapeSorter );
};

Anchor.prototype.checkFlatGraph = function() {
  if ( !this.flatGraph ) {
    this.updateFlatGraph();
  }
};

Anchor.prototype.updateFlatGraph = function() {
  this.flatGraph = this.getFlatGraph();
};

// return Array of self & all child graph items
Anchor.prototype.getFlatGraph = function() {
  var flatGraph = [ this ];
  this.children.forEach( function( child ) {
    var childFlatGraph = child.getFlatGraph();
    flatGraph = flatGraph.concat( childFlatGraph );
  });
  return flatGraph;
};

Anchor.prototype.updateSortValue = function() {
  this.sortValue = this.renderOrigin.z;
};

// ----- render ----- //

Anchor.prototype.render = function() {};

Anchor.prototype.renderGraph = function( ctx ) {
  if ( !ctx ) {
    throw new Error( 'ctx is ' + ctx + '. ' +
      'Canvas context required for render. Check .renderGraph( ctx ).' );
  }
  this.checkFlatGraph();
  this.flatGraph.forEach( function( item ) {
    item.render( ctx );
  });
};

// ----- misc ----- //

Anchor.prototype.copy = function( options ) {
  // copy options
  var itemOptions = {};
  var optionKeys = this.constructor.optionKeys;
  optionKeys.forEach( function( key ) {
    itemOptions[ key ] = this[ key ];
  }, this );
  // add set options
  this.setOptions( itemOptions, options );
  var ItemClass = this.constructor;
  return new ItemClass( itemOptions );
};

Anchor.prototype.copyGraph = function( options ) {
  var clone = this.copy( options );
  this.children.forEach( function( child ) {
    child.copyGraph({
      addTo: clone,
    });
  });
  return clone;
};

Anchor.prototype.normalizeRotate = function() {
  this.rotate.x = modulo( this.rotate.x, TAU );
  this.rotate.y = modulo( this.rotate.y, TAU );
  this.rotate.z = modulo( this.rotate.z, TAU );
};

// ----- subclass ----- //

function getSubclass( Super ) {
  return function( defaults ) {
    // create constructor
    function Item( options ) {
      this.create( options );
    }

    Item.prototype = Object.create( Super.prototype );
    Item.prototype.constructor = Item;

    Item.defaults = extend( {}, Super.defaults );
    extend( Item.defaults, defaults );
    // create optionKeys
    Item.optionKeys = Super.optionKeys.slice(0);
    // add defaults keys to optionKeys, dedupe
    Object.keys( Item.defaults ).forEach( function( key ) {
      if ( !Item.optionKeys.includes( key ) ) {
        Item.optionKeys.push( key );
      }
    });

    Item.subclass = getSubclass( Item );

    return Item;
  };
}

Anchor.subclass = getSubclass( Anchor );

// -------------------------- PathAction -------------------------- //

function PathAction( method, points, previousPoint ) {
  this.method = method;
  this.points = points.map( mapVectorPoint );
  this.renderPoints = points.map( mapVectorPoint );
  this.previousPoint = previousPoint;
  this.endRenderPoint = this.renderPoints[ this.renderPoints.length - 1 ];
  // arc actions come with previous point & corner point
  // but require bezier control points
  if ( method == 'arc' ) {
    this.controlPoints = [ new Vector3(), new Vector3() ];
  }
}

function mapVectorPoint( point ) {
  return new Vector3( point );
}

PathAction.prototype.reset = function() {
  // reset renderPoints back to orignal points position
  var points = this.points;
  this.renderPoints.forEach( function( renderPoint, i ) {
    var point = points[i];
    renderPoint.set( point );
  });
};

PathAction.prototype.transform = function( translation, rotation, scale ) {
  this.renderPoints.forEach( function( renderPoint ) {
    renderPoint.transform( translation, rotation, scale );
  });
};

PathAction.prototype.render = function( ctx ) {
  this[ this.method ]( ctx );
};

PathAction.prototype.move = function( ctx ) {
  var point = this.renderPoints[0];
  ctx.moveTo( point.x, point.y );
};

PathAction.prototype.line = function( ctx ) {
  var point = this.renderPoints[0];
  ctx.lineTo( point.x, point.y );
};

PathAction.prototype.bezier = function( ctx ) {
  var cp0 = this.renderPoints[0];
  var cp1 = this.renderPoints[1];
  var end = this.renderPoints[2];
  ctx.bezierCurveTo( cp0.x, cp0.y, cp1.x, cp1.y, end.x, end.y );
};

PathAction.prototype.arc = function( ctx ) {
  var prev = this.previousPoint;
  var corner = this.renderPoints[0];
  var end = this.renderPoints[1];
  var cp0 = this.controlPoints[0];
  var cp1 = this.controlPoints[1];
  cp0.set( prev ).lerp( corner, 9/16 );
  cp1.set( end ).lerp( corner, 9/16 );
  ctx.bezierCurveTo( cp0.x, cp0.y, cp1.x, cp1.y, end.x, end.y );
};

/* globals Shape: true */

// -------------------------- Shape -------------------------- //

var Shape = Anchor.subclass({
  stroke: true,
  fill: false,
  color: '#333',
  lineWidth: 1,
  closed: true,
  rendering: true,
  path: [ {} ],
  front: { z: 1 },
  backfaceVisible: true,
});

Shape.prototype.create = function( options ) {
  Anchor.prototype.create.call( this, options );
  this.updatePath(); // hook for Rect, Ellipse, & other subclasses
  this.updatePathActions();

  // front
  this.front = new Vector3( options.front || this.front );
  this.renderFront = new Vector3( this.front );
  this.renderNormal = new Vector3();
};

var actionNames = [
  'move',
  'line',
  'bezier',
  'arc',
];

// place holder for Ellipse, Rect, etc.
Shape.prototype.updatePath = function() {};

// parse path into PathActions
Shape.prototype.updatePathActions = function() {
  var previousPoint;
  this.pathActions = this.path.map( function( pathPart, i ) {
    // pathPart can be just vector coordinates -> { x, y, z }
    // or path instruction -> { arc: [ {x0,y0,z0}, {x1,y1,z1} ] }
    var keys = Object.keys( pathPart );
    var method = keys[0];
    var points = pathPart[ method ];
    // default to line if no instruction
    var isInstruction = keys.length == 1 && actionNames.includes( method );
    if ( !isInstruction ) {
      method = 'line';
      points = pathPart;
    }
    // munge single-point methods like line & move without arrays
    var isLineOrMove = method == 'line' || method == 'move';
    var isPointsArray = Array.isArray( points );
    if ( isLineOrMove && !isPointsArray ) {
      points = [ points ];
    }

    // first action is always move
    method = i === 0 ? 'move' : method;
    // arcs require previous last point
    var pathAction = new PathAction( method, points, previousPoint );
    // update previousLastPoint
    previousPoint = pathAction.endRenderPoint;
    return pathAction;
  });
};

// ----- update ----- //

Shape.prototype.reset = function() {
  this.renderOrigin.set( this.origin );
  this.renderFront.set( this.front );
  // reset pathAction render points
  this.pathActions.forEach( function( pathAction ) {
    pathAction.reset();
  });
};

Shape.prototype.transform = function( translation, rotation, scale ) {
  // calculate render points backface visibility & cone/hemisphere shapes
  this.renderOrigin.transform( translation, rotation, scale );
  this.renderFront.transform( translation, rotation, scale );
  this.renderNormal.set( this.renderOrigin ).subtract( this.renderFront );
  // transform points
  this.pathActions.forEach( function( pathAction ) {
    pathAction.transform( translation, rotation, scale );
  });
  // transform children
  this.children.forEach( function( child ) {
    child.transform( translation, rotation, scale );
  });
};


Shape.prototype.updateSortValue = function() {
  var sortValueTotal = 0;
  this.pathActions.forEach( function( pathAction ) {
    sortValueTotal += pathAction.endRenderPoint.z;
  });
  // average sort value of all points
  // def not geometrically correct, but works for me
  this.sortValue = sortValueTotal / this.pathActions.length;
};

// ----- render ----- //

Shape.prototype.render = function( ctx ) {
  var length = this.pathActions.length;
  if ( !this.rendering || !length ) {
    return;
  }
  // do not render if hiding backface
  var isFacingBack = this.renderNormal.z > 0;
  if ( !this.backfaceVisible && isFacingBack ) {
    return;
  }
  // render dot or path
  var isDot = length == 1;
  if ( isDot ) {
    this.renderDot( ctx );
  } else {
    this.renderPath( ctx );
  }
};

// Safari does not render lines with no size, have to render circle instead
Shape.prototype.renderDot = function( ctx ) {
  ctx.fillStyle = this.color;
  var point = this.pathActions[0].endRenderPoint;
  ctx.beginPath();
  var radius = this.lineWidth/2;
  ctx.arc( point.x, point.y, radius, 0, TAU );
  ctx.fill();
};

Shape.prototype.renderPath = function( ctx ) {
  // set render properties
  ctx.fillStyle = this.color;
  ctx.strokeStyle = this.color;
  ctx.lineWidth = this.lineWidth;

  // render points
  ctx.beginPath();
  this.pathActions.forEach( function( pathAction ) {
    pathAction.render( ctx );
  });
  var isTwoPoints = this.pathActions.length == 2 &&
    this.pathActions[1].method == 'line';
  if ( !isTwoPoints && this.closed ) {
    ctx.closePath();
  }
  if ( this.stroke ) {
    ctx.stroke();
  }
  if ( this.fill ) {
    ctx.fill();
  }
};

/* globals Rect: true */

// -------------------------- Rect -------------------------- //

var Rect = Shape.subclass({
  width: 1,
  height: 1,
});

Rect.prototype.updatePath = function() {
  var x = this.width / 2;
  var y = this.height / 2;
  this.path = [
    { x: -x, y: -y },
    { x:  x, y: -y },
    { x:  x, y:  y },
    { x: -x, y:  y },
  ];
};

// -------------------------- Dragger -------------------------- //

// quick & dirty drag event stuff
// messes up if multiple pointers/touches

// event support, default to mouse events
var downEvent = 'mousedown';
var moveEvent = 'mousemove';
var upEvent = 'mouseup';
if ( window.PointerEvent ) {
  // PointerEvent, Chrome
  downEvent = 'pointerdown';
  moveEvent = 'pointermove';
  upEvent = 'pointerup';
} else if ( 'ontouchstart' in window ) {
  // Touch Events, iOS Safari
  downEvent = 'touchstart';
  moveEvent = 'touchmove';
  upEvent = 'touchend';
}

function noop() {}

function Dragger( options ) {
  this.startElement = options.startElement;
  this.onPointerDown = options.onPointerDown || noop;
  this.onPointerMove = options.onPointerMove || noop;
  this.onPointerUp = options.onPointerUp || noop;
  
  this.startElement.addEventListener( downEvent, this );
}

Dragger.prototype.handleEvent = function( event ) {
  var method = this[ 'on' + event.type ];
  if ( method ) {
    method.call( this, event );
  }
};

Dragger.prototype.onmousedown =
Dragger.prototype.onpointerdown = function( event ) {
  this.pointerDown( event, event );
};

Dragger.prototype.ontouchstart = function( event ) {
  this.pointerDown( event, event.changedTouches[0] );
};

Dragger.prototype.pointerDown = function( event, pointer ) {
  event.preventDefault();
  this.dragStartX = pointer.pageX;
  this.dragStartY = pointer.pageY;
  window.addEventListener( moveEvent, this );
  window.addEventListener( upEvent, this );
  this.onPointerDown( pointer );
};

Dragger.prototype.ontouchmove = function( event ) {
  // HACK, moved touch may not be first
  this.pointerMove( event, event.changedTouches[0] );
};

Dragger.prototype.onmousemove =
Dragger.prototype.onpointermove = function( event ) {
  this.pointerMove( event, event );
};

Dragger.prototype.pointerMove = function( event, pointer ) {
  event.preventDefault();
  var moveX = this.dragStartX - pointer.pageX;
  var moveY = this.dragStartY - pointer.pageY;
  this.onPointerMove( pointer, moveX, moveY );
};

Dragger.prototype.onmouseup = 
Dragger.prototype.onpointerup =
Dragger.prototype.ontouchend =
Dragger.prototype.pointerUp = function( event ) {
  window.removeEventListener( moveEvent, this );
  window.removeEventListener( upEvent, this );
  this.onPointerUp( event );
};

// -------------------------- Illo -------------------------- //

function Illo( options ) {
  // set defaults & options
  extend( this, Illo.defaults );
  extend( this, options );

  this.setCanvas( this.canvas );
}

Illo.defaults = {
  centered: true,
  prerender: function() {},
};

Illo.prototype.setCanvas = function( canvas ) {
  if ( typeof canvas == 'string' ) {
    // with string, query selector
    this.canvas = document.querySelector( canvas );
  } else {
    this.canvas = canvas;
  }

  // update related properties
  this.ctx = this.canvas.getContext('2d');

  this.ctx.lineCap = 'round';
  this.ctx.lineJoin = 'round';

  var pixelRatio = this.pixelRatio = window.devicePixelRatio || 1;
  // sizes
  this.width = this.canvas.width * pixelRatio;
  this.height = this.canvas.height * pixelRatio;
  // up-rez for hi-DPI devices
  if ( pixelRatio > 1 ) {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    canvas.style.width = this.width / pixelRatio + 'px';
    canvas.style.height = this.height / pixelRatio + 'px';
  }
};

Illo.prototype.render = function( item ) {
  var ctx = this.ctx;
  ctx.clearRect( 0, 0, this.width, this.height );
  ctx.save();
  if ( this.centered ) {
    ctx.translate( this.width/2, this.height/2 );
  }
  ctx.scale( this.pixelRatio, this.pixelRatio );

  this.prerender( ctx );
  item.renderGraph( ctx );

  ctx.restore();
};

// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var proxyCanvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var w = 14 * Math.sqrt(2);
var h = 14 * Math.sqrt(2);
var minWindowSize = Math.min( window.innerWidth - 20, window.innerHeight - 20 );
var zoom = Math.floor( minWindowSize / w );

var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
var shrink = 1/3;
proxyCanvas.width = canvasWidth * shrink;
proxyCanvas.height = canvasHeight * shrink;


var illo = new Illo({
  canvas: proxyCanvas,
  prerender: function( ctx ) {
    ctx.scale( zoom, zoom );
  },
});


var isRotating = false;

var navy = '#456';
var green = '#296';
var egg = '#FED';
var red = '#D21';
var ochre = '#F90';
var yellow = '#EC0';

document.body.style.backgroundColor = '#EDC';

var scene = new Anchor({
  rotate: { x: -35/360 * TAU, y: 45/360 * TAU },
});

// -- illustration shapes --- //

function makePrism( options ) {
  var prism = new Anchor({
    addTo: scene,
    rotate: options.rotate,
  });

  var rotor = new Anchor({
    addTo: prism,
  });

  var positioner = new Anchor({
    addTo: rotor,
    translate: { z: 1, y: -1 },
  });

  var triangle = new Shape({
    addTo: positioner,
    path: [
      { z:  1, y:  1 },
      { z: -1, y: -1 },
      { z: -1, y:  1 },
    ],
    color: red,
    fill: true,
    lineWidth: 1/zoom,
  });
  triangle.copy({
    translate: { x: -2 },
    color: navy,
  });

  // slope
  new Shape({
    addTo: positioner,
    path: [
      { x: -2, y: 1, z: 1 },
      { x: -2, y: -1, z: -1 },
      { x:  0, y: -1, z: -1 },
      { x:  0, y:  1, z:  1 },
    ],
    color: ochre,
    fill: true,
    lineWidth: 1/zoom,
  });

  var base = new Rect({
    addTo: positioner,
    width: 2,
    height: 2,
    translate: { x: -1, z: -1 },
    rotate: { y: TAU/2 },
    color: navy,
    fill: true,
    lineWidth: 1/zoom,
    backfaceVisible: false,
  });
  base.copy({
    translate: { x: -1, y: 1 },
    rotate: { x: -TAU/4 },
    color: red,
  });

  return prism;
}

var prismA = makePrism({

});

var prismB = makePrism({
  rotate: { x: TAU/4, z: TAU/4 },
});

var prismC = makePrism({
  rotate: { y: -TAU/4, z: -TAU/4 },
});

// -- animate --- //

var t = 0;
var tSpeed = 1/80;

// -- update -- //

var transforms = {
  0: function( prism, easeT ) {
    prism.children[0].rotate.y = 0;
    prism.children[0].rotate.z = 0;
    prism.children[0].rotate.x = easeT;
  },
  1: function( prism, easeT ) {
    prism.children[0].rotate.y = -easeT;
  },
  2: function( prism, easeT ) {
    prism.children[0].rotate.y = -easeT - TAU/4;
  },
  3: function( prism, easeT ) {
    prism.children[0].rotate.z = -easeT;
  },
  4: function( prism, easeT ) {
    prism.children[0].rotate.z = -easeT - TAU/4;
  },
  5: function( prism, easeT ) {
    prism.children[0].rotate.x = easeT + TAU/4;
  },

};

function update() {
  var easeT = easeInOut( t, 4 ) * TAU/4;

  var turn = Math.floor( t % 6 );
  var transform = transforms[ turn ];

  transform( prismA, easeT );
  transform( prismB, easeT );
  transform( prismC, easeT );

  t += tSpeed;

  scene.updateGraph();
}

// -- render -- //

var shiftX = Math.round( 3 * Math.sqrt(2) * zoom );
var shiftY = Math.round( 2 * Math.sqrt(2) * Math.sqrt(3)/2 * zoom );

function render() {
  illo.render( scene );

  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );

  ctx.save();
  ctx.translate( Math.round( w * shrink * zoom ), Math.round( h * shrink * zoom ) );

  for ( var col = -2; col < 3; col++ ) {
    for ( var row = -2; row < 3; row++ ) {
      var x = col * shiftX;
      var y = ( row * 2 + col % 2 ) * shiftY;
      ctx.drawImage( illo.canvas, x, y );
    }
  }

  ctx.restore();
}

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// ----- inputs ----- //

// click drag to rotate
var dragStartAngleX, dragStartAngleY;

new Dragger({
  startElement: canvas,
  onPointerDown: function() {
    isRotating = false;
    dragStartAngleX = scene.rotate.x;
    dragStartAngleY = scene.rotate.y;
  },
  onPointerMove: function( pointer, moveX, moveY ) {
    var angleXMove = moveY / canvasWidth * TAU;
    var angleYMove = moveX / canvasWidth * TAU;
    scene.rotate.x = dragStartAngleX + angleXMove;
    scene.rotate.y = dragStartAngleY + angleYMove;
  },
});