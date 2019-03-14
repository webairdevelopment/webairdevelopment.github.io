// init canvas
let canvas = document.createElement("canvas"),
  ctx = canvas.getContext("2d"),
  H = (canvas.height = 540),
  W = (canvas.width = 540);
document.body.appendChild(canvas);
ctx.lineCap = "round";

var bonhommes = [];

class Bonhomme {
  constructor(x, y) {
    this.isAvoiding = false;
    this.loc = new Vector(x, y);
    this.old_loc = new Vector(x, y);
    this.vel = new Vector(0, 0).fromAngle(Util.random(0, TWO_PI));
    this.acc = new Vector(0, 0);
    
    this.top_speed = Util.random(1,3);
    this.length = 150 * Util.random(0.8, 3);
    this.width = 4 * Util.map(this.length,this.length*0.8,this.length*3,2,10);

    this.divisions = Math.round(this.length / 10);

    this.tail = [];
    for (let i = 0; i < this.divisions; i++) {
      this.tail.push(new Vector(x + i * 10, y));
    }
    
    this.size = this.width;
    this.personnal_space = this.size * Util.random(1,2);

    
    
  }
  draw() {
    // ctx.fillStyle = "rgba(0,0,0,1)";
    // ctx.fillCircle(this.tail[0].x, this.tail[0].y, Util.map(this.vel.mag(),0,2,this.size * 0.2,this.size * 1.2));

    this.tail.forEach((t, index) => {
      let target = this.tail.length - 1;
      ctx.lineWidth = this.width * Util.map(Tween.easeInOutQuad(index, 0, target - index, target),0,target,0.4,3);

      if (index > 0) {
        
        if (index % 2 === 1) {
          ctx.strokeStyle = "black";
        } else {
          ctx.strokeStyle = "white";
        }
        
        /*
        ctx.strokeStyle = "hsl(0,0%, "+ -Math.sin((index*1.6) + current * 0.1) * 100+"%)"; 
*/
        ctx.beginPath();
        ctx.moveTo(this.tail[index - 1].x, this.tail[index - 1].y);
        ctx.lineTo(t.x, t.y);
        ctx.stroke();
        ctx.closePath();
      }
    });
  }
  update() {
    
    
    // update head
    this.vel.add(this.acc);
    this.vel.limit(this.top_speed);
    if(this.vel.mag() < 1){
       this.vel.setMag(1);
       }
    this.loc.add(this.vel);
    this.acc.reset();
    // update tail
    this.tail.forEach((t, index) => {
      let other = this.loc;
      let dist  = Util.clamp(t.dist(other),0,100);
      
      let diff_x = (this.loc.x - t.x) * 0.1,
        diff_y = (this.loc.y - t.y) * 0.1;
      if (index > 0) {
        other = this.tail[index - 1];
        dist  = Util.clamp(t.dist(other),0,100);
        diff_x = (this.tail[index - 1].x - t.x) * Util.map(dist,0,100,0,1);
        diff_y = (this.tail[index - 1].y - t.y) * Util.map(dist,0,100,0,1);
      }
      let diff = new Vector(diff_x, diff_y);
      
      t.add(new Vector(diff_x, diff_y));
         

         
    });
    
    // zig zag
    if(!this.isAvoiding){
       
    let amp = Math.sin(current * 0.2) * 1.2;
    let direction = this.loc.angle(this.old_loc);
    direction += Math.PI / 2;
    
    let zig_zag_force = new Vector().fromAngle(direction);
    zig_zag_force.setMag(amp*this.vel.mag());
    this.tail[0].add(zig_zag_force);

    
       }
    
    this.old_loc = this.loc.copy();
  }
  avoid(others) {
    
        let avarage = new Vector(0, 0);
    for (let i = 0; i < others.length; i++) {
      let o = others[i];
      if (this === o) continue;
      
      o.tail.forEach(t=>{
        
        let dist = this.loc.dist(t),
        min_dist = this.personnal_space + o.size;
      if (dist < min_dist) {
        let angle = t.angle(this.loc);
        let avoid_force = new Vector().fromAngle(angle);
        avoid_force.normalize();
        avarage.add(avoid_force);
      }
        
      });
      
    }
    if (avarage.mag() > 0) {
      avarage.setMag(0.1);
      this.addForce(avarage);
      this.isAvoiding = true;
    }else{
      this.isAvoiding = false;
    }
    
    
  }
  follow(others) {
    let avarage = new Vector(0, 0);
    for (let i = 0; i < others.length; i++) {
      let o = others[i];
      if (this === o) continue;
      // don't follow bigger than itself
      if (this.size < o.size) continue;
      let dist = o.loc.dist(this.loc),
        min_dist = this.personnal_space * 1.6 + o.size;
      if (dist < min_dist) {
        let angle = o.loc.angle(this.loc);
        let follow_force = new Vector().fromAngle(angle);
        follow_force.normalize();
        avarage.add(follow_force);
      }
    }
    if (avarage.mag() > 0) {
      avarage.setMag(0.1);
      this.addForce(avarage);
    }
  }
  bound() {
    let bound_force = new Vector(0, 0);
    let ps = this.personnal_space / 2;
    if (this.loc.x < ps) {
      bound_force.x = 0.2;
      this.addForce(bound_force);
    }
    if (this.loc.x > W - ps) {
      bound_force.x = -0.2;
      this.addForce(bound_force);
    }

    if (this.loc.y < ps) {
      bound_force.y = 0.2;
      this.addForce(bound_force);
    }
    if (this.loc.y > H - ps) {
      bound_force.y = -0.2;
      this.addForce(bound_force);
    }
  }
  addForce(force) {
    this.acc.add(force);
  }
}

for (let i = 0; i < 20; i++) {
  let x = Util.random(0, W),
    y = Util.random(0, H);
  bonhommes.push(new Bonhomme(x, y));
}
let current = 0;

function loop() {
  ctx.clearRect(0, 0, W, H);

  bonhommes.forEach(b => {
    b.avoid(bonhommes);
    b.follow(bonhommes);
    b.bound();
  });

  bonhommes.forEach(b => {
    b.draw();
    b.update();
  });
  current = requestAnimationFrame(loop);
}

loop();