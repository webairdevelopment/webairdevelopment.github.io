
console.clear();

const input = document.querySelector('input');
const canvas = document.querySelector('.canvas');

document.querySelector('.tools > button').addEventListener('click', e => {
  state.buffer.pop();
  drawBuffer();
});

document.querySelectorAll('.colors button').forEach(button => {
  button.style.backgroundColor = button.dataset.color;
  button.addEventListener('click', e => {
    state.color = button.dataset.color;
  })
});

const state = {
  buffer: [],
  color: input.value,
  size: 4,
  drawing: false
};

const startDraw = e => {
  
  state.drawing = true;
  
  canvas.addEventListener('mouseup', stopDraw);
  canvas.addEventListener('mousemove', draw);
  
  draw(e);
}

const stopDraw = e => {
  canvas.removeEventListener('mouseup', stopDraw);
  canvas.removeEventListener('mousemove', draw);
}

const draw = e => {

	e.preventDefault();
	e.stopPropagation();
  
  const x = round(e.offsetX, state.size) / canvas.offsetWidth;
  const y = round(e.offsetY, state.size) / canvas.offsetHeight;
	const sizeX = (state.size / canvas.offsetWidth);
	const sizeY = (state.size / canvas.offsetHeight);
  const pixel = `linear-gradient(${state.color}, ${state.color}) no-repeat ${x * 100}% ${y * 100}% / ${sizeX * 100}% ${sizeY * 100}%`;

  state.buffer.push(pixel);

  drawBuffer();
};

const drawBuffer = () => {
  canvas.style.background = state.buffer.join(',');
}

canvas.addEventListener('mousedown', startDraw);

input.addEventListener('change', e => {
  state.color = input.value;
});

const round = (value, step) => Math.round((value - (step * .5)) / step) * step;