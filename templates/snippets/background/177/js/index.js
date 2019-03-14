//===================================================== full screen
var requestFullscreen = function(ele) {
  if (ele.requestFullscreen) {
    ele.requestFullscreen();
  } else if (ele.webkitRequestFullscreen) {
    ele.webkitRequestFullscreen();
  } else if (ele.mozRequestFullScreen) {
    ele.mozRequestFullScreen();
  } else if (ele.msRequestFullscreen) {
    ele.msRequestFullscreen();
  } else {
    console.log("Fullscreen API is not supported.");
  }
};
var exitFullscreen = function(ele) {
  if (ele.exitFullscreen) {
    ele.exitFullscreen();
  } else if (ele.webkitExitFullscreen) {
    ele.webkitExitFullscreen();
  } else if (ele.mozCancelFullScreen) {
    ele.mozCancelFullScreen();
  } else if (ele.msExitFullscreen) {
    ele.msExitFullscreen();
  } else {
    console.log("Fullscreen API is not supported.");
  }
};

//Add Tweening
//=====================================================
Object.defineProperties(THREE.Object3D.prototype, {
  x: {
    get: function() {
      return this.position.x;
    },
    set: function(v) {
      this.position.x = v;
    }
  },
  y: {
    get: function() {
      return this.position.y;
    },
    set: function(v) {
      this.position.y = v;
    }
  },
  z: {
    get: function() {
      return this.position.z;
    },
    set: function(v) {
      this.position.z = v;
    }
  },
  rotationX: {
    get: function() {
      return this.rotation.x;
    },
    set: function(v) {
      this.rotation.x = v;
    }
  },
  rotationY: {
    get: function() {
      return this.rotation.y;
    },
    set: function(v) {
      this.rotation.y = v;
    }
  },
  rotationZ: {
    get: function() {
      return this.rotation.z;
    },
    set: function(v) {
      this.rotation.z = v;
    }
  }
});

var randnum = (min, max) => Math.round(Math.random() * (max - min) + min);

//===================================================== add Scene
var scene = new THREE.Scene();
//===================================================== add Camera
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  10000
);

//===================================================== add GLow
var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMapEnabled = true; //Shadow
renderer.shadowMapSoft = true; // Shadow
renderer.shadowMapType = THREE.PCFShadowMap; //Shadow
document.body.appendChild(renderer.domElement);

//===================================================== add controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2.1;

//===================================================== add VR
renderer.setPixelRatio(window.devicePixelRatio); //VR
effect = new THREE.StereoEffect(renderer); //VR
effect.setSize(window.innerWidth, window.innerHeight); //VR

var VR = false;
function toggleVR() {
  if (VR) {
    VR = false;
    controls = new THREE.OrbitControls(camera, renderer.domElement);
  } else {
    VR = true;
    controls = new THREE.DeviceOrientationControls(camera);
    requestFullscreen(document.documentElement);
  }
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//===================================================== resize
window.addEventListener("resize", function() {
  let width = window.innerWidth;
  let height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

//===================================================== add plane
THREE.ImageUtils.crossOrigin = "";
var floorMap = THREE.ImageUtils.loadTexture(
  "../images/image.jpg"
);
floorMap.wrapS = floorMap.wrapT = THREE.RepeatWrapping;
floorMap.repeat.set(20, 20);

var groundMaterial = new THREE.MeshPhongMaterial({
  color: new THREE.Color("#4d3b29"),
  specular: new THREE.Color("#444"),
  shininess: 10,
  bumpMap: floorMap
});
var groundGeo = new THREE.PlaneGeometry(2000, 2000);
var ground = new THREE.Mesh(groundGeo, groundMaterial);

ground.position.set(0, 0, 0);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

//===================================================== store all fbx animations in array
var mixers = [];

//===================================================== add model
//3d model from https://truebones.com/free-demos
var loader = new THREE.FBXLoader();
loader.load(
  "Pigeon-IdleLoop.fbx",
  function(object) {
    object.mixer = new THREE.AnimationMixer(object);
    mixers.push(object.mixer);

    var action = object.mixer.clipAction(object.animations[0]);
    action.play();

    object.traverse(function(child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.scale.set(3, 3, 3);
      }
    });

    object.position.set(50, 0, 0);
    scene.add(object);
  }
);

//===================================================== add Model

var tree;
loader = new THREE.LegacyJSONLoader();
loader.load(
  "https://raw.githubusercontent.com/baronwatts/models/master/real-tree3.js",
  function(geometry, materials) {
    var matt = new THREE.MeshLambertMaterial({
      vertexColors: THREE.FaceColors,
      side: THREE.DoubleSide,
      color: new THREE.Color("white")
    });
    tree = new THREE.Mesh(geometry, matt);
    tree.castShadow = true;

    tree.scale.set(10, 10, 10);
    tree.position.set(0, 0, 0);
    scene.add(tree);

    /*  for (var x = 0; x < 2; x++) {
     for (var z = 0; z < 10; z++) {
        var matt = new THREE.MeshLambertMaterial({ vertexColors: THREE.FaceColors, side:THREE.DoubleSide, color: new THREE.Color( "white" ) });
        tree = new THREE.Mesh(geometry, matt);
        tree.recieveShadow = true;

        tree.scale.set(10,10,10);
        tree.position.set( (x * 200) - 25, 0, (z * -100));
        scene.add(tree );
    }
  }
*/
  }
);

//===================================================== add model
var leafs = [];
var leafGroup = new THREE.Group();
scene.add(leafGroup);
loader = new THREE.LegacyJSONLoader();
loader.load(
  "https://raw.githubusercontent.com/baronwatts/models/master/single-leaf.js",
  function(geometry, materials) {
    //create leafs
    new Array(300).fill(null).map((d, i) => {
      var matt = new THREE.MeshPhongMaterial({
        vertexColors: THREE.FaceColors,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide
      });
      var particle = new THREE.Mesh(geometry, matt);
      particle.position.set(randnum(-15, 15), 125, randnum(-15, 15));
      particle.scale.set(8, 8, 8);
      particle.rotateY(Math.random() * 180);
      particle.castShadow = true;
      leafGroup.add(particle);
      leafs.push(particle);
    });

    leafs.map((d, i) => {
      //position
      if (i % 2 == 0) {
        leafs[i].position.x = randnum(-50, randnum(50, 100));
        leafs[i].position.y = 0;
        leafs[i].position.z = randnum(-50, randnum(50, 100));
      } else {
        TweenMax.to(
          leafs[i].position,
          10,
          {
            y: 0,
            x: randnum(-50, randnum(50, 100)),
            z: randnum(-50, randnum(50, 100)),
            ease: Power2.Linear,
            delay: 0.025 * i,
            repeat: -1
          },
          1
        );
      }
      //rotation
      if (i % 2 == 0) {
        leafs[i].rotation.y = 0;
      } else {
        TweenMax.to(
          leafs[i],
          10,
          {
            rotationX: Math.random() >= 0.75 ? "+=25" : 0,
            //rotationZ: "+=25",
            ease: Power2.Linear,
            delay: 0.025 * i,
            repeat: -1
          },
          1
        );
      }
    }); //end leafs
  }
);

//=========================================================================================== model
loader = new THREE.LegacyJSONLoader();
loader.load(
  "https://raw.githubusercontent.com/baronwatts/models/master/mountain.js",
  function(geometry, materials) {
    //===================================================== add plane
    THREE.ImageUtils.crossOrigin = "";
    var floorMap = THREE.ImageUtils.loadTexture(
      "../images/image.jpg"
    );
    floorMap.wrapS = floorMap.wrapT = THREE.RepeatWrapping;
    floorMap.repeat.set(5, 5);
    //floorMap.anisotropy = renderer.getMaxAnisotropy(); //makes texture less blurry

    var matt = new THREE.MeshPhongMaterial({
      color: new THREE.Color("#4d3b29"),
      specular: new THREE.Color("#504337"),
      shininess: 0,
      bumpMap: floorMap
    });
    var wall = new THREE.Mesh(geometry, matt);
    wall.position.set(0, 50, 300);
    wall.scale.set(2000, 2000, 2000);
    //wall.rotateY(-Math.PI/4)
    scene.add(wall);
  }
);

//===================================================== add light to genrerate shadows
var light = new THREE.DirectionalLight(new THREE.Color("#666"));
light.position.set(0, 200, 100);
light.castShadow = true;
light.shadow.camera.top = 180;
light.shadow.camera.bottom = -100;
light.shadow.camera.left = -120;
light.shadow.camera.right = 120;
scene.add(light);

//===================================================== add a small sphere simulating the pointlight
var sphereLight = new THREE.SphereGeometry(1);
var sphereLightMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color("white")
});
var sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
sphereLightMesh.castShadow = true;

sphereLightMesh.position = new THREE.Vector3(3, 0, 3);
scene.add(sphereLightMesh);

var pointColor = "white";
var pointLight = new THREE.PointLight(pointColor);
pointLight.distance = 200;
scene.add(pointLight);

//===================================================== animate model
var clock = new THREE.Clock();
function animateFBX() {
  if (mixers.length > 0) {
    for (var i = 0; i < mixers.length; i++) {
      mixers[i].update(clock.getDelta());
    }
  } //end mixer
}

//================================================== add Animation
let phase = 0;
function animate() {
  requestAnimationFrame(animate);
  animateFBX();

  // move the light with the spere
  phase += 0.03;
  sphereLightMesh.position.z = Math.cos(phase) * 30;
  sphereLightMesh.position.x = Math.sin(phase) * 30;
  sphereLightMesh.position.y = 65;
  pointLight.position.copy(sphereLightMesh.position);

  //VR
  if (VR) {
    effect.render(scene, camera);
    camera.position.x = 0;
  } else {
    renderer.render(scene, camera);
    camera.position.x = Math.cos(phase / 4) * 150;
  }

  controls.update();
}

animate();

//===================================================== position camera
camera.position.z = -150;
camera.position.y = 50;
camera.position.x = 0;