var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _window = window,React = _window.React,ReactDOM = _window.ReactDOM;var
useEffect = React.useEffect,useState = React.useState,Fragment = React.Fragment;var
render = ReactDOM.render;
var rootNode = document.getElementById('app');

var colors = {
  Sea: '#a2ccb6',
  Sand: '#fceeb5',
  Peach: '#ee786e' };


var App = function App() {var _useState =
  useState(colors.Sea),_useState2 = _slicedToArray(_useState, 2),color = _useState2[0],setColor = _useState2[1];
  useEffect(
  function () {
    document.body.style.background = color;
  },
  [color]);

  return (
    React.createElement(Fragment, null,
      React.createElement('select', { value: color, onChange: function onChange(e) {return setColor(e.target.value);} },
        Object.entries(colors).map(function (c) {return (
            React.createElement('option', { key: 'color--' + c[0], value: c[1] },
              c[0]));})),



      React.createElement('h1', null, color)));


};

ReactDOM.render(React.createElement(App, null), rootNode);