console.clear();
const app = {}
const WORLD_WIDTH = 1000; 
const WORLD_HEIGHT = 1000;

app.engine = Matter.Engine.create();
app.render = Matter.Render.create({
  element: elRender,
  engine: app.engine, 
  options: {
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT
  }
});

app.engine.world.gravity.x = 0;
app.engine.world.gravity.y = 0;


const RATIO = 700/933;
const TOP = 10;
const LEFT = 10;
const COLS = 4;
const ROWS = Math.floor(COLS / RATIO); 
const WIDTH = Math.min(innerWidth)/ 4 /COLS;
const HEIGHT = WIDTH;
const COLGAP = 0;
const ROWGAP = 0;
const STIFFNESS = 0.2;
const DAMPING = 0.9;

const composite = Matter.Composites.stack(LEFT, TOP, COLS, ROWS, COLGAP,ROWGAP, (x, y, c, r,_,i) => {
  const body = Matter.Bodies.rectangle(x, y, WIDTH, HEIGHT, {
    label: `body #${i} @(${r}, ${c})`,
    frictionAir: 0.1
  });
  return body;
})
Matter.World.add(app.engine.world, composite);

const bodies = Matter.Composite.allBodies(composite);

for (const [i, body] of bodies.entries()) {
  const row = (i / COLS | 0);
  const col = (i % COLS);
  if (row > 0) {
    const bodyA = bodies[(row -1) * COLS + col];
    const pointA = {x:0, y:0.5 * HEIGHT};
    const bodyB = body;
    const pointB = {x:0, y:-0.5 * HEIGHT};
    const c = Matter.Constraint.create({bodyA, pointA, bodyB, pointB, stiffness:STIFFNESS,damping:DAMPING});
    Matter.World.add(app.engine.world, c);
  }
  if (col > 0) {
    const bodyA = bodies[row * COLS + col - 1];
    const pointA = {x:0.5*WIDTH, y:0};
    const bodyB = body;
    const pointB = {x:-0.5*WIDTH, y:0};
    const c = Matter.Constraint.create({bodyA, pointA, bodyB, pointB, stiffness:STIFFNESS});
    Matter.World.add(app.engine.world, c);
  }
}

Matter.Engine.run(app.engine);
//Matter.Render.run(app.render);

// prepare dom elms
const elms = [];
const cachedData = new WeakMap();

for (const [i, body] of bodies.entries()) {
  const elm = document.createElement('div');
  elm.classList.add('tile');
  elm.style.backgroundSize = `${COLS*100}% ${ROWS*100}%`
  elm.style.width = `${WIDTH}px`;
  elm.style.height = `${HEIGHT}px`;
  const row = i / COLS | 0;
  const col = i % COLS;
  const data = {
    bgOffsetX: col * 100,
    bgOffsetY: row * 100,
    body: body
  };
  cachedData.set(elm, data);
  elm.style.top = `${body.position.y}px`;
  elm.style.left = `${body.position.x}px`;
  elm.style.backgroundPosition = `${-data.bgOffsetX}% ${-data.bgOffsetY}%`;
  elm.style.transform = `translate(-50%,-50%)`;
  elm.ondragstart = ()=>false;
  elm.ondrop = ()=>false;
  elms.push(elm);
  elDOM.appendChild(elm);
}

// update tiles position and elLayer
Matter.Events.on(app.engine, `tick`, e => {
  for (const [i, body] of bodies.entries()) {
    const elm = elms[i];
    const data = cachedData.get(elm);
    elm.style.top = `${data.body.position.y}px`;
    elm.style.left = `${data.body.position.x}px`;
    elm.style.transform = `translate(-50%,-50%)rotate(${data.body.angle}rad)`;
  }
});


// drag to right at the beginning
const targetBody = bodies[COLS-1];
app.engine.timing.timeScale = 0.1;
Matter.Body.setVelocity(targetBody, {
  x: innerWidth,
  y: innerHeight/2
});


// add moust control
const mouseConstraint = Matter.MouseConstraint.create(app.engine, {
  mouse: Matter.Mouse.create(elWrap)
});
Matter.World.add(app.engine.world, mouseConstraint);