var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var colors = ['#f44336', '#fdd835', '#1e88e5']; //["#FA2E59", "#FF703F", "#F7BC05", "#76BCAD"];
var cw = canvas.width = window.innerWidth,
cx = cw / 2;
var ch = canvas.height = window.innerHeight,
cy = ch / 2;
ctx.lineCap = "round";
var rad = Math.PI / 180;
var frames = 0;
//let N = 10;
var waves = [];var

Particle = function () {
  function Particle(x, N) {_classCallCheck(this, Particle);
    this.pos = {
      x: x + (Math.random() * cw / (N * 2) - cx / (N * 2)),
      y: -100 };

    this.vel = {
      x: 0,
      y: 0 };

    this.timeIncrement = this.pos.x * 10;
    this.in = true;
  }_createClass(Particle, [{ key: "update", value: function update(

    moment, frames) {
      //53, 59, 61, 67
      var t = moment + this.timeIncrement;
      this.vel.y = 1 + Math.cos(t / 23 + Math.cos(t / 29 + frames * rad));
      this.pos.y += this.vel.y;
    } }, { key: "draw", value: function draw()
    {
      ctx.beginPath();
      ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
    } }]);return Particle;}();var


Wave = function () {
  function Wave(color) {_classCallCheck(this, Wave);
    this.color = color;
    this.N = 10;
    this.particles = [];
    this.memory = 0;
    this.create();
    this._setLineDash();
  }_createClass(Wave, [{ key: "create", value: function create()

    {
      var first = new Particle(-100, this.N);
      first.pos.y = -1000;
      this.particles.push(first);
      var second = new Particle(-100, this.N);
      this.particles.push(second);
      for (var i = 0; i < this.N; i++) {
        var _x = i * cw / this.N;
        this.particles.push(new Particle(_x, this.N));
      }
      this.particles.push(new Particle(cw + 100, this.N));
      var last = new Particle(cw + 100, this.N);
      last.pos.y = -1000;
      this.particles.push(last);
    } }, { key: "_setLineDash", value: function _setLineDash()

    {
      this.dashArray = [];
      for (var i = 1; i < this.particles.length - 3; i++) {
        var d = dist(this.particles[i].pos, this.particles[i + 1].pos);
        this.dashArray.push(d / 3);
        this.dashArray.push(2 * d / 3);
      }
    } }, { key: "connect", value: function connect()

    {
      this._setLineDash();
      var points = this.particles;
      ctx.beginPath();
      ctx.moveTo(points[0].pos.x, points[0].pos.y);
      for (var i = 1; i < points.length - 2; i++) {
        var cp = {};
        cp.x = (points[i].pos.x + points[i + 1].pos.x) / 2;
        cp.y = (points[i].pos.y + points[i + 1].pos.y) / 2;
        ctx.quadraticCurveTo(points[i].pos.x, points[i].pos.y, cp.x, cp.y);
      }
      ctx.quadraticCurveTo(
      points[i].pos.x,
      points[i].pos.y,
      points[i + 1].pos.x,
      points[i + 1].pos.y);

      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.strokeStyle = this.color;
      ctx.setLineDash([]);
      ctx.lineWidth = 30;
      ctx.stroke();
      ctx.lineWidth = 20;
      ctx.setLineDash(this.dashArray);
      ctx.strokeStyle = "rgba(255,255,255,.4)";
      ctx.stroke();
    } }, { key: "draw", value: function draw(

    moment, frames) {var _this = this;
      this.particles.map(function (p) {
        if (p.pos.y > ch && p.in) {
          p.in = false;
          _this.memory++;
        }
      });
      this.particles.map(function (p) {
        p.update(moment, frames);
        //p.draw();
      });
      this.connect();
    } }]);return Wave;}();


waves.push(new Wave(colors[0]));
var cnt = 0;

function Frame() {
  requestId = window.requestAnimationFrame(Frame);
  ctx.clearRect(0, 0, cw, ch);
  var moment = new Date().getTime() / 30;
  frames++;
  if (frames % 200 == 0) {
    cnt++;
    waves.push(new Wave(colors[cnt % colors.length]));
  }
  //increment: allways a positive number
  var timevariable =
  1 + Math.cos(moment / 23 + Math.cos(moment / 29 + frames * rad));

  waves.map(function (w, i) {
    if (w.memory == w.N + 4 && frames % 200) {
      var color = w.color;
      waves.splice(i, 1);
    }
    w.draw(moment, frames);
  });
}
Frame();

function dist(p1, p2) {
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}