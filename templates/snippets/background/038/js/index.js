var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
w = ctx.canvas.width = window.innerWidth;
h = ctx.canvas.height = window.innerHeight;

var resizeTimer;
vx = 3; vm = 0; ft = 0;

window.onresize = function() {
  w = ctx.canvas.width = window.innerWidth;
  h = ctx.canvas.height = window.innerHeight;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    render();
  }, 200);
};

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function render() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  ft==1?hueStart=rnd(0, 360):hueStart=230; ft=1;
  var triSide = rnd(28,34);
  var halfSide = triSide / 2;
  var rowHeight = Math.floor(triSide);//triSide*.866
  var columns = Math.ceil(w / triSide) + 1;
  var rows = Math.ceil(h / rowHeight);

  var col, row;
  for (row = 0; row < rows; row++) {
    var hue = hueStart + row * 4;

    for (col = 0; col < columns; col++) {
      var xo = Math.random()*(vx-vm)+vm;
      var yo = Math.random()*(vx-vm)+vm;
      
      var x = col * triSide;
      var y = row * rowHeight;
      var clr;

      row%2!=0?x-=halfSide:0;
      
      var li = rnd(0+(col*.2), 5+(col*.8));
      var grd = ctx.createLinearGradient(x-(xo*col),y-(yo*col),x - halfSide,y + rowHeight);
      grd.addColorStop(1, "hsl(" + hue + ", 30%, " + li + "%)");
      grd.addColorStop(0, "hsl(" + (hue+50) + ", 70%, " + li + "%)");
      ctx.fillStyle = grd;
      ctx.strokeStyle = "#000";
      ctx.beginPath();
      ctx.moveTo(x-(xo*col), y-(yo*col));
      ctx.lineTo(x + halfSide, y + rowHeight);
      ctx.lineTo(x - halfSide, y + rowHeight);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      var grd2 = ctx.createLinearGradient(x-(xo*col),y-(yo*col),x + halfSide,y + rowHeight);
      grd2.addColorStop(1, "hsl(" + hue + ", 30%, " + li + "%)");
      grd2.addColorStop(0, "hsl(" + (hue+50) + ", 70%, " + li + "%)");
      ctx.fillStyle = grd2;
      ctx.strokeStyle = "#000";
      ctx.beginPath();
      ctx.moveTo(x-(xo*col), y-(yo*col));
      ctx.lineTo(x + triSide, y);
      ctx.lineTo(x + halfSide, y + rowHeight);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }
}
render();
canvas.addEventListener("click", render);