class Arm {
  constructor(x, y, length, thickness, angle, parent=null) {
    this.x = x;this.y = y;
    this.length = length;this.angle = angle;
    this.parent = parent;
    this.thickness = thickness;
  }
  getEndX() {
    return this.x + Math.cos(this.angle) * this.length;
  }
  getEndY() {
    return this.y + Math.sin(this.angle) * this.length;
  }
  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.getEndX(), this.getEndY());
    ctx.lineWidth = this.thickness;
    ctx.stroke();
  }
  pointAt(x, y) {
    let dy = y - this.y,
        dx = x - this.x;
    this.angle = Math.atan2(dy, dx);
  }
  drag(x, y) {
    this.pointAt(x, y);
    this.x = x - Math.cos(this.angle) * this.length;
    this.y = y - Math.sin(this.angle) * this.length;
    if(this.parent)
      this.parent.drag(this.x, this.y);
  }
}

//////////////////////////////

class ArmSystem {
  constructor(x, y) {
    this.arms = [];
    this.lastarm = null;
    this.x = x;this.y = y;
  }
  addArm(length, thickness) {
    let arm = new Arm(this.x, this.y, length, thickness, -Math.PI/4, this.lastarm);
    if(this.lastarm) {
      arm.x = this.lastarm.getEndX();
      arm.y = this.lastarm.getEndY();      
    }
    this.lastarm = arm;
    this.arms.push(arm);
  }
  drag(x, y) {
    if(this.lastarm)
      this.lastarm.drag(x, y);
  }
  draw() {
    for(let arm of this.arms)
      arm.draw();
  }
  reach(x, y) {
    this.drag(x, y);
    this.update();
  }
  update() {
    for(let arm of this.arms) 
      if(arm.parent) {
        arm.x = arm.parent.getEndX();
        arm.y = arm.parent.getEndY();        
      }else {
        arm.x = this.x;
        arm.y = this.y;
      }
  }

}
///////////////////////////////////////

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

window.addEventListener('resize', function() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  init();
});
var sys1, sys2;
const armsCount = 4;

init = function() {
  sys1 = new ArmSystem(width/7, height);
  sys2 = new ArmSystem(width-width/7, height);
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(227,242,253, 0.8)';  
  ctx.fillStyle = 'black';
  for(var i=0;i<armsCount;++i) {
    sys1.addArm(115-25*i, 25-5*i);
    sys2.addArm(115-25*i, 25-5*i);
  }
}

init();
/////////////
window.addEventListener('click', (e) => {
  ball.dest.x = e.clientX;
  ball.dest.y = e.clientY;
  ball.updateVeloctiy();
});
var ball = {
  x: width/2, 
  y: height/2,
  vx: 8,
  vy: -8,
  dest: {
    x: height,
    y: 0
  },
  radius: 25,
  thickness: 10,
  update: function() {
    this.x += this.vx;this.y += this.vy;
    this.collisionHandling();
  },
  updateVeloctiy: function() {
    let dy = this.dest.y - this.y,
        dx = this.dest.x - this.x,
        ang = Math.atan2(dy, dx);
    this.vx = Math.cos(ang)*8;
    this.vy = Math.sin(ang)*8;
  },
  collisionHandling: function() {
    if(this.x + this.radius+2 >= width || this.x - this.radius-2 <= 0)
      this.vx = -this.vx;
    if(this.y + this.radius+2 >= height || this.y - this.radius-2 <= 0) 
      this.vy = -this.vy;    
  },
  draw: function() {
    ctx.beginPath();
    ctx.lineWidth = this.thickness;
    ctx.arc(this.x, this.y, this.radius, 0, 360, false);
    ctx.stroke();
  }
}
/////////////
draw = () => {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
  ball.update();
  ball.draw();

  sys1.draw();
  sys2.draw();
  sys1.reach(ball.x, ball.y);
  sys2.reach(ball.x, ball.y);
  requestAnimationFrame(draw);
} 
draw();