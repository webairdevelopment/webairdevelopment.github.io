var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var Content = function Content() {return (
		React.createElement("div", { className: "content" },
			React.createElement("img", { src: "https://wackedwacko.github.io/img/banana.gif" })));};



var TooltipButton = function TooltipButton(_ref) {var
	position = _ref.position,
	relation = _ref.relation;return (

		React.createElement(PaperTooltip, { position: position, relation: relation, content: React.createElement(Content, null) },
			React.createElement("div", { className: "butao" }, "Position: ", position, " ", React.createElement("br", null), " Relation: ", relation)));};



var Tooltipped = function Tooltipped() {return (
		React.createElement("div", { className: "wrapper" },
			React.createElement(TooltipButton, { position: 1, relation: "top" }),
			React.createElement(TooltipButton, { position: 2, relation: "top" }),
			React.createElement(TooltipButton, { position: 3, relation: "top" }),
			React.createElement(TooltipButton, { position: 1, relation: "left" }),
			React.createElement(TooltipButton, { position: 2, relation: "left" }),
			React.createElement(TooltipButton, { position: 3, relation: "left" }),
			React.createElement(TooltipButton, { position: 1, relation: "right" }),
			React.createElement(TooltipButton, { position: 2, relation: "right" }),
			React.createElement(TooltipButton, { position: 3, relation: "right" }),
			React.createElement(TooltipButton, { position: 1, relation: "bottom" }),
			React.createElement(TooltipButton, { position: 2, relation: "bottom" }),
			React.createElement(TooltipButton, { position: 3, relation: "bottom" })));};var




PaperTooltip = function (_React$Component) {_inherits(PaperTooltip, _React$Component);
	function PaperTooltip(props) {_classCallCheck(this, PaperTooltip);var _this = _possibleConstructorReturn(this, (PaperTooltip.__proto__ || Object.getPrototypeOf(PaperTooltip)).call(this,
		props));
		_this.state = {
			show: false };

		_this.clickOut = _this.clickOut.bind(_this);return _this;
	}_createClass(PaperTooltip, [{ key: "componentDidMount", value: function componentDidMount()
		{
			window.addEventListener('click', this.clickOut);
		} }, { key: "componentWillUnmount", value: function componentWillUnmount()
		{
			window.removeEventListener('click', this.clickOut);
		} }, { key: "componentDidUpdate", value: function componentDidUpdate(
		prevProps, prevState) {
			if (prevState.show === this.props.show) return;
			if (prevProps.onOpen && this.state.show) {
				return this.props.onOpen();
			}
		} }, { key: "clickOut", value: function clickOut(_ref2)
		{var target = _ref2.target;
			if (this.me && !this.me.contains(target)) {
				this.setState({
					show: false });

			}
		} }, { key: "show", value: function show()
		{
			this.setState({
				show: !this.state.show });

		} }, { key: "hide", value: function hide()
		{
			this.setState({
				show: false });

		} }, { key: "tooltipBody", value: function tooltipBody()
		{
			return (
				React.createElement("div", {
						"data-relation": this.props.relation,
						"data-position": this.props.position,
						className: 'paper-tooltip-body' + (this.state.show ? ' triggered' : '') },

					this.props.content));


		} }, { key: "clonedChildren", value: function clonedChildren()
		{var _this2 = this;
			return React.Children.map(this.props.children, function (child) {return (
					React.cloneElement(child, {
						onClick: function onClick() {
							_this2.show();
						} }));});


		} }, { key: "render", value: function render()
		{var _this3 = this;
			var className = 'paper-tooltip ' + (this.props.className ? this.props.className : '') + (this.state.show ? ' triggered-cont' : '');
			return (
				React.createElement("div", { className: className, title: this.props.title, ref: function ref(me) {return _this3.me = me;} },
					this.clonedChildren(),
					this.tooltipBody()));


		} }]);return PaperTooltip;}(React.Component);





ReactDOM.render(React.createElement(Tooltipped, null), document.getElementById('app'));