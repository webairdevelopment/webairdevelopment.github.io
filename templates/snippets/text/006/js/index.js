const challenge = document.querySelector('.challenge');
const text = challenge.querySelector('h1');
const step = 80;

function shadow(e) {
    const { offsetWidth: width, offsetHeight: height } = challenge;
  if (e.type === 'touchmove') {
      var { clientX: x, clientY: y } = e.touches[0];
    } else {
      var { offsetX: x, offsetY: y } = e;
    }
   if(this !== e.target) {
      x = x + e.target.offsetLeft;
      y = y + e.target.offsetTop;
    }
  
  const xStep = Math.round((x / width * step) - (step / 2));
  const yStep = Math.round((y / height * step) - (step / 2));
  
  text.style.textShadow = `
      ${xStep}px ${yStep * -1}px 0 #F44336,
      ${xStep * -1}px ${yStep}px 0 #FDD835
    `;
  
}

challenge.addEventListener('mousemove', shadow);
challenge.addEventListener('touchmove', shadow);