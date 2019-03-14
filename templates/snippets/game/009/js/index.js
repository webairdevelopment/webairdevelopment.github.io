
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var X = 'X';
var O = 'O';

// The following array holds all the possible 
// winning combinations for the game. Using 
// bitwise arithmatic, each cell is represented 
// by 2 to the power of the cell's number 
// (2^0,2^1,2^2, ... , 2^8). The winning 
// combination is the sum of all the numbers 
// in the corresponding cells (can also be 
// achieved by OR-ing two numbers). For example,
// the winning combination for the first row is
// 1+2+4 = 7. These patterns are compared with
// each player's pattern by using bitwise AND.
// if the result of the AND operation is equal 
// to the winning pattern, that player is the winner.
var WINNING_PATTERNS = [
7, 56, 448, // Horizontal
73, 146, 292, // Vertical
273, 84 // Cross
];

var Circle = function Circle() {return (
    React.createElement('svg', { className: 'pawn circle', viewBox: '0 0 128 128' },
      React.createElement('path', { d: 'M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16' })));};



var Times = function Times() {return (
    React.createElement('svg', { className: 'pawn times', viewBox: '0 0 128 128' },
      React.createElement('path', { d: 'M16,16L112,112' }),
      React.createElement('path', { d: 'M112,16L16,112' })));};var



Line = function (_React$PureComponent) {_inherits(Line, _React$PureComponent);function Line() {_classCallCheck(this, Line);return _possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).apply(this, arguments));}_createClass(Line, [{ key: 'd', value: function d()

    {var
      pattern = this.props.pattern;
      return {
        7: 'M 0,5 H 100',
        56: 'M 0,50 H 100',
        448: 'M 0,95 H 100',
        73: 'M 5,0 V 100',
        146: 'M 50,0 V 100',
        292: 'M 95,0 V 100',
        273: 'M 0,0 L 100,100',
        84: 'M 100,0 L 0,100' }[
      pattern];
    } }, { key: 'render', value: function render()

    {var
      show = this.props.show;
      return (
        React.createElement('svg', { className: 'line ' + (show ? 'visible' : ''), viewBox: '0 0 100 100' },
          React.createElement('g', null,
            React.createElement('path', { d: this.d() }))));



    } }]);return Line;}(React.PureComponent);var


Cube = function (_React$PureComponent2) {_inherits(Cube, _React$PureComponent2);function Cube() {_classCallCheck(this, Cube);return _possibleConstructorReturn(this, (Cube.__proto__ || Object.getPrototypeOf(Cube)).apply(this, arguments));}_createClass(Cube, [{ key: 'componentDidMount', value: function componentDidMount()

    {var _this3 = this;
      // For some reason, setting preserve-3d in CSS causes 
      // visual discrepancies that are only solved by applying 
      // them after the first render.
      setTimeout(function () {
        _this3.ref.style.transformStyle = 'preserve-3d';
      }, 500);
    } }, { key: 'render', value: function render()

    {var _this4 = this;var _props =
      this.props,value = _props.value,onClick = _props.onClick;
      return (
        React.createElement('div', { className: 'cube ' + (value ? 'rotated' : ''), onClick: onClick, ref: function ref(_ref) {return _this4.ref = _ref;} },
          ['top', 'bottom', 'left', 'right', 'front', 'back'].map(function (face) {return (
              React.createElement('div', { className: face },
                face === 'back' && value === O && React.createElement(Circle, null),
                face === 'back' && value === X && React.createElement(Times, null)));})));




    } }]);return Cube;}(React.PureComponent);


var Row = function Row(_ref2) {var children = _ref2.children;return React.createElement('div', { className: 'row' }, children);};var

Results = function (_React$PureComponent3) {_inherits(Results, _React$PureComponent3);function Results() {_classCallCheck(this, Results);return _possibleConstructorReturn(this, (Results.__proto__ || Object.getPrototypeOf(Results)).apply(this, arguments));}_createClass(Results, [{ key: 'render', value: function render()
    {var _props2 =
      this.props,winner = _props2.winner,draw = _props2.draw,onPlayAgain = _props2.onPlayAgain;
      return (
        React.createElement('div', { className: 'results' },
          React.createElement('div', { className: 'message' },
            React.createElement('div', { className: 'symbol' },
              winner === X && React.createElement(Times, null),
              winner === O && React.createElement(Circle, null),
              draw && React.createElement(React.Fragment, null, React.createElement(Times, null), React.createElement(Circle, null))),

            React.createElement('div', { className: 'text' },
              winner ? 'Wins!' : 'Draw!')),


          React.createElement('div', { className: 'replay', onClick: onPlayAgain }, 'Play Again')));


    } }]);return Results;}(React.PureComponent);var


Board = function (_React$PureComponent4) {_inherits(Board, _React$PureComponent4);function Board() {_classCallCheck(this, Board);return _possibleConstructorReturn(this, (Board.__proto__ || Object.getPrototypeOf(Board)).apply(this, arguments));}_createClass(Board, [{ key: 'render', value: function render()

    {var _props3 =
      this.props,board = _props3.board,_onClick = _props3.onClick;
      return (
        React.createElement('div', { className: 'board' },
          board.map(function (row, i) {return (
              React.createElement(Row, null,
                row.map(function (col, j) {return (
                    React.createElement(Cube, { value: col, onClick: function onClick() {return _onClick(i, j);} }));})));})));





    } }]);return Board;}(React.PureComponent);var


Game = function (_React$PureComponent5) {_inherits(Game, _React$PureComponent5);

  function Game(props) {_classCallCheck(this, Game);var _this7 = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this,
    props));_this7.

















    handleOnClick = function (i, j) {
      if (null === _this7.state.board[i][j]) {var _this7$state =
        _this7.state,player = _this7$state.player,board = _this7$state.board,patterns = _this7$state.patterns;
        var state = {
          board: [].concat(_toConsumableArray(board)),
          player: player === X ? O : X,
          patterns: _extends({}, patterns) };


        // Set the value in the board
        state.board[i][j] = player;

        // Add the value to the player pattern using bitwise OR
        state.patterns[player] = state.patterns[player] |= Math.pow(2, i * 3 + j);

        state.winner = _this7.checkForWin(state.patterns);

        _this7.setState(state);

        if (state.winner || _this7.isBoardFull(board)) {
          setTimeout(function () {
            _this7.setState({ rotated: true });
          }, 1500);
        }
      }
    };_this7.





















    handleOnPlayAgain = function () {
      _this7.setState({ rotated: false });
      setTimeout(function () {
        _this7.setState(_this7.getInitialState());
      }, 1000);
    };_this7.state = _this7.getInitialState();return _this7;}_createClass(Game, [{ key: 'getInitialState', value: function getInitialState() {var _patterns;return { player: X, patterns: (_patterns = {}, _defineProperty(_patterns, X, 0), _defineProperty(_patterns, O, 0), _patterns), winner: null, rotated: false, board: [[null, null, null], [null, null, null], [null, null, null]] };} }, { key: 'checkForWin', value: function checkForWin(patterns) {// Loop through all possible winning sets
      for (var i = 0; i < WINNING_PATTERNS.length; i++) {// Use bitwise AND to determind if the player's score
        // Holds a winning combination
        if ((WINNING_PATTERNS[i] & patterns[X]) === WINNING_PATTERNS[i]) return X;if ((WINNING_PATTERNS[i] & patterns[O]) === WINNING_PATTERNS[i]) return O;} // No winner
      return false;} }, { key: 'isBoardFull', value: function isBoardFull(board) {return !this.state.board.some(function (row, i) {return row.some(function (col, j) {return null === col;});});} }, { key: 'getWinningPattern', value: function getWinningPattern() {var _state = this.state,winner = _state.winner,patterns = _state.patterns;return WINNING_PATTERNS.find(function (pattern) {return (pattern & patterns[winner]) === pattern;});
    } }, { key: 'render', value: function render()

    {var _state2 =
      this.state,board = _state2.board,winner = _state2.winner,rotated = _state2.rotated;
      return (
        React.createElement('div', { className: 'game ' + (rotated ? 'rotated' : '') },
          React.createElement(Results, { winner: winner, draw: !winner && this.isBoardFull(board), onPlayAgain: this.handleOnPlayAgain }),
          React.createElement(Line, { show: winner, pattern: this.getWinningPattern() }),
          React.createElement(Board, { board: board, onClick: this.handleOnClick })));


    } }]);return Game;}(React.PureComponent);


ReactDOM.render(
React.createElement(Game, null),
document.body);