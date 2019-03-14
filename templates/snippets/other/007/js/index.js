var SVG_NS = 'http://www.w3.org/2000/svg';
var XLink_NS = 'http://www.w3.org/1999/xlink';
var svg = document.querySelector("svg");
var contenedor = document.querySelector("#contenedor");
var elId, circ;
m = { // mouse position
  x: 0,
  y: 0
};
var dragging = false;

var ry = [];
ry[0] = {
  x: 100,
  y: 50
};

ry[1] = {
  x: 175,
  y: 120
};

ry[2] = {
  x: 200,
  y: 200
};

ry[3] = {
  x: 260,
  y: 270
};

ry[4] = {
  x: 250,
  y: 380
};

ry[5] = {
  x: 100,
  y: 430
};

function getPoints(ry) {
  var points = "0,0 ";
  for (var i = 0; i < ry.length; i++) {
    points += ry[i].x + "," + ry[i].y + " ";
  }
  points += "0,500"
  return points;
}

function drawPolygon(ry, polygon) {
  var points = getPoints(ry);
  polygon.setAttributeNS(null, 'points', points);
}

var polygon = document.createElementNS(SVG_NS, 'polygon');
drawPolygon(ry, polygon);
svg.appendChild(polygon);

for (var i = 0; i < ry.length; i++) {
  var circ = document.createElementNS(SVG_NS, 'circle');
  circ.setAttributeNS(null, 'cx', ry[i].x);
  circ.setAttributeNS(null, 'cy', ry[i].y);
  circ.setAttributeNS(null, 'r', "15");
  circ.setAttributeNS(null, 'id', "circ" + i);
  svg.appendChild(circ);
}

var c = document.querySelectorAll("svg circle");

svg.addEventListener("mousedown", function(evt) {
  if (evt.target.id.search("circ") == 0) {
    dragging = true;
    elId = evt.target.id.replace("circ", "");
    circ = c[elId];
  }
}, false);

svg.addEventListener("mousemove", function(evt) {
  if (dragging) {
    m = oMousePos(svg, evt);

    circ.setAttributeNS(null, 'cx', m.x);
    circ.setAttributeNS(null, 'cy', m.y);

    ry[elId].x = m.x;
    ry[elId].y = m.y;

    drawPolygon(ry, polygon);
    shapeOutsidePolygon(ry);

  }
}, false);

svg.addEventListener("mouseup", function(evt) {
  dragging = false;
}, false);

/*svg.addEventListener("mouseout", function(evt) {
  dragging = false;
}, false);*/

function oMousePos(el, evt) {
  var ClientRect = el.getBoundingClientRect();
  return { //objeto
    x: Math.round(evt.clientX - ClientRect.left),
    y: Math.round(evt.clientY - ClientRect.top)
  }
}


function shapeOutsidePolygon(ry){
  var shape_outside = "polygon(";
  for(var i = 0; i < ry.length; i++){
    shape_outside += ry[i].x + "px "+ry[i].y+"px,";

  }
  shape_outside += "0 500px)";
  console.clear();
  console.log(shape_outside)
  document.querySelector("#shape").style.webkitShapeOutside = shape_outside;
  document.querySelector("#shape").style.shapeOutside = shape_outside;
}

shapeOutsidePolygon(ry)