(function() {

	// rAF
	window.requestAnimationFrame = function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			function(f) {
				window.setTimeout(f,1e3/60);
			}
	}();
	
	var canvas = document.querySelector('canvas');
	var ctx = canvas.getContext('2d');
	
	var W = canvas.width = window.innerWidth;
	var H = canvas.height = window.innerHeight;
	
	// Our SpaceShip Constructor
	var SpaceShip = function() {
		
		// x/y positions
		this.x = 200;
		this.y = 100;
		
		this.radius = 40;
		
		// How many wings/blades or whatever you want to call it
		this.wing_count = 3;
		// Math.PI*2 === 360 degrees
		// 360 / 3 = 120 degrees
		// So every 120 degrees will have 1 hand/blade
		// of 60 degrees (half of 120)
		this.steps = Math.PI*2 / this.wing_count;
		
		this.color = 'hsl(0,100%,50%)';
		// We can try changing color after EVERY rotation
		// would be cool!
		this.hue = 0; // initial hue
		// This is the target hue we'll reach
		// during (at start) the first rotation
		this.hue_target = parseInt( Math.random()*360 );
		
		// Lets mess with the angle now
		this.angle = 0;
		// Manipulating speed - seems good!
		this.rotation_speed = 0.06;
		
		this.draw = function(ctx) {
			
			// But we want to do this after every rotation
			if (this.angle > Math.PI*2) {
				// Kind of reset the angle when its more
				// than 360 degrees.
				this.angle -= Math.PI*2;
				
				// Choose a random hue target now
				this.hue_target = parseInt( Math.random()*360 );
				
				// ... and we made it :)
			}
			
			// You notice initially there's a color change ?
			// Why this (hue_target - hue) * random_numer ?
			// Well, we basically measure the distance that we
			// have to travel, from initial to target and multiple
			// that by an "easing" factor.
			// This causes "easing" effect when changing from initial
			// to target color, i.e., it starts with high speed
			// and as it progresses, the spead decreases until
			// it reaches the target.
			// We just learnt how to implement Easing in html5 canvas!
			this.hue += (this.hue_target - this.hue) * 0.05;
			this.color = 'hsl(' + this.hue + ',100%,50%)';
		
			ctx.strokeStyle = this.color;
			// Setting a line width
			ctx.lineWidth = 15;
			
			// Time to rotate this thing
			// Since ctx.rotate() will rotate the entire 2D context
			// and not just the arc's, we'll have to save
			// our current drawing state into the stack.
			ctx.save();
			
			// as you can see entire context was rotated
			// we'll fix this by first translating
			// The x/y values that we pass to translate()
			// is the same as the ones we passed to ctx.arc below
			ctx.translate(this.x, this.y);
			
			// The entire thing became a circle :P
			// cuz we never cleared after each rendering of frame
			this.angle += this.rotation_speed;
			ctx.rotate(this.angle);
			
			for (var i = 0; i < this.wing_count; i++) {
				ctx.beginPath();
				
				// For arc, the new x/y pos will be 0,0
				ctx.arc(
					0,
					0,
					this.radius,
					i*this.steps,
					i*this.steps + this.steps/2,
					false
				);
				
				ctx.stroke();
				ctx.closePath();
			}
			
			// ... and restore here
			ctx.restore();
			
			// A rounded body in the center
			ctx.beginPath();
			ctx.fillStyle = 'black';
			ctx.arc(this.x, this.y, 20, 0, Math.PI*2, false);
			ctx.fill();
			ctx.closePath();
		
		};
	};
	
	// Create a spaceship object
	var ship = new SpaceShip();
	// Setting proper x/y to center it
	ship.x = W/2;
	ship.y = H/2;
	
	(function renderFrame() {
		window.requestAnimationFrame(renderFrame);
		
		// Magik! We dont need so much speed though...
		ctx.clearRect(0,0,W,H);
		
		ship.draw(ctx);
	}());
}());
