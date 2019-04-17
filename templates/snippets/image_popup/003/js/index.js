
class Viewport {
  constructor(width = 800, height = 600, canvas = "canvas") {
    this.canvas = document.getElementById(canvas);
    this.canvasName = canvas;
    this.context = this.canvas.getContext("2d");
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
  }
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.beginPath();
  }
  init() {
    this.canvas = document.getElementById(this.canvasName);
    this.context = this.canvas.getContext("2d");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.background = "#FFAA00";
    this.canvas.style.border = "1px solid #000000";
  }
}

const viewport = new Viewport(900, 600);
viewport.init();

const renderer = viewport.context;

const width = 20;
const spacing = 5;

class Cube {
  constructor(x, y, z, height) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.height = height;
    this.isShrinking = false;
  }

  setup(values) {
    this.height = values.height;
    this.isShrinking = values.isShrinking;
  }

  renderZ(renderer) {
    const x = this.x * width + spacing * this.x;
    const y = this.y - this.height / 2;

    renderer.fillStyle = "#aaa";
    renderer.fillRect(x, y, width, this.height);

    renderer.fillStyle = "#444";
    renderer.beginPath();
    renderer.moveTo(x, y);
    renderer.lineTo(x + 10, y - 10);
    renderer.lineTo(x + 30, y - 10);
    renderer.lineTo(x + 20, y);
    renderer.closePath();
    renderer.fill();

    renderer.beginPath();
    renderer.fillStyle = "#888";
    renderer.moveTo(x + 20, y);
    renderer.lineTo(x + 20, y + this.height);
    renderer.lineTo(x + 30, y + this.height - 10);
    renderer.lineTo(x + 30, y - 10);

    renderer.closePath();
    renderer.fill();
  }

  setHeight() {
    if (this.isShrinking) {
      this.height -= steps;
      if (this.height < minHeight) this.isShrinking = false;
    } else {
      this.height += steps;
      if (this.height > maxHeight) this.isShrinking = true;
    }
  }
}

const dimension = 21;
const maxHeight = 110;
const minHeight = 10;
const steps = 8;
const minMax = maxHeight - minHeight;
const median = minMax / 2;
const middle = Math.ceil(dimension / 2);

const getInitial = (i, j) => {
  let value1;
  let value2;
  let isShrinking = false;
  value1 = Math.abs(i - middle) * steps;
  value2 = Math.abs(j - middle) * steps;
  let height = Math.abs(maxHeight - (value1 + value2));
  if (value1 + value2 > maxHeight - minHeight) isShrinking = true;
  return { height, isShrinking };
};

const cubes = new Array(dimension);
for (let i = 0; i < dimension; i++) {
  cubes[i] = [];
  for (let j = 0; j < dimension; j++) {
    cubes[i].push(new Cube(j, 0));
    cubes[i][j].setup(getInitial(i, j));
  }
}

const update = () => {
  viewport.clear();
  renderer.save();
  renderer.translate(325, 100);
  for (let i = 0; i < dimension; i++) {
    for (let j = 0; j < dimension; j++) {
      cubes[i][j].setHeight();
      cubes[i][j].renderZ(renderer);
    }
    renderer.translate(-15, 17.5);
  }
  renderer.restore();
};

setInterval(() => update(), 1000 / 24);