 // Based on: https://twitter.com/jn3008_/status/1070806655514959872

var points = [];
var weights = [];
var size = 600;

function setup() {
	var weightCount = 5;
	for (var i = 0; i < weightCount; i++) {
		weights.push(createVector(size * 0.3, 0).rotate(i / weightCount * TAU));
	}
	var count = 17 * 4;
	for (var y = 0; y < count; y++) {
		for (var x = 0; x < count; x++) {
			var p = createVector(x, y);
			if (x % 2 === 1) {
				p.addY(0.5);
			}
			if (p.y > count - 1) {
				continue;
			}
			p.div(count - 1).sub(0.5).mult(size);
			p._mag = p.mag();
			if (p._mag > size * 0.5) {
				continue;
			}
			points.push(p);
			p.extraRot = p._mag / size * TAU * 2;
			p.closestWeight = { w: p, dist: Infinity };var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
				for (var _iterator = weights[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var w = _step.value;
					var d = p.dist(w);
					if (d < p.closestWeight.dist) {
						p.closestWeight = { w: w, dist: d };
					}
				}} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
			p.closestWeight.dist_ = p.closestWeight.dist * 0.01;
			// p.v = createVector(p.closestWeight.dist * 0.075, 0);
			p.v = createVector(ease.cubic.out(p.closestWeight.dist, 10, size * 0.075 - 10, size), 0);
			p.ease = ease.cubic.inOut(size - p.closestWeight.dist, 1, -2, size) * TAU * 2;
			// p.lerp(p.closestWeight.w, (1 - p.closestWeight.dist / size) * 0.6);
		}
	}
}

function draw(e) {
	// background(hsl(0, 0, 8, 0.05));
	var time = e * 0.008;
	var time_ = -time * 0.3;
	beginPath();var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {
		for (var _iterator2 = points[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var p = _step2.value;
			var v = p.v._.mult(sin(time_ + p.closestWeight.dist_ + p.extraRot)).
			rotate(p.ease + time).
			add(p);
			circle(v.x, v.y, 1.2);
			// line(p, v);
		}} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2.return) {_iterator2.return();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
	var grad = createRadialGradient(0, 0, 0, 0, 0, size * 0.5);
	grad.addColorStop(0, hsl(0, 0, 100));
	// grad.addColorStop(0.3, hsl(0, 0, 100, 0.9));
	// grad.addColorStop(0.8, hsl(0, 0, 100, 0.1));
	// grad.addColorStop(1, hsl(0, 0, 100, 0));

	// grad.addColorStop(0.8, hsl(0, 0, 100));
	// grad.addColorStop(1, hsl(0, 0, 100, 0));
	fill(grad);
	// stroke(grad);
}