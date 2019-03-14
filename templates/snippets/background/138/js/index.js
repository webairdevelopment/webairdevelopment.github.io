var _class, _temp;var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var Points = function () {



  function Points() {_classCallCheck(this, Points);
    if (Points.instance) {
      return Points.instance;
    }

    Points.instance = this;
    this.points = [];

    for (var i = 0; i < Points.pointNum; i++) {
      this.points.push({
        y: 0,
        amplitude: Math.random() * (this.maxAmplitude - this.minAmplitude) + this.minAmplitude,
        speed: Math.random() * this.speedMultiplier + .5,
        offset: Math.random() * this.offsetMultiplier });

    }

    this.run = this.run.bind(this);
  }_createClass(Points, [{ key: 'getPoint', value: function getPoint(

    i) {
      return this.points[i];
    } }, { key: 'run', value: function run(

    delta) {
      if (this.running) {
        requestAnimationFrame(this.run);
      }

      var time = delta * .0005;
      this.points.forEach(function (point) {
        point.y = Math.sin(time * point.speed + point.offset) * point.amplitude;
      });
    } }, { key: 'length', get: function get()

    {
      return this.points.length;
    } }, { key: 'offsetMultiplier', set: function set(

    value) {
      if (value > 0) {
        this._offsetMultiplier = value;
      }
    }, get: function get()
    {
      return this._offsetMultiplier || 100;
    } }, { key: 'speedMultiplier', set: function set(

    value) {
      if (value > 0) {
        this._speedMultiplier = value;
      }
    }, get: function get()
    {
      return this._speedMultiplier || 1;
    } }, { key: 'minAmplitude', set: function set(

    value) {
      if (value > 0) {
        this._minAmplitude = value;
      }
    }, get: function get()
    {
      return this._minAmplitude || 20;
    } }, { key: 'maxAmplitude', set: function set(

    value) {
      if (value > 0) {
        this._maxAmplitude = value;
      }
    }, get: function get()
    {
      return this._maxAplitude || 100;
    } }, { key: 'running', set: function set(

    value) {
      if (!this._running && value === true) {
        requestAnimationFrame(this.run);
      }
      this._running = value === true;
    }, get: function get()
    {
      return this._running === true;
    } }]);return Points;}();Points.pointNum = 16;Points.instance = null;var


WaveFrame = function () {
  function WaveFrame(points, parentElement, minPoint, maxPoint) {var _this = this;_classCallCheck(this, WaveFrame);
    if (
    !(parentElement instanceof HTMLElement) ||
    !(minPoint >= 0) ||
    !(maxPoint >= 0) ||
    !(points instanceof Points))
    {
      return null;
    }

    this.points = points;

    this.minPoint = minPoint;
    this.maxPoint = maxPoint;

    this._parentElement = parentElement;
    this._canvas = document.createElement('canvas');
    this._canvas.width = this.width;
    this._canvas.height = this.height;
    this._ctx = this._canvas.getContext('2d');
    setTimeout(function () {

      _this._parentElement.appendChild(_this._canvas);
    }, 0);

    this.run = this.run.bind(this);
  }_createClass(WaveFrame, [{ key: 'update', value: function update()

    {var _this2 = this;
      if (this.updated === false) return;
      this.updated = false;
      this._parentElement.removeChild(this._canvas);
      // This logic breaks sometimes on rabid resizes, but I can't quite figure 
      // out why as yet.
      // Will probably need to investigate an alternative and more robust debounce
      // that more readily suits multiple items.
      setTimeout(function () {
        _this2._canvas.width = _this2.width;
        _this2._canvas.height = _this2.height;
        setTimeout(function () {
          _this2._parentElement.appendChild(_this2._canvas);
          _this2.updated = true;
        }, 0);
      }, 100);
    } }, { key: 'run', value: function run(

    delta) {
      if (this.running) {
        requestAnimationFrame(this.run);
      }

      this._ctx.clearRect(0, 0, this.width, this.height);

      var dist = this.pointDistance;
      this._ctx.beginPath();
      this._ctx.fillStyle = '#FFFFFF';

      this._ctx.moveTo(-dist, this.middle + this.points.getPoint(this.leftOffPoint).y);

      for (var i = 0; i <= this.pointsNum; i++) {
        var point = this.points.getPoint(this.minPoint + i);
        var nextPoint = this.points.getPoint(this.minPoint + i + 1);

        var p1 = this.middle + point.y;
        var p2 = this.middle + nextPoint.y;
        var xc = dist * i + dist * .5;
        var yc = (p1 + p2) * .5;
        this._ctx.quadraticCurveTo(dist * i, p1, xc, yc);

      }
      this._ctx.lineTo(this.width, this.height);
      this._ctx.lineTo(0, this.height);
      this._ctx.closePath();
      this._ctx.fill();
    } }, { key: 'middle', get: function get()

    {
      return this.height * .5;
    } }, { key: 'pointsNum', get: function get()

    {
      return this.maxPoint - this.minPoint;
    } }, { key: 'leftOffPoint', get: function get()

    {
      var point = this.minPoint - 1;
      if (point < 0) point = this.points.length - 1;
      return point;
    } }, { key: 'rightOffPoint', get: function get()

    {
      var point = this.minPoint + 1;
      if (point > this.points.length) point = 0;
      return point;
    } }, { key: 'pointDistance', get: function get()

    {
      return this.width / (this.pointsNum - 1);
    } }, { key: 'minPoint', set: function set(

    value) {
      if (value >= 0) {
        this._minPoint = value;
      }
    }, get: function get()
    {
      return this._minPoint;
    } }, { key: 'maxPoint', set: function set(

    value) {
      if (value >= 0) {
        this._maxPoint = value;
      }
    }, get: function get()
    {
      return this._maxPoint;
    } }, { key: 'width', get: function get()

    {
      return this._parentElement.offsetWidth;
    } }, { key: 'height', get: function get()
    {
      return this._parentElement.offsetHeight;
    } }, { key: 'running', set: function set(

    value) {
      if (!this._running && value === true) {
        requestAnimationFrame(this.run);
      }
      this._running = value === true;
    }, get: function get()
    {
      return this._running === true;
    } }]);return WaveFrame;}();


var containers = document.querySelectorAll('.container__section');
var points = new Points();
var waveFrames = [
new WaveFrame(points, containers[0], 1, 6),
new WaveFrame(points, containers[1], 5, 10),
new WaveFrame(points, containers[2], 9, 14)];


var Controller = (_temp = _class = function () {function Controller() {_classCallCheck(this, Controller);}_createClass(Controller, null, [{ key: 'runToggle', value: function runToggle()

    {
      if (!Controller.running) {
        points.running = true;
        waveFrames.forEach(function (frame) {
          frame.running = true;
        });
      } else {
        points.running = false;
        waveFrames.forEach(function (frame) {
          frame.running = false;
        });
      }
      Controller.running = !Controller.running;
    } }, { key: 'setupListeners', value: function setupListeners()
    {
      window.addEventListener('resize', Controller.onResize);
    } }, { key: 'onResize', value: function onResize(
    e) {
      waveFrames.forEach(function (frame) {
        frame.update();
      });
    } }]);return Controller;}(), _class.running = false, _temp);


console.clear();

Controller.setupListeners();
Controller.runToggle();