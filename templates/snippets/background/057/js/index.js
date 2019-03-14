var canvas = document.createElement("canvas"),
  c = canvas.getContext("2d");
var w = (canvas.width = window.innerWidth),
  h = (canvas.height = window.innerHeight);

document.body.appendChild(canvas);

// c.fillStyle = "rgba(40,15,0,1)";

// c.fillRect(0, 0, w, h);

function root(x, y, s, da, l, it) {
  this.x = x;
  this.y = y;
  this.s = s;
  this.da = da;
  this.it = it;
  this.pr = [];
  this.ligh = l;
  this.move = function() {
    if (this.s > 0) {
    this.ang = Math.random() * Math.PI;
    if (this.da > 0) {
      this.da -= 0.001;
    }
    if (this.da < 0) {
      this.da += 0.001;
    }
    this.x += 0.4 * Math.cos(this.ang + this.da);
    this.y += 0.4 * Math.sin(this.ang + this.da);
    this.s -= 0.004;
      if(this.s <= 1){
    this.ligh += 0.5;
         }
    this.col = "hsl(15,43%," + this.ligh + "%)";
    }
  };
  this.show = function() {
    if (this.s > 0) {
      this.gradient = c.createRadialGradient(
        this.x,
        this.y - this.s,
        0,
        this.x,
        this.y - this.s / 2,
        this.s
      );
      this.gradient.addColorStop(1, "hsla(14,40%,"+this.ligh+"%,0)");
      this.gradient.addColorStop(0.95, "hsla(14,40%,"+this.ligh+"%,0.5)");
      this.gradient.addColorStop(0.6, "hsla(15,40%,"+(this.ligh+5)+"%,0.5)");
      this.gradient.addColorStop(0.2, "hsla(15,40%,"+(this.ligh+26)+"%,0.5)");
      // this.gradient.addColorStop(0.19, "rgb(255,255,255)");

      c.beginPath();
      c.arc(this.x, this.y, this.s, 0, 2 * Math.PI);
      c.fillStyle = this.gradient;
      c.fill();

      if (Math.random() < 0.004 && this.it < 4) {
        this.pr.push(
          new root(
            this.x,
            this.y,
            this.s / 2,
            Math.random() * Math.PI - Math.PI / 2,
            this.ligh,
            this.it + 1
          )
        );
      }
      if (this.pr) {
        for (var i = 0; i < this.pr.length; i++) {
          this.pr[i].move();
          this.pr[i].show();
        }
      }
    }
  };
}

var roots = [];

function draw() {
  if (roots.length < 30) {
    roots.push(new root(Math.random() * w, 0, Math.random() * 10, 0, 27, 0));
  }
  for (var k = 0; k < 10; k++) {
    for (var i = 0; i < roots.length; i++) {
      roots[i].move();
      roots[i].show();
    }
  }
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
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

function loop() {
  setTimeout(function() {
    window.requestAnimFrame(loop);
    // c.fillStyle = "rgba(30,30,30,1)";
    // c.fillRect(0, 0, w, h);
    draw();
  }, 1000 / 60);
}

// window.addEventListener("resize", function() {
//   (w = canvas.width = window.innerWidth),
//     (h = canvas.height = window.innerHeight);
//   // c.fillStyle = "rgba(30,30,30,1)";
//   // c.fillRect(0, 0, w, h);
//   draw();
// });

loop();