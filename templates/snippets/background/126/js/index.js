// Hi! This 3D model was built using the <canvas> 2D drawing API.
// It uses lineWidth to give the illusion of form.
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
    var isInstruction = keys.length === 1 && actionNames.includes( method ) &&
      Array.isArray( points );

    if ( !isInstruction ) {
      method = 'line';
      points = [ pathPart ];
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


/* globals Ellipse: true */

// -------------------------- Ellipse -------------------------- //

var Ellipse = Shape.subclass({
  width: 1,
  height: 1,
  closed: false,
});

Ellipse.prototype.updatePath = function() {
  var x = this.width / 2;
  var y = this.height / 2;
  this.path = [
    { x: 0, y: -y },
    { arc: [ // top right
      { x: x, y: -y },
      { x: x, y: 0 },
    ]},
    { arc: [ // bottom right
      { x: x, y: y },
      { x: 0, y: y },
    ]},
    { arc: [ // bottom left
      { x: -x, y: y },
      { x: -x, y: 0 },
    ]},
    { arc: [ // bottom left
      { x: -x, y: -y },
      { x: 0, y: -y },
    ]},
  ];
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

/* globals Group: true */

// -------------------------- Group -------------------------- //

var Group = Anchor.subclass({
  updateSort: false,
  rendering: true,
});

// ----- update ----- //

Group.prototype.updateSortValue = function() {
  var sortValueTotal = 0;
  this.checkFlatGraph();
  this.flatGraph.forEach( function( item ) {
    item.updateSortValue();
    sortValueTotal += item.sortValue;
  });
  // average sort value of all points
  // def not geometrically correct, but works for me
  this.sortValue = sortValueTotal / this.flatGraph.length;

  if ( this.updateSort ) {
    this.flatGraph.sort( shapeSorter );
  }
};

// ----- render ----- //

Group.prototype.render = function( ctx ) {
  if ( !this.rendering ) {
    return;
  }

  this.checkFlatGraph();
  this.flatGraph.forEach( function( item ) {
    item.render( ctx );
  });
};

// do not include children, group handles rendering & sorting internally
Group.prototype.getFlatGraph = function() {
  return [ this ];
};


Group.prototype.checkFlatGraph = function() {
  if ( !this.flatGraph ) {
    this.updateFlatGraph();
  }
};

Group.prototype.updateFlatGraph = function() {
  this.flatGraph = this.getChildFlatGraph();
};

// get flat graph only used for group
// do not include in parent flatGraphs
Group.prototype.getChildFlatGraph = function() {
  // do not include self
  var flatGraph = [];
  this.children.forEach( function( child ) {
    var childFlatGraph = child.getFlatGraph();
    flatGraph = flatGraph.concat( childFlatGraph );
  });
  return flatGraph;
};

/* globals Cylinder: true */

// -------------------------- Cylinder -------------------------- //

var Cylinder = Group.subclass({
  radius: 0.5,
  length: 1,
  color: '#333',
  baseColor: undefined,
  fill: true,
  stroke: true,
  lineWidth: 1,
  updateSort: true,
});

Cylinder.prototype.create = function(/* options */) {
  // call super
  Group.prototype.create.apply( this, arguments );
  // composite shape, create child shapes
  var baseZ = this.length/2;
  var base, frontBase, backBase;
  // front outside base
  base = frontBase = new Ellipse({
    width: this.radius * 2,
    height: this.radius * 2,
    addTo: this,
    translate: { z: baseZ },
    rotate: { y: TAU/2 },
    color: this.color,
    lineWidth: this.lineWidth,
    stroke: this.stroke,
    fill: this.fill,
    backfaceVisible: this.baseColor ? false : true,
  });
  // back outside base
  backBase = base.copy({
    translate: { z: -baseZ },
    rotate: { y: 0 },
  });

  if ( this.baseColor ) {
    // front inside base
    base.copy({
      rotate: { y: 0 },
      color: this.baseColor
    });
    // back inside base
    base.copy({
      translate: { z: -baseZ },
      rotate: { y: TAU/2 },
      color: this.baseColor
    });
  }

  // used for rendering ring
  this.frontOrigin = frontBase.renderOrigin;
  this.backOrigin = backBase.renderOrigin;
  this.renderNormal = frontBase.renderNormal;
};

Cylinder.prototype.render = function( ctx ) {
  if ( !this.rendering ) {
    return;
  }
  this.renderRing( ctx );
  Group.prototype.render.call( this, ctx );
};

Cylinder.prototype.renderRing = function( ctx ) {
  ctx.strokeStyle = this.color;
  // apply scale
  ctx.lineWidth = this.radius * 2 * this.renderNormal.magnitude();
  ctx.lineCap = 'butt'; // nice

  ctx.beginPath();
  ctx.moveTo( this.frontOrigin.x, this.frontOrigin.y );
  ctx.lineTo( this.backOrigin.x, this.backOrigin.y );
  ctx.stroke();

  ctx.lineCap = 'round'; // reset
};

/* globals Cone: true */

// -------------------------- Cone -------------------------- //

var Cone = Group.subclass({
  radius: 0.5,
  height: 1,
  color: '#333',
  baseColor: undefined,
  fill: true,
  stroke: true,
  lineWidth: 1,
  updateSort: true,
});

Cone.prototype.create = function(/* options */) {
  // call super
  Group.prototype.create.apply( this, arguments );
  // composite shape, create child shapes
  this.apex = new Shape({
    rendering: false,
    translate: { z: this.height },
    addTo: this,
  });
  // outside base
  var base = new Ellipse({
    width: this.radius * 2,
    height: this.radius * 2,
    addTo: this,
    color: this.color,
    lineWidth: this.lineWidth,
    stroke: this.stroke,
    fill: this.fill,
    backfaceVisible: this.baseColor ? false : true,
  });
  // inside base
  if ( this.baseColor ) {
    base.copy({
      color: this.baseColor,
      rotate: { y: TAU/2 },
    });
  }

  // used for calculating contour angle
  this.renderNormal = base.renderNormal;
  // vectors used for calculation
  this.renderApex = new Vector3();
  this.tangentA = new Vector3();
  this.tangentB = new Vector3();
};

Cone.prototype.render = function( ctx ) {
  if ( !this.rendering ) {
    return;
  }
  this.renderCone( ctx );
  Group.prototype.render.call( this, ctx );
};

Cone.prototype.renderCone = function( ctx ) {
  this.renderApex.set( this.apex.renderOrigin )
    .subtract( this.renderOrigin );
  var scale = this.renderNormal.magnitude();
  var apexDistance = getDistance1( this.renderApex.x, this.renderApex.y );
  var normalDistance = getDistance1( this.renderNormal.x, this.renderNormal.y );
  // eccentricity
  var eccenAngle = Math.acos( normalDistance / scale );
  var eccen = Math.sin( eccenAngle );
  var radius = this.radius * scale;
  // does apex extend beyond eclipse of face
  var isApexVisible = radius * eccen < apexDistance;
  if ( !isApexVisible ) {
    return;
  }

  var apexAngle = Math.atan2( this.renderNormal.y, this.renderNormal.x ) + TAU/2;
  var projectLength = apexDistance / eccen;
  var projectAngle = Math.acos( radius / projectLength );
  // set tangent points
  var tangentA = this.tangentA;
  var tangentB = this.tangentB;

  tangentA.x = Math.cos( projectAngle ) * radius * eccen;
  tangentA.y = Math.sin( projectAngle ) * radius;

  tangentB.set( this.tangentA );
  tangentB.y *= -1;

  tangentA.rotateZ( apexAngle );
  tangentB.rotateZ( apexAngle );
  tangentA.add( this.renderOrigin );
  tangentB.add( this.renderOrigin );

  ctx.strokeStyle = ctx.fillStyle = this.color;
  ctx.lineWidth = this.lineWidth;
  ctx.beginPath();
  ctx.moveTo( tangentA.x, tangentA.y );
  ctx.lineTo( this.apex.renderOrigin.x, this.apex.renderOrigin.y );
  ctx.lineTo( tangentB.x, tangentB.y );

  if ( this.stroke ) {
    ctx.stroke();
  }
  if ( this.fill ) {
    ctx.fill();
  }
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

// ------------------- Shifter --------------- //

var navy = '#369';
// var red = '#E21';
var green = '#692';
var egg = '#FED';
var ochre = '#E83';

[ Shape, Rect, Ellipse, Cylinder, Cone ].forEach( function( ItemClass ) {
  ItemClass.defaults.fill = true;
  ItemClass.defaults.stroke = false;
});


// triangle
var isoTriangle = new Shape({
  path: [
    { x: 1, y: 1 },
    { x: -1, y: 1  },
    { x: 0, y: -1 },
  ],
  color: egg,
});

function Shifter( options ) {

  var shifterAnchor = this.anchor = new Anchor( options );

  this.pyramid = ( function() {
    var pyramid = new Group({
      addTo: shifterAnchor,
      rendering: false,
      // translate: { x: -3, y: -3 },
      updateSort: true,
    });

    var base = new Rect({
      addTo: pyramid,
      width: 2,
      height: 2,
      translate: { y: 1 },
      rotate: { x: -TAU/4 },
      color: navy,
    });


    var triangle = new Shape({
      addTo: base,
      path: [
        { x: 1, y: -1, z: 0 },
        { x: -1, y: -1, z: 0  },
        { x: 0, y: 0, z: -2 },
      ],
      color: ochre,
    });
    triangle.copy({
      rotate: { z: TAU/4 },
    });
    triangle.copy({
      rotate: { z: TAU/2 },
    });
    triangle.copy({
      rotate: { z: TAU * 3/4 },
    });

    return pyramid;
  })();

  // cylinder 1
  this.cylinder1 = new Cylinder({
    addTo: shifterAnchor,
    rendering: false,
    radius: 1,
    length: 2,
    // translate: { x: 0, y: -3 },
    rotate: { y: TAU/4 },
    color: navy,
    baseColor: egg,
  });

  // cone 1
  // isoTriangle.copy({
  //   translate: { x: 3, y: -3, z: -2 },
  //   color: green,
  // });

  this.cone = ( function() {
    var anchor = new Group({
      addTo: shifterAnchor,
      rendering: false,
      // translate: { x: 3, y: -3 },
      updateSort: true,
    });

    new Cone({
      addTo: anchor,
      radius: 1,
      height: 2,
      rotate: { x: TAU/4 },
      translate: { y: 1 },
      color: ochre,
      baseColor: egg,
    });

    return anchor;
  })();

  // triangular prism

  this.prism = ( function() {
    var prism = new Group({
      addTo: shifterAnchor,
      rendering: false,
      // translate: { x: -3, y: 0 },
      updateSort: true,
    });

    var triangle = isoTriangle.copy({
      addTo: prism,
      scale: { y: -1 },
      rotate: { y: TAU/4 },
      translate: { x: -1 },
      color: ochre,
    });
    triangle.copy({
      translate: { x: 1 },
    });

    var angleFace = new Shape({
      addTo: prism,
      path: [
        { x: -1, y: -1, z: 1 },
        { x:  1, y: -1, z: 1 },
        { x:  1, y:  1, z: 0 },
        { x: -1, y:  1, z: 0 },
      ],
      color: navy,
    });
    angleFace.copy({
      scale: { z: -1 },
    });

    // base
    new Rect({
      addTo: prism,
      width: 2,
      height: 2,
      rotate: { x: TAU/4 },
      translate: { y: -1 },
      color: green,
    });

    return prism;
  })();

  // eccentric cylinder, triangle contour

  this.triCylinder = ( function() {
    var cylinder = new Group({
      addTo: shifterAnchor,
      rendering: false,
      // translate: { x: 3 },
    });

    isoTriangle.copy({
      translate: {},
      addTo: cylinder,
      color: ochre,
    });

    var tilt = Math.atan(1/2);

    var capAnchor = new Anchor({
      addTo: cylinder,
      translate: { x: -0.5 },
      rotate: { y: TAU/4 },
    });


    // left outside cap
    var cap = new Ellipse({
      addTo: capAnchor,
      width: 2,
      height: 2,
      color: egg,
      rotate: { x: tilt },
      scale: { y: 1/Math.cos( tilt ) },
      backfaceVisible: false,
    });
    cap.copy({ // left inside cap
      rotate: { y: TAU/2, x: tilt },
      color: ochre,
    });

    capAnchor.copyGraph({
      translate: { x: 0.5 },
      rotate: { y: -TAU/4 },
    });

    return cylinder;
  })();

  this.cylinder2 = this.cylinder1.copy({
    translate: {},
    rendering: false,
    rotate: { x: TAU/4 },
  });

}

Shifter.prototype.update = function( t ) {

  var turn = Math.floor( t % 6 );

  var easeT = easeInOut( t ) * TAU/4;
  this.pyramid.rotate.x = easeT;
  this.cylinder1.rotate.y = easeT + TAU/4;
  this.cone.rotate.x = easeT + TAU/4;
  this.prism.rotate.y = easeT + TAU/4;
  this.cylinder2.rotate.x = easeT + TAU/4;
  this.triCylinder.rotate.y = easeT + TAU/4;

  if ( turn === 0 ) {
    this.triCylinder.rendering = false;
    this.pyramid.rendering = true;
  } else if ( turn == 1) {
    this.pyramid.rendering = false;
    this.cylinder1.rendering = true;
  } else if ( turn == 2 ) {
    this.cylinder1.rendering = false;
    this.cone.rendering = true;
  } else if ( turn == 3 ) {
    this.cone.rendering = false;
    this.prism.rendering = true;
  } else if ( turn == 4 ) {
    this.prism.rendering = false;
    this.cylinder2.rendering = true;
  } else if ( turn == 5 ) {
    this.cylinder2.rendering = false;
    this.triCylinder.rendering = true;
  }
};

function easeInOut( i ) {
  i = i % 1;
  var isFirstHalf = i < 0.5;
  var i1 = isFirstHalf ? i : 1 - i;
  i1 = i1 / 0.5;
  // make easing steeper with more multiples
  var i2 = i1 * i1 * i1 * i1;
  i2 = i2 / 2;
  return isFirstHalf ? i2 : i2*-1 + 1;
}

/* globals Shifter */

// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 10;
var h = 10;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight - 40 );
var zoom = Math.floor( minWindowSize / w );
var pixelRatio = window.devicePixelRatio || 1;
zoom *= pixelRatio;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// set canvas screen size
if ( pixelRatio > 1 ) {
  canvas.style.width = canvasWidth / pixelRatio + 'px';
  canvas.style.height = canvasHeight / pixelRatio + 'px';
}

var scene = new Anchor();

// -- illustration shapes --- //


var shifterA = new Shifter({
  addTo: scene,
  translate: { x: -3 },
});
var shifterB = new Shifter({
  addTo: scene,
});
var shifterC = new Shifter({
  addTo: scene,
  translate: { x: 3 },
});

// -- animate --- //

var t = 0;
var tSpeed = 1/80;

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

function update() {

  shifterA.update( t + 4 );
  shifterB.update( t + 2 );
  shifterC.update( t + 0 );

  t += tSpeed;

  scene.updateGraph();
}


// -- render -- //

ctx.lineCap = 'round';
ctx.lineJoin = 'round';

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );

  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( w/2, h/2 );

  scene.renderGraph( ctx );

  ctx.restore();
}

// ----- inputs ----- //

// click drag to rotate
var dragStartAngleX, dragStartAngleY;

new Dragger({
  startElement: canvas,
  onPointerDown: function() {
    // isRotating = false;
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