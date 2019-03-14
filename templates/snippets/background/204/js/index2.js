var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var particles = [];

function generateParticle() {var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : performance.now();
	var p = new Particle();
	p.pos.x = random(-0.01, 1.01) * width;
	p.pos.y = random(-height_half) - p.r;
	if (random() < 0.06) {
		var side = random([0, 1]);
		p.pos.x = side * width;
		p.pos.y = map(sin(e * 0.001), -1, 1, 0.3, 0.8) * height;
		p.acc.x = -(side || -1) * random(3, 7);
		p.acc.y = random(-5, -10);
	}
	particles.push(p);
}

function draw(e) {
	if (particles.length < 4000) {
		for (var i = 0; i < 9; i++) {
			generateParticle(e);
		}
	}
	beginPath();
	var gravity = createVector(0, 0.06);
	var mouseDownMult = mouseDown ? 1.4 : 0.8;
	var maxDist = width * 0.5;
	// isPreviewEmbed = () => true;
	var mouse = isPreviewEmbed() ? (
	mouseIn = e < 2000,
	function () {
		var time = e * 0.001 + PI;
		var w = width * 0.1;
		return createVector(
		cos(time) * w + width_half,
		sin(time) * w + height * 0.3);

	}()) :
	mousePos;
	for (var _i = particles.length - 1; _i >= 0; _i--) {
		var n = particles[_i];
		if (n.pos.y - n.r > height) {
			particles.splice(_i, 1);
			generateParticle(e);
			continue;
		}
		if (mouseIn) {
			var diff = mouse.copy().sub(n.pos);
			var dist = diff.mag();
			if (dist < maxDist) {
				var limit = mouseDownMult * n.ml * (maxDist - dist) * 0.01;
				n.acc.add(diff.limit(limit));
			}
		}
		n.acc.add(gravity);
		n.draw();
	}
	fill(hsl(260, 100, 50));
}var

Particle = function () {
	function Particle() {_classCallCheck(this, Particle);
		this.pos = createVector();
		this.vel = createVector();
		this.acc = createVector();
		this.r = random(2, 8);
		this.fr = map(this.r, 2, 8, 0.997, 0.99);
		this.ml = map(this.r, 2, 8, 0.4, 0.05);
	}_createClass(Particle, [{ key: "draw", value: function draw()
		{
			this.vel.add(this.acc).mult(this.fr);
			this.acc.set(0, 0);
			this.pos.add(this.vel);
			rect(this.pos.x, this.pos.y, this.r);
		} }]);return Particle;}();