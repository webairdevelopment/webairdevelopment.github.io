﻿
(function() {
	
	// Shim with setTimeout fallback
	window.requestAnimationFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame||function(f){window.setTimeout(f,1e3/60)}}();
	
	var canvas = document.querySelector('canvas');
	var ctx = canvas.getContext('2d');
	
	var W = canvas.width = window.innerWidth;
	var H = canvas.height = window.innerHeight;
	
	// Let's set our gravity
	var gravity = 0.5;
	
	// Time to write a neat constructor for our
	// particles.
	// Lets initialize a random color to use for
	// our particles and also define the particle
	// count.
	var particle_count = 20;
	var particles = [];
	
	var random_color = 'rgb(' +
			parseInt(Math.random() * 255) + ',' +
			parseInt(Math.random() * 255) + ',' +
			parseInt(Math.random() * 255) + ')';
	
	function Particle() {
		this.radius = 5;
		this.x = W / 2;
		this.y = H - this.radius;
		
		this.color = random_color;
		
		// Random Initial Velocities
		this.vx = Math.random() * 4 - 2;
		// vy should be negative initially
		// then only will it move upwards first
		// and then later come downwards when our
		// gravity is added to it.
		this.vy = Math.random() * -14 - 7;
		
		// Finally, the function to draw
		// our particle
		this.draw = function() {
			ctx.fillStyle = this.color;
			
			ctx.beginPath();
			
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
			ctx.fill();
			
			ctx.closePath();
		};
	}
	
	// Now lets quickly create our particle
	// objects and store them in particles array
	for (var i = 0; i < particle_count; i++) {
		var particle = new Particle();
		particles.push(particle);
	}
	
	
	// Finally, writing down the code to animate!
	(function renderFrame() {
		requestAnimationFrame(renderFrame);
		
		// Clearing screen to prevent trails
		ctx.clearRect(0, 0, W, H);
		
		particles.forEach(function(particle) {
			
			// The particles simply go upwards
			// It MUST come down, so lets apply gravity
			particle.vy += gravity;
			
			// Adding velocity to x and y axis
			particle.x += particle.vx;
			particle.y += particle.vy;
			
			// We're almost done! All we need to do now
			// is to reposition the particles as soon
			// as they move off the canvas.
			// We'll also need to re-set the velocities
			
			if (
				// off the right side
				particle.x + particle.radius > W ||
				// off the left side
				particle.x - particle.radius < 0 ||
				// off the bottom
				particle.y + particle.radius > H
			) {
				
				// If any of the above conditions are met
				// then we need to re-position the particles
				// on the base :)
				particle.x = W / 2;
				particle.y = H - particle.radius;
				
				// If we do not re-set the velocities then
				// the particles will stick to base :D
				
				// Velocity X
				particle.vx = Math.random() * 4 - 2;
				particle.vy = Math.random() * -14 - 7;
			}
			
			particle.draw();
		
		});
	}());
	
	
	
	// Thats it guys!
	
}());