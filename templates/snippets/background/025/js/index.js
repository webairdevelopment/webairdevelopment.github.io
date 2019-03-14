var config = {
  // shape colors
  shapes: [
  {
    fill: '#f8566a',
    stroke: '' },

  {
    fill: 'transparent',
    stroke: '#f8566a' },

  {
    fill: 'transparent',
    stroke: '#f8566a' }],



  // animation duration
  duration: 1200,

  // option allows you to rotate the second/end path in a way that the points
  // travel the least possible distance during morph, and as an effect the morph
  // animation feel more "natural".
  morph: 60,

  // get more easing functions
  // http://thednp.github.io/kute.js/easing.html
  easing: 'easingQuinticInOut' };


var paths = [
'M709.498 158c-171.062 0-336.86 170.013-414.112 244.508-81.05 78.16-220.906 117.187-220.906 306.215 0 237.322 163.682 598.787 348.781 514.902 126.72-57.429 183.931-99.993 253.844-275.484 54.084-135.757 210.296-193.167 210.296-420.15C887.4 290.672 946.747 158 709.498 158z',
'M819.183 84C603.326 84 394.11 298.645 296.628 392.697 194.353 491.375 17.873 540.649 17.873 779.3c0 299.624 206.546 755.983 440.117 650.075 159.903-72.505 232.096-126.243 320.318-347.805 68.246-171.396 265.365-243.877 265.365-530.448C1043.673 251.499 1118.56 84 819.183 84z',
'M929.557 11C666.76 11 412.049 272.269 293.37 386.75 168.855 506.864-46 566.84-46 857.333c0 364.706 251.46 920.194 535.82 791.281 194.676-88.254 282.567-153.665 389.972-423.354 83.087-208.625 323.07-296.851 323.07-645.67C1202.862 214.883 1294.034 11 929.557 11z'];


var updatePaths = function updatePaths(i) {
  document.querySelector('#heart-path-' + (i + 1)).setAttribute('d', paths[i]);
};

var transform = function transform(params) {var _loop = function _loop(
  i) {
    KUTE.to('#heart-path-' + (i + 1),
    {
      path: paths[i],
      svgTransform: params },
    {
      duration: config.duration,
      easing: config.easing,
      morphIndex: config.morph,
      complete: function complete() {
        if (i === 2) {
          params.callback();
          updatePaths(i);
        }
      } }).

    start();};for (var i = 0; i < 3; i++) {_loop(i);
  }
};

for (var i = 0; i < 3; i++) {
  updatePaths(i);

  var selector = document.querySelector('#heart-path-' + (i + 1));
  var fillColor = config.shapes[i].fill;
  var strokeColor = config.shapes[i].stroke;

  if (fillColor) {
    selector.setAttribute('fill', fillColor);
  }
  if (strokeColor) {
    selector.setAttribute('stroke', strokeColor);
  }
}

var transformParams = [
{
  translate: [-370, -500],
  rotate: 0,
  scale: 1.001,
  callback: function callback() {
    transform(transformParams[1]);
  } },

{
  translate: [390, -180],
  rotate: 110,
  scale: 0.9,
  callback: function callback() {
    transform(transformParams[2]);
  } },

{
  translate: [350, -50],
  rotate: 45,
  scale: 1.3,
  callback: function callback() {
    transform(transformParams[0]);
  } }];



transform(transformParams[0]);