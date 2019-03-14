var ctx = document.querySelector('canvas').getContext('2d');
var canvas = ctx.canvas;
var text = canvas.getAttribute('text');
var fontSize = canvas.getAttribute('size');
canvas.width = canvas.getBoundingClientRect().width;
canvas.height = canvas.getBoundingClientRect().height;

var pixels = [];
var animation = {
	radius: 4,
	move: 0.25,
	pull: 0.15,
	dampen: 0.95,
	density: 5 };


var mouse = new Mouse(canvas);
var draw = new Draw(ctx);

init();
frame();

function init() {
	draw.setText({
		font: fontSize + 'px monospace',
		fillStyle: '#ff9840',
		textAlign: 'center',
		textBaseline: 'middle' });

	draw.fillText(text, (canvas.width - fontSize) / 2, canvas.height / 2);
	pixels = scene(ctx, animation.density);var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
		for (var _iterator = pixels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var particle = _step.value;
			particle.lx = particle.x;
			particle.ly = particle.y;
			particle.dx = Math.random() * 25 - 10;
			particle.dy = Math.random() * 25 - 10;
		}} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
}

/*
  * Get pixels positions 
  * @Params: {ctx} 		 -> canvas context
  * @Params: {density} -> animation.density
  */
function scene(ctx, density) {
	var pixelData = [];
	var data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
	var rows = ctx.canvas.width / density;
	var cols = ctx.canvas.height / density;

	for (var row = 0; row < rows; row++) {
		for (var col = 0; col < cols; col++) {
			var pixelX = col * density + density / 2;
			var pixelY = row * density + density / 2;

			for (var rp = 0; rp < density; rp++) {
				for (var rc = 0; rc < density; rc++) {
					// pixel -> pixel id
					var pixel = ((row * density + rp) * ctx.canvas.width + (col * density + rc)) * 4;
					var colors = {
						r: data.data[pixel],
						g: data.data[pixel + 1],
						b: data.data[pixel + 2],
						a: data.data[pixel + 3] };

					if (colors.a) {
						pixelData.push({ x: pixelX,
							y: pixelY,
							color: colors });

						rp = density;
						rc = density;
					}
				}
			}


		}
	}
	return pixelData;
}

/*
  * Animation Frames
  */
function frame() {
	draw.clear();
	requestAnimationFrame(frame);var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {

		for (var _iterator2 = pixels[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var particle = _step2.value;
			var color = 'rgba(' + particle.color.r + ',' + particle.color.g + ',' + particle.color.b + ',' + particle.color.a + ')';
			var distance = distanceFromMouse(particle.x, particle.y, mouse.x, mouse.y);
			var shift = 1 / distance * 6;var _arr =

			['x', 'y'];for (var _i = 0; _i < _arr.length; _i++) {var ax = _arr[_i];
				particle[ax] += particle['d' + ax];
				particle['d' + ax] += (Math.random() - 0.5) * animation.move;
				particle['d' + ax] -= Math.sign(particle[ax] - particle['l' + ax]) * animation.pull;
				particle['d' + ax] *= animation.dampen;
				particle['d' + ax] -= Math.sign(mouse[ax] - particle[ax]) * shift;
			}

			draw.fillCircle(particle.x, particle.y, animation.radius, color);
		}} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2.return) {_iterator2.return();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
}

/*
  * Canvas Draw Object
  *
  * @Params: {ctx} -> canvas context
  * 
  * Prototypes: 
  * - setText			-> setup text property
  * - fillText		-> drawing text on canvas with fill property
  * - strokeText	-> drawing text on canvas with stroke color property
  * - fillCircle	-> drawing circle on canvas with fill color property
  * - clear				-> to clean the canvas 
  */
function Draw(ctx) {var _this = this;
	this.ctx = ctx;
	this.canvas = canvas;

	this.setText = function (proporty) {
		for (var option in proporty) {
			_this.ctx[option] = proporty[option];
		}
	};

	this.fillText = function (text, x, y) {
		_this.ctx.fillText(text, x, y);
	};

	this.strokeText = function (text, x, y) {
		_this.ctx.strokeText(text, x, y);
	};

	this.fillCircle = function (x, y, radius, color) {
		_this.ctx.beginPath();
		_this.ctx.arc(x, y, radius, 0, Math.PI * 2);
		if (color) _this.ctx.fillStyle = color;
		_this.ctx.fill();
	};

	this.clear = function () {
		_this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
	};
}

/*
  * Distance function from mouse position
  */
function distanceFromMouse(x, y, mX, mY) {
	return Math.sqrt(Math.pow(Math.pow(x - mX, 2) + y - mY, 2));
}

/*
  * Mouse position event
  * @Params: {canvas} -> html canvas element
  * resutl: mouse.x and mouse.y
  */
function Mouse(canvas) {
	this.x = 0;
	this.y = 0;
	this.canvas = canvas;
	this.canvas.addEventListener('mousemove', function (e) {
		this.x = e.offsetX;
		this.y = e.offsetY;
	}.bind(this));
	this.canvas.addEventListener('mouseleave', function (e) {
		this.x = -100;
		this.y = -100;
	}.bind(this));
}