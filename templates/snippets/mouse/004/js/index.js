function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}var canvas = document.querySelector('.js-canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

var mouseX = width / 2;
var mouseY = height / 2;

var circle = {
  radius: 10,
  lastX: mouseX,
  lastY: mouseY };


var elems = [].concat(_toConsumableArray(document.querySelectorAll('[data-hover]')));

function onResize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function render() {
  circle.lastX = lerp(circle.lastX, mouseX, 0.25);
  circle.lastY = lerp(circle.lastY, mouseY, 0.25);

  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.arc(circle.lastX, circle.lastY, circle.radius, 0, Math.PI * 2, false);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.closePath();

  requestAnimationFrame(render);
}

function init() {
  requestAnimationFrame(render);

  window.addEventListener('mousemove', function (e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
  });

  window.addEventListener('resize', onResize, false);

  var tween = TweenMax.to(circle, 0.25, {
    radius: circle.radius * 3,
    ease: Power1.easeInOut,
    paused: true });


  elems.forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      tween.play();
    }, false);
    el.addEventListener('mouseleave', function () {
      tween.reverse();
    }, false);
  });
}

function lerp(a, b, n) {
  return (1 - n) * a + n * b;
}

init();