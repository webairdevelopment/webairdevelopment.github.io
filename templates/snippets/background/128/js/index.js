var canvas = document.createElement("canvas"),
  c = canvas.getContext("2d");
var w = canvas.width = window.innerWidth,
  h = canvas.height = window.innerHeight;

document.body.appendChild(canvas);

c.fillStyle = "rgba(30,30,30,1)";
c.fillRect(0, 0, w, h);

class fly{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.fx = 0;
    this.fy = 0;
    this.trail = [];
    this.t = 0.5;
  }
  addforce(f,ang){
   this.tfx = f*Math.cos(ang);
   this.tfy = f*Math.sin(ang);
   this.fx += f*Math.cos(ang);
   this.fy += f*Math.sin(ang);
  }
  calc(){
    this.vx += this.fx*this.t;
    this.vy += this.fy*this.t;
    this.x += this.vx*this.t;
    this.y += this.vy*this.t;
    this.trail.push({x: this.x, y: this.y});
    if(this.trail.length > 5){
      this.trail.splice(0,1);
    }
  }
  showforce(){
   c.beginPath();
   c.lineTo(this.x,this.y);
   c.lineTo(this.x+100*this.tfx,this.y+100*this.tfy);
   c.strokeStyle="red";
   c.stroke();
  }
  show(){
    c.beginPath();
    c.arc(this.x,this.y,2,0,2*Math.PI);
    c.fillStyle="#ffeca8";
    c.fill();
    
    c.beginPath();
    for(var i = 0; i < this.trail.length; i++){
      c.lineTo(this.trail[i].x,this.trail[i].y);
    }
    c.strokeStyle="#ffeca8";
    c.stroke();
  }
}

var fl = [],
    x = w/2,
    y = 100;

function draw(){
  
  x = w/2;
  y += 0.5;
  
  c.fillStyle="#000000";
  c.fillRect(w/2-3,100,6,y-100);
  c.fillStyle="grey";
  c.fillRect(w/2-5,y,10,h-y);
  
  c.beginPath();
  c.arc(x,y,5,0,2*Math.PI);
  c.fillStyle="#ffeca8";
  c.fill();
  
  
  if(fl.length < 100 && y < h){
    for(var i = 0; i < 1; i++){
    fl.push(new fly(x,y));
    fl[fl.length-1].addforce(Math.random()*10,Math.random()*(-Math.PI));
    }
  }
  for(var i = 0; i < fl.length; i++){
fl[i].addforce(0.3,Math.PI/2);
fl[i].calc();
//fl[i].showforce();
fl[i].show();
    if(fl[i].y > h){
      fl.splice(i,1);
    }
  }
}

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

function loop() {

  setTimeout(function() {
    window.requestAnimFrame(loop);
    c.fillStyle = "rgba(30,30,30,0.1)";
    c.fillRect(0, 0, w, h);
    draw();
  }, 1000 / 60);

}

window.addEventListener('resize', function() {
  w = canvas.width = window.innerWidth,
    h = canvas.height = window.innerHeight;
  c.fillStyle = "rgba(30,30,30,1)";
  c.fillRect(0, 0, w, h);
  draw();
});

loop();