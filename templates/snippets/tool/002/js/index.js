var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _React = React,useEffect = _React.useEffect,useState = _React.useState;

var useMousePosition = function useMousePosition() {var _useState =
  useState({ x: 0, y: 0 }),_useState2 = _slicedToArray(_useState, 2),mouse = _useState2[0],setMouse = _useState2[1];

  var onMouse = function onMouse(_ref) {var clientX = _ref.clientX,clientY = _ref.clientY;
    setMouse({ x: clientX, y: clientY });
  };

  useEffect(function () {
    window.addEventListener('mousemove', onMouse);

    return function () {
      window.removeEventListener('mousemove', onMouse);
    };
  });

  return mouse;
};

var Bröther = function Bröther() {var _useMousePosition =
  useMousePosition(),x = _useMousePosition.x,y = _useMousePosition.y;

  return (
    React.createElement('div', { className: 'm', style: {
          left: x + 'px',
          top: y + 'px' } }, 'x: ',

      x, ', y: ', y));


};

var mayIHaveSomeHööks = document.createElement('div');
document.body.appendChild(mayIHaveSomeHööks);
ReactDOM.render(React.createElement(Bröther, null), mayIHaveSomeHööks);