var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
w = ctx.canvas.width = window.innerWidth;
h = ctx.canvas.height = window.innerHeight;

window.onresize = function() {
  w = ctx.canvas.width = window.innerWidth;
  h = ctx.canvas.height = window.innerHeight;
};

canvas.onclick = function(){
  props = [{}];
  genWaves();
}

// ctx.globalCompositeOperation = "lighter";
props = [{}];
hueRotate = 240;
frames = 0;
frequency = 0.01;
count = 10;
alpha = 0.5;
outlineWidth = 8;
maxAmp = 100;
minAmp = 50;
maxGap = 40;
minGap = 20;
maxSpeed = 1;
minSpeed = 0.3;
document.body.style.background = "hsl("+hueRotate+", 20%, 15%)";

var controls = new function() {
  this.hueRotate = hueRotate;
  this.count = count;
  this.alpha = alpha;
  this.outlineWidth = outlineWidth;
  this.maxAmp = maxAmp;
  this.minAmp = minAmp;
  this.maxGap = maxGap;
  this.minGap = minGap;
  this.maxSpeed = maxSpeed;
  this.minSpeed = minSpeed;
  this.frequency = frequency;
  
  this.redraw = function() {
    hueRotate = controls.hueRotate;
    count = controls.count;
    alpha = controls.alpha;
    outlineWidth = controls.outlineWidth;
    maxAmp = controls.maxAmp;
    minAmp = controls.minAmp;
    maxGap = controls.maxGap;
    minGap = controls.minGap;
    maxSpeed = controls.maxSpeed;
    minSpeed = controls.minSpeed;
    frequency = controls.frequency;
    document.body.style.background = "hsl("+hueRotate+", 20%, 15%)";
  }
}

var gui = new dat.GUI({resizable : false});
//gui.add(controls, "count", 1, 10).step(1).onChange(controls.redraw);
var f1 = gui.addFolder('Visual');
var f2 = gui.addFolder('Values');
f1.add(controls, "hueRotate", 0, 360).step(1).onChange(controls.redraw);
f1.add(controls, "alpha", 0.1, 1).onChange(controls.redraw);
f1.add(controls, "outlineWidth", 0, 20).onChange(controls.redraw);
f2.add(controls, "maxAmp", 50, 300).step(1).onChange(controls.redraw);
f2.add(controls, "minAmp", 10, 100).step(1).onChange(controls.redraw);
f2.add(controls, "maxGap", 30, 80).step(1).onChange(controls.redraw);
f2.add(controls, "minGap", 10, 30).step(1).onChange(controls.redraw);
f2.add(controls, "maxSpeed", 0.5, 2).onChange(controls.redraw);
f2.add(controls, "minSpeed", 0.1, 0.5).onChange(controls.redraw);
f2.add(controls, "frequency", 0.001, 0.05).onChange(controls.redraw);
f1.open();
f2.open();

function genWaves(){
  for (i = 0; i < count; i++) {
    props.push({
      rAmp:    Math.round(Math.random() * (maxAmp - minAmp) + minAmp),
      rAmp1:   Math.random() * (2 - 1) + 1,
      rAmp2:   Math.random() * (2 - 1) + 1,
      rTop:    Math.round(Math.random() * (maxGap - minGap) + minGap),
      rFreq:   frequency,
      rSpeed:  Math.random() * (-maxSpeed + minSpeed) - minSpeed,
      rPhi:    0,
      rFrames: 0,
      rColOff: Math.round(Math.random() * 80 - 40)
    });
  }
}

function drawWave() {
  ctx.filter = "hue-rotate(" + hueRotate + "deg)";
  for (j = 0; j < count; j++) {
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineWidth = outlineWidth;
    ctx.strokeStyle = "#fff";
    ctx.fillStyle = "hsla(" + props[j].rColOff + ", " + ((j*2)+40) + "%, "+((j*2)+40)+"%, "+alpha+")";
    for (var x = 0; x < w; x++) {
      y = Math.cos(x * props[j].rFreq + props[j].rPhi) * props[j].rAmp / props[j].rAmp1 + props[j].rAmp / props[j].rAmp2;
      ctx.lineTo(x, y + props[j].rTop * j);
    }
    ctx.lineTo(w, h);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }
}

function drawFrame() {
  ctx.clearRect(0, 0, w, h);
  for (i = 0; i < count; i++) {
    props[i].rFrames += props[i].rSpeed;
    props[i].rPhi = props[i].rFrames / 30;
  }
  drawWave();
  requestId = requestAnimationFrame(drawFrame);
}

genWaves();
drawFrame();