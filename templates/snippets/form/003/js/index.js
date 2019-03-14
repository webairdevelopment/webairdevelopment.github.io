var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var DURATION = 600;

var LogIn = posed.div({
  in: {
    rotate: 0,
    width: '100%',
    height: '100%',
    x: 0, y: -134,
    zIndex: -1,
    transition: { duration: DURATION } },

  out: {
    rotate: 90,
    width: '20%',
    height: '20%',
    y: -130, x: 290,
    zIndex: 1,
    transition: { duration: DURATION } } });



var SignUp = posed.div({
  in: {
    rotate: 0,
    width: '100%',
    height: '100%',
    x: 0, y: 0,
    zIndex: -1,
    transition: { duration: DURATION } },

  out: {
    rotate: -90,
    width: '20%',
    height: '20%',
    y: 538, x: 0,
    zIndex: 1,
    transition: { duration: DURATION } } });var



App = function (_React$Component) {_inherits(App, _React$Component);
  function App() {_classCallCheck(this, App);var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));_this.




    handleClick = function () {
      _this.setState({ login: !_this.state.login });
    };_this.state = { login: false };return _this;}_createClass(App, [{ key: 'render', value: function render()

    {
      return (
        React.createElement('div', { className: 'container' },
          React.createElement(SignUp, { pose: this.state.login ? 'in' : 'out', onClick: this.handleClick, id: 'sign-up' },
            React.createElement('div', { id: 'bg-image-2', style: {
                'visibility': this.state.login ? 'visible' : 'hidden' } }),


            React.createElement('input', { id: 'sign-up-name', placeholder: 'Full Name', style: {
                'visibility': this.state.login ? 'visible' : 'hidden',
                'left': '10%', 'top': '15%' } }),


            React.createElement('input', { id: 'sign-up-email', placeholder: 'What\'s your email?', style: {
                'visibility': this.state.login ? 'visible' : 'hidden',
                'left': '10%', 'top': '24%' } }),


            React.createElement('div', { id: 'sign-up-filter', style: {
                  'background': this.state.login ? 'rgba(155, 89, 182, 0.28)' : 'rgba(155, 89, 182, 1)' } },

              React.createElement('h3', { id: 'log-in-transition', style: {
                    'visibility': this.state.login ? 'hidden' : 'visible' } }, 'Sign Up')),



            React.createElement('button', { id: 'next-btn', style: {
                  'visibility': this.state.login ? 'visible' : 'hidden' } }, 'next'),


            React.createElement('i', { className: 'fa fa-long-arrow-right', style: {
                'visibility': this.state.login ? 'visible' : 'hidden',
                'position': 'absolute', 'left': '62%', 'top': '93%',
                'fontSize': '1.2em', 'color': 'black' } }),


            React.createElement('h1', { id: 'h-logo', style: {
                  'visibility': this.state.login ? 'visible' : 'hidden' } }, 'H'),


            React.createElement('p', { style: {
                  'visibility': this.state.login ? 'visible' : 'hidden',
                  'letterSpacing': '1px', 'fontFamily': 'sans-serif',
                  'position': 'absolute', 'fontSize': '0.64em',
                  'color': 'black', 'top': '91.8%', 'left': '18%' } }, 'already have an account?')),



          React.createElement(LogIn, { pose: this.state.login ? 'out' : 'in', onClick: this.handleClick, id: 'log-in' },
            React.createElement('div', { id: 'bg-image-1', style: {
                'visibility': this.state.login ? 'hidden' : 'visible',
                'position': 'absolute', 'width': '100%', 'height': '100%' } }),


            React.createElement('input', { id: 'log-in-email', placeholder: 'E-mail', style: {
                'visibility': this.state.login ? 'hidden' : 'visible',
                'left': '12%', 'top': '45%' } }),


            React.createElement('input', { placeholder: 'Password', style: {
                'visibility': this.state.login ? 'hidden' : 'visible',
                'position': 'absolute', 'left': '12%', 'top': '55%' } }),


            React.createElement('div', { style: {
                  'position': 'absolute',
                  'background': this.state.login ? 'rgba(69, 127, 202, 1)' : 'rgba(69, 127, 202, 0.28)',
                  'width': '100%', 'height': '100%' } },

              React.createElement('h3', { style: {
                    'visibility': this.state.login ? 'visible' : 'hidden',
                    'transform': 'rotate(-90deg)', 'position': 'absolute',
                    'color': '#fff', 'top': '42%', 'left': '15%' } }, 'Log In')),



            React.createElement('button', { id: 'login-btn', style: {
                  'visibility': this.state.login ? 'hidden' : 'visible' } }, 'Login'),


            React.createElement('i', { className: 'fa fa-user', style: {
                'visibility': this.state.login ? 'hidden' : 'visible',
                'position': 'absolute', 'left': '13%', 'top': '46.7%',
                'fontSize': '1.4em', 'color': '#fff' } }),


            React.createElement('i', { className: 'fa fa-lock', style: {
                'visibility': this.state.login ? 'hidden' : 'visible',
                'position': 'absolute', 'left': '13.5%', 'top': '56.7%',
                'fontSize': '1.4em', 'color': '#fff' } }),


            React.createElement('i', { className: 'fa fa-long-arrow-left', style: {
                'visibility': this.state.login ? 'hidden' : 'visible',
                'position': 'absolute', 'left': '33%', 'top': '93%',
                'fontSize': '1.2em', 'color': '#fff' } }),


            React.createElement('h1', { style: {
                  'visibility': this.state.login ? 'hidden' : 'visible',
                  'position': 'absolute', 'color': '#fff', 'top': '12%',
                  'left': '33%' } }, 'Human'),


            React.createElement('p', { style: {
                  'visibility': this.state.login ? 'hidden' : 'visible',
                  'letterSpacing': '1px', 'fontFamily': 'sans-serif',
                  'position': 'absolute', 'fontSize': '0.64em', 'color': '#fff',
                  'top': '91.8%', 'left': '42%' } }, 'don\'t have an account?'))));




    } }]);return App;}(React.Component);


ReactDOM.render(React.createElement(App, null), document.getElementById('root'));