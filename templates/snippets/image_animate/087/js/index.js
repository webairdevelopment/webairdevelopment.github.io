// Let's make the hands interactive now

(function() {

	var updateTime = function() {
	
		var date = new Date();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		
		// based on the hours, minutes and seconds
		// we need to figure out, by how many degrees
		// to rotate the hands.
		// for minutes and seconds, its easy.
		var minute_degrees = minutes * 6;
		var second_degrees = seconds * 6;
		// for hours, its a bit tricky
		// 12 hours - 360 deg
		// x hours  - 30x deg
		// but the hour hand also moves
		// when minutes passes
		// 60 minutes - 30 deg
		// y minutes  - y/2 deg
		// So, the formula will be
		// h_d = 30x + y/2
		var hour_degrees = hours*30 + minutes/2;
		
		
		// Lets form the CSS value strings
		// that we can simply pass on to the
		// transform CSS property.
		
		var hour_rotate = 'rotate('+hour_degrees+'deg)';
		var minute_rotate = 'rotate('+minute_degrees+'deg)';
		var second_rotate = 'rotate('+second_degrees+'deg)';
		
		
		// We need to take care of vendors :(
		
		var vendors = ['-webkit-', '-moz-', '-ms-', '-o-', ''];
		
		vendors.forEach(function(v, i, arr) {
			var prop = v + 'transform';
			
			document
				.querySelector('#hour')
				.style[prop] = hour_rotate;
			
			document
				.querySelector('#minute')
				.style[prop] = minute_rotate;
			
			document
				.querySelector('#second')
				.style[prop] = second_rotate;
		});
		
		
		
		
		
		
	};
	
	// Time is updating :D
	// Need to run it on an interval now ;)
	// SUPER! We are the master coders now
	// Finally, we'll now style the hands
	// to make them look pretty...
	setInterval(updateTime, 1000);

}());
