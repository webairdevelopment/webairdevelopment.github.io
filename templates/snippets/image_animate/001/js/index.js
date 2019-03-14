console.clear();
var h1 = document.querySelector('.heartOne');
var _svg1 = document.querySelector('svg.one');
var _svg2 = document.querySelector('svg.two');
var _svg3 = document.querySelector('svg.three');
var _svg4 = document.querySelector('svg#star');
h1.addEventListener('click', function (e) {
  _svg1.classList.toggle('on');
}, false);

_svg2.addEventListener('click', function (e) {
  _svg2.classList.toggle('on');
}, false);

_svg3.addEventListener('click', function (e) {
  _svg3.classList.toggle('on');
}, false);

_svg4.addEventListener('click', function (e) {
  _svg4.classList.toggle('on');
}, false);