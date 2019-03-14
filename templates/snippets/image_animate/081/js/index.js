var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var _React = React,Component = _React.Component;

// digits component, taking in the number of digits to show and mapping the digits around the clock
// for instance 4 digits --> 3, 6, 9, 12, positioned at 3, 6, 9, 12 o'click respectively
var Digits = function Digits(_ref) {var howMany = _ref.howMany,distance = _ref.distance;
  // describe the digits to be displayed around the clock
  var baseDigit = 12 / howMany;
  var digits = [];
  for (var i = baseDigit; i <= 12; i += baseDigit) {
    digits.push(i);
  }
  // describe the text elements rotated according to the digit number (12 at the very top, 3 at the very right and so forth repeating the structure of an analog clock)
  var DigitsText = digits.map(function (digit) {
    var rotate = "rotate(" + digit * 360 / 12 + ") translate(0, -" + distance + ") rotate(-" + digit * 360 / 12 + ")";

    return (
      React.createElement("text", {
          key: digit,
          x: "0",
          y: "0",
          fill: "#ccc",
          opacity: "0.5",
          fontWeight: "400",
          fontSize: "0.85rem",
          textAnchor: "middle",
          alignmentBaseline: "middle",
          transform: rotate },

        digit));



  });

  return (
    React.createElement("g", null,

      DigitsText));



};


// hours component, taking the current hours and drawing a hand rotated as per the number of hours
// 12 hours clock
var Hours = function Hours(_ref2) {var hours = _ref2.hours,size = _ref2.size;


  var hourTwelve = hours >= 12 ? hours -= 12 : hours;
  var d = "M 0 0 v -" + size;
  var rotate = "rotate(" + hourTwelve * 360 / 12 + ")";

  return (
    React.createElement("g", { className: "hand" },
      React.createElement("path", {
        stroke: "#999",
        strokeWidth: "5px",
        strokeLinecap: "round",
        fill: "none",
        d: d,
        transform: rotate })));


};


// minutes component, taking the current minutes and drawing a hand rotated as per the number of minutes
var Minutes = function Minutes(_ref3) {var size = _ref3.size,minutes = _ref3.minutes;


  var d = "M 0 0 v -" + size;
  var rotate = "rotate(" + minutes * 360 / 60 + ")";
  return (
    React.createElement("g", { className: "hand" },
      React.createElement("path", {
        // thinner and with a more evident color
        stroke: "#eee",
        strokeWidth: "3px",
        strokeLinecap: "round",
        fill: "none",
        d: d,
        transform: rotate })));


};


// seconds component, taking the current seconds, drawing 60 ticks for each second in the dial and highlighting the current second
// additionally detailing a triangle pointing toward the current second
var Seconds = function Seconds(_ref4) {var size = _ref4.size,seconds = _ref4.seconds,spread = _ref4.spread,turn = _ref4.turn;
  // seconds ticks
  var SecondsPath = [];
  for (var i = 1; i <= 60; i++) {
    var rotate = "rotate(" + i * 360 / 60 + ")";
    var d = "M 0 -" + spread + " v -" + size;
    SecondsPath.push(
    React.createElement("path", {
      key: i,
      stroke: "#eee",
      strokeWidth: "2px",
      strokeLinecap: "square",
      fill: "none",
      className: i === seconds + 1 ? 'current' : '',
      d: d,
      transform: rotate }));

  }

  // triangle marker
  // turn allowing to go past the 0-360 range
  var markerPath = "M 0 -" + (spread - 5) + " l 5 7 h -10 Z";
  var markerRotation = "rotate(" + ((seconds + 1) * 360 / 60 + 360 * turn) + ")";


  return (
    React.createElement("g", null,

      React.createElement("g", { className: "seconds" },

        SecondsPath),


      React.createElement("path", {
        stroke: "none",
        fill: "#eee",
        d: markerPath,
        transform: markerRotation })));


};


// main component rendered through index.js
var SVGatch = function (_Component) {_inherits(SVGatch, _Component);
  function SVGatch(props) {_classCallCheck(this, SVGatch);

    // in the state detail a date Object, later updated every second
    // additionally define root variables for the size of the SVG and the margin allowing to nest SVG element inside, without cropping
    // following d3's margin convention
    // ! turn addded to keep track of the number of times the seconds marker goes around the clock, and in so doing avoiding the 'snap' occurring between 359 degrees and 0
    // this way, instead of going back to rotate(0), the hands and marker go to rotate(360), then rotate(361) and so forth and so on
    var _this = _possibleConstructorReturn(this, (SVGatch.__proto__ || Object.getPrototypeOf(SVGatch)).call(this, props));_this.state = {
      date: new Date(),
      size: 225,
      margin: 25,
      turn: 0 };return _this;

  }



  // when the components are mounted set up an interval to update the date object every second
  _createClass(SVGatch, [{ key: "componentDidMount", value: function componentDidMount() {var _this2 = this;
      this.interval = setInterval(function () {
        var date = new Date();
        // check if the number of seconds is 0, and in this instance increment the turn variable of the matching element
        var turn = date.getSeconds() === 0 ? _this2.state.turn + 1 : _this2.state.turn;

        // update the state
        _this2.setState({
          date: date,
          turn: turn });

      }, 1000);
    } }, { key: "render", value: function render()

    {
      // destructure the variables present in the state
      var _state = this.state,date = _state.date,size = _state.size,margin = _state.margin,turn = _state.turn;
      /* define transform values to translate the SVG elements (per d3's margin convention)
                                                                                                               and to center the elements */
      var translate = "translate(" + margin + " " + margin + ")";
      var center = "translate(" + size / 2 + " " + size / 2 + ")";
      /* within the SVG Element, define the following elements/components
                                                                   circle, for the outer most ring
                                                                   Digits, for text elements distributed around the ring
                                                                   Hours, for the hour's hand
                                                                   Minutes, for the minute's hand
                                                                   Seconds, for the ticks representing the seconds and a marker highlighting the current second
                                                                   */
      return (
        React.createElement("svg", { width: size + margin * 2, height: size + margin * 2 },
          React.createElement("g", { transform: translate },
            React.createElement("g", { transform: center },
              React.createElement("circle", {
                cx: "0",
                cy: "0",
                r: size / 2.3,
                fill: "none",
                stroke: "#ccc",
                strokeWidth: "2px" }),





              React.createElement(Digits, {
                howMany: 4,
                distance: size / 2 }),






              React.createElement(Hours, {
                hours: date.getHours(),
                size: size / 4.5 }),







              React.createElement(Minutes, {
                minutes: date.getMinutes(),
                size: size / 3.5 }),








              React.createElement(Seconds, {
                seconds: date.getSeconds(),
                size: size / 30,
                spread: size / 2.7,
                turn: turn }),


              React.createElement("circle", {
                cx: "0",
                cy: "0",
                r: "5",
                fill: "#5941f3",
                stroke: "#fff",
                strokeWidth: "3px" })))));




    } }]);return SVGatch;}(Component);



ReactDOM.render(React.createElement(SVGatch, null), document.getElementById('root'));