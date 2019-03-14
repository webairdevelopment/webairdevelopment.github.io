var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var round = Math.round,random = Math.random,PI = Math.PI;

// Vector2
////////////////////////////////////
var Vector2 = function () {
	function Vector2() {var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;_classCallCheck(this, Vector2);
		this.x = x;
		this.y = y;
	}_createClass(Vector2, [{ key: 'set', value: function set(
		x, y) {this.x = x;this.y = y;} }, { key: 'add', value: function add(
		v) {this.x += v.x;this.y += v.y;} }, { key: 'sub', value: function sub(
		v) {this.x -= v.x;this.y -= v.y;} }, { key: 'mult', value: function mult(
		v) {this.x *= v.x;this.y *= v.y;} }]);return Vector2;}();


// Setup
////////////////////////////////////
var setup = {
	color: [0, 0, 255],
	mousePosition: true,
	size: 5,
	sizeReduction: .2,
	density: 20,
	trailOpacity: 0.1,
	gravity: .5,
	velocityX: 5,
	velocityY: 5,
	maximumLife: 50,
	probability: 3,
	walls: true,
	bounceX: 0.2,
	bounceY: 0.2,
	sideBounceX: 1,
	windX: 0,
	windY: 0,
	type: 'optimized' };


// Canvas
////////////////////////////////////
var canvas = document.createElement("canvas");
var ctx = canvas.getContext('2d');
var body = document.body;
var margin = 55;

canvas.style.display = "block";
body.style.backgroundColor = "black";
body.style.margin = 0;
body.appendChild(canvas);

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight - margin;

// Canvas 2
////////////////////////////////////
var canvas2 = document.createElement("canvas");
var ctx2 = canvas2.getContext('2d');
canvas2.height = canvas2.width = 150;

// Particles
////////////////////////////////////
var particles = [];
var particleIndex = 0;
var wind = new Vector2(setup.windX, setup.windY);var
Particle = function () {
	function Particle() {_classCallCheck(this, Particle);
		this.position = new Vector2(mouse.x, mouse.y);
		this.velocity = new Vector2(random() * (setup.velocityX * 2) - setup.velocityX, random() * (setup.velocityY * 2) - setup.velocityY);
		this.color = setup.color;
		this.size = this.size2 = 1;
		this.life = 0;
		this.id = particleIndex++;
		particles[this.id] = this;
	}_createClass(Particle, [{ key: 'update', value: function update()
		{
			this.life++;
			if (this.life >= setup.maximumLife) {
				delete particles[this.id];
			} else {
				this.velocity.sub(wind);
				this.position.add(this.velocity);
				this.bounce();
				this.velocity.y += setup.gravity;

				if (setup.type == "optimized") {
					if (this.id & 1) {
						this.size += setup.sizeReduction;
						var fsize = setup.size / this.size * 7;
						ctx.drawImage(image, this.position.x - fsize / 2, this.position.y - fsize / 2, fsize, fsize);
					} else {
						this.size2 += setup.sizeReduction * 2;
						var _fsize = setup.size / this.size2 * 7;
						ctx.drawImage(image, this.position.x - _fsize / 2, this.position.y, _fsize, _fsize);
					}
				} else if (setup.type == "realistic") {
					if (this.id & 1) {
						this.size += setup.sizeReduction;
						this.realisticShape(this.position.x, this.position.y, setup.size / this.size);
					} else {
						this.size2 += setup.sizeReduction * 2;
						this.realisticShape(this.position.x, this.position.y, setup.size / this.size2);
					}
				} else {
					if (this.id & 1) {
						this.size += setup.sizeReduction;
						this.basicShape(this.position.x, this.position.y, setup.size / this.size);
					} else {
						this.size2 += setup.sizeReduction * 2;
						this.basicShape(this.position.x, this.position.y, setup.size / this.size2);
					}
				}
			}
		} }, { key: 'bounce', value: function bounce()
		{
			if (setup.walls) {
				if (this.position.y + setup.size >= height) {
					this.velocity.y *= -setup.bounceY;
					this.velocity.x *= setup.bounceX;
					this.position.y = height - setup.size;
				} else if (this.position.y + setup.size <= 0) {
					this.velocity.y *= -setup.bounceY;
					this.velocity.x *= setup.bounceX;
					this.position.y = setup.size;
				} else if (this.position.x - setup.size <= 0) {
					this.velocity.x *= -setup.sideBounceX;
					this.x = setup.size;
				} else if (this.position.x + setup.size >= width) {
					this.velocity.x *= -setup.sideBounceX;
					this.x = width - setup.size;
				}
			}
		} }, { key: 'optimizedShape', value: function optimizedShape(
		x, y, radius) {
			var innerRadius = 0.5 * radius;
			var outerRadius = 3 * radius;

			ctx2.beginPath();
			ctx2.fillStyle = 'rgba(' + this.color + ',.1)';
			ctx2.arc(x, y, radius * 4, 0, Math.PI * 2, true);
			ctx2.closePath();
			ctx2.fill();

			ctx2.shadowColor = "white";
			ctx2.shadowBlur = 55;
			ctx2.fill();

			ctx2.beginPath();
			ctx2.fillStyle = 'rgba(' + this.color + ',.1)';
			ctx2.arc(x, y, radius * 2.1, 0, Math.PI * 2, true);
			ctx2.closePath();
			ctx2.fill();

			ctx2.shadowColor = "white";
			ctx2.shadowBlur = 40;
			ctx2.fill();

			ctx2.beginPath();
			ctx2.fillStyle = 'rgba(' + this.color + ',.2)';
			ctx2.arc(x, y, radius * 1.4, 0, Math.PI * 2, true);
			ctx2.closePath();
			ctx2.fill();

			var gradient = ctx2.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
			gradient.addColorStop(0, 'rgb(255, 255, 255)');
			gradient.addColorStop(1, 'rgb(' + this.color + ')');

			ctx2.beginPath();
			ctx2.fillStyle = gradient;
			ctx2.arc(x, y, radius, 0, Math.PI * 2);
			ctx2.closePath();
			ctx2.fill();

			ctx2.shadowColor = "white";
			ctx2.shadowBlur = 55;
			ctx2.fill();
		} }, { key: 'realisticShape', value: function realisticShape(
		x, y, radius) {
			var innerRadius = 0.5 * radius;
			var outerRadius = 1.6 * radius;

			ctx.beginPath();
			ctx.fillStyle = 'rgba(' + this.color + ',.1)';
			ctx.arc(x, y, radius * 4, 0, PI * 2, true);
			ctx.closePath();
			ctx.fill();

			ctx.beginPath();
			ctx.fillStyle = 'rgba(' + this.color + ',.2)';
			ctx.arc(x, y, radius * 2.1, 0, PI * 2, true);
			ctx.closePath();
			ctx.fill();

			ctx.beginPath();
			ctx.fillStyle = 'rgba(' + this.color + ',.2)';
			ctx.arc(x, y, radius * 1.4, 0, PI * 2, true);
			ctx.closePath();
			ctx.fill();

			var gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
			gradient.addColorStop(0, 'rgb(255, 255, 255)');
			gradient.addColorStop(1, 'rgb(' + this.color + ')');

			ctx.beginPath();
			ctx.fillStyle = gradient;
			ctx.arc(x, y, radius, 0, PI * 2);
			ctx.closePath();
			ctx.fill();

			ctx.shadowColor = "white";
			ctx.shadowBlur = 5;
		} }, { key: 'basicShape', value: function basicShape(
		x, y, radius) {
			var innerRadius = 0.5 * radius;
			var outerRadius = 1.6 * radius;

			ctx.beginPath();
			ctx.fillStyle = 'rgba(' + this.color + ',1)';
			ctx.arc(x, y, radius, 0, PI * 2);
			ctx.closePath();
			ctx.fill();
		} }]);return Particle;}();


// Events
////////////////////////////////////
var savePos = new Vector2(width / 2, height / 2);
var mouse = new Vector2(savePos.x, savePos.y);

canvas.addEventListener('mousemove', function (e) {
	if (setup.mousePosition) {
		mouse.set(e.clientX, e.clientY);
	}
}, false);

canvas.addEventListener('mouseout', function (e) {
	mouse.set(savePos.x, savePos.y);
}, false);

canvas.addEventListener('click', function (e) {
	mouse.x = savePos.x = e.clientX;
	mouse.y = savePos.y = e.clientY;
}, false);

window.addEventListener('resize', function (e) {
	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight - margin;
	mouse.x = savePos.x = width / 2;
	mouse.y = savePos.y = height / 2;
	console.log(mouse / 2);
}, false);

// Gui
////////////////////////////////////
function setRGB(array) {
	for (var i in array) {
		array[i] = round(array[i]);
	}
}

var gui = new dat.GUI();
gui.addColor(setup, 'color').onChange(function () {
	setRGB(setup.color);
	ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
	optimizedParticle.color = setup.color;
	optimizedParticle.optimizedShape(canvas2.width / 2, canvas2.height / 2, 18);
	image.src = canvas2.toDataURL();
});
gui.add(setup, 'type', ['optimized', 'realistic', 'basic']);

var f1 = gui.addFolder('Particles');
f1.add(setup, 'mousePosition').name('mouse position');
f1.add(setup, 'size').step(1).min(1);
f1.add(setup, 'density').step(1).min(1);
f1.add(setup, 'maximumLife').name('life').step(1).min(1);
f1.add(setup, 'sizeReduction', 0, 1).name('size / life');
f1.add(setup, 'probability', 0, 100).name('spawn probability');
f1.add(setup, 'trailOpacity', 0, .8).name('trail opacity');

var f2 = gui.addFolder('Physics');
f2.add(setup, 'gravity', -5, 5);
f2.add(setup, 'velocityX', -50, 50);
f2.add(setup, 'velocityY', -50, 50);
f2.add(setup, 'windX', -5, 5).step(0.05).onChange(function () {wind.set(setup.windX, setup.windY);});
f2.add(setup, 'windY', -5, 5).step(0.1).onChange(function () {wind.set(setup.windX, setup.windY);});
f2.add(setup, 'walls').name('bounce');
f2.add(setup, 'bounceX', 0, 2);
f2.add(setup, 'bounceY', 0, 2);
f2.add(setup, 'sideBounceX', 0, 2).name('side bounceX');

// Optimized particle
////////////////////////////////////
var optimizedParticle = new Particle();
var image = new Image();
optimizedParticle.optimizedShape(canvas2.width / 2, canvas2.height / 2, 18);
image.src = canvas2.toDataURL();

// Update
////////////////////////////////////
function update() {
	for (var i = 0; i < setup.density; i++) {
		if (random() > -(setup.probability - 100) * 0.01) {
			new Particle();
		}
	}
	for (var _i in particles) {
		particles[_i].update();
	}
}

// Render
////////////////////////////////////
var fps = 40;
function render() {
	setTimeout(function () {
		requestAnimationFrame(render);
		ctx.shadowColor = "transparent";
		ctx.fillStyle = 'rgba(0,0,0, ' + -(setup.trailOpacity - 1) + ')';
		ctx.fillRect(0, 0, width, height);
		update();
	}, 1000 / fps);
}
window.onload = render();