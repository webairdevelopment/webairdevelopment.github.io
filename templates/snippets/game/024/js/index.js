
const WIDTH = 256;
const HEIGHT = 512;
const CLAW_WIDTH = WIDTH / 5; // max width
const CONSTRAINT_ITERATIONS = 4;
const POSITION_ITERATIONS = 6;
const VELOCITY_ITERATIONS = 4;

const STATE = {
  GRAP: Symbol(`grap item`),
  LIFT: Symbol(`lift up`),
  BACK: Symbol(`claw move back to original place`),
  OPEN: Symbol(`open hand`),
  FALL: Symbol(`release arm`),
  IDLE: Symbol(`accept user input`)
};

const options = {
  arm: {
    boneCount: 20,
    boneWidth: CLAW_WIDTH / 10,
    boneHeight: NaN,
    topBoneX: CLAW_WIDTH / 2,
    controlBoneIndex: 16
  },
  finger: {
    upperBoneWidth: CLAW_WIDTH / 2,
    upperBoneHeight: CLAW_WIDTH / 12,
    lowerBoneWidth: CLAW_WIDTH / 25,
    lowerBoneHeight: CLAW_WIDTH / 2 * 3 / 2
  },
  item: {
    density: 0.001 * 0.6
  },
  collisionFilter: {
    armBones: {
      group: -1,
      category: 0b1000,
      mask: 0b1000
    },
    fingerUpperBones: {
      group: -1,
      category: 0b0100,
      mask: 0b0100
    },
    fingerLowerBones: {
      group: -1,
      category: 0b0001,
      mask: 0b0001
    },
    items: {
      group: 0,
      category: 0b0001,
      mask: 0b0001
    },
    board: {
      group: 0,
      category: 0b0101,
      mask: 0b0101
    }
  },
  speed: {
    lift: HEIGHT / 4,
    fall: 0.1, // friction air
    back: WIDTH / 5,
    move: WIDTH / 100
  },
  render: {
    background: `rgba(0,0,0,0)`,
    finger: {
      upperBone: { fillStyle: `rgba(0,0,0,0.2)` },
      upperBoneJoint: { strokeStyle: `transparent` },
      upperBoneControlConstraint: { strokeStyle: `rgba(0,0,0,0.1)` },
      lowerBone: { fillStyle: `rgba(0,0,0,0.8)` },
      lowerBoneJoint: { strokeStyle: `transparent` },
      lowerBoneControlConstraint: { strokeStyle: `rgba(0,0,0,0.1)` }
    },
    arm: {
      bone: { fillStyle: `rgba(0,0,0,0.1)` },
      boneConstraint: { strokeStyle: `rgba(0,0,0,0.1)` },
      controlConstraint: { strokeStyle: `rgba(0,0,0,0.1)` }
    },
    item: {
      normal: { fillStyle: `hsla(0,100%,50%, 0.6)` }
    },
    board: {
      normal: { fillStyle: `rgba(0,0,0,0.8)` }
    }
  }
};

const app = {
  state: STATE.GRAP,
  maxFallTime: 3.0,
  items: [],
  gained: 0,
  targetGain: 800,
  level: 1,
  onGainItem(item) {
    app.gained += item.area;
    let finished = Math.min(1, app.gained/app.targetGain);
    if (finished == 1) {
      app.gained = 0;
      app.level += 1;
      app.targetGain *= 1.05;
      finished = 0;
    }
    elBg.style.height = `${finished * 100}%`;
    addItems(app, options, 1);
    const lvl = app.level;
    const fin = finished * 100 | 0;
    elLvl.textContent = `${lvl}`;
    elGain.textContent = `${app.gained|0}/${app.targetGain|0}`
    elPct.textContent = `${fin}%`;
  }
};


setup(app, { width: WIDTH, height: HEIGHT });
addBoundaries(app, options);
addItems(app, options, 64);
addClaw(app, options);
regDOMEvents(app);
regMatterEvents(app);
start(app);
app.onGainItem({area:533});

function addBoundaries(app, options) {
  const exitWidth = CLAW_WIDTH * 1.2;
  const thickness = 10;

  const wallLeft = Matter.Bodies.rectangle(
    -thickness / 2,
    HEIGHT / 2,
    thickness,
    HEIGHT,
    {
      isStatic: true,
      collisionFilter: {
        group: options.collisionFilter.armBones.group
      }
    }
  );
  const wallRight = Matter.Bodies.rectangle(
    WIDTH + thickness / 2,
    HEIGHT / 2,
    thickness,
    HEIGHT,
    { isStatic: true }
  );

  const groundWidth = WIDTH - exitWidth;
  const ground = Matter.Bodies.rectangle(
    exitWidth + groundWidth / 2,
    HEIGHT + thickness / 2,
    groundWidth,
    thickness,
    { isStatic: true }
  );

  const borderWidth = WIDTH / 90;
  const borderHeight = HEIGHT / 2;
  const board = Matter.Bodies.rectangle(
    exitWidth + borderWidth / 2,
    HEIGHT - borderHeight / 2,
    borderWidth,
    borderHeight,
    {
      isStatic: true,
      collisionFilter: options.collisionFilter.board,
      render: options.render.board.normal
    }
  );

  Matter.World.add(app.engine.world, [wallLeft, wallRight, ground, board]);
}

function addItems(app, options, count) {
  const items = [];
  for (const i of Array(count).keys()) {
    const r = options.finger.lowerBoneHeight / 2 * (0.5 + Math.random() * 0.5);
    const x = CLAW_WIDTH + r * 2 + Math.random() * (WIDTH - CLAW_WIDTH - r * 2);
    const y = -i * r * 2;
    const item = Matter.Bodies.rectangle(x, y, r, r, {
      collisionFilter: options.collisionFilter.items,
      chamfer: {
        radius: r * (0.15 + Math.random() * 0.2)
      },
      density: options.item.density,
      render: options.render.item.normal
    });
    items.push(item);
  }
  Matter.World.add(app.engine.world, items);
  app.items.push(...items);
}

function regDOMEvents(app) {
  document.body.addEventListener(`keydown`, e => {
    switch (e.code) {
      case `KeyA`:
      case `ArrowLeft`:
        if (app.state !== STATE.IDLE) return;
        _moveClaw(-1);
        break;
      case `KeyD`:
      case `ArrowRight`:
        if (app.state !== STATE.IDLE) return;
        _moveClaw(1);
        break;
      case `KeyS`:
      case `ArrowDown`:
        if (app.state !== STATE.IDLE) return;
        app.state = STATE.FALL;
        break;
    }
  });
}

function regMatterEvents(app) {
  let t0 = 0;
  let scheduleGrapTimer = null;

  Matter.Events.on(app.engine, `tick`, e => {
    if (!t0) {
      t0 = e.timestamp;
      return;
    }
    const dt = (e.timestamp - t0) / 1e3;
    t0 = e.timestamp;

    if (app.state == STATE.GRAP) {
      if (_grap(dt)) {
        app.state = STATE.LIFT;
      }
    } else if (app.state == STATE.LIFT) {
      if (app.armControlConstraint) {
        if (_lift(dt)) {
          app.state = STATE.BACK;
        }
      } else {
        const i = options.arm.controlBoneIndex;
        const controlConstraint = Matter.Constraint.create({
          bodyA: app.armBones[i],
          pointA: { x: 0, y: -0.5 * options.arm.boneHeight },
          bodyB: app.armBones[0],
          render: options.render.arm.controlConstraint
        });
        //console.log(controlConstraint.length, "to be lifted");
        Matter.Composite.add(app.arm, controlConstraint);
        app.armControlConstraint = controlConstraint;
        // reset arm bones friction air
        _setArmBonesFrictionAir(0.0);
      }
    } else if (app.state == STATE.BACK) {
      if (_back(dt)) {
        app.state = STATE.OPEN;
      }
    } else if (app.state == STATE.OPEN) {
      if (_open(dt)) {
        app.state = STATE.IDLE;
      }
    } else if (app.state == STATE.FALL) {
      if (scheduleGrapTimer == null) {
        scheduleGrapTimer = setTimeout(function() {
          app.state = STATE.GRAP;
          scheduleGrapTimer = null;
          app.armControlConstraint = null;
        }, app.maxFallTime * 1e3);
      }
      _setArmBonesFrictionAir(options.speed.fall);
      Matter.Composite.remove(app.arm, app.armControlConstraint);
    }
  });

  Matter.Events.on(app.engine, `tick`, e => {
    // handle item is exited
    for (const item of app.items) {
      if (item.position.y > HEIGHT && item.position.x < CLAW_WIDTH) {
        Matter.World.remove(app.engine.world, item);
        app.items.splice(app.items.indexOf(item), 1);
        app.onGainItem(item);
      }
    }
  });
}

function _setArmBonesFrictionAir(n) {
  for (const bone of app.armBones) {
    bone.frictionAir = n;
  }
}

function _moveClaw(delta) {
  const bone = app.armBones[0];
  const max = WIDTH - options.arm.boneWidth;
  const min = options.arm.boneWidth;
  Matter.Body.setPosition(bone, {
    x: Math.max(
      min,
      Math.min(max, bone.position.x + delta * options.speed.move)
    ),
    y: bone.position.y
  });
}

function _grap() {
  const llc = app.fingerLeft.lowerBoneControlConstraint;
  const rlc = app.fingerRight.lowerBoneControlConstraint;
  llc.length *= 0.7;
  rlc.length *= 0.7;
  return true;
}

function _lift(dt) {
  const dy = options.speed.lift * dt;
  app.armControlConstraint.length -= dy;
  if (app.armControlConstraint.length <= app.armBones[0].position.y) {
    app.armControlConstraint.length = app.armBones[0].position.y;
    return true;
  }
}

function _fall(dt) {
  const dy = options.speed.fall * dt;
  const maxY = options.arm.controlBoneIndex * options.arm.boneHeight;

  app.armControlConstraint.length += dy;

  if (app.armControlConstraint.length >= maxY) {
    app.armControlConstraint.length = maxY;
    return true;
  }
}

function _back(dt) {
  const dx = options.speed.back * dt;
  const bone = app.armBones[0];

  Matter.Body.setPosition(bone, {
    x: bone.position.x - dx,
    y: bone.position.y
  });

  if (bone.position.x <= CLAW_WIDTH / 2) {
    bone.position.x = CLAW_WIDTH / 2;
    return true;
  }
}

function _open(dt) {
  const llc = app.fingerLeft.lowerBoneControlConstraint;
  const rlc = app.fingerRight.lowerBoneControlConstraint;
  llc.length /= 0.7;
  rlc.length /= 0.7;
  return true;
}

function setup(app, { width, height }) {
  // setup engine and render
  app.engine = Matter.Engine.create();
  app.engine.contraintIterations = CONSTRAINT_ITERATIONS;
  app.engine.positionIterations = POSITION_ITERATIONS;
  app.engine.velocityIterations = VELOCITY_ITERATIONS;
  app.render = Matter.Render.create({
    element: elRender,
    engine: app.engine,
    options: {
      width,
      height,
      showDebug: false,
      showVelocity: false,
      wireframes: false,
      background: options.render.background
    }
  });
}

function start(app) {
  Matter.Engine.run(app.engine);
  Matter.Render.run(app.render);
}

function addClaw(app, options) {
  const claw = createClaw(app, options);
  Matter.World.add(app.engine.world, claw);
}

function createClaw(app, options) {
  const claw = Matter.Composite.create();
  const arm = createArm(app, options);
  const hand = createHand(app, options);
  Matter.Composite.add(claw, [arm, hand]);
  return claw;
}

function createArm(app, options) {
  const { boneCount, boneWidth, topBoneX } = options.arm;
  const arm = Matter.Composite.create();
  const bones = [];
  const boneHeight = HEIGHT / (boneCount - 2); // extra N more bone length
  for (const i of Array(boneCount).keys()) {
    const bone = Matter.Bodies.rectangle(
      topBoneX,
      i * boneHeight,
      boneWidth,
      boneHeight,
      {
        collisionFilter: options.collisionFilter.armBones,
        isStatic: i === 0,
        render: options.render.arm.bone
      }
    );
    bones.push(bone);
  }
  app.arm = arm;
  app.armBones = bones;
  options.arm.boneHeight = boneHeight;
  Matter.Composite.add(arm, bones);
  Matter.Composites.chain(arm, 0, 0.5, 0, -0.5, {
    render: options.render.arm.boneConstraint
  });
  return arm;
}

function createHand(app, options) {
  const hand = Matter.Composite.create();
  const fingerLeft = createFingerLeft(app, options);
  const fingerRight = createFingerRight(app, options);
  Matter.Composite.add(hand, [fingerLeft, fingerRight]);
  return hand;
}

function _createFinger(app, options, isRHS) {
  const {
    upperBoneWidth,
    upperBoneHeight,
    lowerBoneWidth,
    lowerBoneHeight
  } = options.finger;
  const lastArmBone = app.armBones[app.armBones.length - 1];
  const finger = Matter.Composite.create();
  //
  // create upper bone, its joint and controlable constraint
  //
  const upperBoneX =
    lastArmBone.position.x + upperBoneWidth * 0.5 * (isRHS ? 1 : -1);
  const upperBoneY = lastArmBone.position.y + options.arm.boneHeight * 0.5;
  const upperBone = Matter.Bodies.rectangle(
    upperBoneX,
    upperBoneY,
    upperBoneWidth,
    upperBoneHeight,
    {
      collisionFilter: options.collisionFilter.fingerUpperBones,
      render: options.render.finger.upperBone
    }
  );
  Matter.Composite.add(finger, upperBone);
  const upperBoneJoint = Matter.Constraint.create({
    bodyA: upperBone,
    pointA: { x: 0.5 * upperBoneWidth * (isRHS ? -1 : 1), y: 0 },
    bodyB: lastArmBone,
    pointB: { x: 0, y: options.arm.boneHeight * 0.5 },
    render: options.render.finger.upperBoneJoint
  });
  Matter.Composite.add(finger, upperBoneJoint);
  const upperBoneControlConstraint = Matter.Constraint.create({
    bodyA: upperBone,
    pointA: { x: 0, y: 0 },
    bodyB: lastArmBone,
    pointB: { x: 0, y: -0.5 * options.arm.boneHeight },
    render: options.render.finger.upperBoneControlConstraint
  });
  Matter.Composite.add(finger, upperBoneControlConstraint);

  //
  // create lower bone, its joint and controlable constraint
  //
  const lowerBoneX = lastArmBone.position.x + upperBoneWidth * (isRHS ? 1 : -1);
  const lowerBoneY = upperBone.position.y + lowerBoneHeight * 0.5;
  const lowerBone = Matter.Bodies.rectangle(
    lowerBoneX,
    lowerBoneY,
    lowerBoneWidth,
    lowerBoneHeight,
    {
      collisionFilter: options.collisionFilter.fingerLowerBones,
      render: options.render.finger.lowerBone
    }
  );
  Matter.Composite.add(finger, lowerBone);
  const lowerBoneJoint = Matter.Constraint.create({
    bodyA: lowerBone,
    pointA: { x: 0, y: -0.5 * lowerBoneHeight },
    bodyB: upperBone,
    pointB: { x: 0.5 * upperBoneWidth * (isRHS ? 1 : -1), y: 0 },
    render: options.render.finger.lowerBoneJoint
  });
  Matter.Composite.add(finger, lowerBoneJoint);
  const lowerBoneControlConstraint = Matter.Constraint.create({
    bodyA: lowerBone,
    pointA: { x: 0, y: 0 },
    bodyB: upperBone,
    pointB: { x: 0, y: 0 },
    render: options.render.finger.lowerBoneControlConstraint
  });
  Matter.Composite.add(finger, lowerBoneControlConstraint);

  //
  // bind useful data to app object
  //
  app[`finger` + (isRHS ? `Right` : `Left`)] = {
    upperBoneJoint,
    upperBoneControlConstraint,
    lowerBoneJoint,
    lowerBoneControlConstraint,
    upperBone,
    lowerBone
  };

  return finger;
}

function createFingerLeft(app, options) {
  return _createFinger(app, options, false);
}

function createFingerRight(app, options) {
  return _createFinger(app, options, true);
}