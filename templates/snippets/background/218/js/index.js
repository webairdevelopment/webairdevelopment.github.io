// press 'a' to switch draw mode
console.clear();
const DEBUG_MODE = false;
const app = {
  buffer: { width: 0, height: 0 },
  engine: null,
  render: null, 
  bodies: [],
  vents: [],
  drawFnIndex: 0,
  ctx: null,
  baseSpeed: 0.001,
  drawFns: [drawLine, drawGlow] // custom draw fns
};



//
// main
//
setup(app);
createBodies(app, 4, 4);
createVents(app);
registerEvents(app);
start(app);



function setup(app) {
  app.buffer.width = elcanvas.width;
  app.buffer.height = elcanvas.height;
  app.engine = Matter.Engine.create();
  app.engine.world.gravity.y = 0.0;
  app.engine.world.gravity.x = 0.3;
  if (DEBUG_MODE) {
    const engine = app.engine;
    const element = elwrap;
    const width = app.buffer.width;
    const height = app.buffer.height;
    app.render = Matter.Render.create({ engine, element, options: {width, height} });
  }
  app.ctx = elcanvas.getContext("2d");
  app.baseSpeed = 0.001;
}



function createBodies(app, yy, side) {
  const xx = app.buffer.width / side | 0;
  const bw = app.buffer.width;
  const bh = app.buffer.height;
  
  for (const y of Array(yy).keys()) {
    for (const x of Array(xx).keys()) {
      const body = Matter.Bodies.rectangle(
        side + x * side, 
        side + (bh - y * side)/2 + y * side,
        side, side
      );
      //body.$color_ = `hsla(${240-20+Math.random()*80}deg,50%,50%,1)`;
      app.bodies.push(body);
    }
  }
  Matter.World.add(app.engine.world, app.bodies);
  
  // walls
  const WT = 20; // wall thickness
  Matter.World.add(app.engine.world, [
    Matter.Bodies.rectangle(bw/2, -WT/2, 1e5, WT, {isStatic:true}),
    Matter.Bodies.rectangle(bw/2, bh + WT/2, 1e5, WT, {isStatic:true})
  ]);
}



function createVents(app) {
  const speed = app.baseSpeed;
  const {width, height} = app.buffer;
  app.vents.push({ // mouse
    position: Matter.Vector.create(width * 3/4, height * 1/2),
    force: Matter.Vector.create(speed * -0.3, 0.0),
  });
  app.vents.push({ 
    position: Matter.Vector.create(width * 1/4, height),
    force: Matter.Vector.create(0, speed * -0.5),
  });
  app.vents.push({
    position: Matter.Vector.create(width * 3/4, 0),
    force: Matter.Vector.create(0, speed * 1.0),
  });
}



function registerEvents(app) {
  const {width, height} = app.buffer;
  const {Vector:V, Body:B, Events:E} = Matter;
  
  // Engine Event
  E.on(app.engine, "tick", e => {
    for (const body of app.bodies) {
      if (body.position.x > width) { // recycle overflowed bodies
        B.setPosition(body, V.create(0, body.position.y));
        B.setVelocity(body, V.create(app.baseSpeed,0));
      }
      let force = V.create(0, 0);
      for (const vent of app.vents) {
        const dist = V.magnitude(V.sub(body.position, vent.position));
        force = V.add(force, V.mult(vent.force, 1/dist));
      }
      B.applyForce(body, body.position, force);
    }
    // custom render
    app.drawFns[app.drawFnIndex](app.ctx, app);
  });
  
  
  // Mousemove Event
  const center = Matter.Vector.create(app.buffer.width * 0.5, app.buffer.height * 0.5);
  document.body.addEventListener(`mousemove`, e => {
    const pos = Matter.Vector.create(
      e.clientX / innerWidth * app.buffer.width,
      e.clientY / innerHeight * app.buffer.height
    );
    app.vents[0].position.x = pos.x;
    app.vents[0].position.y = pos.y;
    app.vents[0].force.x = app.baseSpeed * -0.1;
  });
  
  // Keyboard Event :: switch draw fn
  document.body.addEventListener(`keydown`, e => {
    if (e.code === 'KeyA') {
      switchDrawFn(app);
    }
  });
}



function switchDrawFn(app) {
  app.drawFnIndex += 1;
  if (app.drawFnIndex === app.drawFns.length) 
    app.drawFnIndex = 0;
}



function start(app) {
  Matter.Engine.run(app.engine);
  if (DEBUG_MODE) Matter.Render.run(app.render);
}



function drawLine(ctx, app) {
  const ls = 2; // scale 
  const lw = 1;
  ctx.globalCompositeOperation = `source-over`
  ctx.fillStyle = `rgba(255,255,255,0.1)`;
  ctx.fillRect(0,0,app.buffer.width, app.buffer.height);
  
  for (const body of app.bodies) {
    const {x:vx, y:vy} = body.velocity; // * LENGTH_SCALE);
    ctx.beginPath();
    ctx.moveTo(body.position.x, body.position.y);
    ctx.lineTo(body.position.x + vx*vx*ls, body.position.y + vy*vy*ls);
    ctx.lineWidth = lw;
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.stroke();
  }
}



function drawGlow(ctx, app) {
  const ls = 2; // scale 
  const lw = 1;
  ctx.globalCompositeOperation = `source-over`
  ctx.fillStyle = `rgba(0,0,0,0.1)`;
  ctx.fillRect(0,0,app.buffer.width, app.buffer.height);
  ctx.globalCompositeOperation = `lighter`;
  
  for (const body of app.bodies) {
    const {x:vx, y:vy} = body.velocity; // * LENGTH_SCALE);
    ctx.beginPath();
    ctx.moveTo(body.position.x, body.position.y);
    ctx.lineTo(body.position.x + vx*vx*ls, body.position.y + vy*vy*ls);
    ctx.lineWidth = lw;
    ctx.strokeStyle = '#111';
    ctx.stroke();
  }
}