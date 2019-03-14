var canvas, stage;

var bar1, bar2, bar3;		// visual of the arms (red, blue, yellow)
var cont1, cont2;		    // container of the blue/yellow, and yellow
var cont, pen, fade;    // Higher-level containers for drawing
var bg, data;           // Pixel access

var res = 1;

var speed = 15,
    speedRange = document.getElementById("speedRange");
speedRange.addEventListener("change", function(event) {
  speed = event.target.value;
}, false);
speedRange.value = speed;

var useCache = true;
document.getElementById("toggleCache").addEventListener("click", function(event) {
  useCache = event.target.checked;
    console.log(useCache);
  if (useCache) {
    cont.cache(0, 0, canvas.width, canvas.height);
  } else {
    cont.uncache();
  }
}, false);

function init() {
  canvas = document.getElementById("testCanvas");

  // create a new stage and point it at our canvas:
  stage = new createjs.Stage(canvas);
  stage.canvas.width = window.innerWidth;
  stage.canvas.height = window.innerHeight;

  // Set up draw image
  var img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = "https://lab.gskinner.com/codepen/lm/20181005_073938.jpg";
  bg = new createjs.Bitmap(img);
  //bg.filters = [new createjs.BlurFilter(20,20,3)];
  img.onload = cacheBackground;
  bg.alpha = 0.5;
  
  // Create arms and containers
  cont1 = new createjs.Container().set({alpha:0});
  bar1 = cont1.addChild(new createjs.Shape());
  cont2 = cont1.addChild(new createjs.Container());
  bar2 = cont2.addChild(new createjs.Shape());
  cont3 = cont2.addChild(new createjs.Container())
  bar3 = cont3.addChild(new createjs.Shape());
  
  bar1.graphics.f("yellow").rr(-2, -2, 104, 4, 2);
  bar2.graphics.f("blue").rr(-2, -2, 104, 4, 2);
  bar3.graphics.f("red").rr(-2, -2, 104, 4, 2);
  cont2.x = 100;
  bar3.x = 100;
  stage.addChild(cont1);
  
  // Main visuals
  cont = new createjs.Container();  
  lp = bar3.localToGlobal(new createjs.Point(90,0));
  pen = new createjs.Shape();
  if (useCache) { cont.cache(0, 0, canvas.width, canvas.height); }
  cont.addChild(pen);
  stage.addChildAt(cont, 1);

  // start the tick and point it at the window so we can do some work before updating the stage:
  createjs.Ticker.timingMode = "raf"
  createjs.Ticker.on("tick", runTicks);
}
function runTicks(event) {
  if (data == null) { return; }
  
  // Shrink the brush
  if (reduce < 1) { reduce = 1; }
  else { reduce *= 0.99; }
  
  pen.graphics.clear();
  for (var i=0; i<speed; i++) {
    tick(event); 
  }  
  if (useCache) { cont.updateCache("source-over"); }
  stage.update(event);
}

function cacheBackground() {  
  var img = bg.image,
      w = img.naturalWidth, h = img.naturalHeight,
      iw = window.innerWidth, ih = window.innerHeight;
  
  if (img == null || w == 0) { 
    console.warn("Bad Image");
    return; 
  }
  
  var s = Math.max(iw/w, ih/h);
  bg.cache(0,0,w,h,s);
  var cache = bg.cacheCanvas;
  data = cache.getContext("2d").getImageData(0,0,cache.width,cache.height).data;
  bg.scale = s*res;
  
  //canvas.width = iw*res;
  //canvas.height = ih*res;
  //canvas.style.width = canvas.width/res + "px";
  //canvas.style.height = canvas.height/res + "px";

  if (useCache && cont.cacheCanvas) {
    cont.updateCache();
  }
  reduce = 500;
  
  cont1.x = iw/2*res;
  cont1.y = ih/2*res;
  cont1.scale = Math.max(window.innerWidth/500*res, window.innerHeight/500*res);
}

var lp = new createjs.Point(),
    h = 0, reduce = 5;
function tick(event) {
  
  // Update rotation for all arms:
  cont1.rotation += 0.5;
  cont1.rotation += Math.sin(h/20);
  cont2.rotation += -1.2;
  cont2.rotation += Math.sin(h/40)*2;
  bar3.rotation += 1.4;
  bar3.rotation -= Math.sin(h/20);

  // calculate the global (stage) position of the end of the third bar,
  var pt = bar3.localToGlobal(100, 0);  
  var color = createjs.Graphics.getHSL((pt.x/canvas.width*360 + (h+=0.05)%360), 100, 50);

  // Get the color under the pen
  var cw=bg.cacheCanvas.width,
      ch=bg.cacheCanvas.height,
      px = Math.max(0, Math.min(stage.canvas.width, pt.x|0)),
      py = Math.max(0, Math.min(stage.canvas.height, pt.y|0))
  p = (py*cw + px) * 4;
  color = createjs.Graphics.getRGB(data[p], data[p+1], data[p+2], 0.4);
  
  // Draw a new line
  if (pen && lp) {
    pen.graphics
      .s(color)
      .ss(Math.abs(Math.sin(h/50)*10 + reduce), "round")
      .mt(lp.x, lp.y)
      .lt(pt.x, pt.y);
    lp.setValues(pt.x, pt.y);
  }
}

init();


/************ Drop ************/
var elem = document.body;
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  elem.addEventListener(eventName, preventDefaults, false)
});
function preventDefaults(event) {
  event.preventDefault();
  return false;  
}

// Over/Out
elem.addEventListener("dragover", handleOver, true)
elem.addEventListener("dragenter", handleOver, true);
function handleOver(event) {
  elem.classList.add("over");
};
//elem.addEventListener("dragleave", handleOut, false);
function handleOut(event) {
  elem.classList.remove("over");
}

// Drop
elem.addEventListener("drop", function(event) {
  handleOut();
  data = null;
  
  var dt = event.dataTransfer;
    file = dt.files[0],
    type = dt.types[0];
  if (type === "image/png" || type === "image/jpg"
       || file == null) { return; }
   var reader = new FileReader();
   reader.onload = function(e) {
     var img = new Image();
     img.src = e.target.result;
     if (img.complete == false) {
       img.addEventListener("load", function() {
         bg.image = img;
          cacheBackground();
       })
     } else {
      bg.image = img;
      cacheBackground();
     }
   };
  reader.readAsDataURL(file);
});