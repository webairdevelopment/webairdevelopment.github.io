var thb;

function setup() {
  createCanvas(windowWidth,windowHeight);
  thb= new ThemeHairBall(width, height);
}

function draw() {
  background(0);
  thb.run();
}


/*****************************
// ThemeHairBall
//*****************************/

  function ThemeHairBall(w,h){
  // function HairBall(){
    var segs=[];
    var maxSegs=70;
    var segThreshold=7;
    var len=10;
    var segRot;
    var segMaxRot;
    var hairs=[];
    var numHairs=40;
    var a=0;
    var r=h/6;
    var x,y;
    var scrollX=w/2;
    var scrollXInc=-w/100;
    var startA=random(TWO_PI);
    for(var i=0; i<numHairs; i++){
      x=width/2+cos(a)*r;
      y=height/2+sin(a)*r;
      hairs[i]=new Hair(x,y,startA+a);
      a+=2*PI/numHairs;
    }


    this.shutdown=function(){
      hairs=[];
    };

    this.run=function(){
      var prox=0.1;//getProxToRadialCursor(myStartX+w/2);
      stroke(255);
      //b1.display();
      for(var i=0; i<hairs.length; i++){
        hairs[i].display(prox);
        if(abs(hairs[i].getBaseX()-w/2)>=w/4){
          hairs[i]=new Hair(hairs[i].origX, hairs[i].origY, startA+i*2*PI/numHairs);
        }
      }
      fill(100);
      scrollX+=scrollXInc;
      if(scrollX<0) scrollX+=w;

    };

    function Hair(x,y, origA){
      this.origX=x;
      this.origY=y;
      this.x=x;
      this.y=y;
      var sw;
      if(random(10)<7){
        this.col=color(random(150,255),0,0,150);
        sw=4;
      } else {
        this.col=color(255,random(100,200));
        sw=2;
      }
      var noiseBase=random(1);
      var noiseY=random(1);
      var noiseInc=0.01;
      var segs=[];
      var trigger=floor(random(6));
      var numSegs=3;
      var len=h/50;
      var segRot;
      var segMaxRot;
      var s=new Segment2(createVector(100+i*10,100),len,origA);
      segs.push(s);
      for(var i=1; i<numSegs; i++){
        s=new Segment2(createVector(100+i*10,100),len,0);
        segs.push(s);
      }
      segRot=PI/random(100,1000);
      segMaxRot=PI/10;

      this.getBaseX=function(){
        return segs[0].base.x;
      };

      this.display=function(prox){
        stroke(this.col);
        noFill();
        strokeWeight(1+sw*prox*2);
        var pos=createVector(this.x, this.y);
        var a=0;
        //noiseBase+=noiseInc;
        noiseY+=noiseInc;
        beginShape();
        vertex(this.x, this.y);
        var aging;
        for(var i=0; i<segs.length; i++){
          var n=map(noise(noiseBase+i*noiseInc, noiseY),0,1,-segRot, segRot);
          if(prox>0.1){
            segs[i].straighten(prox, i===0?origA:0);
          } 
          segs[i].rotateMe(n);
          if(segs.length>segThreshold){
            if(i>segs.length-segThreshold){
              aging=1;
            }else{
              aging=i/(segs.length-segThreshold);
            }
          }else{
            aging=1;
          }
          //aging=i/segs.length;
          segs[i].update(pos, a, aging);
          vertex(segs[i].tip.x, segs[i].tip.y);
          pos=segs[i].tip;
          a=segs[i].myAngle;
          // segs[i].display(this.col,-w,true);
          // segs[i].display(this.col,0,true);
          // segs[i].display(this.col,0,false);
        }
        endShape();
         // if(prox>0.5){
         //   baseDrift=x-segs[0].base.x;
         //   segs[0].base.x+=baseDrift/20;
         // }
         //   if(frameCount%6==trigger){
         //     addSegBase();
         //   }
         // }
         // addSegEnd();
         if(frameCount%6==trigger) addSegEnd();
         if(segs.length>maxSegs){
           this.x=segs[1].base.x;
           this.y=segs[1].base.y;
           segs[1].myRotation+=segs[0].myRotation;
           segs.shift();
         }
      };

      function addSegEnd(){
        var s=new Segment2(createVector(100+4*10,100),len,0);
        segs.push(s);
      }

      function addSegBase(){
      //    var a=segs[0].myAngle;
          var s=new Segment2(createVector(100*10,100),len,0);
      //    s.myRotation=a;
          segs.unshift(s);
      }
    }

    function Segment2(base, length, startA){
      this.base=base;
      this.seg=createVector(0,length);
      this.tip=p5.Vector.add(this.base,this.seg);
      this.givenAngle=0;
      this.myRotation=startA;
      this.myAngle=0;
      var myRotDir=-1;
      this.mass=0;
      this.vel=0;
      this.acc=0;
      this.hit=false;
      this.thick=1;
      this.fade=255;

      this.straighten=function(force, refA){
        var diff=refA-this.myRotation;
        this.myRotation+=force*diff/20;
      };
      
      
      this.rotateMe=function(a){
        this.myRotation+=a*myRotDir;
      };
      
      this.update=function(pos,angle,dying){
        this.base=pos;
        this.givenAngle=angle;
        this.seg.rotate(-this.myAngle+this.givenAngle+this.myRotation);
        this.tip=p5.Vector.add(this.base,this.seg);
        this.myAngle=this.givenAngle+this.myRotation;
        this.thick+=0.05;
        this.fade=map(dying,0,1, 20,255);
      };
      
      this.display=function(col, offX, scrolling){
        push();
        if(scrolling){
          translate(this.base.x+offX+scrollX, this.base.y);
        } else {
          translate(this.base.x+offX, this.base.y);
        }
        rotate(this.givenAngle);
        rotate(this.myRotation);
        //if(this.hit) stroke(255,0,0); else stroke(255);
        noFill();
        if(!scrolling){
          stroke(this.fade, this.fade);
          strokeWeight(this.thick);
          line(0,0,0,length);
        } else {
          fill(0,this.fade*0.5,this.fade, this.fade/8);
          noStroke();
          strokeWeight(this.thick*2);
          ellipse(0,0,this.thick*10,this.thick*10);
        }
        // if(scrolling){
        //   strokeWeight(this.thick/2);
        // } else {
        //   strokeWeight(this.thick*2);
        // }
        // line(0,0,0,length);
        pop();
      };
      
      this.collide=function(item){
        this.hit=collideLinePoly(this.base.x, this.base.y, this.tip.x, this.tip.y, item);
        //console.log(frameCount+" "+this.hit);
        if(this.hit){
          myRotDir=-myRotDir;
        }
        return this.hit;
      };
    }
  }