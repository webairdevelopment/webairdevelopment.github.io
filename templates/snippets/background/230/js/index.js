var numBouncers=50;
var numRotations=7;
var ySpeed=[];
var y=[];
var rotSlider, bounceSlider;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  x=width/2;
  r=width/numBouncers;
  for(var i=0; i<numBouncers; i++){
    y[i]=height/2;
    ySpeed[i]=0;
  }
  rotSlider=createSlider(1,20,7,1);
  bounceSlider=createSlider(5,100,40,1);
}

function draw() {
  background(0,0,0,0.3);
  textSize(height/10);
  textAlign(CENTER, CENTER);
  fill(0,0,100,0.2);
  text("",width*0.2, height*0.15);
  numRotations=rotSlider.value();
  numBouncers=bounceSlider.value();
  for(var i=0; i<numBouncers; i++){
    var x=(1+i)*width/(numBouncers+1);
    var xCloseToMouse=1-abs(mouseX-x)/width;
    fill(300-abs(ySpeed[i])*3,30+abs(ySpeed[i]),60+abs(ySpeed[i])*6,0.5);
    noStroke();
    for(var j=0; j<numRotations; j++){
      rotateMe(j,numRotations);
      ellipse(x,y[i],r*2*xCloseToMouse);
    }
    var diff=mouseY-y[i];
    strength=0.5-xCloseToMouse*0.4;
    damp=0.99-xCloseToMouse*0.08;
    diff*=strength;
    ySpeed[i]+=diff;
    ySpeed[i]*=damp;
    y[i]+=ySpeed[i];
  }
}

function rotateMe(n,num){
  translate(width/2, height/2);
  rotate(TWO_PI/num);
  translate(-width/2, -height/2);
}