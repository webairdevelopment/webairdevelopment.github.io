var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var w = window.innerWidth;
var h = window.innerHeight;
var numCircles = 60;

var ground = void 0;
var wall1 = void 0;
var wall2 = void 0;

var content = document.querySelector('.eyeball-physics');

// Matter.js module aliases
var elements = [];
var eyeballs = [];

window.addEventListener('resize', function (e) {
  w = window.innerWidth;
  h = window.innerHeight;
  engine.render.canvas.width = w;
  engine.render.canvas.height = h;

  Matter.Body.setPosition(wall2, Matter.Vector.create(w + 30, h * .5));
  Matter.Body.setPosition(ground, Matter.Vector.create(w * .5, h + 30));

});

// create a Matter.js engine
var engine = Matter.Engine.create(content, {
  render: {
    options: {
      width: w,
      height: h,
      wireframes: false,
      background: "#000000" } } });




window.engine = engine;

var mouseConstraint = Matter.MouseConstraint.create(engine, {
  constraint: {
    render: {
      visible: false },

    stiffness: 0.1 } });



var spritesArea = document.querySelector('.eyeball-sprites');var

Eyeball = function () {
  function Eyeball() {_classCallCheck(this, Eyeball);
    var x = Math.random() * w;
    var y = Math.random() * -h;
    var base = w / 30;
    if (base < 5) base = 5;
    if (base > 10) base = 10;
    var multiplier = w / 10;
    if (multiplier < 30) multiplier = 30;
    if (multiplier > 100) multiplier = 100;

    this.radius = base + Math.random() * multiplier;
    this.body = Matter.Bodies.circle(x, y, this.radius,
    { render: {
        fillStyle: 'black' } });


    this.element = document.createElement('div');
    this.element.className = 'eyeball ' + 'eyeball--' + Math.floor(Math.random() * 5);
    this.element.style.width = this.radius * 2 + 'px';
    this.element.style.height = this.radius * 2 + 'px';
    this.cornea = document.createElement('div');
    this.element.appendChild(this.cornea);
    spritesArea.appendChild(this.element);
  }_createClass(Eyeball, [{ key: 'update', value: function update()

    {
      this.pos = { x: this.body.position.x, y: this.body.position.y };
      this.element.style.transform = 'translate(' + (this.pos.x - this.radius - 8) + 'px, ' + (this.pos.y - this.radius - 8) + 'px)';
    } }, { key: 'lookAt', value: function lookAt(

    pos) {
      var diff = { x: pos.x - this.pos.x, y: pos.y - this.pos.y };
      var polar = [
      Math.sqrt(
      diff.x * diff.x + diff.y * diff.y),

      Math.atan2(diff.y, diff.x)];

      var dist = polar[0] < this.radius * .5 ? polar[0] : this.radius * .5;
      this.cornea.style.transform = 'translate(' + Math.cos(polar[1]) * dist + 'px, ' + Math.sin(polar[1]) * dist + 'px)';

      window.cornea = 'translate(' + Math.cos(polar[1]) * dist + 'px, ' + Math.sin(polar[1]) * dist + 'px)';
      window.polar = polar;
    } }]);return Eyeball;}();


var mousepos = { x: 0, y: 0 };

window.addEventListener('pointermove', function (e) {
  mousepos = { x: e.clientX, y: e.clientY };
});

// create two boxes and a ground
for (var i = 0; i < numCircles; i++)
{
  eyeballs.push(new Eyeball());
}
ground = Matter.Bodies.rectangle(w / 2, h + 30, 50000., 60, { isStatic: true });
wall1 = Matter.Bodies.rectangle(-30, h / 2, 60, h * 2, { isStatic: true });
wall2 = Matter.Bodies.rectangle(w + 30, h / 2, 60, h * 2, { isStatic: true });
window.wall2 = wall2;
elements.push(ground);
elements.push(wall1);
elements.push(wall2);

// add all of the bodies to the world
console.log(eyeballs.map(function (eyeball) {return eyeball.body;}).concat(elements));
Matter.World.add(engine.world, eyeballs.map(function (eyeball) {return eyeball.body;}).concat(elements));
Matter.World.add(engine.world, mouseConstraint);

// run the engine
Matter.Engine.run(engine);

Matter.Events.on(engine, "afterUpdate", function () {
  eyeballs.forEach(function (eye) {
    eye.update();
    eye.lookAt(mousepos);
  });
});