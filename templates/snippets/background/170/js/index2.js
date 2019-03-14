var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}} // This keeps track of the actual mouse position
var mouse = new Vector(0, 0);
// This is the position of the printer, lags behind the mouse pos because of `speed`
var printer = new Vector(window.innerWidth * .5, window.innerHeight * .5);
// The last position that there was a print
var lastPrintPos = new Vector(0, 0);
// The speed of the printer
var speed = 2;
// The amount of space between each print, this is sort of treated like a threshold, 
// so that when the printer moves, if the movement since the last print is greater
// than this number, a new print is made
var distanceBetweenPrints = 25;
// This determines lef/right transition
var lastPrintSide = false;
// this determines how far left or right the print should be
var offsetLength = 20;
// this is used to detemine if the mouse has moved soe that we can create a pattern
// that demonstrates the effect prior to the user moving their mouse.
var mousemoved = false;

// Listen to mouse move
window.addEventListener('mousemove', function (e) {
  mousemoved = true;
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// This is just a class that encapsulates all of the basic functionality of each paw print.
var Print = function () {
  function Print(pos, angle) {_classCallCheck(this, Print);
    this.el = document.createElement('div');
    this.el.style.transform = 'translate(' + pos.x + 'px, ' + pos.y + 'px) rotate(' + angle + 'deg)';
    this.alive = true;
  }_createClass(Print, [{ key: 'opacity', set: function set(

    value) {
      if (value > 0.01) {
        this._opacity = value;
        this.el.style.opacity = value;
      }if (value <= 0.01) {
        this.alive = false;
        removePrint(this);
      }
    }, get: function get()
    {
      return this._opacity || 1;
    } }, { key: 'alive', set: function set(

    value) {
      this._alive = value === true;
      if (this.alive === true) {
        this.el.className = 'print alive';
      } else {
        this.el.className = 'print dead';
      }
    }, get: function get()
    {
      return this._alive === true;
    } }]);return Print;}();


var prints = [];
var addPrint = function addPrint(pos, direction) {
  var print = new Print(pos, direction.angleInDegrees + 90);
  document.body.appendChild(print.el);
  prints.push(print);

};
var removePrint = function removePrint(printToRemove) {
  prints.forEach(function (print, i) {
    if (printToRemove === print) {
      prints.splice(i, 1);
      document.body.removeChild(print.el);
    }
  });
};

var tracer = document.createElement('div');
tracer.className = 'tracer';
document.body.appendChild(tracer);

var start = 3200;
var runtime = function runtime(delta) {

  delta += start;

  // If the mouse hasn't moved yet, we just create a figure-8 pattern for the printer
  if (mousemoved === false) {
    mouse.x = window.innerWidth * .5 + Math.cos(delta * .0005) * (window.innerWidth * .45);
    mouse.y = window.innerHeight * .5 + Math.sin(delta * .001) * (window.innerWidth * .25);
  }

  // First we subtract the position of the printer from the mouse to get our distance vector
  var distance = mouse.subtractNew(printer);
  // Then we normalise it and multiply it by the speed of the printer to get the directiona and the distance we need to move
  var direction = distance.normaliseNew().multiplyScalar(speed);
  // Then we add this to the printer
  printer.add(direction);

  // This is here for testing purposes and just allows us to see where the printer is at any given time
  // Uncomment the line in the CSS panel to see this
  tracer.style.transform = 'translate(' + printer.x + 'px, ' + printer.y + 'px)';

  // So here we test whether the distance between the last time we created a paw and the printer is
  // greater than our creation threshold (distanceBetweenPrints)
  if (printer.subtractNew(lastPrintPos).length >= distanceBetweenPrints) {

    // Create the current printer location as the last print position
    lastPrintPos = printer.clone();
    // Alternate between left and right paw
    lastPrintSide = !lastPrintSide;
    // This determines how far off-center the paw appears
    var printOffset = new Vector(offsetLength, 0);
    if (lastPrintSide === true) {
      printOffset = new Vector(-offsetLength, 0);
    }
    printOffset.rotateBy(direction.angle + 1.5708);
    // Finally add the paw print
    addPrint(lastPrintPos.addNew(printOffset), direction);
  }

  // Reduce the opacity of each paw print by a multiplicant
  // This produces our fade
  prints.forEach(function (print, i) {
    print.opacity = print.opacity * .99;
  });

  // Update our speed based on the distance from the printer to the mouse position and clamp it between 2 and 10
  speed = distance.length * .05;
  if (speed < 2) speed = 2;
  if (speed > 10) speed = 10;
  distanceBetweenPrints = 12 * speed * .5;
  if (distanceBetweenPrints < 25) distanceBetweenPrints = 25;


  requestAnimationFrame(runtime);
};

requestAnimationFrame(runtime);