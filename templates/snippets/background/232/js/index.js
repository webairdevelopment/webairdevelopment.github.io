snowStorm.followMouse = false;
snowStorm.snowStick = false;
snowStorm.flakesMax = 60;
snowStorm.flakesMaxActive = 60;
snowStorm.useMeltEffect = false;
snowStorm.useTwinkleEffect = false;

var stick = document.querySelector('.stick');
var log = document.querySelector('.tio');
var poopChute = document.querySelector('.poop-chute');

var ticking = false;
window.addEventListener('mousemove', function (e) {
  if (ticking) {
    return;
  }
  ticking = true;
  requestAnimationFrame(function () {
    stick.style.top = e.clientY - stick.clientHeight * 0.33 + 'px';
    stick.style.left = e.clientX + stick.clientHeight * 0.66 + 'px';
    ticking = false;
  });
});

var whacking = false;
window.addEventListener('click', function (e) {
  if (whacking) {
    return;
  }
  ticking = true;
  whacking = true;

  stick.classList.add('stick--active');

  var handleWhackEnd = function handleWhackEnd() {
    stick.classList.remove('stick--active');
    ticking = false;
    whacking = false;
    stick.removeEventListener('transitionend', handleWhackEnd);
    handleWhackLog(e.clientX, e.clientY);
  };

  stick.addEventListener('transitionend', handleWhackEnd);
});

function handleWhackLog(x, y) {
  var elementAtPoint = document.elementFromPoint(x, y);
  if (log.contains(elementAtPoint)) {
    shitGifts();
  }
}

var poopTypes = ['🎁', '💩', '🍬', '🎉'];
function shitGifts() {
  var giftCount = Math.floor(Math.random() * 15 + 10);
  var poops = Array(giftCount).
  fill().
  map(function () {
    var el = document.createElement('div');
    el.classList.add('poop');
    el.innerText = poopTypes[Math.floor(Math.random() * poopTypes.length)];
    return el;
  });
  poops.forEach(function (el) {
    poopChute.appendChild(el);
  });
  setTimeout(function () {
    poops.forEach(function (el, i) {
      var rotation = Math.floor(Math.random() * 45) * (i % 2 === 0 ? 1 : -1);
      var distance = 200 + Math.floor(Math.random() * 100) * (i % 2 === 0 ? 1 : -1);
      var transform = 'rotate(' + rotation + 'deg) translateX(' + distance + 'px)';
      el.style.transform = transform;
      el.style.opacity = 0;
      el.addEventListener('transitionend', function (e) {
        if (e.propertyName === 'opacity') {
          el.remove();
        }
      });
    });
  }, 0);
}