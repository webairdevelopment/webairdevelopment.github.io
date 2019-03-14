var RENDERER = {
	CELL_SIZE : 14,
	INIT_FORCE_RATE : 3,
	SURPLUS : 5,
	NEIGHBORS : [
		{x : 0, y : -1},
		{x : 1, y : 0},
		{x : 0, y : 1},
		{x : -1, y : 0}
	],
	VELOCITY_RATE : 0.05,
	DELTA_RATE : 0.5,
	
	init : function(){
		this.setParameters();
		this.createElements();
		this.reconstructMethods();
		this.bindEvent();
		this.render();
		this.forceOff();
	},
	setParameters : function(){
		this.$window = $(window);
		this.$container = $('#jsi-fluid-container');
		this.width = this.$container.width();
		this.height = this.$container.height();
		this.context = $('<canvas />').attr({width : this.width, height : this.height}).appendTo(this.$container).get(0).getContext('2d');
		this.cells = [];
		this.points = [];
		this.velocityRate = this.VELOCITY_RATE * this.INIT_FORCE_RATE;
	},
	createElements : function(){
		var columnCount = this.columnCount = Math.ceil(this.width / this.CELL_SIZE) + this.SURPLUS,
			rowCount = this.rowCount = Math.ceil(this.height / this.CELL_SIZE) + this.SURPLUS;
			
		this.baseSize = this.CELL_SIZE * this.CELL_SIZE;
		this.columnOffset = (this.CELL_SIZE * columnCount - this.width) / 2;
		this.rowOffset = (this.CELL_SIZE * rowCount - this.height) / 2;
		
		for(var y = 0; y <= rowCount; y++){
			for(var x = 0; x <= columnCount; x++){
				 this.points[this.getPointIndex(x, y)] = new POINT(x * this.CELL_SIZE, y * this.CELL_SIZE);
			}
		}
		for(var y = 0; y < rowCount; y++){
			for(var x = 0; x < columnCount; x++){
				this.cells[x + y * columnCount] = new CELL(this, [
					this.points[this.getPointIndex(x, y)],
					this.points[this.getPointIndex(x + 1, y)],
					this.points[this.getPointIndex(x + 1, y + 1)],
					this.points[this.getPointIndex(x, y + 1)]
				]);
			}
		}
		this.axis = {
			x : Math.random() * this.width + this.columnOffset,
			y : Math.random() * this.height + this.rowOffset
		};
	},
	getPointIndex : function(x, y){
		return x + y * (this.columnCount + 1);
	},
	forceOn : function(isMoving, event){
		if(isMoving && !this.axis){
			return;
		}
		var offset = this.$container.offset();
		
		this.axis = {
			x : event.clientX - offset.left + this.$window.scrollLeft() + this.columnOffset,
			y : event.clientY - offset.top + this.$window.scrollTop() + this.rowOffset
		};
		this.$container.addClass('grabbing');
	},
	forceOff : function(){
		this.axis = null;
		this.$container.removeClass('grabbing');
	},
	reconstructMethods : function(){
		this.render = this.render.bind(this);
	},
	bindEvent : function(){
		this.$container.on('mousedown', this.forceOn.bind(this, false));
		this.$container.on('mousemove', this.forceOn.bind(this, true));
		this.$container.on('mouseup mouseleave', this.forceOff.bind(this));
	},
	propagateForce : function(){
		var cellSize = this.CELL_SIZE,
			columnCount = this.columnCount,
			rowCount = this.rowCount,
			region = this.CELL_SIZE * this.CELL_SIZE * 100;
			
		for(var y = 0; y <= rowCount; y++){
			for(var x = 0; x <= columnCount; x++){
				var source = this.points[this.getPointIndex(x, y)],
					neighborCount = 1,
					deltaX = x * cellSize,
					deltaY = y * cellSize;
					
				for(var i = 0; i < 4; i++){
					var neighbor = this.NEIGHBORS[i],
						neighborX = x + neighbor.x,
						neighborY = y + neighbor.y;
						
					if(neighborX < 0 || neighborX > columnCount || neighborY < 0 || neighborY > rowCount){
						continue;
					}
					var target = this.points[this.getPointIndex(neighborX, neighborY)];
					
					deltaX += target.x - neighbor.x * cellSize;
					deltaY += target.y - neighbor.y * cellSize;
					neighborCount++;
				}
				source.vx += (deltaX / neighborCount - source.x) * this.DELTA_RATE;
				source.vy += (deltaY / neighborCount - source.y) * this.DELTA_RATE;
				
				if(!this.axis){
					continue;
				}
				var dx = this.axis.x - source.x,
					dy = this.axis.y - source.y,
					distance = dx * dx + dy * dy,
					rate = 1 - distance / region;
					
				if(rate < 0){
					continue;
				}
				source.vx += dx * rate * this.velocityRate;
				source.vy += dy * rate * this.velocityRate;
			}
		}
		for(var i = 0, count = this.points.length; i < count; i++){
			this.points[i].propagateForce();
		}
		this.velocityRate = this.VELOCITY_RATE;
	},
	render : function(){
		requestAnimationFrame(this.render);
		this.context.clearRect(0, 0, this.width, this.height);
		this.propagateForce();
		
		for(var i = 0, count = this.cells.length; i < count; i++){
			this.cells[i].render(this.context);
		}
	}
};
var CELL = function(renderer, points){
	this.renderer = renderer;
	this.points = points;
};
CELL.prototype = {
	render : function(context){
		var axis = [];
		
		for(var i = 0; i < 3; i++){
			axis.push({x : this.points[i].x - this.points[3].x, y : this.points[i].y - this.points[3].y});
		}
		var rate = (Math.abs(axis[0].x * axis[1].y - axis[1].x * axis[0].y) / 2 + Math.abs(axis[1].x * axis[2].y - axis[2].x * axis[1].y) / 2) / this.renderer.baseSize;
		
		context.strokeStyle = 'hsl(220, 80%, 60%)';
		context.fillStyle = 'hsl(' + (210 - 10 * rate) + ', 80%, ' + (40 + 10 * rate) + '%)';
		context.beginPath();
		
		for(var i = 0; i < 4; i++){
			context[i == 0 ? 'moveTo' : 'lineTo'](this.points[i].x - this.renderer.columnOffset, this.points[i].y - this.renderer.rowOffset);
		}
		context.closePath();
		context.stroke();
		context.fill();
	}
};
var POINT = function(x, y){
	this.x = x;
	this.y = y;
	this.vx = 0;
	this.vy = 0;
};
POINT.prototype = {
	FRICTION : 0.92,
	
	propagateForce : function(){
		this.x += this.vx;
		this.y += this.vy;
		this.vx *= this.FRICTION;
		this.vy *= this.FRICTION;
	}
};
$(function(){
	RENDERER.init();
});