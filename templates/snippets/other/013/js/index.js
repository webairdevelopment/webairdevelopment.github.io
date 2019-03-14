
var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var onecolor = one.color;var _ReactMotion =
ReactMotion,Motion = _ReactMotion.Motion,spring = _ReactMotion.spring;
var reglInit = createREGL;

function hex2vector(cssHex) {
    var pc = onecolor(cssHex);

    return vec3.fromValues(
    pc.red(),
    pc.green(),
    pc.blue());

}var

BarChart3D = function (_React$PureComponent) {_inherits(BarChart3D, _React$PureComponent);
    function BarChart3D(_ref)




    {var values = _ref.values,width = _ref.width,height = _ref.height,palette = _ref.palette;_classCallCheck(this, BarChart3D);


        // copy value array and coerce to 0..1
        var _this = _possibleConstructorReturn(this, (BarChart3D.__proto__ || Object.getPrototypeOf(BarChart3D)).call(this));_this.





        _handleCanvasRef = function (canvas) {
            // when unlinking, help WebGL context get cleaned up
            if (!canvas) {
                _this._regl.destroy();
                _this._regl = null; // dereference just in case
                return;
            }

            // initialize graphics
            _this._regl = reglInit({
                canvas: canvas });


            _this._barCommand = _this._regl({
                vert: '\n                precision mediump float;\n\n                uniform mat4 camera;\n                uniform vec2 base;\n                uniform float radius, height;\n\n                attribute vec3 position;\n                attribute vec3 normal;\n\n                varying vec3 fragPosition;\n                varying vec3 fragNormal;\n\n                void main() {\n                    float z = position.z * height;\n\n                    fragPosition = vec3(\n                        (position.xy + vec2(1.0, 1.0)) * radius,\n                        z\n                    );\n                    fragNormal = normal;\n\n                    gl_Position = camera * vec4(\n                        base + position.xy * radius,\n                        z,\n                        1.0\n                    );\n                }\n            ',





                frag: '\n                precision mediump float;\n\n                uniform vec3 baseColor, secondaryColor, highlightColor;\n                uniform float height;\n                uniform float highlight;\n                uniform int patternIndex;\n                uniform float patternSize;\n\n                varying vec3 fragPosition;\n                varying vec3 fragNormal;\n\n                float stripePattern() {\n                    return step(patternSize * 0.5, mod((\n                        fragPosition.y\n                        - fragPosition.x\n                        + (height - fragPosition.z)\n                    ), patternSize));\n                }\n\n                float stripe2Pattern() {\n                    return step(patternSize * 0.5, mod((\n                        fragPosition.x\n                        - fragPosition.y\n                        + (height - fragPosition.z)\n                    ), patternSize));\n                }\n\n                float checkerPattern() {\n                    vec3 cellPosition = vec3(0, 0, height) - fragPosition;\n                    float cellSize = patternSize * 0.4;\n\n                    vec3 cellIndex = cellPosition / cellSize;\n                    float dotChoice = mod((\n                        step(1.0, mod(cellIndex.x, 2.0))\n                        + step(1.0, mod(cellIndex.y, 2.0))\n                        + step(1.0, mod(cellIndex.z, 2.0))\n                    ), 2.0);\n\n                    return dotChoice;\n                }\n\n                float dotPattern() {\n                    vec3 attachedPos = vec3(0, 0, height) - fragPosition;\n\n                    float dotSize = patternSize * 0.3;\n                    vec3 dotPosition = attachedPos + dotSize * 0.5;\n                    float dotDistance = length(mod(dotPosition, dotSize) / dotSize - vec3(0.5));\n\n                    vec3 dotIndex = dotPosition / dotSize;\n                    float dotChoice = mod((\n                        step(1.0, mod(dotIndex.x, 2.0))\n                        + step(1.0, mod(dotIndex.y, 2.0))\n                        + step(1.0, mod(dotIndex.z, 2.0))\n                    ), 2.0);\n\n                    return dotChoice * step(dotDistance, 0.5);\n                }\n\n                float pattern() {\n                    if (patternIndex == 0) {\n                        return stripePattern();\n                    }\n\n                    if (patternIndex == 1) {\n                        return checkerPattern();\n                    }\n\n                    if (patternIndex == 2) {\n                        return stripe2Pattern();\n                    }\n\n                    if (patternIndex == 3) {\n                        return dotPattern();\n                    }\n\n                    return 0.0;\n                }\n\n                void main() {\n                    vec3 pigmentColor = mix(baseColor, secondaryColor, pattern());\n\n                    vec3 lightDir = vec3(-0.5, 0.5, 1.0); // non-normalized to ensure top is at 1\n                    float light = max(0.0, dot(fragNormal, lightDir));\n\n                    float highlightMix = 1.75 * max(0.0, min(0.5, highlight - 0.25)); // clip off bouncy edges of value range\n\n                    gl_FragColor = vec4(mix(pigmentColor, highlightColor, highlightMix + (1.0 - highlightMix) * light), 1.0);\n                }\n            ',


























































































                attributes: {
                    position: _this._regl.buffer([
                    [-1, 1, 0], [-1, -1, 0], [-1, 1, 1], [-1, -1, 1], // left face
                    [-1, -1, 1], [-1, -1, 0], // degen connector
                    [-1, -1, 0], [1, -1, 0], [-1, -1, 1], [1, -1, 1], // front face
                    [1, -1, 1], [-1, -1, 1], // degen connector
                    [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1] // top face
                    ]),

                    normal: _this._regl.buffer([
                    [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], // left face
                    [-1, 0, 0], [0, -1, 0], // degen connector
                    [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], // front face
                    [0, -1, 0], [0, 0, 1], // degen connector
                    [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1] // top face
                    ]) },


                uniforms: {
                    camera: _this._regl.prop('camera'),
                    base: _this._regl.prop('base'),
                    radius: _this._regl.prop('radius'),
                    height: _this._regl.prop('height'),
                    highlight: _this._regl.prop('highlight'),
                    patternIndex: _this._regl.prop('patternIndex'),
                    patternSize: _this._regl.prop('patternSize'),
                    baseColor: _this._regl.prop('baseColor'),
                    secondaryColor: _this._regl.prop('secondaryColor'),
                    highlightColor: _this._regl.prop('highlightColor') },


                primitive: 'triangle strip',
                count: 4 + 2 + 4 + 2 + 4 });


            _this.setState({ graphicsInitialized: true });
        };_this._values = [].concat(values).map(function (value) {return Math.max(0, Math.min(1, value)) || 0;});if (_this._values.length < 1) {throw new Error('missing values');}_this.state = { barIsActive: _this._values.map(function () {return false;}), graphicsInitialized: false };_this._width = width;_this._height = height;_this._chartAreaW = 500;_this._chartAreaH = 300;_this._barSpacing = 10;_this._barExtraRadius = _this._barSpacing * 0.3;_this._patternSize = 50;_this._regl = null; // initialized after first render
        // reusable computation elements
        _this._barBaseVec2 = vec2.create();_this._barTopVec3 = vec3.create();return _this;}_createClass(BarChart3D, [{ key: '_setBarIsActive', value: function _setBarIsActive(index, status) {// reduce bar status state into new instance
            this.setState(function (state) {return { barIsActive: [].concat(state.barIsActive.slice(0, index), [!!status], state.barIsActive.slice(index + 1)) };});} }, { key: 'render', // eslint-disable-next-line max-statements
        value: function render() {var _this2 = this,_ref2;var baseColor = hex2vector(this.props.baseColor);
            var secondaryColor = hex2vector(this.props.secondaryColor);
            var highlightColor = hex2vector(this.props.highlightColor);
            var labelColorCss = this.props.labelColor;

            // chart 3D layout
            var barCellSize = this._chartAreaW / this._values.length;
            var barRadius = Math.max(this._barSpacing / 2, barCellSize / 2 - this._barSpacing); // padding of 10px
            var startX = -barCellSize * (this._values.length - 1) / 2;

            // animation setup (as single instance to help render scene in one shot)
            var motionDefaultStyle = {};
            var motionStyle = {};

            this._values.forEach(function (value, index) {
                var isActive = _this2.state.barIsActive[index];

                motionDefaultStyle['v' + index] = 0;
                motionStyle['v' + index] = spring(value, { stiffness: 320, damping: 12 });

                motionDefaultStyle['r' + index] = 0;
                motionStyle['r' + index] = spring(
                isActive ? _this2._barExtraRadius : 0, // @todo just animate in 0..1 range
                { stiffness: 600, damping: 18 });

            });

            return React.createElement(Chart3DScene, {
                    viewportWidth: this._width,
                    viewportHeight: this._height,
                    distance: this._chartAreaH * 4,
                    centerX: 0,
                    centerY: 0,
                    centerZ: this._chartAreaH / 2,
                    canvasRef: this._handleCanvasRef,
                    content3d: (_ref2 = {}, _defineProperty(_ref2, 'translate3d(' +
                    -this._chartAreaW / 2 + 'px, -40px, ' + this._chartAreaH + 'px) rotateX(90deg)',
                    this._values.map(function (value, index) {return React.createElement('div', {
                            key: index,
                            style: {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100px', // non-fractional size for better precision via scaling
                                height: _this2._chartAreaH + 'px',

                                // prevent from showing on mobile tap hover
                                // @todo reconsider for a11y
                                WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',

                                transformOrigin: '0 0',
                                transform: 'translate(' + index * barCellSize + 'px, 0px) scale(' + barCellSize / 100 + ', 1)' },

                            onMouseEnter: function onMouseEnter() {_this2._setBarIsActive(index, true);},
                            onMouseLeave: function onMouseLeave() {_this2._setBarIsActive(index, false);},
                            onClick: function onClick() {
                                if (_this2.props.onBarClick) {
                                    _this2.props.onBarClick(index);
                                }
                            } });})), _defineProperty(_ref2, 'translate(' + (



                    -this._chartAreaW / 2 + 10) + 'px, -60px)',
                    React.createElement('div', { style: {
                                whiteSpace: 'nowrap',

                                fontFamily: 'Michroma, Arial, sans-serif',
                                fontSize: '32px',
                                lineHeight: 1,
                                letterSpacing: '-2px',
                                color: labelColorCss } },
                        this.props.xLabel)), _defineProperty(_ref2, 'translate(' + (



                    this._chartAreaW / 2 + 10) + 'px, -40px) rotateX(90deg) rotateZ(90deg)',
                    React.createElement('div', { style: {
                                whiteSpace: 'nowrap',

                                fontFamily: 'Michroma, Arial, sans-serif',
                                fontSize: '40px',
                                lineHeight: 1,
                                letterSpacing: '-2px',
                                color: labelColorCss } },
                        this.props.yLabel)), _ref2) },


                function (cameraMat4) {return React.createElement('div', { style: {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                pointerEvents: 'none' // allow underlying hover areas to work as intended
                            } },

                        _this2.state.graphicsInitialized ? React.createElement(Motion, {
                                defaultStyle: motionDefaultStyle,
                                style: motionStyle },
                            function (motion) {
                                // general rendering refresh
                                _this2._regl.poll();

                                // clear canvas
                                // @todo set colour?
                                _this2._regl.clear({
                                    depth: 1 });


                                // chart bar display
                                _this2._values.forEach(function (value, index) {
                                    var motionValue = motion['v' + index];
                                    var motionExtraRadius = motion['r' + index];

                                    vec2.set(_this2._barBaseVec2, index * barCellSize + startX, barRadius - 40);

                                    // @todo sort out how the ReGL framebuffer clearing works with react-motion framerate
                                    _this2._barCommand({
                                        camera: cameraMat4,
                                        base: _this2._barBaseVec2,
                                        radius: barRadius + motionExtraRadius,
                                        height: _this2._chartAreaH * motionValue,
                                        highlight: motionExtraRadius / _this2._barExtraRadius,
                                        patternIndex: index % 4,
                                        patternSize: _this2._patternSize,
                                        baseColor: baseColor,
                                        secondaryColor: secondaryColor,
                                        highlightColor: highlightColor });

                                });

                                // manually flush
                                _this2._regl._gl.flush();

                                // no element actually displayed
                                return null;
                            }) : null,

                        _this2._values.map(function (value, index) {
                            // position overlay content on bar top
                            vec3.set(
                            _this2._barTopVec3,
                            index * barCellSize + startX,
                            barRadius - 40,
                            value * _this2._chartAreaH);


                            vec3.transformMat4(_this2._barTopVec3, _this2._barTopVec3, cameraMat4);

                            // convert from GL device space (-1 .. 1) to 2D CSS space
                            var x = (0.5 + 0.5 * _this2._barTopVec3[0]) * 100;
                            var y = (0.5 - 0.5 * _this2._barTopVec3[1]) * 100;

                            var barContent = _this2.props.renderBar && _this2.props.renderBar(
                            index,
                            _this2.state.barIsActive[index]);


                            // set up mouse listeners on overlay content to ensure hover continuity
                            return React.createElement('div', {
                                    key: index,
                                    style: {
                                        position: 'absolute',
                                        top: y + '%',
                                        left: x + '%',
                                        pointerEvents: 'auto' // restore interactivity
                                    },
                                    onMouseEnter: function onMouseEnter() {_this2._setBarIsActive(index, true);},
                                    onMouseLeave: function onMouseLeave() {_this2._setBarIsActive(index, false);} },
                                barContent || null);
                        }));});

        } }]);return BarChart3D;}(React.PureComponent);var


Chart3DScene = function (_React$PureComponent2) {_inherits(Chart3DScene, _React$PureComponent2);
    function Chart3DScene() {_classCallCheck(this, Chart3DScene);


        // reusable computation elements
        var _this3 = _possibleConstructorReturn(this, (Chart3DScene.__proto__ || Object.getPrototypeOf(Chart3DScene)).call(this));_this3._cameraMat4 = mat4.create();
        _this3._cameraPositionVec3 = vec3.create();return _this3;
    }_createClass(Chart3DScene, [{ key: 'render', value: function render()

        {var _this4 = this;
            mat4.perspective(this._cameraMat4, 0.5, this.props.viewportWidth / this.props.viewportHeight, 1, this.props.distance * 2.5);

            // camera distance
            vec3.set(this._cameraPositionVec3, 0, 0, -this.props.distance);
            mat4.translate(this._cameraMat4, this._cameraMat4, this._cameraPositionVec3);

            // camera orbit pitch and yaw
            mat4.rotateX(this._cameraMat4, this._cameraMat4, -1.0);
            mat4.rotateZ(this._cameraMat4, this._cameraMat4, Math.PI / 6);

            // camera offset
            vec3.set(this._cameraPositionVec3, -this.props.centerX, -this.props.centerY, -this.props.centerZ);
            mat4.translate(this._cameraMat4, this._cameraMat4, this._cameraPositionVec3);

            var cameraCssMat = 'matrix3d(' + this._cameraMat4.join(', ') + ')';

            // not clipping contents on root div to allow custom overlay content to spill out
            return React.createElement('div', {
                    style: {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%' } },


                React.createElement('canvas', {
                    style: {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%' },

                    width: this.props.viewportWidth,
                    height: this.props.viewportHeight,
                    ref: this.props.canvasRef }),


                React.createElement('div', { style: {
                            position: 'absolute',
                            zIndex: 0, // reset stacking context
                            top: 0,
                            left: 0,

                            // apply camera matrix, center transform and emulate WebGL device coord range (-1, 1)
                            transformStyle: 'preserve-3d' },
                        ref: function ref(node) {
                            if (node) {
                                var realViewWidth = node.parentElement.offsetWidth;
                                var realViewHeight = node.parentElement.offsetHeight;

                                node.style.transform = '\n                        translate(' +
                                realViewWidth / 2 + 'px, ' + realViewHeight / 2 + 'px)\n                        scale(' +
                                realViewWidth / 2 + ', ' + -realViewHeight / 2 + ')\n                        ' +
                                cameraCssMat + '\n                    ';

                            }
                        } },
                    Object.keys(this.props.content3d).map(function (modelTransform) {return React.createElement('div', {
                                key: modelTransform,
                                style: {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,

                                    // transform in the XY plane, flipping first
                                    transformStyle: 'preserve-3d',
                                    transformOrigin: '0 0',
                                    transform: modelTransform + ' scale(1, -1)' } },

                            _this4.props.content3d[modelTransform]);})),



                this.props.children(this._cameraMat4, cameraCssMat));

        } }]);return Chart3DScene;}(React.PureComponent);


// from npmjs/nice-color-palettes
var colorPalettes = [
["#69d2e7", "#a7dbd8", "#e0e4cc", "#f38630", "#fa6900"], ["#fe4365", "#fc9d9a", "#f9cdad", "#c8c8a9", "#83af9b"], ["#ecd078", "#d95b43", "#c02942", "#542437", "#53777a"], ["#556270", "#4ecdc4", "#c7f464", "#ff6b6b", "#c44d58"], ["#774f38", "#e08e79", "#f1d4af", "#ece5ce", "#c5e0dc"],
["#e8ddcb", "#cdb380", "#036564", "#033649", "#031634"], ["#490a3d", "#bd1550", "#e97f02", "#f8ca00", "#8a9b0f"], ["#594f4f", "#547980", "#45ada8", "#9de0ad", "#e5fcc2"], ["#00a0b0", "#6a4a3c", "#cc333f", "#eb6841", "#edc951"], ["#e94e77", "#d68189", "#c6a49a", "#c6e5d9", "#f4ead5"]];


var mockStockList = [
'Trading YTD',
'Last Session',
'After Hours'];


var mockSalesList = [
'Q1 Prev Year',
'Q3 This Year',
'YoY Change',
'Historical'];


var mockRequestMetricList = [
'Response',
'IO Wait',
'Peak Lag'];


// credit: https://gist.github.com/blixt/f17b47c62508be59987b
function randomize(seed) {
    var intSeed = seed % 2147483647;
    var safeSeed = intSeed > 0 ? intSeed : intSeed + 2147483646;
    return safeSeed * 16807 % 2147483647;
}

function getRandomizedFraction(seed) {
    return (seed - 1) / 2147483646;
}var

RandomChart = function (_React$PureComponent3) {_inherits(RandomChart, _React$PureComponent3);
    function RandomChart(props) {_classCallCheck(this, RandomChart);


        // seeded random generation for predictable results
        var _this5 = _possibleConstructorReturn(this, (RandomChart.__proto__ || Object.getPrototypeOf(RandomChart)).call(this));var startSeed = Math.floor(Math.random() * 1000000);
        var random1 = randomize(startSeed);
        var random2 = randomize(random1);
        var random3 = randomize(random2);
        var random4 = randomize(random3);

        var mode = getRandomizedFraction(random1);
        var textSelector = getRandomizedFraction(random2);
        var paletteSelector = getRandomizedFraction(random3);
        var seriesLengthSelector = getRandomizedFraction(random4);

        _this5._textInfo = null;

        _this5._idNumber = random2 % 100000;

        if (mode < 0.2) {
            _this5._textInfo = {
                xLabel: 'STOCK: ' + mockStockList[Math.floor(textSelector * mockStockList.length)],
                yLabel: 'PRICE' };

        } else if (mode < 0.6) {
            _this5._textInfo = {
                xLabel: 'SALES: ' + mockSalesList[Math.floor(textSelector * mockSalesList.length)],
                yLabel: 'VOLUME' };

        } else {
            _this5._textInfo = {
                xLabel: 'REQUEST: ' + mockRequestMetricList[Math.floor(textSelector * mockRequestMetricList.length)],
                yLabel: 'TIME (ms)' };

        }

        // start with default palette at first, then randomize
        var paletteIndex = Math.floor(paletteSelector * colorPalettes.length);
        _this5._palette = colorPalettes[paletteIndex];

        _this5._series = Array.apply(undefined, _toConsumableArray(new Array(3 + Math.floor(seriesLengthSelector * 10)))).reduce(
        function (itemSeedList) {
            var prevSeed = itemSeedList.length > 0 ? itemSeedList[itemSeedList.length - 1] : random4;
            return itemSeedList.concat([randomize(prevSeed)]);
        },
        []).
        map(function (itemSeed) {return getRandomizedFraction(itemSeed);});return _this5;
    }_createClass(RandomChart, [{ key: 'render', value: function render()

        {var _this6 = this;
            // update body background
            document.body.style.background = this._palette[0];

            return (
                React.createElement(BarChart3D, {
                    values: this._series,
                    width: 480,
                    height: 360,
                    xLabel: this._textInfo.xLabel,
                    yLabel: this._textInfo.yLabel,
                    baseColor: this._palette[3],
                    secondaryColor: this._palette[4],
                    highlightColor: this._palette[2],
                    labelColor: this._palette[1],
                    renderBar: function renderBar(index, isActive) {return isActive ?
                        React.createElement('span', { className: 'random-chart__hover-label' },
                            React.createElement('span', { className: '_arrow' }),

                            '0.' + Math.floor(100 + _this6._series[index] * 100).toString().slice(-2)) :

                        null;} }));



        } }]);return RandomChart;}(React.PureComponent);var



Main = function (_React$PureComponent4) {_inherits(Main, _React$PureComponent4);
    function Main() {_classCallCheck(this, Main);var _this7 = _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).call(this));


        _this7.state = {
            count: 0 };return _this7;

    }_createClass(Main, [{ key: 'render', value: function render()

        {var _this8 = this;
            return React.createElement('div', { className: 'main' },
                React.createElement('div', { className: '_chart' }, React.createElement(RandomChart, { key: this.state.count })),
                React.createElement('button', {
                        type: 'button',
                        onClick: function onClick() {return _this8.setState(function (state) {return (
                                    { count: state.count + 1 });});} }, 'Generate'));



        } }]);return Main;}(React.PureComponent);


WebFont.load({
    google: {
        families: ['Michroma'] },


    active: function active() {
        ReactDOM.render(
        React.createElement(Main),
        document.getElementById('app'));

    } });