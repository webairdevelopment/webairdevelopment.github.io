function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}var $ = function $(selector) {var startNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;return [].concat(_toConsumableArray(startNode.querySelectorAll(selector)));};
var game = {
  el: document.querySelector('#game'),
  p: $('#game p'),
  start: function start() {
    game.rainbow('none');
    game.build();
    game.oscillator = game.audio.createOscillator();
    game.oscillator.connect(game.audio.destination);
    game.oscillator.frequency.value = 0;
    game.oscillator.start();
  },
  build: function build() {
    for (var i = 0; i < 5; i++) {
      var div = document.createElement('div');
      game.el.appendChild(div);
      for (var j = 0; j < 7; j++) {
        var b = document.createElement('b');
        b.addEventListener('mouseover', game.hover);
        div.appendChild(b);
      }
    }
  },
  colors: ['e33', 'e93', 'ed3', '3b9', '39e', '93e', 'e39'],
  random: function random(array) {
    return parseInt(Math.random() * array.length);
  },
  r: 0,
  hover: function hover(event) {
    game.sound();
    event.target.className = 'invisible';
    setTimeout(function () {
      this.style.visibility = 'hidden';
    }.bind(event.target), 2800);
    if ($('b.invisible', game.el).length === $('b', game.el).length) {
      game.end();
    }
  },
  audio: new AudioContext(),
  sound: function sound() {
    var f = 440 + Math.random() * 440;
    game.oscillator.frequency.value = f;
    setTimeout(function () {
      game.oscillator.frequency.value = 0;
    }, 60);
  },
  music: function music() {
    for (var i = 0; i < 12; i++) {
      setTimeout(function () {
        game.sound();
      }, i * 160);
    }
  },
  fall: function fall() {
    var b = document.createElement('b');
    b.className = 'fall';
    var x = Math.random() * innerWidth * 0.9;
    b.style.left = x + 'px';
    game.el.appendChild(b);
  },
  rainbow: function rainbow(s) {
    for (var i in game.p) {
      game.p[i].style.display = s;
    }
  },
  end: function end() {
    game.rainbow('block');
    for (var i = 0; i < 100; i++) {
      setTimeout(game.fall, i * 12);
    }
    game.music();
    setTimeout(function () {
      $('b', game.el).forEach(function (el) {
        el.remove();
      });
      game.rainbow('none');
      game.build();
    }, 2500);
  } };

game.start();