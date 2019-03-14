var renderer, controls,scene, camera, light;

var waterSettings = {
  base: 0.001,
  size: {
    x: 8,
    y: 0,
    z: 8
  },
  maxValue: 8,
  selected: 0,
  level: 1,
  slosh: 0,
  sloshRange: [0.5, 0.5],
  sections: 10,
  range: 0.05,
  ranges: [0.06, 0.05],
  spaceBetween: 20,
  speed: 0.05
}

var timeline = new TimelineMax();
var sloshAnimation = new TimelineMax();

var waterBlocks = [{
  title: 'One'
}];

function init() {
  // renderer

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x222428, 1);
  document.body.appendChild(renderer.domElement);

  // scene

  scene = new THREE.Scene();

  // camera
  
  var aspect = window.innerWidth / window.innerHeight;
  var d = 10;
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
  controls = new THREE.OrbitControls(camera);
  camera.position.set(20, 20, 20);
  controls.update();
  
  // materials

  var waterSides = new THREE.MeshPhongMaterial({
    color: 0x4DBFE1,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
    shading: THREE.FlatShading,
    specular: 0x4DBFE1,
    shininess: 5,
  });

  var waterTop = new THREE.MeshPhongMaterial({
    color: 0x14435C,
    side: THREE.DoubleSide,
    shading: THREE.FlatShading,
    transparent: true,
    opacity: 0.9,
    specular: 0xFFFFFF,
    shininess: 10,
  });

  var materials = [waterSides, waterSides, waterTop, waterSides, waterSides, waterSides];

  
  //light
  
  light = new THREE.PointLight(0xffffff, 2, 600, 5);
  light.position.set(waterSettings.size.x + 1.5, waterSettings.maxValue * 2, (waterSettings.size.z + 1) - (waterSettings.spaceBetween * waterSettings.selected));
  scene.add(light);
  
  //grid 

  var grid = new THREE.GridHelper(200, 2);
  grid.setColors(0x2B2A2F, 0x2B2A2F);
  scene.add(grid);

  // water blocks

  for (var j = 0; j < waterBlocks.length; j++) 
  {
    var group = new THREE.Group();

    waterBlocks[j].group = group;
    waterBlocks[j].water = null;
    waterBlocks[j].waterMesh = null;
    waterBlocks[j].sloshOffsets = [];
    waterBlocks[j].topVertices = [];
    waterBlocks[j].angles = [];

    //floor

    var floorGeometry = new THREE.BoxGeometry(waterSettings.size.x, 0.5, waterSettings.size.z);
    floorGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.25, 0));

    var floor = new THREE.Mesh(
      floorGeometry,
      new THREE.MeshLambertMaterial({
        color: 0x333333
      })
    );
    floor.position.y = 0;
    floor.position.x = 0;
    floor.position.z = 0;

    group.add(floor);
    
    //sphere
    
     var geometry = new THREE.SphereGeometry( 2, 15, 15 );
    var material = new THREE.MeshLambertMaterial( {color: 0xff5555} );
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.y = 5;
    group.add( sphere ); 

    // geometry
    waterBlocks[j].water = new THREE.BoxGeometry(waterSettings.size.x, waterSettings.maxValue, waterSettings.size.z, waterSettings.sections, 1, waterSettings.sections);
    
    var count = 0;
    var pos = 0 - Math.floor(waterSettings.sections / 2);
    var zeds = [];

    for (var i = waterBlocks[j].water.vertices.length - 1; i >= 0; i--) {

      if (waterBlocks[j].water.vertices[i].y >= (waterSettings.maxValue / 2)) 
      {
        waterBlocks[j].topVertices.push(waterBlocks[j].water.vertices[i]); 
        zeds.push(waterBlocks[j].water.vertices[i].z)
        waterBlocks[j].angles.push(count + waterSettings.speed + (Math.random()*2));
        waterBlocks[j].sloshOffsets.push( Math.random() / 2);
        count++;
      }
    };

    zeds = _.uniq(zeds);
    zeds.sort(function(a, b) 
    {
      return a - b
    });

    for (var i = waterBlocks[j].topVertices.length - 1; i >= 0; i--) 
    {
      waterBlocks[j].topVertices[i].zPos = zeds.indexOf(waterBlocks[j].topVertices[i].z) - Math.floor(zeds.length / 2);
    }

    waterBlocks[j].water.applyMatrix(new THREE.Matrix4().makeTranslation(0, (waterSettings.maxValue / 2) - waterSettings.base, 0));

    // mesh
    waterBlocks[j].waterMesh = new THREE.Mesh(waterBlocks[j].water, new THREE.MeshFaceMaterial(materials));
    waterBlocks[j].waterMesh.position.y = 0.51;
    waterBlocks[j].waterMesh.position.x = 0;
    waterBlocks[j].waterMesh.position.z = 0;
    group.add(waterBlocks[j].waterMesh);
    
    waterBlocks[j].wireframe = new THREE.WireframeHelper( waterBlocks[j].waterMesh, 0x00ff00 );
    //group.add(waterBlocks[j].wireframe);

    scene.add(group);

    group.position.z = 0 - j * waterSettings.spaceBetween;
  };
}

function render() {
  controls.update();
  renderer.render(scene, camera);
}

function animate() {
  // 


  requestAnimationFrame(animate);

  for (var i = 0; i < waterBlocks.length; i++) 
  {
    waterBlocks[i].waterMesh.scale.y = waterSettings.size.y / 100;

    for (var j = waterBlocks[i].topVertices.length - 1; j >= 0; j--) 
    {
      var sloshAmount = waterBlocks[i].topVertices[j].zPos * waterSettings.slosh * waterBlocks[i].sloshOffsets[j];
      waterBlocks[i].topVertices[j].y = sloshAmount + (waterSettings.maxValue + Math.sin(waterBlocks[i].angles[j]) * waterSettings.range);
      waterBlocks[i].angles[j] += waterSettings.speed; 
    }

    waterBlocks[i].water.verticesNeedUpdate = true;
  }
   
  render();
}

function next()
{
  var toSelect = waterSettings.selected + 1;
  if(toSelect >= waterBlocks.length) toSelect = 0;
  selectBlock(toSelect, waterSettings.selected);
}

function prev()
{
  var toSelect = waterSettings.selected - 1;
  if(toSelect < 0) toSelect = waterBlocks.length - 1;
  selectBlock(toSelect, waterSettings.selected);
}

function selectBlock(newPos, oldPos) 
{
  waterSettings.selected = newPos;
  var targetSlosh = 0;
  var sloshAmount = (((waterSettings.sloshRange[0] - waterSettings.sloshRange[1]) / 100) * (100 - waterSettings.size.y)) + waterSettings.sloshRange[1]
  if (newPos > oldPos) targetSlosh = -sloshAmount
  else if (newPos < oldPos) targetSlosh = sloshAmount

  sloshAnimation.clear()
  sloshAnimation.append(TweenMax.to(waterSettings, 0.4, {
    slosh: targetSlosh,
    ease: Power2.easeIn
  }));
  sloshAnimation.append(TweenMax.to(waterSettings, 2.5, {
    slosh: 0,
    ease: Elastic.easeOut
  }));
  sloshAnimation.restart();

  TweenMax.to(sceneSettings, 1, {
    cameraZ: 0 - (waterSettings.spaceBetween * newPos),
    ease: Power4.easeInOut
  });
  TweenMax.to(light.position, 1, {
    z: (waterSettings.size.z + 0.5) - (waterSettings.spaceBetween * waterSettings.selected),
    ease: Power4.easeInOut
  });
}

function setWaterLevel(percent) 
{
  waterSettings.oldlevel = waterSettings.level;
  
  var level = (waterSettings.maxValue / 100) * percent;
  var p = percent == 100 ? 105 : percent;
  TweenLite.to(waterSettings.size, 0.5, {
    y: level > 0.5 ? p : ((0.5 / waterSettings.maxValue) * 100),
    ease: Power2.easeInOut
  });

  var diff = percent - waterSettings.level;
  var disturbAmount = (diff / 100) * 0.5;
  timeline.clear()
  var r = (((waterSettings.ranges[0] - waterSettings.ranges[1]) / 100) * (100 - waterSettings.size.y)) + waterSettings.ranges[1]
  timeline.append(TweenMax.to(waterSettings, 0.5, {
    range: r + disturbAmount,
    ease: Power2.easeIn
  }));
  timeline.append(TweenMax.to(waterSettings, 2.5, {
    range: r,
    ease: Elastic.easeOut
  }));
  
  timeline.restart();
  
  waterSettings.level = percent;
}

function randomHeight()
{
  setWaterLevel(Math.random() * 100);
}

init();
render();
animate();
setWaterLevel(100);

window.addEventListener( 'resize', function () 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
}, true );