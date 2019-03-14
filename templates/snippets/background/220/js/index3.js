var render = function render(timeStamp) {
    if (timeStamp) {
        var progress = (timeStamp - lastTimeStamp) * 0.001;
        mesh.material.uniforms.time.value += progress;
        mesh.material.uniforms.mouse.value.x = mousePoint.x;
        mesh.material.uniforms.mouse.value.y = mousePoint.y;
        renderer.render(scene, camera);
        lastTimeStamp = timeStamp;
    }
    requestAnimationFrame(render);
};

var onResize = function onResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    mesh.material.uniforms.resolution.value.x = width;
    mesh.material.uniforms.resolution.value.y = height;
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
};

var lastTimeStamp = 0;
var mousePoint = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2 };


/* datGUI
                                 --------------------------------------*/
var gui = new dat.GUI();
gui.width = 280;
var guiControls = new function () {
    this.mouseInteraction = true;
}();
gui.add(guiControls, 'mouseInteraction').onChange(function (bool) {
    mesh.material.uniforms.isMouseInteraction.value = bool;
});

/* scene
    --------------------------------------*/
var scene = new THREE.Scene();

/* renderer
                               --------------------------------------*/
var renderer = new THREE.WebGLRenderer();
// renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(new THREE.Color(0x000000));
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('WebGL-output').appendChild(renderer.domElement);
renderer.domElement.addEventListener('mousemove', function (e) {
    mousePoint.x = e.offsetX;
    mousePoint.y = e.offsetY;
});

/* camera
    --------------------------------------*/
var camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 0, 0.1);

/* mesh
                                                                                                                                                   --------------------------------------*/
var uniforms = {
    time: {
        type: 'f',
        value: Math.random() * 100 },

    resolution: {
        type: 'v2',
        value: new THREE.Vector2(window.innerWidth, window.innerHeight) },

    mouse: {
        type: 'f',
        value: new THREE.Vector2() },

    isMouseInteraction: {
        type: 'bool',
        value: guiControls.mouseInteraction } };


var shaderMaterial = new THREE.RawShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById('vs').textContent,
    fragmentShader: document.getElementById('fs').textContent });

var planeBufferGeometry = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
var mesh = new THREE.Mesh(planeBufferGeometry, shaderMaterial);
scene.add(mesh);

/* add event on window
                 --------------------------------------*/
window.addEventListener('resize', onResize, false);

render();