
var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var canArr = [
"HTML",
"HTML5",
"PUG",
"CSS",
"CSS3",
"SCSS",
"JAVASCRIPT",
"JS",
"JQUERY",
"REACT",
"REACTJS"];

var cantArr = [
"C#",
"C++",
"PHP",
"MYSQL",
"SQL",
"NODE",
"NODEJS",
"ANGULAR",
"ANGULARJS"];


var SearchResult = function SearchResult(props) {
	return (
		React.createElement("div", { className: "c-result" },
			props.canHelp.length > 0 &&
			React.createElement("div", { className: "c-result_e-section c-result_e-section--true" },
				React.createElement("h2", null, "Yes, I can help with:"),
				React.createElement("ul", null, props.canHelp.map(function (help) {return React.createElement("li", { key: help }, help);}))),



			props.cantHelp.length > 0 &&
			React.createElement("div", { className: "c-result_e-section c-result_e-section--false" },
				React.createElement("h2", null, "Sorry, I cannot help with:"),
				React.createElement("ul", null, props.cantHelp.map(function (help) {return React.createElement("li", { key: help }, help);})))));




};

var SearchBar = function SearchBar(props) {
	return (
		React.createElement("form", { className: "c-form", onSubmit: props.handleSubmit },
			React.createElement("input", {
				type: "text",
				placeholder: "Tell me what you need",
				className: "c-form_e-input",
				value: props.inputValue,
				onChange: props.handleChange }),

			React.createElement("button", { type: "submit", className: "c-form_e-button" },
				React.createElement("i", { className: "fa fa-search" }))));



};var

Search = function (_React$Component) {_inherits(Search, _React$Component);
	function Search(props) {_classCallCheck(this, Search);var _this = _possibleConstructorReturn(this, (Search.__proto__ || Object.getPrototypeOf(Search)).call(this,
		props));
		_this.state = {
			searchValue: "",
			canHelp: [],
			cantHelp: [] };

		_this.handleSearch = _this.handleSearch.bind(_this);
		_this.handleCheck = _this.handleCheck.bind(_this);return _this;
	}_createClass(Search, [{ key: "handleSearch", value: function handleSearch(

		e) {
			this.setState({
				searchValue: e.target.value,
				canHelp: [],
				cantHelp: [] });

		} }, { key: "handleCheck", value: function handleCheck(

		e) {
			e.preventDefault();
			var i = void 0,
			x = void 0,
			y = void 0,
			word = this.state.searchValue.split(/[ ,.]+/),
			upper = void 0,
			can = [],
			cant = [];
			for (i = 0; i < word.length; i++) {
				upper = word[i].toUpperCase();
				for (x = 0; x < canArr.length; x++) {
					upper === canArr[x] ? can.push(canArr[x]) : "";
				}
				for (y = 0; y < canArr.length; y++) {
					upper === cantArr[y] ? cant.push(cantArr[y]) : "";
				}
			}
			this.setState({
				canHelp: can,
				cantHelp: cant });

		} }, { key: "render", value: function render()

		{
			return (
				React.createElement("div", { className: "c-search" },
					React.createElement("h1", null, "Check if developer skills match client needs"),
					React.createElement(SearchBar, {
						handleChange: this.handleSearch,
						inputValue: this.state.searchValue,
						handleSubmit: this.handleCheck }),

					React.createElement(SearchResult, { canHelp: this.state.canHelp, cantHelp: this.state.cantHelp })));


		} }]);return Search;}(React.Component);


ReactDOM.render(React.createElement(Search, null), document.getElementById("root"));