var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}console.clear();

var h = window.innerHeight,
w = window.innerWidth;

var rMajor = 400,
rMinor = 145,
slices = 270,
tubeSides = 3, // need to update the surface display logic to accomodate !== 3
twistRate = 0.00002,
twists = 6; // currently no effect

var torus;

function setup() {
  createCanvas(w, h, WEBGL);
  torus = new TwistedTorus(rMajor, rMinor, slices, tubeSides, twistRate);
  noStroke();
  camera(0, -rMajor * 2, rMajor * 2.3, 0, 0, 0, 0, 1, 0);
  var rPointLights = rMajor + rMinor;
  for (var a = 0; a < TAU; a += TAU / 7) {
    pointLight(120, 120, 120, rPointLights * cos(a), -rMinor * 3 / 2, rPointLights * sin(a)); // front
  }
  directionalLight(75, 75, 75, 1, 0, -1);
  colorMode(HSL);
}

function draw() {
  orbitControl();
  background(0);
  torus.convolve();
  torus.display();
  sphere(0); // this is a hack to force P5 to select the correct shader :)
}var

TwistedTorus = function () {
  function TwistedTorus(R, r, detailMajor, detailMinor, dPhi) {_classCallCheck(this, TwistedTorus);
    this.rMajor = R,
    this.rMinor = r,
    this.dTheta = TAU / detailMajor,
    this.sides = detailMinor,
    this.dPhi = dPhi;
    this.phi = 0;
    this.radPerSide = TAU / this.sides;
    this.convolve();
  }_createClass(TwistedTorus, [{ key: "convolve", value: function convolve()

    {
      this.vertices = [];
      var v = 0;

      for (var theta = 0; theta < TAU; theta += this.dTheta) {
        var phi = theta + this.phi + v % this.sides * this.radPerSide,
        R_r_cosPhi = this.rMajor + this.rMinor * cos(phi),
        x = R_r_cosPhi * cos(theta),
        y = rMinor * sin(phi),
        z = R_r_cosPhi * sin(theta);
        this.vertices.push([x, y, z]);
        this.phi += this.dPhi;
        v++;
      }
    } }, { key: "display", value: function display()

    {
      var l = this.vertices.length - 1;

      for (var i = 0; i < this.vertices.length; i++) {
        var _h = i * 360 / this.vertices.length,
        i_1 = (i + 1) % l,
        i_3 = (i + 3) % l,
        i_4 = (i + 4) % l;

        specularMaterial(_h, 100, 45);
        beginShape(TRIANGLE_STRIP);
        vertex(this.vertices[i][0], this.vertices[i][1], this.vertices[i][2]);
        vertex(this.vertices[i_1][0], this.vertices[i_1][1], this.vertices[i_1][2]);
        vertex(this.vertices[i_3][0], this.vertices[i_3][1], this.vertices[i_3][2]);
        vertex(this.vertices[i_4][0], this.vertices[i_4][1], this.vertices[i_4][2]);
        endShape();
      }
    } }]);return TwistedTorus;}();