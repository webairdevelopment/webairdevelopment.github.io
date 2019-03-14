var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var _React = React,Component = _React.Component;var _ReactDOM =
ReactDOM,render = _ReactDOM.render;

var $code = function $code(sel) {return (
    (document.getElementById(sel) || {}).textContent || "void main() {}");};var

AnimatedPattern = function (_Component) {_inherits(AnimatedPattern, _Component);function AnimatedPattern() {var _ref;var _temp, _this, _ret;_classCallCheck(this, AnimatedPattern);for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AnimatedPattern.__proto__ || Object.getPrototypeOf(AnimatedPattern)).call.apply(_ref, [this].concat(args))), _this), _this.
    canvasRef = React.createRef(), _this.

    setSize = function () {var _this2 = _this,
      canvas = _this2.canvas;
      canvas.width = _this.width = canvas.clientWidth;
      canvas.height = _this.height = canvas.clientHeight;
    }, _temp), _possibleConstructorReturn(_this, _ret);}_createClass(AnimatedPattern, [{ key: "componentDidMount", value: function componentDidMount()

    {var _this3 = this;
      this.canvas = this.canvasRef.current;
      this.setSize();
      window.addEventListener("resize", this.setSize);
      this.regl = createREGL({ canvas: this.canvas });var
      regl = this.regl;
      var drawFrame = regl({
        frag: $code("fragmentShader"),
        vert: $code("vertexShader"),
        attributes: {
          position: [
          [-1, -1], // triangle 1
          [-1, 1],
          [1, -1],
          [1, -1], // triangle 2
          [-1, 1],
          [1, 1] // forming a rectangle together 
          ] // filling the whole WebGL canvas
        },
        uniforms: {
          rotation: function rotation(ctx) {return ctx.tick * _this3.props.rotationSpeed;},
          zoom: function zoom(ctx) {return _this3.props.zoom;},
          red: function red(ctx) {return _this3.props.red;},
          green: function green(ctx) {return _this3.props.green;},
          blue: function blue(ctx) {return _this3.props.blue;},
          width: function width(ctx) {return ctx.viewportWidth;},
          height: function height(ctx) {return ctx.viewportHeight;},
          time: function time(ctx) {return ctx.tick * 0.02;} },

        count: 6 });

      regl.frame(function (ctx) {
        regl.clear({ depth: 1 });
        drawFrame();
      });
    } }, { key: "componentWillUnmount", value: function componentWillUnmount()

    {
      this.regl.destroy();
      window.removeEventListener("resize", this.setSize);
    } }, { key: "render", value: function render()

    {
      return (
        React.createElement("canvas", {
          ref: this.canvasRef,
          style: { display: "block", width: "100%", height: "100%" } }));


    } }]);return AnimatedPattern;}(Component);


render(
React.createElement(AnimatedPattern, {
  zoom: 1.0,
  rotationSpeed: 0.01,
  red: 2.8,
  green: 0.3,
  blue: 1.0 }),

document.getElementById("root"));