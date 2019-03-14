var gc = new GameCanvas();

var snowflake = new Snowflake(width / 2, height / 2, Math.min(width, height) / 2);
var snowflakeImages = [];

function loop() {
  rect(0, 0, width, height, "rgb(30, 30, 30)");
  
  var x = 0, y = 0;
  for (var i = 0; i < snowflakeImages.length; i++) {
    var img = snowflakeImages[i];
    gc.ctx.drawImage(img, x, y, 200, 200);
    x += 200;
    if (x > width) {
      x = 0;
      y += 200;
    }
  }
  
  if (snowflakeImages.length > Math.ceil(width / 200) * Math.ceil(height / 200)) {
    loop = function(){};
  }
 
  snowflake.render();
  snowflake.update();
}

function Snowflake(x, y, size) {
  var _this = this;
  this.x = x;
  this.y = y;
  this.size = size;
  this.randomForce = Math.random() * 2 + 4;
  this.particleRadius = Math.random() * 2 + 2;
  
  this.canvas = document.createElement("canvas");
  var size = Math.min(width, height);
  this.gc = new GameCanvas(this.canvas, size, size, {globalFunctions: false});
  
  var p = new Particle(0, 0);
  p.isDone = true;
  this.particles = [p, new Particle(this.size, 0)];
  
  this.render = function() {
    for (var a = 0; a < Math.PI * 2; a += Math.PI / 3) {
      for (var i = 0; i < this.particles.length; i++) {
        this.particles[i].render(a, false);
        this.particles[i].render(a, true);
      }
    }
  }
  
  this.update = function() {
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
    }
  }
  
  this.addParticle = function() {
    this.particles.push(new Particle(this.size, Math.random() * 6 - 3));
  }
  
  this.reset = function() {
    var p = new Particle(0, 0);
    p.isDone = true;
    this.particles = [p, new Particle(this.size, 0)];
    this.randomForce = Math.random() * 2 + 4;
    this.particleRadius = Math.random() * 2 + 3;
    this.gc.clearScreen();
  }
  
  function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.radius = _this.particleRadius;
    this.isDone = false;
    
    this.render = function(angle, mirror) {
      var c = this.calcRotation(angle, mirror);
      var v = 255 - this.x / _this.size * 255 * 0.75;
      circle(_this.x + c.x, _this.y + c.y, this.radius, "rgb(" + v + "," + v + ",255)");
    }
    
    this.renderToImage = function() {
      for (var i = 0; i < Math.PI * 2; i += Math.PI / 3) {
        var c = this.calcRotation(i, false);
        var c2 = this.calcRotation(i, true);
        var v = 255 - this.x / _this.size * 255 * 0.75;
        _this.gc.circle(c.x + _this.gc.width / 2, c.y + _this.gc.height / 2, this.radius * 0.75, "rgb(" + v + "," + v + ",255)");
        _this.gc.circle(c2.x + _this.gc.width / 2, c2.y + _this.gc.height / 2, this.radius * 0.75, "rgb(" + v + "," + v + ",255)");
      }
    }
    
    this.calcRotation = function(angle, mirror) {
      var m = mirror ? -1 : 1;
      var a = getAngle(0, 0, this.x, this.y * m) + angle;
      var d = getDistance(0, 0, this.x, this.y * m);
      return {x: Math.cos(a) * d,
              y: Math.sin(a) * d};
    }
    
    this.update = function() {
      for (var c = 0; c < 100; c++) {
        if (!this.isDone) {
          this.x -= 1 * 2;
          this.y += (Math.random() * _this.randomForce - _this.randomForce / 2) * 2;

          var a = getAngle(0, 0, this.x, this.y);
          if (a > 0 || a < -Math.PI / 3) {
            a = Math.min(0, Math.max(-Math.PI / 3, getAngle(0, 0, this.x, this.y)));
            var d = distance(0, 0, this.x, this.y);
            this.x = Math.cos(a) * d;
            this.y = Math.sin(a) * d;
          }

          for (var i = 0; i < _this.particles.length; i++) {
            var p = _this.particles[i];
            if (p != this) {
              if (this.x + this.radius > p.x - this.radius &&
                  this.x - this.radius < p.x + this.radius &&
                  this.y + this.radius > p.y - this.radius &&
                  this.y - this.radius < p.y + this.radius) {
                this.renderToImage();
                this.isDone = true;
                if (this.x / _this.size < 0.75)
                  _this.addParticle();
                else {
                  var img = new Image();
                  img.src = _this.gc.canvas.toDataURL();
                  snowflakeImages.push(img);
                  _this.reset();
                }
                break;
              }
            }
          }
        }
      }
    }
  }
}