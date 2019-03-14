
function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}var container = document.querySelector('.container');
var keys = document.querySelectorAll('.key');
var panda = document.querySelector('.panda');
var eyes = document.querySelectorAll('.eye');
var features = document.querySelectorAll('.feature');
var leftear = document.querySelector('.leftear');
var rightear = document.querySelector('.rightear');
var mouth = document.querySelector('.mouth');

var synth = new Tone.Synth();
var gain = new Tone.Gain(0.5);
gain.toMaster();
synth.connect(gain);

var calcValue = function calcValue(mouse, width) {
  return (mouse / width * limit - limit / 2).toFixed(1);
};

var setContainerSize = function setContainerSize() {
  var size = window.innerHeight / 100 * 90;
  if (size > window.innerWidth) {
    size = window.innerWidth / 100 * 90;
  }
  container.style.height = size + 'px';
  container.style.width = size + 'px';
};

setContainerSize();

[].concat(_toConsumableArray(keys)).forEach(function (key) {
  key.addEventListener('mouseover', function () {return sing(key.dataset.note);});
  key.addEventListener('click', function () {return sing(key.dataset.note);});
});

var singTimeout = void 0;
var sing = function sing(note) {
  if (singTimeout) clearTimeout(singTimeout);

  synth.triggerAttackRelease(note, '12n');

  mouth.setAttribute('ry', '10');

  singTimeout = setTimeout(function () {
    mouth.setAttribute('ry', '3');
  }, 300);
};

var resizeTimeout = void 0;
window.addEventListener('resize', function () {
  if (resizeTimeout) window.cancelAnimationFrame(resizeTimeout);
  resizeTimeout = window.requestAnimationFrame(function () {
    setContainerSize();
  });
}, false);

var limit = 15;
var timeout = void 0;
window.addEventListener('mousemove', function (event) {
  if (timeout) window.cancelAnimationFrame(timeout);

  panda.classList.remove('idle');

  timeout = window.requestAnimationFrame(function () {
    var xValue = calcValue(event.x, window.innerWidth);
    var yValue = calcValue(event.y, window.innerHeight);

    [].concat(_toConsumableArray(features)).forEach(function (feature) {
      feature.style.transform = 'translateX(' + xValue + 'px) translateY(' + yValue + 'px)';
    });

    [].concat(_toConsumableArray(eyes)).forEach(function (eye) {
      eye.setAttribute('ry', '7.5');
      eye.style.transform = 'translateX(' + xValue * 2 + 'px) translateY(' + yValue * 2 + 'px)';
    });

    leftear.style.transform = 'translateX(' + -xValue * 0.7 + 'px) translateY(' + -yValue * 0.7 + 'px)';
    rightear.style.transform = 'translateX(' + -xValue * 0.7 + 'px) translateY(' + -yValue * 0.7 + 'px)';
  });
}, false);