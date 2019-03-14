var colors = [
'#1a3263',
'#f5564e',
'#fab95b'];


var SQUARE_SIZE = 120;
var container = document.querySelector('#container');

function popSquares(e) {
  var sContainer = document.createElement('div');
  var oldSquareRect = e.target.getBoundingClientRect();
  sContainer.classList.add('square-container');
  sContainer.style.position = 'absolute';
  sContainer.style.top = oldSquareRect.top + e.target.clientHeight / 4 + 'px';
  sContainer.style.left = oldSquareRect.left + e.target.clientWidth / 4 + 'px';
  container.appendChild(sContainer);

  for (var i = 0; i < 4; i++) {
    var s = document.createElement('div');
    s.style.width = e.target.clientWidth / 2 + 'px';
    s.style.height = e.target.clientHeight / 2 + 'px';
    s.style.background = e.target.style.background;
    s.style.position = 'absolute';
    s.onclick = popSquares;

    TweenMax.to(s, 1, {
      x: i % 2 === 0 ? -SQUARE_SIZE : SQUARE_SIZE,
      y: i < 2 ? -SQUARE_SIZE : SQUARE_SIZE,
      background: colors[Math.floor(Math.random() * 3)],
      ease: Bounce.easeOut });


    sContainer.appendChild(s);
  }

  e.target.remove();
}

window.onload = function () {
  var square = document.createElement('div');
  square.style.height = SQUARE_SIZE + 'px';
  square.style.width = SQUARE_SIZE + 'px';
  square.style.position = 'absolute';
  square.style.background = colors[Math.floor(Math.random() * 3)];
  square.id = 'firstSquare';
  square.onclick = popSquares;
  container.appendChild(square);
};