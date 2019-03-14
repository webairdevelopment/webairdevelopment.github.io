// ********************** GLOBALS ******************************//
var W=window.innerWidth, H=window.innerHeight;
var canvas = document.getElementById("canvas");
var rendererBackground = "#2f2f2f";
var colorArray = ["#111", "#333", "#555", "#777", "#999", "#bbb", "#ddd", "#fff"];

var renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, W/H, 0.1, 3000);
var light = new THREE.DirectionalLight("#fff", 1);

var geometry, material, mesh;
// ********************** GLOBALS ******************************//

// setup
function start(){
  // confifure renderer
  renderer.setClearColor(rendererBackground);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(W,H);
  // confifure Camera
  camera.position.set(0,0,500);
  // confifure Light
  light.position.set(0,0,1);

  var noOfTargets = Math.floor(Math.random() * (450 - 350 + 1)) + 350;
  for(var v=0;v<noOfTargets;v++){
    var r = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
    var x = Math.floor(Math.random() * (300 - (-300) + 1)) -(300);
    var y = Math.floor(Math.random() * ((300) - (-300) + 1)) -(300);
    addTargetToScene(drawTarget(r,x,y));

  }

  scene.add(light);

  /////
  update();
}

// draw/Game Logic
function update(){
  requestAnimationFrame(update);
  ////

  camera.position.z -= 0.5;
  if(camera.position.z < 0){
    camera.position.z = 500;
  }

  ////
  renderer.render(scene, camera);
}


// draws circle
function drawCircle(radius,bgColor, x=0,y=0,z=0){
  var geometry = new THREE.CircleGeometry(radius,64);
  var material = new THREE.MeshLambertMaterial({color: bgColor});
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x,y,z);
  return mesh;
}

// draw Target
function drawTarget(radius,x=0,y=0){
  meshArr = [];
  for(var v=0, i=0;v<colorArray.length;v++, i+= (radius/colorArray.length)){
    meshArr.push(drawCircle(radius-i, colorArray[v], x,y, v*10));
  }
  return meshArr;
}

//function addTargetTO scene
function addTargetToScene(meshArr){
  for(var v=0; v<meshArr.length;v++){
    scene.add(meshArr[v]);
  }
  return meshArr;
}

// for Responsiveness
window.addEventListener('resize', function(e){
  W = window.innerWidth;
  H = window.innerHeight;
  renderer.setSize(W,H);
  aspectRatio = W/H;
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();
});

// ********************** MAIN ********************************//
start();