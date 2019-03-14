var RENDERER = {
	SNOW_COUNT: 30,
	SNOW_RADIUS : 10,
	CELL_COUNT : 4,
	RESIZE_INTERVAL : 30,
	
	init : function(){
		this.setParameters();
		this.setup();
		this.reconstructMethods();
		this.bindEvent();
		this.render();
	},
	setParameters : function(){
		this.$window = $(window);
		this.$container = $('#jsi-deep-sea-container');
		this.$canvas = $('<canvas />');
		this.context = this.$canvas.appendTo(this.$container).get(0).getContext('2d');
		this.snows = [];
		this.cells = [];
		this.resizeIds = [];
		this.gradient = this.context.createRadialGradient(0, 0, 0, 0, 0, this.SNOW_RADIUS);
		this.gradient.addColorStop(0, 'hsla(220, 80%, 80%, 1');
		this.gradient.addColorStop(0.1, 'hsla(220, 60%, 70%, 1)');
		this.gradient.addColorStop(0.25, 'hsla(220, 40%, 50%, 1)');
		this.gradient.addColorStop(1, 'hsla(220, 40%, 40%, 0)');
	},
	setup : function(){
		this.cells.length = 0;
		this.resizeIds.length = 0;
		this.width = this.$container.width();
		this.height = this.$container.height();
		this.$canvas.attr({width : this.width, height : this.height});
		this.createElements();
	},
	createElements : function(){
		for(var i = 0, count = this.SNOW_COUNT * this.width / 500  * this.height / 500; i < count; i++){
			this.snows.push(new SNOW(this, true));
		}
		for(var i = 0, count = this.CELL_COUNT * this.width / 500  * this.height / 500; i < count; i++){
			this.cells.push(new CELL(this, 360 / count * i | 0));
		}
	},
	watchWindowSize : function(){
		while(this.resizeIds.length > 0){
			clearTimeout(this.resizeIds.pop());
		}
		this.tmpWidth = this.$window.width();
		this.tmpHeight = this.$window.height();
		this.resizeIds.push(setTimeout(this.jdugeToStopResize, this.RESIZE_INTERVAL));
	},
	jdugeToStopResize : function(){
		var width = this.$window.width(),
			height = this.$window.height(),
			stopped = (width == this.tmpWidth && height == this.tmpHeight);
			
		this.tmpWidth = width;
		this.tmpHeight = height;
		
		if(stopped){
			this.setup();
		}
	},
	reconstructMethods : function(){
		this.watchWindowSize = this.watchWindowSize.bind(this);
		this.jdugeToStopResize = this.jdugeToStopResize.bind(this);
		this.render = this.render.bind(this);
	},
	bindEvent : function(){
		this.$window.on('resize', this.watchWindowSize);
	},
	getRandomValue : function(min, max){
		return min + (max - min) * Math.random();
	},
	render : function(){
		requestAnimationFrame(this.render);
		var gradient = this.context.createLinearGradient(0, 0, 0, this.height);
		gradient.addColorStop(0, 'hsl(240, 100%, 25%)');
		gradient.addColorStop(1, 'hsl(240, 100%, 5%)');
		this.context.fillStyle = gradient;
		this.context.fillRect(0, 0, this.width, this.height);
		
		for(var i = 0, count = this.snows.length; i < count; i++){
			this.snows[i].render(this.context);
		}
		for(var i = 0, count = this.cells.length; i < count; i++){
			this.cells[i].render(this.context);
		}
	}
};
var CELL = function(renderer, hue){
	this.renderer = renderer;
	this.hue = hue;
	this.init();
};
CELL.prototype = {
	RADIUS : 50,
	POINT_COUNT : 5,
	PARTICLE_COUNT : 100,
	
	init : function(){
		this.setParameters();
		this.createElements();
		this.setVelocity(true);
	},
	setParameters : function(){
		this.x = this.renderer.getRandomValue(0, this.renderer.width);
		this.y = this.renderer.getRandomValue(0, this.renderer.height);
		this.points = [];
		this.particles = [];
		this.gradient = this.renderer.context.createRadialGradient(0, 0, 0, 0, 0, this.RADIUS * 2);
		this.gradient.addColorStop(0, 'hsl(' + this.hue + ', 60%, 50%)');
		this.gradient.addColorStop(1, 'hsl(' + this.hue + ', 60%, 5%)');
	},
	createElements : function(){
		for(var i = 0, count = this.PARTICLE_COUNT; i < count; i++){
			this.particles.push(new PARTICLE(this));
		}
		var theta = Math.PI * 2 / this.POINT_COUNT;
		
		for(var i = 0, count = this.POINT_COUNT; i < count; i++){
			this.points.push(new POINT(this, theta * i));
		}
	},
	setVelocity : function(isInit){
		var velocity = this.renderer.getRandomValue(0.5, 1);
		this.theta = isInit ? this.renderer.getRandomValue(0, Math.PI * 2) : (this.theta + this.renderer.getRandomValue(-Math.PI / 4, Math.PI / 4));
		this.vx = velocity * Math.cos(this.theta);
		this.vy = velocity * Math.sin(this.theta);
		this.count = this.renderer.getRandomValue(100, 300) | 0;
	},
	controlStatus : function(context){
		if(--this.count == 0){
			this.setVelocity(false);
		}else{
			this.x += this.vx;
			this.y += this.vy;
			
			if(this.x < 0 || this.x > this.renderer.width){
				this.vx *= -1;
			}
			if(this.y < 0 || this.y > this.renderer.height){
				this.vy *= -1;
			}
			this.theta = Math.atan2(this.vx, this.vy);
		}
	},
	render : function(context){
		context.save();
		context.translate(this.x, this.y);
		
		for(var i = 0, count = this.points.length; i < count; i++){
			this.points[i].setAxis();
		}
		context.save();
		context.shadowBlur = 50;
		context.shadowColor = 'hsl(' + this.hue + ', 80%, 80%)';
		context.fillStyle = this.gradient;
		context.beginPath();
		context.moveTo((this.points[this.POINT_COUNT - 1].x + this.points[0].x) / 2, (this.points[this.POINT_COUNT - 1].y + this.points[0].y) / 2);
		
		for(var i = 0, count = this.points.length - 1; i < count; i++){
			context.quadraticCurveTo(this.points[i].x, this.points[i].y, (this.points[i].x + this.points[i + 1].x) / 2, (this.points[i].y + this.points[i + 1].y) / 2);
		}
		context.quadraticCurveTo(this.points[this.POINT_COUNT - 1].x, this.points[this.POINT_COUNT - 1].y, (this.points[this.POINT_COUNT - 1].x + this.points[0].x) / 2, (this.points[this.POINT_COUNT - 1].y + this.points[0].y) / 2);
		context.fill();
		context.restore();
		
		context.save();
		context.globalCompositeOperation = 'lighter';
		
		for(var i = 0, count = this.particles.length; i < count; i++){
			this.particles[i].render(context);
		}
		context.restore();
		context.restore();
		this.controlStatus(context);
	}
};
var POINT = function(cell, theta){
	this.cell = cell;
	this.theta = theta;
	this.init();
};
POINT.prototype = {
	init : function(){
		this.phi = this.cell.renderer.getRandomValue(0, Math.PI * 2);
	},
	setAxis : function(){
		var radius = this.cell.RADIUS * (1.5 + 0.3 * Math.sin(this.phi));
		this.x = radius * Math.sin(this.theta);
		this.y = radius * Math.cos(this.theta);
		this.phi += this.cell.renderer.getRandomValue(Math.PI / 50, Math.PI / 100);
		this.phi %= Math.PI * 2;
	}
};
var PARTICLE = function(cell){
	this.cell = cell;
	this.init();
};
PARTICLE.prototype = {
	RADIUS : 20,
	
	init : function(){
		var theta = this.cell.renderer.getRandomValue(0, Math.PI * 2),
			phi = this.cell.renderer.getRandomValue(0, Math.PI * 2),
			distance = this.cell.renderer.getRandomValue(0, this.cell.RADIUS),
			velocity = this.cell.renderer.getRandomValue(0.3, 1);
			
		this.x = distance * Math.cos(theta);
		this.y = distance * Math.sin(theta);
		this.vx = velocity * Math.cos(phi);
		this.vy = velocity * Math.sin(phi);
	},
	rotate : function(x, y, angle){
		var sin = Math.sin(angle),
			cos = Math.cos(angle);
		return {x : x * cos + y * sin, y : y * cos - x * sin};
	},
	checkCollision : function(){
		if(Math.sqrt(this.x * this.x + this.y * this.y) < this.cell.RADIUS - this.RADIUS){
			return;
		}
		var angle = Math.atan2(this.y, this.x),
			axis1 = {x : 0, y : 0},
			axis2 = this.rotate(this.x, this.y, angle),
			v1 = this.rotate(this.vx, this.vy, angle),
			vAbs = Math.abs(v1.x),
			overlap = Math.abs(axis1.x - axis2.x) - (this.cell.RADIUS - this.RADIUS);
			
		v1.x *= -1;
		
		if(axis1.x >= axis2.x){
			axis1.x += Math.abs(overlap * v1.x / vAbs);
		}else{
			axis1.x -= Math.abs(overlap * v1.x / vAbs);
		}
		axis1 = this.rotate(axis1.x, axis1.y, -angle);
		v1 = this.rotate(v1.x, v1.y, -angle);
		
		this.x += axis1.x;
		this.y += axis1.y;
		this.vx = v1.x;
		this.vy = v1.y;
	},
	render : function(context){
		context.save();
		context.translate(this.x, this.y);
		context.fillStyle = 'hsl(' + this.cell.hue + ', 80%, 1.5%)';
		context.beginPath();
		context.arc(0, 0, this.RADIUS, 0, Math.PI * 2, false);
		context.fill();
		context.restore();
		
		this.x += this.vx;
		this.y += this.vy;
		this.checkCollision();
	}
};
var SNOW = function(renderer, isInit){
	this.renderer = renderer;
	this.init(isInit);
};
SNOW.prototype = {
	VELOCITY : 0.5,
	
	init : function(isInit){
		var theta = this.renderer.getRandomValue(Math.PI * 3 / 4, Math.PI * 5 / 4);
		this.x = this.renderer.getRandomValue(0, this.renderer.width);
		this.y = isInit ? this.renderer.getRandomValue(0, this.renderer.height) : -this.renderer.SNOW_RADIUS;
		this.vx = this.VELOCITY * Math.sin(theta);
		this.vy = -this.VELOCITY * Math.cos(theta);
		this.theta = this.renderer.getRandomValue(0, Math.PI * 2);
		this.delta = this.renderer.getRandomValue(Math.PI / 500, Math.PI / 100);
	},
	controlStatus : function(context){
		this.x += this.vx;
		this.y += this.vy;
		this.theta += this.delta;
		this.theta %= Math.PI * 2;
		
		if(this.x < -this.renderer.SNOW_RADIUS || this.x > this.renderer.width - this.renderer.SNOW_RADIUS || this.y > this.renderer.height + this.renderer.SNOW_RADIUS){
			this.init(false);
		}
	},
	render : function(context){
		context.save();
		context.translate(this.x, this.y);
		context.globalAlpha = 0.5 * (1 + Math.sin(this.theta));
		context.fillStyle = this.renderer.gradient;
		context.beginPath();
		context.arc(0, 0, this.renderer.SNOW_RADIUS, 0, Math.PI * 2, false);
		context.fill();
		context.restore();
		this.controlStatus();
	}
};
$(function(){
	RENDERER.init();
});