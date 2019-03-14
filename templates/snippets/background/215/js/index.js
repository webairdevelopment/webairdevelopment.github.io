var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var ParticleEmitter = function ParticleEmitter() {
  this.birthrate = 10;
  this.longevity = 10;
  this.positionX = 0;
  this.positionY = 0;
  this.positionZ = 100;
  this.radiusX = 1000;
  this.radiusY = 1000;
  this.radiusZ = 1000;
  this.velocity = 0.5;
  this.gravity = 1;
  this.resistance = 0.8;
  this.extra = 0.8;
  this.extraAngle = 0.8;
  this.maxOpacity = 0.75;
  this.size = 10;
  this.sizeRandom = 2;
  this.color = [152, 135, 192];
  this.colorRandom = 0.2;
};

var pdata = new ParticleEmitter();

var clock = new THREE.Clock(true);var

Scene = function () {

  function Scene() {_classCallCheck(this, Scene);
    this.tick = 0;

    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: document.getElementById('surface') });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0x000000);
    this.renderer.setSize(window.innerWidth, window.innerHeight);



    var width = window.innerWidth;
    var height = window.innerHeight;
    this.camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0.1, 20000);
    this.camera.position.z = 2000;


    this.controls = new THREE.OrbitControls(this.camera);
    this.controls.target.set(0, 0, 0);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
    this.controls.keys = [65, 83, 68];


    var textureLoader = new THREE.TextureLoader();
    this.particleSystem = new THREE.GPUParticleSystem({
      particleNoiseTex: textureLoader.load("https://cors-anywhere.herokuapp.com/https://www.radiolights.com/CODEPEN/perlin-512.png"),
      particleSpriteTex: textureLoader.load("https://cors-anywhere.herokuapp.com/https://www.radiolights.com/CODEPEN/particle2.png"),
      maxParticles: 250000 });

    this.scene.add(this.particleSystem);



    this.addText();
    this.addLight();

    this.addTimeline();
    document.body.onclick = this.addTimeline.bind(this);
  }_createClass(Scene, [{ key: "addTimeline", value: function addTimeline()

    {
      var tl = new TimelineMax();
      tl.set(this.camera.position, { y: 0, x: 0 });
      tl.set(this.camera.rotation, { y: 0, x: 0 });

      tl.to(this.camera.position, .2, { y: 50, ease: Quad.easeOut });
      tl.to(this.camera.position, .5, { y: -200, ease: Quad.easeInOut });

      tl.to(this.camera.position, 0.8, { x: -20, y: -210, ease: Quad.easeInOut });

      tl.to(this.camera.position, 0.7, { x: 100, ease: Quad.easeOut }, 1.5);
      tl.to(this.camera.position, 1, { y: 60, ease: Quad.easeOut }, 1.5);
      tl.to(this.camera.position, 0.7, { x: -100, ease: Quad.easeInOut }, 2.1);
      tl.to(this.camera.position, 0.7, { y: 70, ease: Quad.easeInOut }, 2.1);
      tl.to(this.camera.position, 0.7, { x: 50, ease: Quad.easeOut });
      tl.to(this.camera.position, 0.5, { y: 0, ease: Quad.easeOut }, '-=0.7');
      tl.to(this.camera.position, 0.2, { x: 0, ease: Quad.easeIn });
    } }, { key: "addText", value: function addText()

    {
      var loader = new THREE.FontLoader();
      var font = loader.parse(fontJSON);
      var geometry = new THREE.TextGeometry('WebAir.tk', {
        font: font,
        size: 120,
        height: 5000,
        material: 0,
        bevelThickness: 1,
        extrudeMaterial: 1 });

      var material = new THREE.MeshPhongMaterial({
        color: 0xF3FFE2,
        shading: THREE.FlatShading });

      this.cube = new THREE.Mesh(geometry, material);
      this.cube.position.set(-350, -100, -3200);
      this.cube.castShadow = true;
      this.cube.receiveShadow = true;
      this.scene.add(this.cube);


      var planeGeo = new THREE.PlaneGeometry(10000, 10000, 10, 10);
      var planeMat = new THREE.MeshLambertMaterial({
        color: 0xffffff });

      this.plane = new THREE.Mesh(planeGeo, planeMat);
      this.plane.position.set(0, 0, -3200);
      this.plane.visible = false;
      this.plane.receiveShadow = true;
      this.scene.add(this.plane);

    } }, { key: "addLight", value: function addLight()

    {
      var light1 = new THREE.PointLight(0x1695A3, 1, 500);
      light1.position.set(-200, 200, 2000);
      this.scene.add(light1);

      var light3 = new THREE.PointLight(0xEB7F00, 2, 1000);
      light3.position.set(300, 200, 2000);
      this.scene.add(light3);

      var light5 = new THREE.PointLight(0x1695A3, 1.5, 5000);
      light5.position.set(0, -500, 800);
      this.scene.add(light5);


      var directionalLight = new THREE.DirectionalLight(0x1695A3, 1, 500);
      directionalLight.position.set(-200, 200, 2000);
      directionalLight.castShadow = true;
      directionalLight.shadow.camera.near = 1;
      directionalLight.shadow.camera.far = 10000;
      directionalLight.shadow.camera.left = -2000;
      directionalLight.shadow.camera.right = 2000;
      directionalLight.shadow.camera.top = 2000;
      directionalLight.shadow.camera.bottom = -2000;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      this.scene.add(directionalLight);
    } }, { key: "resize", value: function resize()

    {

    } }, { key: "animate", value: function animate()

    {
      this.controls.update();

      var delta = clock.getDelta() * 1; //time scale
      this.tick += delta;
      if (this.tick < 0) this.tick = 0;

      if (delta > 0) {

        for (var x = 0; x < pdata.birthrate * 1000 * delta; x++) {

          var px = Math.random() * pdata.radiusX * 2 - pdata.radiusX;
          var py = Math.random() * pdata.radiusY * 2 - pdata.radiusY;
          var pz = Math.random() * pdata.radiusZ * 2 - pdata.radiusZ;

          var color = 0x1695A3;

          this.particleSystem.spawnParticle({
            position: new THREE.Vector3(pdata.positionX + px, pdata.positionY + py, pdata.positionZ + pz),
            positionRandomness: 0,
            velocity: new THREE.Vector3(0, -pdata.gravity, 0),
            velocityRandomness: pdata.velocity,
            color: color,
            colorRandomness: pdata.colorRandom,
            turbulence: 0,
            lifetime: pdata.longevity,
            size: pdata.size,
            sizeRandomness: pdata.sizeRandom });

        }
      }

      this.particleSystem.update(this.tick);
    } }, { key: "render", value: function render()

    {
      this.animate();
      this.renderer.render(this.scene, this.camera);
    } }]);return Scene;}();


var emitter = new Scene();

function animate() {
  emitter.render();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);