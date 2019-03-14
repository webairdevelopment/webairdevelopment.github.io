
// init canvas
let canvas = document.createElement("canvas"),
  ctx = canvas.getContext("2d"),
  H = (canvas.height = 600),
  W = (canvas.width = 600);
document.body.appendChild(canvas);

document.body.addEventListener("mousemove", event => mousemove(event), false);

let cursor = new Vector(W / 3, H / 3);
function mousemove(event) {
  cursor.x = event.pageX - canvas.offsetLeft;
  cursor.y = event.pageY - canvas.offsetTop;
}

let picture = new Image();
picture.src = "https://wackedwacko.github.io/images/image1.png";
picture.onload = function() {
  init();
};

function init() {
  loop();
}
function loop() {
  drawGrid();
  requestAnimationFrame(loop);
}
function drawGrid() {
  let div_x = 10,
    div_y = 8;
  let div_size_x = W / div_x,
    div_size_y = H / div_y;
  let offset_x = Util.map(cursor.x, 0, W, -100, 100),
    offset_y = Util.map(cursor.y, 0, H, -100, 100);
  for (let x = 0; x < div_x; x++) {
    for (let y = 0; y < div_y; y++) {
      let pos_x = x * div_size_x,
        pos_y = y * div_size_y;
      let disp_x = x * 10 + pos_x + offset_x * Math.cos(x),
        disp_y = y * 10 + pos_y + offset_y * Math.sin(y);
      ctx.filter = "blur("+Util.map(Util.clamp(cursor.dist(new Vector(pos_x,pos_y)),200,400),
                                    200,400,0,5)+"px)";
      ctx.globalAlpha = Util.map(Util.clamp(cursor.dist(new Vector(pos_x,pos_y)),200,600),
                                    200,600,1,0.4);
      let s = Util.map(Util.clamp(cursor.dist(new Vector(pos_x,pos_y)),200,600),
                                    200,600,1,2);
      ctx.save();
      ctx.translate(pos_x+div_size_x/2,pos_y+div_size_x/2);
      ctx.scale(s,s);
      ctx.drawImage(
        picture,
        Util.clamp(disp_x, 0, picture.width - div_size_x),
        Util.clamp(disp_y, 0, picture.height - div_size_y),
        div_size_x,
        div_size_y,
        - div_size_x / 2,
        - div_size_y / 2,
        div_size_x,
        div_size_y
      );
      ctx.restore();
    }
  }
}