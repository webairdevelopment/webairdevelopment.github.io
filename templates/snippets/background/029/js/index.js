const {Parser, Renderer} = Congra;

const stops = [
  {color:[0,0,0,0]},
  {color:[1,1,1,1]},
  {color:[1,0,0,1]}
];

const data = {
  position: {x:0.5, y:0.5},
};

const gl = Renderer.createContext();
elC.append(gl.canvas);

let sp = 0.8;
let t0 = 0.0;
let t1 = 0.0;
function tick() {
  t0 += sp;
  t1 += 0.111;
  const x = Math.sin(t0) * 0.5 + 0.5;
  data.angle = 0.25 - x * 0.125;
  stops[0].offset = stops[1].offset = x * 0.25;
  stops[1].color[1] = Math.sin(t1) * 0.5 + 0.5;
  stops[2].color[1] = Math.cos(t1) * 0.5 + 0.5;
  data.stops = Parser.purify(stops);
  gl.clear(gl.COLOR_BUFFER_BIT);
  Renderer.render(gl, data);
  setTimeout(tick, 1000/24);
}

tick();