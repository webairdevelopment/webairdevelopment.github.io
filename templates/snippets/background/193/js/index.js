var gc = new GameCanvas();
var perlin = new Perlin("random seed");

var snowglobe = new Snowglobe(width / 2, height * 2 / 3, height / 4);

function loop() {
  clearScreen();
  snowglobe.update();
  snowglobe.render();
}

function OnMouseDown() {
  snowglobe.shake();
}

function Snowglobe(x, y, radius) {
  var _this = this;
  this.startX = x;
  this.x = x;
  this.y = y;
  this.radius = radius;
  
  this.timer = 0;
  this.flyDuration = 1;
  
  this.canShake = true;
  
  this.snowParticles = [];
  for (var i = 0; i < 300; i++) {
    var p = randomUnitCircle();
    this.snowParticles.push(new SnowParticle(this.x + p.x * this.radius * 0.9, this.y + p.y * this.radius * 0.9, Math.random() * 2 + 2));
  }
  
  this.glassGrad = gc.ctx.createRadialGradient(this.x, this.y, this.radius * 0.25, this.x, this.y, this.radius * 1);
  this.glassGrad.addColorStop(0, "rgba(100, 100, 100, 0.3)");
  this.glassGrad.addColorStop(1, "rgba(255, 255, 255, 0.5)");
  
  this.snowman = new Image();
  this.snowman.src = createSnowman();
  
  this.render = function() {
    gc.ctx.beginPath();
    gc.ctx.save();
    gc.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    gc.ctx.clip();
    
    //Snow
    gc.ctx.beginPath();
    gc.ctx.fillStyle = "white";
    gc.ctx.moveTo(this.x - this.radius * 1.5, this.y + this.radius);
    gc.ctx.quadraticCurveTo(this.x, this.y, this.x + this.radius * 1.5, this.y + this.radius);
    gc.ctx.lineTo(this.x + this.radius, this.y + this.radius * 2);
    gc.ctx.lineTo(this.x - this.radius, this.y + this.radius * 2);
    gc.ctx.closePath();
    gc.ctx.fill();
    
    gc.ctx.drawImage(this.snowman, this.x - this.radius, this.y - this.radius);
    
    gc.ctx.restore();
    
    for (var i = 0; i < this.snowParticles.length; i++) {
      var p = this.snowParticles[i];
      p.render();
    }
    
    circle(this.x, this.y, this.radius, this.glassGrad);
    polygon([{x: this.x - this.radius * 0.75, y: this.y + this.radius * 0.7},
             {x: this.x + this.radius * 0.75, y: this.y + this.radius * 0.7},
             {x: this.x + this.radius * 0.9, y: this.y + this.radius * 1.2},
             {x: this.x - this.radius * 0.9, y: this.y + this.radius * 1.2}], "brown");
    
    polygon([{x: this.x - this.radius * 0.5, y: this.y + this.radius * 0.8},
             {x: this.x + this.radius * 0.5, y: this.y + this.radius * 0.8},
             {x: this.x + this.radius * 0.55, y: this.y + this.radius * 1.1},
             {x: this.x - this.radius * 0.55, y: this.y + this.radius * 1.1}], "gold");
    
    text("Tap me!", this.x, this.y + this.radius, this.radius * 0.13, "black", {alignText: "center", fontFamily: "Charm"});
  }
  
  this.update = function() {
    for (var i = 0; i < this.snowParticles.length; i++) {
      var p = this.snowParticles[i];
      p.update();
    }
    
    this.timer++;
    this.flyDuration -= 0.0025;
    if (this.flyDuration <= 0)
      this.flyDuration = 0;
  }
  
  this.shake = function() {
    if (this.canShake) {
      this.canShake = false;
      this.flyDuration = 1;
      
      for (var i = 0; i < this.snowParticles.length; i++) {
        var p = this.snowParticles[i];
        p.vx = Math.random() * 8 - 4;
        p.vy = Math.random() * 8 - 4;
        
        if (distance(p.x, p.y, this.x, this.y) > this.radius) {
          p.x += (this.x - p.x) * 0.1;
          p.y += (this.y - p.y) * 0.1;
        }
      }

      var t = 0;
      shakeLoop();
      function shakeLoop() {
        if (!_this.canShake) {
          _this.x = _this.startX + Math.sin(t * 0.3) * 40;
          t++;
          requestAnimationFrame(shakeLoop);
        }
        else {
          _this.x = _this.startX;
        }
      }

      setTimeout(function() {
        _this.canShake = true;
      }, 1000);
    }
  }
  
  function createSnowman() {
    var canvas = document.createElement("canvas");
    var tgc = new GameCanvas(canvas, _this.radius * 2, _this.radius * 2, {globalFunctions: false});
    
    var x = tgc.width / 2;
    var y1 = tgc.height / 2 + _this.radius * 0.35;
    var y2 = y1 - _this.radius * 0.25 * 1.3;
    var r1 = _this.radius * 0.2 * 1.3;
    var r2 = _this.radius * 0.15 * 1.3;
    
    tgc.polygon([{x: x - r2 * 0.5, y: y2 - r2},
             {x: x - r2 * 0.75, y: y2 - r2 * 2},
             {x: x + r2 * 0.75, y: y2 - r2 * 2},
             {x: x + r2 * 0.5, y: y2 - r2}], "rgb(0, 0, 50)");
    tgc.ellipse(x, y2 - r2 * 0.9, r2, r2 * 0.5, "darkblue");
    
    var c1 = tgc.ctx.createRadialGradient(x, y1, r1 * 0.25, x, y1, r1);
    var c2 = tgc.ctx.createRadialGradient(x, y2, r2 * 0.25, x, y2, r2);
    c1.addColorStop(0, "rgb(230, 230, 255)");
    c1.addColorStop(1, "rgb(150, 150, 200)");
    c2.addColorStop(0, "rgb(230, 230, 255)");
    c2.addColorStop(1, "rgb(150, 150, 200)");
    tgc.circle(x, y1, r1, c1);
    tgc.circle(x, y2, r2, c2);
   
    tgc.circle(x, y1, r1 * 0.1, "black");
    tgc.circle(x, y1 - r1 * 0.3, r1 * 0.1, "black");
    
    tgc.circle(x - r2 * 0.3, y2 - r2 * 0.1, r2 * 0.1, "black");
    tgc.circle(x + r2 * 0.3, y2 - r2 * 0.1, r2 * 0.1, "black");
    
    return tgc.canvas.toDataURL();
  }
  
  function randomUnitCircle() {
    var a = Math.random() * Math.PI * 2;
    var l = Math.random();
    return {
      x: Math.cos(a) * l,
      y: Math.sin(a) * l
    }
  }
  
  function SnowParticle(x, y, radius) {
    this.x = x;
    this.y = y;
    this.vx = Math.random() * 8 - 4;
    this.vy = Math.random() * 8 - 4;
    this.radius = radius;
    
    this.render = function() {
      circle(this.x, this.y, this.radius, "white");
    }
    
    this.update = function() {
      var distToCenter = distance(this.x, this.y, _this.x, _this.y);
      
      this.vx += (perlin.noise(this.x / 100, this.y / 100, _this.timer / 100) * 0.5 - 0.25) * _this.flyDuration;
      this.vy += (perlin.noise(this.x / 100, this.y / 100, (_this.timer + 100) / 100) * 0.5 - 0.25) * _this.flyDuration;
      
      this.vy += 0.03;
      
      this.x += this.vx * 0.3;
      this.y += this.vy * 0.3;
      
      if (distToCenter > _this.radius) {
        var a = getAngle(this.x, this.y, _this.x, _this.y);
        this.x = _this.x + Math.cos(a + (_this.flyDuration >= 0.1 ? 0 : Math.PI)) * (_this.radius - 1);
        this.y = _this.y + Math.sin(a + (_this.flyDuration >= 0.1 ? 0 : Math.PI)) * (_this.radius - 1);
      }
      
      this.vx *= 0.999;
      this.vy *= 0.999;
    }
  }
}