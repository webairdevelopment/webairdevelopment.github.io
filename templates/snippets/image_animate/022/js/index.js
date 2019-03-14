var section = document.querySelector('section');

var currentPos = window.pageYOffset;

var update = function update() {
	var newPos = window.pageYOffset;
	var diff = newPos - currentPos;
	var speed = diff * 0.35;

	section.style.transform = 'skewY(' + speed + 'deg)';

	currentPos = newPos;

	requestAnimationFrame(update);
};

update();