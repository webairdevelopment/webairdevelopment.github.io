console.clear();

const canvas = document.getElementById('canvas');
const videoDom = document.getElementById('video');
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, 1, 1000);

var quad = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertex-shader').textContent,
    fragmentShader: document.getElementById('fragment-shader').textContent,
    depthWrite: false,
    depthTest: false,
    uniforms: {
      delta: {
        value: 1.0
      },
      detail: {
        value: 0.5
      },
      resolution: {
        value: new THREE.Vector2(0, 0)
      }
    }
  })
);
scene.add(quad);

function onResize () {
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  camera.aspect = canvas.clientWidth /  canvas.clientHeight;
  quad.material.uniforms.resolution.value = new THREE.Vector2(canvas.clientWidth,  canvas.clientHeight);
}

function render(a) {
  requestAnimationFrame(render);
  
  quad.material.uniforms.delta.value = a;

  renderer.render(scene, camera);
}

onResize();
window.addEventListener('resize', onResize);
window.addEventListener('mousemove', (e) => {
  quad.material.uniforms.detail.value = (e.clientY / window.innerHeight);
});
requestAnimationFrame(render);