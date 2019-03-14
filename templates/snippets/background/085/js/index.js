var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style = "position:absolute;top:0px;left:0px;background-color:black;";
document.body.style = "overflow:hidden;background-color:black";
document.body.appendChild(canvas);
var charges = [];
class PointCharge {
  constructor(x, y, q, r) {
    this.x = x;
    this.y = y;
    this.q = q;
    this.r = r;
    charges.push(this);
    var lines=4;
    //if (q > 0) 
    {
      for (var i = 0; i < Math.abs(this.q) * lines; i++) {
        var theta = Math.PI * 2 * (i+(q>0)/2) / (Math.abs(q) * lines);
        new Tracer(x + Math.cos(theta) * r, y + Math.sin(theta) * r, q);
      }
    }
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fillStyle = `hsla(${240 * (this.q > 0)},${Math.floor(
      100 * (1 - 1 / (Math.abs(this.q) / 16 + 1))
    )}%,50%,1)`;
    ctx.fill();
  }
}
var tracers = [];
class Tracer {
  constructor(x, y, c) {
    this.x = x;
    this.y = y;
    this.q = 1 - 2 * (c < 0);
    tracers.push(this);
    this.moving = true;
  }
  move(step, ctx) {
    var vect = [0, 0];
    for (var i = 0; i < charges.length; i++) {
      var q = charges[i];
      var rr = (this.x - q.x) ** 2 + (this.y - q.y) ** 2;
      if (rr <= q.r ** 2 && q.q * this.q < 0) {
        this.moving = false;
        return;
      }
      var r = rr ** 0.5;
      vect[0] += this.q * q.q / rr * (this.x - q.x) / r;
      vect[1] += this.q * q.q / rr * (this.y - q.y) / r;
    }
    var mag = (vect[0] ** 2 + vect[1] ** 2) ** 0.5;
    vect[0] /= mag;
    vect[1] /= mag;
    var oldX=this.x;
    var oldY=this.y;
    this.x += vect[0] * step;
    this.y += vect[1] * step;
    if(this.x>0&&
       this.x<canvas.width&&
       this.y>0&&
       this.y<canvas.height)
      {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.strokeStyle = "hsl(0,0%,100%)";
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
      }
  }
  static clear() {
    tracers = [];
  }
  static drawAll(step, ctx) {
    for (var i = 0; i < tracers.length; i++) {
      if (tracers[i].moving) {
        tracers[i].move(step, ctx);
      }
    }
  }
}
for (var i = 0; i < canvas.width * canvas.height / 128**2; i++) {
  var charge = 1 + Math.floor(Math.random() * 8);
  for (var ii = -1; ii <= 1; ii += 2) {
    var q = new PointCharge(
      canvas.width * Math.random(),
      canvas.height * Math.random(),
      charge * ii,
      4
    );
    q.draw(context);
  }
}
setInterval(function() {
  Tracer.drawAll(.25, context);
  for(var i=0;i<charges.length;i++)
      {
      charges[i].draw(context);
      }
}, 1);