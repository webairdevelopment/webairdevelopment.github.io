let currentValue = 1;
const timeout = 0.5;
const radios = document.querySelectorAll('.swappy-radios input');
const fakeRadios = document.querySelectorAll('.swappy-radios .radio');
const extrasWrapper = document.querySelector('.radio-wrapper');
const countFakesToAppend = fakeRadios.length - 1;

//This next bit kinda sucks and could be improved.
//For simplicity, I'm assuming that the distance between the first and second radios is indicative of the distance between all radios. This will fail if one of the options goes onto two lines.
//I should really move each radio independantly depending on its own distance to its neighbour. Oh well ¯\_(ツ)_/¯
//TODO ^^^
const firstRadioY = document.querySelector('.swappy-radios label:nth-of-type(1) .radio').getBoundingClientRect().y;
const secondRadioY = document.querySelector('.swappy-radios label:nth-of-type(2) .radio').getBoundingClientRect().y;
const indicitiveDistance = secondRadioY - firstRadioY;
//End suckyness :D

//Append the extra (off-screen) radios, above and below the initially visible ones.
let topExtrasDistance = indicitiveDistance;
//Get position of last initiually visible radio, to offset the trailing extras
const lastRadio = extrasWrapper.lastElementChild.querySelector('.radio');
const parentY = extrasWrapper.getBoundingClientRect().y;
const lastRadioY = lastRadio.getBoundingClientRect().y;
const lastRadioPos = lastRadioY - parentY;
let bottomExtrasDistance = indicitiveDistance;
[...Array(countFakesToAppend)].map(() => {  
  extraTopRadio = document.createElement('span');
  extraTopRadio.classList.add('radio', 'not-real');
  const extraBottomRadio = extraTopRadio.cloneNode();
  extraTopRadio.style.cssText = `top: -${topExtrasDistance}px`;
  extraBottomRadio.style.cssText = `top: ${lastRadioPos + bottomExtrasDistance}px`;
  extrasWrapper.appendChild(extraBottomRadio);
  extrasWrapper.insertBefore(extraTopRadio, extrasWrapper.firstChild);
  topExtrasDistance = topExtrasDistance + indicitiveDistance;
  bottomExtrasDistance = bottomExtrasDistance + indicitiveDistance;
});

//Apply CSS delays in JS, so that if JS doesn't load, it doesn't delay selected radio colour change
//I'm applying background style delay here so that it doesn't appear slow if JS is disabled/broken
fakeRadios.forEach(function(radio) {
  radio.style.cssText = `transition: background 0s ${timeout}s;`;
});

//Have to do this bit the long way (i.e. with a <style> element) becuase you can't do inline pseudo element syles
const css = `.radio::after {transition: opacity 0s ${timeout}s;}`
const head = document.head;
const style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode(css));
head.appendChild(style);
//End no-js animation fallbacks.

radios.forEach(function(radio, i) {
  //Add an attr to make finding and styling the correct element a lot easier
  radio.parentElement.setAttribute('data-index', i + 1);
  
  //The meat: set up the change listener!
  radio.addEventListener('change', function() {
    //Stop weirdness of incomplete animation occuring. disable radios until complete.
    temporarilyDisable();

    //remove old style tag
    removeStyles();
    const nextValue = this.parentElement.dataset.index;

    const oldRadio = document.querySelector(`[data-index="${currentValue}"] .radio`);
    const newRadio = this.nextElementSibling;
    const oldRect = oldRadio.getBoundingClientRect();
    const newRect = newRadio.getBoundingClientRect();

    //Pixel distance between previous and newly-selected radios
    const yDiff = Math.abs(oldRect.y - newRect.y);
    
    //Direction. Is the new option higher or lower than the old option?
    const dirDown = oldRect.y - newRect.y > 0 ? true : false;
    
    const css = `
      .radio { 
        animation: move ${timeout}s; 
      }
      @keyframes move {
        0% { transform: translateY(0); }
        100% { transform: translateY(${dirDown ? '-' : ''}${yDiff}px); }
      }
  `;
    appendStyles(css);
    currentValue = nextValue;
  });
});

function appendStyles(css) {
  const head = document.head;
  const style = document.createElement('style');
  style.type = 'text/css';
  style.id = 'swappy-radio-styles'; 
  style.appendChild(document.createTextNode(css));
  head.appendChild(style);
}
function removeStyles() {
  const node = document.getElementById('swappy-radio-styles');
  if (node && node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function temporarilyDisable() {
  radios.forEach((item) => {
    item.setAttribute('disabled', true);
    setTimeout(() => { 
      item.removeAttribute('disabled');
    }, timeout * 1000);
  });
}