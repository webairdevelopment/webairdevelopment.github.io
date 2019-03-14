var canvas = document.createElement("canvas"),
  c = canvas.getContext("2d");
var w = canvas.width = window.innerWidth,
  h = canvas.height = window.innerHeight;

document.body.appendChild(canvas);
c.fillStyle = "rgba(30,30,30,1)";
    c.fillRect(0, 0, w, h);

class polygon{
  constructor(x,y,r,np,av,sa){
    this.x = x;
    this.y = y;
    this.r = r;
    this.v = av;
    this.a0 = sa;
    this.np = np;
    this.p = new Array(np);
  }
  calc(x,y){
    if(x && y){
    this.x = x;
    this.y = y;
    }
    for(var i = 0; i < this.np; i++){
      this.p[i] = {
        x: this.x + this.r*Math.cos((i*2*Math.PI/this.np)+this.a0),
        y: this.y + this.r*Math.sin((i*2*Math.PI/this.np)+this.a0)
      };
    }
    this.a0 += this.v;
  }
  show(){
    c.beginPath();
    for(var i = 0; i < this.p.length; i++){
      c.lineTo(this.p[i].x,this.p[i].y);
    }
    c.strokeStyle="white";
    c.lineWidth="0.1";
    c.closePath();
    c.stroke();
    
    // for(var i = 0; i < this.p.length; i++){
    //   if(i%3 == 0){
    //   c.beginPath();
    //   c.rect(this.p[i].x-0.5,this.p[i].y-0.5,1,1);
    //   c.fillStyle="white";
    //   c.fill();
    // }
    // }
  }
}

var poly = [],
    num = 1000,
    x = 0,
    y = 0,
    r = 100,
    np = Math.floor(Math.random()*8)+2,
    sf = 2*Math.floor(Math.random()*3)+2,
    t = 0;

for(var i = 0; i < num; i++){
poly.push(new polygon(w/2,h/2,100+100*Math.cos(i*sf*Math.PI/num),np,0.05,Math.PI/2+i*Math.PI*4/num));
}

function draw() {
  r = 100*Math.cos(t);
  for(var i = 0; i < num; i++){
    x = w/2+r*Math.cos(i*2*Math.PI/num);
    y = h/2+r*Math.sin(i*2*Math.PI/num);
  poly[i].calc(x,y);
  poly[i].show();
  }
t += Math.PI*2/(num);
}

var mouse = {
  x: w / 2,
  y: h / 2
};
var last_mouse = {
  x: 0,
  y: 0
};

canvas.addEventListener(
  "mousemove",
  function(e) {
    last_mouse.x = mouse.x;
    last_mouse.y = mouse.y;

    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
  },
  false
);

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
    c.fillStyle = "rgba(30,30,30,1)";
    c.fillRect(0, 0, w, h);
    draw();
  }, 1000 / 60);

}

window.addEventListener('resize', function() {
  w = canvas.width = window.innerWidth,
    h = canvas.height = window.innerHeight;
  c.fillStyle = "rgba(30,30,30,1)";
  c.fillRect(0, 0, w, h);
});

loop();