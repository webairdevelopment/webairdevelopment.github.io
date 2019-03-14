const ELEMENTS = {
  eyes: {current: 2, el: document.getElementById("eyes").children},
  mouth: {current: 0, el: document.getElementById("mouth").children},
  hat: {current: 4, el: document.getElementById("hats").children}
}


const rightEye = document.getElementById("rightEyeZone");
const leftEye = document.getElementById("leftEyeZone");
const rightMouth = document.getElementById("rightMouthZone");
const leftMouth = document.getElementById("leftMouthZone");
const rightHat = document.getElementById("rightHatZone");
const leftHat = document.getElementById("leftHatZone");

function rightMove(e) {
  let currentElement = getCurrentElement(e.target.id);
  
  let currentValue = currentElement.current;
  currentElement.current = getNextElement(currentElement);
  toggleElement(currentElement.el, currentValue, currentElement.current);
}

function leftMove(e) {
  let currentElement = getCurrentElement(e.target.id);
  
  let currentValue = currentElement.current;
  currentElement.current = getPreviousElement(currentElement);
  toggleElement(currentElement.el, currentValue, currentElement.current);
}

function getCurrentElement(id) {
  if(id.includes("Eye"))
    return ELEMENTS.eyes;
  else if(id.includes("Mouth"))
    return ELEMENTS.mouth;
  else
    return ELEMENTS.hat;
}

function getNextElement(from) {
  return from.current < (from.el.length - 3) ? from.current + 1 : 0;
}

function getPreviousElement(from) {
  return from.current > 0 ? from.current - 1 : (from.el.length - 3);
}

function toggleElement(from, previous, current) {
  from[previous].style.display = "none";
  from[current].style.display = "block";
}

rightEye.onclick = rightMove;
leftEye.onclick = leftMove;
rightMouth.onclick = rightMove;
leftMouth.onclick = leftMove;
rightHat.onclick = rightMove;
leftHat.onclick = leftMove;