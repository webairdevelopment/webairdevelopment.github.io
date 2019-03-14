//Headline
var h1 = document
  .querySelector('.title');

//Canvas container
var p5div = document
  .querySelector('#p5sketch');

//Canvas size
var w, h;

//Media Query
var mq = 0;
if(w <= 360) mq = 1;
if(h <= 360) mq = 1;
   
//P5.js sketch
var p5sketch = ( p5 ) => {
  
  p5.setup = () => {
    w = p5div.clientWidth;
    h = p5div.clientHeight;
    p5.createCanvas(w,h);
  };
  
  p5.windowResized = () => {
    w = p5div.clientWidth;
    h = p5div.clientHeight;
    
    if(w <= 360) mq = 1;
    if(h <= 360) mq = 1;
    
    p5.resizeCanvas(w,h);
  }

  var pos = [
    {x:0.5, y:0}, 
    {x:0, y:0.5}, 
    {x:1, y:0.5}, 
    {x:0.5, y:1},
    {x:0.5, y:0.5}
  ];
  var rnd = p5.random();
  var t = 0, t0 = 1, step = 10;
  p5.draw = () => {
    p5.clear();
    p5.noFill();

    let colrnd = p5.random();
    if(colrnd > 0.6)
      p5.stroke('#86837A');
    else if(colrnd > 0.7)
      p5.stroke('#FFFF94');
    else
      p5.stroke('#78756C');
  
    let fc = p5.frameCount;
    for(p of pos) {
      for(let i = 0; i < 100; i++) {
        let t1 = 
          p5.sin(i/30*rnd+t)*1.2;
        p5.strokeWeight(t1);
        h1.style.opacity = 1 - t1;

        t += 0.0001;
        if(fc%100 == 0) {
          t0 += 0.1;
          rnd = p5.random();
          step = p5.floor(
            p5.random()*15)+4;
        }

        if(fc%200 == 0) {
          var n = ["0", "1", "0.5"];
          for(p of pos){
            p.x = n[
              p5.floor(p5.random()*3)];
            p.y = n[
              p5.floor(p5.random()*3)];
          }
        }

        p5.ellipse(
          w*p.x,
          h*p.y, 
          (100-i)*step+(mq*100), 
          (Math.floor(fc%t0-i)
            )*step+(mq*100)
        );
      }
    }
  }
}

//P5.js sketch instance
var p5inst = new p5(p5sketch, p5div);