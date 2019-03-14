const lanes = document.querySelectorAll('.lane');
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const colors = ['#c90e0e', '#c9740d', 'white']

function getRandom(max, min = 0) {
  return Math.floor(Math.random() * (max - min)) + min;
}


function isCardInViewPort(lane) {
  const elemBounds = lane.getBoundingClientRect();
  return (
        elemBounds.top >= 0 &&  elemBounds.top < window.innerHeight + 50 ||
        elemBounds.bottom <= window.innerHeight + 50 &&  elemBounds.bottom > 0
    );
}

function showCards() {
  lanes.forEach(lane => {
    if(isCardInViewPort(lane)) {
      lane.classList.add('lane-displayed'); 
    } else {
      lane.classList.remove('lane-displayed'); 
    }
  });
}


let bgRectangles = [], maxShapes = 10;

function createShape() {
  return {
      x: 0,
      y: getRandom(window.pageYOffset + window.innerHeight, window.pageYOffset),
      stop: Math.floor(Math.random() * canvas.width - 100),
      speed: 40,
      color: Math.floor(Math.random() * 3),
      opacity: 1,
      decay: false,
      decaySpeed: Math.random() * .01 + .001,
      fill: Math.floor(Math.random() * 3)
    }
}

function setupBackground() {
  canvas.width = canvas.parentNode.offsetWidth;
  canvas.height = canvas.parentNode.offsetHeight;
  bgRectangles = [];
  
  
  for(let i=0; i < maxShapes; i++) {
    bgRectangles.push(createShape());
  }
}

function scaleDownSquares() {
  bgRectangles.forEach((shape, index) => {
    if(shape.y > window.pageYOffset + window.innerHeight || shape.y + 100 < window.pageYOffset) {
      shape.decay = true;
      shape.decaySpeed = .1;
    }
  });
}

function updateBackground() {
   bgRectangles.forEach((shape, index) => {
    if(shape.x < shape.stop) { 
      shape.x += shape.speed;
      shape.speed = Math.abs(shape.speed -(shape.speed / (shape.stop - shape.x)));
    }
    
    if(shape.decay) {
      shape.opacity -= shape.decaySpeed;
    }
     
    if(shape.opacity < 0) {
      bgRectangles.splice(index, 1);
      if(bgRectangles.length < maxShapes) {
        bgRectangles.push(createShape());
      }
    }
   });
  
  if(bgRectangles.length > maxShapes) {
    for(let i = 0; i < bgRectangles.length - maxShapes; i++) {
      bgRectangles[i].decay = true;
      bgRectangles[i].decaySpeed = .1;
    }
  }
}

function drawBackground() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  bgRectangles.forEach(shape => {
    if(shape.opacity > 0) {
      context.globalAlpha = shape.opacity;
      
      if(shape.fill === 1) {
        context.fillStyle = colors[shape.color];
context.fillRect(shape.x, shape.y, 100, 100); 
      } else {
        context.lineWidth = 3;
        context.strokeStyle = colors[shape.color];
        context.strokeRect(shape.x, shape.y, 100, 100); 
      }
    }
  });
}

function recyleShape() {
  const random = Math.floor(Math.random() * bgRectangles.length);
    if(bgRectangles[random].x >= bgRectangles[random].stop) {
      bgRectangles[random].decay = true; 
    }
}

function loop() {
  updateBackground();
  drawBackground();
  requestAnimationFrame(loop);
}

window.onload = function() {
  setupBackground();
  
  window.addEventListener('resize', () => {
    setupBackground();
  });
  
  document.addEventListener('scroll', () => {
    showCards();
    bgRectangles.push(createShape());
    scaleDownSquares();
  });
  
  setInterval(() => {
    recyleShape();
  }, 3000);
  
  drawBackground();
  showCards();
  loop();
}