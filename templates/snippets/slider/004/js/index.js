var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var SVG_NS = "http://www.w3.org/2000/svg";
var SVG_XLINK = "http://www.w3.org/1999/xlink";
var svgH = 20;
var svg = document.querySelector("svg");
var rid = null;
deformation = 0;
var dragging = false;
var m = { x: 37, y: svgH / 2 };var

Slider = function () {
  function Slider(svg) {var _this = this;_classCallCheck(this, Slider);
    this.deformation = 10;
    this.target = 5;
    this.value = 0;
    this.dragging = false;
    this.svg = svg;
    this.path = svg.querySelector("path");
    this.thumb = _2.querySelector("circle");
    this.label = label; ////
    this.text = _2.querySelector("#_2 text textPath");
    this.inputElement = witness; ////
    this.svg.addEventListener("mousedown", function (e) {
      _this.dragging = true;
      m = oMousePosSVG(e);
      console.clear();
      console.log(Math.round(m.x * 100) / 100);
      _this.target = 5;
      Frame();
    });

    this.svg.addEventListener("mouseup", function () {
      _this.dragging = false;
      _this.target = 0;
      Frame();
      //this.updatePath(m,deformation);
    });

    this.svg.addEventListener("mouseout", function () {
      _this.dragging = false;
      _this.target = 0;
      Frame();
    });

    this.svg.addEventListener("mousemove", function (e) {
      if (_this.dragging) {
        m = oMousePosSVG(e);
        console.clear();
        console.log(Math.round(m.x * 100) / 100);
        _this.target = 5;
        Frame();
      }
    });
  }_createClass(Slider, [{ key: "updateValue", value: function updateValue()

    {
      var dist = this.target - this.value;
      var vel = dist / 10;
      this.value += vel;
      //improvement
      if (Math.abs(dist) < 0.01) {
        if (rid) {
          window.cancelAnimationFrame(rid);
          rid = null;
        }
      }
    } }, { key: "updatePath", value: function updatePath(

    m) {
      this.d = curvedPath(m.x, svgH / 2, this.deformation, this.value);
      this.path.setAttributeNS(null, "d", this.d);

      this.thumb.setAttributeNS(null, "r", 0.1 + this.value / 3);
      this.thumb.setAttributeNS(null, "cx", m.x);

      this.updateLabel(m);
      this.updateInput(m);
    } }, { key: "updateLabel", value: function updateLabel(

    m) {
      this.label.setAttributeNS(
      null,
      "transform", "translate(" +
      m.x + "," + (svgH / 2 - this.value) + ") scale(.75)");

      this.text.textContent = Math.round(m.x);
    } }, { key: "updateInput", value: function updateInput(
    m) {
      this.inputElement.value = Math.round(m.x);
    } }]);return Slider;}();


function oMousePosSVG(e) {
  var p = svg.createSVGPoint();
  p.x = e.clientX;
  p.y = e.clientY;
  var ctm = svg.getScreenCTM().inverse();
  var p = p.matrixTransform(ctm);
  return p;
}

var slider = new Slider(svg);

function Frame() {
  rid = window.requestAnimationFrame(Frame);
  slider.updateValue();
  slider.updatePath(m);
}

// HELPERS

function curvedPath(X, Y, defX, defY) {
  //let def = 5;//deformation
  //let Y = 20;
  //let X = mouse position
  var D = { cx: X, cy: Y - defY, r: 1 };
  var B = { cx: D.cx - defX, cy: Y, r: 1 };
  var F = { cx: D.cx + defX, cy: Y, r: 1 };
  var A = { cx: D.cx - 2 * defX, cy: Y, r: 1 };
  var G = { cx: D.cx + 2 * defX, cy: Y, r: 1 };

  var C = interpolatePoint(B, D, 1, 2);
  C.r = 1;
  var E = interpolatePoint(D, F, 1, 2);
  E.r = 1;

  return "M0," + Y + " L" + A.cx + "," + A.cy + "\n              Q" +
  B.cx + "," + B.cy + " " + C.cx + "," + C.cy + "\n              Q" +
  D.cx + "," + D.cy + " " + E.cx + "," + E.cy + "\n              Q" +
  F.cx + "," + F.cy + " " + G.cx + "," + G.cy + "\n              L100," +
  A.cy + "\n";

}

function interpolatePoint(a, b, i, n) {
  //point a
  //point b
  //line divided in n segments
  //find the i-th point
  var o = {
    cx: a.cx + (b.cx - a.cx) * (i / n),
    cy: a.cy + (b.cy - a.cy) * (i / n) };

  return o;
}