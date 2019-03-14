var points = [];
var count = 100;

function setup() {
	for (var i = 0; i < Math.pow(count, 2); i++) {
		var pos = iToXY(i, count, count).
		add(0.5).
		div(count).
		sub(0.5).
		mult(2 * count);
		if (pos.mag() > count) continue;
		points.push({ pos: pos, i: i });
	}
}

function draw(e) {
	var time = e * 0.0006;
	beginPath();
	// rect(-100, -100, 200, 200);
	var x = cos(time * E * 0.367 * 2) * count * 0.4;
	var c = createVector(x).rotate(time * 0.318 * PI);
	var s = 250;
	var w = s / count;
	var timeA = time * PI * 0.3142 * 0.3;
	var timeB = time * PHI * 0.1618 * 0.3;
	var timeC = time * E * 0.2718 * 0.3;var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
		for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var p = _step.value;
			p.pos.z = sin(time * 4 + p.pos.mag() * 0.1) * 20;
			var mag3D = p.pos.mag3D();
			if (sin(mag3D * map(cos(time), -1, 1, 0.1, 0.5) + time) < 0) {
				p.pos.z += tan(map(sin(time * 3 + mag3D * 0.08), -1, 1, 0, FIFTH_PI * 2)) * 10;
			}
			var v = p.pos._.
			sub(c).
			rotateZX(timeA).
			rotateYZ(timeB).
			rotateXY(timeC).
			add(c)
			// .round()
			.div(count).
			mult(s);
			rect(v.x, v.y, constrain(w * v.z * 0.01, 1, w));
		}} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
	fill(hsl(0, 0, 100));
}