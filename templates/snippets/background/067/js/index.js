
var posX = [];
var posY = [];
var offset = [];

var numRings = 10;
var numSteps = 36;

var colors = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  for(var j = 0; j < numRings; j++) {
    posX[j] = [];
    posY[j] = [];
    colors[j] = [];
    
    for(var i = 0; i < numSteps; i++) {
      offset[i] = random(100);
      colors[j][i] = color(random(50, 250), random(100, 150), random(130, 150), 400-((j+1)*50));
    }
  }
   
}

function draw() {
  background(100);
  noFill();
  stroke(240);
  strokeWeight(1);
  
  for(var j = 0; j < numRings; j++) {
    for(var i = 0; i < numSteps; i++) {
      offset[i]+=0.0001;
      //setup coordinates 
      //and change with noise
      posX[j][i] = width/2 + ((j+1)*(noise(offset[i])*50)+60) * cos(radians(i*10));
      posY[j][i] = height/2 + ((j+1)*(noise(offset[i])*50)+60) * sin(radians(i*10));      
    }
  }
  
  // draw the web
  for(var j = 0; j < numRings; j++) {
    beginShape();
    for(var i = 0; i < numSteps; i++) {
      vertex(posX[j][i], posY[j][i]);
    }
    vertex(posX[j][0], posY[j][0]); //close the shape
    endShape();
  }
  
  // draw the shapes
  for(var j = 0; j < numRings; j++) {
    for(var i = 0; i < numSteps; i++) {
      fill(colors[j][i]);
      strokeWeight(j/5);
      stroke(255);
      if(i > 0 && j > 0) {
        beginShape();
        vertex(posX[j][i], posY[j][i]);
        vertex(posX[j][i-1], posY[j][i-1]);
        vertex(posX[j-1][i-1], posY[j-1][i-1]);
        vertex(posX[j-1][i], posY[j-1][i]);
        endShape(CLOSE);
      } else if(i == 0) {
        beginShape();
        vertex(posX[j][i], posY[j][i]);
        vertex(posX[j][numSteps-1], posY[j][numSteps-1]);
        vertex(posX[numRings-1][numSteps-1], posY[numRings-1][numSteps-1]);
        vertex(posX[numRings-1][i], posY[numRings-1][i]);
        endShape(CLOSE);
      }
    }
    
  }
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}