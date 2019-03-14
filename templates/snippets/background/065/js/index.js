var pa;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pa=new PhylotaxisArray(height*0.65, height*0.045);
}

function draw() {
  background(200,128,128);
  pa.show();
}

function PhylotaxisArray(rMax,c){
  var ang=radians(137.5);
  var r=0;
  var n=1;
  var speakers=[];
  var a=0;
  while(r<rMax){
    r=c*sqrt(n);
    speakers.push(new Speaker(width/2+cos(a)*r, height/2+sin(a)*r, r, c*1.5));
    a+=ang;
    n++;
  }
  speakers.reverse();
  
  this.show=function(){
    speakers.forEach(function(speaker){
      speaker.show(n);
    });
  };
}

function Speaker(x,y,r,s){
  
  this.show=function(){
    var n=noise((frameCount+(height/2-r)/10)/5);
    push();
    translate(x,y);
    fill(40+n*40);
    scale(0.7+(height/2)/(10*r)+n/3);
    stroke(100);
    strokeWeight(s/12);
    ellipse(0,0,s);
    noStroke();
    fill(80);
    arc(0,0,s*0.9,s*0.9,PI*0.6, PI*0.9);
    fill(20,100);
    arc(0,0,s*0.9,s*0.9,-PI*0.7, PI*0.20);
    fill(20);
    arc(0,0,s*0.9,s*0.9,-PI*0.4, -PI*0.1);
    scale(1+n*2);
    strokeWeight(s/30);
    stroke(100);
    fill(0);
    ellipse(0,0,s/4);
    stroke(180);
    noFill();
    arc(0,0,s/8,s/8,-PI*0.4,-PI*0.1);
    pop();
  };
}