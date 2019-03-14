var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var canvas = document.querySelector('canvas'),
cx = canvas.getContext('2d'),
branches = [];

var frameID = void 0,
frameCurrentTime = 0,
frameStartTime = 0;

for (var groupIndex = 0; groupIndex < 10; groupIndex++) {
  var channel = 64 + Math.floor(Math.random() * 128),
  x = (Math.random() - 0.5) * 1000,
  y = (Math.random() - 0.5) * 1000,
  z = 2 + Math.random() * 10,
  numBranches = 25 + Math.floor(Math.random() * 25),
  startTime = Math.random() * 5000;
  for (var index = 0; index < numBranches; index++) {
    branches.push({
      enabled: true,
      start: startTime,
      color: 'rgb(' + channel + ',' + channel + ',' + channel + ')',
      direction: Math.random() * Math.PI * 2,
      aperture: 0.1 + Math.random() * 0.25,
      step: 5 + Math.random() * 5,
      decrement: 0.9 + Math.random() * 0.025,
      points: [
      [x, y, z]] });


  }
}

function frame(frameTime) {
  frameCurrentTime = frameTime;
  if (frameCurrentTime - frameStartTime >= 33) {
    frameStartTime = frameCurrentTime;var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
      for (var _iterator = branches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var branch = _step.value;
        if (branch.enabled && frameTime > branch.start) {var _branch$points = _slicedToArray(
          branch.points[branch.points.length - 1], 3),_x = _branch$points[0],_y = _branch$points[1],_z = _branch$points[2];
          var newZ = _z * branch.decrement;
          branch.points.push([
          _x + Math.cos(branch.direction) * branch.step,
          _y + Math.sin(branch.direction) * branch.step,
          newZ]);

          branch.direction += (Math.random() - 0.5) * branch.aperture * Math.PI;
          if (Math.round(newZ) === 0) {
            branch.enabled = false;
          }
        }
      }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
  }

  cx.clearRect(0, 0, cx.canvas.width, cx.canvas.height);
  cx.lineCap = 'round';
  cx.lineJoin = 'round';var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {
    for (var _iterator2 = branches[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var _branch = _step2.value;
      for (var _index = 0; _index < _branch.points.length - 1; _index++) {var _branch$points$_index = _slicedToArray(
        _branch.points[_index], 3),sx = _branch$points$_index[0],sy = _branch$points$_index[1],sz = _branch$points$_index[2];var _branch$points2 = _slicedToArray(
        _branch.points[_index + 1], 3),ex = _branch$points2[0],ey = _branch$points2[1],ez = _branch$points2[2];
        cx.lineWidth = sz;
        cx.beginPath();
        cx.moveTo(cx.canvas.width * 0.5 + sx, cx.canvas.height * 0.5 + sy);
        cx.lineTo(cx.canvas.width * 0.5 + ex, cx.canvas.height * 0.5 + ey);
        cx.strokeStyle = _branch.color;
        cx.stroke();
      }
    }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2.return) {_iterator2.return();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
  frameID = window.requestAnimationFrame(frame);
}

function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

function start() {
  window.addEventListener('resize', resize);
  window.dispatchEvent(new Event('resize'));
  frameID = window.requestAnimationFrame(frame);
}

start();