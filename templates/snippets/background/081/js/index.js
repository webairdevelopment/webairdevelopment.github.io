 var requestFullscreen =  function (ele) {
  if (ele.requestFullscreen) {
    ele.requestFullscreen();
  } else if (ele.webkitRequestFullscreen) {
    ele.webkitRequestFullscreen();
  } else if (ele.mozRequestFullScreen) {
    ele.mozRequestFullScreen();
  } else if (ele.msRequestFullscreen) {
    ele.msRequestFullscreen();
  } else {
    console.log('Fullscreen API is not supported.');
  }
}
 var exitFullscreen =  function (ele) {
  if (ele.exitFullscreen) {
    ele.exitFullscreen();
  } else if (ele.webkitExitFullscreen) {
    ele.webkitExitFullscreen();
  } else if (ele.mozCancelFullScreen) {
    ele.mozCancelFullScreen();
  } else if (ele.msExitFullscreen) {
    ele.msExitFullscreen();
  } else {
    console.log('Fullscreen API is not supported.');
  }
}



  //===================================================== add Scene
  var scene = new THREE.Scene();
 //===================================================== add Camera
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.x = 0;
  camera.position.y = 1;
  camera.position.z = 1000;

  //===================================================== add canvas
  var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.LinearToneMapping;
  var renderScene = new THREE.RenderPass(scene, camera);
  document.body.appendChild(renderer.domElement);

  //===================================================== add controls
  var controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.maxPolarAngle = Math.PI/2.1; 

 
  //===================================================== add floor
  THREE.ImageUtils.crossOrigin = '';
  var floorMap = THREE.ImageUtils.loadTexture( "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMaznkwKbnlWTf0zzL9uQrUQ2Q54MfyI7JC5m62icHR5oRjT1v" );
  floorMap.wrapS = floorMap.wrapT = THREE.RepeatWrapping;
  floorMap.repeat.set( 25, 25 );


  var groundMaterial = new THREE.MeshPhongMaterial( { color: new THREE.Color('#111'), specular: new THREE.Color('#444'), shininess: 100, bumpMap: floorMap } );
  var groundGeo = new THREE.PlaneGeometry( 500,500 );
  var ground = new THREE.Mesh( groundGeo, groundMaterial );


  ground.rotation.x = ( - Math.PI / 2 );
  ground.receiveShadow  = true;
  scene.add( ground );


//===================================================== add Model
//3d model from https://sketchfab.com/models/cad1fc9ada864e06ab69a37705656392
var drone = new THREE.Group();
var dronesize = 2.5;
scene.add(drone);
loader = new THREE.LegacyJSONLoader();
loader.load('https://raw.githubusercontent.com/baronwatts/models/master/drone.js', function (geometry, materials) {
 
  var matt = new THREE.MeshPhongMaterial( { color: new THREE.Color('#222'),  transparent:true, opacity:1,  side: THREE.DoubleSide } );
  var obj = new THREE.Mesh(geometry, matt);
  geometry.center();
  obj.scale.set(dronesize,dronesize,dronesize);
  obj.rotateY(Math.PI);
  obj.receiveShadow = true;
  obj.castShadow = true;
  drone.add(obj);

 });


//===================================================== add Model
loader = new THREE.LegacyJSONLoader();
loader.load('https://raw.githubusercontent.com/baronwatts/models/master/drone-lights.js', function (geometry, materials) {

  var matt = new THREE.MeshBasicMaterial( { color: new THREE.Color('white'),  transparent:true, opacity:1,  side: THREE.DoubleSide } );
  var obj = new THREE.Mesh(geometry, matt);
  geometry.center();
  obj.scale.set(dronesize,dronesize,dronesize);
  obj.position.y = 0;
  obj.position.x = 0;
  obj.position.z = 0;
  obj.rotateY(Math.PI);
  obj.receiveShadow = true;
  obj.castShadow = true;
  drone.add(obj);

 });




//===================================================== add curve
var segmentCount = 25;
var radius = 100;
var points = new Array(segmentCount)
  .fill(null)
  .map(
    (d, i) =>
      new THREE.Vector3(
        /*x*/ Math.cos(i / segmentCount * Math.PI * 2) * radius,
        /*y*/ 1,
        /*z*/ Math.sin(i / segmentCount * Math.PI * 2) * radius
      )
  );

var curvePath = new THREE.CatmullRomCurve3(points);
curvePath.closed = true;


var geometry = new THREE.TubeGeometry( curvePath, 300, 10, 20, true );

//Set a different color on each face
for(var i=0,j=geometry.faces.length;i<j;i++){
  geometry.faces[i].color = new THREE.Color(Math.random() * 0xfffff);
}

var material = new THREE.MeshPhongMaterial({side : THREE.BackSide, vertexColors : THREE.FaceColors, side: THREE.DoubleSide});
var tube = new THREE.Mesh( geometry,  material );
//scene.add( tube );




//===================================================== add model
var model;
var list = [];
var tunnelsize = 50;
loader = new THREE.LegacyJSONLoader();
loader.load('https://raw.githubusercontent.com/baronwatts/models/master/drone-tunnel.js', function (geometry, materials) {


  for(var i = 0; i < curvePath.points.length; i ++){

    var offsetBy = 1;
    var x = curvePath.points[i].x/ offsetBy;
    var y = curvePath.points[i].y;
    var z = curvePath.points[i].z/ offsetBy;

    var matt = new THREE.MeshPhongMaterial({ vertexColors: THREE.FaceColors, color: new THREE.Color('#222'), side: THREE.DoubleSide });
    model = new THREE.Mesh(geometry, matt);
    model.castShadow = true;

    model.position.set(x,0,z);
    model.scale.set(tunnelsize,tunnelsize,tunnelsize);
    model.lookAt(scene.position);
    list.push(model);
    scene.add(model);

  }

});



//===================================================== add model
var model;
var list = [];
loader = new THREE.LegacyJSONLoader();
loader.load('https://raw.githubusercontent.com/baronwatts/models/master/drone-tunnel-lights.js', function (geometry, materials) {


  for(var i = 0; i < curvePath.points.length; i ++){

    var offsetBy = 1;
    var x = curvePath.points[i].x/ offsetBy;
    var y = curvePath.points[i].y;
    var z = curvePath.points[i].z/ offsetBy;


    var matt = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors, color: new THREE.Color('#fff'), side: THREE.DoubleSide });
    model = new THREE.Mesh(geometry, matt);
    model.castShadow = true;

    model.position.set(x,0,z);
    model.scale.set(tunnelsize,tunnelsize,tunnelsize);
    model.lookAt(scene.position);
    list.push(model);
    scene.add(model);
  }

});





//===================================================== add road lines
var geomList = [];
for(var i = 0; i < curvePath.points.length; i ++){
  
    var offsetBy = 1;
    var x = curvePath.points[i].x/ offsetBy;
    var y = curvePath.points[i].y;
    var z = curvePath.points[i].z/ offsetBy;


    var geometry = new THREE.BoxGeometry( 5, .5, .5 );
    var material = new THREE.MeshBasicMaterial( { color: new THREE.Color("white"),  transparent:true, opacity:1, side: THREE.DoubleSide } );
    var obj = new THREE.Mesh( geometry, material );
    obj.position.set( x, 0, z );
    obj.rotateY(Math.PI/4);
    obj.receiveShadow = true;
    obj.castShadow = true;
    geomList.push(obj)
    scene .add(obj);


    geomList.map((d,i)=>{
      d.lookAt(scene.position);
    });

}




//===================================================== add light
var light = new THREE.PointLight(0xffffff,1, 100);
scene.add(light);




//===================================================== add VR
renderer.setPixelRatio( window.devicePixelRatio );//VR
effect = new THREE.StereoEffect( renderer );//VR
effect.setSize( window.innerWidth, window.innerHeight );//VR

var VR = false;
function toggleVR() {
  if ( VR ) {
    VR = false;
    controls = new THREE.OrbitControls( camera, renderer.domElement );
  } else {
    VR = true;
    controls = new THREE.DeviceOrientationControls( camera);
    requestFullscreen(document.documentElement);
  }
  renderer.setSize( window.innerWidth, window.innerHeight );
}

        
//===================================================== resize
window.addEventListener("resize", function() {
  let width = window.innerWidth;
  let height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});





//===================================================== Bloom effest gui (it's hidden)

 var shaderActive = "none";
 var gui = new dat.GUI();
 dat.GUI.toggleHide();
 var composer;

var parameters = 
{
  x: 0, y: 30, z: 0,
  bloomStrength: 1.0, bloomRadius: 1.0, bloomThreshold: 0.99,
  useShaderNone:      function() { setupShaderNone();      },
  useShaderBloom:     function() { setupShaderBloom();     },
  
};

gui.add( parameters, 'useShaderNone' ).name("Display Original Scene");
      

var folderBloom = gui.addFolder('Bloom');
var bloomStrengthGUI = folderBloom.add( parameters, 'bloomStrength' ).min(0.0).max(2.0).step(0.01).name("Strength").listen();
bloomStrengthGUI.onChange(
  function(value){   setupShaderBloom();   }
);
var bloomRadiusGUI = folderBloom.add( parameters, 'bloomRadius' ).min(0.0).max(5.0).step(0.01).name("Radius").listen();
bloomRadiusGUI.onChange(
  function(value){   setupShaderBloom();   }
);
  var bloomThresholdGUI = folderBloom.add( parameters, 'bloomThreshold' ).min(0).max(0.99).step(0.01).name("Threshold").listen();
bloomThresholdGUI.onChange(
  function(value){   setupShaderBloom();   }
);
folderBloom.add( parameters, 'useShaderBloom' ).name("Use Bloom Shader");
folderBloom.open();


//===================================================== functions

function setupShaderNone(){
  shaderActive = "none";
}

function setupShaderBloom(){
  composer = new THREE.EffectComposer( renderer );
  composer.addPass( new THREE.RenderPass( scene, camera ) );
  
  /*unreal bloom*/
  var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
  effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight );

  var copyShader = new THREE.ShaderPass(THREE.CopyShader);
  copyShader.renderToScreen = true;

  var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight),parameters.bloomStrength, parameters.bloomRadius, parameters.bloomThreshold);
  
  composer = new THREE.EffectComposer(renderer);
  composer.setSize(window.innerWidth, window.innerHeight);
  composer.addPass(renderScene);
  composer.addPass(effectFXAA);
  composer.addPass(bloomPass);
  composer.addPass(copyShader);
  shaderActive = "bloom";

}



function isShaderActive(){
  if ( shaderActive == "none" ){
    renderer.render( scene, camera );
  }
  else{
    composer.render();
  }
}


//activate bloom on load
 setupShaderBloom();




//===================================================== add Animation
var percentage = 0;
var time = 0;
var prevTime = Date.now();


//position objects on spline curve
function POV(){
    percentage += 0.0009;
    time += 0.05;
    var p1 = curvePath.getPointAt(percentage%1);
    var p2 = curvePath.getPointAt((percentage + 0.01)%1);

    drone.position.set(p1.x, 0 ,p1.z);
    drone.position.y = 2 + Math.cos(time) * 1;
    drone.lookAt(p2);

  //VR
  if(VR){
    camera.position.z = drone.position.z - 5;
    camera.position.x = drone.position.x;
    camera.position.y =  3;
    camera.lookAt(drone.position);
  }else{
    camera.position.z = drone.position.z - 10;
    camera.position.x = 0;
    camera.position.y = 5;
    camera.lookAt(p2);
  }

  //add light to the front of the drone
  light.position.set(p2.x, p2.y, p2.z);
}





var percentage = 0;
function animate() {

  requestAnimationFrame(animate);
  POV();
   
  //VR
  if(VR){
    effect.render(scene, camera);
  }else{
    isShaderActive();
  }
  controls.update();
}

animate();