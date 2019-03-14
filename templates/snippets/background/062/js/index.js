var a=0;
var aInc;
var struts=[];
var numStruts=300;
var cObj=1500;
var cView=500;
var cRad=500;
var cCirc;
var strutLen=200;
var strutArcAng;
var numArches=3;
var archStep;
var distToTan;
var thetaOfTan;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cObj=height*4;
  cView=cObj/3;
  cRad=height*1.5;
  aInc=PI/300;
  archStep=numArches*TWO_PI/numStruts;
  cCirc=2*PI*cRad;
  strutArcAng=TWO_PI*strutLen/cCirc;
  for(var i=0; i<numStruts; i++){
    struts.push(new Strut(i, width/2,0,cRad,i*TWO_PI/numStruts,random(-0.6,0.6)));
  }
  distToTan=sqrt(cObj*cObj - cRad*cRad);
  thetaOfTan=atan2(cRad, distToTan);
}

function draw() {
  background(0);
  // draw background struts
  struts.forEach(function(strut){
    if(((a+strut.ca)%TWO_PI)>TWO_PI-thetaOfTan || ((a+strut.ca)%TWO_PI)<PI+thetaOfTan){
      strut.show(a,true);
    }
  });
  // draw foreground struts
  struts.forEach(function(strut){
    if(((a+strut.ca)%TWO_PI)>=PI+thetaOfTan && ((a+strut.ca)%TWO_PI)<=TWO_PI-thetaOfTan){
      strut.show(a,true);
    }
  });
  a=(a+aInc)%TWO_PI;
}

function Strut(index,cx,cy,cr,ca,tilt){
  cr*=random(1,0.95);
  var thickness=random(cRad/100, cRad/30);
  this.ca=ca;
  var tiltEffect=sin(tilt)*strutArcAng;
  this.tiltEffect=tiltEffect;
  
  this.show=function(a,front){
    push();
    translate(cx,cy);
    var xt=cos(a+ca+tiltEffect)*cr;
    var zt=sin(a+ca+tiltEffect)*cr;
    var yt=height/2+abs(sin(index*archStep+tiltEffect)*height*0.6);
    var top=mapPoint(xt,yt,cObj+zt,cView);
    var xb=cos(a+ca)*cr;
    var zb=sin(a+ca)*cr;
    var yb=windowHeight*1.5;
    var bottom=mapPoint(xb,yb,cObj+zb,cView);
    var thick=mapSize(xb,yb,thickness,cObj+zb,cView);
    strokeWeight(thick);
    stroke(255);
    if(((a+ca)%TWO_PI) <PI){
      stroke(128);
    }
    var strength=sin((a+ca)%TWO_PI)/2;
    if(front){
      stroke(100+150-(0.5+strength*150),150-(0.5+strength*150),0);
    } else {
      stroke(255-(0.5+strength*255,0,0));
    }
    line(bottom.x, bottom.y, top.x, top.y);
    pop();
  };
}

function mapSize(x,y,s,z,dV){
  var h=sqrt(x*x+y*y);
  var tanThetaH=h/z;
  var ns=s*(dV*tanThetaH)/h;
  return ns;
}

function mapPoint(x,y,z,dV){
  var tanThetaX=x/z;
  var tanThetaY=y/z;
  var xv=dV*tanThetaX;
  var yv=dV*tanThetaY;
  return {x: xv, y:yv};
}