function getArrayWithNoise(array, noise) {
  return array.map(function (item) {return item + getRandomBetween(noise);});
}

function getRandomBetween(value) {
  var floor = -value;
  return floor + Math.random() * value * 2;
}

var instance = void 0;

function createInstance() {
  var duration = 0.7;

  var geometry = new THREE.IcosahedronGeometry(0.8, 0);

  // const multiplier = 50;

  var material = new THREE.MeshPhongMaterial({
    color: "#E2A9E5",
    emissive: "#632C65",
    flatShading: true,
    shininess: 100 });


  var castShadow = true;

  var S = 20;
  var positions = [];
  for (var z = -S; z < S; z += 1) {
    for (var x = -S; x < S; x += 1) {
      positions.push(x, z);
    }
  }

  var multiplier = positions.length / 2;

  var attributes = [
  {
    name: "aPositionStart",
    size: 3,
    data: function data(i) {return [positions[i * 2], 0, positions[i * 2 + 1]];} },

  {
    name: "aControlPointOne",
    data: function data(i) {return [positions[i * 2], 0, positions[i * 2 + 1]];},
    size: 3 },

  {
    name: "aControlPointTwo",
    data: function data(i) {return [positions[i * 2], 0, positions[i * 2 + 1]];},
    size: 3 },

  {
    name: "aPositionEnd",
    size: 3,
    data: function data(i) {return [positions[i * 2], 0, positions[i * 2 + 1]];} },

  {
    name: "aOffset",
    data: function data(i) {return [i * ((1 - duration) / (multiplier - 1))];},
    size: 1 }];



  var uniforms = {
    time: {
      value: 0.25 } };



  var vertex = "\n    attribute vec3 aPositionStart;\n    attribute vec3 aControlPointOne;\n    attribute vec3 aControlPointTwo;\n    attribute vec3 aPositionEnd;\n    attribute float aOffset;\n    uniform float time;\n\n    float easeInOutSin(float t){\n      return (1.0 + sin(" +








  Math.PI + " * t - " + Math.PI + " / 2.0)) / 2.0;\n    }\n\n    vec4 quatFromAxisAngle(vec3 axis, float angle) {\n      float halfAngle = angle * 0.5;\n      return vec4(axis.xyz * sin(halfAngle), cos(halfAngle));\n    }\n\n    vec3 rotateVector(vec4 q, vec3 v) {\n      return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);\n    }\n\n    vec3 bezier4(vec3 a, vec3 b, vec3 c, vec3 d, float t) {\n      return mix(mix(mix(a, b, t), mix(b, c, t), t), mix(mix(b, c, t), mix(c, d, t), t), t);\n    }\n\n    void main(){\n      float tProgress = easeInOutSin(min(1.0, max(0.0, (time - aOffset)) / " +
















  duration + "));\n      vec4 quatX = quatFromAxisAngle(vec3(1.0, 0.0, 0.0), -10.0 * tProgress);\n      vec4 quatY = quatFromAxisAngle(vec3(0.0, 0.0, 0.0), -5.0 * tProgress);\n      vec3 basePosition = rotateVector(quatX, rotateVector(quatY, position));\n      vec3 newPosition = bezier4(aPositionStart, aControlPointOne, aControlPointTwo, aPositionEnd, tProgress);\n      float scale = tProgress * 2.0 - 1.0;\n      scale = 1.0 - scale * scale;\n      basePosition *= scale;\n      gl_Position = basePosition + newPosition;\n    }\n  ";











  //      vNormal = rotateVector(quatX, vNormal);
  instance = new THREE.Phenomenon({
    geometry: geometry,
    multiplier: multiplier,
    material: material,
    castShadow: castShadow,
    attributes: attributes,
    uniforms: uniforms,
    vertex: vertex });


  scene.add(instance.mesh);
}

// Base structure --

var renderer = new THREE.WebGLRenderer({
  antialias: true });


renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setClearColor(0x212121, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(1);

document.querySelector("body").appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
40,
window.innerWidth / window.innerHeight,
0.1,
10000);

camera.position.set(0, 20 * 1, 35 * 1);
camera.lookAt(scene.position);
scene.add(camera);

var ambientLight = new THREE.AmbientLight("#ffffff", 0.1);
scene.add(ambientLight);

var plane = new THREE.Mesh(
new THREE.PlaneGeometry(1000, 1000),
new THREE.MeshPhongMaterial({
  emissive: "#4B384C" }));


plane.receiveShadow = true;
plane.position.y = -15;
plane.rotation.x = Math.PI * -0.5;
scene.add(plane);

var light = new THREE.SpotLight(0xffffff, 3, 80, Math.PI * 0.25, 1, 2);
light.position.set(0, 40, 0);
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 31;

scene.add(light);

function animate() {
  requestAnimationFrame(animate);
  if (instance.uniforms.time.value >= 1) {
    instance.uniforms.time.value = 0;
  }
  instance.uniforms.time.value += 1 / (6 * 60);
  renderer.render(scene, camera);
}

createInstance();
animate();

window.addEventListener(
"resize",
function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
},
false);