//************************ GLOBALS ***************************** //
var W=window.innerWidth, H=window.innerHeight;
var canvas = document.getElementById("canvas");
var rendererBackground ="#222";

var renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
var camera = new THREE.PerspectiveCamera(75, W/H, 0.1, 3000);
var scene = new THREE.Scene();
var light = new THREE.DirectionalLight("#fff", 1);

var mouseX=0,mouseY=0,pmouseX=0,pmouseY=0;
var colorPallete = ["#111", "#333", "#555", "#777", "#999", "#bbb", "#ddd", "#fff"];
var colorPallete = ["#00fb30", "#05c72a", "#029a1f", "#e0fb00", "#b8ab04", "#fbad00", "#c4b025", "#fff"];
var shapeIndex = 0;
var shapeArr = ["circle","sphere","plane","box"];
//************************ GLOBALS ***************************** //

function drawObject(x, y, px, py, color, shapeIndex){
  var speed = Math.abs(x-px) + Math.abs(y-py);
  if(speed >100){
    speed = 100;
  }
  // speed=50;
  console.log(shapeArr[shapeIndex]);
  if(shapeArr[shapeIndex] == "box"){
    var geometry = new THREE.BoxGeometry(speed, speed,speed);
  }
  if(shapeArr[shapeIndex] == "sphere"){
    var geometry = new THREE.SphereGeometry(speed, 32,32);
  }
  if(shapeArr[shapeIndex] == "plane"){
    var geometry = new THREE.PlaneGeometry(speed,speed);
  }
  if(shapeArr[shapeIndex] == "circle"){
    var geometry = new THREE.CircleGeometry(speed, 32);
  }
  var material = new THREE.MeshLambertMaterial({color: color, wireframe: true});
  var mesh = new THREE.Mesh(geometry,material);
  mesh.position.set(x,y,0);
  mesh.rotation.x = 0.5;
  scene.add(mesh);

  setTimeout(function(){
    scene.remove(mesh);
    geometry.dispose();geometry=undefined;
    material.dispose();material=undefined;
    mesh = undefined;
  },250);
}

// setup
function start(){
  renderer.setClearColor(rendererBackground);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(W,H);
  camera.position.set(0,0,500);
  light.position.set(0,0,1);

  // adding text
  // Add to Scene
  scene.add(light);
  ////
  update();
}
var colorIndex = 0;
// draw loop/ Game Logic
function update(){
  requestAnimationFrame(update);
  ////
  if(colorIndex>=colorPallete.length){
    colorIndex = 0;
  }
  drawObject(mouseX,mouseY,pmouseX,pmouseY, colorPallete[colorIndex],shapeIndex);
  colorIndex++;
  pmouseX = mouseX;
  pmouseY = mouseY;
  ////
  renderer.render(scene, camera);
}

window.addEventListener("mousemove", function(e){
  mouseX = e.clientX - W/2;
  mouseY = -(e.clientY - H/2);
});
window.addEventListener("mousedown", function(e){
    if(shapeIndex < shapeArr.length-1){
      ++shapeIndex;
    }else{
      shapeIndex = 0;
    }
    console.log(shapeIndex);
});

// for Responsiveness
window.addEventListener("resize", function(e){
  W = window.innerWidth;
  H = window.innerWidth;
  renderer.setSize(W,H);
  camera.aspect = W/H;
  camera.updateProjectionMatrix();
});
// ************************  MAIN *******************************//
start();