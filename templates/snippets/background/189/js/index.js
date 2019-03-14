document.addEventListener('mousemove', function (e) {
	var sqrs = document.querySelectorAll('.item');

	var mouseX = e.pageX;
	var mouseY = e.pageY;

	sqrs.forEach(function (sqr) {
		var sqrX = sqr.offsetLeft + 20;
		var sqrY = sqr.offsetTop + 20;

		var diffX = mouseX - sqrX;
		var diffY = mouseY - sqrY;

		var radians = Math.atan2(diffY, diffX);

		var angle = radians * 180 / Math.PI;

		sqr.style.transform = 'rotate(' + angle + 'deg)';
	});

});