var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var parameters = {
    size: 30,
    radius: 1,
    proximity: 125,
    growth: 60,
    ease: 0.075,
    stats: false };var


Point =
function Point(x, y) {_classCallCheck(this, Point);
    this.x = x;
    this.y = y;
};var


Circle = function () {
    function Circle(radius, x, y) {_classCallCheck(this, Circle);
        this._radius = radius;
        this.radius = radius;
        this.growthValue = 0;
        this.position = new Point(x, y);
    }

    /**
       * @param {CanvasRenderingContext2D} context
       * @param {number} ease
       */_createClass(Circle, [{ key: "draw", value: function draw(
        context, ease) {
            this.radius += (this._radius + this.growthValue - this.radius) * ease;
            context.moveTo(this.position.x, this.position.y);
            context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        } }, { key: "addRadius", value: function addRadius(

        value) {
            this.growthValue = value;
        } }, { key: "x", get: function get()

        {
            return this.position.x;
        }, set: function set(

        value) {
            this.position.x = value;
        } }, { key: "y", get: function get()

        {
            return this.position.y;
        }, set: function set(

        value) {
            this.position.y = value;
        } }]);return Circle;}();var


Stamp =
function Stamp(id) {_classCallCheck(this, Stamp);
    var el = document.getElementById(id);
    var parent = el.parentElement;
    parent.removeChild(el);
    var chars = el.innerText.split("");
    chars.push(" ");
    for (var i = 0; i < chars.length; i++) {
        var span = document.createElement("span");
        span.innerText = chars[i];
        span.className = "char" + (i + 1);
        parent.appendChild(span);
    }
};


function init() {
    new Stamp("circle-content");
    var stats = new Stats();
    stats.showPanel(0);

    buildGUI();
    var imageLoaded = false;
    var canvas = document.getElementById("c");
    var image = new Image();
    var circles = [];
    var context = canvas.getContext("2d");
    window.addEventListener("resize", resizeHandler);
    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("touchmove", touchMoveHandler);
    resizeHandler();
    loadImage();
    build();

    function build() {
        circles = [];var
        size = parameters.size,radius = parameters.radius;
        var columns = Math.ceil(window.innerWidth / size) + 1;
        var rows = Math.ceil(window.innerHeight / size) + 1;
        var amount = Math.ceil(columns * rows);
        for (var i = 0; i < amount; i++) {
            var column = i % columns;
            var row = ~~(i / columns);
            circles.push(new Circle(radius, size * column, size * row));
        }
    }

    function mouseMoveHandler(event) {
        proximityHandler(event);
    }

    function touchMoveHandler(event) {
        proximityHandler(event.touches[0]);
    }

    function proximityHandler(event) {var
        proximity = parameters.proximity,growth = parameters.growth;var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
            for (var _iterator = circles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var c = _step.value;
                var distance = Math.sqrt(Math.pow(c.x - event.clientX, 2) + Math.pow(c.y - event.clientY, 2));
                var d = map(distance, c._radius, c._radius + proximity, growth, 0);
                if (d < 0) d = 0;
                c.addRadius(d);
            }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
    }

    function animate() {
        stats.begin();
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        context.save();
        context.beginPath();
        context.fillStyle = "#000000";
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {
            for (var _iterator2 = circles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var circle = _step2.value;
                circle.draw(context, parameters.ease);
            }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2.return) {_iterator2.return();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
        if (imageLoaded) {
            drawImage();
        } else {
            context.fill();
        }
        context.restore();
        stats.end();
        requestAnimationFrame(animate);
    }

    function buildGUI() {
        var gui = new dat.GUI({ closed: true });
        gui.closed = true;
        var sizeController = gui.add(parameters, "size", 5, 80);
        var radiusController = gui.add(parameters, "radius", 0.5, 20);
        gui.add(parameters, "proximity", 0, 300);
        gui.add(parameters, "growth", 1, 150);
        gui.add(parameters, "ease", 0.02, 0.15);
        var statsController = gui.add(parameters, "stats");

        sizeController.onFinishChange(function () {
            build();
        });

        radiusController.onFinishChange(function () {
            build();
        });

        statsController.onChange(function (value) {
            if (value) {
                document.body.appendChild(stats.dom);
            } else {
                stats.dom.parentNode.removeChild(stats.dom);
            }
        });
    }

    function drawImage() {
        context.clip();var
        naturalHeight = image.naturalHeight,naturalWidth = image.naturalWidth;
        var ratio = findPreferredRatio(naturalWidth, naturalHeight, window.innerWidth, window.innerHeight);
        var w = naturalWidth * ratio;
        var h = naturalHeight * ratio;
        var x = window.innerWidth / 2 - w / 2;
        var y = window.innerHeight / 2 - h / 2;
        context.drawImage(image, 0, 0, naturalWidth, naturalHeight, x, y, w, h);
    }

    function resizeHandler() {
        resizeCanvas(canvas);
        build();
    }

    function loadImage() {
        image.onload = function () {
            imageLoaded = true;
        };
        image.src = "http://chromecastbg.alexmeub.com/images/orig_AF1QipNnTHcFBE7xPRQnJrO4qx2FCXiJlQRB1TRyodVO.jpg";
    }

    animate();
}

init();

function normalize(value, min, max) {
    return (value - min) / (max - min);
}

function interpolate(value, min, max) {
    return min + (max - min) * value;
}

function map(value, min1, max1, min2, max2) {
    return interpolate(normalize(value, min1, max1), min2, max2);
}

function findPreferredRatio(width, height, maxWidth, maxHeight) {
    var dw = maxWidth / width;
    var dh = maxHeight / height;
    return dw > dh ? dw : dh;
}

function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}