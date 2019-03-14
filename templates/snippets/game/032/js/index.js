
let dinoOriginal = document.querySelector('.dino--original');
let fieldEl = document.querySelector('.field');
let scoreEl = document.querySelector('.score');
let startEl = document.querySelector('.start');
let timeEl = document.querySelector('.time');
let dinosFrag = document.createDocumentFragment();
let max = 7;
let dinos = [];
let score = 0;
let isTouch = true;
let isRunning = false;
let time = 60;
let timer = null;

function shake() {
  fieldEl.classList.add('shake');
  
  fieldEl.addEventListener('animationend', () => {
    fieldEl.classList.remove('shake');
  });
}

function setTimer() {
  time = 60;
  timeEl.innerText = time;
  
  timer = setInterval(function() {
    time = time - 1;
    timeEl.innerText = time;
    
    if (time <= 0) {
      gameOver();
    }
  }, 1000);
}

function start() {
  for (let i = 0; i < dinos.length; i++) {
    let dinoSVG = dinos[i].querySelector('#Dino');
    dinoSVG.style.transform = 'translateY(80%)';
    dinoSVG.style.animation = 'peeking 5.5s infinite';
    dinoSVG.querySelector('#DeadEyes').style.display = 'none';
    dinoSVG.querySelector('#Tongue').style.display = 'none';
    dinoSVG.querySelector('#AngryEyebrows').style.display = 'none';
    dinoSVG.style.animationDelay = (1000 + (i * 700)) + Math.floor((Math.random() * 4000)) + 'ms'
  }
  
  if (!isRunning) {
    setTimer();
    startEl.classList.add('hide');
    score = 0;
    scoreEl.innerText = score;
    isRunning = true;
  }
}

function gameOver() {
  clearInterval(timer);
  isRunning = false;
  startEl.classList.remove('hide');
  
  for (let i = 0; i < dinos.length; i++) {
    let dinoSVG = dinos[i].querySelector('#Dino');
    dinoSVG.style.transform = 'translateY(80%)';
    dinoSVG.style.animation = 'slowly-peeking 10s infinite';
    dinoSVG.style.animationDelay = (Math.random() * 5000) + 'ms';
  }
}

function init() {
  for (let i = 0; i < max; i++) {
    let dino = dinoOriginal.cloneNode(true);
    let dinoSVG = dino.querySelector('#Dino');
    let dir = [1, -1][Math.floor(Math.random() * 2)];
    let showHorn = (Math.random() * 10) > 5;
    let isGentleman = (Math.random() * 10) > 9;

    dino.querySelector('svg').style.transform = `scaleX(${dir})`;

    dinoSVG.style.animation = 'slowly-peeking 10s infinite';
    dinoSVG.style.animationDelay = (Math.random() * 5000) + 'ms';
    
    dinoSVG.querySelector('#DeadEyes').style.display = 'none';
    dinoSVG.querySelector('#Tongue').style.display = 'none';
    dinoSVG.querySelector('#AngryEyebrows').style.display = 'none';
    dinoSVG.querySelector('#TopHat').style.display = 'none';
    dinoSVG.querySelector('#Monocle').style.display = 'none';

    if (showHorn) {
      dinoSVG.querySelector('#Horn').style.display = 'block';
    } else {
      dinoSVG.querySelector('#Horn').style.display = 'none';
    }
    
    if (isGentleman) {
      dinoSVG.querySelector('#TopHat').style.display = 'block';
      dinoSVG.querySelector('#Monocle').style.display = 'block';
      dinoSVG.querySelector('#Horn').style.display = 'none';
    }

    dino.addEventListener('animationiteration', function(ev) {
      let dir = [1, -1][Math.floor(Math.random() * 2)];
      let showHorn = (Math.random() * 10) > 5;
      let isGentleman = (Math.random() * 10) > 9;

      dino.querySelector('svg').style.transform = `scaleX(${dir})`;
      
      dinoSVG.querySelector('#DeadEyes').style.display = 'none';
      dinoSVG.querySelector('#Tongue').style.display = 'none';
      dinoSVG.querySelector('#AngryEyebrows').style.display = 'none';
      dinoSVG.querySelector('#Eyes').style.display = 'block';
      dinoSVG.querySelector('#TopHat').style.display = 'none';
      dinoSVG.querySelector('#Monocle').style.display = 'none';

      if (showHorn) {
        dinoSVG.querySelector('#Horn').style.display = 'block';
      } else {
        dinoSVG.querySelector('#Horn').style.display = 'none';
      }
      
      if (isGentleman) {
        dinoSVG.querySelector('#TopHat').style.display = 'block';
        dinoSVG.querySelector('#Monocle').style.display = 'block';
        dinoSVG.querySelector('#Horn').style.display = 'none';
      }
    });

    function whack(ev) {
      if (isRunning) {
        let pointsEl = dino.querySelector('.points');
        
        if (dinoSVG.querySelector('#Horn').style.display === 'none') {
          score = score + 60;
          dinoSVG.querySelector('#DeadEyes').style.display = 'block';
          dinoSVG.querySelector('#Tongue').style.display = 'block';
          dinoSVG.querySelector('#Eyes').style.display = 'none';
          
          pointsEl.innerText = '60';
        } else {
          score = score - 20;
          score = Math.max(0, score);
          dinoSVG.querySelector('#AngryEyebrows').style.display = 'block';
          
          pointsEl.innerText = '-20';
          pointsEl.classList.add('points--red');
          
          shake();
        }
        
        pointsEl.classList.add('fadeUp');
        pointsEl.addEventListener('animationend', () => {
          pointsEl.classList.remove('fadeUp');
          pointsEl.classList.remove('points--red');
        });
        
        scoreEl.innerText = score;
      }
    }

    if (isTouch) {
      dinoSVG.addEventListener('touchend', whack);
    } else {
      dinoSVG.addEventListener('click', whack);
    }

    dinosFrag.appendChild(dino);
    dinos.push(dino);
  }

  fieldEl.appendChild(dinosFrag);
  dinoOriginal.remove();
  
  startEl.addEventListener('click', start);
}

window.addEventListener('load', function() {
  isTouch = document.querySelector('html').classList.contains('touch');
  init();
});