
var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _templateObject = _taggedTemplateLiteral(['\n  0%,\n  50%,\n  100% {\n    transform: rotate(0);\n  }\n  25% {\n    transform: rotate(-1deg);\n  }\n  75% {\n    transform: rotate(1deg);\n  }\n'], ['\n  0%,\n  50%,\n  100% {\n    transform: rotate(0);\n  }\n  25% {\n    transform: rotate(-1deg);\n  }\n  75% {\n    transform: rotate(1deg);\n  }\n']),_templateObject2 = _taggedTemplateLiteral(['\n  to {\n    stroke-dashoffset: 0;\n  }\n'], ['\n  to {\n    stroke-dashoffset: 0;\n  }\n']),_templateObject3 = _taggedTemplateLiteral(['\n  from {\n    opacity: 0;\n  }\n'], ['\n  from {\n    opacity: 0;\n  }\n']),_templateObject4 = _taggedTemplateLiteral(['\n  0% {\n    opacity: 0\n    transform: translate(0, 0);\n  }\n  15%, 75% {\n    opacity: 1;\n  }\n'], ['\n  0% {\n    opacity: 0\n    transform: translate(0, 0);\n  }\n  15%, 75% {\n    opacity: 1;\n  }\n']),_templateObject5 = _taggedTemplateLiteral(['\n  display: grid;\n  width: 280px;\n  grid-template-columns: repeat(7, 1fr);\n  grid-template-rows: 180px 3rem 200px;\n  grid-gap: 10px 0;\n  align-items: center;\n  @media (min-width: 375px) and (min-height: 660px) {\n    grid-gap: 20px 0;\n    grid-template-rows: 320px 3rem 200px;\n    width: 320px;\n  }\n'], ['\n  display: grid;\n  width: 280px;\n  grid-template-columns: repeat(7, 1fr);\n  grid-template-rows: 180px 3rem 200px;\n  grid-gap: 10px 0;\n  align-items: center;\n  @media (min-width: 375px) and (min-height: 660px) {\n    grid-gap: 20px 0;\n    grid-template-rows: 320px 3rem 200px;\n    width: 320px;\n  }\n']),_templateObject6 = _taggedTemplateLiteral(['\n  cursor: pointer;\n  background: transparent;\n  font-size: 1.25rem;\n  padding: 0;\n  text-align: center;\n  color: ', ';\n  border: 2px solid ', ';\n\n  &:hover {\n    background: rgba(', ', 0.2);\n  }\n\n  &:disabled {\n    background: transparent;\n    opacity: 0.2;\n  }\n'], ['\n  cursor: pointer;\n  background: transparent;\n  font-size: 1.25rem;\n  padding: 0;\n  text-align: center;\n  color: ', ';\n  border: 2px solid ', ';\n\n  &:hover {\n    background: rgba(', ', 0.2);\n  }\n\n  &:disabled {\n    background: transparent;\n    opacity: 0.2;\n  }\n']),_templateObject7 = _taggedTemplateLiteral(['\n  padding: 0 16px;\n  height: 44px;\n'], ['\n  padding: 0 16px;\n  height: 44px;\n']),_templateObject8 = _taggedTemplateLiteral(['\n  display: grid;\n  grid-gap: 2px;\n  grid-template-columns: repeat(4, 44px);\n  grid-template-rows: repeat(4, 44px);\n  grid-column: 1 / -1;\n  align-content: center;\n  justify-content: center;\n  animation: ', ' 0.25s ', 's ease both;\n'], ['\n  display: grid;\n  grid-gap: 2px;\n  grid-template-columns: repeat(4, 44px);\n  grid-template-rows: repeat(4, 44px);\n  grid-column: 1 / -1;\n  align-content: center;\n  justify-content: center;\n  animation: ', ' 0.25s ', 's ease both;\n']),_templateObject9 = _taggedTemplateLiteral(['\n  color: ', ';\n  grid-column: 1 / -1;\n  animation: ', ' 0.25s ', 's ease both;\n  text-align: center;\n  position: relative;\n'], ['\n  color: ', ';\n  grid-column: 1 / -1;\n  animation: ', ' 0.25s ', 's ease both;\n  text-align: center;\n  position: relative;\n']),_templateObject10 = _taggedTemplateLiteral(['\n  font-size: 2rem;\n  line-height: 3rem;\n  height: 3rem;\n  text-align: center;\n  margin: 0 5px;\n  height: 100%;\n  opacity: ', ';\n  transform: translate(calc((280 / 14) * -1px), 0);\n  transition: opacity 0.25s ease;\n  @media (min-width: 375px) and (min-height: 660px) {\n    transform: translate(calc((320 / 14) * -1px), 0);\n  }\n  color: ', ';\n  ', ';\n'], ['\n  font-size: 2rem;\n  line-height: 3rem;\n  height: 3rem;\n  text-align: center;\n  margin: 0 5px;\n  height: 100%;\n  opacity: ', ';\n  transform: translate(calc((280 / 14) * -1px), 0);\n  transition: opacity 0.25s ease;\n  @media (min-width: 375px) and (min-height: 660px) {\n    transform: translate(calc((320 / 14) * -1px), 0);\n  }\n  color: ', ';\n  ', ';\n']),_templateObject11 = _taggedTemplateLiteral(['\n  height: 180px;\n  @media (min-width: 375px) and (min-height: 660px) {\n    height: 320px;\n  }\n  path,\n  circle {\n    animation-fill-mode: forwards;\n    stroke-linejoin: round;\n    stroke-linecap: round;\n    stroke-width: 5px;\n    fill: none;\n    stroke: ', ';\n  }\n'], ['\n  height: 180px;\n  @media (min-width: 375px) and (min-height: 660px) {\n    height: 320px;\n  }\n  path,\n  circle {\n    animation-fill-mode: forwards;\n    stroke-linejoin: round;\n    stroke-linecap: round;\n    stroke-width: 5px;\n    fill: none;\n    stroke: ', ';\n  }\n']),_templateObject12 = _taggedTemplateLiteral(['\n  display: block;\n  grid-column: 1 / -1;\n  text-align: center;\n'], ['\n  display: block;\n  grid-column: 1 / -1;\n  text-align: center;\n']),_templateObject13 = _taggedTemplateLiteral(['\n  transform-origin: 50% 0;\n  animation: ', ' 3s infinite linear paused;\n  ', ';\n'], ['\n  transform-origin: 50% 0;\n  animation: ', ' 3s infinite linear paused;\n  ', ';\n']),_templateObject14 = _taggedTemplateLiteral(['\n  stroke-dashoffset: 400;\n  stroke-dasharray: 400;\n  animation: ', ' 2s 1s ease;\n'], ['\n  stroke-dashoffset: 400;\n  stroke-dasharray: 400;\n  animation: ', ' 2s 1s ease;\n']),_templateObject15 = _taggedTemplateLiteral(['\n  d: path(\'M 100 5 L 100 30\');\n  stroke-dashoffset: 100;\n  stroke-dasharray: 100;\n  animation: ', ' 1s ease;\n'], ['\n  d: path(\'M 100 5 L 100 30\');\n  stroke-dashoffset: 100;\n  stroke-dasharray: 100;\n  animation: ', ' 1s ease;\n']),_templateObject16 = _taggedTemplateLiteral(['\n  stroke-dashoffset: 150;\n  stroke-dasharray: 150;\n  animation: ', ' 1s ease;\n'], ['\n  stroke-dashoffset: 150;\n  stroke-dasharray: 150;\n  animation: ', ' 1s ease;\n']),_templateObject17 = _taggedTemplateLiteral(['\n  d: path(\'M 90 110 L 100 80 L 110 110\');\n  stroke-dashoffset: 300;\n  stroke-dasharray: 300;\n  animation: ', ' 2s ease;\n'], ['\n  d: path(\'M 90 110 L 100 80 L 110 110\');\n  stroke-dashoffset: 300;\n  stroke-dasharray: 300;\n  animation: ', ' 2s ease;\n']),_templateObject18 = _taggedTemplateLiteral(['\n  d: path(\'M 100 70 L 100 120\');\n  stroke-dashoffset: 200;\n  stroke-dasharray: 200;\n  animation: ', ' 1s ease;\n'], ['\n  d: path(\'M 100 70 L 100 120\');\n  stroke-dashoffset: 200;\n  stroke-dasharray: 200;\n  animation: ', ' 1s ease;\n']),_templateObject19 = _taggedTemplateLiteral(['\n  d: path(\'M 96 140 L 100 120 L 104 140\');\n  stroke-dashoffset: 300;\n  stroke-dasharray: 300;\n  animation: ', ' 2s ease;\n'], ['\n  d: path(\'M 96 140 L 100 120 L 104 140\');\n  stroke-dashoffset: 300;\n  stroke-dasharray: 300;\n  animation: ', ' 2s ease;\n']),_templateObject20 = _taggedTemplateLiteral(['\n  animation: ', ' 0.5s 0.25s ease both;\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  opacity: 0;\n  transform: rotate(calc(var(--r) * 1deg)) translate(0, calc(var(--l) * 1px));\n'], ['\n  animation: ', ' 0.5s 0.25s ease both;\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  opacity: 0;\n  transform: rotate(calc(var(--r) * 1deg)) translate(0, calc(var(--l) * 1px));\n']);function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}function _taggedTemplateLiteral(strings, raw) {return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));}var _window = window,React = _window.React,ReactDOM = _window.ReactDOM,styled = _window.styled;var
useEffect = React.useEffect,useState = React.useState;var
render = ReactDOM.render;
var rootNode = document.getElementById('app');

/**
                                                * Keyframes animations used for elements
                                                */
var swing = styled.keyframes(_templateObject);












var draw = styled.keyframes(_templateObject2);




var enter = styled.keyframes(_templateObject3);




var fly = styled.keyframes(_templateObject4);









var Container = styled.div(_templateObject5);













var Button = styled.button(_templateObject6,





function (p) {return p.dark ? '#000' : '#FFF';},
function (p) {return p.dark ? '#000' : '#FFF';},


function (p) {return p.dark ? '0, 0, 0' : '255, 255, 255';});








var NewGameButton = styled(Button)(_templateObject7);




var Options = styled.div(_templateObject8,







enter, function (p) {return p.games > 0 ? 0 : 2;});


var Result = styled.div(_templateObject9,
function (p) {return p.dark ? '#000' : '#FFF';},

enter, function (p) {return p.lost ? 0.5 : 0;});




var Char = styled.div(_templateObject10,






function (p) {return p.fade ? 0.3 : 1;},





function (p) {return p.dark ? '#000' : '#FFF';},
function (p) {return (
    p &&
    p.underline && '\n    border-bottom: 5px solid ' + (

    p.dark ? '#000' : '#FFF') + ';\n  ');});



var HangingMan = styled.svg(_templateObject11,











function (p) {return p.dark ? '#000' : '#FFF';});


var HangZone = styled.div(_templateObject12);





var Swingers = styled.g(_templateObject13,

swing,
function (p) {return (
    p.animate && '\n    animation-play-state: running;\n  ');});





var Frame = styled.path(_templateObject14,


draw);

var Rope = styled.path(_templateObject15,



draw);

var Head = styled.circle(_templateObject16,


draw);

var Arms = styled.path(_templateObject17,



draw);


var Body = styled.path(_templateObject18,



draw);

var Legs = styled.path(_templateObject19,



draw);

var Tada = styled.span(_templateObject20,
fly);






/**
       * Hexadecimal Hangman
       * Built w/ React Hooks + CSS Grid
       * @author Jhey
       */
var chars = '0123456789ABCDEF';
var getHex = function getHex() {return (
    new Array(6).
    fill().
    map(function () {return chars.charAt(Math.floor(Math.random() * chars.length));}).
    join(''));};

var getRgbFromHex = function getRgbFromHex(hex) {
  var i = 0;
  var result = [];
  while (i < 5) {
    result.push(parseInt(hex.substring(i, i + 2), 16));
    i += 2;
  }
  return result;
};

var Game = function Game() {var _useState =
  useState(0),_useState2 = _slicedToArray(_useState, 2),games = _useState2[0],setGames = _useState2[1];var _useState3 =
  useState([]),_useState4 = _slicedToArray(_useState3, 2),fails = _useState4[0],setFails = _useState4[1];var _useState5 =
  useState([]),_useState6 = _slicedToArray(_useState5, 2),successes = _useState6[0],setSuccesses = _useState6[1];var _useState7 =
  useState(false),_useState8 = _slicedToArray(_useState7, 2),dark = _useState8[0],setDark = _useState8[1];var _useState9 =
  useState(getHex()),_useState10 = _slicedToArray(_useState9, 2),hex = _useState10[0],setHex = _useState10[1];
  /**
                                                                                                                * When a character is selected
                                                                                                                * Check it against the hex in state
                                                                                                                * If it's there, awesome, add to solved, else failed
                                                                                                                * @param {String} selected
                                                                                                                */
  var selectChar = function selectChar(char) {
    if (hex.includes(char)) {
      // How many times does char appear?
      var count = hex.match(new RegExp(char, 'g')).length;
      var matches = new Array(count).fill().map(function () {return char;});
      setSuccesses([].concat(_toConsumableArray(successes), _toConsumableArray(matches)));
    } else {
      setFails([].concat(_toConsumableArray(fails), [char]));
    }
  };
  /**
      * Resets the game and starts new 👍
      */var newGame = function newGame() {
    setHex(getHex());
    setFails([]);
    setSuccesses([]);
    setGames(games + 1);
  };
  useEffect(
  function () {
    // If 2 out of 3 RGB values are over 200 then switch container
    // to dark mode 👍
    var rgb = getRgbFromHex(hex);
    document.body.style.background = 'rgb(' + rgb.join(',') + ')';
    // CHEAT 😅
    // console.info(hex)
    // document.body.style.background = `#${hex}`
    setDark(rgb.filter(function (c) {return c > 200;}).length >= 2);
  },
  [hex]);

  return (
    React.createElement(Container, { className: 'container' },
      React.createElement(HangZone, null,
        React.createElement(HangingMan, {
            dark: dark,
            preserveAspectRatio: 'xMinYMin',
            viewBox: '0 0 200 200' },
          React.createElement(Frame, { d: 'M 5 195 L 5 5 L 100 5 M 50 5 L 5 50' }),
          React.createElement(Swingers, { animate: fails.length > 1 },
            fails.length >= 1 && React.createElement(Rope, { d: 'M 100 5 L 100 30' }),
            fails.length >= 2 && React.createElement(Head, { cx: '100', cy: '50', r: '20' }),
            fails.length >= 3 && React.createElement(Body, { d: 'M 100 70 L 100 120' }),
            fails.length >= 4 && React.createElement(Arms, { d: 'M 90 110 L 100 80 L 110 110' }),
            fails.length >= 5 && React.createElement(Legs, { d: 'M 96 140 L 100 120 L 104 140' })))),



      React.createElement(Char, { dark: dark, className: 'char' }, '#'),


      hex &&
      hex.split('').map(function (c, i) {
        return (
          React.createElement(Char, {
              className: 'char',
              key: 'char--' + i,
              underline: true,
              fade: !successes.includes(c),
              dark: dark },
            (successes.includes(c) || fails.length === 5) && c));


      }),
      hex &&
      fails.length !== 5 &&
      successes.length !== 6 &&
      React.createElement(Options, { dark: dark, games: games, className: 'options' },
        chars.split('').map(function (c) {return (
            React.createElement(Button, {
                dark: dark,
                disabled: successes.includes(c) || fails.includes(c),
                key: 'key--' + c,
                onClick: function onClick() {return selectChar(c);} },
              c));})),




      (fails.length === 5 || successes.length === 6) &&
      React.createElement(Result, { dark: dark, lost: fails.length === 5 },
        React.createElement('h1', null, '' + (successes.length === 6 ? 'Well Done!' : 'Unlucky!')),
        React.createElement(NewGameButton, { dark: dark, onClick: newGame }, 'New Game'),


        successes.length === 6 &&
        new Array(15).fill().map(function (f, i) {return (
            React.createElement(Tada, {
                style: {
                  '--r': Math.floor(Math.random() * 180) - 270,
                  '--l': Math.floor(Math.random() * 300) + 100 },

                key: 'tada--' + i,
                role: 'img' }, '\uD83C\uDF89'));}))));







};
render(React.createElement(Game, null), rootNode);